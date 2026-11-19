import { Link } from 'react-router-dom';
import { gsap, useGsap } from '../../lib/motion';
import Img from '../common/Img';
import SearchPanel from './SearchPanel';

export const HERO_IMG = '1613490493576-7fde63acd811';
export default function Hero() {
  const ref = useGsap((root, desk) => {
    const tl = gsap.timeline({ delay: 0.75, defaults: { ease: 'expo.out' } });
    tl.fromTo('.hero-bg', { scale: 1.34 }, { scale: 1.03, duration: 4, ease: 'power2.out' }, 0)
      .from('.hero-shade', { opacity: 0.0, duration: 2 }, 0)
      .from('.hero-wrap .ln, .hero-content .ln', { yPercent: 120, duration: 1.7, stagger: 0.16 }, 0.2)
      .from('.hero-fade', { y: 26, opacity: 0, duration: 1.2, stagger: 0.12 }, 1)
      .from('.glass', { y: 90, opacity: 0, duration: 1.6 }, 1.1)
      .from('.gf', { y: 14, opacity: 0, duration: 1, stagger: 0.06 }, 1.5)
      .from('.scroll-ind', { opacity: 0, duration: 1 }, 2.2);
    gsap.to('.hero-wrap', { yPercent: desk ? 14 : 6, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-content', { opacity: 0, y: -70, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: '55% top', scrub: true } });
    gsap.to('.scroll-line', { yPercent: 100, duration: 1.6, ease: 'power2.inOut', repeat: -1, repeatDelay: 0.3 });
  });
  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-deep">
      <div className="hero-wrap absolute inset-x-0 -top-[18%] bottom-0">
        <Img id={HERO_IMG} alt="Luxury private villa with an illuminated swimming pool at dusk" w={2000} h={1333} eager sizes="100vw" className="hero-bg h-full w-full object-cover" />
      </div>
      <div className="hero-shade absolute inset-0 bg-gradient-to-b from-deep/65 via-deep/15 to-deep/70" />
      <div className="hero-content relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-8 pt-32 text-center text-ivory">
        <h1 className="text-[clamp(2.9rem,9vw,8.2rem)] leading-[.95]">
          {['Find Your', 'Perfect Escape.'].map((l) => <span key={l} className="block overflow-hidden pb-[.14em] -mb-[.14em]"><span className="ln">{l}</span></span>)}
        </h1>
        <p className="hero-fade mt-6 max-w-md text-base text-ivory/85 md:text-lg">Discover exceptional private villas and resorts for unforgettable stays.</p>
        <div className="hero-fade mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/villas" className="btn bg-ivory text-primary hover:bg-gold">Explore Villas <span className="arr">↗</span></Link>
          <Link to="/destinations" className="btn border border-ivory/40 text-ivory hover:bg-ivory/10">Discover Destinations</Link>
        </div>
      </div>
      <div className="relative z-10 px-4 pb-6 md:px-10 md:pb-10"><SearchPanel /></div>
      <div aria-hidden className="scroll-ind absolute bottom-10 right-10 z-10 hidden h-16 w-px overflow-hidden bg-ivory/25 xl:block"><span className="scroll-line absolute -top-full left-0 h-full w-full bg-gold" /></div>
    </section>
  );
}
