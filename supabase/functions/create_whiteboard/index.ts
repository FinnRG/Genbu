import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import * as Y from "https://cdn.skypack.dev/yjs@13.5.41"
import cryptoRandomString from "https://cdn.skypack.dev/crypto-random-string"
import { corsHeaders } from "../_shared/cors.ts"
import { supabaseClient } from "../_shared/supabaseClient.ts"

interface Request {
  name: string
  folder_id: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

    const { name, folder_id }: Request = await req.json();
    // Set the Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    // supabaseClient.auth.setAuth(req.headers.get('Authorization')!.replace('Bearer ', ''))

    //@ts-ignore: Types for cryptoRandomString seem broken
    const room_key = cryptoRandomString({ length: 10 }) 

    const json = {
      data: Y.encodeStateAsUpdate(new Y.Doc())
    }

    const { data, error } = await supabaseClient.from('whiteboard')
      .insert([{ data: json, room_key, folder_id, name  }])
      .select()
      .single()

    return new Response(JSON.stringify({ data, error }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

})
