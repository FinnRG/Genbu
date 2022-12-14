-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE TABLE IF NOT EXISTS public.team
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    color character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT teams_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.team
    OWNER to postgres;

ALTER TABLE IF EXISTS public.team
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.team TO anon;

GRANT ALL ON TABLE public.team TO authenticated;

GRANT ALL ON TABLE public.team TO postgres;

GRANT ALL ON TABLE public.team TO service_role;

CREATE TABLE IF NOT EXISTS public.user_team
(
    user_id uuid NOT NULL,
    team_id uuid NOT NULL,
    CONSTRAINT user_team_pkey PRIMARY KEY (user_id, team_id),
    CONSTRAINT user_team_team_id_fkey FOREIGN KEY (team_id)
        REFERENCES public.team (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT user_team_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.user (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_team
    OWNER to postgres;

ALTER TABLE IF EXISTS public.user_team
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.user_team TO anon;

GRANT ALL ON TABLE public.user_team TO authenticated;

GRANT ALL ON TABLE public.user_team TO postgres;

GRANT ALL ON TABLE public.user_team TO service_role;

CREATE TABLE IF NOT EXISTS public.whiteboard
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    data json NOT NULL,
    room_key character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT whiteboard_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.whiteboard
    OWNER to postgres;

ALTER TABLE IF EXISTS public.whiteboard
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.whiteboard TO anon;

GRANT ALL ON TABLE public.whiteboard TO authenticated;

GRANT ALL ON TABLE public.whiteboard TO postgres;

GRANT ALL ON TABLE public.whiteboard TO service_role;

DROP TABLE IF EXISTS public.whiteboards CASCADE;
