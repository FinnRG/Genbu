-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

REVOKE ALL ON TABLE public.folder FROM authenticated;
REVOKE ALL ON TABLE public.folder FROM service_role;
REVOKE ALL ON TABLE public.folder FROM postgres;
GRANT ALL ON TABLE public.folder TO authenticated;

GRANT ALL ON TABLE public.folder TO postgres;

GRANT ALL ON TABLE public.folder TO service_role;

ALTER TABLE IF EXISTS public.whiteboard
    ADD COLUMN name text COLLATE pg_catalog."default" NOT NULL;
