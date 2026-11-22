// Accepts an Unsplash photo id OR a full image URL (used as-is).
const isUrl = (s) => /^(https?:|data:|\/)/.test(s);
export const u = (id, w = 900) => (isUrl(id) ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72&fm=webp`);
export const srcSet = (id) => (isUrl(id) ? undefined : [480, 800, 1200, 1800].map((w) => `${u(id, w)} ${w}w`).join(', '));
