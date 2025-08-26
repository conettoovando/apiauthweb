import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import MeUser from './pages/MeUser'
import Verify from './pages/verify'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/verify" element={<Verify />}/>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MeUser />
          </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
