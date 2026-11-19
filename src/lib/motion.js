import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };
export let lenis = null;
export const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Lenis inertia scrolling, wired to GSAP's ticker so ScrollTrigger stays frame-accurate. */
export function initSmooth() {
  if (reduced()) return () => {};
  lenis = new Lenis({ duration: 1.25, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (t) => lenis && lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => { gsap.ticker.remove(tick); lenis && lenis.destroy(); lenis = null; };
}

/** Scoped GSAP setup. Only runs when reduced motion is NOT requested; everything is reverted on unmount. */
export function useGsap(setup) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(ref.current);
    mm.add({ ok: '(prefers-reduced-motion: no-preference)', desk: '(min-width: 768px)' }, (ctx) => {
      if (!ctx.conditions.ok) return;
      setup && setup(ref.current, ctx.conditions.desk);
      autoReveal(ref.current);
    });
    return () => mm.revert();
    // eslint-disable-next-line
  }, []);
  return ref;
}

/** Attribute-driven reveals, each with its own motion language:
 *  data-lines  masked line rise    data-clip  curtain wipe + counter-scale
 *  data-fade   soft rise           data-words scroll-scrubbed word lighting   data-parallax  drift */
export function autoReveal(root) {
  const q = (s) => root.querySelectorAll(s);
  q('[data-lines]').forEach((el) =>
    gsap.from(el.querySelectorAll('.ln'), { yPercent: 118, duration: 1.4, ease: 'expo.out', stagger: 0.13, scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
  q('[data-clip]').forEach((el) => {
    const d = +(el.dataset.delay || 0);
    const tl = gsap.timeline({ delay: d, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' })
      .fromTo(el.firstElementChild, { scale: 1.4 }, { scale: 1, duration: 2, ease: 'expo.out' }, 0);
  });
  q('[data-fade]').forEach((el) =>
    gsap.from(el, { y: 26, opacity: 0, duration: 1.2, ease: 'power3.out', delay: +(el.dataset.delay || 0), scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));
  q('[data-words]').forEach((el) =>
    gsap.fromTo(el.querySelectorAll('.wd'), { opacity: 0.14 }, { opacity: 1, stagger: 0.12, ease: 'none', scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 50%', scrub: true } }));
  if (window.innerWidth >= 768)
    q('[data-parallax]').forEach((el) =>
      gsap.fromTo(el, { yPercent: -9 }, { yPercent: 9, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
}
