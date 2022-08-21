import WhiteboardToolbar from './toolbar/WhiteboardToolbar'
import WhiteBoard from './Whiteboard'

interface WhiteboardViewProps {
  id: string
}

const WhiteboardView: React.FC<WhiteboardViewProps> = ({ id }) => {
  return (
    <>
      <WhiteboardToolbar />
      <WhiteBoard id={id} />
    </>
  )
}

export default WhiteboardView
