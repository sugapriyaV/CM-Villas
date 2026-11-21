import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProperties, saveProperty, removeProperty, resetProperties, useBookings, useEnquiries, cancelBooking, deleteEnquiry } from '../lib/store';
import { DESTINATIONS, TYPES, TAG_LABELS, inr } from '../data/properties';
const weekendOf = (p) => p.weekendPrice ?? p.price;
import { getEvents, clearEvents } from '../lib/analytics';
import { u } from '../lib/img';

// NOTE: front-end only login. The password is stored as a SHA-256 hash, which deters casual reading but is NOT real security.
// Move authentication to the backend (Supabase Auth) before going live.
const USER = 'cmvilla.admin', HASH = '5c5f33498750a0165a21a18f73ebf2bf65de7d2f9441edaa143fd319dc6dce08';
const sha = async (s) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))].map((b) => b.toString(16).padStart(2, '0')).join('');
const inp = 'w-full border border-primary/25 bg-white px-3 py-2.5 text-sm outline-none focus:border-gold';
const card = 'border border-primary/15 bg-white p-5';
const MAXIMG = 4;

/** Popup confirmation used for every destructive action. */
function Confirm({ title, text, yes, onYes, onNo }) {
  useEffect(() => { const k = (e) => e.key === 'Escape' && onNo(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [onNo]);
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-deep/60 px-5" onClick={onNo}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="cf-t" onClick={(e) => e.stopPropagation()} className="w-full max-w-sm bg-ivory p-7 shadow-2xl">
        <h2 id="cf-t" className="font-serif text-3xl text-primary">{title}</h2>
        <p className="mt-3 text-sm text-ink/70">{text}</p>
        <div className="mt-7 flex justify-end gap-3"><button autoFocus onClick={onNo} className="btn border border-primary/30 text-primary">Cancel</button><button onClick={onYes} className="btn bg-red-700 text-white hover:bg-red-800">{yes}</button></div>
      </div>
    </div>
  );
}

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
  const [, tick] = useState(0), [ask, setAsk] = useState(false);
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
      <button onClick={() => setAsk(true)} className="link-u text-xs text-muted">Clear analytics</button>
      {ask && <Confirm title="Clear analytics?" text="All recorded visits, searches and leads in this browser will be erased. This cannot be undone." yes="Yes, clear" onNo={() => setAsk(false)} onYes={() => { clearEvents(); setAsk(false); tick((n) => n + 1); }} />}
    </div>
  );
}

function Reports() {
  const props = useProperties(), [days, setDays] = useState(7);
  const now = Date.now(), ev = getEvents().filter((e) => !days || e.t >= now - days * 864e5);
  const pv = ev.filter((e) => e.type === 'pageview'), ct = (k) => ev.filter((e) => e.type === 'contact' && e.kind === k);
  const sum = [['Page visits', pv.length], ['Unique visitors', new Set(pv.map((e) => e.vid)).size], ['Searches', ev.filter((e) => e.type === 'search').length], ['Call clicks', ct('call').length], ['WhatsApp clicks', ct('whatsapp').length]];
  const rows = props.map((p) => { const path = `/villas/${p.slug}`; return { name: p.name, dest: p.destination, wd: p.price, we: weekendOf(p), views: pv.filter((e) => e.path === path).length, call: ct('call').filter((e) => e.path === path).length, wa: ct('whatsapp').filter((e) => e.path === path).length }; });
  const csv = () => {
    const q = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const lines = [['CM Villas report', days ? `Last ${days} days` : 'All time'], [], ['Metric', 'Value'], ...sum, [], ['Resort', 'Location', 'Weekday price', 'Weekend price', 'Page views', 'Call clicks', 'WhatsApp clicks'], ...rows.map((r) => [r.name, r.dest, r.wd, r.we, r.views, r.call, r.wa])];
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([lines.map((l) => l.map(q).join(',')).join('\n')], { type: 'text/csv' }));
    a.download = `cm-villas-report-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(a.href);
  };
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2" role="group" aria-label="Report period">{[[7, 'Last 7 days'], [30, 'Last 30 days'], [0, 'All time']].map(([d, l]) => <button key={l} onClick={() => setDays(d)} aria-pressed={days === d} className={`rounded-full px-4 py-2 text-sm ${days === d ? 'bg-primary text-ivory' : 'border border-primary/25 text-primary'}`}>{l}</button>)}</div>
        <button onClick={csv} className="btn bg-primary text-ivory hover:bg-deep">Download report (CSV)</button>
      </div>
      <div className={card}><h2 className="font-serif text-2xl text-primary">Summary</h2>
        <table className="mt-4 w-full text-sm"><tbody>{sum.map(([l, n]) => <tr key={l} className="border-t border-primary/10"><td className="py-2.5">{l}</td><td className="text-right font-medium">{n}</td></tr>)}</tbody></table></div>
      <div className={`${card} overflow-x-auto`}><h2 className="font-serif text-2xl text-primary">By resort</h2>
        <table className="mt-4 w-full min-w-[640px] text-sm"><thead><tr className="text-left text-xs text-muted">{['Resort', 'Location', 'Weekday', 'Weekend', 'Views', 'Calls', 'WhatsApp'].map((h) => <th key={h} className="pb-2 font-normal">{h}</th>)}</tr></thead>
          <tbody>{rows.map((r) => <tr key={r.name} className="border-t border-primary/10"><td className="py-2.5">{r.name}</td><td>{r.dest}</td><td>{inr(r.wd)}</td><td>{inr(r.we)}</td><td>{r.views}</td><td>{r.call}</td><td>{r.wa}</td></tr>)}</tbody></table></div>
      <p className="text-xs text-muted">Recorded in this browser only until the backend is connected.</p>
    </div>
  );
}

const BLANK = { name: '', destination: 'ECR', type: 'Resort', price: '', weekendPrice: '', beds: '', baths: '', guests: '', ac: true, tags: [], images: [], alt: '', desc: '', pool: false, amenities: [] };
const Fld = ({ id, label, err, children }) => <div><label htmlFor={id} className="mb-1.5 block text-xs text-muted">{label}</label>{children}{err && <p role="alert" className="mt-1 text-xs text-red-700">{err}</p>}</div>;

/** JPG/PNG file -> resized JPEG data URL (keeps browser storage small). */
const toDataUrl = (file) => new Promise((res, rej) => {
  const r = new FileReader();
  r.onerror = () => rej(new Error('read'));
  r.onload = () => {
    const im = new Image(); im.onerror = () => rej(new Error('decode'));
    im.onload = () => {
      const s = Math.min(1, 1600 / Math.max(im.width, im.height)), c = document.createElement('canvas');
      c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
      const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height);
      res(c.toDataURL('image/jpeg', 0.78));
    };
    im.src = r.result;
  };
  r.readAsDataURL(file);
});

function Form({ init, onClose }) {
  const [f, setF] = useState({ ...BLANK, ...init, images: init.images && init.images.length ? init.images : init.img ? [init.img] : [], weekendPrice: init.weekendPrice || init.price || '' });
  const [er, setEr] = useState({}), [busy, setBusy] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const tog = (k, v) => set(k, f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v]);
  const addFiles = async (e) => {
    const files = [...e.target.files]; e.target.value = ''; const msgs = []; const list = [...f.images]; setBusy(true);
    for (const file of files) {
      if (list.length >= MAXIMG) { msgs.push(`Only ${MAXIMG} photos are allowed.`); break; }
      if (!['image/jpeg', 'image/png'].includes(file.type)) { msgs.push(`${file.name}: only JPG or PNG files are accepted.`); continue; }
      if (file.size > 10 * 1024 * 1024) { msgs.push(`${file.name}: file is larger than 10 MB.`); continue; }
      try { list.push(await toDataUrl(file)); } catch { msgs.push(`${file.name}: could not be read.`); }
    }
    set('images', list); setBusy(false); setEr((s) => ({ ...s, img: msgs.join(' ') }));
  };
  const submit = (e) => {
    e.preventDefault(); const x = {};
    if (!f.name.trim()) x.name = 'Enter the resort name.';
    if (!(+f.price > 0)) x.price = 'Enter a weekday price above 0.';
    if (!(+f.weekendPrice > 0)) x.weekendPrice = 'Enter a weekend price above 0.';
    ['beds', 'baths', 'guests'].forEach((k) => { if (!(+f[k] >= 1)) x[k] = 'Enter 1 or more.'; });
    if (!f.images.length) x.img = 'Upload at least one JPG or PNG photo.';
    setEr(x); if (Object.keys(x).length) return;
    const id = saveProperty({ ...f, name: f.name.trim(), price: +f.price, weekendPrice: +f.weekendPrice, beds: +f.beds, baths: +f.baths, guests: +f.guests, img: f.images[0], alt: f.alt.trim() || f.name.trim() });
    if (!id) return setEr({ img: 'Could not save: browser storage is full. Remove a photo or upload smaller photos.' });
    onClose(init.id ? 'Resort updated. It is live on the website.' : 'Resort added. It is live on the website.');
  };
  return (
    <form onSubmit={submit} noValidate className={`${card} space-y-6`}>
      <h2 className="font-serif text-3xl text-primary">{init.id ? `Edit ${init.name}` : 'Add new resort'}</h2>
      <div className="grid gap-5 md:grid-cols-2">
        <Fld id="n" label="Resort name" err={er.name}><input id="n" className={inp} value={f.name} onChange={(e) => set('name', e.target.value)} /></Fld>
        <Fld id="d" label="Location"><select id="d" className={inp} value={f.destination} onChange={(e) => set('destination', e.target.value)}>{DESTINATIONS.map((d) => <option key={d}>{d}</option>)}</select></Fld>
        <Fld id="t" label="Property type"><select id="t" className={inp} value={f.type} onChange={(e) => set('type', e.target.value)}>{TYPES.map((d) => <option key={d}>{d}</option>)}</select></Fld>
        <Fld id="ac" label="Air conditioning"><select id="ac" className={inp} value={f.ac ? 'y' : 'n'} onChange={(e) => set('ac', e.target.value === 'y')}><option value="y">AC</option><option value="n">Non-AC</option></select></Fld>
        <Fld id="p" label="Weekday price per night (₹), Sunday to Thursday nights" err={er.price}><input id="p" type="number" min="1" className={inp} value={f.price} onChange={(e) => set('price', e.target.value)} /></Fld>
        <Fld id="we" label="Weekend price per night (₹), Friday and Saturday nights" err={er.weekendPrice}><input id="we" type="number" min="1" className={inp} value={f.weekendPrice} onChange={(e) => set('weekendPrice', e.target.value)} /></Fld>
        <Fld id="b" label="Bedrooms" err={er.beds}><input id="b" type="number" min="1" className={inp} value={f.beds} onChange={(e) => set('beds', e.target.value)} /></Fld>
        <Fld id="ba" label="Bathrooms" err={er.baths}><input id="ba" type="number" min="1" className={inp} value={f.baths} onChange={(e) => set('baths', e.target.value)} /></Fld>
        <Fld id="g" label="Maximum guests" err={er.guests}><input id="g" type="number" min="1" className={inp} value={f.guests} onChange={(e) => set('guests', e.target.value)} /></Fld>
        <div className="md:col-span-2">
          <p className="mb-1.5 text-xs text-muted">Photos: JPG or PNG, up to {MAXIMG}. The first photo is the cover.</p>
          <div className="flex flex-wrap gap-3">
            {f.images.map((im, i) => (
              <div key={i} className="relative">
                <img src={u(im, 300)} alt={`Photo ${i + 1}`} className="h-24 w-36 object-cover" />
                {i === 0 && <span className="absolute left-1 top-1 bg-ivory px-1.5 text-[10px] text-primary">Cover</span>}
                <div className="mt-1 flex justify-between text-xs">{i > 0 ? <button type="button" onClick={() => set('images', [im, ...f.images.filter((_, j) => j !== i)])} className="link-u">Make cover</button> : <span />}
                  <button type="button" onClick={() => set('images', f.images.filter((_, j) => j !== i))} className="link-u text-red-700">Remove</button></div>
              </div>))}
            {f.images.length < MAXIMG && <label className="flex h-24 w-36 cursor-pointer flex-col items-center justify-center border border-dashed border-primary/40 text-xs text-primary focus-within:border-gold hover:border-gold"><span>{busy ? 'Processing…' : '+ Upload photo'}</span><input type="file" accept="image/png,image/jpeg" multiple className="sr-only" onChange={addFiles} /></label>}
          </div>
          {er.img && <p role="alert" className="mt-2 text-xs text-red-700">{er.img}</p>}
        </div>
        <div className="md:col-span-2"><Fld id="al" label="Photo description (for accessibility, optional)"><input id="al" className={inp} value={f.alt} onChange={(e) => set('alt', e.target.value)} /></Fld></div>
        <div className="md:col-span-2"><Fld id="ds" label="Short description"><textarea id="ds" rows={3} className={inp} value={f.desc} onChange={(e) => set('desc', e.target.value)} /></Fld></div>
      </div>
      <fieldset><legend className="mb-3 text-xs text-muted">Experience categories</legend><div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {Object.entries(TAG_LABELS).map(([k, l]) => <label key={k} className="flex items-center gap-2"><input type="checkbox" className="accent-primary" checked={f.tags.includes(k)} onChange={() => tog('tags', k)} />{l}</label>)}</div></fieldset>
      <div className="flex gap-3"><button disabled={busy} className="btn bg-primary text-ivory hover:bg-deep disabled:opacity-60">Save resort</button><button type="button" onClick={() => onClose()} className="btn border border-primary/30 text-primary">Cancel</button></div>
    </form>
  );
}

function Manager() {
  const list = useProperties();
  const [edit, setEdit] = useState(null), [ask, setAsk] = useState(null), [note, setNote] = useState('');
  if (edit) return <Form init={edit} onClose={(m) => { setEdit(null); m && setNote(m); }} />;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-ink/70">{list.length} {list.length === 1 ? 'resort' : 'resorts'} on the website. Changes appear there straight away.</p>
        <button onClick={() => { setNote(''); setEdit({}); }} className="btn bg-primary text-ivory hover:bg-deep">+ Add new resort</button></div>
      {note && <p role="status" className="border-l-2 border-gold bg-gold/10 p-3 text-sm">{note}</p>}
      <div className={`${card} overflow-x-auto p-0`}>
        <table className="w-full min-w-[700px] text-sm"><thead><tr className="text-left text-xs text-muted"><th className="p-4 font-normal">Resort</th><th className="font-normal">Location</th><th className="font-normal">Type</th><th className="font-normal">Weekday / Weekend</th><th className="p-4 text-right font-normal">Actions</th></tr></thead>
          <tbody>{list.map((p) => (
            <tr key={p.id} className="border-t border-primary/10"><td className="p-4"><div className="flex items-center gap-3"><img src={u(p.img, 160)} alt="" className="h-11 w-16 object-cover" /><span className="font-medium text-primary">{p.name}</span></div></td>
              <td>{p.destination}</td><td>{p.type}</td><td>{inr(p.price)} / {inr(weekendOf(p))}</td>
              <td className="space-x-4 p-4 text-right"><button onClick={() => { setNote(''); setEdit(p); }} className="link-u text-primary">Edit</button>
                <button onClick={() => setAsk({ title: 'Delete this resort?', text: `${p.name} will be removed from the website. This cannot be undone.`, yes: 'Yes, delete', fn: () => { removeProperty(p.id); setNote(`${p.name} deleted. It is removed from the website.`); } })} className="link-u text-red-700">Delete</button></td></tr>))}
            {!list.length && <tr><td colSpan="5" className="p-8 text-center text-muted">No resorts yet. Add your first one.</td></tr>}</tbody></table></div>
      <button onClick={() => setAsk({ title: 'Restore sample resorts?', text: 'All current resorts will be replaced by the two sample resorts.', yes: 'Yes, restore', fn: () => { resetProperties(); setNote('Sample resorts restored.'); } })} className="link-u text-xs text-muted">Restore sample resorts</button>
      {ask && <Confirm title={ask.title} text={ask.text} yes={ask.yes} onNo={() => setAsk(null)} onYes={() => { ask.fn(); setAsk(null); }} />}
    </div>
  );
}

const fd = (s) => (s ? new Date(s + 'T00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not given');
function Bookings() {
  const bk = [...useBookings()].sort((a, b) => a.inn.localeCompare(b.inn)), eq = [...useEnquiries()].sort((a, b) => b.createdAt - a.createdAt);
  const [ask, setAsk] = useState(null);
  const th = (h) => <th key={h} className="pb-2 pr-4 font-normal">{h}</th>;
  return (
    <div className="space-y-8">
      <p className="border-l-2 border-gold bg-gold/10 p-3 text-sm text-ink/80">Bookings and enquiries from the website are saved in this browser until the backend is connected. Cancelling a booking frees its dates for other guests.</p>
      <div className={`${card} overflow-x-auto`}><h2 className="font-serif text-2xl text-primary">Bookings ({bk.length})</h2>
        <table className="mt-4 w-full min-w-[720px] text-sm"><thead><tr className="text-left text-xs text-muted">{['Resort', 'Guest', 'Mobile', 'Stay', 'Guests', 'Estimate', ''].map(th)}</tr></thead>
          <tbody>{bk.map((b) => <tr key={b.id} className="border-t border-primary/10"><td className="py-3 pr-4">{b.propertyName}</td><td className="pr-4">{b.name}</td><td className="pr-4"><a className="link-u" href={`tel:+91${b.phone}`}>{b.phone}</a></td><td className="pr-4">{fd(b.inn)} to {fd(b.out)}</td><td className="pr-4">{b.guests}</td><td className="pr-4">{inr(b.total)}</td>
            <td className="text-right"><button className="link-u text-red-700" onClick={() => setAsk({ title: 'Cancel this booking?', text: `${b.name}'s stay at ${b.propertyName} will be cancelled and the dates become available again.`, yes: 'Yes, cancel', fn: () => cancelBooking(b.id) })}>Cancel booking</button></td></tr>)}
            {!bk.length && <tr><td colSpan="7" className="py-6 text-center text-muted">No bookings yet.</td></tr>}</tbody></table></div>
      <div className={`${card} overflow-x-auto`}><h2 className="font-serif text-2xl text-primary">Enquiries ({eq.length})</h2>
        <table className="mt-4 w-full min-w-[720px] text-sm"><thead><tr className="text-left text-xs text-muted">{['Resort', 'Guest', 'Mobile', 'Dates', 'Message', ''].map(th)}</tr></thead>
          <tbody>{eq.map((q) => <tr key={q.id} className="border-t border-primary/10 align-top"><td className="py-3 pr-4">{q.propertyName}</td><td className="pr-4">{q.name}</td><td className="pr-4"><a className="link-u" href={`tel:+91${q.phone}`}>{q.phone}</a></td><td className="pr-4">{q.inn ? `${fd(q.inn)} to ${fd(q.out)}` : 'Not given'}</td><td className="max-w-[220px] pr-4">{q.message || '-'}</td>
            <td className="space-x-4 text-right"><a className="link-u text-primary" href={`https://wa.me/91${q.phone}`} target="_blank" rel="noopener noreferrer">WhatsApp</a><button className="link-u text-red-700" onClick={() => setAsk({ title: 'Delete this enquiry?', text: 'It will be removed from the list.', yes: 'Yes, delete', fn: () => deleteEnquiry(q.id) })}>Delete</button></td></tr>)}
            {!eq.length && <tr><td colSpan="6" className="py-6 text-center text-muted">No enquiries yet.</td></tr>}</tbody></table></div>
      {ask && <Confirm title={ask.title} text={ask.text} yes={ask.yes} onNo={() => setAsk(null)} onYes={() => { ask.fn(); setAsk(null); }} />}
    </div>
  );
}

const TABS = [['dash', 'Dashboard'], ['res', 'Resorts'], ['book', 'Bookings'], ['rep', 'Reports']];
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
        <nav aria-label="Admin" className="flex flex-wrap items-center gap-6 text-sm">
          {TABS.map(([k, l]) => <button key={k} onClick={() => setTab(k)} aria-current={tab === k} className={`link-u ${tab === k ? 'on' : ''}`}>{l}</button>)}
          <a href="/" target="_blank" rel="noopener noreferrer" className="link-u">View website ↗</a><button onClick={out} className="link-u">Sign out</button></nav></div></header>
      <main className="mx-auto max-w-6xl px-5 py-10"><h1 className="mb-8 font-serif text-4xl text-primary">{TABS.find((t) => t[0] === tab)[1]}</h1>{tab === 'dash' ? <Dashboard /> : tab === 'res' ? <Manager /> : tab === 'book' ? <Bookings /> : <Reports />}</main>
    </div>
  );
}
