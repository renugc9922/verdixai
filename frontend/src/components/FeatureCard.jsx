import { motion } from 'framer-motion'

export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.article
      className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-emerald-300/20 hover:bg-white/7"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/15 bg-emerald-400/10 text-emerald-300">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-display text-2xl text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-emerald-100/68">{description}</p>
    </motion.article>
  )
}
