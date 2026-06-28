DROP POLICY IF EXISTS "Anyone can place an order" ON public.orders;
CREATE POLICY "Anyone can place an order" ON public.orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(customer_name) BETWEEN 1 AND 120
    AND length(phone) BETWEEN 4 AND 30
    AND length(address) BETWEEN 4 AND 500
    AND quantity > 0 AND quantity <= 100
    AND payment_method IN ('cod','online')
    AND status = 'pending'
  );