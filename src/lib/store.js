import { useSyncExternalStore } from 'react';
import { SEED } from '../data/properties';

// Persistent store (localStorage). Swap these functions for Supabase calls when the backend is connected.
const KEY = 'cmv_properties_v1';
let cache = null;
const subs = new Set();
const emit = () => subs.forEach((f) => f());
const read = () => {
  if (cache) return cache;
  try { const r = localStorage.getItem(KEY); cache = r ? JSON.parse(r) : SEED; } catch { cache = SEED; }
  return cache;
};
const write = (list) => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { return false; } cache = list; emit(); return true; };
if (typeof window !== 'undefined') window.addEventListener('storage', (e) => { if (e.key === KEY) { cache = null; emit(); } });

export const subscribe = (f) => { subs.add(f); return () => subs.delete(f); };
export const useProperties = () => useSyncExternalStore(subscribe, read);
export const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export function saveProperty(p) {
  const list = read();
  if (p.id && list.some((x) => x.id === p.id)) return write(list.map((x) => (x.id === p.id ? { ...x, ...p } : x))) ? p.id : null;
  const base = slugify(p.name) || 'resort'; let s = base, n = 2;
  while (list.some((x) => x.slug === s)) s = `${base}-${n++}`;
  return write([...list, { ...p, id: s, slug: s, demo: false }]) ? s : null;
}
export const removeProperty = (id) => write(read().filter((x) => x.id !== id));
export const resetProperties = () => write(SEED);
