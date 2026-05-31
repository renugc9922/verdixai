const { analyzeCropImageFromFile } = require('../services/aiService')

async function analyzeCropImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image using the cropImage field.' })
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
    console.error('Detection analysis failed:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to analyze crop image at this time.',
    })
  }
}

module.exports = {
  analyzeCropImage,
}
