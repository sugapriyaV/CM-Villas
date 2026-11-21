import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lines } from '../components/common/Type';
import { useGsap } from '../lib/motion';

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
