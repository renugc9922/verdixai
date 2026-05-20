import { ArrowLeft, Download, History, ImageIcon, ScanSearch, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import ResultCard from '../components/ResultCard'
import { appendDetectionHistory, loadCropResult, loadCropSession } from '../services/storage'
import { formatDateTime, sampleResult } from '../utils/verdix'

export default function ResultPage() {
  const uploadedCrop = loadCropSession()
  const storedResult = loadCropResult()
  const savedHistoryRef = useRef(false)

  const result = {
    diseaseName: storedResult?.diseaseName ?? sampleResult.diseaseName,
    confidence: storedResult?.confidence ?? storedResult?.confidenceScore ?? sampleResult.confidenceScore,
    severity: storedResult?.severity ?? storedResult?.severityLevel ?? sampleResult.severityLevel,
    cropType: storedResult?.cropType ?? uploadedCrop?.cropType ?? 'Crop Leaf',
    symptoms: storedResult?.symptoms ?? sampleResult.symptoms,
    causes: storedResult?.causes ?? sampleResult.causes,
    treatment: storedResult?.treatment ?? sampleResult.treatment,
    prevention: storedResult?.prevention ?? sampleResult.prevention,
  }

  useEffect(() => {
    if (!uploadedCrop || !result || savedHistoryRef.current) {
      return
    }

    appendDetectionHistory({
      uploadedImage: uploadedCrop.previewUrl,
      diseaseName: result.diseaseName,
      confidenceScore: result.confidence,
      severityLevel: result.severity,
      scanDate: new Date().toISOString(),
      cropType: uploadedCrop.cropType,
    })
    savedHistoryRef.current = true
  }, [uploadedCrop, result])

  const handleDownload = () => {
    const report = [
      `Disease Name: ${result.diseaseName}`,
      `Confidence Score: ${result.confidence}%`,
      `Severity Level: ${result.severity}`,
      `Symptoms: ${Array.isArray(result.symptoms) ? result.symptoms.join(', ') : result.symptoms}`,
      `Causes: ${result.causes}`,
      `Treatment: ${result.treatment}`,
      `Prevention: ${result.prevention}`,
    ].join('\n')
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'verdixai-result.txt'
    document.body.append(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020805] text-emerald-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-8%] h-96 w-96 rounded-full bg-emerald-500/18 blur-3xl" />
        <div className="absolute right-[-8%] top-20 h-[28rem] w-[28rem] rounded-full bg-teal-400/10 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/10 bg-[#05120c]/75 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/detect" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10">
              <Sparkles className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold tracking-[0.22em] text-white">VERDIXAI</p>
              <p className="text-xs uppercase tracking-[0.26em] text-emerald-200/60">Detection Result</p>
            </div>
          </Link>
          <div className="hidden items-center gap-3 md:flex">
            <Link to="/history" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-emerald-100/80 transition hover:bg-white/10">
              <History className="h-4 w-4" />
              History
            </Link>
            <button type="button" onClick={handleDownload} className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100/80 transition hover:bg-emerald-400/15">
              <Download className="h-4 w-4" />
              Download Report
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-10">
        <ResultCard
          result={result}
        />

        <section className="space-y-5">
          <div className="rounded-[2rem] border border-white/10 bg-white/6 p-5 backdrop-blur-xl sm:p-6">
            <p className="text-sm uppercase tracking-[0.26em] text-emerald-100/55">Uploaded Image</p>
            <div className="mt-4 overflow-hidden rounded-[1.6rem] border border-white/10 bg-black/20">
              {uploadedCrop ? (
                <img src={uploadedCrop.previewUrl} alt={uploadedCrop.cropType} className="h-72 w-full object-cover" />
              ) : (
                <div className="flex h-72 items-center justify-center text-emerald-100/55">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-10 w-10 text-emerald-300" />
                    <p className="mt-3">No crop session found</p>
                  </div>
                </div>
              )}
            </div>
            {uploadedCrop ? <p className="mt-4 text-sm text-emerald-100/60">Captured on {formatDateTime(uploadedCrop.uploadedAt)}</p> : null}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/6 p-5 backdrop-blur-xl sm:p-6">
            <p className="text-sm uppercase tracking-[0.26em] text-emerald-100/55">Summary Actions</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Link to="/detect" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 font-semibold text-white/90 transition hover:bg-white/10">
                <ArrowLeft className="h-4 w-4" />
                Analyze another crop
              </Link>
              <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 font-semibold text-white/90 transition hover:bg-white/10">
                <ScanSearch className="h-4 w-4" />
                Back to dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
