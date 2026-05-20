import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function Loader({ visible, progress, stage, text }) {
  if (!visible) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={text ? 'flex items-center gap-3 text-sm text-emerald-100/70' : 'fixed inset-0 z-50 flex items-center justify-center bg-[#020805]/80 px-4 backdrop-blur-xl'}
      >
        <motion.div
          initial={{ scale: 0.96, y: 12 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={text ? 'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2' : 'w-full max-w-md rounded-[2rem] border border-white/10 bg-white/8 p-6 text-center shadow-[0_35px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl'}
        >
          <Loader2 className={text ? 'h-4 w-4 animate-spin text-emerald-300' : 'mx-auto h-8 w-8 animate-spin text-emerald-300'} />
          {text ? <span>{text}</span> : null}
          {!text ? (
            <>
              <p className="mt-5 font-display text-2xl text-white">{stage}</p>
              <p className="mt-2 text-sm text-emerald-100/60">Preparing AI-powered crop diagnostics</p>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-lime-300 to-teal-300"
                  initial={{ width: '12%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.24em] text-emerald-100/50">{progress}% complete</p>
            </>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
