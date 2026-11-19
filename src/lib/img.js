// Unsplash (free licence, attribution optional). Swap ids for real property photos later.
export const u = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72&fm=webp`;
export const srcSet = (id) => [480, 800, 1200, 1800].map((w) => `${u(id, w)} ${w}w`).join(', ');
