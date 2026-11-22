import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Lines } from '../components/common/Type';
import Img from '../components/common/Img';
import { useGsap } from '../lib/motion';
import { inr, stay } from '../data/properties';
import { useProperties, useBookings, isAvailable, addBooking, addEnquiry, findAlternative } from '../lib/store';
import { track } from '../lib/analytics';

export function StagePage({ title, note }) {
  const ref = useGsap(); const { pathname } = useLocation();
  return (
    <main ref={ref} className="flex min-h-[80svh] flex-col items-center justify-center bg-ivory px-5 pb-24 pt-40 text-center">
      <Lines as="h1" lines={[title]} className="font-serif text-[clamp(2.6rem,6vw,5rem)] text-primary" />
      <p data-fade data-delay="0.3" className="mt-5 max-w-md text-muted">{note}</p>
      <p data-fade data-delay="0.4" className="mt-1 text-xs text-muted/70">{pathname}</p>
      <Link data-fade data-delay="0.5" to="/villas" className="btn mt-10 bg-primary text-ivory hover:bg-deep">Explore Villas <span className="arr">↗</span></Link>
    </main>
  );
}
export const NotFound = () => <StagePage title="Page not found" note="The page you are looking for has moved or does not exist." />;

const POINTS = [
  ['Comfortable Stays', 'Spacious and welcoming spaces designed for relaxation.'],
  ['Luxury Experience', 'Thoughtfully maintained villas with premium amenities.'],
  ['Privacy & Peace', 'Enjoy your own space away from everyday routines.'],
  ['Family-Friendly Spaces', 'Perfect for family vacations, celebrations, and group gatherings.'],
  ['Memorable Moments', 'Beautiful settings for experiences worth remembering.'],
];
const H2 = 'mt-14 font-serif text-3xl text-primary md:text-4xl';
const P = 'mt-4 text-[17px] leading-relaxed text-ink/80';
export function About() {
  const ref = useGsap();
  useEffect(() => {
    document.title = 'About CM Villas | Discover. Experience. Escape.';
    return () => { document.title = 'CM Villas | Discover. Experience. Escape.'; };
  }, []);
  return (
    <main ref={ref} className="bg-ivory px-5 pb-24 pt-32 md:px-10 md:pb-36 md:pt-40">
      <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <div data-clip className="overflow-hidden bg-primary/10 lg:sticky lg:top-28">
            <div><img src="/about-villa.jpg" width="1000" height="1421" alt="CM Villas luxury villa at twilight with a chevron-pattern gate and warm lighting" className="h-auto w-full object-cover lg:max-h-[calc(100svh-8rem)]" /></div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <Lines as="h1" lines={['About CM Villas']} className="font-serif text-[clamp(2.8rem,6vw,5.2rem)] leading-[1] text-primary" />
          <h2 data-fade className="mt-6 font-serif text-2xl leading-snug text-primary md:text-4xl">Your Perfect Escape, Where Comfort Meets Luxury</h2>
          <p data-fade className={P}>At CM Villas, we believe every getaway should be special. We offer thoughtfully designed villa stays that bring together comfort, luxury, privacy, and relaxation. Whether you're planning a family vacation, a weekend escape, or a special gathering, our villas provide the perfect setting to create unforgettable memories.</p>
          <h2 data-fade className={H2}>Our Story</h2>
          <p data-fade className={P}>CM Villas was created with a simple vision: to make every stay feel like a home away from home, with the added experience of luxury. We focus on providing welcoming spaces, spacious interiors, and a peaceful atmosphere where guests can relax, reconnect, and enjoy quality time with their loved ones.</p>
          <h2 data-fade className={H2}>What Makes Us Special</h2>
          <ul className="mt-6">
            {POINTS.map(([t, d]) => (
              <li key={t} data-fade className="flex gap-4 border-t border-primary/15 py-4 last:border-b"><span aria-hidden className="text-gold">—</span><p className="text-[17px] leading-relaxed text-ink/80"><strong className="font-medium text-primary">{t}:</strong> {d}</p></li>
            ))}
          </ul>
          <h2 data-fade className={H2}>Our Promise</h2>
          <p data-fade className={P}>At CM Villas, your comfort is our priority. We strive to make every stay smooth, enjoyable, and memorable, giving you more reasons to return.</p>
          <div data-fade className="mt-16 bg-primary p-8 text-ivory md:p-12">
            <h2 className="font-serif text-3xl md:text-4xl">Make Every Stay Special</h2>
            <p className="mt-4 max-w-xl text-ivory/80">Your next memorable getaway starts here. Discover the comfort and luxury of CM Villas and create moments that last a lifetime.</p>
            <Link to="/villas" className="btn mt-8 bg-ivory text-primary hover:bg-gold">Explore Our Villas <span className="arr">↗</span></Link>
          </div>
        </div>
      </div>
    </main>
  );
}

// ===================== shared helpers =====================
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fmt = (x) => new Date(x + 'T00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const useTitle = (t) => useEffect(() => { document.title = t; return () => { document.title = 'CM Villas | Discover. Experience. Escape.'; }; }, [t]);
const fin = 'w-full border border-primary/25 bg-white px-3 py-2.5 text-sm outline-none focus:border-gold';
/** Phone: digits only, max 10 (also strips a pasted +91 or 0). */
const digits = (v) => { let d = v.replace(/\D/g, ''); if (d.length > 10 && d.startsWith('91')) d = d.slice(2); if (d.length > 10 && d.startsWith('0')) d = d.slice(1); return d.slice(0, 10); };
/** Opens the calendar when the date field is clicked anywhere, not just on the small icon. */
const maxDay = () => { const d = new Date(); d.setFullYear(d.getFullYear() + 2); return ymd(d); };
const nextDay = (x) => { const d = new Date(x + 'T00:00'); d.setDate(d.getDate() + 1); return ymd(d); };
const Field = ({ id, label, err, ...input }) => (
  <div><label htmlFor={id} className="mb-1.5 block text-xs text-muted">{label}</label><input id={id} className={fin} {...input} />{err && <p role="alert" className="mt-1 text-xs text-red-700">{err}</p>}</div>
);

// ===================== Contact page with glowing map pins =====================
const PLACES = [
  { name: 'Kovalam VNCT Beach Boulevard', area: 'ECR', ll: [12.7885, 80.2558] }, // approximate: replace with exact coordinates
  { name: 'Kodaikanal', area: 'Kodaikanal', ll: [10.2381, 77.4892] },
];
function PinMap() {
  const el = useRef(null), mapRef = useRef(null);
  useEffect(() => {
    let dead = false, map;
    (async () => {
      const L = (await import('leaflet')).default; await import('leaflet/dist/leaflet.css');
      if (dead || !el.current) return;
      map = L.map(el.current, { scrollWheelZoom: false }); mapRef.current = map;
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
      const icon = L.divIcon({ className: '', html: '<div class="cmv-pin"><span class="ring"></span><span class="dot"></span></div>', iconSize: [22, 22], iconAnchor: [11, 11] });
      PLACES.forEach((p) => L.marker(p.ll, { icon, title: p.name }).addTo(map).bindTooltip(p.name, { permanent: true, direction: 'top', offset: [0, -14], className: 'cmv-label' }));
      map.fitBounds(PLACES.map((p) => p.ll), { padding: [80, 80] });
    })();
    return () => { dead = true; if (map) map.remove(); mapRef.current = null; };
  }, []);
  const fly = (p) => mapRef.current && mapRef.current.flyTo(p.ll, 14, { duration: 1.6 });
  const both = () => mapRef.current && mapRef.current.flyToBounds(PLACES.map((p) => p.ll), { padding: [80, 80], duration: 1.4 });
  return (
    <div>
      <div className="isolate overflow-hidden border border-primary/15"><div ref={el} className="h-[380px] w-full md:h-[560px]" role="region" aria-label="Map showing the ECR and Kodaikanal locations" /></div>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Map locations">
        {PLACES.map((p) => <button key={p.area} onClick={() => fly(p)} className="rounded-full border border-primary/25 px-4 py-2 text-sm text-primary transition-colors hover:bg-primary hover:text-ivory">{p.area}</button>)}
        <button onClick={both} className="rounded-full border border-primary/25 px-4 py-2 text-sm text-primary transition-colors hover:bg-primary hover:text-ivory">Show both</button>
      </div>
    </div>
  );
}
export function Contact() {
  const ref = useGsap(); useTitle('Contact CM Villas | Discover. Experience. Escape.');
  return (
    <main ref={ref} className="bg-ivory px-5 pb-24 pt-32 md:px-10 md:pb-36 md:pt-40">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-12 lg:gap-16">
        <div data-fade className="lg:col-span-7"><PinMap /></div>
        <div className="lg:col-span-5 lg:pt-2">
          <Lines as="h1" lines={["Let's Get", 'in Touch']} className="font-serif text-[clamp(2.8rem,5vw,4.8rem)] leading-[1] text-primary" />
          <p data-fade className="mt-6 text-[17px] leading-relaxed text-ink/80">Have questions or planning your next getaway? We're here to help you find the perfect villa for a relaxing and memorable stay. Get in touch with our team for bookings and enquiries.</p>
          <ul data-fade className="mt-10">
            {PLACES.map((p) => (
              <li key={p.area} className="flex items-start justify-between gap-4 border-t border-primary/15 py-5 last:border-b">
                <div><p className="font-serif text-2xl text-primary">{p.area}</p><p className="mt-1 text-sm text-muted">{p.name}</p></div>
                <a href={`https://www.google.com/maps/search/?api=1&query=${p.ll[0]},${p.ll[1]}`} target="_blank" rel="noopener noreferrer" className="link-u mt-2 shrink-0 text-sm text-primary">Get directions ↗</a>
              </li>))}
          </ul>
        </div>
      </div>
    </main>
  );
}

// ===================== Friendly popup character =====================
const Girl = () => (
  <svg viewBox="0 0 200 230" className="girl-bob mx-auto h-44 w-40" role="img" aria-label="A friendly girl waving at you">
    <g fill="#C6A66B">
      <path className="girl-heart" d="M160 70c-4-8-16-4-10 6l10 9 10-9c6-10-6-14-10-6z" />
      <path className="girl-heart" style={{ animationDelay: '1.3s' }} d="M38 80c-3-6-12-3-8 4l8 7 8-7c4-7-5-10-8-4z" />
    </g>
    <ellipse cx="100" cy="94" rx="53" ry="58" fill="#3a2418" />
    <circle cx="100" cy="32" r="17" fill="#3a2418" />
    <path d="M58 230c0-44 18-68 42-68s42 24 42 68z" fill="#183B32" />
    <path d="M86 163c4 10 24 10 28 0" fill="none" stroke="#C6A66B" strokeWidth="3" strokeLinecap="round" />
    <path d="M72 178c-12 8-16 28-8 42" stroke="#F2C6A0" strokeWidth="11" strokeLinecap="round" fill="none" />
    <g className="girl-wave"><path d="M130 178c16-6 28-24 28-48" stroke="#F2C6A0" strokeWidth="11" strokeLinecap="round" fill="none" /><circle cx="158" cy="126" r="9" fill="#F2C6A0" /></g>
    <rect x="91" y="132" width="18" height="26" rx="8" fill="#F2C6A0" />
    <circle cx="100" cy="94" r="42" fill="#F2C6A0" />
    <path d="M58 90c2-36 28-50 52-44 22 5 34 24 32 44-12-8-24-22-30-30-8 16-30 28-54 30z" fill="#3a2418" />
    <ellipse className="girl-eye" cx="84" cy="98" rx="4.6" ry="6.4" fill="#2b1b12" /><ellipse className="girl-eye" cx="116" cy="98" rx="4.6" ry="6.4" fill="#2b1b12" />
    <circle cx="85.6" cy="95.5" r="1.5" fill="#fff" /><circle cx="117.6" cy="95.5" r="1.5" fill="#fff" />
    <circle cx="73" cy="110" r="7" fill="#F28B9B" opacity=".45" /><circle cx="127" cy="110" r="7" fill="#F28B9B" opacity=".45" />
    <path d="M91 113c6 8 12 8 18 0" stroke="#9b3d3d" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);
function UnavailablePopup({ alt, dates, onClose }) {
  useEffect(() => { const k = (e) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [onClose]);
  return (
    <motion.div className="fixed inset-0 z-[90] flex items-center justify-center bg-deep/60 px-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div role="alertdialog" aria-modal="true" aria-labelledby="un-t" onClick={(e) => e.stopPropagation()} initial={{ scale: 0.8, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', damping: 16, stiffness: 220 }} className="w-full max-w-md rounded-[28px] bg-ivory px-7 pb-8 pt-6 text-center shadow-2xl md:px-9">
        <Girl />
        <h2 id="un-t" className="mt-3 font-serif text-[1.6rem] leading-snug text-primary md:text-3xl">
          {alt ? 'This villa is unavailable for your selected dates, but we have another beautiful villa available for you! 💛' : 'This villa is unavailable for your selected dates. Please try different dates. 💛'}
        </h2>
        <div className="mt-7 flex flex-col gap-3">
          {alt && <Link onClick={onClose} to={`/villas/${alt.slug}?in=${dates.inn}&out=${dates.out}`} className="btn justify-center bg-primary text-ivory hover:bg-deep">View {alt.name} <span className="arr">↗</span></Link>}
          <button autoFocus onClick={onClose} className="btn justify-center border border-primary/30 text-primary hover:bg-primary hover:text-ivory">Change my dates</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ===================== Book now / Enquire form =====================
function StayForm({ p, mode, init, onClose, onUnavailable }) {
  const book = mode === 'book', today = ymd(new Date());
  const [f, setF] = useState({ name: '', phone: '', email: '', message: '', inn: init.inn || '', out: init.out || '', guests: init.guests || 2 });
  const [er, setEr] = useState({}), [done, setDone] = useState(null);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const taken = book && f.inn && f.out && f.out > f.inn && !isAvailable(p.id, f.inn, f.out);
  useEffect(() => { const k = (e) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [onClose]);
  const submit = (e) => {
    e.preventDefault(); const x = {};
    const ph = f.phone.replace(/[\s-]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, '');
    if (!f.name.trim()) x.name = 'Enter your name.';
    if (!/^[6-9]\d{9}$/.test(ph)) x.phone = 'Enter a valid 10-digit Indian mobile number.';
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) x.email = 'Enter a valid email address.';
    if (book || f.inn || f.out) {
      if (!f.inn) x.inn = 'Choose a check-in date.'; else if (f.inn < today) x.inn = 'Check-in cannot be in the past.'; else if (f.inn > maxDay()) x.inn = 'Please choose a date within the next 2 years.';
      if (!f.out) x.out = 'Choose a check-out date.'; else if (f.inn && f.out <= f.inn) x.out = 'Check-out must be after check-in.'; else if (f.out > maxDay()) x.out = 'Please choose a date within the next 2 years.';
    }
    if (!(+f.guests >= 1 && +f.guests <= p.guests)) x.guests = `Choose 1 to ${p.guests} guests.`;
    setEr(x); if (Object.keys(x).length) return;
    const base = { propertyId: p.id, propertyName: p.name, name: f.name.trim(), phone: ph, inn: f.inn, out: f.out, guests: +f.guests };
    if (book) {
      const r = addBooking({ ...base, total: stay(p, f.inn, f.out).total });
      if (!r.ok) return r.reason === 'unavailable' ? onUnavailable(f.inn, f.out, +f.guests) : setEr({ form: 'Could not save the booking because browser storage is full or blocked.' });
      track('lead', { kind: 'booking', path: `/villas/${p.slug}` }); setDone(r.booking);
    } else {
      if (!addEnquiry({ ...base, email: f.email.trim(), message: f.message.trim() })) return setEr({ form: 'Could not save the enquiry because browser storage is full or blocked.' });
      track('lead', { kind: 'enquiry', path: `/villas/${p.slug}` }); setDone({ enquiry: true });
    }
  };
  return (
    <motion.div className="fixed inset-0 z-[80] flex items-end justify-center bg-deep/60 sm:items-center sm:px-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div data-lenis-prevent role="dialog" aria-modal="true" aria-labelledby="sf-t" onClick={(e) => e.stopPropagation()} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-h-[92svh] w-full max-w-lg overflow-y-auto bg-ivory p-6 shadow-2xl sm:p-8">
        {done ? (
          <div className="text-center">
            <h2 id="sf-t" className="font-serif text-3xl text-primary">{done.enquiry ? 'Enquiry sent' : 'Your dates are reserved'}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/75">{done.enquiry ? `Thank you, ${f.name.trim()}. The team will reply on your mobile number shortly.` : `${p.name}, ${fmt(done.inn)} to ${fmt(done.out)}. The team will call you on ${done.phone} to confirm the final details and payment.`}</p>
            <p className="mt-4 text-xs text-muted">Demo build: this is saved in this browser only until the live backend is connected.</p>
            <div className="mt-7 flex flex-col gap-3"><button onClick={onClose} className="btn justify-center bg-primary text-ivory hover:bg-deep">Close</button></div>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            <div className="flex items-start justify-between gap-4"><div><h2 id="sf-t" className="font-serif text-3xl text-primary">{book ? 'Book now' : 'Enquire'}</h2><p className="mt-1 text-sm text-muted">{p.name}</p></div><button type="button" onClick={onClose} aria-label="Close" className="text-2xl leading-none text-muted">×</button></div>
            <Field id="sf-n" label="Your name" err={er.name} value={f.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" />
            <Field id="sf-p" label="Mobile number" err={er.phone} type="tel" inputMode="numeric" pattern="[0-9]*" autoComplete="tel" placeholder="10-digit mobile number" value={f.phone} onChange={(e) => set('phone', digits(e.target.value))} />
            {!book && <Field id="sf-e" label="Email (optional)" err={er.email} type="email" autoComplete="email" value={f.email} onChange={(e) => set('email', e.target.value)} />}
            <div className="grid grid-cols-2 gap-3"><Field id="sf-i" label={book ? 'Check-in' : 'Check-in (optional)'} err={er.inn} type="date" min={today} value={f.inn} onChange={(e) => setF((s) => ({ ...s, inn: e.target.value, out: s.out && s.out > e.target.value ? s.out : '' }))} /><Field id="sf-o" label={book ? 'Check-out' : 'Check-out (optional)'} err={er.out} type="date" min={f.inn ? nextDay(f.inn) : today} value={f.out} onChange={(e) => set('out', e.target.value)} /></div>
            <div><label htmlFor="sf-g" className="mb-1.5 block text-xs text-muted">Guests (up to {p.guests})</label><select id="sf-g" className={fin} value={f.guests} onChange={(e) => set('guests', e.target.value)}>{Array.from({ length: p.guests }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}</select>{er.guests && <p role="alert" className="mt-1 text-xs text-red-700">{er.guests}</p>}</div>
            {!book && <div><label htmlFor="sf-m" className="mb-1.5 block text-xs text-muted">Message (optional)</label><textarea id="sf-m" rows={3} className={fin} value={f.message} onChange={(e) => set('message', e.target.value)} /></div>}
            {taken && <p role="alert" className="border-l-2 border-red-700 bg-red-50 p-3 text-sm text-red-800">These dates are already booked.</p>}
            {er.form && <p role="alert" className="text-sm text-red-700">{er.form}</p>}
            <button className="btn w-full justify-center bg-primary text-ivory hover:bg-deep">{book ? 'Confirm booking' : 'Send enquiry'}</button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// ===================== Villa details =====================
export function VillaDetails() {
  const { slug } = useParams(), [sp] = useSearchParams();
  const all = useProperties(), bookings = useBookings(), ref = useGsap();
  const p = all.find((x) => x.slug === slug);
  const [d, setD] = useState({ inn: sp.get('in') || '', out: sp.get('out') || '' }), [guests, setGuests] = useState(2);
  const [modal, setModal] = useState(null), [pop, setPop] = useState(null), [shot, setShot] = useState(0);
  useTitle(p ? `${p.name}, ${p.destination} | CM Villas` : 'Villa not found | CM Villas');
  if (!p) return <StagePage title="Villa not found" note="This villa is no longer listed. Browse the current stays instead." />;
  const today = ymd(new Date()), imgs = p.images && p.images.length ? p.images : [p.img];
  const pastIn = d.inn && d.inn < today, tooFar = (d.inn && d.inn > maxDay()) || (d.out && d.out > maxDay());
  const valid = d.inn && d.out && d.out > d.inn && !pastIn && !tooFar, est = valid ? stay(p, d.inn, d.out) : null, free = !valid || isAvailable(p.id, d.inn, d.out);
  const g = Math.min(guests, p.guests);
  const upcoming = bookings.filter((b) => b.propertyId === p.id && b.status === 'booked' && b.out > today).sort((a, b) => a.inn.localeCompare(b.inn));
  const blocked = (inn, out, gs) => { setPop({ inn, out, alt: findAlternative(all, p.id, inn, out, gs) }); };
  const bookNow = () => (valid && !free ? blocked(d.inn, d.out, g) : setModal('book'));
  const facts = [['Bedrooms', p.beds], ['Bathrooms', p.baths], ['Guests', `Up to ${p.guests}`], ['Air conditioning', p.ac ? 'AC' : 'Non-AC'], ['Type', p.type], ['Location', p.destination]];
  return (
    <main ref={ref} className="bg-ivory px-5 pb-28 pt-32 md:px-10 md:pb-36 md:pt-40">
      <div className="mx-auto max-w-[1400px]">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted"><Link to="/" className="link-u">Home</Link> / <Link to="/villas" className="link-u">Explore Villas</Link> / {p.name}</nav>
        <Lines as="h1" lines={[p.name]} className="font-serif text-[clamp(2.6rem,6vw,5.2rem)] leading-[1] text-primary" />
        <p data-fade className="mt-3 text-muted">{p.destination}, Tamil Nadu · {p.type}</p>
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div data-clip className="aspect-[4/3] overflow-hidden bg-primary/10"><div className="h-full"><Img key={shot} id={imgs[shot]} alt={shot === 0 ? p.alt : `${p.name}, photo ${shot + 1}`} w={1600} h={1200} eager sizes="(min-width:1024px) 55vw, 100vw" className="h-full w-full object-cover" /></div></div>
            {imgs.length > 1 && <div className="mt-3 grid grid-cols-4 gap-3">{imgs.map((im, i) => <button key={i} onClick={() => setShot(i)} aria-label={`Show photo ${i + 1}`} aria-current={shot === i} className={`aspect-[4/3] overflow-hidden border-2 ${shot === i ? 'border-gold' : 'border-transparent opacity-70 hover:opacity-100'}`}><Img id={im} alt="" w={400} h={300} sizes="15vw" className="h-full w-full object-cover" /></button>)}</div>}
            <h2 data-fade className="mt-12 font-serif text-3xl text-primary md:text-4xl">About this stay</h2>
            <p data-fade className="mt-4 text-[17px] leading-relaxed text-ink/80">{p.desc || `${p.name} is a ${p.type.toLowerCase()} in ${p.destination}, made for relaxed, comfortable stays.`}</p>
            <dl data-fade className="mt-8 grid grid-cols-2 gap-x-8 sm:grid-cols-3">{facts.map(([k, v]) => <div key={k} className="border-t border-primary/15 py-4"><dt className="text-xs text-muted">{k}</dt><dd className="mt-1 font-serif text-2xl text-primary">{v}</dd></div>)}</dl>
            {p.amenities && p.amenities.length > 0 && <><h2 data-fade className="mt-12 font-serif text-3xl text-primary md:text-4xl">Amenities</h2><ul data-fade className="mt-5 grid gap-x-8 gap-y-3 text-[15px] text-ink/80 sm:grid-cols-2">{p.amenities.map((a) => <li key={a} className="flex gap-3"><span aria-hidden className="text-gold">—</span>{a}</li>)}</ul></>}
            <h2 data-fade className="mt-12 font-serif text-3xl text-primary md:text-4xl">Pricing</h2>
            <table data-fade className="mt-5 w-full text-[15px]"><tbody>
              <tr className="border-t border-primary/15"><td className="py-3.5">Weekday night (Sunday to Thursday)</td><td className="text-right font-medium text-primary">{inr(p.price)}</td></tr>
              <tr className="border-y border-primary/15"><td className="py-3.5">Weekend night (Friday and Saturday)</td><td className="text-right font-medium text-primary">{inr(p.weekendPrice ?? p.price)}</td></tr></tbody></table>
            {upcoming.length > 0 && <><h2 data-fade className="mt-12 font-serif text-3xl text-primary md:text-4xl">Already booked</h2><ul data-fade className="mt-5 space-y-2 text-[15px] text-ink/80">{upcoming.map((b) => <li key={b.id}>{fmt(b.inn)} to {fmt(b.out)}</li>)}</ul></>}
          </div>
          <aside className="lg:col-span-5">
            <div className="border border-primary/15 bg-white p-6 md:p-8 lg:sticky lg:top-28">
              <p className="text-xs text-muted">From</p>
              <p className="font-serif text-4xl text-primary">{inr(p.price)}<span className="font-sans text-sm text-muted"> / night</span></p>
              <p className="mt-1 text-sm text-ink/60">Weekend nights {inr(p.weekendPrice ?? p.price)}</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div><label htmlFor="d-i" className="mb-1.5 block text-xs text-muted">Check-in</label><input id="d-i" type="date" min={today} className={fin} value={d.inn} onChange={(e) => setD({ inn: e.target.value, out: d.out && d.out > e.target.value ? d.out : '' })} /></div>
                <div><label htmlFor="d-o" className="mb-1.5 block text-xs text-muted">Check-out</label><input id="d-o" type="date" min={d.inn ? nextDay(d.inn) : today} className={fin} value={d.out} onChange={(e) => setD({ ...d, out: e.target.value })} /></div>
              </div>
              <div className="mt-3"><label htmlFor="d-g" className="mb-1.5 block text-xs text-muted">Guests</label><select id="d-g" className={fin} value={g} onChange={(e) => setGuests(+e.target.value)}>{Array.from({ length: p.guests }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}</select></div>
              {pastIn && <p role="alert" className="mt-3 text-xs text-red-700">Check-in cannot be in the past.</p>}
              {tooFar && <p role="alert" className="mt-3 text-xs text-red-700">Please choose dates within the next 2 years.</p>}
              {valid && <div aria-live="polite" className="mt-5 border-t border-primary/15 pt-4 text-sm">
                <p className="flex justify-between"><span>{est.n} {est.n === 1 ? 'night' : 'nights'}, estimate</span><span className="font-medium text-primary">{inr(est.total)}</span></p>
                <p className={`mt-2 ${free ? 'text-primary' : 'text-red-700'}`}>{free ? 'Available for your dates.' : 'Already booked for your dates.'}</p></div>}
              <div className="mt-6 grid gap-3">
                <button onClick={bookNow} className="btn justify-center bg-primary text-ivory hover:bg-deep">Book now <span className="arr">↗</span></button>
                <button onClick={() => setModal('enquire')} className="btn justify-center border border-primary/30 text-primary hover:bg-primary hover:text-ivory">Enquire</button>
              </div>
              {p.demo && <p className="mt-4 text-[11px] text-muted/80">Demo listing</p>}
            </div>
          </aside>
        </div>
      </div>
      <AnimatePresence>{modal && <StayForm key={modal} p={p} mode={modal} init={{ ...d, guests: g }} onClose={() => setModal(null)} onUnavailable={blocked} />}</AnimatePresence>
      <AnimatePresence>{pop && <UnavailablePopup alt={pop.alt} dates={pop} onClose={() => setPop(null)} />}</AnimatePresence>
    </main>
  );
}
