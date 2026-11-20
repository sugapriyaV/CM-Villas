// Seed listings (editable from /admin). Demonstration content until real owner details are supplied.
export const DESTINATIONS = ['ECR', 'Chennai', 'Kodaikanal'];
export const TYPES = ['Resort', 'Luxury Stay'];
export const AMENITIES = ['Swimming Pool', 'Wi-Fi', 'Kitchen', 'Parking', 'Garden', 'BBQ', 'Power Backup', 'Caretaker'];
export const TAG_LABELS = { beach: 'Beach side', luxury: 'Luxury', pool: 'Private pool', family: 'Family', couple: 'Couples', mountain: 'Mountain view', nature: 'Nature' };
export const SEED = [
  { id: 'azure-sands-beach-resort', slug: 'azure-sands-beach-resort', name: 'Azure Sands Beach Resort', destination: 'ECR', type: 'Resort', price: 22000, beds: 6, baths: 6, guests: 16, pool: true, ac: true,
    tags: ['beach', 'pool', 'family', 'couple'], amenities: ['Swimming Pool', 'Wi-Fi', 'Kitchen', 'Parking', 'Garden', 'BBQ', 'Caretaker', 'Power Backup'],
    img: '1571896349842-33c89424de2d', alt: 'Beach side resort pool lined with loungers at golden hour', desc: 'A beach side resort on the East Coast Road, steps from the sand.', demo: true },
  { id: 'regal-pines-luxury-stay', slug: 'regal-pines-luxury-stay', name: 'Regal Pines Luxury Stay', destination: 'Kodaikanal', type: 'Luxury Stay', price: 28000, beds: 5, baths: 5, guests: 12, pool: true, ac: false,
    tags: ['luxury', 'mountain', 'couple', 'family'], amenities: ['Swimming Pool', 'Wi-Fi', 'Kitchen', 'Parking', 'Garden', 'Caretaker', 'Power Backup'],
    img: '1600585154340-be6161a56a0c', alt: 'Luxury stay with an illuminated terrace and pool', desc: 'A luxury stay above the Kodaikanal valley with private terraces.', demo: true },
];
export const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
