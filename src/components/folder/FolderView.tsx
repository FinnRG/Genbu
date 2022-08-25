import { Drawer, useMantineTheme } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import WhiteboardView from '../whiteboard/WhiteboardView'
import FolderList from './FolderList'

const FolderView: React.FC = () => {
  const theme = useMantineTheme()
  const { teamId } = useParams()
  const [opened, setOpened] = useState(true)
  const [whiteboard, setWhiteboard] = useState<string | null>(null)

  if (teamId === undefined) {
    return <></>
  }

  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => { setOpened(false) }}
        withCloseButton={false}
        closeOnClickOutside={whiteboard !== null}
        closeOnEscape={whiteboard !== null}
        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <FolderList team={teamId} whiteboard={whiteboard} setWhiteboard={setWhiteboard} setDrawerOpened={setOpened} />
      </Drawer>
      {whiteboard !== null && (
        <WhiteboardView id={whiteboard} setFolderViewOpened={setOpened} />
      )}
    </>
  )
}

export default FolderView
