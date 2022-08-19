import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { supabaseClient } from "../_shared/supabaseClient.ts"
import { corsHeaders } from "../_shared/cors.ts"

console.log("Hello from Functions!")

interface Request {
  users: Array<string>
  title: string
  color: string
}

// TODO: Better feedback if this fails
// TODO: Check if this could implemented with a database function
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Retrieve user information
  const jwt = req.headers.get('Authorization')!.replace('Bearer ', '');
  const user = (await supabaseClient.auth.getUser(jwt)).data.user;
  if (user === null) {
    return new Response('', {
      status: 401
    })
  }

  const inviter_id = user.id;
  const { title, users, color }: Request = await req.json();

  // Create team
  const { data: teamData, error } = await supabaseClient.from('team')
    .insert({ name: title, color })
    .select("id")
    .single();

  if (teamData === undefined || error !== undefined) {
    console.error(`Returned undefined team data with error: ${JSON.stringify(error)}`);
    return new Response('', {
      status: 401
    })
  }

  // Create team invites
  const res_users = users.map((email) => {
    return supabaseClient.from('user')
      .select('id,email')
      .eq('email', email)
      .single()
      .then(({ data }): PromiseLike<any> => {
        if (data !== undefined) {
          return supabaseClient.from('team_invite')
            .insert({ invitee_id: data.id, inviter_id, team_id: teamData.id })
        }
        return Promise.resolve()
      })
  });

  await supabaseClient.from('user_team')
    .insert({ user_id: inviter_id, team_id: teamData.id });

  (await Promise.all(res_users));

  return new Response(
    "{}",
    { headers: { "Content-Type": "application/json", ...corsHeaders } },
  )
})
