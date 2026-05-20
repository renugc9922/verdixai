import { ArrowRight, Bell, ImagePlus, Search, ShieldCheck, Sparkles, Upload, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import { dashboardDetections, dashboardStats, getSeverityTone } from '../utils/verdix'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#020805] text-emerald-50">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-8%] h-96 w-96 rounded-full bg-emerald-500/16 blur-3xl" />
        <div className="absolute right-[-10%] top-16 h-[30rem] w-[30rem] rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute bottom-[-14%] left-1/3 h-[32rem] w-[32rem] rounded-full bg-lime-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-[#04110b]/75 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md xl:max-w-xl xl:flex-1">
                <Search className="h-4 w-4 shrink-0 text-emerald-300" />
                <input type="text" placeholder="Search crops, scans, history..." className="w-full bg-transparent text-sm text-white outline-none placeholder:text-emerald-100/40" />
              </div>

              <div className="flex items-center gap-3 self-start xl:self-auto">
                <button type="button" className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-emerald-100/80 backdrop-blur-md transition hover:bg-white/10">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-md">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-300 text-[#04110b]">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Farmer Ade</p>
                    <p className="text-xs text-emerald-100/55">Premium Plan</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="relative flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
              <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-[2rem] border border-emerald-300/15 bg-[linear-gradient(135deg,rgba(6,95,70,0.95),rgba(4,17,11,0.95))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.32)] sm:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_24%)]" />
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-sm uppercase tracking-[0.26em] text-emerald-100/55">Welcome back, Farmer</p>
                    <h1 className="mt-3 font-display text-4xl leading-tight text-white sm:text-5xl">Monitor crop health and run AI-powered disease detection.</h1>
                  </div>
                  <Link to="/detect" className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-400 px-5 py-3 font-semibold text-[#04110b] transition hover:bg-emerald-300">
                    Start New Scan
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.section>

              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {dashboardStats.map(({ label, value, change, icon }, index) => (
                  <motion.div key={label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: index * 0.05 }} whileHover={{ y: -3 }}>
                    <StatCard label={label} value={value} change={`${change} from last week`} icon={icon} />
                  </motion.div>
                ))}
              </section>

              <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-[2rem] border border-white/10 bg-white/6 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.26em] text-emerald-100/55">Upload Crop Image</p>
                      <h2 className="mt-2 font-display text-2xl text-white">Analyze a fresh leaf scan</h2>
                    </div>
                    <div className="hidden rounded-full border border-emerald-300/15 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100 sm:inline-flex">PNG, JPG, JPEG</div>
                  </div>

                  <div className="mt-5 rounded-[1.75rem] border-2 border-dashed border-emerald-300/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 text-center sm:p-8">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-300">
                      <ImagePlus className="h-8 w-8" />
                    </div>
                    <p className="mt-5 font-display text-2xl text-white">Upload Crop Leaf Image</p>
                    <p className="mt-2 text-sm text-emerald-100/60">Supported formats: PNG, JPG, JPEG</p>

                    <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                      <Link to="/detect" className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 font-semibold text-[#04110b] transition hover:bg-emerald-300">
                        Analyze Crop
                        <Upload className="h-4 w-4" />
                      </Link>
                      <span className="text-sm text-emerald-100/55">Drag & drop style dropzone preview only</span>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-emerald-100/55">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">One-click scan</span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Instant insights</span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Field ready</span>
                    </div>
                  </div>
                </motion.article>

                <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="rounded-[2rem] border border-white/10 bg-white/6 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.26em] text-emerald-100/55">Recent Detections</p>
                      <h2 className="mt-2 font-display text-2xl text-white">Latest scan results</h2>
                    </div>
                    <Sparkles className="h-5 w-5 text-emerald-300" />
                  </div>

                  <div className="mt-5 space-y-4">
                    {dashboardDetections.map(({ crop, disease, confidence, date, severity }, index) => (
                      <motion.div key={crop} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }} whileHover={{ x: 3 }} className="rounded-[1.45rem] border border-white/10 bg-[#07140f]/85 p-4 backdrop-blur-md">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-display text-lg text-white">{crop}</p>
                            <p className="mt-1 text-sm text-emerald-100/65">{disease}</p>
                          </div>
                          <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${getSeverityTone(severity)}`}>
                            {severity}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-emerald-100/65">
                          <span>Confidence: <strong className="text-white">{confidence}</strong></span>
                          <span>Scan Date: <strong className="text-white">{date}</strong></span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.article>
              </section>

              <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="rounded-[2rem] border border-white/10 bg-white/6 p-5 backdrop-blur-xl sm:p-6">
                  <p className="text-sm uppercase tracking-[0.26em] text-emerald-100/55">AI Assistant</p>
                  <h2 className="mt-2 font-display text-2xl text-white">Ask for next-step guidance</h2>
                  <div className="mt-5 space-y-3">
                    {['Best treatment for early fungal stress?', 'How can I prevent recurring leaf blight?', 'What is the safest follow-up spray plan?'].map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-emerald-100/70">{item}</div>
                    ))}
                  </div>
                </motion.article>

                <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12 }} className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(6,95,70,0.6),rgba(4,17,11,0.8))] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.26em] text-emerald-100/55">Status</p>
                      <h2 className="mt-2 font-display text-2xl text-white">Current scan health</h2>
                    </div>
                    <ShieldCheck className="h-5 w-5 text-emerald-300" />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {[['Field Coverage', '92%'], ['Alerts Sent', '18'], ['Avg Response', '1.2s']].map(([label, value]) => (
                      <div key={label} className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
                        <p className="text-sm text-emerald-100/60">{label}</p>
                        <p className="mt-2 font-display text-2xl text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </motion.article>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
