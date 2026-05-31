const { GoogleGenerativeAI } = require('@google/generative-ai')

function buildFallbackResponse(message, diseaseContext) {
  const diseaseName = diseaseContext?.disease || diseaseContext?.diseaseName || 'the crop issue'
  const cropType = diseaseContext?.crop || diseaseContext?.cropType || 'the crop'
  const severity = diseaseContext?.severity || 'Unknown'

  return [
    `I can help with ${diseaseName} on ${cropType}.`,
    `Severity is ${severity}. Start by checking infected leaves, improving airflow, and keeping the crop area dry.`,
    'If the problem is spreading quickly, remove heavily affected leaves and use a crop-safe treatment based on your local guidance.',
    'For prevention, avoid overhead watering, monitor the plants regularly, and keep tools and hands clean between plants.',
    `You asked: ${message}`,
  ].join(' ')
}

function buildPrompt(message, diseaseContext) {
  const contextLines = diseaseContext
    ? [
        `Disease name: ${diseaseContext.disease || diseaseContext.diseaseName || 'Unknown'}`,
        `Crop type: ${diseaseContext.crop || diseaseContext.cropType || 'Unknown'}`,
        `Severity: ${diseaseContext.severity || 'Unknown'}`,
        `Confidence: ${diseaseContext.confidence ?? 'Unknown'}`,
      ]
    : ['No disease context provided.']

  return [
    'You are VERDIXAI, a friendly farming assistant for crop health advice.',
    'Give practical, simple, farmer-friendly answers.',
    'Focus on crop disease explanation, treatment, prevention, organic options, and safety.',
    'Keep the response short, clear, and actionable.',
    'Do not mention policies or model details.',
    '',
    ...contextLines,
    `Farmer question: ${message}`,
    '',
    'Answer in 3-5 short sentences with practical steps.',
  ].join('\n')
}

async function generateAssistantReply(message, diseaseContext) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey || apiKey === 'your_api_key_here') {
    return buildFallbackResponse(message, diseaseContext)
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = buildPrompt(message, diseaseContext)
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().trim()

    return text || buildFallbackResponse(message, diseaseContext)
  } catch {
    return buildFallbackResponse(message, diseaseContext)
  }
}

module.exports = {
  generateAssistantReply,
}
