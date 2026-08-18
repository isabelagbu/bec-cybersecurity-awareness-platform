import { useEffect, useRef, useState } from 'react'

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
  const [windowTitle, setWindowTitle] = useState('Cybersecurity Awareness Training')
  const dragOffset = useRef({ x: 0, y: 0 })
  const resizeOffset = useRef({ startX: 0, startY: 0, startWidth: 0, startHeight: 0 })
  const dropdownRef = useRef<HTMLDivElement>(null)

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
          <button className="desktop-icon" title="Mail" onClick={() => setWindowTitle('Mail')}>
            <span className="desktop-icon-symbol">✉️</span>
            <span className="desktop-icon-label">Mail</span>
          </button>
          <button className="desktop-icon" title="Browser" onClick={() => setWindowTitle('Browser')}>
            <span className="desktop-icon-symbol">🌐</span>
            <span className="desktop-icon-label">Browser</span>
          </button>
          <button className="desktop-icon" title="Phone" onClick={() => setWindowTitle('Phone')}>
            <span className="desktop-icon-symbol">☎️</span>
            <span className="desktop-icon-label">Phone</span>
          </button>
        </div>
        <section
          className={`window-frame ${dragging || resizing ? 'dragging' : ''}`}
          style={{
            left: `${windowPosition.x}px`,
            top: `${windowPosition.y}px`,
            width: `${windowSize.width}px`,
            height: `${windowSize.height}px`,
          }}
          onPointerDown={startDragging}
        >
          <div className="window-header">
            <span className="window-title">{windowTitle}</span>
            <div className="window-controls">
              <button className="window-button minimize" title="Minimize">−</button>
              <button className="window-button maximize" title="Maximize">□</button>
              <button className="window-button close" title="Close">×</button>
            </div>
          </div>

          <div className="resize-handle" onPointerDown={startResizing} aria-label="Resize window" />
          <div className="blank-window-body" />
        </section>
      </div>

      <div className="windows-taskbar">
        <button className="start-button" title="Start">Start</button>
        <div className="taskbar-items" />
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
