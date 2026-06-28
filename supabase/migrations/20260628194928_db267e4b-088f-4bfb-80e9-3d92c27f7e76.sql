
-- Add missing product.ingredients short text (PRD)
ALTER TABLE public.product ADD COLUMN IF NOT EXISTS ingredients text;

-- Add orders.updated_at for audit on status changes
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Attach updated_at triggers
DROP TRIGGER IF EXISTS product_set_updated_at ON public.product;
CREATE TRIGGER product_set_updated_at BEFORE UPDATE ON public.product
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS settings_set_updated_at ON public.settings;
CREATE TRIGGER settings_set_updated_at BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS orders_set_updated_at ON public.orders;
CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Ensure approved testimonials policy actually filters approved=true
DROP POLICY IF EXISTS "Public read approved testimonials" ON public.testimonials;
CREATE POLICY "Public read approved testimonials" ON public.testimonials
  FOR SELECT TO anon, authenticated
  USING (approved = true);

-- Normalize order status values to lowercase
UPDATE public.orders SET status = lower(status);
ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'pending';

-- Helper RPC for admins: list orders (bypasses anon visibility)
-- Already covered by RLS + has_role; no new function needed.
