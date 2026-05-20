const { getSampleAnalysis } = require('../services/aiService')

async function analyzeCropImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image using the cropImage field.' })
    }

    const analysis = await getSampleAnalysis()

    return res.json({
      success: true,
      ...analysis,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to analyze crop image at this time.',
    })
  }
}

module.exports = {
  analyzeCropImage,
}
