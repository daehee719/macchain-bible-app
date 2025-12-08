import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import ReadingPlan from './pages/ReadingPlan'
import AIAnalysis from './pages/AIAnalysis'
import Community from './pages/Community'
import Statistics from './pages/Statistics'
import Settings from './pages/Settings'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
            <Header />
            <main className="pt-20 min-h-screen">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/reading-plan" element={<ReadingPlan />} />
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
          </main>
        </div>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  )
}

export default App