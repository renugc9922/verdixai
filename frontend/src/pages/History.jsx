import { useMemo, useState } from 'react'
import { ArrowLeft, Download, FileImage, Search, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { clearDetectionHistory, downloadTextFile, loadDetectionHistory } from '../services/storage'
import { formatDateTime, getSeverityTone } from '../utils/verdix'

const severities = ['All', 'Low', 'Medium', 'High']

export default function HistoryPage() {
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState('All')
  const [history, setHistory] = useState(() => loadDetectionHistory())

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const crop = item.crop ?? ''
      const disease = item.disease ?? ''
      const severityLevel = item.severity ?? ''
      const matchesSearch = [crop, disease, severityLevel].join(' ').toLowerCase().includes(search.toLowerCase())
      const matchesSeverity = severity === 'All' || severityLevel === severity
      return matchesSearch && matchesSeverity
    })
  }, [history, search, severity])

  const handleClear = () => {
    clearDetectionHistory()
    setHistory([])
  }

  const handleDownload = () => {
    const report = filteredHistory
      .map((item) => `${item.scanDate} | ${item.crop} | ${item.disease} | ${item.confidence}% | ${item.severity}`)
      .join('\n')
    downloadTextFile('verdixai-history.txt', report || 'No detections found.')
  }

  return (
    <div className="min-h-screen bg-[#020805] text-emerald-50">
      <header className="border-b border-white/10 bg-[#05120c]/75 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10">
              <FileImage className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold tracking-[0.22em] text-white">VERDIXAI</p>
              <p className="text-xs uppercase tracking-[0.26em] text-emerald-200/60">Detection History</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-emerald-100/80 transition hover:bg-white/10">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
            <button type="button" onClick={handleDownload} className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100/80 transition hover:bg-emerald-400/15">
              <Download className="h-4 w-4" />
              Download
            </button>
            <button type="button" onClick={handleClear} className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-100 transition hover:bg-rose-500/15">
              <Trash2 className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="rounded-[2rem] border border-white/10 bg-white/6 p-5 backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.26em] text-emerald-100/55">Review saved detections</p>
              <h1 className="mt-2 font-display text-3xl text-white">Scan history</h1>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
                <Search className="h-4 w-4 text-emerald-300" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search scans..." className="w-full bg-transparent text-sm text-white outline-none placeholder:text-emerald-100/40" />
              </div>
              <div className="flex gap-2">
                {severities.map((item) => (
                  <button key={item} type="button" onClick={() => setSeverity(item)} className={`rounded-full border px-4 py-2 text-sm transition ${severity === item ? 'border-emerald-300/20 bg-emerald-400/10 text-white' : 'border-white/10 bg-white/5 text-emerald-100/70 hover:bg-white/10'}`}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4">
          {filteredHistory.length ? filteredHistory.map((item) => (
            <article key={`${item.scanDate}-${item.crop}`} className="rounded-[1.8rem] border border-white/10 bg-white/6 p-5 backdrop-blur-xl sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <img src={item.uploadedImage} alt={item.crop} className="h-20 w-20 rounded-2xl border border-white/10 object-cover" />
                  <div>
                    <p className="font-display text-2xl text-white">{item.disease}</p>
                    <p className="mt-1 text-sm text-emerald-100/65">{item.crop}</p>
                    <p className="mt-2 text-sm text-emerald-100/55">{formatDateTime(item.scanDate)}</p>
                  </div>
                </div>

                <span className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${getSeverityTone(item.severity)}`}>
                  {item.severity}
                </span>
              </div>
            </article>
          )) : (
            <div className="rounded-[2rem] border border-white/10 bg-white/6 p-8 text-center text-emerald-100/65 backdrop-blur-xl">
              No detections found.
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
