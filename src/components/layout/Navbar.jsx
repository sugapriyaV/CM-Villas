import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SITE, waLink } from '../../lib/site';
import { lenis } from '../../lib/motion';

const LINKS = [['/', 'Home'], ['/villas', 'Explore Villas'], ['/destinations', 'Destinations'], ['/about', 'About Us'], ['/contact', 'Contact']];
export const Logo = ({ light }) => (
  <Link to="/" aria-label="CM Villas home" className={`flex items-baseline gap-2 ${light ? 'text-ivory' : 'text-primary'}`}>
    <span className="font-serif text-3xl font-semibold leading-none">CM</span>
    <span className="text-[11px] font-medium tracking-[.42em]">VILLAS</span>
  </Link>
);

export default function Navbar() {
  const { pathname } = useLocation();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 50);
    f(); window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    open ? lenis && lenis.stop() : lenis && lenis.start();
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  const clear = pathname === '/' && !solid;
  const light = open || clear;
  return (
    <>
      <motion.header initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,padding] duration-700 ${clear || open ? 'py-6' : 'py-3.5 bg-ivory/95 backdrop-blur-md shadow-[0_1px_0_rgba(24,59,50,.08),0_10px_30px_-20px_rgba(24,59,50,.35)]'}`}>
        <div className={`mx-auto flex max-w-[1500px] items-center justify-between px-5 md:px-10 ${light ? 'text-ivory' : 'text-primary'}`}>
          <Logo light={light} />
          <nav aria-label="Primary" className="hidden items-center gap-9 text-sm lg:flex">
            {LINKS.map(([to, l]) => (
              <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `link-u ${isActive ? 'on' : ''}`}>{l}</NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-5 text-sm">
            <a href={`tel:${SITE.phone}`} className="link-u hidden xl:inline">{SITE.phoneLabel}</a>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="link-u hidden xl:inline">WhatsApp</a>
            <Link to="/villas" className={`btn hidden md:inline-flex ${light ? 'bg-ivory text-primary hover:bg-gold' : 'bg-primary text-ivory hover:bg-deep'}`}>Explore Villas <span className="arr">↗</span></Link>
            <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[7px] lg:hidden">
              <span className={`h-px w-7 bg-current transition-transform duration-500 ${open ? 'translate-y-[4px] rotate-45' : ''}`} />
              <span className={`h-px w-7 bg-current transition-transform duration-500 ${open ? '-translate-y-[4px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ clipPath: 'circle(0% at 92% 4%)' }} animate={{ clipPath: 'circle(150% at 92% 4%)' }} exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }} className="fixed inset-0 z-40 flex flex-col justify-center bg-primary px-8 text-ivory lg:hidden">
            <nav aria-label="Mobile" className="flex flex-col gap-2">
              {LINKS.map(([to, l], i) => (
                <div key={to} className="overflow-hidden">
                  <motion.div initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.3 + i * 0.07, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
                    <Link to={to} className="block font-serif text-5xl leading-[1.15]">{l}</Link>
                  </motion.div>
                </div>
              ))}
            </nav>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-12 flex gap-6 text-sm text-ivory/80">
              <a href={`tel:${SITE.phone}`}>Call</a><a href={waLink()} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
