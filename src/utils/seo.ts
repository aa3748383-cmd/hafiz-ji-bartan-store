import { BUSINESS_DETAILS } from '../lib/constants';

export const updateSEOMetadata = ({
  title,
  description,
  keywords,
  canonicalUrl,
}: {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
}) => {
  const fullTitle = title 
    ? `${title} | ${BUSINESS_DETAILS.name}` 
    : `${BUSINESS_DETAILS.name} - Premier Bartan & Kitchen Utensils Store in Lalganj, Azamgarh`;

  const metaDesc = description || 
    `${BUSINESS_DETAILS.name} owned by ${BUSINESS_DETAILS.owner} in Lalganj, Azamgarh, UP. Top quality stainless steel bartan, aluminium vessels, pressure cookers, dinner sets, and kitchenware.`;

  const defaultKeywords = 'Hafiz Ji Bartan Store, Bartan Store Lalganj, Bartan shop Lalganj Azamgarh, Kitchen utensils Lalganj, Steel bartan Azamgarh, Kitchenware store UP';

  document.title = fullTitle;

  // Set meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', metaDesc);

  // Set meta keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    document.head.appendChild(metaKeywords);
  }
  metaKeywords.setAttribute('content', keywords || defaultKeywords);

  // Set Canonical URL
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl || window.location.href);

  // Open Graph Title
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute('content', fullTitle);

  // Open Graph Description
  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) {
    ogDesc = document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    document.head.appendChild(ogDesc);
  }
  ogDesc.setAttribute('content', metaDesc);
};

export const generateLocalBusinessSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeGoodsStore',
    'name': BUSINESS_DETAILS.name,
    'description': 'Premier retail store for high-quality stainless steel bartan, pressure cookers, aluminium utensils, dinner sets, and household kitchenware.',
    'telephone': BUSINESS_DETAILS.phone,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': BUSINESS_DETAILS.address,
      'addressLocality': BUSINESS_DETAILS.city,
      'addressRegion': BUSINESS_DETAILS.state,
      'addressCountry': BUSINESS_DETAILS.country
    },
    'founder': {
      '@type': 'Person',
      'name': BUSINESS_DETAILS.owner
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        'opens': '09:00',
        'closes': '21:00'
      }
    ],
    'url': window.location.origin
  };
};
