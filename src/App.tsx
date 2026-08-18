import { useEffect, useRef, useState } from 'react'

type Email = {
  id: string
  sender: string
  senderEmail: string
  subject: string
  preview: string
  body: string
  time: string
}

const INBOX_EMAILS: Email[] = [
  {
    id: '1',
    sender: 'Scholarship Committee',
    senderEmail: 'scholarships@blackengineers.ca',
    subject: 'Scholarship budget - notes attached',
    preview: 'Notes from this morning\'s meeting are attached...',
    body: 'Hi team,\n\nNotes from this morning\'s scholarship budget meeting are attached. Please send corrections by Friday.\n\nThanks',
    time: '9:14 AM',
  },
  {
    id: '2',
    sender: 'Priya Nataraj',
    senderEmail: 'priya.n@blackengineers.ca',
    subject: 'Chapter meetup Thursday?',
    preview: 'A few of us are meeting up Thursday if you want to join...',
    body: 'Hey!\n\nA few of us are meeting up Thursday if you want to join.\n\n- Priya',
    time: 'Yesterday',
  },
  {
    id: '3',
    sender: 'David Coleman, Executive Director',
    senderEmail: 'david.coleman@blackengineers-inc.ca',
    subject: 'URGENT: Wire transfer needed before EOD',
    preview: 'I need you to process a wire transfer immediately...',
    body: 'I need you to process a wire transfer immediately, I\'m in a meeting and can\'t talk. Send $48,500 to the account below and confirm once done. Keep this confidential for now.\n\nDavid',
    time: 'Yesterday',
  },
  {
    id: '4',
    sender: 'IT Support',
    senderEmail: 'support@blackengineers.ca',
    subject: 'Scheduled maintenance this weekend',
    preview: 'Email will be down for maintenance Saturday...',
    body: 'Hello,\n\nEmail will be down for scheduled maintenance Saturday, 1-4 AM. No action needed.\n\nIT Support',
    time: 'Mon',
  },
  {
    id: '5',
    sender: 'Venue Billing',
    senderEmail: 'billing@vendorlnvoices.com',
    subject: 'Invoice #48210 - Payment overdue',
    preview: 'Your payment is overdue, please review the attached invoice...',
    body: 'Your payment is overdue. Review the attached invoice and pay within 24 hours to avoid losing your event booking.\n\nClick here to view invoice: [link]',
    time: 'Mon',
  },
]

const SENT_EMAILS: Email[] = [
  {
    id: 's1',
    sender: 'You',
    senderEmail: 'you@blackengineers.ca',
    subject: 'Re: Scholarship budget - notes attached',
    preview: 'Numbers look good, one small correction...',
    body: 'Numbers look good. One correction on the outreach line - I\'ll send the updated figure tomorrow.\n\nBest,\nYou',
    time: 'Yesterday',
  },
  {
    id: 's2',
    sender: 'You',
    senderEmail: 'you@blackengineers.ca',
    subject: 'Re: Chapter meetup Thursday?',
    preview: 'Sounds good, see you all there!',
    body: 'Sounds good, see you all there!\n\n- You',
    time: 'Yesterday',
  },
]

const TRASH_EMAILS: Email[] = [
  {
    id: 't1',
    sender: 'Prize Notification',
    senderEmail: 'winner@luckydraw-rewards.net',
    subject: 'You have WON a $1000 gift card!!!',
    preview: 'Congratulations! You have been selected to receive...',
    body: 'Congratulations! You\'ve been selected to receive a $1000 gift card. Click the link below within 24 hours to claim your prize.\n\n[claim now]',
    time: 'Last week',
  },
  {
    id: 't2',
    sender: 'Newsletter',
    senderEmail: 'noreply@promo-deals.com',
    subject: '50% off everything this week only',
    preview: 'Don\'t miss our biggest sale of the year...',
    body: 'Don\'t miss our biggest sale of the year. Shop now and save 50% storewide.',
    time: 'Last week',
  },
]

const FOLDER_EMAILS: Record<'inbox' | 'sent' | 'trash', Email[]> = {
  inbox: INBOX_EMAILS,
  sent: SENT_EMAILS,
  trash: TRASH_EMAILS,
}

const SOCIAL_ENGINEERING_ATTACKS = [
  'Phishing',
  'Spear Phishing',
  'Whaling',
  'Vishing',
  'Smishing',
  'Baiting',
  'Quid Pro Quo',
  'Tailgating',
  'Shoulder Surfing',
  'Dumpster Diving',
  'Scareware',
  'DDoS Attack',
  'SQL Injection',
  'Man-in-the-Middle (MITM)',
  'Ransomware Attack',
  'Zero-Day Exploit',
  'Malware Attack',
  'DNS Spoofing',
  'Brute Force Attack',
  'Cross-Site Scripting (XSS)',
  'Business Email Compromise (BEC)',
]

function App() {
  const [windowPosition, setWindowPosition] = useState({ x: 220, y: 60 })
  const [windowSize, setWindowSize] = useState({ width: 820, height: 520 })
  const [dragging, setDragging] = useState(false)
  const [resizing, setResizing] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedAttack, setSelectedAttack] = useState<string | null>(null)
  const [activeApp, setActiveApp] = useState<'training' | 'mail' | 'browser' | 'phone'>('training')
  const [mailFolder, setMailFolder] = useState<'inbox' | 'sent' | 'trash'>('inbox')
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(INBOX_EMAILS[0].id)
  const [windowOpen, setWindowOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const resizeOffset = useRef({ startX: 0, startY: 0, startWidth: 0, startHeight: 0 })
  const dropdownRef = useRef<HTMLDivElement>(null)
  const restoreLayout = useRef({ position: windowPosition, size: windowSize })

  useEffect(() => {
    if (!menuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const startDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    const desktopArea = document.querySelector('.desktop-area')?.getBoundingClientRect()
    const windowWidth = event.currentTarget.offsetWidth
    const windowHeight = event.currentTarget.offsetHeight

    dragOffset.current = {
      x: event.clientX - event.currentTarget.getBoundingClientRect().left,
      y: event.clientY - event.currentTarget.getBoundingClientRect().top,
    }

    setDragging(true)

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!desktopArea) return

      const maxX = Math.max(0, desktopArea.width - windowWidth)
      const maxY = Math.max(0, desktopArea.height - windowHeight)

      const nextX = Math.min(Math.max(moveEvent.clientX - desktopArea.left - dragOffset.current.x, 0), maxX)
      const nextY = Math.min(Math.max(moveEvent.clientY - desktopArea.top - dragOffset.current.y, 0), maxY)

      setWindowPosition({ x: nextX, y: nextY })
    }

    const handlePointerUp = () => {
      setDragging(false)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  const startResizing = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const desktopArea = document.querySelector('.desktop-area')?.getBoundingClientRect()
    if (!desktopArea) return

    resizeOffset.current = {
      startX: event.clientX,
      startY: event.clientY,
      startWidth: windowSize.width,
      startHeight: windowSize.height,
    }

    setResizing(true)

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - resizeOffset.current.startX
      const deltaY = moveEvent.clientY - resizeOffset.current.startY

      const maxWidth = Math.max(0, desktopArea.width - windowPosition.x)
      const maxHeight = Math.max(0, desktopArea.height - windowPosition.y)

      const nextWidth = Math.min(Math.max(resizeOffset.current.startWidth + deltaX, 420), maxWidth)
      const nextHeight = Math.min(Math.max(resizeOffset.current.startHeight + deltaY, 360), maxHeight)

      setWindowSize({ width: nextWidth, height: nextHeight })
    }

    const handlePointerUp = () => {
      setResizing(false)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const windowTitles: Record<typeof activeApp, string> = {
    training: 'Cybersecurity Awareness Training',
    mail: 'Mail',
    browser: 'Browser',
    phone: 'Phone',
  }

  const currentFolderEmails = FOLDER_EMAILS[mailFolder]
  const selectedEmail = currentFolderEmails.find((email) => email.id === selectedEmailId) ?? null

  const switchFolder = (folder: 'inbox' | 'sent' | 'trash') => {
    setMailFolder(folder)
    setSelectedEmailId(FOLDER_EMAILS[folder][0]?.id ?? null)
  }

  const openApp = (app: 'training' | 'mail' | 'browser' | 'phone') => {
    setActiveApp(app)
    setWindowOpen(true)
    setMinimized(false)
  }

  const closeWindow = () => {
    setWindowOpen(false)
    setMinimized(false)
    setMaximized(false)
  }

  const toggleMaximize = () => {
    if (maximized) {
      setWindowPosition(restoreLayout.current.position)
      setWindowSize(restoreLayout.current.size)
      setMaximized(false)
    } else {
      restoreLayout.current = { position: windowPosition, size: windowSize }
      setMaximized(true)
    }
  }

  return (
    <main className={`windows-desktop ${theme}-mode`}>
      <div className="content-topbar">
        <span className="content-topbar-title">Cybersecurity Awareness Training</span>
        <div className="content-dropdown" ref={dropdownRef}>
          <button
            className="dropdown-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
          >
            {selectedAttack ?? 'Social Engineering'}
            <span className="dropdown-caret">{menuOpen ? '▲' : '▼'}</span>
          </button>
          {menuOpen && (
            <ol className="dropdown-menu">
              {SOCIAL_ENGINEERING_ATTACKS.map((attack) => (
                <li
                  key={attack}
                  className={attack === selectedAttack ? 'selected' : ''}
                  onClick={() => {
                    setSelectedAttack(attack)
                    setMenuOpen(false)
                  }}
                >
                  {attack}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
      <div className="desktop-area">
        <div className="desktop-background-text">BEC</div>
        <div className="desktop-icons">
          <button className="desktop-icon" title="Mail" onClick={() => openApp('mail')}>
            <span className="desktop-icon-symbol">✉️</span>
            <span className="desktop-icon-label">Mail</span>
          </button>
          <button className="desktop-icon" title="Browser" onClick={() => openApp('browser')}>
            <span className="desktop-icon-symbol">🌐</span>
            <span className="desktop-icon-label">Browser</span>
          </button>
          <button className="desktop-icon" title="Phone" onClick={() => openApp('phone')}>
            <span className="desktop-icon-symbol">☎️</span>
            <span className="desktop-icon-label">Phone</span>
          </button>
        </div>
        {windowOpen && !minimized && (
        <section
          className={`window-frame ${dragging || resizing ? 'dragging' : ''} ${maximized ? 'maximized' : ''}`}
          style={
            maximized
              ? undefined
              : {
                  left: `${windowPosition.x}px`,
                  top: `${windowPosition.y}px`,
                  width: `${windowSize.width}px`,
                  height: `${windowSize.height}px`,
                }
          }
          onPointerDown={maximized ? undefined : startDragging}
        >
          <div className="window-header">
            <span className="window-title">{windowTitles[activeApp]}</span>
            <div className="window-controls" onPointerDown={(event) => event.stopPropagation()}>
              <button className="window-button minimize" title="Minimize" onClick={() => setMinimized(true)}>−</button>
              <button
                className="window-button maximize"
                title={maximized ? 'Restore' : 'Maximize'}
                onClick={toggleMaximize}
              >
                {maximized ? '❐' : '□'}
              </button>
              <button className="window-button close" title="Close" onClick={closeWindow}>×</button>
            </div>
          </div>

          <div className="resize-handle" onPointerDown={maximized ? undefined : startResizing} aria-label="Resize window" />
          <div className="blank-window-body">
            {activeApp === 'mail' && (
              <div className="mail-app">
                <aside className="mail-sidebar">
                  <button className="mail-compose">+ Compose</button>
                  <nav className="mail-folders">
                    <button
                      className={`mail-folder ${mailFolder === 'inbox' ? 'active' : ''}`}
                      onClick={() => switchFolder('inbox')}
                    >
                      📥 Inbox
                    </button>
                    <button
                      className={`mail-folder ${mailFolder === 'sent' ? 'active' : ''}`}
                      onClick={() => switchFolder('sent')}
                    >
                      📤 Sent
                    </button>
                    <button
                      className={`mail-folder ${mailFolder === 'trash' ? 'active' : ''}`}
                      onClick={() => switchFolder('trash')}
                    >
                      🗑️ Trash
                    </button>
                  </nav>
                </aside>
                <div className="mail-list">
                  {currentFolderEmails.map((email) => (
                    <button
                      key={email.id}
                      className={`mail-list-item ${email.id === selectedEmailId ? 'active' : ''}`}
                      onClick={() => setSelectedEmailId(email.id)}
                    >
                      <div className="mail-list-item-top">
                        <span className="mail-sender">{email.sender}</span>
                        <span className="mail-time">{email.time}</span>
                      </div>
                      <div className="mail-subject">{email.subject}</div>
                      <div className="mail-preview">{email.preview}</div>
                    </button>
                  ))}
                </div>
                <div className="mail-reading-pane">
                  {selectedEmail ? (
                    <>
                      <div className="mail-reading-header">
                        <h3>{selectedEmail.subject}</h3>
                        <div className="mail-reading-meta">
                          <span>
                            {selectedEmail.sender} &lt;{selectedEmail.senderEmail}&gt;
                          </span>
                          <span>{selectedEmail.time}</span>
                        </div>
                      </div>
                      <div className="mail-reading-body">{selectedEmail.body}</div>
                    </>
                  ) : (
                    <div className="mail-empty-state">Select an email to read</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
        )}
      </div>

      <div className="windows-taskbar">
        <button className="start-button" title="Start">Start</button>
        <div className="taskbar-items">
          {windowOpen && minimized && (
            <button className="taskbar-app-item" onClick={() => setMinimized(false)}>
              {windowTitles[activeApp]}
            </button>
          )}
        </div>
        <div className="system-tray">
          <button 
            className="theme-toggle" 
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <span className="tray-time">{currentTime}</span>
        </div>
      </div>
    </main>
  )
}

export default App
