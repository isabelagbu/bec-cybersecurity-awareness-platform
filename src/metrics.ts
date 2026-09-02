import { collection, doc, increment, onSnapshot, runTransaction, serverTimestamp, type Timestamp } from 'firebase/firestore'
import { db } from './firebase'
import { ensureAnonymousUser } from './anonymousAuth'

export type TrainingMetrics = { started: number; completed: number }

export type TrainingSession = {
  uid: string
  startedAt: Date | null
  completedAt: Date | null
}

const EMPTY_METRICS: TrainingMetrics = { started: 0, completed: 0 }

// Records a start/completion at most once per unique uid: the transaction
// checks a per-user marker doc first, so a refreshed or reopened link never
// double-counts the same visitor.
async function recordOnce(slug: string, subcollection: 'starters' | 'completers', counterField: 'started' | 'completed') {
  if (!db) return
  const uid = await ensureAnonymousUser()
  if (!uid) return

  const metricRef = doc(db, 'trainingMetrics', slug)
  const markerRef = doc(db, 'trainingMetrics', slug, subcollection, uid)

  await runTransaction(db, async (tx) => {
    const markerSnap = await tx.get(markerRef)
    if (markerSnap.exists()) return
    tx.set(markerRef, { at: serverTimestamp() })
    tx.set(metricRef, { [counterField]: increment(1) }, { merge: true })
  })
}

export function recordTrainingStarted(slug: string) {
  void recordOnce(slug, 'starters', 'started')
}

export function recordTrainingCompleted(slug: string) {
  void recordOnce(slug, 'completers', 'completed')
}

export function subscribeTrainingMetrics(slug: string, callback: (metrics: TrainingMetrics) => void) {
  if (!db) {
    callback(EMPTY_METRICS)
    return () => {}
  }
  return onSnapshot(doc(db, 'trainingMetrics', slug), (snapshot) => {
    const data = snapshot.data()
    callback({ started: data?.started ?? 0, completed: data?.completed ?? 0 })
  })
}

// Admin-only: lists each unique visitor's start/completion timestamps for a
// training, joined by uid from the starters/completers marker docs.
export function subscribeTrainingSessions(slug: string, callback: (sessions: TrainingSession[]) => void) {
  if (!db) {
    callback([])
    return () => {}
  }

  const started = new Map<string, Date>()
  const completed = new Map<string, Date>()

  const emit = () => {
    const uids = new Set([...started.keys(), ...completed.keys()])
    const sessions = Array.from(uids, (uid) => ({
      uid,
      startedAt: started.get(uid) ?? null,
      completedAt: completed.get(uid) ?? null,
    }))
    sessions.sort((a, b) => (a.startedAt?.getTime() ?? 0) - (b.startedAt?.getTime() ?? 0))
    callback(sessions)
  }

  const toDate = (value: unknown) => (value as Timestamp | undefined)?.toDate() ?? null

  const unsubStarted = onSnapshot(collection(db, 'trainingMetrics', slug, 'starters'), (snapshot) => {
    started.clear()
    snapshot.forEach((docSnap) => {
      const at = toDate(docSnap.data().at)
      if (at) started.set(docSnap.id, at)
    })
    emit()
  })

  const unsubCompleted = onSnapshot(collection(db, 'trainingMetrics', slug, 'completers'), (snapshot) => {
    completed.clear()
    snapshot.forEach((docSnap) => {
      const at = toDate(docSnap.data().at)
      if (at) completed.set(docSnap.id, at)
    })
    emit()
  })

  return () => {
    unsubStarted()
    unsubCompleted()
  }
}
