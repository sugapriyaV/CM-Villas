import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useGsap } from '../lib/motion';
import { Lines } from '../components/common/Type';
import VillaCard from '../components/property/VillaCard';
import { AMENITIES, DESTINATIONS, PROPERTIES, TYPES, inr } from '../data/properties';

const MAXP = 30000;
const DEF = { q: '', dest: '', type: '', tag: '', max: MAXP, beds: 0, guests: 0, pool: false, ac: '', am: [], sort: 'recommended' };
const TAGS = { pool: 'Private pool', resort: 'Resorts', family: 'Family', nature: 'Nature', mountain: 'Mountain view', couple: 'Couples' };
const inp = 'w-full border border-primary/20 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors focus:border-gold';

export default function Villas() {
  const [sp] = useSearchParams();
  const [f, setF] = useState(() => ({ ...DEF, dest: sp.get('dest') || '', type: sp.get('type') || '', tag: sp.get('tag') || '', guests: +sp.get('guests') > 2 ? +sp.get('guests') : 0, pool: sp.get('pool') === '1' }));
  const [show, setShow] = useState(6), [loading, setLoading] = useState(true), [panel, setPanel] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const ref = useGsap();

  useEffect(() => { setLoading(true); setShow(6); const t = setTimeout(() => setLoading(false), 380); return () => clearTimeout(t); }, [f]);

  const list = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const r = PROPERTIES.filter((p) =>
      (!q || `${p.name} ${p.destination}`.toLowerCase().includes(q)) && (!f.dest || p.destination === f.dest) && (!f.type || p.type === f.type) &&
      (!f.tag || p.tags.includes(f.tag)) && p.price <= f.max && p.beds >= f.beds && p.guests >= f.guests && (!f.pool || p.pool) &&
      (f.ac === '' || (f.ac === 'ac') === p.ac) && f.am.every((a) => p.amenities.includes(a)));
    if (f.sort === 'low') return [...r].sort((a, b) => a.price - b.price);
    if (f.sort === 'high') return [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [f]);

  const chips = [
    f.q && ['q', `“${f.q}”`], f.dest && ['dest', f.dest], f.type && ['type', f.type], f.tag && ['tag', TAGS[f.tag]],
    f.max < MAXP && ['max', `Up to ${inr(f.max)}`], f.beds && ['beds', `${f.beds}+ bedrooms`], f.guests && ['guests', `${f.guests}+ guests`],
    f.pool && ['pool', 'Swimming pool'], f.ac && ['ac', f.ac === 'ac' ? 'AC' : 'Non-AC'], ...f.am.map((a) => ['am:' + a, a]),
  ].filter(Boolean);
  const clear = (k) => k.startsWith('am:') ? set('am', f.am.filter((a) => a !== k.slice(3))) : set(k, DEF[k]);

  const panelBody = (
    <div className="space-y-7 text-sm">
      <div><label htmlFor="f-q" className="mb-2 block text-xs text-muted">Search name or destination</label><input id="f-q" className={inp} value={f.q} onChange={(e) => set('q', e.target.value)} placeholder="e.g. Palm or Ooty" /></div>
      <div><label htmlFor="f-d" className="mb-2 block text-xs text-muted">Destination</label>
        <select id="f-d" className={inp} value={f.dest} onChange={(e) => set('dest', e.target.value)}><option value="">All destinations</option>{DESTINATIONS.map((d) => <option key={d}>{d}</option>)}</select></div>
      <div><label htmlFor="f-t" className="mb-2 block text-xs text-muted">Property type</label>
        <select id="f-t" className={inp} value={f.type} onChange={(e) => set('type', e.target.value)}><option value="">Any type</option>{TYPES.map((d) => <option key={d}>{d}</option>)}</select></div>
      <div><label htmlFor="f-p" className="mb-2 flex justify-between text-xs text-muted"><span>Price per night</span><span className="text-primary">{f.max < MAXP ? `Up to ${inr(f.max)}` : 'Any'}</span></label>
        <input id="f-p" type="range" min="5000" max={MAXP} step="500" value={f.max} onChange={(e) => set('max', +e.target.value)} className="w-full accent-primary" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label htmlFor="f-b" className="mb-2 block text-xs text-muted">Bedrooms</label><select id="f-b" className={inp} value={f.beds} onChange={(e) => set('beds', +e.target.value)}>{[0, 2, 3, 4, 6].map((n) => <option key={n} value={n}>{n ? `${n}+` : 'Any'}</option>)}</select></div>
        <div><label htmlFor="f-g" className="mb-2 block text-xs text-muted">Guests</label><select id="f-g" className={inp} value={f.guests} onChange={(e) => set('guests', +e.target.value)}>{[0, 4, 6, 8, 10, 14].map((n) => <option key={n} value={n}>{n ? `${n}+` : 'Any'}</option>)}</select></div>
      </div>
      <div><label htmlFor="f-ac" className="mb-2 block text-xs text-muted">Air conditioning</label><select id="f-ac" className={inp} value={f.ac} onChange={(e) => set('ac', e.target.value)}><option value="">Any</option><option value="ac">AC</option><option value="non">Non-AC</option></select></div>
      <fieldset><legend className="mb-3 text-xs text-muted">Amenities</legend><div className="space-y-2.5">
        <label className="flex items-center gap-3"><input type="checkbox" className="h-4 w-4 accent-primary" checked={f.pool} onChange={(e) => set('pool', e.target.checked)} />Swimming pool</label>
        {AMENITIES.filter((a) => a !== 'Swimming Pool').map((a) => (
          <label key={a} className="flex items-center gap-3"><input type="checkbox" className="h-4 w-4 accent-primary" checked={f.am.includes(a)} onChange={(e) => set('am', e.target.checked ? [...f.am, a] : f.am.filter((x) => x !== a))} />{a}</label>))}
      </div></fieldset>
    </div>
  );

  return (
    <div ref={ref}>
      <header className="bg-primary px-5 pb-16 pt-36 text-ivory md:px-10 md:pb-24 md:pt-44">
        <div className="mx-auto max-w-[1400px]">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-ivory/60"><Link to="/" className="link-u">Home</Link> / Explore Villas</nav>
          <Lines as="h1" lines={['Explore villas', 'and resorts']} className="font-serif text-[clamp(2.8rem,7vw,6.5rem)] leading-[.98]" />
          <p data-fade data-delay="0.4" className="mt-6 max-w-lg text-ivory/70">Filter by destination, size, price and amenities, then contact the owner of any stay directly.</p>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-12 md:px-10 md:py-20 lg:grid-cols-[290px_1fr] lg:gap-16">
        <aside aria-label="Filters" className="lg:sticky lg:top-28 lg:self-start">
          <button onClick={() => setPanel(!panel)} aria-expanded={panel} className="btn w-full justify-between border border-primary/25 text-primary lg:hidden">Filters{chips.length ? ` (${chips.length})` : ''}<span>{panel ? '−' : '+'}</span></button>
          <div className={`${panel ? 'mt-6 block' : 'hidden'} lg:block`}>{panelBody}</div>
        </aside>
        <section aria-label="Results">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-primary/15 pb-5">
            <p aria-live="polite" className="text-sm text-ink/70"><span className="font-medium text-primary">{loading ? '…' : list.length}</span> {list.length === 1 ? 'stay' : 'stays'} found</p>
            <div className="flex items-center gap-3 text-sm"><label htmlFor="sort" className="text-muted">Sort</label>
              <select id="sort" className="border border-primary/20 bg-transparent px-3 py-2 outline-none focus:border-gold" value={f.sort} onChange={(e) => set('sort', e.target.value)}>
                <option value="recommended">Recommended</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div>
          </div>
          {chips.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Active filters">
              {chips.map(([k, l]) => <button key={k} onClick={() => clear(k)} aria-label={`Remove filter ${l}`} className="rounded-full border border-primary/25 px-3.5 py-1.5 text-xs text-primary transition-colors hover:border-gold hover:bg-gold/15">{l} ×</button>)}
              <button onClick={() => setF(DEF)} className="link-u ml-2 text-xs text-primary">Clear all filters</button>
            </div>)}
          <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {loading ? [0, 1, 2, 3, 4, 5].map((n) => <div key={n} className="animate-pulse" aria-hidden><div className="aspect-[4/3] bg-primary/10" /><div className="mt-5 h-5 w-2/3 bg-primary/10" /><div className="mt-3 h-4 w-1/2 bg-primary/10" /></div>)
              : <AnimatePresence mode="popLayout">{list.slice(0, show).map((p, i) => (
                <motion.div key={p.id} layout initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}>
                  <VillaCard p={p} sizes="(min-width:1280px) 28vw, (min-width:640px) 45vw, 100vw" /></motion.div>))}</AnimatePresence>}
          </div>
          {!loading && list.length === 0 && (
            <div className="py-20 text-center"><h2 className="font-serif text-4xl text-primary">No stays match these filters</h2><p className="mx-auto mt-3 max-w-sm text-sm text-muted">Try widening the price, removing an amenity or choosing another destination.</p>
              <button onClick={() => setF(DEF)} className="btn mt-8 bg-primary text-ivory hover:bg-deep">Clear all filters</button></div>)}
          {!loading && list.length > show && <div className="mt-16 text-center"><button onClick={() => setShow(show + 6)} className="btn border border-primary/30 text-primary hover:bg-primary hover:text-ivory">Load more stays</button></div>}
        </section>
      </div>
    </div>
  );
}
