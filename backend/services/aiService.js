const fs = require('fs/promises')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const UNKNOWN_ANALYSIS_RESULT = {
  crop: 'Unknown',
  disease: 'Unable to identify clearly',
  confidence: 25,
  severity: 'Unknown',
  symptoms: 'Insufficient visual evidence.',
  causes: 'Unable to determine.',
  treatment: 'Please upload a clearer image.',
  prevention: 'Capture the leaf in proper lighting.',
}

function buildAnalysisPrompt() {
  return [
    'You are an expert agricultural plant pathologist.',
    '',
    'Analyze the uploaded plant image carefully.',
    '',
    'Rules:',
    '1. First identify the crop or plant species visible in the image.',
    '2. Determine whether the plant is healthy or diseased.',
    '3. If diseased, identify the most likely disease.',
    '4. Do not assume the crop is Tomato.',
    '5. Base conclusions only on visible evidence.',
    '6. If confidence is low, say so.',
    '7. Return only valid JSON.',
    '',
    'Required JSON format:',
    '',
    '{',
    '  "crop": "",',
    '  "disease": "",',
    '  "confidence": 0,',
    '  "severity": "",',
    '  "symptoms": "",',
    '  "causes": "",',
    '  "treatment": "",',
    '  "prevention": ""',
    '}',
    '',
    'If the crop cannot be identified confidently, return this exact JSON object:',
    JSON.stringify(UNKNOWN_ANALYSIS_RESULT, null, 2),
  ].join('\n')
}

function extractJsonObject(text) {
  if (!text) {
    return null
  }

  const trimmedText = text.trim()

  try {
    return JSON.parse(trimmedText)
  } catch {
    const firstBrace = trimmedText.indexOf('{')
    const lastBrace = trimmedText.lastIndexOf('}')

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      return null
    }

    try {
      return JSON.parse(trimmedText.slice(firstBrace, lastBrace + 1))
    } catch {
      return null
    }
  }
}

function normalizeTextValue(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(', ')
  }

  if (typeof value === 'string') {
    return value.trim()
  }

  return ''
}

function normalizeAnalysisResult(rawResult) {
  if (!rawResult || typeof rawResult !== 'object') {
    return null
  }

  const crop = normalizeTextValue(rawResult.crop || rawResult.cropType)
  const disease = normalizeTextValue(rawResult.disease || rawResult.diseaseName)
  const severity = normalizeTextValue(rawResult.severity || rawResult.severityLevel)
  const confidenceValue = Number(rawResult.confidence ?? rawResult.confidenceScore)
  const confidence = Number.isFinite(confidenceValue) ? Math.max(0, Math.min(100, Math.round(confidenceValue))) : NaN

  const normalizedResult = {
    crop: crop || UNKNOWN_ANALYSIS_RESULT.crop,
    disease: disease || UNKNOWN_ANALYSIS_RESULT.disease,
    confidence: Number.isFinite(confidence) ? confidence : UNKNOWN_ANALYSIS_RESULT.confidence,
    severity: severity || UNKNOWN_ANALYSIS_RESULT.severity,
    symptoms: normalizeTextValue(rawResult.symptoms) || UNKNOWN_ANALYSIS_RESULT.symptoms,
    causes: normalizeTextValue(rawResult.causes) || UNKNOWN_ANALYSIS_RESULT.causes,
    treatment: normalizeTextValue(rawResult.treatment) || UNKNOWN_ANALYSIS_RESULT.treatment,
    prevention: normalizeTextValue(rawResult.prevention) || UNKNOWN_ANALYSIS_RESULT.prevention,
  }

  const isUnclearAnalysis =
    normalizedResult.crop === UNKNOWN_ANALYSIS_RESULT.crop ||
    normalizedResult.disease === UNKNOWN_ANALYSIS_RESULT.disease ||
    normalizedResult.confidence < 50

  return isUnclearAnalysis ? UNKNOWN_ANALYSIS_RESULT : normalizedResult
}

async function analyzeCropImageFromFile(file) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured.')
  }

  if (!file?.path) {
    throw new Error('A valid uploaded image is required for analysis.')
  }

  const imageBuffer = await fs.readFile(file.path)
  const imageBase64 = imageBuffer.toString('base64')
  const mimeType = file.mimetype || 'image/jpeg'
  const prompt = buildAnalysisPrompt()

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  })

  console.log('[VERDIXAI] AI request prepared', {
    fileName: file.originalname,
    mimeType,
    size: file.size,
  })

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    },
  ])

  const response = await result.response
  const responseText = response.text()

  console.log('[VERDIXAI] AI raw response', responseText)

  const parsedResponse = extractJsonObject(responseText)
  const normalizedResponse = normalizeAnalysisResult(parsedResponse)

  if (!normalizedResponse) {
    throw new Error('AI response did not contain a valid analysis object.')
  }

  return normalizedResponse
}

module.exports = {
  UNKNOWN_ANALYSIS_RESULT,
  analyzeCropImageFromFile,
}
