import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { supabaseClient } from "../_shared/supabaseClient.ts"

interface Request {
  name: string
  folder_id: string
}

serve(async (req) => {
  console.log('New create_whiteboard request')
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

    const { name, folder_id }: Request = await req.json();
    // Set the Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    // supabaseClient.auth.setAuth(req.headers.get('Authorization')!.replace('Bearer ', ''))

    //@ts-ignore: Types for cryptoRandomString seem broken
    const room_key = ""

    const updateVector = "0,0"

    const { data, error } = await supabaseClient.from('whiteboard')
      .insert([{ updateVector, room_key, folder_id, name  }])
      .select()
      .single()

    return new Response(JSON.stringify({ data, error }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

})
