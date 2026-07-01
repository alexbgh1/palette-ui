const LS_KEY = "palette-ui-state";
const LS_UI_KEY = "palette-ui-prefs";

// Cache: computed once at module load. readParams/readLS/paramsOrLS are only
// called during state init, while writeParams/writeLS run in the persistence
// effect afterwards.
const _params = new URLSearchParams(window.location.search);

// Mutable cache object - never null, always an object, so
// Object.assign always works regardless of whether localStorage
// was empty on the first module load.
const _ls: Record<string, string> = (() => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
})();

export function readParams(): Record<string, string> {
  const out: Record<string, string> = {};
  _params.forEach((v, k) => {
    out[k] = v;
  });
  return out;
}

export function writeParams(obj: Record<string, string>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== "") params.set(k, v);
  }
  const qs = params.toString();
  const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
  window.history.replaceState(null, "", url);
}

export function readLS(): Record<string, string> | null {
  return Object.keys(_ls).length > 0 ? _ls : null;
}

export function writeLS(obj: Record<string, string>) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(obj));
    Object.assign(_ls, obj);
  } catch (e) {
    console.error("Failed to write to localStorage", e);
  }
}

export function paramsOrLS(key: string, fallback: string): string {
  return _params.get(key) || _ls[key] || fallback;
}

export function writeUIPrefs(obj: Record<string, string>) {
  try {
    localStorage.setItem(LS_UI_KEY, JSON.stringify(obj));
  } catch (e) {
    console.error("Failed to write UI prefs", e);
  }
}

export function readUIPrefs(): Record<string, string> {
  try {
    const raw = localStorage.getItem(LS_UI_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
