const cropStorageKey = 'verdixai.cropDetection'
const resultStorageKey = 'verdixai.cropResult'
const historyStorageKey = 'verdixai.detectionHistory'

export function saveCropSession(data) {
  sessionStorage.setItem(cropStorageKey, JSON.stringify(data))
}

export function loadCropSession() {
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
  sessionStorage.removeItem(cropStorageKey)
}

export function saveCropResult(result) {
  sessionStorage.setItem(resultStorageKey, JSON.stringify(result))
}

export function loadCropResult() {
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
  sessionStorage.removeItem(resultStorageKey)
}

export function loadDetectionHistory() {
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
  localStorage.setItem(historyStorageKey, JSON.stringify(history))
}

export function clearDetectionHistory() {
  localStorage.removeItem(historyStorageKey)
}

export function appendDetectionHistory(record) {
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
