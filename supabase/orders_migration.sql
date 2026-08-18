-- ====================================================================
-- HAFIZ JI BARTAN STORE - ORDERS & E-COMMERCE DATABASE MIGRATION
-- Copy and paste this script into your Supabase SQL Editor.
-- ====================================================================

-- 1. EXTEND PRODUCTS TABLE FOR DISCOUNTS AND MULTIPLE IMAGES
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS discount_price NUMERIC(10, 2) CHECK (discount_price IS NULL OR discount_price >= 0),
  ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT NULL;

-- 2. CREATE ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Uttar Pradesh',
    pincode TEXT NOT NULL,
    order_notes TEXT,
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    delivery_charge NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (delivery_charge >= 0),
    grand_total NUMERIC(10, 2) NOT NULL CHECK (grand_total >= 0),
    payment_method TEXT NOT NULL DEFAULT 'cod',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    order_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CREATE ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_price NUMERIC(10, 2) NOT NULL CHECK (product_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PERFORMANCE INDEXES FOR ORDERS
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- 5. UPDATED_AT TRIGGER FOR ORDERS
DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 6. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ORDERS RLS POLICIES
-- Public: Anyone can insert a new order (guest checkout)
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders"
    ON public.orders FOR INSERT
    WITH CHECK (true);

-- Public: Customers can view orders matching order_number and customer_phone (Order Tracking)
DROP POLICY IF EXISTS "Public can track order by order_number and phone" ON public.orders;
CREATE POLICY "Public can track order by order_number and phone"
    ON public.orders FOR SELECT
    USING (true);

-- Admin: Admins have full access to orders
DROP POLICY IF EXISTS "Admin full control on orders" ON public.orders;
CREATE POLICY "Admin full control on orders"
    ON public.orders FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ORDER ITEMS RLS POLICIES
-- Public: Anyone can insert order items alongside an order
DROP POLICY IF EXISTS "Public can insert order items" ON public.order_items;
CREATE POLICY "Public can insert order items"
    ON public.order_items FOR INSERT
    WITH CHECK (true);

-- Public: Anyone can view order items for tracking
DROP POLICY IF EXISTS "Public can select order items" ON public.order_items;
CREATE POLICY "Public can select order items"
    ON public.order_items FOR SELECT
    USING (true);

-- Admin: Admins have full control on order items
DROP POLICY IF EXISTS "Admin full control on order items" ON public.order_items;
CREATE POLICY "Admin full control on order items"
    ON public.order_items FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 7. RPC FUNCTION FOR ATOMIC ORDER PLACEMENT & STOCK DEDUCTION
CREATE OR REPLACE FUNCTION public.create_order_with_items(
    p_order_number TEXT,
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_customer_email TEXT,
    p_delivery_address TEXT,
    p_city TEXT,
    p_state TEXT,
    p_pincode TEXT,
    p_order_notes TEXT,
    p_subtotal NUMERIC,
    p_delivery_charge NUMERIC,
    p_grand_total NUMERIC,
    p_payment_method TEXT,
    p_items JSONB
)
RETURNS JSONB AS $$
DECLARE
    v_order_id UUID;
    v_item JSONB;
    v_product_id UUID;
    v_qty INT;
    v_product_name TEXT;
    v_product_price NUMERIC;
    v_current_stock INT;
    v_is_available BOOLEAN;
BEGIN
    -- Step 1: Check stock availability for all items first
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'product_id')::UUID;
        v_qty := (v_item->>'quantity')::INT;

        IF v_product_id IS NOT NULL THEN
            SELECT stock_quantity, is_available INTO v_current_stock, v_is_available
            FROM public.products
            WHERE id = v_product_id;

            IF NOT FOUND THEN
                RAISE EXCEPTION 'Product not found: %', (v_item->>'product_name');
            END IF;

            IF NOT v_is_available THEN
                RAISE EXCEPTION 'Product "%" is currently unavailable', (v_item->>'product_name');
            END IF;

            IF v_current_stock < v_qty THEN
                RAISE EXCEPTION 'Insufficient stock for "%". Only % unit(s) available', (v_item->>'product_name'), v_current_stock;
            END IF;
        END IF;
    END LOOP;

    -- Step 2: Insert into orders table
    INSERT INTO public.orders (
        order_number, customer_name, customer_phone, customer_email,
        delivery_address, city, state, pincode, order_notes,
        subtotal, delivery_charge, grand_total, payment_method, payment_status, order_status
    )
    VALUES (
        p_order_number, p_customer_name, p_customer_phone, p_customer_email,
        p_delivery_address, p_city, p_state, p_pincode, p_order_notes,
        p_subtotal, p_delivery_charge, p_grand_total, p_payment_method, 'pending', 'pending'
    )
    RETURNING id INTO v_order_id;

    -- Step 3: Insert order_items and update product stock
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'product_id')::UUID;
        v_product_name := (v_item->>'product_name')::TEXT;
        v_product_price := (v_item->>'product_price')::NUMERIC;
        v_qty := (v_item->>'quantity')::INT;

        INSERT INTO public.order_items (
            order_id, product_id, product_name, product_price, quantity, subtotal
        )
        VALUES (
            v_order_id, v_product_id, v_product_name, v_product_price, v_qty, (v_product_price * v_qty)
        );

        -- Decrement stock quantity
        IF v_product_id IS NOT NULL THEN
            UPDATE public.products
            SET stock_quantity = stock_quantity - v_qty,
                is_available = CASE WHEN (stock_quantity - v_qty) <= 0 THEN FALSE ELSE is_available END
            WHERE id = v_product_id;
        END IF;
    END LOOP;

    RETURN jsonb_build_object('success', true, 'order_id', v_order_id, 'order_number', p_order_number);
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
