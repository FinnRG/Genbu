import { useEffect, useState } from 'react'
import supabase from '../../../clients/supabase'

interface Inviter {
    id: string
    name: string
}

interface Invite {
    created_at: string | null
    inviter: Inviter
}

const InviteOverview: React.FC = () => {
  const [invites, setInvites] = useState<Array<Invite | undefined>>()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      supabase.from('team_invite')
        .select(`
                created_at,
                inviter:inviter_id ( 
                    id,
                    name
                )
            `)
        .then((resp) => {
          return resp.data?.filter(({ inviter }) => {
            return (inviter as Inviter).id !== user?.id
          })
        })
        .then((data) => setInvites(data as Array<Invite> | undefined ?? []))
    })
  }, [])
  console.log(invites)

  return <></>
}

export default InviteOverview
