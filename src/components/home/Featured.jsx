import { Link } from 'react-router-dom';
import { useGsap } from '../../lib/motion';
import { Lines } from '../common/Type';
import VillaCard from '../property/VillaCard';
import { PROPERTIES } from '../../data/properties';

// Editorial rhythm: alternating spans, ratios and vertical offsets.
const LAYOUT = [
  ['md:col-span-7', 'aspect-[4/3]', ''], ['md:col-span-5', 'aspect-[4/5]', 'md:mt-24'],
  ['md:col-span-5', 'aspect-[4/5]', ''], ['md:col-span-7', 'aspect-[4/3]', 'md:mt-24'],
  ['md:col-span-7', 'aspect-[4/3]', ''], ['md:col-span-5', 'aspect-[4/5]', 'md:mt-24'],
];
export default function Featured() {
  const ref = useGsap();
  return (
    <section ref={ref} className="bg-ivory px-5 pb-28 md:px-10 md:pb-44">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-14 flex flex-col justify-between gap-6 md:mb-24 md:flex-row md:items-end">
          <Lines lines={['Featured villas', 'and resorts']} className="font-serif text-[clamp(2.6rem,6vw,5.5rem)] leading-[.98] text-primary" />
          <div data-fade className="max-w-xs"><p className="text-sm text-muted">Sample properties across Tamil Nadu and Pondicherry. Every stay connects you straight to its owner.</p>
            <Link to="/villas" className="link-u mt-4 text-sm text-primary">See all villas ↗</Link></div>
        </div>
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-12 md:gap-y-20">
          {PROPERTIES.slice(0, 6).map((p, i) => (
            <div key={p.id} className={`${LAYOUT[i][0]} ${LAYOUT[i][2]}`}>
              <VillaCard p={p} aspect={LAYOUT[i][1]} reveal delay={(i % 2) * 0.12} sizes={LAYOUT[i][0].includes('7') ? '(min-width:768px) 58vw, 100vw' : '(min-width:768px) 40vw, 100vw'} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
