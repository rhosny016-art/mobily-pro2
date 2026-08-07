import { type Service, type SiteSettings } from "./siteData";
import type { Auth, User } from "firebase/auth";
import {
  readDocument,
  runCollectionQuery,
  createDocumentWithFields,
  generateDocumentId,
} from "./firebaseRest";
import { cacheGet, cacheSet, cacheDelete } from "./cache";

// ---------------------------------------------------------------------------
// Public marketing reads (site_settings, service_overrides) and public writes
// (visits, contact_requests) go through the lightweight Firestore REST client
// in ./firebaseRest with a small TTL cache — the ~700 kB Firebase JS SDK is
// never shipped to public pages anymore.
//
// The Firebase SDK is still loaded lazily via dynamic import() — but only by
// the authenticated dashboard flows (admin auth + admin CRUD) below.
// ---------------------------------------------------------------------------

let cachedAuth: Auth | null = null;

async function getFirebase() {
  const m = await import("./firebase");
  cachedAuth = m.auth;
  return m;
}

const getFirestoreApi = () => import("firebase/firestore");
const getAuthApi = () => import("firebase/auth");

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
  const currentUser = cachedAuth?.currentUser;

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo: currentUser?.providerData?.map(provider => ({
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

const SETTINGS_CACHE_KEY = "settings:default";
const SERVICES_CACHE_KEY = "service_overrides";

async function loadSiteData(): Promise<typeof import("./siteData")> {
  return import("./siteData");
}

// ---------- Settings ----------
export async function getSiteSettings(): Promise<SiteSettings> {
  const cached = cacheGet<Partial<SiteSettings>>(SETTINGS_CACHE_KEY);
  if (cached && typeof cached === "object") {
    const { DEFAULT_SETTINGS } = await loadSiteData();
    return { ...DEFAULT_SETTINGS, ...cached };
  }
  try {
    const doc = await readDocument(["site_settings", "default"]);
    const data = (doc?.data ?? doc) as Partial<SiteSettings> | null;
    if (data && typeof data === "object") {
      cacheSet(SETTINGS_CACHE_KEY, data);
      const { DEFAULT_SETTINGS } = await loadSiteData();
      return { ...DEFAULT_SETTINGS, ...data };
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (!msg.includes("client is offline") && !msg.includes("unavailable")) {
      console.warn("Using default site settings fallback:", msg);
    }
  }
  const { DEFAULT_SETTINGS } = await loadSiteData();
  return DEFAULT_SETTINGS;
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  const path = "site_settings/default";
  try {
    const [{ db }, { doc, setDoc }] = await Promise.all([getFirebase(), getFirestoreApi()]);
    const docRef = doc(db, "site_settings", "default");
    await setDoc(docRef, { data: settings }, { merge: true });
    cacheDelete(SETTINGS_CACHE_KEY);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ---------- Services ----------
type ServiceOverride = Partial<Pick<Service, "featured" | "visible" | "order" | "title" | "short" | "description">>;

export async function getServices(): Promise<Service[]> {
  const cached = cacheGet<Record<string, ServiceOverride>>(SERVICES_CACHE_KEY);
  const { SERVICES } = await loadSiteData();
  if (cached && typeof cached === "object") {
    return mergeServices(SERVICES, cached);
  }
  let overrides: Record<string, ServiceOverride> = {};
  try {
    const docs = await runCollectionQuery("service_overrides");
    overrides = {};
    for (const doc of docs) {
      const payload = (doc.data.data ?? doc.data) as ServiceOverride | undefined;
      if (doc.id && payload && typeof payload === "object") overrides[doc.id] = payload;
    }
    cacheSet(SERVICES_CACHE_KEY, overrides);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (!msg.includes("client is offline") && !msg.includes("unavailable")) {
      console.warn("Using default services fallback:", msg);
    }
  }
  return mergeServices(SERVICES, overrides);
}

function mergeServices(SERVICES: Service[], overrides: Record<string, ServiceOverride>): Service[] {
  return SERVICES.map((s) => ({ ...s, ...(overrides[s.id] || {}) })).sort((a, b) => a.order - b.order);
}

export async function getServiceById(id: string): Promise<Service | undefined> {
  const services = await getServices();
  return services.find((s) => s.id === id);
}

export async function updateService(id: string, patch: ServiceOverride): Promise<void> {
  const path = `service_overrides/${id}`;
  try {
    const [{ db }, { doc, getDoc, setDoc }] = await Promise.all([getFirebase(), getFirestoreApi()]);
    const docRef = doc(db, "service_overrides", id);
    const docSnap = await getDoc(docRef);
    const existing = docSnap.exists() ? (docSnap.data().data || {}) : {};
    const merged = { ...existing, ...patch };
    await setDoc(docRef, { data: merged }, { merge: true });
    cacheDelete(SERVICES_CACHE_KEY);
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
    const [{ db }, { collection, getDocs, query, orderBy }] = await Promise.all([getFirebase(), getFirestoreApi()]);
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

/**
 * Creates a contact request. Throws on failure so the caller can show a real
 * error state instead of a false success message.
 */
export async function addRequest(data: Omit<ContactRequest, "id" | "status" | "created_date">): Promise<void> {
  const newId = generateDocumentId();
  const newRequest: ContactRequest = {
    ...data,
    id: newId,
    status: "new",
    created_date: new Date().toISOString()
  };
  await createDocumentWithFields("contact_requests", newId, newRequest as unknown as Record<string, unknown>);
}

export async function updateRequestStatus(id: string, status: ContactRequest["status"]): Promise<void> {
  try {
    const [{ db }, { doc, updateDoc }] = await Promise.all([getFirebase(), getFirestoreApi()]);
    const docRef = doc(db, "contact_requests", id);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.warn("Failed to update request status:", error);
  }
}

export async function deleteRequest(id: string): Promise<void> {
  try {
    const [{ db }, { doc, deleteDoc }] = await Promise.all([getFirebase(), getFirestoreApi()]);
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

const LOCAL_KEYS = {
  visitorId: "dalni_visitor_id",
};

export function getVisitorId(): string {
  let id = localStorage.getItem(LOCAL_KEYS.visitorId);
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(LOCAL_KEYS.visitorId, id);
  }
  return id;
}

async function persistVisit(page: string): Promise<void> {
  const newVisit: Visit = {
    page,
    visitor_id: getVisitorId(),
    referrer: document.referrer || "",
    created_date: new Date().toISOString()
  };
  const newId = generateDocumentId();
  await createDocumentWithFields("visits", newId, newVisit as unknown as Record<string, unknown>);
}

/**
 * Fire-and-forget visit tracking. Deferred to browser idle time so analytics
 * never competes with critical rendering or interaction.
 */
export function trackVisit(page: string): void {
  if (typeof window === "undefined") return;
  const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void };
  if (typeof w.requestIdleCallback === "function") {
    w.requestIdleCallback(() => void persistVisit(page), { timeout: 5000 });
  } else {
    setTimeout(() => void persistVisit(page), 2000);
  }
}

export async function getVisits(): Promise<Visit[]> {
  try {
    const [{ db }, { collection, getDocs, query, orderBy, limit }] = await Promise.all([getFirebase(), getFirestoreApi()]);
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

/**
 * Resolves the currently signed-in admin (if any) from the real Firebase Auth
 * session. This is the ONLY source of truth for admin access — no local
 * storage flags. Firestore security rules independently enforce the same
 * email allow-list server-side.
 */
export function getAdminUser(): Promise<User | null> {
  return (async () => {
    const [{ auth }, { onAuthStateChanged }] = await Promise.all([getFirebase(), getAuthApi()]);
    const user = await new Promise<User | null>((resolve) => {
      const unsub = onAuthStateChanged(auth, (u) => {
        unsub();
        resolve(u);
      });
    });
    if (user?.email && ALLOWED_EMAILS.includes(user.email.toLowerCase())) {
      return user;
    }
    return null;
  })();
}

/** Google Sign-In for admins. Real OAuth only — there is no email-only path. */
export async function adminGoogleLogin(): Promise<boolean> {
  const [{ auth, googleProvider }, { signInWithPopup, signOut }] = await Promise.all([getFirebase(), getAuthApi()]);
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const email = result.user?.email?.toLowerCase();
    if (email && ALLOWED_EMAILS.includes(email)) {
      return true;
    }
    await signOut(auth);
    throw new Error("هذا الحساب محظور وليس لديه صلاحية الدخول للوحة التحكم.");
  } catch (err: any) {
    console.error("Google sign-in error:", err);
    throw err;
  }
}

export async function adminLogout(): Promise<void> {
  try {
    const [{ auth }, { signOut }] = await Promise.all([getFirebase(), getAuthApi()]);
    await signOut(auth);
  } catch (e) {
    console.error("Error logging out from Firebase:", e);
  }
}