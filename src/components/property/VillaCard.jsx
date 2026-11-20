import { Link } from 'react-router-dom';
import Img from '../common/Img';
import { inr } from '../../data/properties';

export default function VillaCard({ p, aspect = 'aspect-[4/3]', reveal = false, delay = 0, sizes = '(min-width:1024px) 40vw, 100vw' }) {
  const clip = reveal ? { 'data-clip': '', 'data-delay': delay } : {};
  const fade = reveal ? { 'data-fade': '', 'data-delay': delay + 0.5 } : {};
  return (
    <Link to={`/villas/${p.slug}`} className="group block" aria-label={`View ${p.name}, ${p.destination}`}>
      <div {...clip} className={`relative overflow-hidden bg-primary/10 ${aspect}`}>
        <div className="h-full w-full">
          <Img id={p.img} alt={p.alt} sizes={sizes} className="h-full w-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.07]" />
        </div>
        <span className="absolute left-3 top-3 bg-ivory/90 px-2.5 py-1 text-[11px] text-primary">{p.pool ? 'Private pool' : p.type}</span>
        <span className="absolute bottom-4 left-4 translate-y-3 text-sm text-ivory opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100">View property ↗</span>
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/50 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      </div>
      <div {...fade} className="pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl leading-tight text-primary md:text-[1.9rem]"><span className="link-u">{p.name}</span></h3>
            <p className="mt-1 text-sm text-muted">{p.destination}, {p.destination === 'Pondicherry' ? 'Puducherry' : 'Tamil Nadu'}</p>
          </div>
          <p className="shrink-0 text-right text-sm text-ink"><span className="block text-xs text-muted">From</span><span className="font-medium">{inr(p.price)}</span><span className="text-xs text-muted"> / night</span></p>
        </div>
        <p className="mt-3 text-sm text-ink/70">{p.beds} bedrooms · {p.baths} bathrooms · {p.guests} guests{p.pool ? ' · Pool' : ''}</p>
        {p.demo && <p className="mt-2 text-[11px] text-muted/80">Demo listing</p>}
      </div>
    </Link>
  );
}
