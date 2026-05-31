const cropStorageKey = 'verdixai.v2.cropDetection'
const resultStorageKey = 'verdixai.v2.cropResult'
const historyStorageKey = 'verdixai.v2.detectionHistory'
const legacyStorageKeys = ['verdixai.cropDetection', 'verdixai.cropResult', 'verdixai.detectionHistory']

let didMigrateLegacyStorage = false

function clearLegacyStorageOnce() {
  if (didMigrateLegacyStorage) {
    return
  }

  didMigrateLegacyStorage = true

  try {
    legacyStorageKeys.forEach((key) => {
      sessionStorage.removeItem(key)
      localStorage.removeItem(key)
    })
  } catch {
    // Ignore storage access failures in restricted browser modes.
  }
}

export function saveCropSession(data) {
  clearLegacyStorageOnce()
  sessionStorage.setItem(cropStorageKey, JSON.stringify(data))
}

export function loadCropSession() {
  clearLegacyStorageOnce()
  const rawValue = sessionStorage.getItem(cropStorageKey)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue)
  } catch {
    return null
  }
}

export function clearCropSession() {
  clearLegacyStorageOnce()
  sessionStorage.removeItem(cropStorageKey)
}

export function saveCropResult(result) {
  clearLegacyStorageOnce()
  sessionStorage.setItem(resultStorageKey, JSON.stringify(result))
}

export function loadCropResult() {
  clearLegacyStorageOnce()
  const rawValue = sessionStorage.getItem(resultStorageKey)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue)
  } catch {
    return null
  }
}

export function clearCropResult() {
  clearLegacyStorageOnce()
  sessionStorage.removeItem(resultStorageKey)
}

export function loadDetectionHistory() {
  clearLegacyStorageOnce()
  const rawValue = localStorage.getItem(historyStorageKey)

  if (!rawValue) {
    return []
  }

  try {
    const parsedValue = JSON.parse(rawValue)
    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

export function saveDetectionHistory(history) {
  clearLegacyStorageOnce()
  localStorage.setItem(historyStorageKey, JSON.stringify(history))
}

export function clearDetectionHistory() {
  clearLegacyStorageOnce()
  localStorage.removeItem(historyStorageKey)
}

export function appendDetectionHistory(record) {
  clearLegacyStorageOnce()
  const existingHistory = loadDetectionHistory()
  saveDetectionHistory([record, ...existingHistory].slice(0, 50))
}

export function downloadTextFile(filename, textContent) {
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
