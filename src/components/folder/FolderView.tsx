import { Drawer } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import FolderList from './FolderList'

const FolderView: React.FC = () => {
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
        onClose={() => {}}
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
        overlayOpacity={0}
      >
        <FolderList team={teamId} whiteboard={whiteboard} setWhiteboard={setWhiteboard} />
      </Drawer>
    </>
  )
}

export default FolderView
