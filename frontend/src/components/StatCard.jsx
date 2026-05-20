export default function StatCard({ label, value, change, icon: Icon }) {
  return (
    <article className="rounded-[1.6rem] border border-white/10 bg-white/6 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <span className="text-sm text-emerald-100/60">{label}</span>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-300/15 bg-emerald-400/10 text-emerald-300">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-5 font-display text-3xl text-white">{value}</p>
      <p className="mt-2 text-sm text-emerald-300">{change}</p>
    </article>
  )
}
