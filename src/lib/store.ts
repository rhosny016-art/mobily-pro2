import { DEFAULT_SETTINGS, SERVICES, type Service, type SiteSettings } from "./siteData";
import { db, auth, googleProvider } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit
} from "firebase/firestore";
import { signInWithPopup, signOut } from "firebase/auth";

const LOCAL_KEYS = {
  visitorId: "dalni_visitor_id",
  admin: "dalni_admin",
};

// ---------- Error Handling as per Firebase Skill ----------
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  const isOffline = errMsg.includes("client is offline") || errMsg.includes("unavailable");
  
  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };

  if (!isOffline) {
    console.error('Firestore Error: ', JSON.stringify(errInfo));
  } else {
    console.warn('Firestore offline notice for path:', path);
  }
  
  throw new Error(JSON.stringify(errInfo));
}

// Allowed admin emails for Google Sign-in
// Configure via VITE_ADMIN_EMAILS (comma-separated)
export const ALLOWED_EMAILS: string[] = (import.meta.env.VITE_ADMIN_EMAILS || "abdo01554671424@gmail.com")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

// ---------- Settings ----------
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const docRef = doc(db, "site_settings", "default");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { ...DEFAULT_SETTINGS, ...(data.data || {}) };
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (!msg.includes("client is offline") && !msg.includes("unavailable")) {
      console.warn("Using default site settings fallback:", msg);
    }
  }
  return DEFAULT_SETTINGS;
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  const path = "site_settings/default";
  try {
    const docRef = doc(db, "site_settings", "default");
    await setDoc(docRef, { data: settings }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ---------- Services ----------
type ServiceOverride = Partial<Pick<Service, "featured" | "visible" | "order" | "title" | "short" | "description">>;

export async function getServices(): Promise<Service[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "service_overrides"));
    const overrides: Record<string, ServiceOverride> = {};
    querySnapshot.forEach((docSnap) => {
      overrides[docSnap.id] = docSnap.data().data as ServiceOverride;
    });
    return SERVICES.map((s) => ({ ...s, ...(overrides[s.id] || {}) })).sort((a, b) => a.order - b.order);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (!msg.includes("client is offline") && !msg.includes("unavailable")) {
      console.warn("Using default services fallback:", msg);
    }
    return [...SERVICES].sort((a, b) => a.order - b.order);
  }
}

export async function getServiceById(id: string): Promise<Service | undefined> {
  const services = await getServices();
  return services.find((s) => s.id === id);
}

export async function updateService(id: string, patch: ServiceOverride): Promise<void> {
  const path = `service_overrides/${id}`;
  try {
    const docRef = doc(db, "service_overrides", id);
    const docSnap = await getDoc(docRef);
    const existing = docSnap.exists() ? (docSnap.data().data || {}) : {};
    const merged = { ...existing, ...patch };
    await setDoc(docRef, { data: merged }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function swapServiceOrder(idA: string, idB: string): Promise<void> {
  const list = await getServices();
  const a = list.find((s) => s.id === idA);
  const b = list.find((s) => s.id === idB);
  if (!a || !b) return;
  await updateService(idA, { order: b.order });
  await updateService(idB, { order: a.order });
}

// ---------- Contact Requests ----------
export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: "new" | "contacted" | "closed";
  created_date: string;
}

export async function getRequests(): Promise<ContactRequest[]> {
  try {
    const q = query(collection(db, "contact_requests"), orderBy("created_date", "desc"));
    const querySnapshot = await getDocs(q);
    const requests: ContactRequest[] = [];
    querySnapshot.forEach((docSnap) => {
      requests.push({
        id: docSnap.id,
        ...docSnap.data()
      } as ContactRequest);
    });
    return requests;
  } catch (error) {
    console.warn("Failed to fetch contact requests:", error);
    return [];
  }
}

export async function addRequest(data: Omit<ContactRequest, "id" | "status" | "created_date">): Promise<void> {
  try {
    const newId = doc(collection(db, "contact_requests")).id;
    const newRequest = {
      ...data,
      id: newId,
      status: "new" as const,
      created_date: new Date().toISOString()
    };
    await setDoc(doc(db, "contact_requests", newId), newRequest);
  } catch (error) {
    console.warn("Failed to add contact request:", error);
  }
}

export async function updateRequestStatus(id: string, status: ContactRequest["status"]): Promise<void> {
  try {
    const docRef = doc(db, "contact_requests", id);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.warn("Failed to update request status:", error);
  }
}

export async function deleteRequest(id: string): Promise<void> {
  try {
    const docRef = doc(db, "contact_requests", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn("Failed to delete request:", error);
  }
}

// ---------- Visits ----------
export interface Visit {
  page: string;
  visitor_id: string;
  referrer: string;
  created_date: string;
}

export function getVisitorId(): string {
  let id = localStorage.getItem(LOCAL_KEYS.visitorId);
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(LOCAL_KEYS.visitorId, id);
  }
  return id;
}

export async function trackVisit(page: string): Promise<void> {
  try {
    const newId = doc(collection(db, "visits")).id;
    const newVisit: Visit = {
      page,
      visitor_id: getVisitorId(),
      referrer: document.referrer || "",
      created_date: new Date().toISOString()
    };
    await setDoc(doc(db, "visits", newId), newVisit);
  } catch (error) {
    console.warn("Failed to track visit:", error);
  }
}

export async function getVisits(): Promise<Visit[]> {
  try {
    const q = query(collection(db, "visits"), orderBy("created_date", "desc"), limit(1000));
    const querySnapshot = await getDocs(q);
    const visits: Visit[] = [];
    querySnapshot.forEach((docSnap) => {
      visits.push(docSnap.data() as Visit);
    });
    return visits;
  } catch (error) {
    console.warn("Failed to fetch visits:", error);
    return [];
  }
}

// ---------- Admin Auth ----------
export function isAdmin(): boolean {
  // Check localstorage or active user session
  const localAdmin = localStorage.getItem(LOCAL_KEYS.admin) === "1";
  const user = auth.currentUser;
  if (user && user.email) {
    const emailLower = user.email.toLowerCase();
    if (ALLOWED_EMAILS.includes(emailLower)) {
      return true;
    }
  }
  return localAdmin;
}

export async function adminGoogleLogin(providedEmail?: string): Promise<boolean> {
  if (providedEmail) {
    const emailLower = providedEmail.trim().toLowerCase();
    if (ALLOWED_EMAILS.includes(emailLower)) {
      localStorage.setItem(LOCAL_KEYS.admin, "1");
      return true;
    } else {
      localStorage.removeItem(LOCAL_KEYS.admin);
      throw new Error("هذا الحساب محظور وليس لديه صلاحية الدخول للوحة التحكم.");
    }
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const email = result.user?.email?.toLowerCase();
    if (email && ALLOWED_EMAILS.includes(email)) {
      localStorage.setItem(LOCAL_KEYS.admin, "1");
      return true;
    } else {
      await signOut(auth);
      localStorage.removeItem(LOCAL_KEYS.admin);
      throw new Error("هذا الحساب محظور وليس لديه صلاحية الدخول للوحة التحكم.");
    }
  } catch (err: any) {
    console.error("Google sign-in error:", err);
    throw err;
  }
}

export async function adminLogout(): Promise<void> {
  localStorage.removeItem(LOCAL_KEYS.admin);
  try {
    await signOut(auth);
  } catch (e) {
    console.error("Error logging out from Firebase:", e);
  }
}
