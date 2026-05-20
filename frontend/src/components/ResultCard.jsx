import { ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ResultCard({ result }) {
  const confidence = result.confidenceScore ?? result.confidence ?? 0
  const severity = result.severityLevel ?? result.severity ?? 'Low'
  const symptoms = Array.isArray(result.symptoms) ? result.symptoms.join(', ') : result.symptoms

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-[2rem] border border-white/10 bg-white/6 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.24)] backdrop-blur-2xl sm:p-6"
    >
      <div className="rounded-[1.75rem] border border-emerald-300/15 bg-[linear-gradient(135deg,rgba(6,95,70,0.9),rgba(4,17,11,0.92))] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/55">AI Diagnosis</p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-white">{result.diseaseName}</h1>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            High confidence
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/55">Confidence</p>
            <p className="mt-2 font-display text-2xl text-white">{confidence}%</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/55">Severity</p>
            <p className="mt-2 font-display text-2xl text-white">{severity}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:col-span-2 xl:col-span-2">
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/55">Crop</p>
            <p className="mt-2 font-display text-2xl text-white">{result.cropType}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/55">Symptoms</p>
            <p className="text-sm leading-7 text-emerald-100/75">{symptoms}</p>
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/55">Causes</p>
            <p className="text-sm leading-7 text-emerald-100/75">{result.causes}</p>
          </div>
          <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/55">Treatment</p>
            <p className="text-sm leading-7 text-emerald-100/75">{result.treatment}</p>
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/55">Prevention</p>
            <p className="text-sm leading-7 text-emerald-100/75">{result.prevention}</p>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
