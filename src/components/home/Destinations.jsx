import { Link } from 'react-router-dom';
import { useGsap } from '../../lib/motion';
import Img from '../common/Img';
import { Lines } from '../common/Type';
import { PROPERTIES } from '../../data/properties';

const D = [
  ['Ooty', '1470071459604-3b5ec3a7fe05', 'Misty hills and tea slopes in the Nilgiris'],
  ['Kodaikanal', '1469474968028-56623f02e42e', 'Pine forests and valley views'],
  ['Coimbatore', '1476514525535-07fb3b4ae5f1', 'Green foothills near the Western Ghats'],
  ['Yercaud', '1501785888041-af3ef285b470', 'Quiet lakes and coffee estates'],
  ['ECR', '1507652313519-d4e9174996dd', 'Coastal road stays by the Bay of Bengal'],
  ['Pondicherry', '1520250497591-112f2f40a3f4', 'Seaside heritage quarters and cafes'],
];
export default function Destinations() {
  const ref = useGsap();
  return (
    <section ref={ref} className="bg-ivory px-5 py-28 md:px-10 md:py-44">
      <div className="mx-auto max-w-[1400px]">
        <Lines lines={['Popular', 'destinations']} className="mb-14 font-serif text-[clamp(2.6rem,6vw,5.5rem)] leading-[.98] text-primary md:mb-24" />
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-16">
          {D.map(([name, id, alt], i) => {
            const n = PROPERTIES.filter((p) => p.destination === name).length;
            return (
              <Link key={name} to={`/villas?dest=${name}`} className={`group block ${i % 3 === 1 ? 'md:mt-16' : ''}`}>
                <div data-clip data-delay={(i % 3) * 0.12} className="aspect-[4/5] overflow-hidden bg-primary/10"><div className="h-full">
                  <Img id={id} alt={alt} sizes="(min-width:768px) 30vw, 50vw" className="h-full w-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.07]" /></div></div>
                <div data-fade className="pt-4"><h3 className="font-serif text-2xl text-primary md:text-4xl"><span className="link-u">{name}</span></h3>
                  <p className="mt-1 text-sm text-muted">{n} sample {n === 1 ? 'stay' : 'stays'}</p></div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
