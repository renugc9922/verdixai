const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const detectionRoutes = require('./routes/detectionRoutes')
const assistantRoutes = require('./routes/assistantRoutes')

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'VERDIXAI backend is running' })
})

app.use('/api/detection', detectionRoutes)
app.use('/api/assistant', assistantRoutes)

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

app.listen(port, () => {
  console.log(`VERDIXAI backend running on port ${port}`)
})
