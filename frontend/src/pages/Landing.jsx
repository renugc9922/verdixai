import { ArrowRight, BarChart3, Bot, Leaf, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import FeatureCard from '../components/FeatureCard'
import { features, itemVariants, pageVariants } from '../utils/verdix'

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-[#020805] text-emerald-50">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-[-10%] top-[-8%] h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute right-[-6%] top-[12%] h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute bottom-[-12%] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-lime-500/10 blur-3xl" />
      </div>

      <Navbar
        logoSubtitle="Smarter Crop Health with AI"
        rightContent={
          <nav className="hidden items-center gap-8 text-sm text-emerald-100/80 md:flex">
            <a className="transition hover:text-white" href="#home">Home</a>
            <a className="transition hover:text-white" href="#features">Features</a>
            <Link className="transition hover:text-white" to="/dashboard">Dashboard</Link>
            <Link className="transition hover:text-white" to="/login">Login</Link>
            <Link className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/15 px-4 py-2 font-medium text-white shadow-[0_0_30px_rgba(52,211,153,0.16)] transition hover:-translate-y-0.5 hover:bg-emerald-400/20" to="/login">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        }
      />

      <main id="home" className="relative z-10">
        <motion.section className="mx-auto grid w-full max-w-7xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-28 lg:pt-24" variants={pageVariants} initial="hidden" animate="visible">
          <div className="flex flex-col justify-center">
            <motion.div variants={itemVariants} className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/15 bg-white/5 px-4 py-2 text-sm text-emerald-100/80 backdrop-blur-md">
              <Bot className="h-4 w-4 text-emerald-300" />
              AI crop diagnostics for modern agriculture
            </motion.div>

            <motion.h1 variants={itemVariants} className="max-w-3xl font-display text-5xl leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
              AI-Powered Crop Disease Detection
            </motion.h1>

            <motion.p variants={itemVariants} className="mt-6 max-w-2xl text-lg leading-8 text-emerald-100/74 sm:text-xl">
              Upload crop images and receive instant AI-powered disease analysis, treatment recommendations, and prevention guidance.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-4">
              <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3.5 font-semibold text-[#04110b] shadow-[0_18px_45px_rgba(34,197,94,0.25)] transition hover:-translate-y-0.5 hover:bg-emerald-300">
                Start Detection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-6 py-3.5 font-semibold text-white/90 backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/10">
                Explore Features
              </a>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-10 grid max-w-xl grid-cols-3 gap-4 text-sm text-emerald-50/80">
              {[
                ['99.2%', 'Model confidence'],
                ['24/7', 'Instant analysis'],
                ['Field-ready', 'Farmer focused'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                  <p className="font-display text-2xl font-semibold text-white">{value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-emerald-100/55">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="relative mx-auto w-full max-w-xl">
            <div className="absolute inset-0 rounded-[2rem] bg-emerald-400/15 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-emerald-200/65">AI crop scan</p>
                  <h2 className="mt-1 font-display text-2xl text-white">Leaf Spot Analysis</h2>
                </div>
                <div className="rounded-full border border-emerald-300/20 bg-emerald-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                  Live result
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-emerald-950 via-[#0b1d14] to-[#04120c] p-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.2),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.15),transparent_30%)]" />
                  <div className="relative flex h-full min-h-[300px] flex-col justify-between">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-emerald-100/50">
                      <span>Maize sample #27</span>
                      <span>Scanned in 0.8s</span>
                    </div>

                    <div className="relative mx-auto flex h-44 w-44 items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-400/10">
                      <div className="absolute inset-6 rounded-full border border-dashed border-emerald-200/25" />
                      <div className="absolute inset-2 rounded-full bg-[radial-gradient(circle,rgba(110,231,183,0.22),transparent_68%)]" />
                      <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-emerald-200/20 bg-[#05120c]/80 shadow-[0_0_35px_rgba(34,197,94,0.2)]">
                        <Leaf className="h-12 w-12 text-emerald-300" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center text-xs text-emerald-100/70">
                      {['Crisp scan', 'Heatmap ready', 'Localized guidance'].map((label) => (
                        <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-md">{label}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.5rem] border border-white/10 bg-[#07140f]/85 p-5 backdrop-blur-md">
                    <div className="flex items-center justify-between text-sm text-emerald-100/70">
                      <span>Detected condition</span>
                      <span className="inline-flex items-center gap-2 text-emerald-300">
                        <ShieldCheck className="h-4 w-4" />
                        High confidence
                      </span>
                    </div>
                    <p className="mt-3 font-display text-2xl text-white">Early Leaf Blight</p>
                    <p className="mt-2 text-sm leading-6 text-emerald-100/65">Symptoms align with fungal stress markers commonly seen in wet field conditions.</p>
                  </div>

                  <div className="rounded-[1.5rem] border border-emerald-300/15 bg-white/5 p-5 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-emerald-100/70">Confidence score</span>
                      <span className="font-display text-2xl text-white">96%</span>
                    </div>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[96%] rounded-full bg-gradient-to-r from-emerald-400 via-lime-300 to-teal-300" />
                    </div>
                    <div className="mt-5 grid gap-3 text-sm text-emerald-100/72">
                      {['Recommended treatment: targeted fungicide application', 'Next step: remove affected leaves and monitor spread', 'Prevention: improve spacing and reduce leaf wetness'].map((item) => (
                        <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/5 p-3">
                          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                      <BarChart3 className="h-5 w-5 text-emerald-300" />
                      <p className="mt-3 text-sm text-emerald-100/60">Risk trend</p>
                      <p className="mt-1 font-display text-xl text-white">Stable</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                      <Bot className="h-5 w-5 text-emerald-300" />
                      <p className="mt-3 text-sm text-emerald-100/60">AI assistant</p>
                      <p className="mt-1 font-display text-xl text-white">On guard</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        <section id="features" className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
          <motion.div className="mb-10 max-w-2xl" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.6 }}>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-200/60">Features</p>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">Built for fast diagnosis and confident decision-making</h2>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map(({ icon, title, description }) => (
              <FeatureCard key={title} icon={icon} title={title} description={description} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
