const express = require('express')
const multer = require('multer')
const path = require('path')
const { analyzeCropImage } = require('../controllers/detectionController')

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${uniqueSuffix}-${file.originalname}`)
  },
})

const upload = multer({ storage })

router.post('/analyze', upload.single('cropImage'), analyzeCropImage)

module.exports = router
