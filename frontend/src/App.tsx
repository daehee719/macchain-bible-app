import Button from 'src/components/ui/Button';
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import ReadingPlan from './pages/ReadingPlan'
import AIAnalysis from './pages/AIAnalysis'
import Community from './pages/Community'
import Statistics from './pages/Statistics'
import Settings from './pages/Settings'
import Login from './pages/Login'
import PrototypeHome from './pages/PrototypeHome'
import './App.css'
import './styles/tailwind.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
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
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App