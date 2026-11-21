// Business contact details used across the site.
export const SITE = { phone: '+917418311855', phoneLabel: '+91 74183 11855', wa: '917418311855' };
export const waLink = (msg = 'Hi! I’m interested in your villas. Could you share more details, please?') => `https://wa.me/${SITE.wa}?text=${encodeURIComponent(msg)}`;
