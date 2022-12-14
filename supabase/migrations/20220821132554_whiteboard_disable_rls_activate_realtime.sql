-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

REVOKE ALL ON TABLE public.user_team FROM anon;
REVOKE ALL ON TABLE public.user_team FROM postgres;
REVOKE ALL ON TABLE public.user_team FROM service_role;
GRANT ALL ON TABLE public.user_team TO anon;

GRANT ALL ON TABLE public.user_team TO service_role;

GRANT ALL ON TABLE public.user_team TO postgres;

ALTER TABLE IF EXISTS public.whiteboard
    DISABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.team_invite FROM authenticated;
REVOKE ALL ON TABLE public.team_invite FROM postgres;
REVOKE ALL ON TABLE public.team_invite FROM service_role;
GRANT ALL ON TABLE public.team_invite TO authenticated;

GRANT ALL ON TABLE public.team_invite TO service_role;

GRANT ALL ON TABLE public.team_invite TO postgres;

REVOKE ALL ON TABLE public.folder FROM anon;
REVOKE ALL ON TABLE public.folder FROM postgres;
REVOKE ALL ON TABLE public.folder FROM service_role;
GRANT ALL ON TABLE public.folder TO anon;

GRANT ALL ON TABLE public.folder TO service_role;

GRANT ALL ON TABLE public.folder TO postgres;
