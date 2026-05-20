const API_BASE_URL = 'https://verdixai.onrender.com'

export async function sendAssistantMessage(message, diseaseContext) {
  if (!message || !message.trim()) {
    throw new Error('Please type a message before sending.')
  }

  let response

  try {
    response = await fetch(`${API_BASE_URL}/api/assistant/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message.trim(),
        diseaseContext,
      }),
    })
  } catch {
    throw new Error('Unable to reach the assistant backend. Make sure the VERDIXAI server is running on port 5000.')
  }

  if (!response.ok) {
    let errorMessage = 'Unable to get an assistant reply.'

    try {
      const errorPayload = await response.json()
      if (errorPayload?.message) {
        errorMessage = errorPayload.message
      }
    } catch {
      // Keep the default message when the backend does not return JSON.
    }

    throw new Error(errorMessage)
  }

  return response.json()
}
