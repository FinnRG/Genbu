import { Card, SimpleGrid, Text, ThemeIcon, Stack, Button, Modal, TextInput, MultiSelect, ColorInput, ActionIcon, Alert } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconAlertCircle, IconRefresh, IconUsers } from '@tabler/icons'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import supabase from '../../../clients/supabase'
import { getIconColor } from '../../util'

interface Team {
  name: string
  color: string
}

type TeamIDArray = Array<Team & { id: string }>
interface TeamTableProps {
  teams: TeamIDArray
}

const TeamTable: React.FC<TeamTableProps> = ({ teams }) => {
  return (
    <SimpleGrid
      cols={4}
      spacing='lg'
      breakpoints={[
        { maxWidth: 980, cols: 3, spacing: 'md' },
        { maxWidth: 755, cols: 2, spacing: 'sm' },
        { maxWidth: 600, cols: 1, spacing: 'sm' }
      ]}
    >
      {teams.map(({ id, name, color }, index) => (
        <Card key={index} shadow='sm' p='lg' radius='md' withBorder component={Link} to={`/app/team/${id}`}>
          <Stack align='center'>
            <ThemeIcon size='xl' variant='gradient' gradient={{ from: color, to: color }}>
              <IconUsers color={getIconColor(color)} />
            </ThemeIcon>

            <Text weight={500}>{name}</Text>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  )
}

interface CreateTeamFormValues {
  title: string
  users: string[]
}

interface CreateTeamButtonProps {
  fetchTeams: () => void
}

const CreateTeamButton: React.FC<CreateTeamButtonProps> = ({ fetchTeams }) => {
  const [opened, setOpened] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then((user) => {
      setConfirmed(user.data.user?.confirmed_at !== undefined)
    })
  }, [])

  const form = useForm<CreateTeamFormValues>({
    initialValues: {
      title: '',
      users: []
    },

    validate: {
      title: (val) => val.length >= 3 ? null : 'Title should at least 3 characters',
      users: (val) => val.every(v => /^\S+@\S+$/.test(v)) ? null : 'Invalid email'
    }
  })

  const onSubmit = (title: string, users: string[]): void => {
    supabase.functions.invoke('create_team', {
      body: JSON.stringify({ title, users, color })
    })
      .then(() => {
        setOpened(false)
        form.reset()
        fetchTeams()
      })
  }

  const randomColor = (): string => `#${Math.floor(Math.random() * 16777215).toString(16)}`
  const [color, setColor] = useState(randomColor())

  return (
    <Stack align='flex-end'>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title='Create a new Team'
      >
        {!confirmed && (
          <Alert icon={<IconAlertCircle size={16} />} color='red'>Please activate your account via the email sent to you and log in again before proceeding.</Alert>
        )}
        {confirmed && (
          <form onSubmit={form.onSubmit(({ title, users }) => onSubmit(title, users))}>
            <Stack>

              <TextInput
                required
                label='Title'
                placeholder='Team name'
                {...form.getInputProps('title')}
              />
              <MultiSelect
                required
                creatable
                searchable
                data={[]}
                label='Team members'
                placeholder='Enter the e-mail addresses of the users here '
                dropdownComponent='div'
                getCreateLabel={(query) => `+ Add ${query}`}
                onCreate={(query) => {
                  form.setFieldValue('users', [...form.values.users, query])
                  return { value: query, label: query }
                }}
                error={form.errors.users}
              />
              <ColorInput
                label='Team color'
                value={color}
                onChange={setColor}
                rightSection={
                  <ActionIcon onClick={() => setColor(randomColor())}>
                    <IconRefresh size={16} />
                  </ActionIcon>
        }
              />
              <Button type='submit' mt='md'>Submit</Button>
            </Stack>
          </form>
        )}
      </Modal>

      <Button onClick={() => setOpened(true)}>Create new Team</Button>
    </Stack>
  )
}

const TeamOverview: React.FC = () => {
  const [teams, setTeams] = useState<TeamIDArray>([])

  const fetchTeams = async (): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser()
    supabase.from('user_team')
      .select(`
        team_id,
        team (
          name,
          color
        )
      `)
      .eq('user_id', user?.id ?? '')
      .then(({ data }) => {
        setTeams(data?.map((team) => {
          return {
            id: team.team_id,
            name: (team.team as Team).name,
            color: (team.team as Team).color
          }
        }) ?? [])
      })
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  return (
    <>
      <CreateTeamButton fetchTeams={fetchTeams} />
      <TeamTable teams={teams} />
    </>
  )
}

export default TeamOverview
