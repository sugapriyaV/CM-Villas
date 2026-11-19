# CM Villas: Stage 1

React 18 + Vite + Tailwind CSS 3. Motion: GSAP + ScrollTrigger, Lenis (smooth scroll), Framer Motion (page, menu and list transitions).

## Run
    npm install
    npm run dev        # http://localhost:5173
    npm run build && npm run preview

## What is in Stage 1
- Home: hero (line reveal, slow zoom, parallax, glass search), word-scrub statement, featured villas (clip-wipe reveals),
  pinned full-screen experience stage with cross-fades, destinations, ivory-to-green "Why" section, testimonials, CTA.
- Explore Villas: working search, destination, type, price, bedrooms, guests, AC, pool, amenities, sort, active chips,
  empty and loading states, load more. Reads ?dest= ?type= ?tag= ?guests= from the URL.
- Other routes (villa details, destinations, about, contact, legal) show a stub until Stages 2 and 3.

## Where to edit
- `src/data/properties.js`: sample listings (all marked demo) and photo ids.
- `src/lib/site.js`: placeholder phone, WhatsApp and email.
- `src/lib/motion.js`: scroll engine and reveal helpers. Use `data-lines | data-clip | data-fade | data-words | data-parallax`.
- Colours and fonts: `tailwind.config.js`.

## Notes
- Photos load from Unsplash (free licence). Ids were chosen from memory, so open the site and replace any that don't load.
  Missing images fall back to a green panel.
- All prices, names and reviews are demonstration content. Phone numbers are placeholders.
- `prefers-reduced-motion`: all GSAP motion and Lenis are skipped and content is shown immediately.
