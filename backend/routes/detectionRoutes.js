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

router.post('/analyze', upload.single('cropImage'), analyzeCropImage)

module.exports = router
