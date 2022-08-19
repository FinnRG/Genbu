-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE OR REPLACE FUNCTION public.get_teams_for_authenticated_user(
	)
    RETURNS SETOF uuid 
    LANGUAGE 'sql'
    COST 100
    STABLE SECURITY DEFINER PARALLEL UNSAFE
    ROWS 1000

    SET search_path=public
AS $BODY$
    select team_id
    from user_team
    where user_id = auth.uid()
$BODY$;

ALTER FUNCTION public.get_teams_for_authenticated_user()
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.get_teams_for_authenticated_user() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.get_teams_for_authenticated_user() TO anon;

GRANT EXECUTE ON FUNCTION public.get_teams_for_authenticated_user() TO authenticated;

GRANT EXECUTE ON FUNCTION public.get_teams_for_authenticated_user() TO postgres;

GRANT EXECUTE ON FUNCTION public.get_teams_for_authenticated_user() TO service_role;

CREATE POLICY "Team members can view team members if they belong to the team."
    ON public.user_team
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((team_id IN ( SELECT get_teams_for_authenticated_user() AS get_teams_for_authenticated_user)));

CREATE POLICY "Team members can view their own team details."
    ON public.team
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((auth.uid() IN ( SELECT user_team.user_id
   FROM user_team
  WHERE (user_team.team_id = team.id))));