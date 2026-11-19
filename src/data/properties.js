// DEMONSTRATION CONTENT: names, prices and details are samples, not real listings.
const P = (slug, name, destination, type, price, beds, baths, guests, pool, ac, tags, amen, img, alt) => ({
  id: slug, slug, name, destination, type, price, beds, baths, guests, pool, ac, tags, img, alt, demo: true,
  amenities: pool ? ['Swimming Pool', ...amen] : amen,
});
export const AMENITIES = ['Swimming Pool', 'Wi-Fi', 'Kitchen', 'Parking', 'Garden', 'BBQ', 'Power Backup', 'Caretaker'];
export const TYPES = ['Villa', 'Resort', 'Cottage'];
export const DESTINATIONS = ['Ooty', 'Kodaikanal', 'Coimbatore', 'Yercaud', 'ECR', 'Pondicherry'];
export const PROPERTIES = [
  P('the-palm-retreat', 'The Palm Retreat', 'ECR', 'Villa', 18500, 4, 4, 10, true, true, ['pool', 'family', 'couple'], ['Wi-Fi', 'Kitchen', 'Parking', 'Garden', 'BBQ', 'Caretaker', 'Power Backup'], '1600596542815-ffad4c1539a9', 'Modern white villa with a private pool and palm garden'),
  P('green-valley-villa', 'Green Valley Villa', 'Ooty', 'Villa', 14000, 3, 3, 8, false, false, ['nature', 'mountain', 'family'], ['Wi-Fi', 'Kitchen', 'Parking', 'Garden', 'BBQ', 'Power Backup'], '1564013799919-ab600027ffc6', 'Contemporary hillside house with large glass windows'),
  P('azure-sands-resort', 'Azure Sands Resort', 'ECR', 'Resort', 26000, 6, 6, 16, true, true, ['pool', 'resort', 'family'], ['Wi-Fi', 'Kitchen', 'Parking', 'Garden', 'Caretaker', 'Power Backup'], '1571896349842-33c89424de2d', 'Resort pool lined with loungers at golden hour'),
  P('pine-crest-villa', 'Pine Crest Villa', 'Kodaikanal', 'Villa', 12500, 3, 2, 7, false, false, ['mountain', 'nature', 'couple'], ['Wi-Fi', 'Kitchen', 'Parking', 'Garden', 'BBQ'], '1518780664697-55e3ad937233', 'Stone and timber villa surrounded by pine trees'),
  P('lakeview-manor', 'Lakeview Manor', 'Kodaikanal', 'Villa', 21000, 5, 5, 12, true, true, ['mountain', 'family', 'pool'], ['Wi-Fi', 'Kitchen', 'Parking', 'Garden', 'Caretaker', 'Power Backup'], '1600585154340-be6161a56a0c', 'Luxury manor with an illuminated terrace and pool'),
  P('coffee-estate-cottage', 'Coffee Estate Cottage', 'Yercaud', 'Cottage', 7800, 2, 2, 5, false, false, ['nature', 'couple'], ['Wi-Fi', 'Kitchen', 'Parking', 'Garden', 'BBQ'], '1523217582562-09d0def993a6', 'Cosy cottage with a wooden deck among plantations'),
  P('orchid-hills-resort', 'Orchid Hills Resort', 'Yercaud', 'Resort', 16500, 8, 8, 20, true, true, ['resort', 'nature', 'family', 'mountain'], ['Wi-Fi', 'Kitchen', 'Parking', 'Garden', 'Caretaker', 'Power Backup'], '1566073771259-6a8506099945', 'Hill resort with landscaped grounds and a lagoon pool'),
  P('maison-bleue', 'Maison Bleue', 'Pondicherry', 'Villa', 17500, 4, 4, 9, true, true, ['pool', 'couple'], ['Wi-Fi', 'Kitchen', 'Parking', 'Garden', 'Power Backup'], '1580587771525-78b9dba3b914', 'Heritage-style villa with a blue-tiled pool'),
  P('french-quarter-courtyard', 'French Quarter Courtyard', 'Pondicherry', 'Villa', 11000, 2, 2, 4, false, true, ['couple'], ['Wi-Fi', 'Kitchen', 'Garden', 'Caretaker'], '1512917774080-9991f1c4c750', 'Courtyard home with warm walls and arched doors'),
  P('kovai-oasis', 'Kovai Oasis', 'Coimbatore', 'Villa', 15500, 4, 3, 10, true, true, ['pool', 'family'], ['Wi-Fi', 'Kitchen', 'Parking', 'Garden', 'BBQ', 'Power Backup'], '1613490493576-7fde63acd811', 'Modern villa glowing at dusk beside a long pool'),
  P('siruvani-retreat', 'Siruvani Retreat', 'Coimbatore', 'Resort', 19500, 6, 6, 14, true, true, ['resort', 'nature', 'mountain'], ['Wi-Fi', 'Kitchen', 'Parking', 'Garden', 'Caretaker', 'Power Backup'], '1540541338287-41700207dee6', 'Foothill resort with a pool framed by palms'),
  P('tea-garden-estate', 'Tea Garden Estate', 'Ooty', 'Cottage', 9500, 3, 3, 6, false, false, ['nature', 'mountain', 'couple'], ['Wi-Fi', 'Kitchen', 'Parking', 'Garden', 'BBQ'], '1605276374104-dee2a0ed3cd6', 'Estate bungalow overlooking terraced tea slopes'),
];
export const inr = (n) => '₹' + n.toLocaleString('en-IN');
