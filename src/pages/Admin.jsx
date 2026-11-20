import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProperties, saveProperty, removeProperty, resetProperties } from '../lib/store';
import { DESTINATIONS, TYPES, AMENITIES, TAG_LABELS, inr } from '../data/properties';
import { getEvents, clearEvents } from '../lib/analytics';
import { u } from '../lib/img';

// NOTE: front-end only login. The password is stored as a SHA-256 hash, which deters casual reading but is NOT real security.
// Move authentication to the backend (Supabase Auth) before going live.
const USER = 'cmvilla.admin', HASH = '5c5f33498750a0165a21a18f73ebf2bf65de7d2f9441edaa143fd319dc6dce08';
const sha = async (s) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))].map((b) => b.toString(16).padStart(2, '0')).join('');
const inp = 'w-full border border-primary/25 bg-white px-3 py-2.5 text-sm outline-none focus:border-gold';
const card = 'border border-primary/15 bg-white p-5';

function Login({ onOk }) {
  const [name, setName] = useState(''), [pw, setPw] = useState(''), [err, setErr] = useState(''), [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    const lock = +sessionStorage.getItem('cmv_lock') || 0;
    if (Date.now() < lock) return setErr(`Too many attempts. Try again in ${Math.ceil((lock - Date.now()) / 1000)} seconds.`);
    setBusy(true); let ok = false;
    try { ok = name.trim() === USER && (await sha(pw)) === HASH; } catch { setBusy(false); return setErr('Sign-in needs a secure connection (HTTPS or localhost).'); }
    setBusy(false);
    if (ok) { sessionStorage.setItem('cmv_admin', '1'); sessionStorage.setItem('cmv_fail', 0); return onOk(); }
    const n = (+sessionStorage.getItem('cmv_fail') || 0) + 1; sessionStorage.setItem('cmv_fail', n);
    if (n >= 5) { sessionStorage.setItem('cmv_lock', Date.now() + 60000); sessionStorage.setItem('cmv_fail', 0); setErr('Too many attempts. Locked for 60 seconds.'); } else setErr('Incorrect username or password.');
  };
  return (
    <main className="flex min-h-screen items-center justify-center bg-primary px-5">
      <form onSubmit={submit} className="w-full max-w-sm bg-ivory p-8">
        <p className="font-serif text-4xl text-primary">CM <span className="text-xs tracking-[.4em]">VILLAS</span></p>
        <h1 className="mt-6 font-serif text-3xl text-primary">Admin sign in</h1>
        <label htmlFor="au" className="mt-6 block text-xs text-muted">Username</label>
        <input id="au" className={inp} value={name} onChange={(e) => setName(e.target.value)} autoComplete="username" autoFocus />
        <label htmlFor="ap" className="mt-4 block text-xs text-muted">Password</label>
        <input id="ap" type="password" className={inp} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" />
        {err && <p role="alert" className="mt-4 text-sm text-red-700">{err}</p>}
        <button disabled={busy} className="btn mt-6 w-full justify-center bg-primary text-ivory hover:bg-deep disabled:opacity-60">{busy ? 'Checking…' : 'Sign in'}</button>
        <Link to="/" className="link-u mt-6 text-xs text-muted">← Back to website</Link>
      </form>
    </main>
  );
}

function Dashboard() {
  const props = useProperties();
  const [, tick] = useState(0);
  useEffect(() => { const t = setInterval(() => tick((n) => n + 1), 5000); return () => clearInterval(t); }, []);
  const ev = getEvents(), now = Date.now(), DAY = 864e5;
  const pv = ev.filter((e) => e.type === 'pageview'), leads = ev.filter((e) => e.type === 'contact');
  const days = [...Array(14)].map((_, i) => { const d = new Date(now - (13 - i) * DAY); return { l: d.getDate(), n: pv.filter((e) => new Date(e.t).toDateString() === d.toDateString()).length }; });
  const max = Math.max(1, ...days.map((d) => d.n));
  const stats = [['Total visits', pv.length], ['Unique visitors', new Set(pv.map((e) => e.vid)).size], ['Visits, last 7 days', pv.filter((e) => now - e.t < 7 * DAY).length], ['Leads (call / WhatsApp clicks)', leads.length], ['Searches', ev.filter((e) => e.type === 'search').length]];
  const pages = Object.entries(pv.reduce((a, e) => ((a[e.path] = (a[e.path] || 0) + 1), a), {})).sort((a, b) => b[1] - a[1]).slice(0, 6);
  return (
    <div className="space-y-8">
      <p className="border-l-2 border-gold bg-gold/10 p-3 text-sm text-ink/80">These numbers are recorded in the browser you are using. Visits from other visitors' devices will appear once the backend (Supabase) is connected.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{stats.map(([l, n]) => <div key={l} className={card}><p className="font-serif text-5xl text-primary">{n}</p><p className="mt-2 text-xs text-muted">{l}</p></div>)}</div>
      <div className={card}><h2 className="font-serif text-2xl text-primary">Visits, last 14 days</h2>
        <div className="mt-6 flex h-48 items-stretch gap-1.5 sm:gap-2" role="img" aria-label="Bar chart of daily visits">
          {days.map((d, i) => <div key={i} title={`${d.n} visits`} className="flex h-full flex-1 flex-col"><div className="flex flex-1 items-end"><div className="w-full bg-primary" style={{ height: d.n ? `${Math.max(4, (d.n / max) * 100)}%` : '2px', opacity: d.n ? 1 : 0.2 }} /></div><span className="pt-1 text-center text-[10px] text-muted">{d.l}</span><span className="text-center text-[10px] text-primary">{d.n || ''}</span></div>)}
        </div></div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className={card}><h2 className="font-serif text-2xl text-primary">Resort performance</h2>
          <table className="mt-4 w-full text-sm"><thead><tr className="text-left text-xs text-muted"><th className="pb-2 font-normal">Resort</th><th className="pb-2 font-normal">Page views</th><th className="pb-2 font-normal">Leads</th></tr></thead>
            <tbody>{props.map((p) => <tr key={p.id} className="border-t border-primary/10"><td className="py-2.5">{p.name}</td><td>{pv.filter((e) => e.path === `/villas/${p.slug}`).length}</td><td>{leads.filter((e) => e.path === `/villas/${p.slug}`).length}</td></tr>)}</tbody></table></div>
        <div className={card}><h2 className="font-serif text-2xl text-primary">Most visited pages</h2>
          {pages.length ? <table className="mt-4 w-full text-sm"><tbody>{pages.map(([p, n]) => <tr key={p} className="border-t border-primary/10"><td className="py-2.5">{p}</td><td className="text-right">{n}</td></tr>)}</tbody></table> : <p className="mt-4 text-sm text-muted">No visits recorded yet. Open the public site in this browser and they will appear here.</p>}</div>
      </div>
      <button onClick={() => { if (window.confirm('Clear all recorded analytics in this browser?')) { clearEvents(); tick((n) => n + 1); } }} className="link-u text-xs text-muted">Clear analytics</button>
    </div>
  );
}

const BLANK = { name: '', destination: 'ECR', type: 'Resort', price: '', beds: '', baths: '', guests: '', pool: false, ac: true, tags: [], amenities: [], img: '', alt: '', desc: '' };
const Fld = ({ id, label, err, children }) => <div><label htmlFor={id} className="mb-1.5 block text-xs text-muted">{label}</label>{children}{err && <p role="alert" className="mt-1 text-xs text-red-700">{err}</p>}</div>;

function Form({ init, onClose }) {
  const [f, setF] = useState({ ...BLANK, ...init }), [er, setEr] = useState({});
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const tog = (k, v) => set(k, f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v]);
  const submit = (e) => {
    e.preventDefault(); const x = {};
    if (!f.name.trim()) x.name = 'Enter the resort name.';
    if (!(+f.price > 0)) x.price = 'Enter a nightly price above 0.';
    ['beds', 'baths', 'guests'].forEach((k) => { if (!(+f[k] >= 1)) x[k] = 'Enter 1 or more.'; });
    if (!String(f.img).trim()) x.img = 'Add an image URL or an Unsplash photo ID.';
    setEr(x); if (Object.keys(x).length) return;
    saveProperty({ ...f, name: f.name.trim(), price: +f.price, beds: +f.beds, baths: +f.baths, guests: +f.guests, img: f.img.trim(), alt: f.alt.trim() || f.name.trim(),
      amenities: [...new Set([...(f.pool ? ['Swimming Pool'] : []), ...f.amenities.filter((a) => a !== 'Swimming Pool')])] });
    onClose(init.id ? 'Resort updated. It is live on the website.' : 'Resort added. It is live on the website.');
  };
  return (
    <form onSubmit={submit} noValidate className={`${card} space-y-6`}>
      <h2 className="font-serif text-3xl text-primary">{init.id ? `Edit ${init.name}` : 'Add new resort'}</h2>
      <div className="grid gap-5 md:grid-cols-2">
        <Fld id="n" label="Resort name" err={er.name}><input id="n" className={inp} value={f.name} onChange={(e) => set('name', e.target.value)} /></Fld>
        <Fld id="d" label="Location"><select id="d" className={inp} value={f.destination} onChange={(e) => set('destination', e.target.value)}>{DESTINATIONS.map((d) => <option key={d}>{d}</option>)}</select></Fld>
        <Fld id="t" label="Property type"><select id="t" className={inp} value={f.type} onChange={(e) => set('type', e.target.value)}>{TYPES.map((d) => <option key={d}>{d}</option>)}</select></Fld>
        <Fld id="p" label="Price per night (₹)" err={er.price}><input id="p" type="number" min="1" className={inp} value={f.price} onChange={(e) => set('price', e.target.value)} /></Fld>
        <Fld id="b" label="Bedrooms" err={er.beds}><input id="b" type="number" min="1" className={inp} value={f.beds} onChange={(e) => set('beds', e.target.value)} /></Fld>
        <Fld id="ba" label="Bathrooms" err={er.baths}><input id="ba" type="number" min="1" className={inp} value={f.baths} onChange={(e) => set('baths', e.target.value)} /></Fld>
        <Fld id="g" label="Maximum guests" err={er.guests}><input id="g" type="number" min="1" className={inp} value={f.guests} onChange={(e) => set('guests', e.target.value)} /></Fld>
        <Fld id="ac" label="Air conditioning"><select id="ac" className={inp} value={f.ac ? 'y' : 'n'} onChange={(e) => set('ac', e.target.value === 'y')}><option value="y">AC</option><option value="n">Non-AC</option></select></Fld>
        <div className="md:col-span-2"><Fld id="i" label="Cover image: full URL or Unsplash photo ID" err={er.img}>
          <div className="flex gap-3"><input id="i" className={inp} value={f.img} onChange={(e) => set('img', e.target.value)} placeholder="https://… or 1571896349842-33c89424de2d" />
            {f.img && <img src={u(f.img, 160)} alt="Preview" className="h-11 w-16 shrink-0 object-cover" />}</div></Fld></div>
        <div className="md:col-span-2"><Fld id="al" label="Image description (for accessibility)"><input id="al" className={inp} value={f.alt} onChange={(e) => set('alt', e.target.value)} /></Fld></div>
        <div className="md:col-span-2"><Fld id="ds" label="Short description"><textarea id="ds" rows={3} className={inp} value={f.desc} onChange={(e) => set('desc', e.target.value)} /></Fld></div>
      </div>
      <fieldset><legend className="mb-3 text-xs text-muted">Features</legend><div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" className="accent-primary" checked={f.pool} onChange={(e) => set('pool', e.target.checked)} />Swimming pool</label>
        {AMENITIES.filter((a) => a !== 'Swimming Pool').map((a) => <label key={a} className="flex items-center gap-2"><input type="checkbox" className="accent-primary" checked={f.amenities.includes(a)} onChange={() => tog('amenities', a)} />{a}</label>)}</div></fieldset>
      <fieldset><legend className="mb-3 text-xs text-muted">Experience categories</legend><div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {Object.entries(TAG_LABELS).map(([k, l]) => <label key={k} className="flex items-center gap-2"><input type="checkbox" className="accent-primary" checked={f.tags.includes(k)} onChange={() => tog('tags', k)} />{l}</label>)}</div></fieldset>
      <div className="flex gap-3"><button className="btn bg-primary text-ivory hover:bg-deep">Save resort</button><button type="button" onClick={() => onClose()} className="btn border border-primary/30 text-primary">Cancel</button></div>
    </form>
  );
}

function Manager() {
  const list = useProperties();
  const [edit, setEdit] = useState(null), [del, setDel] = useState(null), [note, setNote] = useState('');
  if (edit) return <Form init={edit} onClose={(m) => { setEdit(null); m && setNote(m); }} />;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-ink/70">{list.length} {list.length === 1 ? 'resort' : 'resorts'} on the website. Changes appear there straight away.</p>
        <button onClick={() => { setNote(''); setEdit({}); }} className="btn bg-primary text-ivory hover:bg-deep">+ Add new resort</button></div>
      {note && <p role="status" className="border-l-2 border-gold bg-gold/10 p-3 text-sm">{note}</p>}
      <div className={`${card} overflow-x-auto p-0`}>
        <table className="w-full min-w-[640px] text-sm"><thead><tr className="text-left text-xs text-muted"><th className="p-4 font-normal">Resort</th><th className="font-normal">Location</th><th className="font-normal">Type</th><th className="font-normal">Per night</th><th className="p-4 text-right font-normal">Actions</th></tr></thead>
          <tbody>{list.map((p) => (
            <tr key={p.id} className="border-t border-primary/10"><td className="p-4"><div className="flex items-center gap-3"><img src={u(p.img, 160)} alt="" className="h-11 w-16 object-cover" /><span className="font-medium text-primary">{p.name}</span></div></td>
              <td>{p.destination}</td><td>{p.type}</td><td>{inr(p.price)}</td>
              <td className="p-4 text-right">{del === p.id ? <span className="space-x-3">Delete this resort? <button onClick={() => { removeProperty(p.id); setDel(null); setNote(`${p.name} deleted. It is removed from the website.`); }} className="font-medium text-red-700">Yes, delete</button><button onClick={() => setDel(null)}>Cancel</button></span>
                : <span className="space-x-4"><button onClick={() => { setNote(''); setEdit(p); }} className="link-u text-primary">Edit</button><button onClick={() => setDel(p.id)} className="link-u text-red-700">Delete</button></span>}</td></tr>))}
            {!list.length && <tr><td colSpan="5" className="p-8 text-center text-muted">No resorts yet. Add your first one.</td></tr>}</tbody></table></div>
      <button onClick={() => { if (window.confirm('Replace all resorts with the two sample resorts?')) { resetProperties(); setNote('Sample resorts restored.'); } }} className="link-u text-xs text-muted">Restore sample resorts</button>
    </div>
  );
}

export default function Admin() {
  const [ok, setOk] = useState(() => sessionStorage.getItem('cmv_admin') === '1'), [tab, setTab] = useState('dash');
  useEffect(() => {
    const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex,nofollow'; document.head.appendChild(m); document.title = 'CM Villas Admin';
    return () => { m.remove(); document.title = 'CM Villas | Discover. Experience. Escape.'; };
  }, []);
  if (!ok) return <Login onOk={() => setOk(true)} />;
  const out = () => { sessionStorage.removeItem('cmv_admin'); setOk(false); };
  return (
    <div className="min-h-screen bg-ivory">
      <header className="bg-primary text-ivory"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <p className="font-serif text-2xl">CM <span className="text-[10px] tracking-[.4em]">VILLAS ADMIN</span></p>
        <nav aria-label="Admin" className="flex items-center gap-6 text-sm">
          {[['dash', 'Dashboard'], ['res', 'Resorts']].map(([k, l]) => <button key={k} onClick={() => setTab(k)} aria-current={tab === k} className={`link-u ${tab === k ? 'on' : ''}`}>{l}</button>)}
          <a href="/" target="_blank" rel="noopener noreferrer" className="link-u">View website ↗</a><button onClick={out} className="link-u">Sign out</button></nav></div></header>
      <main className="mx-auto max-w-6xl px-5 py-10"><h1 className="mb-8 font-serif text-4xl text-primary">{tab === 'dash' ? 'Dashboard' : 'Manage resorts'}</h1>{tab === 'dash' ? <Dashboard /> : <Manager />}</main>
    </div>
  );
}
