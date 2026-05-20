import { Link } from 'react-router-dom'
import { BarChart3, Bot, FileImage, LogOut, ScanSearch, Settings, Sparkles } from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3, active: true },
  { to: '/detect', label: 'Crop Detection', icon: ScanSearch },
  { to: '/history', label: 'Detection History', icon: FileImage },
  { to: '/assistant', label: 'AI Assistant', icon: Bot },
]

export default function Sidebar() {
  return (
    <aside className="border-b border-white/10 bg-[#04110b]/90 px-4 py-4 backdrop-blur-xl lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:flex-col lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <Link to="/" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10">
          <Sparkles className="h-5 w-5 text-emerald-300" />
        </div>
        <div>
          <p className="font-display text-lg font-semibold tracking-[0.22em] text-white">VERDIXAI</p>
          <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/55">Farmer Dashboard</p>
        </div>
      </Link>

      <nav className="mt-5 grid gap-2 text-sm text-emerald-100/80 lg:mt-8">
        {navItems.map(({ to, label, icon: Icon, active }) => (
          <Link
            key={label}
            to={to}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition hover:bg-white/8 ${
              active
                ? 'border-emerald-300/20 bg-emerald-400/10 text-white'
                : 'border-transparent text-emerald-100/80'
            }`}
          >
            <Icon className="h-4 w-4 text-emerald-300" />
            {label}
          </Link>
        ))}
        <button type="button" className="flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-left text-emerald-100/55 transition hover:bg-white/8">
          <Settings className="h-4 w-4 text-emerald-300" />
          Settings
        </button>
        <Link to="/login" className="flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-emerald-100/80 transition hover:bg-white/8">
          <LogOut className="h-4 w-4 text-emerald-300" />
          Logout
        </Link>
      </nav>

      <div className="mt-5 hidden rounded-[1.6rem] border border-white/10 bg-white/5 p-4 backdrop-blur-md lg:block">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-white">Smart Farming</p>
            <p className="text-xs text-emerald-100/55">AI support for every scan</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-emerald-100/65">
          Track crop health, review detections, and act faster with premium AI guidance.
        </p>
      </div>
    </aside>
  )
}
