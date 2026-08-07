import firebaseConfigJson from "../../firebase-applet-config.json";

// Lightweight Firestore REST client used by *public* marketing pages.
//
// The Firebase JS SDK (~700 KB raw / ~160 KB gzip) plus its OAuth helper iframe
// machinery was previously pulled in on every public page just to read two
// collections and append a visit/request document. That code path is now
// covered here with the Firestore REST v1 API + a small TTL cache, so public
// pages ship zero Firebase bytes. The SDK is still loaded lazily on demand —
// exclusively by the authenticated dashboard flows in store.ts.
//
// Firestore security rules already allow exactly what this uses:
//   read true  on site_settings & service_overrides
//   create     on contact_requests & visits (with field guards)
// So the public API key is sufficient; no auth token is required.

const FIRESTORE_DOCS_API = "https://firestore.googleapis.com/v1";

interface RestConfig {
  apiKey: string;
  projectId: string;
  databaseId: string;
}

function readConfig(): RestConfig {
  const env = import.meta.env as Record<string, string | undefined>;
  const pick = (envKey: string, jsonKey: keyof typeof firebaseConfigJson): string => {
    const envValue = env[envKey];
    if (typeof envValue === "string" && envValue) return envValue;
    const jsonValue = firebaseConfigJson[jsonKey];
    return typeof jsonValue === "string" ? jsonValue : "";
  };
  return {
    apiKey: pick("VITE_FIREBASE_API_KEY", "apiKey"),
    projectId: pick("VITE_FIREBASE_PROJECT_ID", "projectId"),
    databaseId: pick("VITE_FIREBASE_DATABASE_ID", "firestoreDatabaseId") || "(default)",
  };
}

const restConfig = readConfig();

const documentsPath = `projects/${restConfig.projectId}/databases/${encodeURIComponent(restConfig.databaseId)}/documents`;

export interface RawDocument {
  name: string;
  fields?: Record<string, unknown>;
}

async function readJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error?.message) message = `${body.error.message} (${body.error.status ?? res.status})`;
    } catch {
      // ignore non-JSON error bodies
    }
    const err = new Error(message);
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }
  return res.json() as Promise<T>;
}

interface RawQueryResult {
  document?: RawDocument;
  deltaType?: string;
}

function toFirestoreValue(value: unknown): Record<string, unknown> {
  switch (typeof value) {
    case "string":
      return { stringValue: value };
    case "boolean":
      return { booleanValue: value };
    case "number":
      return Number.isInteger(value)
        ? { integerValue: value }
        : { doubleValue: value };
    case "object": {
      if (value === null) return { nullValue: null };
      if (Array.isArray(value)) {
        return { arrayValue: { values: value.map(toFirestoreValue) } };
      }
      const fields: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        if (val === undefined) continue;
        fields[key] = toFirestoreValue(val);
      }
      return { mapValue: { fields } };
    }
    default:
      return { stringValue: String(value) };
  }
}

function fromFirestoreValue(value: unknown): unknown {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if ("stringValue" in v) return v.stringValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("integerValue" in v) return v.integerValue === undefined ? null : Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue === undefined ? null : Number(v.doubleValue);
  if ("mapValue" in v) {
    const map = (v.mapValue as { fields?: Record<string, unknown> })?.fields ?? {};
    return fromFirestoreFields(map);
  }
  if ("arrayValue" in v) {
    const values = (v.arrayValue as { values?: unknown[] })?.values ?? [];
    return values.map(fromFirestoreValue);
  }
  return null;
}

function fromFirestoreFields(fields?: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (!fields) return out;
  for (const key of Object.keys(fields)) out[key] = fromFirestoreValue(fields[key]);
  return out;
}

/** Reads a single document. Returns its plain (converted) data or null when it does not exist. */
export async function readDocument(pathSegments: string[]): Promise<Record<string, unknown> | null> {
  if (!restConfig.apiKey) return null;
  const path = pathSegments.map(encodeURIComponent).join("/");
  const url = `${FIRESTORE_DOCS_API}/${documentsPath}/${path}?key=${restConfig.apiKey}`;
  try {
    const doc = await readJson<RawDocument>(url);
    return fromFirestoreFields(doc.fields);
  } catch (err) {
    const status = (err as { status?: number })?.status;
    if (status === 404) return null;
    throw err;
  }
}

/** Runs a simple collection query and returns the converted documents. */
export async function runCollectionQuery(collectionId: string, limit = 200): Promise<FlatDocument[]> {
  if (!restConfig.apiKey) return [];
  const url = `${FIRESTORE_DOCS_API}/${documentsPath}:runQuery?key=${restConfig.apiKey}`;
  const body = { structuredQuery: { from: [{ collectionId }], limit } };
  const results = await readJson<RawQueryResult[]>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const docs: FlatDocument[] = [];
  for (const row of results) {
    if (row.document) {
      const nameParts = (row.document.name ?? "").split("/");
      docs.push({
        id: nameParts[nameParts.length - 1],
        data: fromFirestoreFields(row.document.fields),
      });
    }
  }
  return docs;
}

export interface FlatDocument {
  id: string;
  data: Record<string, unknown>;
}

/** Creates a document with a client-provided id (mirrors the SDK's doc().id flow). */
export async function createDocumentWithFields(
  collectionId: string,
  documentId: string,
  plainData: Record<string, unknown>
): Promise<void> {
  if (!restConfig.apiKey) return;
  const url = `${FIRESTORE_DOCS_API}/${documentsPath}/${encodeURIComponent(collectionId)}?key=${restConfig.apiKey}&documentId=${encodeURIComponent(documentId)}`;
  const fields: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(plainData)) {
    fields[key] = toFirestoreValue(value);
  }
  await readJson<RawDocument>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
}

/** Mirrors the ~20-char id the Firestore SDK's doc().id helper generates. */
export function generateDocumentId(): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 20; i += 1) id += alphabet[Math.floor(Math.random() * alphabet.length)];
  return id;
}