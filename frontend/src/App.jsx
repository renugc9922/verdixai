import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/Landing'
import LoginPage from './pages/Login'
import DashboardPage from './pages/Dashboard'
import DetectPage from './pages/Detect'
import ResultPage from './pages/Result'
import HistoryPage from './pages/History'
import AssistantPage from './pages/Assistant'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/detect" element={<DetectPage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/assistant" element={<AssistantPage />} />
      <Route path="/login" element={<LoginPage initialMode="login" />} />
      <Route path="/register" element={<LoginPage initialMode="register" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
