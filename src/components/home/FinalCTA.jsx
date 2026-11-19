import { Link } from 'react-router-dom';
import { useGsap } from '../../lib/motion';
import Img from '../common/Img';
import { Lines } from '../common/Type';

export default function FinalCTA() {
  const ref = useGsap();
  return (
    <section ref={ref} className="relative flex min-h-[85svh] items-center justify-center overflow-hidden bg-deep px-5 text-center text-ivory">
      <div className="absolute inset-0"><div data-parallax className="absolute -inset-y-[10%] inset-x-0">
        <Img id="1540541338287-41700207dee6" alt="Resort pool among palm trees at dusk" w={1800} h={1200} className="h-full w-full object-cover" /></div></div>
      <div className="absolute inset-0 bg-deep/55" />
      <div className="relative z-10 py-24">
        <Lines as="h2" lines={['Your next getaway', 'starts here.']} className="font-serif text-[clamp(2.8rem,8vw,7rem)] leading-[.97]" />
        <div data-fade data-delay="0.3" className="mt-10"><Link to="/villas" className="btn bg-ivory text-primary hover:bg-gold">Explore Our Villas <span className="arr">↗</span></Link></div>
      </div>
    </section>
  );
}
