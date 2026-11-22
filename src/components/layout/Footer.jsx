import { Link } from 'react-router-dom';
import { SITE, waLink } from '../../lib/site';
import { DESTINATIONS } from '../../data/properties';
import { Logo } from './Navbar';

export default function Footer() {
  return (
    <footer className="bg-deep px-5 pb-8 pt-20 text-ivory md:px-10">
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo light />
          <p className="mt-6 max-w-sm font-serif text-2xl leading-snug text-ivory/90">Discover. Experience. Escape.</p>
          <p className="mt-4 max-w-sm text-sm text-ivory/60">Private villas and resorts, with owners you can reach directly.</p>
        </div>
        <nav aria-label="Explore" className="md:col-span-2"><h2 className="mb-4 font-sans text-sm font-medium text-gold">Explore</h2>
          <ul className="space-y-2 text-sm text-ivory/75">{[['/villas', 'Explore Villas'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([t, l]) => <li key={t}><Link className="link-u" to={t}>{l}</Link></li>)}</ul></nav>
        <nav aria-label="Destinations" className="md:col-span-2"><h2 className="mb-4 font-sans text-sm font-medium text-gold">Destinations</h2>
          <ul className="space-y-2 text-sm text-ivory/75">{DESTINATIONS.map((d) => <li key={d}><Link className="link-u" to={`/villas?dest=${d}`}>{d}</Link></li>)}</ul></nav>
        <div className="md:col-span-3"><h2 className="mb-4 font-sans text-sm font-medium text-gold">Talk to us</h2>
          <ul className="space-y-2 text-sm text-ivory/75">
            <li><a className="link-u" href={`tel:${SITE.phone}`}>{SITE.phoneLabel}</a></li>
            <li><a className="link-u" href={waLink()} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-16 flex max-w-[1400px] flex-col gap-3 border-t border-ivory/10 pt-6 text-xs text-ivory/50 md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} CM Villas. All rights reserved.</p>
        <p className="flex gap-5"><Link className="link-u" to="/privacy-policy">Privacy Policy</Link><Link className="link-u" to="/terms-and-conditions">Terms &amp; Conditions</Link></p>
      </div>
    </footer>
  );
}
