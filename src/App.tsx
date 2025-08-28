import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import MeUser from './pages/Dashboard'
import Verify from './pages/verify'

function App() {
  return (
    <Router >
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/verify" element={<Verify />}/>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MeUser />
          </ProtectedRoute>
        }/>
      </Routes>
    </Router>
  )
}

export default App
