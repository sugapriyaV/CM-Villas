// EDIT: placeholder business details (demonstration content, not real contacts).
export const SITE = { phone: '+910000000000', phoneLabel: '+91 00000 00000', wa: '910000000000', email: 'hello@cmvillas.example' };
export const waLink = (msg = 'Hi, I found CM Villas and would like to know more.') => `https://wa.me/${SITE.wa}?text=${encodeURIComponent(msg)}`;
