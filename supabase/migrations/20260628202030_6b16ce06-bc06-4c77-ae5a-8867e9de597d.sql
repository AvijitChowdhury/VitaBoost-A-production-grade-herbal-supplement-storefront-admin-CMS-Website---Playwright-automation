
-- 1) user_roles: block self-granting admin. Only admins may write.
CREATE POLICY "Admins insert user_roles" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update user_roles" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete user_roles" ON public.user_roles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 2) settings: keep current fields public but pin column-level grant so any
--    future column added to this table does NOT auto-leak to anon.
REVOKE SELECT ON public.settings FROM anon;
GRANT SELECT (id, store_name, logo, phone, email, facebook, instagram, whatsapp, updated_at)
  ON public.settings TO anon;

-- 3) SECURITY DEFINER helpers: revoke EXECUTE from signed-in roles. RLS
--    policies still invoke has_role as the function owner.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;

-- claim_first_admin is no longer needed (admin is provisioned). Remove the
-- self-grant path entirely.
DROP FUNCTION IF EXISTS public.claim_first_admin();

NOTIFY pgrst, 'reload schema';
