import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { 
  Order, 
  OrderStatus, 
  CheckoutFormData, 
  CartItem, 
  OrderFilters, 
  OrderStats 
} from '../types';

const LOCAL_ORDERS_STORAGE_KEY = 'hbsweb_demo_orders_v1';

// Helper to get local demo orders
const getLocalOrders = (): Order[] => {
  try {
    const saved = localStorage.getItem(LOCAL_ORDERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : getInitialDemoOrders();
  } catch {
    return getInitialDemoOrders();
  }
};

// Helper to save local demo orders
const saveLocalOrders = (orders: Order[]) => {
  try {
    localStorage.setItem(LOCAL_ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save demo orders to localStorage:', err);
  }
};

const getInitialDemoOrders = (): Order[] => [
  {
    id: 'ord-demo-101',
    order_number: 'HBS-DEMO-9821',
    customer_name: 'Rahul Verma',
    customer_phone: '9876543210',
    customer_email: 'rahul.verma@example.com',
    delivery_address: 'House #45, Near Main Market, Lalganj',
    city: 'Lalganj',
    state: 'Uttar Pradesh',
    pincode: '276202',
    order_notes: 'Please call before delivery',
    subtotal: 900,
    delivery_charge: 0,
    grand_total: 900,
    payment_method: 'cod',
    payment_status: 'pending',
    order_status: 'confirmed',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    items: [
      {
        id: 'ord-item-1',
        order_id: 'ord-demo-101',
        product_id: 'p1',
        product_name: '[Demo] Premium Stainless Steel Thali Set',
        product_price: 450,
        quantity: 2,
        subtotal: 900
      }
    ]
  },
  {
    id: 'ord-demo-102',
    order_number: 'HBS-DEMO-7612',
    customer_name: 'Priya Sharma',
    customer_phone: '9123456789',
    customer_email: 'priya@example.com',
    delivery_address: 'Station Road, Azamgarh',
    city: 'Azamgarh',
    state: 'Uttar Pradesh',
    pincode: '276001',
    order_notes: '',
    subtotal: 1250,
    delivery_charge: 0,
    grand_total: 1250,
    payment_method: 'cod',
    payment_status: 'pending',
    order_status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    items: [
      {
        id: 'ord-item-2',
        order_id: 'ord-demo-102',
        product_id: 'p3',
        product_name: '[Demo] 5-Litre Outer Lid Aluminium Pressure Cooker',
        product_price: 1250,
        quantity: 1,
        subtotal: 1250
      }
    ]
  }
];

export const generateOrderNumber = (): string => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `HBS-${dateStr}-${randomSuffix}`;
};

export const createOrder = async (
  formData: CheckoutFormData,
  cartItems: CartItem[],
  subtotal: number,
  deliveryCharge: number,
  grandTotal: number
): Promise<{ data: Order | null; error: string | null }> => {
  const orderNumber = generateOrderNumber();

  const formattedItemsPayload = cartItems.map(item => ({
    product_id: item.product.id,
    product_name: item.product.name,
    product_price: item.product.discount_price && item.product.discount_price > 0 ? item.product.discount_price : item.product.price,
    quantity: item.quantity,
    subtotal: (item.product.discount_price && item.product.discount_price > 0 ? item.product.discount_price : item.product.price) * item.quantity
  }));

  if (isSupabaseConfigured()) {
    try {
      // 1. Try calling PostgreSQL RPC function
      const { data: rpcRes, error: rpcErr } = await supabase.rpc('create_order_with_items', {
        p_order_number: orderNumber,
        p_customer_name: formData.customerName,
        p_customer_phone: formData.customerPhone,
        p_customer_email: formData.customerEmail || null,
        p_delivery_address: formData.deliveryAddress,
        p_city: formData.city,
        p_state: formData.state,
        p_pincode: formData.pincode,
        p_order_notes: formData.orderNotes || null,
        p_subtotal: subtotal,
        p_delivery_charge: deliveryCharge,
        p_grand_total: grandTotal,
        p_payment_method: formData.paymentMethod,
        p_items: formattedItemsPayload
      });

      if (!rpcErr && rpcRes && rpcRes.success) {
        const orderId = rpcRes.order_id;
        const newOrder: Order = {
          id: orderId,
          order_number: orderNumber,
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone,
          customer_email: formData.customerEmail || null,
          delivery_address: formData.deliveryAddress,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          order_notes: formData.orderNotes || null,
          subtotal,
          delivery_charge: deliveryCharge,
          grand_total: grandTotal,
          payment_method: formData.paymentMethod,
          payment_status: 'pending',
          order_status: 'pending',
          created_at: new Date().toISOString(),
          items: formattedItemsPayload.map(i => ({
            product_id: i.product_id,
            product_name: i.product_name,
            product_price: i.product_price,
            quantity: i.quantity,
            subtotal: i.subtotal
          }))
        };
        return { data: newOrder, error: null };
      }

      // If RPC fails or is missing, fallback to direct tables insert
      console.warn('RPC create_order_with_items unavailable or returned error, executing direct table insert:', rpcErr?.message);
      
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert([{
          order_number: orderNumber,
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone,
          customer_email: formData.customerEmail || null,
          delivery_address: formData.deliveryAddress,
          city: formData.city,
          state: formData.state || 'Uttar Pradesh',
          pincode: formData.pincode,
          order_notes: formData.orderNotes || null,
          subtotal,
          delivery_charge: deliveryCharge,
          grand_total: grandTotal,
          payment_method: formData.paymentMethod,
          payment_status: 'pending',
          order_status: 'pending'
        }])
        .select()
        .single();

      if (orderErr) throw orderErr;

      const orderItemsToInsert = formattedItemsPayload.map(item => ({
        order_id: orderData.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_price: item.product_price,
        quantity: item.quantity,
        subtotal: item.subtotal
      }));

      const { data: itemsData, error: itemsErr } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert)
        .select();

      if (itemsErr) console.warn('Failed to insert order items:', itemsErr);

      // Decrement product stock directly
      for (const item of cartItems) {
        const newStock = Math.max(0, item.product.stock_quantity - item.quantity);
        await supabase
          .from('products')
          .update({ 
            stock_quantity: newStock,
            is_available: newStock > 0 
          })
          .eq('id', item.product.id);
      }

      const completeOrder: Order = {
        ...orderData,
        items: itemsData || orderItemsToInsert
      };

      return { data: completeOrder, error: null };

    } catch (err: any) {
      console.warn('Supabase order creation failed, creating local demo order:', err?.message || err);
    }
  }

  // Local demo order fallback when Supabase is not connected
  const localOrder: Order = {
    id: `ord-local-${Date.now()}`,
    order_number: orderNumber,
    customer_name: formData.customerName,
    customer_phone: formData.customerPhone,
    customer_email: formData.customerEmail || null,
    delivery_address: formData.deliveryAddress,
    city: formData.city,
    state: formData.state || 'Uttar Pradesh',
    pincode: formData.pincode,
    order_notes: formData.orderNotes || null,
    subtotal,
    delivery_charge: deliveryCharge,
    grand_total: grandTotal,
    payment_method: formData.paymentMethod,
    payment_status: 'pending',
    order_status: 'pending',
    created_at: new Date().toISOString(),
    items: formattedItemsPayload.map(i => ({
      id: `item-${Date.now()}-${Math.random()}`,
      order_id: `ord-local-${Date.now()}`,
      product_id: i.product_id,
      product_name: i.product_name,
      product_price: i.product_price,
      quantity: i.quantity,
      subtotal: i.subtotal
    }))
  };

  const currentLocals = getLocalOrders();
  saveLocalOrders([localOrder, ...currentLocals]);

  return { data: localOrder, error: null };
};

export const trackOrder = async (
  orderNumber: string,
  customerPhone: string
): Promise<{ data: Order | null; error: string | null }> => {
  const cleanOrderNum = orderNumber.trim().toUpperCase();
  const cleanPhone = customerPhone.trim().replace(/\D/g, '');

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .ilike('order_number', cleanOrderNum)
        .single();

      if (!error && data) {
        // Normalize phone match (allowing last 10 digits comparison)
        const orderPhoneClean = data.customer_phone.replace(/\D/g, '');
        if (orderPhoneClean.endsWith(cleanPhone) || cleanPhone.endsWith(orderPhoneClean)) {
          return { data: data as Order, error: null };
        }
      }
    } catch (err) {
      console.warn('Supabase track order failed, searching local demo orders:', err);
    }
  }

  // Local fallback
  const locals = getLocalOrders();
  const found = locals.find(o => {
    const isOrderMatch = o.order_number.toUpperCase() === cleanOrderNum;
    const phoneClean = o.customer_phone.replace(/\D/g, '');
    const isPhoneMatch = phoneClean.endsWith(cleanPhone) || cleanPhone.endsWith(phoneClean);
    return isOrderMatch && isPhoneMatch;
  });

  if (found) {
    return { data: found, error: null };
  }

  return { data: null, error: 'No order found matching this Order Number and Phone Number combination.' };
};

export const getOrderDetailsByNumber = async (
  orderNumber: string
): Promise<{ data: Order | null; error: string | null }> => {
  const cleanOrderNum = orderNumber.trim().toUpperCase();

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .ilike('order_number', cleanOrderNum)
        .single();

      if (!error && data) {
        return { data: data as Order, error: null };
      }
    } catch (err) {
      console.warn('Supabase get order by number failed:', err);
    }
  }

  // Local fallback
  const locals = getLocalOrders();
  const found = locals.find(o => o.order_number.toUpperCase() === cleanOrderNum);
  return { data: found || null, error: found ? null : 'Order not found' };
};

export const getOrders = async (
  filters?: OrderFilters
): Promise<{ data: Order[]; error: string | null }> => {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .order('created_at', { ascending: false });

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('order_status', filters.status);
      }

      if (filters?.search && filters.search.trim()) {
        const term = `%${filters.search.trim()}%`;
        query = query.or(`order_number.ilike.${term},customer_name.ilike.${term},customer_phone.ilike.${term}`);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return { data: data as Order[], error: null };
      }
    } catch (err) {
      console.warn('Supabase getOrders failed, using local orders fallback:', err);
    }
  }

  let locals = getLocalOrders();
  if (filters?.status && filters.status !== 'all') {
    locals = locals.filter(o => o.order_status === filters.status);
  }
  if (filters?.search && filters.search.trim()) {
    const term = filters.search.toLowerCase();
    locals = locals.filter(o => 
      o.order_number.toLowerCase().includes(term) ||
      o.customer_name.toLowerCase().includes(term) ||
      o.customer_phone.includes(term)
    );
  }

  return { data: locals, error: null };
};

export const updateOrderStatus = async (
  orderId: string,
  newStatus: OrderStatus
): Promise<{ success: boolean; error: string | null }> => {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: newStatus })
        .eq('id', orderId);

      if (!error) {
        return { success: true, error: null };
      }
    } catch (err: any) {
      console.warn('Supabase update status failed, updating local state:', err);
    }
  }

  // Local fallback
  const locals = getLocalOrders();
  const updated = locals.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o);
  saveLocalOrders(updated);
  return { success: true, error: null };
};

export const getOrderStats = async (): Promise<{ data: OrderStats; error: string | null }> => {
  const res = await getOrders();
  const orders = res.data || [];

  const stats: OrderStats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.order_status === 'pending').length,
    confirmedOrders: orders.filter(o => o.order_status === 'confirmed' || o.order_status === 'processing').length,
    deliveredOrders: orders.filter(o => o.order_status === 'delivered').length,
    totalRevenue: orders.reduce((sum, o) => o.order_status !== 'cancelled' ? sum + o.grand_total : sum, 0)
  };

  return { data: stats, error: null };
};
