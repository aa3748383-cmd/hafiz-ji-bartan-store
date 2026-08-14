import { BUSINESS_DETAILS, WHATSAPP_MESSAGES } from '../lib/constants';

export const getWhatsAppLink = (customMessage?: string): string => {
  const message = customMessage || WHATSAPP_MESSAGES.general;
  return `https://wa.me/${BUSINESS_DETAILS.whatsappNumber}?text=${encodeURIComponent(message)}`;
};

export const getProductWhatsAppLink = (productName: string): string => {
  const message = WHATSAPP_MESSAGES.productEnquiry(productName);
  return `https://wa.me/${BUSINESS_DETAILS.whatsappNumber}?text=${encodeURIComponent(message)}`;
};

export const getPhoneCallLink = (): string => {
  return `tel:${BUSINESS_DETAILS.phone}`;
};

export const getDirectionsLink = (): string => {
  return BUSINESS_DETAILS.googleMapsUrl;
};
