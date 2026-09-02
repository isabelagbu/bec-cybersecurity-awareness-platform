import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from './AuthContext'
import {
  ALL_SOCIAL_ENGINEERING_ATTACKS,
  isAvailableTrainingModule,
  slugifyTraining,
  type TrainingModuleName,
} from './trainingModules'
import { subscribeTrainingMetrics, type TrainingMetrics } from './metrics'

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

function buildTrainingLink(module: TrainingModuleName) {
  return `${window.location.origin}${window.location.pathname}?training=${slugifyTraining(module)}`
}

function TrainingSelector() {
  const [selected, setSelected] = useState<TrainingModuleName | null>(null)
  const [metrics, setMetrics] = useState<TrainingMetrics>({ started: 0, completed: 0 })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!selected) return
    setMetrics({ started: 0, completed: 0 })
    return subscribeTrainingMetrics(slugifyTraining(selected), setMetrics)
  }, [selected])

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timer)
  }, [copied])

  const copyLink = async () => {
    if (!selected) return
    await navigator.clipboard.writeText(buildTrainingLink(selected))
    setCopied(true)
  }

  return (
    <div className="control-panel-trainings">
      <ol className="control-panel-training-list">
        {ALL_SOCIAL_ENGINEERING_ATTACKS.map((attack) => {
          const available = isAvailableTrainingModule(attack)
          return (
            <li
              key={attack}
              className={`control-panel-training-item ${attack === selected ? 'active' : ''} ${
                available ? '' : 'unavailable'
              }`}
              onClick={() => available && setSelected(attack)}
            >
              {attack}
              {!available && <span className="control-panel-training-badge">Coming soon</span>}
            </li>
          )
        })}
      </ol>
      <div className="control-panel-training-detail">
        {selected ? (
          <>
            <h3>{selected}</h3>
            <p className="control-panel-subtext">
              Share this link to send an anonymous trainee straight into the {selected} module.
            </p>
            <div className="control-panel-link-row">
              <input readOnly value={buildTrainingLink(selected)} onFocus={(event) => event.currentTarget.select()} />
              <button className="journey-button primary" onClick={copyLink}>
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
            <div className="control-panel-metrics">
              <div className="control-panel-metric-card">
                <span className="control-panel-metric-value">{metrics.started}</span>
                <span className="control-panel-metric-label">Started</span>
              </div>
              <div className="control-panel-metric-card">
                <span className="control-panel-metric-value">{metrics.completed}</span>
                <span className="control-panel-metric-label">Completed</span>
              </div>
            </div>
          </>
        ) : (
          <div className="control-panel-training-empty">
            Select a training module to generate a link and view its metrics.
          </div>
        )}
      </div>
    </div>
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
        <TrainingSelector />
      </div>
    </div>
  )
}
