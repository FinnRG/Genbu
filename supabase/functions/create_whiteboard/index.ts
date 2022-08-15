import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import * as Y from "https://cdn.skypack.dev/yjs@13.5.41"
import cryptoRandomString from "https://cdn.skypack.dev/crypto-random-string"
import { corsHeaders } from "../_shared/cors.ts"
import { supabaseClient } from "../_shared/supabaseClient.ts"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Set the Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    // supabaseClient.auth.setAuth(req.headers.get('Authorization')!.replace('Bearer ', ''))

    //@ts-ignore: Types for cryptoRandomString seem broken
    const room_key = cryptoRandomString({ length: 10 }) 

    const { data, error } = await supabaseClient.from('whiteboards')
      .insert([{ data: new Y.Doc(), room_key }])
    console.log({ data, error })

    return new Response(JSON.stringify({ data, error }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
