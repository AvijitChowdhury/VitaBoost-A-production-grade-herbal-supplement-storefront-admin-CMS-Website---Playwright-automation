
-- Grant Data API access to all public content tables
GRANT SELECT ON public.product TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product TO authenticated;
GRANT ALL ON public.product TO service_role;

GRANT SELECT ON public.benefits TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.benefits TO authenticated;
GRANT ALL ON public.benefits TO service_role;

GRANT SELECT ON public.ingredients TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ingredients TO authenticated;
GRANT ALL ON public.ingredients TO service_role;

GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;

GRANT SELECT ON public.faq TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faq TO authenticated;
GRANT ALL ON public.faq TO service_role;

GRANT SELECT ON public.settings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO authenticated;
GRANT ALL ON public.settings TO service_role;

-- Orders: anon can INSERT only (matches RLS policy); admins (authenticated) get full
GRANT INSERT ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

-- user_roles: read by authenticated via has_role security definer; admin tools may select
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
