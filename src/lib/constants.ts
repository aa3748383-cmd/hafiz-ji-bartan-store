import type { BusinessInfo } from '../types';

export const BUSINESS_DETAILS: BusinessInfo = {
  name: 'Hafiz Ji Bartan Store',
  owner: 'Akhlaq Ahmad',
  phone: '9838559670',
  formattedPhone: '+91 98385 59670',
  address: 'Main Road, Lalganj',
  city: 'Azamgarh',
  state: 'Uttar Pradesh',
  country: 'India',
  fullAddress: 'Main Road, Lalganj, Azamgarh, Uttar Pradesh, India',
  whatsappNumber: '919838559670',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Hafiz+Ji+Bartan+Store+Main+Road+Lalganj+Azamgarh+Uttar+Pradesh+India'
};

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Categories', path: '/categories' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export const WHATSAPP_MESSAGES = {
  general: 'Hello, I want to enquire about products from Hafiz Ji Bartan Store.',
  productEnquiry: (productName: string) => 
    `Hello, I want to enquire about ${productName} from Hafiz Ji Bartan Store.`,
};

export const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80';
export const DEFAULT_CATEGORY_IMAGE = 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80';
