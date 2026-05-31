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

const QUOTA_FALLBACK_NOTICE = 'AI quota exceeded. Showing a safe fallback result with low confidence.'

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
    console.error('[VERDIXAI] JSON parse error: AI response text is empty')
    return null
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
      return null
    }

    try {
      return JSON.parse(trimmedText.slice(firstBrace, lastBrace + 1))
    } catch (fallbackParseError) {
      console.error('[VERDIXAI] JSON parse error (fallback parse failed)', {
        message: fallbackParseError?.message,
        preview: trimmedText.slice(firstBrace, Math.min(lastBrace + 1, firstBrace + 700)),
      })
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

  console.log('[VERDIXAI] Uploaded file read for AI payload', {
    filePath: file.path,
    bufferBytes: imageBuffer.length,
    base64Length: imageBase64.length,
  })

  const genAI = new GoogleGenerativeAI(apiKey)
  const configuredModel = process.env.GEMINI_MODEL
  const modelCandidates = configuredModel
    ? [configuredModel]
    : ['gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash']

  console.log('[VERDIXAI] AI request prepared', {
    fileName: file.originalname,
    mimeType,
    size: file.size,
  })

  let result
  let lastGeminiError = null

  for (const modelName of modelCandidates) {
    try {
      console.log('[VERDIXAI] Attempting Gemini model', { modelName })

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

      result = await model.generateContent([
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

      console.log('[VERDIXAI] Gemini model succeeded', { modelName })
      break
    } catch (geminiError) {
      lastGeminiError = geminiError
      const errorStatus = geminiError?.status

      console.error('[VERDIXAI] Gemini API call failed', {
        modelName,
        message: geminiError?.message,
        status: errorStatus,
        code: geminiError?.code,
        details: geminiError?.errorDetails,
        stack: geminiError?.stack,
      })

      // Only continue trying model fallbacks when the model name is unsupported.
      if (errorStatus !== 404) {
        let clientMessage = `Gemini request failed: ${geminiError?.message || 'Unknown Gemini error'}`

        if (errorStatus === 429) {
          console.warn('[VERDIXAI] Gemini quota exceeded; returning safe fallback analysis')
          return {
            ...UNKNOWN_ANALYSIS_RESULT,
            analysisMode: 'quota-fallback',
            analysisNotice: QUOTA_FALLBACK_NOTICE,
          }
        } else if (errorStatus === 401 || errorStatus === 403) {
          clientMessage = 'Gemini authentication failed. Verify the API key and project permissions.'
        }

        const mappedError = new Error(clientMessage)
        mappedError.status = errorStatus || 502
        throw mappedError
      }
    }
  }

  if (!result) {
    const mappedError = new Error(`Gemini request failed: ${lastGeminiError?.message || 'Unknown Gemini error'}`)
    mappedError.status = lastGeminiError?.status || 502
    throw mappedError
  }

  const response = await result.response
  const responseText = response.text()

  console.log('[VERDIXAI] Gemini raw response', responseText)

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
