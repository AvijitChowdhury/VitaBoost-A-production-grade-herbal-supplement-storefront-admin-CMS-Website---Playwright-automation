GRANT INSERT ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

-- Also ensure other public content tables are reachable
GRANT SELECT ON public.product, public.benefits, public.ingredients, public.testimonials, public.faq, public.settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product, public.benefits, public.ingredients, public.testimonials, public.faq, public.settings TO authenticated;
GRANT ALL ON public.product, public.benefits, public.ingredients, public.testimonials, public.faq, public.settings TO service_role;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;