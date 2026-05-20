const { generateAssistantReply } = require('../services/geminiService')

async function chatWithAssistant(req, res) {
  try {
    const { message, diseaseContext } = req.body || {}

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message for the assistant.',
      })
    }

    const reply = await generateAssistantReply(message.trim(), diseaseContext)

    return res.json({
      success: true,
      reply,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to generate an assistant response right now.',
    })
  }
}

module.exports = {
  chatWithAssistant,
}
