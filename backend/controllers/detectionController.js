const { analyzeCropImageFromFile } = require('../services/aiService')

async function analyzeCropImage(req, res) {
  try {
    console.log('[VERDIXAI] analyzeCropImage controller reached')

    if (!req.file) {
      console.error('[VERDIXAI] analyzeCropImage missing file. Expected multipart field: cropImage')
      const validationResponse = { success: false, message: 'Please upload an image using the cropImage field.' }
      console.log('[VERDIXAI] Final API response', validationResponse)
      return res.status(400).json(validationResponse)
    }

    console.log('[VERDIXAI] Uploaded image received', {
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
    })

    console.log('[VERDIXAI] Sending uploaded image to AI analysis')
    const analysis = await analyzeCropImageFromFile(req.file)
    console.log('[VERDIXAI] AI analysis response', analysis)

    const apiResponse = {
      success: true,
      ...analysis,
    }

    console.log('[VERDIXAI] Final API response', apiResponse)

    return res.json(apiResponse)
  } catch (error) {
    console.error('[VERDIXAI] Detection analysis failed:', {
      message: error?.message,
      stack: error?.stack,
      status: error?.status,
      code: error?.code,
    })

    const statusCode = Number.isInteger(error?.status) ? error.status : 500
    const clientMessage = error?.message || 'Unable to analyze crop image at this time.'
    const errorResponse = {
      success: false,
      message: clientMessage,
    }

    console.log('[VERDIXAI] Final API response', errorResponse)

    return res.status(statusCode).json(errorResponse)
  }
}

module.exports = {
  analyzeCropImage,
}
