// Seed listings (editable from /admin). Demonstration content until real owner details are supplied.
export const DESTINATIONS = ['ECR', 'Kodaikanal'];
export const TYPES = ['Resort', 'Luxury Stay'];
export const AMENITIES = ['Swimming Pool', 'Wi-Fi', 'Kitchen', 'Parking', 'Garden', 'BBQ', 'Power Backup', 'Caretaker'];
export const TAG_LABELS = { beach: 'Beach side', luxury: 'Luxury', pool: 'Private pool', family: 'Family', couple: 'Couples', mountain: 'Mountain view', nature: 'Nature' };
export const SEED = [
  { id: 'azure-sands-beach-resort', slug: 'azure-sands-beach-resort', name: 'Azure Sands Beach Resort', destination: 'ECR', type: 'Resort', price: 22000, weekendPrice: 28000, beds: 6, baths: 6, guests: 16, pool: true, ac: true,
    tags: ['beach', 'pool', 'family', 'couple'], amenities: ['Swimming Pool', 'Wi-Fi', 'Kitchen', 'Parking', 'Garden', 'BBQ', 'Caretaker', 'Power Backup'],
    img: '1571896349842-33c89424de2d', alt: 'Beach side resort pool lined with loungers at golden hour', desc: 'A beach side resort on the East Coast Road, steps from the sand.', demo: true },
  { id: 'regal-pines-luxury-stay', slug: 'regal-pines-luxury-stay', name: 'Regal Pines Luxury Stay', destination: 'Kodaikanal', type: 'Luxury Stay', price: 28000, weekendPrice: 35000, beds: 5, baths: 5, guests: 12, pool: true, ac: false,
    tags: ['luxury', 'mountain', 'couple', 'family'], amenities: ['Swimming Pool', 'Wi-Fi', 'Kitchen', 'Parking', 'Garden', 'Caretaker', 'Power Backup'],
    img: '1600585154340-be6161a56a0c', alt: 'Luxury stay with an illuminated terrace and pool', desc: 'A luxury stay above the Kodaikanal valley with private terraces.', demo: true },
];
export const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
// Weekend nights = Friday and Saturday (JS getDay: 5, 6). Change here if the owners use different days.
export const WEEKEND = [5, 6];
export const isWeekend = (d = new Date()) => WEEKEND.includes(d.getDay());
export const rate = (p, d = new Date()) => (isWeekend(d) ? p.weekendPrice ?? p.price : p.price);
/** Estimated total for a stay: each night is priced by its own day of the week. */
export function stay(p, inn, out) {
  let total = 0, n = 0;
  const span = Math.round((new Date(out + 'T00:00') - new Date(inn + 'T00:00')) / 864e5);
  if (!(span > 0 && span <= 730)) return { total: 0, n: 0 };
  for (let d = new Date(inn + 'T00:00'); d < new Date(out + 'T00:00'); d.setDate(d.getDate() + 1)) { total += rate(p, d); n++; }
  return { total, n };
}
