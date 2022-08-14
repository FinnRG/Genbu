import './App.css'

import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import WhiteBoardView from './components/whiteboard/WhiteboardView'

const App: React.FC = () => {
  // Stage is a div container
  // Layer is actual canvas element (so you may have several canvases in the stage)
  // And then we have canvas shapes inside the Layer
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' />
        <Route path='/whiteboard' element={<WhiteBoardView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
