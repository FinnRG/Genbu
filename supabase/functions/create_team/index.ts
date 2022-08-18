import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { supabaseClient } from "../_shared/supabaseClient.ts"
import { corsHeaders } from "../_shared/cors.ts"

console.log("Hello from Functions!")

interface Request {
  users: Array<string>
  title: string
}

// TODO: Better feedback if this succeeded
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const jwt = req.headers.get('Authorization')!.replace('Bearer ', '');
  const inviter_id = (await supabaseClient.auth.api.getUser(jwt)).user?.id;

  const { users }: Request = await req.json()

  const res_users = users.map((email) => {
    return supabaseClient.from('user')
      .select('id,email')
      .eq('email', email)
      .single()
      .then(({ data }) => {
        return supabaseClient.from('team_invite')
          .insert({ invitee_id: data.id, inviter_id })
      })
  });

  (await Promise.all(res_users));

  return new Response(
    "{}",
    { headers: { "Content-Type": "application/json", ...corsHeaders } },
  )
})
