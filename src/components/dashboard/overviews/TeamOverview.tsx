import { Card, SimpleGrid, Text, ThemeIcon, Stack, Button, Modal, TextInput, MultiSelect, ColorInput, ActionIcon } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconRefresh, IconUsers } from '@tabler/icons'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import supabase from '../../../clients/supabase'

interface Team {
  name: string
  color: string
}

const getIconColor = (hexString: string): string => {
  const [red, green, blue] = hexString.substring(1).split(/(..)/g)
    .filter(s => s)
    .map(x => parseInt(x, 16))
  if ((red * 0.299 + green * 0.587 + blue * 0.114) > 186) {
    return '#000000'
  }

  return '#FFFFFF'
}

const TeamTable: React.FC = () => {
  const [teams, setTeams] = useState<Array<Team & { id: string }>>([])

  useEffect(() => {
    const getTeams = async (): Promise<void> => {
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

    getTeams()
  }, [])

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

const CreateTeamButton: React.FC = () => {
  const [opened, setOpened] = useState(false)
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
      </Modal>

      <Button onClick={() => setOpened(true)}>Create new Team</Button>
    </Stack>
  )
}

const TeamOverview: React.FC = () => {
  return (
    <>
      <CreateTeamButton />
      <TeamTable />
    </>
  )
}

export default TeamOverview
