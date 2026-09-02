import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from './AuthContext'
import {
  ALL_SOCIAL_ENGINEERING_ATTACKS,
  isAvailableTrainingModule,
  slugifyTraining,
  type TrainingModuleName,
} from './trainingModules'
import { subscribeTrainingMetrics, subscribeTrainingSessions, type TrainingMetrics, type TrainingSession } from './metrics'

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

// Sessions are reviewed by an Ontario-based admin - show timestamps in
// Ontario local time regardless of the viewing browser's own timezone.
function formatOntarioTime(date: Date) {
  return date.toLocaleString('en-CA', {
    timeZone: 'America/Toronto',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  })
}

const MIN_LIST_WIDTH = 180
const MAX_LIST_WIDTH = 480

function TrainingSelector() {
  const [selected, setSelected] = useState<TrainingModuleName | null>(null)
  const [metrics, setMetrics] = useState<TrainingMetrics>({ started: 0, completed: 0 })
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [copied, setCopied] = useState(false)
  const [listWidth, setListWidth] = useState(260)
  const [resizingList, setResizingList] = useState(false)

  useEffect(() => {
    if (!selected) return
    setMetrics({ started: 0, completed: 0 })
    return subscribeTrainingMetrics(slugifyTraining(selected), setMetrics)
  }, [selected])

  useEffect(() => {
    if (!selected) return
    setSessions([])
    return subscribeTrainingSessions(slugifyTraining(selected), setSessions)
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

  const startResizingList = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    const startX = event.clientX
    const startWidth = listWidth
    setResizingList(true)

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const nextWidth = Math.min(Math.max(startWidth + (moveEvent.clientX - startX), MIN_LIST_WIDTH), MAX_LIST_WIDTH)
      setListWidth(nextWidth)
    }
    const handlePointerUp = () => {
      setResizingList(false)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  return (
    <div className="control-panel-trainings">
      <ol className="control-panel-training-list" style={{ width: listWidth }}>
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
      <div
        className={`control-panel-resizer ${resizingList ? 'resizing' : ''}`}
        onPointerDown={startResizingList}
        aria-label="Resize training list"
      />
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
            <div className="control-panel-sessions">
              <h4>Anonymous visitors</h4>
              {sessions.length === 0 ? (
                <p className="control-panel-subtext">No visitors yet.</p>
              ) : (
                <div className="control-panel-sessions-table-wrap">
                  <table className="control-panel-sessions-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Started</th>
                        <th>Completed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((session, index) => (
                        <tr key={session.uid}>
                          <td>{index + 1}</td>
                          <td>{session.startedAt ? formatOntarioTime(session.startedAt) : '—'}</td>
                          <td>{session.completedAt ? formatOntarioTime(session.completedAt) : 'In progress'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
