import './App.css'

import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import WhiteBoardView from './components/whiteboard/WhiteboardView'
import supabase from './clients/supabase'
import HomeView from './components/home/HomeView'

const RequireAuth: React.FC = () => {
  if (supabase.auth.user() === null) {
    return <Navigate to='/signin' replace />
  }

  return <Outlet />
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomeView />} />
        <Route path='/app/' element={<RequireAuth />}>
          <Route path='whiteboard' element={<WhiteBoardView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
