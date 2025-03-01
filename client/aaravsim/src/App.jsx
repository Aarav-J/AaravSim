import { useState, useEffect } from 'react'
import AuthDashboard from './Components/AuthDashboard'
import StockDashboard from './Components/StockDashboard'
import UserDashboard from './Components/UserDashboard'
import LandingPage from './Components/LandingPage'
import Sidebar from './Components/Sidebar'
import useStore from './store'
import { Toaster } from 'react-hot-toast'
import './styles/Navbar.scss'
import './styles/Main.scss'

const App = () => {
  const user = useStore((state) => state.user)
  const selectedDashboard = useStore((state) => state.selectedDashboard)
  const pendingUsername = useStore((state) => state.pendingUsername)
  const setSelectedDashboard = useStore((state) => state.setSelectedDashboard)
  
  // Track auth state from a central place
  useEffect(() => {
    console.log("App effect running:", { user, selectedDashboard, pendingUsername })
    
    // Only redirect if user exists AND no pending username setup
    if (user && selectedDashboard === 'auth' && !pendingUsername) {
      console.log("Redirecting to home because user exists")
      setSelectedDashboard('home')
    }
  }, [user, selectedDashboard, pendingUsername, setSelectedDashboard])
  
  const renderDashboard = () => {
    // Force auth dashboard if we're setting up a username
    if (pendingUsername) {
      return <AuthDashboard />
    }
    
    switch (selectedDashboard) {
      case 'home':
        return <UserDashboard />
      case 'stock':
        return <StockDashboard />
      case 'profile':
        return <UserDashboard />
      case 'landing':
        return <LandingPage />
      case 'auth':
        return <AuthDashboard />
      default:
        return <UserDashboard />
    }
  }
  
  // THE KEY FIX: Update navigation logic to account for pendingUsername
  return (
    <div className="App">
      <Toaster position='top-right' />
      
      {selectedDashboard === 'landing' && !pendingUsername ? (
        <LandingPage />
      ) : (
        <div className="app-container">
          {user && selectedDashboard !== 'auth' && !pendingUsername && <Sidebar />}
          <div className="main-content">
            {renderDashboard()}
          </div>
        </div>
      )}
    </div>
  )
}

export default App