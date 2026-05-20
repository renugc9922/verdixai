import { Link } from 'react-router-dom'

export default function Navbar({ logoSubtitle, rightContent, logoLink = '/' }) {
  return (
    <header className="border-b border-white/10 bg-[#05120c]/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to={logoLink} className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 shadow-[0_0_35px_rgba(34,197,94,0.15)]">
            <span className="text-sm font-bold text-emerald-300">V</span>
          </div>
          <div>
            <p className="font-display text-lg font-semibold tracking-[0.22em] text-white">VERDIXAI</p>
            <p className="text-xs uppercase tracking-[0.26em] text-emerald-200/60">{logoSubtitle}</p>
          </div>
        </Link>

        <div>{rightContent}</div>
      </div>
    </header>
  )
}
