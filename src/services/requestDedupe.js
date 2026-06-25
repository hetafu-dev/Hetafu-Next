/**
 * Cross-chunk request dedupe. Next.js/Turbopack can bundle the same module more
 * than once in dev, so module-level Maps do not always share state. globalThis
 * ensures one in-flight request and one cache entry per key app-wide.
 */

const STORE_KEY = '__hetafuRequestDedupe';

function getStore() {
  if (typeof globalThis === 'undefined') {
    return { inflight: new Map(), responseCache: new Map() };
  }
  if (!globalThis[STORE_KEY]) {
    globalThis[STORE_KEY] = {
      inflight: new Map(),
      responseCache: new Map(),
    };
  }
  return globalThis[STORE_KEY];
}

export function getCachedResponse(key, ttlMs) {
  const cached = getStore().responseCache.get(key);
  if (cached && Date.now() - cached.at < ttlMs) {
    return cached.data;
  }
  return null;
}

export function setCachedResponse(key, data) {
  getStore().responseCache.set(key, { data, at: Date.now() });
}

export function clearCachedResponsesByPrefix(prefix) {
  const store = getStore();
  for (const key of store.responseCache.keys()) {
    if (key.startsWith(prefix)) store.responseCache.delete(key);
  }
}

export function dedupeRequest(key, fetcher, { ttlMs = 60_000, cache = true } = {}) {
  if (cache) {
    const cached = getCachedResponse(key, ttlMs);
    if (cached !== null) return Promise.resolve(cached);
  }

  const store = getStore();
  if (store.inflight.has(key)) {
    return store.inflight.get(key);
  }

  const promise = Promise.resolve()
    .then(fetcher)
    .then((data) => {
      if (cache) setCachedResponse(key, data);
      return data;
    })
    .finally(() => {
      store.inflight.delete(key);
    });

  store.inflight.set(key, promise);
  return promise;
}
