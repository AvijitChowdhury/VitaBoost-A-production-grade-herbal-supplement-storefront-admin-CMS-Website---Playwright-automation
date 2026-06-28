CREATE OR REPLACE FUNCTION public.debug_role()
RETURNS jsonb LANGUAGE sql STABLE AS $$
  SELECT jsonb_build_object(
    'current_user', current_user,
    'current_role', current_setting('role', true),
    'jwt_role', current_setting('request.jwt.claim.role', true)
  );
$$;
GRANT EXECUTE ON FUNCTION public.debug_role() TO anon, authenticated;
NOTIFY pgrst, 'reload schema';