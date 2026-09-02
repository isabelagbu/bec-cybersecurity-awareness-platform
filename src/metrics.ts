import { doc, increment, onSnapshot, runTransaction, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import { ensureAnonymousUser } from './anonymousAuth'

export type TrainingMetrics = { started: number; completed: number }

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
