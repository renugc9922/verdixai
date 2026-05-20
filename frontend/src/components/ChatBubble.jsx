import { Bot, UserRound } from 'lucide-react'

export default function ChatBubble({ role, children, time }) {
  const isUser = role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
          <Bot className="h-5 w-5" />
        </div>
      ) : null}
      <div className={`max-w-[80%] rounded-[1.4rem] border px-4 py-3 ${isUser ? 'border-emerald-300/15 bg-emerald-400/10 text-white' : 'border-white/10 bg-white/5 text-emerald-100/80'}`}>
        {children}
        {time ? <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-emerald-100/45">{time}</p> : null}
      </div>
      {isUser ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-300 text-[#04110b]">
          <UserRound className="h-5 w-5" />
        </div>
      ) : null}
    </div>
  )
}
