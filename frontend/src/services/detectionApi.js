const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export async function getBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`)

  if (!response.ok) {
    return { success: false, geminiAvailable: false }
  }

  return response.json()
}

export async function analyzeCropImage(file) {
  if (!file) {
    throw new Error('Please select a crop image before analyzing.')
  }

  const formData = new FormData()
  formData.append('cropImage', file)

  let response

  try {
    response = await fetch(`${API_BASE_URL}/api/detection/analyze`, {
      method: 'POST',
      body: formData,
    })
  } catch {
    throw new Error('Unable to reach the backend. Make sure the VERDIXAI server is running on port 5000.')
  }

  if (!response.ok) {
    let errorMessage = 'Crop analysis failed.'

    try {
      const errorPayload = await response.json()
      if (errorPayload?.message) {
        errorMessage = errorPayload.message
      }
    } catch {
      // Keep the default error message if the backend did not return JSON.
    }

    throw new Error(errorMessage)
  }

  return response.json()
}
