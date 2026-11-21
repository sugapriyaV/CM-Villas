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

// ---- Bookings and enquiries (localStorage for now; swap for Supabase tables to share them across devices) ----
function listStore(key) {
  let c = null; const subs = new Set();
  const read = () => { if (c) return c; try { c = JSON.parse(localStorage.getItem(key) || '[]'); } catch { c = []; } return c; };
  const write = (l) => { try { localStorage.setItem(key, JSON.stringify(l)); } catch { return false; } c = l; subs.forEach((f) => f()); return true; };
  if (typeof window !== 'undefined') window.addEventListener('storage', (e) => { if (e.key === key) { c = null; subs.forEach((f) => f()); } });
  const sub = (f) => { subs.add(f); return () => subs.delete(f); };
  return { read, write, use: () => useSyncExternalStore(sub, read) };
}
const bookings = listStore('cmv_bookings_v1'), enquiries = listStore('cmv_enquiries_v1');
export const useBookings = bookings.use, useEnquiries = enquiries.use, getBookings = bookings.read;
/** Nights are [inn, out): a guest leaving on the day another arrives is allowed. Dates are YYYY-MM-DD strings. */
export const isAvailable = (pid, inn, out) => !bookings.read().some((b) => b.propertyId === pid && b.status === 'booked' && inn < b.out && out > b.inn);
export function addBooking(b) {
  if (!isAvailable(b.propertyId, b.inn, b.out)) return { ok: false, reason: 'unavailable' };
  const rec = { ...b, id: 'b' + Date.now().toString(36), status: 'booked', createdAt: Date.now() };
  return bookings.write([...bookings.read(), rec]) ? { ok: true, booking: rec } : { ok: false, reason: 'storage' };
}
export const cancelBooking = (id) => bookings.write(bookings.read().filter((b) => b.id !== id));
export const addEnquiry = (e) => enquiries.write([...enquiries.read(), { ...e, id: 'q' + Date.now().toString(36), createdAt: Date.now() }]);
export const deleteEnquiry = (id) => enquiries.write(enquiries.read().filter((q) => q.id !== id));
/** First other property that is free for the dates (and fits the guests when possible). */
export function findAlternative(all, excludeId, inn, out, guests = 1) {
  const free = all.filter((p) => p.id !== excludeId && isAvailable(p.id, inn, out));
  return free.find((p) => p.guests >= guests) || free[0] || null;
}
