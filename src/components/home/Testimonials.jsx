import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGsap } from '../../lib/motion';

const T = [['A calm weekend with friends in the hills. Being able to speak to the owner before booking made all the difference.', 'Sample guest, Madurai'],
  ['The enquiry took a minute, and the reply came the same evening. Everything was clear before we arrived.', 'Sample guest, Bengaluru'],
  ['Rates and house rules were laid out plainly, so there were no surprises for the family.', 'Sample guest, Coimbatore']];
export default function Testimonials() {
  const ref = useGsap();
  const [i, setI] = useState(0); const [dir, setDir] = useState(1);
  const go = (n) => { setDir(n > i ? 1 : -1); setI((n + T.length) % T.length); };
  return (
    <section ref={ref} className="overflow-hidden bg-primary px-5 pb-28 pt-8 text-ivory md:px-10 md:pb-44">
      <div className="mx-auto max-w-4xl text-center">
        <p data-fade className="text-xs text-gold">Sample reviews for demonstration only, not verified guest testimonials</p>
        <div className="relative mt-10 min-h-[290px] md:min-h-[260px]" aria-live="polite">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure key={i} custom={dir} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2}
              onDragEnd={(_, o) => { if (o.offset.x < -60) go(i + 1); else if (o.offset.x > 60) go(i - 1); }}
              initial={{ opacity: 0, x: dir * 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -60 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <blockquote className="font-serif text-[clamp(1.6rem,3.6vw,2.9rem)] leading-[1.2]">“{T[i][0]}”</blockquote>
              <figcaption className="mt-8 text-sm text-ivory/60">{T[i][1]}</figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="mt-6 flex items-center justify-center gap-6">
          <button onClick={() => go(i - 1)} aria-label="Previous review" className="h-11 w-11 rounded-full border border-ivory/30 transition-colors hover:bg-ivory hover:text-primary">←</button>
          <div className="flex gap-2">{T.map((_, n) => <button key={n} onClick={() => go(n)} aria-label={`Review ${n + 1}`} className={`h-1.5 rounded-full transition-all duration-500 ${n === i ? 'w-8 bg-gold' : 'w-1.5 bg-ivory/30'}`} />)}</div>
          <button onClick={() => go(i + 1)} aria-label="Next review" className="h-11 w-11 rounded-full border border-ivory/30 transition-colors hover:bg-ivory hover:text-primary">→</button>
        </div>
      </div>
    </section>
  );
}
