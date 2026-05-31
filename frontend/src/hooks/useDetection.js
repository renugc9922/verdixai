import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyzeCropImage } from '../services/detectionApi'
import { clearCropResult, clearCropSession, loadCropSession, saveCropResult, saveCropSession } from '../services/storage'

const loadingTexts = ['Analyzing Crop Patterns...', 'Running AI Detection...', 'Generating AI Report...']

export function useDetection() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [uploadedCrop, setUploadedCrop] = useState(() => loadCropSession())
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStage, setAnalysisStage] = useState(0)
  const [progress, setProgress] = useState(12)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!isAnalyzing) {
      return undefined
    }

    const stageTimer = window.setInterval(() => {
      setAnalysisStage((currentStage) => (currentStage + 1) % loadingTexts.length)
    }, 650)

    const progressTimer = window.setInterval(() => {
      setProgress((currentValue) => Math.min(currentValue + 11, 92))
    }, 180)

    return () => {
      window.clearInterval(stageTimer)
      window.clearInterval(progressTimer)
    }
  }, [isAnalyzing])

  const validateAndStoreFile = async (file, fileToDataUrl, deriveCropType) => {
    if (!file) {
      return
    }

    const validMimeTypes = ['image/png', 'image/jpeg']
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const isValidFile = validMimeTypes.includes(file.type) || ['png', 'jpg', 'jpeg'].includes(fileExtension || '')

    if (!isValidFile) {
      setErrorMessage('Please upload a PNG, JPG, or JPEG image.')
      return
    }

    const previewUrl = await fileToDataUrl(file)
    const cropType = deriveCropType(file.name)
    const payload = {
      previewUrl,
      cropType,
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
    }

    console.log('[VERDIXAI] Uploaded image selected', {
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
    })

    setErrorMessage('')
    setUploadedCrop(payload)
    setUploadedFile(file)
    clearCropResult()
    saveCropSession(payload)
  }

  const handleAnalyze = async () => {
    if (!uploadedCrop || !uploadedFile || isAnalyzing) {
      return
    }

    saveCropSession(uploadedCrop)
    clearCropResult()
    setProgress(12)
    setAnalysisStage(0)
    setIsAnalyzing(true)

    try {
      console.log('[VERDIXAI] Sending crop analysis request', {
        fileName: uploadedFile.name,
        mimeType: uploadedFile.type,
        size: uploadedFile.size,
      })

      const response = await analyzeCropImage(uploadedFile)
      console.log('[VERDIXAI] Crop analysis response received', response)

      saveCropResult(response)
      setProgress(100)
      navigate('/result')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to analyze the crop image.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleRemove = () => {
    setUploadedCrop(null)
    setUploadedFile(null)
    setErrorMessage('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    clearCropSession()
    clearCropResult()
  }

  return {
    fileInputRef,
    uploadedCrop,
    setUploadedCrop,
    uploadedFile,
    isDragging,
    setIsDragging,
    isAnalyzing,
    analysisStage,
    progress,
    errorMessage,
    setErrorMessage,
    setProgress,
    setAnalysisStage,
    setIsAnalyzing,
    validateAndStoreFile,
    handleAnalyze,
    handleRemove,
    loadingTexts,
  }
}
