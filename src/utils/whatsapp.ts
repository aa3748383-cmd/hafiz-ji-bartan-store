import { BUSINESS_DETAILS, WHATSAPP_MESSAGES } from '../lib/constants';
import type { Order } from '../types';

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

/**
 * Formats a professional WhatsApp order notification message according to store specifications.
 */
export const formatOrderWhatsAppMessage = (order: Order): string => {
  const itemsText = (order.items || [])
    .map(i => `- ${i.product_name} × ${i.quantity} = ₹${i.subtotal}`)
    .join('\n');

  const paymentText = order.payment_method === 'cod'
    ? 'Cash on Delivery (COD)'
    : order.payment_method === 'whatsapp'
      ? 'WhatsApp Direct'
      : order.payment_method.toUpperCase();

  const statusText = order.order_status
    ? (order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1))
    : 'Pending';

  return `🛒 NEW ORDER - HAFIZ JI BARTAN STORE

Order No: ${order.order_number}

Customer: ${order.customer_name}
Phone: ${order.customer_phone}

Items:
${itemsText}

Subtotal: ₹${order.subtotal}
Delivery: ₹${order.delivery_charge}
Total: ₹${order.grand_total}

Delivery Address:
${order.delivery_address}
${order.city}, ${order.state} - ${order.pincode}

Payment Method: ${paymentText}
Order Status: ${statusText}`;
};

/**
 * Returns the click-to-chat WhatsApp link for a created order.
 */
export const getOrderWhatsAppLink = (order: Order): string => {
  const message = formatOrderWhatsAppMessage(order);
  return `https://wa.me/${BUSINESS_DETAILS.whatsappNumber}?text=${encodeURIComponent(message)}`;
};
