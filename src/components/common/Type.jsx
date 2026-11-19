/** Masked line-by-line heading: each line rises out of its own mask. */
export const Lines = ({ lines, as: T = 'h2', className = '', ...rest }) => (
  <T data-lines className={className} {...rest}>
    {lines.map((l, i) => (
      <span key={i} className="block overflow-hidden pb-[.14em] -mb-[.14em]"><span className="ln">{l}</span></span>
    ))}
  </T>
);
/** Words that light up as you scroll (scrubbed). */
export const Words = ({ text, as: T = 'h2', className = '' }) => (
  <T data-words className={className}>
    {text.split(' ').map((w, i) => <span key={i} className="wd">{w} </span>)}
  </T>
);
