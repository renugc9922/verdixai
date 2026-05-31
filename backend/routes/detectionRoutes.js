const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const { analyzeCropImage } = require('../controllers/detectionController')

const router = express.Router()
const uploadsDir = path.join(__dirname, '..', 'uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const safeName = path.basename(file.originalname)
    cb(null, `${uniqueSuffix}-${safeName}`)
  },
})

const upload = multer({ storage })

router.post('/analyze', (req, res, next) => {
  console.log('[VERDIXAI] /api/detection/analyze request received', {
    method: req.method,
    contentType: req.headers['content-type'],
  })
  next()
}, upload.single('cropImage'), (req, res, next) => {
  console.log('[VERDIXAI] Multer file binding result', {
    hasFile: Boolean(req.file),
    expectedField: 'cropImage',
    bodyKeys: Object.keys(req.body || {}),
  })
  next()
}, analyzeCropImage)

module.exports = router
