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
