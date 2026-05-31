const fs = require('fs/promises')
const { GoogleGenerativeAI } = require('@google/generative-ai')
const { getDemoFallbackResult } = require('../data/demoDiseaseData')
const { isSupportedDemoCropKey, resolveDemoDiseaseKey } = require('../utils/demoDiseaseMatcher')

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
  ].join('\n')
}

function extractJsonObject(text) {
  if (!text) {
    throw new Error('Gemini returned an empty response.')
  }

  const trimmedText = text.trim()

  try {
    return JSON.parse(trimmedText)
  } catch (primaryParseError) {
    console.error('[VERDIXAI] JSON parse error (direct parse failed)', {
      message: primaryParseError?.message,
      preview: trimmedText.slice(0, 500),
    })

    const firstBrace = trimmedText.indexOf('{')
    const lastBrace = trimmedText.lastIndexOf('}')

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw primaryParseError
    }

    try {
      return JSON.parse(trimmedText.slice(firstBrace, lastBrace + 1))
    } catch (fallbackParseError) {
      console.error('[VERDIXAI] JSON parse error (fallback parse failed)', {
        message: fallbackParseError?.message,
        preview: trimmedText.slice(firstBrace, Math.min(lastBrace + 1, firstBrace + 700)),
      })
      throw fallbackParseError
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

function normalizeGeminiResult(rawResult) {
  if (!rawResult || typeof rawResult !== 'object') {
    throw new Error('Gemini response did not contain a valid object.')
  }

  const confidenceValue = Number(rawResult.confidence ?? rawResult.confidenceScore)
  const confidence = Number.isFinite(confidenceValue) ? Math.max(0, Math.min(100, Math.round(confidenceValue))) : 0

  return {
    crop: normalizeTextValue(rawResult.crop || rawResult.cropType) || 'Unknown',
    disease: normalizeTextValue(rawResult.disease || rawResult.diseaseName) || 'Unable to identify clearly',
    confidence,
    severity: normalizeTextValue(rawResult.severity || rawResult.severityLevel) || 'Unknown',
    symptoms: normalizeTextValue(rawResult.symptoms) || 'Insufficient visual evidence.',
    causes: normalizeTextValue(rawResult.causes) || 'Unable to determine.',
    treatment: normalizeTextValue(rawResult.treatment) || 'Please upload a clearer image.',
    prevention: normalizeTextValue(rawResult.prevention) || 'Capture the leaf in proper lighting.',
    isFallback: false,
    note: '',
  }
}

function mapGeminiErrorToLogInfo(error) {
  return {
    message: error?.message,
    stack: error?.stack,
    status: error?.status,
    code: error?.code,
    details: error?.errorDetails,
  }
}

async function getGeminiAnalysis(file) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  const hasGeminiApiKey = Boolean(process.env.GEMINI_API_KEY)
  const hasGoogleApiKey = Boolean(process.env.GOOGLE_API_KEY)

  console.log('[VERDIXAI] API key presence check', {
    hasGeminiApiKey,
    hasGoogleApiKey,
    usingKeySource: hasGeminiApiKey ? 'GEMINI_API_KEY' : hasGoogleApiKey ? 'GOOGLE_API_KEY' : 'none',
  })

  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('Gemini API key is not configured. Set GEMINI_API_KEY or GOOGLE_API_KEY in backend/.env.')
  }

  if (!file?.path) {
    throw new Error('A valid uploaded image is required for analysis.')
  }

  const imageBuffer = await fs.readFile(file.path)
  const imageBase64 = imageBuffer.toString('base64')
  const mimeType = file.mimetype || 'image/jpeg'
  const prompt = buildAnalysisPrompt()
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash'

  console.log('[VERDIXAI] Uploaded file read for AI payload', {
    filePath: file.path,
    bufferBytes: imageBuffer.length,
    base64Length: imageBase64.length,
  })

  console.log('[VERDIXAI] AI request prepared', {
    modelName,
    fileName: file.originalname,
    mimeType,
    size: file.size,
    hasGeminiApiKey,
    hasGoogleApiKey,
  })

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  })

  console.log('[VERDIXAI] Before Gemini API call', {
    modelName,
    hasGeminiApiKey: hasGeminiApiKey || hasGoogleApiKey,
  })

  const result = await model.generateContent([
    {
      text: prompt,
    },
    {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    },
  ])

  console.log('[VERDIXAI] After Gemini API call', {
    modelName,
    hasGeminiApiKey: hasGeminiApiKey || hasGoogleApiKey,
  })

  const response = await result.response
  const responseText = response.text()

  console.log('[VERDIXAI] Gemini raw response', responseText)

  const parsedResponse = extractJsonObject(responseText)
  return normalizeGeminiResult(parsedResponse)
}

async function analyzeCropImageFromFile(file, cropHint = '') {
  const fallbackKey = resolveDemoDiseaseKey({
    fileName: file?.originalname,
    cropHint,
  })
  const normalizedHint = String(cropHint).toLowerCase()
  const fallbackSource = isSupportedDemoCropKey(normalizedHint)
    ? `selected crop: ${normalizedHint}`
    : fallbackKey !== 'unknown'
      ? `filename keyword: ${fallbackKey}`
      : 'uploaded filename'

  console.log('[VERDIXAI] Demo fallback resolver', {
    fileName: file?.originalname,
    cropHint,
    resolvedKey: fallbackKey,
    fallbackSource,
  })

  try {
    return await getGeminiAnalysis(file)
  } catch (error) {
    console.error('[VERDIXAI] Gemini analysis failed; using demo fallback', mapGeminiErrorToLogInfo(error))
    const fallbackResult = getDemoFallbackResult(fallbackKey)
    return {
      ...fallbackResult,
      note: fallbackKey === 'unknown'
        ? 'AI service is currently unavailable. Showing verified demo fallback result.'
        : `Verified demo fallback result based on ${fallbackSource}.`,
    }
  }
}

module.exports = {
  analyzeCropImageFromFile,
}
