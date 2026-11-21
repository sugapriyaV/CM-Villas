import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { StagePage, NotFound, About } from './pages/Stage';
import { waLink } from './lib/site';
import { ScrollTrigger, initSmooth, lenis } from './lib/motion';
import { track } from './lib/analytics';

const Home = lazy(() => import('./pages/Home'));
const Villas = lazy(() => import('./pages/Villas'));
const Admin = lazy(() => import('./pages/Admin'));
const later = (title, note = 'This page is part of the next build stage.') => <StagePage title={title} note={note} />;

/** Floating WhatsApp button shown on every visitor page. */
const WaFloat = () => (
  <a href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat with CM Villas on WhatsApp"
    className="fixed bottom-5 right-5 z-[55] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_34px_-10px_rgba(0,0,0,.5)] transition-transform duration-500 hover:scale-110 md:bottom-8 md:right-8">
    <span aria-hidden className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 motion-safe:animate-ping" />
    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true" className="relative"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
  </a>
);

export default function App() {
  const location = useLocation();
  const admin = location.pathname.startsWith('/admin');
  useEffect(() => initSmooth(), []);
  useEffect(() => {
    const r = () => ScrollTrigger.refresh();
    const t = setTimeout(r, 900);
    window.addEventListener('load', r);
    return () => { clearTimeout(t); window.removeEventListener('load', r); };
  }, [location.pathname]);
  useEffect(() => { if (!admin) track('pageview', { path: location.pathname }); }, [location.pathname, admin]);
  useEffect(() => {
    const f = (e) => {
      const a = e.target.closest && e.target.closest('a'); const h = a ? a.getAttribute('href') || '' : '';
      if (h.startsWith('tel:')) track('contact', { kind: 'call', path: location.pathname });
      else if (h.includes('wa.me')) track('contact', { kind: 'whatsapp', path: location.pathname });
    };
    document.addEventListener('click', f); return () => document.removeEventListener('click', f);
  }, [location.pathname]);
  const top = () => { lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0); };
  return (
    <div className="bg-primary">
      {!admin && <Navbar />}
      <AnimatePresence mode="wait" onExitComplete={top}>
        <motion.div key={location.pathname} initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: 'easeInOut' }} className="bg-ivory">
          <motion.div aria-hidden className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-primary" initial={{ y: '0%' }} animate={{ y: '-101%' }} transition={{ duration: 1.1, delay: 0.25, ease: [0.76, 0, 0.24, 1] }}>
            <span className="font-serif text-5xl text-ivory">CM <span className="ml-1 align-middle text-xs tracking-[.42em]">VILLAS</span></span>
          </motion.div>
          <Suspense fallback={<div className="min-h-screen bg-primary" />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/villas" element={<Villas />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/villas/:slug" element={later('Villa details', 'Gallery, rooms, pricing, owner contact and the enquiry form arrive in Stage 2.')} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={later('Contact us')} />
              <Route path="/privacy-policy" element={later('Privacy policy')} />
              <Route path="/terms-and-conditions" element={later('Terms and conditions')} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          {!admin && <Footer />}
        </motion.div>
      </AnimatePresence>
      {!admin && <WaFloat />}
    </div>
  );
}
