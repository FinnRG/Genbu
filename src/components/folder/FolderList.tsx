import { ActionIcon, Button, Center, Modal, Paper, Stack, TextInput, Text, ButtonProps } from '@mantine/core'
import { IconPlus } from '@tabler/icons'
import React, { useEffect, useState } from 'react'
import supabase from '../../clients/supabase'
import * as Y from 'yjs'
import { useListState, UseListStateHandlers } from '@mantine/hooks'

interface CreateWhiteboardModalProps {
  setModalOpened: React.Dispatch<React.SetStateAction<boolean>>
  modalOpened: boolean
  whiteboardsHandler: UseListStateHandlers<PartialWhiteboard>
  rootFolder: string | null
}

const CreateWhiteboardModal: React.FC<CreateWhiteboardModalProps> = (props) => {
  const [name, setName] = useState('')

  if (props.rootFolder === null) {
    return <></>
  }

  const onSubmit = (): void => {
    if (props.rootFolder === null) {
      // TODO: Proper error handling
      return
    }

    supabase.functions.invoke('create_whiteboard', {
      body: JSON.stringify({
        folder_id: props.rootFolder,
        name
      })
    }).then((resp) => {
      props.setModalOpened(false)
      const { data, error } = resp.data
      props.whiteboardsHandler.append({ id: data.id, name: data.name, folder: { id: props.rootFolder!, name } })
    })
  }

  return (
    <Modal
      opened={props.modalOpened}
      onClose={() => props.setModalOpened(false)}
      title='Create a new whiteboard'
    >
      <Stack>
        <TextInput
          label='Whiteboard name'
          placeholder='New name'
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
        <Button type='submit' onClick={() => onSubmit()}>Create</Button>
      </Stack>
    </Modal>
  )
}

interface FolderListProps {
  team: string | null
  whiteboard: string | null
  setWhiteboard: React.Dispatch<React.SetStateAction<string | null>>
  setDrawerOpened: React.Dispatch<React.SetStateAction<boolean>>
}

interface PartialWhiteboard {
  id: string
  name: string
  folder: {
    id: string
    name: string
  }
}

const FolderList: React.FC<FolderListProps> = ({ team, setWhiteboard, setDrawerOpened }) => {
  const [modalOpened, setModalOpened] = useState(false)
  const [rootFolder, setRootFolder] = useState<string | null>(null)
  const [whiteboards, whiteboardsHandler] = useListState<PartialWhiteboard>([])

  useEffect(() => {
    const fetchRootFolder = async (): Promise<string> => {
      return await supabase.from('folder')
        .select('*')
        .match({ team_id: team })
        .single()
        .then(({ data }) => {
          // TODO: This should be a proper error
          const folderId = data?.id ?? ''
          setRootFolder(folderId)
          return folderId
        })
    }

    const fetchWhiteboards = async (): Promise<void> => {
      const folderId = rootFolder ?? await fetchRootFolder()

      const { data } = await supabase.from('whiteboard')
        .select(`
                    id,
                    name,
                    folder (
                        id,
                        name
                    )
                `)
        .match({ folder_id: folderId })
      whiteboardsHandler.setState((data ?? []).map(x => x as PartialWhiteboard))
    }

    supabase.channel('public:whiteboard')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'whiteboard'
      }, () => {
        // TODO: check if the new whiteboard is in the current folder and if a refetch is necessary
        fetchWhiteboards()
      })
      .subscribe()

    fetchWhiteboards()
  }, [])

  return (
    <>
      <CreateWhiteboardModal modalOpened={modalOpened} setModalOpened={setModalOpened} whiteboardsHandler={whiteboardsHandler} rootFolder={rootFolder} />
      <Stack justify='center' align='stretch' spacing={0}>
        {whiteboards.map(board => {
          return (
            <Paper
              py='lg' key={board.id} radius={0} withBorder onClick={() => {
                setWhiteboard(board.id)
                setDrawerOpened(false)
              }}
            >
              <Text align='center'>
                {board.name}
              </Text>
            </Paper>
          )
        })}
        <Center pt='md'>
          <ActionIcon onClick={() => setModalOpened(true)}>
            <IconPlus />
          </ActionIcon>
        </Center>
      </Stack>
    </>
  )
}

export default FolderList
