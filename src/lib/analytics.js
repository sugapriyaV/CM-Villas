// First-party analytics kept in this browser's localStorage. Replace with a Supabase insert for site-wide numbers.
const K = 'cmv_events_v1';
const vid = () => { try { let v = localStorage.getItem('cmv_vid'); if (!v) { v = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('cmv_vid', v); } return v; } catch { return 'anon'; } };
let last = '';
export function track(type, data = {}) {
  try {
    const key = type + (data.path || '') + (data.kind || '') + Math.floor(Date.now() / 1500);
    if (key === last) return; last = key;
    const a = JSON.parse(localStorage.getItem(K) || '[]'); a.push({ t: Date.now(), type, vid: vid(), ...data });
    localStorage.setItem(K, JSON.stringify(a.slice(-5000)));
  } catch { /* ignore */ }
}
export const getEvents = () => { try { return JSON.parse(localStorage.getItem(K) || '[]'); } catch { return []; } };
export const clearEvents = () => { try { localStorage.removeItem(K); } catch { /* ignore */ } };
