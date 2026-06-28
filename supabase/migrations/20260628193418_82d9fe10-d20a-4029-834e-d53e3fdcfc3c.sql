
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

DROP POLICY "Anyone can place an order" ON public.orders;
CREATE POLICY "Anyone can place an order" ON public.orders
  FOR INSERT
  WITH CHECK (
    length(customer_name) BETWEEN 1 AND 120
    AND length(phone) BETWEEN 4 AND 30
    AND length(address) BETWEEN 4 AND 500
    AND quantity > 0 AND quantity <= 100
    AND payment_method IN ('cod','online')
    AND status = 'pending'
  );
