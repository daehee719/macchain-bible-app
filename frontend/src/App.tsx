import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import ReadingPlan from './pages/ReadingPlan_v2'
import AIAnalysis from './pages/AIAnalysis_v2'
import Community from './pages/Community_v2'
import Statistics from './pages/Statistics_v2'
import Settings from './pages/Settings_v2'
import Login from './pages/Login_v2'
import PrototypeHome from './pages/PrototypeHome'
import './App.css'
import './styles/tailwind.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reading-plan" element={<ReadingPlan />} />
            <Route path="/prototype" element={<PrototypeHome />} />
            <Route path="/ai-analysis" element={
              <ProtectedRoute>
                <AIAnalysis />
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            } />
            <Route path="/statistics" element={
              <ProtectedRoute>
                <Statistics />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  )
}

export default App