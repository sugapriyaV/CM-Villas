import { Link } from 'react-router-dom';
import { useGsap } from '../../lib/motion';
import Img from '../common/Img';
import { Lines } from '../common/Type';
import { useProperties } from '../../lib/store';

const D = [
  ['ECR', '1507652313519-d4e9174996dd', 'Coastal road and beach side stays on the Bay of Bengal'],
  ['Kodaikanal', '1469474968028-56623f02e42e', 'Pine forests and valley views'],
];
export default function Destinations() {
  const ref = useGsap();
  const list = useProperties();
  return (
    <section ref={ref} className="bg-ivory px-5 py-28 md:px-10 md:py-44">
      <div className="mx-auto max-w-[1400px]">
        <Lines lines={['Popular', 'destinations']} className="mb-14 font-serif text-[clamp(2.6rem,6vw,5.5rem)] leading-[.98] text-primary md:mb-24" />
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-3 gap-y-10 md:gap-x-8 md:gap-y-16">
          {D.map(([name, id, alt], i) => {
            const n = list.filter((p) => p.destination === name).length;
            return (
              <Link key={name} to={`/villas?dest=${name}`} className={`group block ${i % 2 === 1 ? 'md:mt-16' : ''}`}>
                <div data-clip data-delay={(i % 3) * 0.12} className="aspect-[4/5] overflow-hidden bg-primary/10"><div className="h-full">
                  <Img id={id} alt={alt} sizes="(min-width:768px) 30vw, 50vw" className="h-full w-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.07]" /></div></div>
                <div data-fade className="pt-4"><h3 className="font-serif text-2xl text-primary md:text-4xl"><span className="link-u">{name}</span></h3>
                  <p className="mt-1 text-sm text-muted">{n} {n === 1 ? 'stay' : 'stays'}</p></div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
