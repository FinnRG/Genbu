import { useState } from 'react'
import WhiteboardToolbar from './toolbar/WhiteboardToolbar'
import { SetState, Tool } from './util'
import WhiteBoard from './Whiteboard'

interface WhiteboardViewProps {
  id: string
  setFolderViewOpened: SetState<boolean>
}

const WhiteboardView: React.FC<WhiteboardViewProps> = ({ id, setFolderViewOpened }) => {
  const [color, setColor] = useState('#000000')
  const [tool, setTool] = useState<Tool>('pen')

  const control = {
    color,
    setColor,
    tool,
    setTool
  }

  return (
    <>
      <WhiteboardToolbar control={control} setFolderViewOpened={setFolderViewOpened} />
      <WhiteBoard id={id} control={control} />
    </>
  )
}

export default WhiteboardView
