import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { StagePage, NotFound } from './pages/Stage';
import { ScrollTrigger, initSmooth, lenis } from './lib/motion';
import { track } from './lib/analytics';

const Home = lazy(() => import('./pages/Home'));
const Villas = lazy(() => import('./pages/Villas'));
const Admin = lazy(() => import('./pages/Admin'));
const later = (title, note = 'This page is part of the next build stage.') => <StagePage title={title} note={note} />;

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
              <Route path="/destinations" element={later('Destinations')} />
              <Route path="/destinations/:slug" element={later('Destination')} />
              <Route path="/about" element={later('About us')} />
              <Route path="/contact" element={later('Contact us')} />
              <Route path="/privacy-policy" element={later('Privacy policy')} />
              <Route path="/terms-and-conditions" element={later('Terms and conditions')} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          {!admin && <Footer />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
