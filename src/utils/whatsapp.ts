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
 * Formats a comprehensive, professional WhatsApp order notification message containing all order metadata.
 */
export const formatOrderWhatsAppMessage = (order: Order): string => {
  const itemsText = (order.items || [])
    .map(i => `• ${i.product_name} × ${i.quantity} - ₹${i.product_price} (Subtotal: ₹${i.subtotal})`)
    .join('\n');

  const paymentText = order.payment_method === 'cod'
    ? 'Cash on Delivery (COD)'
    : order.payment_method === 'whatsapp'
      ? 'WhatsApp Direct'
      : order.payment_method.toUpperCase();

  const statusText = order.order_status
    ? (order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1))
    : 'Pending';

  const formattedDate = order.created_at
    ? new Date(order.created_at).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    : new Date().toLocaleString('en-IN');

  const emailLine = order.customer_email ? `Customer Email: ${order.customer_email}\n` : '';

  return `🛒 NEW ORDER - HAFIZ JI BARTAN STORE

Order Number: ${order.order_number}
Order Date/Time: ${formattedDate}
Order Status: ${statusText}

Customer Details:
Customer Name: ${order.customer_name}
Customer Phone: ${order.customer_phone}
${emailLine}
Ordered Products:
${itemsText}

Subtotal: ₹${order.subtotal}
Delivery Charge: ${order.delivery_charge === 0 ? 'FREE' : `₹${order.delivery_charge}`}
Grand Total: ₹${order.grand_total}

Payment Method: ${paymentText}

Delivery Address:
${order.delivery_address}
${order.city}, ${order.state} - ${order.pincode}

Please process this order for delivery. Thank you!`;
};

/**
 * Returns the click-to-chat WhatsApp link for sending pre-filled order details to store admin (919838559670).
 */
export const getOrderWhatsAppLink = (order: Order): string => {
  const message = formatOrderWhatsAppMessage(order);
  return `https://wa.me/${BUSINESS_DETAILS.whatsappNumber}?text=${encodeURIComponent(message)}`;
};

/**
 * Returns the click-to-chat WhatsApp link for directly contacting the customer regarding their order.
 */
export const getCustomerWhatsAppLink = (order: Order): string => {
  const message = `Hello ${order.customer_name}, regarding your Hafiz Ji Bartan Store Order #${order.order_number} (Status: ${order.order_status}).`;
  const cleanPhone = order.customer_phone.replace(/\D/g, '');
  const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
};
