import { Button, Table } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons'
import { useEffect, useState } from 'react'
import supabase from '../../../clients/supabase'

interface PartialUser {
  id: string
  name: string
}

interface Team {
  id: string
  name: string
}

interface Invite {
  created_at: string | null
  inviter: PartialUser
  invitee: Omit<PartialUser, 'name'>
  team: Team
}

const InviteOverview: React.FC = () => {
  const [invites, setInvites] = useState<Invite[]>([])

  useEffect(() => {
    const fetchInvites = (): void => {
      supabase.auth.getUser().then(({ data: { user } }) => {
        supabase.from('team_invite')
          .select(`
                created_at,
                inviter:inviter_id ( 
                    id,
                    name
                ),
                invitee:invitee_id (
                    id
                ),
                team (
                    id,
                    name
                )
            `)
          .then((resp) => {
            return resp.data?.filter(({ inviter }) => {
              return (inviter as PartialUser).id !== user?.id
            })
          })
          .then((data) => setInvites(data as Invite[] | undefined ?? []))
      })
    }
    fetchInvites()
    // TODO: Better updating
    supabase.channel('public:team_invite')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'team_invite' },
        () => {
          fetchInvites()
        }
      )
  }, [])

  const deleteInvite = (invite: Invite): void => {
    supabase.from('team_invite')
      .delete()
      .match({ team_id: invite.team.id })
      .then(() => {
        setInvites(invites.filter(i => i.team.id !== invite.team.id))
      })
  }

  const onAccept = (invite: Invite): void => {
    supabase.from('user_team')
      .insert({ user_id: invite.invitee.id, team_id: invite.team.id })
      .then(() => {
        deleteInvite(invite)
      })
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>Team name</th>
          <th>Inviter</th>
          <th>Invited at</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {invites.map((invite, index) => (
          <tr key={index}>
            <td>{invite.team.name}</td>
            <td>{invite.inviter.name}</td>
            <td>{invite.created_at}</td>
            <td>
              <Button.Group>
                <Button size='sm' variant='default' onClick={() => onAccept(invite)}>
                  <IconCheck />
                </Button>
                <Button size='sm' variant='default' onClick={() => deleteInvite(invite)}>
                  <IconX />
                </Button>
              </Button.Group>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default InviteOverview
