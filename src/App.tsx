import { useEffect, useRef, useState } from 'react'
import { playSound } from './soundEffects'

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
    sender: 'Amara Okonkwo',
    senderEmail: 'amara.o@blackengineers.ca',
    subject: 'Chapter meetup Thursday?',
    preview: 'A few of us are meeting up Thursday if you want to join...',
    body: 'Hey!\n\nA few of us are meeting up Thursday if you want to join.\n\n- Amara',
    time: 'Yesterday',
  },
  {
    id: '3',
    sender: 'Kwame Mensah, Executive Director',
    senderEmail: 'kwame.mensah@blackengineers-inc.ca',
    subject: 'URGENT: Wire transfer needed before EOD',
    preview: 'I need you to process a wire transfer immediately...',
    body: 'I need you to process a wire transfer immediately, I\'m in a meeting and can\'t talk. Send $48,500 to the account below and confirm once done. Keep this confidential for now.\n\nKwame',
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
    sender: 'Membership Records',
    senderEmail: 'verify@membership-records-secure247.com',
    subject: 'Action Required: Verify Your Membership Details',
    preview: 'Your membership record is incomplete, please verify your personal information...',
    body: 'Your membership record is incomplete. To keep your account active, click the link below and verify your full name, date of birth, and banking details within 24 hours.\n\nVerify now: [link]',
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

type TextMessage = {
  id: string
  from: 'me' | 'them'
  text: string
  time: string
}

type Conversation = {
  id: string
  name: string
  handle: string
  messages: TextMessage[]
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    name: 'Amara Okonkwo',
    handle: '+1 (416) 555-0148',
    messages: [
      { id: 'm1', from: 'them', text: 'Still on for the chapter meetup Thursday?', time: '9:02 AM' },
      { id: 'm2', from: 'me', text: 'Yep, see you there!', time: '9:05 AM' },
    ],
  },
  {
    id: 'c2',
    name: 'Security Alerts',
    handle: '55600',
    messages: [
      { id: 'm3', from: 'them', text: 'Your verification code is 481203. Do not share this code with anyone.', time: 'Yesterday' },
    ],
  },
  {
    id: 'c3',
    name: 'Unknown',
    handle: '+1 (807) 555-9231',
    messages: [
      {
        id: 'm4',
        from: 'them',
        text: 'BEC Membership Alert: Your account will be suspended today. Verify now to keep access: bec-verify-account.net',
        time: '11:41 AM',
      },
    ],
  },
]

type CallLogEntry = {
  id: string
  name: string
  number: string
  direction: 'incoming' | 'outgoing' | 'missed'
  time: string
  duration?: string
  voicemail?: string
}

const CALL_LOG: CallLogEntry[] = [
  {
    id: 'p1',
    name: 'Amara Okonkwo',
    number: '+1 (416) 555-0148',
    direction: 'outgoing',
    time: 'Yesterday',
    duration: '4 min 12 sec',
  },
  {
    id: 'p2',
    name: 'Unknown Caller',
    number: '+1 (807) 555-4471',
    direction: 'missed',
    time: '11:52 AM',
    voicemail:
      "This is Microsoft Tech Support. We've detected a virus on your computer. Call us back immediately at this number so we can secure your account before it's locked.",
  },
  {
    id: 'p3',
    name: 'IT Support',
    number: '+1 (416) 555-0110',
    direction: 'incoming',
    time: 'Mon',
    duration: '2 min 30 sec',
  },
]

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

type Task = {
  id: 'intro' | 'open-mail' | 'open-email' | 'decide' | 'outro' | 'complete'
  narration: string
  instruction: string
}

const PHISHING_TASKS: Task[] = [
  {
    id: 'intro',
    narration:
      "Phishing is when someone impersonates a trusted source - a company, a vendor, a coworker - usually by email, to trick you into handing over sensitive information or taking a harmful action. It's the most common form of social engineering. You're going to go through a simulated inbox and handle one exactly like you would at work.",
    instruction: 'Click Start when you\'re ready.',
  },
  {
    id: 'open-mail',
    narration: 'First, open your Mail app from the desktop.',
    instruction: 'Open the Mail app.',
  },
  {
    id: 'open-email',
    narration:
      "Nice work opening Mail. Now check your inbox - one of these emails is trying to trick you. Open the message from Membership Records.",
    instruction: 'Open the email "Action Required: Verify Your Membership Details."',
  },
  {
    id: 'decide',
    narration:
      'You found it. Now look at the sender address and the tone of this message. Is it legitimate, or is it phishing?',
    instruction: 'Decide: report it as phishing, or trust it.',
  },
  {
    id: 'outro',
    narration:
      "Nice work. Here's what gave it away: the sender domain membership-records-secure247.com isn't a real membership provider, it pressures you with a 24 hour deadline, and it's asking you to hand over personal information like your banking details instead of logging in directly.",
    instruction: 'Continue to finish up.',
  },
  {
    id: 'complete',
    narration:
      "Good job! You've completed the Phishing training. A few extra tips to take with you: always check the sender's actual email address, not just the display name. Never enter personal or financial information through a link in an email. Verify unexpected requests by contacting the person or company directly through a number or website you already trust. And report suspicious emails to IT instead of just deleting them.",
    instruction: "You've completed this module.",
  },
]

const PHISHING_TARGET_EMAIL_ID = '5'

function renderNarration(text: string, spokenCharIndex: number) {
  const tokens = text.split(/(\s+)/)
  let cursor = 0
  return tokens.map((token, index) => {
    const start = cursor
    cursor += token.length
    const isSpoken = token.trim().length > 0 && spokenCharIndex >= start && spokenCharIndex < cursor
    return isSpoken ? (
      <mark key={index} className="narration-highlight">
        {token}
      </mark>
    ) : (
      token
    )
  })
}

function App() {
  const [windowPosition, setWindowPosition] = useState({ x: 220, y: 60 })
  const [windowSize, setWindowSize] = useState({ width: 1040, height: 660 })
  const [dragging, setDragging] = useState(false)
  const [resizing, setResizing] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedAttack, setSelectedAttack] = useState<string | null>(null)
  const [activeApp, setActiveApp] = useState<'training' | 'mail' | 'browser' | 'messages' | 'phone'>('training')
  const [mailFolder, setMailFolder] = useState<'inbox' | 'sent' | 'trash'>('inbox')
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(INBOX_EMAILS[0].id)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(CONVERSATIONS[0].id)
  const [selectedCallId, setSelectedCallId] = useState<string | null>(CALL_LOG[0].id)
  const [journeyOpen, setJourneyOpen] = useState(false)
  const [taskIndex, setTaskIndex] = useState(0)
  const [decisionFeedback, setDecisionFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [completedAttacks, setCompletedAttacks] = useState<Set<string>>(new Set())
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [spokenCharIndex, setSpokenCharIndex] = useState(-1)
  const [windowOpen, setWindowOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const resizeOffset = useRef({ startX: 0, startY: 0, startWidth: 0, startHeight: 0 })
  const dropdownRef = useRef<HTMLDivElement>(null)
  const restoreLayout = useRef({ position: windowPosition, size: windowSize })
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])

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

  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices()
    }
    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
  }, [])

  useEffect(() => {
    if (!journeyOpen || !voiceEnabled) {
      setSpokenCharIndex(-1)
      return
    }

    const task = PHISHING_TASKS[taskIndex]
    const utterance = new SpeechSynthesisUtterance(task.narration)
    utterance.pitch = 1
    utterance.rate = 0.95

    const voices = voicesRef.current
    const preferredVoice =
      voices.find((voice) => voice.lang.startsWith('en') && voice.default) ??
      voices.find((voice) => voice.lang.startsWith('en'))
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    setSpokenCharIndex(0)
    utterance.onboundary = (event) => setSpokenCharIndex(event.charIndex)
    utterance.onend = () => setSpokenCharIndex(-1)

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)

    return () => window.speechSynthesis.cancel()
  }, [journeyOpen, taskIndex, voiceEnabled])

  useEffect(() => {
    if (!journeyOpen) return

    const currentTask = PHISHING_TASKS[taskIndex]

    if (currentTask.id === 'open-mail' && activeApp === 'mail' && windowOpen && !minimized) {
      setTaskIndex((index) => index + 1)
    }

    if (currentTask.id === 'open-email' && mailFolder === 'inbox' && selectedEmailId === PHISHING_TARGET_EMAIL_ID) {
      setTaskIndex((index) => index + 1)
    }
  }, [journeyOpen, taskIndex, activeApp, windowOpen, minimized, mailFolder, selectedEmailId])

  useEffect(() => {
    if (!journeyOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setJourneyOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [journeyOpen])

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
    messages: 'Messages',
    phone: 'Phone',
  }

  const currentFolderEmails = FOLDER_EMAILS[mailFolder]
  const selectedEmail = currentFolderEmails.find((email) => email.id === selectedEmailId) ?? null
  const selectedConversation = CONVERSATIONS.find((conversation) => conversation.id === selectedConversationId) ?? null
  const selectedCall = CALL_LOG.find((call) => call.id === selectedCallId) ?? null

  const switchFolder = (folder: 'inbox' | 'sent' | 'trash') => {
    playSound('click')
    setMailFolder(folder)
    setSelectedEmailId(FOLDER_EMAILS[folder][0]?.id ?? null)
  }

  const openApp = (app: 'training' | 'mail' | 'browser' | 'messages' | 'phone') => {
    playSound('notify')
    setActiveApp(app)
    setWindowOpen(true)
    setMinimized(false)
  }

  const closeWindow = () => {
    playSound('click')
    setWindowOpen(false)
    setMinimized(false)
    setMaximized(false)
  }

  const toggleMaximize = () => {
    playSound('click')
    if (maximized) {
      setWindowPosition(restoreLayout.current.position)
      setWindowSize(restoreLayout.current.size)
      setMaximized(false)
    } else {
      restoreLayout.current = { position: windowPosition, size: windowSize }
      setMaximized(true)
    }
  }

  const selectAttack = (attack: string) => {
    playSound('click')
    setSelectedAttack(attack)
    setMenuOpen(false)
    if (attack === 'Phishing') {
      setTaskIndex(0)
      setDecisionFeedback(null)
      setJourneyOpen(true)
    }
  }

  const handleDecision = (choice: 'report' | 'trust') => {
    if (choice === 'report') {
      playSound('success')
      setDecisionFeedback('correct')
    } else {
      playSound('error')
      setDecisionFeedback('incorrect')
    }
  }

  const continueAfterDecision = () => {
    playSound('click')
    setDecisionFeedback(null)
    setTaskIndex((index) => index + 1)
  }

  const finishJourney = () => {
    playSound('success')
    if (selectedAttack) {
      setCompletedAttacks((prev) => new Set(prev).add(selectedAttack))
    }
    setJourneyOpen(false)
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
                  onClick={() => selectAttack(attack)}
                >
                  {attack}
                  {completedAttacks.has(attack) && <span className="attack-complete"> ✓</span>}
                </li>
              ))}
            </ol>
          )}
        </div>
        {journeyOpen && (
          <div className="topbar-progress">
            <div
              className="topbar-progress-fill"
              style={{ width: `${((taskIndex + 1) / PHISHING_TASKS.length) * 100}%` }}
            />
          </div>
        )}
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
          <button className="desktop-icon" title="Messages" onClick={() => openApp('messages')}>
            <span className="desktop-icon-symbol">💬</span>
            <span className="desktop-icon-label">Messages</span>
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
              <button className="window-button minimize" title="Minimize" onClick={() => { playSound('click'); setMinimized(true) }}>−</button>
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
                      onClick={() => { playSound('click'); setSelectedEmailId(email.id) }}
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
                      {journeyOpen &&
                        PHISHING_TASKS[taskIndex].id === 'decide' &&
                        selectedEmail.id === PHISHING_TARGET_EMAIL_ID && (
                          <div className="mail-decision">
                            {decisionFeedback === 'correct' ? (
                              <div className="mail-decision-feedback correct">
                                ✅ Correct - this is phishing. <button onClick={continueAfterDecision}>Continue</button>
                              </div>
                            ) : decisionFeedback === 'incorrect' ? (
                              <div className="mail-decision-feedback incorrect">
                                ⚠️ Not quite - look again at the sender address and the pressure to act fast.
                              </div>
                            ) : null}
                            {decisionFeedback !== 'correct' && (
                              <div className="mail-decision-buttons">
                                <button className="mail-decision-button report" onClick={() => handleDecision('report')}>
                                  🚩 Report as Phishing
                                </button>
                                <button className="mail-decision-button trust" onClick={() => handleDecision('trust')}>
                                  ✅ Looks Legitimate
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                    </>
                  ) : (
                    <div className="mail-empty-state">Select an email to read</div>
                  )}
                </div>
              </div>
            )}
            {activeApp === 'messages' && (
              <div className="messages-app">
                <div className="messages-sidebar">
                  {CONVERSATIONS.map((conversation) => {
                    const lastMessage = conversation.messages[conversation.messages.length - 1]
                    return (
                      <button
                        key={conversation.id}
                        className={`messages-list-item ${conversation.id === selectedConversationId ? 'active' : ''}`}
                        onClick={() => { playSound('click'); setSelectedConversationId(conversation.id) }}
                      >
                        <div className="messages-list-item-top">
                          <span className="messages-contact-name">{conversation.name}</span>
                          <span className="messages-time">{lastMessage.time}</span>
                        </div>
                        <div className="messages-preview">{lastMessage.text}</div>
                      </button>
                    )
                  })}
                </div>
                <div className="messages-thread">
                  {selectedConversation ? (
                    <>
                      <div className="messages-thread-header">
                        <span className="messages-thread-name">{selectedConversation.name}</span>
                        <span className="messages-thread-handle">{selectedConversation.handle}</span>
                      </div>
                      <div className="messages-bubbles">
                        {selectedConversation.messages.map((message) => (
                          <div key={message.id} className={`messages-bubble-row ${message.from}`}>
                            <div className={`messages-bubble ${message.from}`}>{message.text}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="mail-empty-state">Select a conversation</div>
                  )}
                </div>
              </div>
            )}
            {activeApp === 'phone' && (
              <div className="phone-app">
                <div className="phone-call-list">
                  {CALL_LOG.map((call) => (
                    <button
                      key={call.id}
                      className={`phone-call-item ${call.id === selectedCallId ? 'active' : ''}`}
                      onClick={() => { playSound('click'); setSelectedCallId(call.id) }}
                    >
                      <span className={`phone-direction-icon ${call.direction}`}>
                        {call.direction === 'outgoing' ? '↗' : call.direction === 'incoming' ? '↙' : '↖'}
                      </span>
                      <div className="phone-call-item-info">
                        <span className={`phone-call-name ${call.direction === 'missed' ? 'missed' : ''}`}>
                          {call.name}
                        </span>
                        <span className="phone-call-number">{call.number}</span>
                      </div>
                      <span className="phone-call-time">{call.time}</span>
                    </button>
                  ))}
                </div>
                <div className="phone-detail-pane">
                  {selectedCall ? (
                    <>
                      <div className="phone-avatar">{selectedCall.name.charAt(0)}</div>
                      <h3 className="phone-detail-name">{selectedCall.name}</h3>
                      <span className="phone-detail-number">{selectedCall.number}</span>
                      <span className="phone-detail-meta">
                        {selectedCall.direction === 'missed'
                          ? `Missed - ${selectedCall.time}`
                          : `${selectedCall.direction === 'outgoing' ? 'Outgoing' : 'Incoming'} - ${selectedCall.duration} - ${selectedCall.time}`}
                      </span>
                      <button className="journey-button primary phone-call-button">📞 Call Back</button>
                      {selectedCall.voicemail && (
                        <div className="phone-voicemail">
                          <span className="phone-voicemail-label">Voicemail transcript</span>
                          <p>{selectedCall.voicemail}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="mail-empty-state">Select a call</div>
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
            onClick={() => { playSound('click'); setTheme(theme === 'light' ? 'dark' : 'light') }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <span className="tray-time">{currentTime}</span>
        </div>
      </div>

      {journeyOpen && (
        <div className="coach-panel">
          <div className="coach-header">
            <span className="coach-badge">Phishing Training</span>
            <div className="coach-header-actions">
              <button
                className="journey-voice-toggle"
                title={voiceEnabled ? 'Mute narration' : 'Unmute narration'}
                onClick={() => setVoiceEnabled((enabled) => !enabled)}
              >
                {voiceEnabled ? '🔊' : '🔇'}
              </button>
              <button className="journey-close" title="Close" onClick={() => setJourneyOpen(false)}>×</button>
            </div>
          </div>
          <p className="coach-narration">{renderNarration(PHISHING_TASKS[taskIndex].narration, spokenCharIndex)}</p>
          <p className="coach-instruction">{PHISHING_TASKS[taskIndex].instruction}</p>

          {PHISHING_TASKS[taskIndex].id === 'intro' && (
            <button className="journey-button primary" onClick={() => { playSound('click'); setTaskIndex(1) }}>
              Start
            </button>
          )}

          {(PHISHING_TASKS[taskIndex].id === 'open-mail' || PHISHING_TASKS[taskIndex].id === 'open-email') && (
            <p className="coach-hint">Waiting for you to do this in the desktop...</p>
          )}

          {PHISHING_TASKS[taskIndex].id === 'outro' && (
            <button className="journey-button primary" onClick={() => { playSound('click'); setTaskIndex((index) => index + 1) }}>
              Continue
            </button>
          )}

          {PHISHING_TASKS[taskIndex].id === 'complete' && (
            <button className="journey-button primary" onClick={finishJourney}>
              Finish
            </button>
          )}
        </div>
      )}
    </main>
  )
}

export default App
