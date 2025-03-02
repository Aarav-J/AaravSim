import { 
  ArrowRight, 
  GithubLogo, 
  GoogleLogo, 
  ChartLineUp, 
  ShieldCheck
} from "@phosphor-icons/react"
import "../styles/AuthDashboard.scss"
import {
  OauthSignIn,
  getProfileData,
  insertProfileData,
  updateProfileData
} from "../utils/authUtils"
import useStore from "../store"
import React, { useState, useEffect } from 'react'
import supabase from "../SupabaseClient"
// import { LoadingOverlay, LoadingButton } from "./LoadingComponent"
const AuthDashboard = () => {
  const setUser = useStore((state) => state.setUser)
  const setSelectedDashboard = useStore((state) => state.setSelectedDashboard)
  const setSession = useStore((state) => state.setSession)
  const [username, setUsername] = useState('')
  const [needUsername, setNeedUsername] = useState(false)
  const [fullName, setFullname] = useState('')
  const [userId, setUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Key fix: Check for pending username setup
  const pendingUsername = useStore((state) => state.pendingUsername)
  
  const processSession = (session) => {
    if (session) {
      const { id, user_metadata } = session.user
      const sessionUsername = user_metadata?.user_name || ''
      const sessionFullName = user_metadata?.full_name || ''
      setFullname(sessionFullName)
      setUsername(sessionUsername)
      setUserId(id)

      // Check for an existing profile row
      getProfileData(id).then(({ profiles, error }) => {
        if (!error) {
          if (profiles && profiles.length > 0) {
            // If a profile exists, use the DB value for username
            const dbUsername = profiles[0].username
            if (dbUsername && dbUsername.trim() !== '') {
              setNeedUsername(false)
              // Full user setup complete
              setUser({ 
                id, 
                name: sessionFullName, 
                username: dbUsername, 
                accountValue: profiles[0].accountValue, 
                watchlist: profiles[0].watchlist 
              })
            } else {
              // Existing row but username is still empty.
              setNeedUsername(true)
              // Set temporary user state with pendingUsername flag
              useStore.getState().setPendingUsername(true, id, sessionFullName)
            }
          } else {
            // No profile row exists. Always create a row so that later we can update it.
            if (sessionUsername.trim() !== '') {
              // If the auth provider has sent a username, insert that.
              insertProfileData(id, { username: sessionUsername, full_name: sessionFullName })
              setNeedUsername(false)
              setUser({ id, name: sessionFullName, username: sessionUsername, accountValue: 10000, watchlist: [] })
            } else {
              // Create a new row with an empty username.
              insertProfileData(id, { username: '', full_name: sessionFullName })
              setNeedUsername(true)
              // Set temporary state - KEY FIX
              useStore.getState().setPendingUsername(true, id, sessionFullName)
            }
          }
        }
      })
    } else {
      setUser(null)
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      processSession(session)
    })

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      processSession(session)
    })

    return () => subscription.unsubscribe()
  }, [setSession, setUser])

  const handleUsernameSubmit = async () => {
    if (!userId) return
    if (!username.trim()) {
      setError('Username cannot be empty')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    // Update with new username
    const { error } = await updateProfileData(userId, { username })
    
    setIsLoading(false)
    
    if (error) {
      setError('Error setting username. Please try again.')
      // console.log(error)
    } else {
      setNeedUsername(false)
      // Complete user setup with username
      setUser({ id: userId, name: fullName, username, accountValue: 10000, watchlist: [] })
      // Clear pending state - KEY FIX
      useStore.getState().setPendingUsername(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUsernameSubmit();
    }
  }

  // Show the username form if we need a username or there's a pending username setup
  const shouldShowUsernameForm = needUsername || pendingUsername;

  return (
    <div className="auth-dashboard">
      <div className="auth-container">
        <div className="auth-header">
          <div className="logo">
            <span onClick={() => { 
            setSelectedDashboard('landing')
          }}>AaravSim</span>
          </div>
          <h1>Welcome to your trading journey</h1>
          <p className="subtitle">Master the market with virtual trading - no real money at risk</p>
        </div>
        
        <div className="auth-card">
          <div className="auth-features">
            <div className="feature">
              <div className="feature-icon"><ChartLineUp weight="fill" /></div>
              <div className="feature-text">Real-time market data</div>
            </div>
            <div className="feature">
              <div className="feature-icon"><ShieldCheck weight="fill" /></div>
              <div className="feature-text">Risk-free trading experience</div>
            </div>
          </div>
          
          {shouldShowUsernameForm ? (
            <div className="username-form">
              <h2>Create your username</h2>
              <p>This will be your public identity on AaravSim</p>
              
              <div className="input-group">
                <input
                  className={`username-input ${error ? 'error' : ''}`}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    setError('')
                  }}
                  onKeyPress={handleKeyPress}
                  type="text"
                  placeholder="Username"
                />
                <button 
                  className={`submit-button ${isLoading ? 'loading' : ''}`} 
                  onClick={handleUsernameSubmit}
                  disabled={isLoading}
                >
                  <ArrowRight className="icon" weight="bold" />
                </button>
              </div>
              
              {error && <div className="error-message">{error}</div>}
            </div>
          ) : (
            <div className="auth-methods">
              <h2>Get started today</h2>
              <div className="auth-buttons">
                <button className="auth-button google" onClick={() => OauthSignIn('google')}>
                  <GoogleLogo weight="fill" />
                  <span>Continue with Google</span>
                </button>
                <button className="auth-button github" onClick={() => OauthSignIn('github')}>
                  <GithubLogo weight="fill" />
                  <span>Continue with GitHub</span>
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="auth-footer">
          <p>By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
        </div>
      </div>
      
      <div className="auth-background">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
    </div>
  )
}

export default AuthDashboard