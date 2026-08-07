// Small TTL cache (memory + localStorage) for public Firestore reads.
// Site settings and service overrides change rarely, so they can be served
// from cache across navigations instead of hitting the network every time.

interface CacheEntry {
  savedAt: number;
  data: unknown;
}

const MEM_TTL_MS = 5 * 60 * 1000;
const LS_TTL_MS = 30 * 60 * 1000;
const LS_PREFIX = "dalni_cache_";

const memory = new Map<string, CacheEntry>();

function storageAvailable(): boolean {
  try {
    const key = "__dalni_probe__";
    localStorage.setItem(key, "1");
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function cacheGet<T>(key: string): T | null {
  const mem = memory.get(key);
  if (mem && Date.now() - mem.savedAt < MEM_TTL_MS) {
    return mem.data as T;
  }
  if (typeof localStorage !== "undefined" && storageAvailable()) {
    try {
      const raw = localStorage.getItem(LS_PREFIX + key);
      if (!raw) return null;
      const entry = JSON.parse(raw) as CacheEntry;
      if (Date.now() - entry.savedAt < LS_TTL_MS) {
        memory.set(key, entry);
        return entry.data as T;
      }
    } catch {
      // corrupted cache entry — ignore and refetch
    }
  }
  return null;
}

export function cacheSet(key: string, data: unknown): void {
  const entry: CacheEntry = { savedAt: Date.now(), data };
  memory.set(key, entry);
  if (typeof localStorage !== "undefined" && storageAvailable()) {
    try {
      localStorage.setItem(LS_PREFIX + key, JSON.stringify(entry));
    } catch {
      // storage full or unavailable — memory cache is enough
    }
  }
}

export function cacheDelete(key: string): void {
  memory.delete(key);
  if (typeof localStorage !== "undefined" && storageAvailable()) {
    try {
      localStorage.removeItem(LS_PREFIX + key);
    } catch {
      // ignore
    }
  }
}