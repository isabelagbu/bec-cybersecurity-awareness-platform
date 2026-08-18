type SoundKind = 'click' | 'notify' | 'success' | 'error'

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }
  return audioContext
}

function playTone(frequency: number, duration: number, delay = 0, volume = 0.12) {
  const ctx = getAudioContext()
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.value = frequency

  oscillator.connect(gain)
  gain.connect(ctx.destination)

  const startTime = ctx.currentTime + delay
  gain.gain.setValueAtTime(volume, startTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

  oscillator.start(startTime)
  oscillator.stop(startTime + duration)
}

export function playSound(kind: SoundKind) {
  switch (kind) {
    case 'click':
      playTone(880, 0.05)
      break
    case 'notify':
      playTone(660, 0.08)
      playTone(880, 0.1, 0.09)
      break
    case 'success':
      playTone(523.25, 0.1)
      playTone(783.99, 0.15, 0.1)
      break
    case 'error':
      playTone(220, 0.18, 0, 0.14)
      break
  }
}
