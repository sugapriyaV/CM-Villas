import { Link } from 'react-router-dom';
import { gsap, useGsap } from '../../lib/motion';
import Img from '../common/Img';

const EXP = [
  ['Beach Side Resorts', 'beach', '1571896349842-33c89424de2d', 'Beach side resort pool at golden hour'],
  ['Luxury Stays', 'luxury', '1600585154340-be6161a56a0c', 'Luxury stay with an illuminated terrace'],
  ['Mountain Retreats', 'mountain', '1506905925346-21bda4d32df4', 'Mountain range above morning mist'],
];
/** Pinned full-screen stage: the card frame expands to the viewport, then images cross-fade with scroll. */
export default function Experiences() {
  const ref = useGsap((root) => {
    const stage = root.querySelector('.exp-stage');
    const imgs = gsap.utils.toArray('.exp-img', root), items = gsap.utils.toArray('.exp-item', root), n = imgs.length;
    gsap.fromTo(stage, { clipPath: 'inset(9% 5% 9% 5% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: root, start: 'top 90%', end: 'top top', scrub: true } });
    gsap.set(imgs.slice(1), { opacity: 0 }); gsap.set(items.slice(1), { opacity: 0.35 });
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: root, start: 'top top', end: () => '+=' + window.innerHeight * (n - 1) * 0.9, pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true } });
    imgs.forEach((im, i) => tl.fromTo(im, { scale: 1.2 }, { scale: 1, duration: 1.5 }, Math.max(0, i - 0.3)));
    for (let i = 1; i < n; i++)
      tl.to(imgs[i - 1], { opacity: 0, duration: 0.6 }, i - 0.3).to(imgs[i], { opacity: 1, duration: 0.6 }, i - 0.3)
        .to(items[i - 1], { opacity: 0.35, duration: 0.4 }, i - 0.3).to(items[i], { opacity: 1, duration: 0.4 }, i - 0.3);
  });
  return (
    <section ref={ref} className="h-[100svh] bg-ivory" aria-label="Explore by experience">
      <div className="exp-stage relative h-full overflow-hidden bg-deep">
        {EXP.map(([, , id, alt], i) => <Img key={id} id={id} alt={alt} w={1800} h={1200} sizes="100vw" eager={i === 0} className="exp-img absolute inset-0 h-full w-full object-cover" />)}
        <div className="absolute inset-0 bg-gradient-to-r from-deep/85 via-deep/35 to-deep/10" />
        <div className="relative z-10 flex h-full flex-col justify-between px-5 pb-10 pt-28 text-ivory md:px-10 md:pb-14 md:pt-32">
          <div className="max-w-md"><h2 className="font-serif text-3xl md:text-5xl">Explore by experience</h2><p className="mt-3 text-sm text-ivory/70">Scroll to move through the ways to stay.</p></div>
          <ul className="space-y-1 md:space-y-2">
            {EXP.map(([name, tag]) => (
              <li key={tag}><Link to={`/villas?tag=${tag}`} className="exp-item group block font-serif text-[clamp(1.9rem,5.2vw,4.6rem)] leading-[1.08]"><span className="link-u">{name}</span></Link></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
