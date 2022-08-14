import './App.css'

import React from 'react'
import WhiteBoard from './components/Whiteboard'

const App: React.FC = () => {
  // Stage is a div container
  // Layer is actual canvas element (so you may have several canvases in the stage)
  // And then we have canvas shapes inside the Layer
  return (
    <WhiteBoard />
  )
}

export default App
