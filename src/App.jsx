import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import LoginScreen from './pages/LoginScreen'
import ReportUpload from './pages/ReportUpload'
import DepartmentPortal from './pages/DepartmentPortal'
import AdminDashboard from './pages/AdminDashboard'
import ConductorPortal from './pages/ConductorPortal'

export default function App() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<LoginScreen />} />
    <Route path="/report" element={<ReportUpload />} />
    <Route path="/departments/:departmentId" element={<DepartmentPortal />} />
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/conductor" element={<ConductorPortal />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter>
}
