import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginScreen from './pages/LoginScreen'
import Dashboard from './pages/Dashboard'
import PassengerView from './pages/PassengerView'
import { useStore } from './lib/store'

export default function App() {
  const role = useStore((s) => s.role)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={role ? <Navigate to="/dashboard" replace /> : <LoginScreen />} />
        <Route path="/dashboard" element={role ? <Dashboard /> : <Navigate to="/" replace />} />
        <Route path="/passenger" element={<PassengerView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
