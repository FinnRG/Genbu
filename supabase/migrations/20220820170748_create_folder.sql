-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE TABLE IF NOT EXISTS public.folder
(
    id uuid NOT NULL,
    team_id uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    created_by uuid NOT NULL,
    parent_id uuid,
    CONSTRAINT folder_pkey PRIMARY KEY (id),
    CONSTRAINT folder_created_by_fkey FOREIGN KEY (created_by)
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT folder_parent_id_fkey FOREIGN KEY (parent_id)
        REFERENCES public.folder (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT folder_team_id_fkey FOREIGN KEY (team_id)
        REFERENCES public.team (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.folder
    OWNER to postgres;

ALTER TABLE IF EXISTS public.folder
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.folder TO anon;

GRANT ALL ON TABLE public.folder TO authenticated;

GRANT ALL ON TABLE public.folder TO postgres;

GRANT ALL ON TABLE public.folder TO service_role;