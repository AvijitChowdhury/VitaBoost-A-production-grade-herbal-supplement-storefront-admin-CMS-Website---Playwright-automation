
CREATE OR REPLACE FUNCTION public.enforce_order_total_price()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  unit_price numeric;
BEGIN
  SELECT COALESCE(discount_price, price)
    INTO unit_price
    FROM public.product
    ORDER BY updated_at DESC
    LIMIT 1;

  IF unit_price IS NULL THEN
    RAISE EXCEPTION 'No product available to price this order';
  END IF;

  NEW.total_price := ROUND((unit_price * NEW.quantity)::numeric, 2);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_order_total_price_trg ON public.orders;
CREATE TRIGGER enforce_order_total_price_trg
  BEFORE INSERT OR UPDATE OF quantity, total_price ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_order_total_price();
