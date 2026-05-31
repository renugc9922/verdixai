import { useState } from 'react'
import { ArrowLeft, Bot, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import ChatBubble from '../components/ChatBubble'
import Loader from '../components/Loader'
import { sendAssistantMessage } from '../services/assistantApi'
import { loadCropResult, loadDetectionHistory } from '../services/storage'
import { assistantPromptChips, assistantResponses, unknownAnalysisResult } from '../utils/verdix'

function getLatestDiseaseContext() {
  const storedResult = loadCropResult()

  if (storedResult) {
    return {
      disease: storedResult.disease,
      crop: storedResult.crop,
      severity: storedResult.severity,
      confidence: storedResult.confidence,
    }
  }

  const history = loadDetectionHistory()
  const latestHistoryItem = history[0]

  if (latestHistoryItem) {
    return {
      disease: latestHistoryItem.disease,
      crop: latestHistoryItem.crop,
      severity: latestHistoryItem.severity,
      confidence: latestHistoryItem.confidence,
    }
  }

  return {
    ...unknownAnalysisResult,
  }
}

export default function AssistantPage() {
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState(() => assistantResponses)
  const [isTyping, setIsTyping] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [diseaseContext] = useState(() => getLatestDiseaseContext())

  const submitMessage = async (message) => {
    const trimmedMessage = message.trim()

    if (!trimmedMessage || isTyping) {
      return
    }

    setErrorMessage('')
    setMessages((currentMessages) => [...currentMessages, { role: 'user', message: trimmedMessage }])
    setPrompt('')
    setIsTyping(true)

    try {
      const response = await sendAssistantMessage(trimmedMessage, diseaseContext)
      setMessages((currentMessages) => [...currentMessages, { role: 'assistant', message: response.reply }])
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to get a reply right now.')
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    void submitMessage(prompt)
  }

  const handleChipClick = (chip) => {
    void submitMessage(chip)
  }

  return (
    <div className="min-h-screen bg-[#020805] text-emerald-50">
      <header className="border-b border-white/10 bg-[#05120c]/75 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10">
              <Bot className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold tracking-[0.22em] text-white">VERDIXAI</p>
              <p className="text-xs uppercase tracking-[0.26em] text-emerald-200/60">AI Assistant</p>
            </div>
          </Link>
          <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-emerald-100/80 transition hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:py-10">
        <section className="rounded-[2rem] border border-white/10 bg-white/6 p-5 backdrop-blur-xl sm:p-6">
          <div className="mb-5">
            <p className="text-sm uppercase tracking-[0.26em] text-emerald-100/55">Assistant chat</p>
            <h1 className="mt-2 font-display text-3xl text-white">Ask about treatments, prevention, and next steps</h1>
            <p className="mt-3 text-sm leading-6 text-emerald-100/60">
              Current context: {diseaseContext.disease} on {diseaseContext.crop} with {diseaseContext.severity} severity.
            </p>
          </div>

          <div className="space-y-4">
            {messages.map((entry, index) => (
              <ChatBubble key={`${entry.role}-${index}-${entry.message.slice(0, 12)}`} role={entry.role} time={entry.role === 'assistant' ? 'Just now' : 'You'}>
                <p className="text-sm leading-7">{entry.message}</p>
              </ChatBubble>
            ))}
            <Loader visible={isTyping} text="Typing answer..." />
          </div>

          {errorMessage ? (
            <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{errorMessage}</p>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
            <input
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Ask anything about your scan..."
              className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-emerald-100/40"
            />
            <button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 font-semibold text-[#04110b] transition hover:bg-emerald-300">
              <Send className="h-4 w-4" />
              Send
            </button>
          </form>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(6,95,70,0.6),rgba(4,17,11,0.8))] p-5 backdrop-blur-xl sm:p-6">
          <p className="text-sm uppercase tracking-[0.26em] text-emerald-100/55">Prompt chips</p>
          <div className="mt-5 grid gap-3">
            {assistantPromptChips.map((chip) => (
              <button key={chip} type="button" onClick={() => handleChipClick(chip)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-emerald-100/75 transition hover:bg-white/10">
                {chip}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
