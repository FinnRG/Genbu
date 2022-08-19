import './App.css'

import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import WhiteBoardView from './components/whiteboard/WhiteboardView'
import supabase from './clients/supabase'
import HomeView from './components/home/HomeView'
import Dashboard from './components/dashboard/Dashboard'

const RequireAuth: React.FC = () => {
  if (supabase.auth.getUser() === null) {
    return <Navigate to='/' replace />
  }

  return <Outlet />
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomeView />} />
        <Route path='/app/' element={<RequireAuth />}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='whiteboard' element={<WhiteBoardView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
