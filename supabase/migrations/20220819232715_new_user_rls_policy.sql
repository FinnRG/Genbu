-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE POLICY "Enable select based on id and invites"
    ON public."user"
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (((auth.uid() = id) OR (id IN ( SELECT team_invite.inviter_id
   FROM team_invite
  WHERE (team_invite.invitee_id = auth.uid())))));
