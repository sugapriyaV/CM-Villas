import { useState } from 'react';
import { u, srcSet } from '../../lib/img';

/** Responsive Unsplash image: srcset, explicit dimensions, lazy loading, graceful fallback. */
export default function Img({ id, alt, w = 1200, h = 800, sizes = '100vw', eager = false, className = '' }) {
  const [bad, setBad] = useState(false);
  if (bad) return <div role="img" aria-label={alt} className={`bg-gradient-to-br from-primary to-deep ${className}`} />;
  return (
    <img src={u(id, 1200)} srcSet={srcSet(id)} sizes={sizes} alt={alt} width={w} height={h}
      loading={eager ? 'eager' : 'lazy'} fetchpriority={eager ? 'high' : undefined} decoding="async"
      onError={() => setBad(true)} className={className} />
  );
}
