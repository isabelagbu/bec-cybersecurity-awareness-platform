import { useState, type FormEvent } from 'react'
import { useAuth } from './AuthContext'

function LoginForm() {
  const { login, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await login(email, password)
    } catch {
      // error is surfaced via useAuth().error
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="control-panel-login" onSubmit={handleSubmit}>
      <h3>Admin Login</h3>
      <p className="control-panel-subtext">Sign in to access the control panel.</p>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="username"
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />
      </label>
      {error && <div className="control-panel-error">{error}</div>}
      <button className="journey-button primary" type="submit" disabled={submitting}>
        {submitting ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}

export function ControlPanel() {
  const { user, loading, configured, logout } = useAuth()

  if (!configured) {
    return (
      <div className="control-panel-login">
        <h3>Firebase Not Configured</h3>
        <p className="control-panel-subtext">
          Add your Firebase project keys to .env.local (see .env.example), then restart the dev server to enable
          login.
        </p>
      </div>
    )
  }

  if (loading) {
    return <div className="control-panel-loading">Loading...</div>
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <div className="control-panel">
      <div className="control-panel-header">
        <span>Signed in as {user.email}</span>
        <button className="journey-button" onClick={logout}>
          Sign Out
        </button>
      </div>
      <div className="control-panel-body">
        <p className="control-panel-subtext">Control panel content goes here.</p>
      </div>
    </div>
  )
}
