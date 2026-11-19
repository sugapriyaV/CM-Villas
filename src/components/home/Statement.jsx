import { useGsap } from '../../lib/motion';
import Img from '../common/Img';
import { Words } from '../common/Type';

export default function Statement() {
  const ref = useGsap();
  return (
    <section ref={ref} className="overflow-hidden bg-ivory px-5 pb-24 pt-24 md:px-10 md:pb-36 md:pt-40">
      <Words as="h2" text="NOT JUST A STAY. A PRIVATE WORLD OF POSSIBILITY." className="mx-auto max-w-[1400px] text-center font-serif text-[clamp(2.3rem,7.6vw,7.4rem)] font-medium uppercase leading-[.93] tracking-tighter text-primary" />
      <p data-fade className="mx-auto mt-8 max-w-xl text-center text-muted md:mt-12">From misty hill stations to quiet coastal roads, discover villas and resorts where the setting, the space and the welcome are part of the journey.</p>
      <div className="mx-auto mt-16 grid max-w-[1400px] grid-cols-12 items-end gap-3 md:mt-28 md:gap-6">
        <div data-clip className="col-span-12 aspect-[16/10] overflow-hidden md:col-span-6 md:col-start-1"><div className="h-full"><Img id="1499793983690-e29da59ef1c2" alt="Villa terrace with a pool and lounge seating" sizes="(min-width:768px) 50vw, 100vw" className="h-full w-full object-cover" /></div></div>
        <div data-clip data-delay="0.15" className="col-span-6 aspect-[4/5] overflow-hidden md:col-span-3"><div className="h-full"><Img id="1506905925346-21bda4d32df4" alt="Mist over a mountain valley at sunrise" sizes="(min-width:768px) 25vw, 50vw" className="h-full w-full object-cover" /></div></div>
        <div data-clip data-delay="0.3" className="col-span-6 aspect-[4/5] overflow-hidden md:col-span-3 md:mb-16"><div className="h-full"><Img id="1507525428034-b723cf961d3e" alt="Quiet tropical beach with turquoise water" sizes="(min-width:768px) 25vw, 50vw" className="h-full w-full object-cover" /></div></div>
      </div>
    </section>
  );
}
