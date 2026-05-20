import { ArrowLeft, Upload, UploadCloud, ImagePlus, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import UploadCard from '../components/UploadCard'
import Loader from '../components/Loader'
import { useDetection } from '../hooks/useDetection'
import { deriveCropType, fileToDataUrl } from '../utils/verdix'

export default function DetectPage() {
  const {
    fileInputRef,
    uploadedCrop,
    isDragging,
    setIsDragging,
    isAnalyzing,
    analysisStage,
    progress,
    errorMessage,
    validateAndStoreFile,
    handleAnalyze,
    handleRemove,
    loadingTexts,
  } = useDetection()

  const handleInputChange = (event) => {
    const file = event.target.files?.[0]
    void validateAndStoreFile(file, fileToDataUrl, deriveCropType)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0]
    void validateAndStoreFile(file, fileToDataUrl, deriveCropType)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020805] text-emerald-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-8%] h-96 w-96 rounded-full bg-emerald-500/18 blur-3xl" />
        <div className="absolute right-[-8%] top-20 h-[28rem] w-[28rem] rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute bottom-[-14%] left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-lime-500/10 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/10 bg-[#05120c]/75 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 shadow-[0_0_35px_rgba(34,197,94,0.15)]">
              <Sparkles className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold tracking-[0.22em] text-white">VERDIXAI</p>
              <p className="text-xs uppercase tracking-[0.26em] text-emerald-200/60">Crop Detection</p>
            </div>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <Link to="/dashboard" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-emerald-100/80 transition hover:bg-white/10">Dashboard</Link>
            <div className="rounded-full border border-emerald-300/15 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100/80">Frontend only</div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-10">
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.24)] backdrop-blur-2xl sm:p-6">
          <div className="rounded-[1.8rem] border border-emerald-300/15 bg-[linear-gradient(135deg,rgba(6,95,70,0.9),rgba(4,17,11,0.92))] p-6">
            <p className="text-sm uppercase tracking-[0.26em] text-emerald-100/55">Crop Detection</p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-white">Upload a crop leaf and let VERDIXAI analyze it.</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-emerald-100/70 sm:text-base">Drag and drop a clear leaf image, preview it instantly, and send it into the AI flow.</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ['Fast upload', UploadCloud],
                ['Preview enabled', ImagePlus],
                ['Secure temp state', ShieldCheck],
              ].map(([label, Icon]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                  <Icon className="h-5 w-5 text-emerald-300" />
                  <p className="mt-3 text-sm text-emerald-100/75">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="rounded-[2rem] border border-white/10 bg-white/6 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.24)] backdrop-blur-2xl sm:p-6">
          <div className="rounded-[1.75rem] border border-white/10 bg-[#07140f]/85 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/55">Upload Crop Image</p>
                <h2 className="mt-2 font-display text-3xl text-white">Analyze Crop</h2>
              </div>
              {uploadedCrop ? (
                <button type="button" onClick={handleRemove} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-emerald-100/75 transition hover:bg-white/10">
                  <Upload className="h-4 w-4" />
                  Remove image
                </button>
              ) : null}
            </div>

            <UploadCard
              uploadedCrop={uploadedCrop}
              errorMessage={errorMessage}
              onBrowse={() => fileInputRef.current?.click()}
              onChange={handleInputChange}
              onRemove={handleRemove}
              onDrop={handleDrop}
              onDragOver={(event) => {
                event.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              fileInputRef={fileInputRef}
              isDragging={isDragging}
              actions={
                <>
                  <button type="button" onClick={handleAnalyze} disabled={!uploadedCrop || isAnalyzing} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3.5 font-semibold text-[#04110b] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-400/35 disabled:text-[#04110b]/60">
                    <Upload className="h-4 w-4" />
                    Analyze Crop
                  </button>
                  <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 font-semibold text-white/90 transition hover:bg-white/10">
                    Back to Dashboard
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </>
              }
            />
          </div>
        </motion.section>
      </main>

      <Loader visible={isAnalyzing} progress={progress} stage={loadingTexts[analysisStage]} />
    </div>
  )
}
