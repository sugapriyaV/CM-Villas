import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DESTINATIONS } from '../../data/properties';
import { track } from '../../lib/analytics';

const today = () => new Date().toISOString().slice(0, 10);
const field = 'gf w-full rounded-full border border-white/20 bg-white/5 px-5 py-3.5 text-sm text-ivory outline-none transition-colors focus:border-gold [&>option]:text-ink';
export default function SearchPanel() {
  const nav = useNavigate();
  const [f, setF] = useState({ type: '', dest: '', inn: '', out: '', guests: '2' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const go = (e) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (f.type) q.set('type', f.type); if (f.dest) q.set('dest', f.dest); q.set('guests', f.guests);
    if (f.inn && f.out && f.out > f.inn) { q.set('in', f.inn); q.set('out', f.out); }
    track('search', { dest: f.dest || 'all' });
    nav(`/villas?${q}`);
  };
  return (
    <form onSubmit={go} aria-label="Find a stay" className="glass mx-auto w-full max-w-6xl rounded-[28px] p-5 text-ivory md:p-8">
      <div className="flex flex-col gap-4 border-b border-white/15 pb-5 md:flex-row md:items-end md:justify-between">
        <div className="gf"><p className="font-serif text-3xl leading-none">Luxury stays</p><p className="mt-2 text-sm text-ivory/70">Find your perfect escape.</p></div>
        <div className="gf flex gap-2" role="group" aria-label="Property type">
          {[['', 'All'], ['Resort', 'Resorts'], ['Luxury Stay', 'Luxury stays']].map(([v, l]) => (
            <button type="button" key={l} onClick={() => setF({ ...f, type: v })} aria-pressed={f.type === v}
              className={`rounded-full px-5 py-2.5 text-sm transition-colors duration-500 ${f.type === v ? 'bg-ivory text-primary' : 'border border-white/25 text-ivory/90 hover:bg-white/10'}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[['Destination', <select key="d" id="s-dest" value={f.dest} onChange={set('dest')} className={field}><option value="">All destinations</option>{DESTINATIONS.map((d) => <option key={d}>{d}</option>)}</select>, 's-dest'],
          ['Check-in', <input key="i" id="s-in" type="date" min={today()} value={f.inn} onChange={set('inn')} className={field} />, 's-in'],
          ['Check-out', <input key="o" id="s-out" type="date" min={f.inn || today()} value={f.out} onChange={set('out')} className={field} />, 's-out'],
          ['Guests', <select key="g" id="s-g" value={f.guests} onChange={set('guests')} className={field}>{[1, 2, 4, 6, 8, 10, 12].map((n) => <option key={n} value={n}>{n}+ guests</option>)}</select>, 's-g']].map(([l, el, id]) => (
          <div key={l}><label htmlFor={id} className="gf mb-2 block text-xs text-ivory/70">{l}</label>{el}</div>
        ))}
      </div>
      <button type="submit" className="gf mt-5 w-full rounded-full bg-ivory py-4 font-serif text-xl text-primary transition-colors duration-500 hover:bg-gold">Explore stays</button>
      <p className="gf mt-3 text-center text-xs text-ivory/55">Filters your options. Availability is confirmed directly with each owner.</p>
    </form>
  );
}
