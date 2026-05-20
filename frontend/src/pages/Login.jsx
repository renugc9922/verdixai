import { useState } from 'react'
import { ArrowRight, Bot, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const authFeatures = [
  'Instant crop insights',
  'AI treatment guidance',
  'Scan history sync',
]

export default function LoginPage({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode)
  const navigate = useNavigate()

  const isLogin = mode === 'login'

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#020805] text-emerald-50">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.22),transparent_30%),linear-gradient(180deg,#04110b_0%,#020805_100%)] px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12">
          <div className="absolute inset-0 opacity-60">
            <div className="absolute left-[-10%] top-[-8%] h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="absolute bottom-[-12%] right-[-10%] h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-between gap-12">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10">
                <Sparkles className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold tracking-[0.22em] text-white">VERDIXAI</p>
                <p className="text-xs uppercase tracking-[0.26em] text-emerald-200/60">Smart access</p>
              </div>
            </Link>

            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-white/5 px-4 py-2 text-sm text-emerald-100/80 backdrop-blur-md">
                <Bot className="h-4 w-4 text-emerald-300" />
                Premium AI crop operations
              </span>
              <h1 className="mt-6 font-display text-5xl leading-tight text-white sm:text-6xl">
                {isLogin ? 'Welcome back, farmer.' : 'Create your VERDIXAI account.'}
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-8 text-emerald-100/70">
                Manage scans, review disease history, and get actionable guidance from a polished farm intelligence workspace.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {authFeatures.map((feature) => (
                  <div key={feature} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-emerald-100/70 backdrop-blur-md">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <ShieldCheck className="h-4 w-4" />
                      {feature}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['24/7', 'Crop intelligence'],
                ['AI', 'Disease guidance'],
                ['Secure', 'Session-based flows'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                  <p className="font-display text-2xl text-white">{value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-emerald-100/55">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-8">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1 text-sm text-emerald-100/75">
              <button type="button" onClick={() => setMode('login')} className={`rounded-full px-4 py-2 transition ${isLogin ? 'bg-emerald-400 text-[#04110b]' : ''}`}>
                Login
              </button>
              <button type="button" onClick={() => setMode('register')} className={`rounded-full px-4 py-2 transition ${!isLogin ? 'bg-emerald-400 text-[#04110b]' : ''}`}>
                Register
              </button>
            </div>

            <div className="mt-6">
              <p className="text-sm uppercase tracking-[0.26em] text-emerald-100/55">{isLogin ? 'Sign in to continue' : 'Join the platform'}</p>
              <h2 className="mt-3 font-display text-3xl text-white">{isLogin ? 'Login to VERDIXAI' : 'Register for VERDIXAI'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {!isLogin ? (
                <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-emerald-100/40" placeholder="Full name" />
              ) : null}
              <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-emerald-100/40" placeholder="Email address" type="email" />
              <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-emerald-100/40" placeholder="Password" type="password" />

              {!isLogin ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-emerald-100/70">
                  By creating an account, you can save scan history and access the assistant across sessions.
                </div>
              ) : null}

              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3.5 font-semibold text-[#04110b] transition hover:bg-emerald-300">
                {isLogin ? 'Continue to dashboard' : 'Create account'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between gap-4 text-sm text-emerald-100/60">
              <Link to="/" className="inline-flex items-center gap-1 transition hover:text-white">
                Back home
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link to={isLogin ? '/register' : '/login'} className="inline-flex items-center gap-1 transition hover:text-white">
                {isLogin ? 'Need an account?' : 'Already have an account?'}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
