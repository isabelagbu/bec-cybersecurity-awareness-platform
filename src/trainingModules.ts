export const ALL_SOCIAL_ENGINEERING_ATTACKS = [
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
] as const

export const AVAILABLE_TRAINING_MODULES = ['Phishing', 'Spear Phishing', 'Whaling', 'Vishing'] as const

export type TrainingModuleName = (typeof AVAILABLE_TRAINING_MODULES)[number]

export function isAvailableTrainingModule(name: string): name is TrainingModuleName {
  return (AVAILABLE_TRAINING_MODULES as readonly string[]).includes(name)
}

export function slugifyTraining(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function trainingModuleFromSlug(slug: string): TrainingModuleName | null {
  return AVAILABLE_TRAINING_MODULES.find((name) => slugifyTraining(name) === slug) ?? null
}
