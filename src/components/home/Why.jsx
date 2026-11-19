import { gsap, useGsap } from '../../lib/motion';
import { Lines } from '../common/Type';

const W = [['Direct owner communication', 'Call or message the owner of each property yourself. No middlemen between you and the people who host you.'],
  ['Carefully selected properties', 'We list stays with real character and clear information, so the choice you make is a confident one.'],
  ['Transparent rental information', 'Weekday and weekend rates, deposits and house rules are laid out plainly on every property page.'],
  ['An easy enquiry process', 'Send one enquiry with your dates and guests, and the owner replies directly.']];
/** Ivory dissolves into deep green as this section enters. */
export default function Why() {
  const ref = useGsap((root) => {
    gsap.fromTo(root, { backgroundColor: '#F7F5EF', color: '#242424' }, { backgroundColor: '#183B32', color: '#F7F5EF', ease: 'none', scrollTrigger: { trigger: root, start: 'top 80%', end: 'top 20%', scrub: true } });
    gsap.from('.wline', { scaleX: 0, transformOrigin: 'left', duration: 1.6, ease: 'expo.out', stagger: 0.14, scrollTrigger: { trigger: '.why-grid', start: 'top 80%', once: true } });
    gsap.from('.wtxt', { yPercent: 40, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: 0.14, scrollTrigger: { trigger: '.why-grid', start: 'top 80%', once: true } });
  });
  return (
    <section ref={ref} className="bg-primary px-5 py-28 text-ivory md:px-10 md:py-44">
      <div className="mx-auto max-w-[1400px]">
        <Lines lines={['Why choose', 'CM Villas?']} className="font-serif text-[clamp(2.6rem,6vw,5.5rem)] leading-[.98]" />
        <div className="why-grid mt-16 grid gap-x-16 gap-y-12 md:mt-24 md:grid-cols-2">
          {W.map(([t, d]) => (
            <div key={t}><div className="wline mb-6 h-px w-full bg-gold/70" />
              <h3 className="wtxt font-serif text-3xl md:text-4xl">{t}</h3><p className="wtxt mt-3 max-w-md text-[15px] leading-relaxed opacity-70">{d}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
}
