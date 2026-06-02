import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChaos } from '../context/ChaosContext'
import { scenarios } from '../scenariosData'
import {
  MessageSquare, X, Send, Terminal, Sparkles, RotateCcw,
  Bot, ChevronDown, Zap
} from 'lucide-react'

const QUICK_COMMANDS = [
  { label: 'System Status',            cmd: 'What is the current system status?' },
  { label: '⚡ Cyber Attack — Delhi',  cmd: 'Simulate a cyber attack at Delhi'   },
  { label: '🌊 Flood — Mumbai',        cmd: 'What if Mumbai floods?'             },
  { label: '✊ Strike — Bengaluru',    cmd: 'Simulate a labor strike at Bengaluru' },
  { label: '🤖 Enable Auto-Pilot',    cmd: 'Enable auto-pilot mode'             },
  { label: '🔄 Reset Systems',         cmd: 'Reset all systems'                  },
]

export default function CopilotChat() {
  const {
    parseCopilotCommand,
    handleReset,
    setIsWizardOpen,
    setAutoPilotMode,
    executeSimulation,
    chaosState,
    cascadeNodes,
  } = useChaos()

  const [isOpen, setIsOpen]         = useState(false)
  const [messages, setMessages]     = useState([
    {
      id: 1,
      role: 'assistant',
      text: '👋 Hello, Operator. I\'m your **Supply Chain Copilot**.\n\nType a command or pick a quick action below. Try:\n• "Simulate cyber attack at Delhi"\n• "What if Chennai floods?"\n• "Status" or "Help"',
      ts: new Date().toLocaleTimeString()
    }
  ])
  const [input, setInput]           = useState('')
  const [isTyping, setIsTyping]     = useState(false)
  const [hasUnread, setHasUnread]   = useState(false)
  const bottomRef                   = useRef(null)
  const inputRef                    = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Push a system message when cascade fires
  useEffect(() => {
    if (cascadeNodes.length > 0) {
      const last = cascadeNodes[cascadeNodes.length - 1]
      const sysMsg = {
        id: Date.now(),
        role: 'system',
        text: `🌊 CASCADE ALERT: "${last.label}" detected at **${last.nodeId.toUpperCase()}** (Risk: ${last.risk}%)`,
        ts: new Date().toLocaleTimeString()
      }
      setMessages(prev => [...prev, sysMsg])
      if (!isOpen) setHasUnread(true)
    }
  }, [cascadeNodes.length])

  const sendMessage = async (text) => {
    if (!text.trim()) return
    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: text.trim(),
      ts: new Date().toLocaleTimeString()
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate AI "thinking" delay
    await new Promise(r => setTimeout(r, 600 + Math.random() * 600))

    const result = parseCopilotCommand(text)

    // Execute side effects
    if (result.action === 'reset') {
      handleReset()
    } else if (result.action === 'wizard') {
      setIsWizardOpen(true)
    } else if (result.action === 'autopilot') {
      setAutoPilotMode(true)
    } else if (result.action === 'simulate' && result.scenario) {
      const sc = result.scenario
      setIsWizardOpen(true)
    }

    setIsTyping(false)
    const botMsg = {
      id: Date.now() + 1,
      role: 'assistant',
      text: result.response,
      ts: new Date().toLocaleTimeString()
    }
    setMessages(prev => [...prev, botMsg])
    if (!isOpen) setHasUnread(true)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const renderText = (text) => {
    // Basic **bold** parsing
    return text.split('\n').map((line, i) => (
      <span key={i} className="block">
        {line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
          j % 2 === 1
            ? <strong key={j} className="font-bold">{part}</strong>
            : part
        )}
      </span>
    ))
  }

  return (
    <>
      {/* ── Floating Trigger Button ─────────────────────────────────────── */}
      <motion.button
        id="copilot-chat-btn"
        onClick={() => setIsOpen(o => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl cursor-pointer border-0"
        style={{
          background: 'linear-gradient(135deg, #1a1f2e 0%, #2563eb 100%)',
          boxShadow: '0 8px 32px rgba(37,99,235,0.45)'
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="x" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>
              <X className="w-5 h-5 text-white" />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Bot className="w-6 h-6 text-white" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        <AnimatePresence>
          {hasUnread && !isOpen && (
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white flex items-center justify-center"
            >
              <span className="text-[8px] text-white font-bold">!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat Panel ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: '#0e1117',
              border: '1px solid rgba(37,99,235,0.25)',
              maxHeight: '520px'
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/8"
              style={{ background: 'linear-gradient(135deg, #1a1f2e 0%, #111827 100%)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-white text-xs font-bold font-sans tracking-wider">SUPPLY CHAIN COPILOT</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] text-slate-400 font-mono font-semibold uppercase">ONLINE — Command Interface v2.0</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/8 text-slate-500 hover:text-slate-300 transition-colors border-0 bg-transparent cursor-pointer">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5" style={{ minHeight: '240px', maxHeight: '300px' }}>
              <AnimatePresence initial={false}>
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    {msg.role !== 'user' && (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        msg.role === 'system'
                          ? 'bg-red-500/20 border border-red-500/40'
                          : 'bg-blue-600/20 border border-blue-500/30'
                      }`}>
                        {msg.role === 'system'
                          ? <Zap className="w-3 h-3 text-red-400" />
                          : <Bot className="w-3 h-3 text-blue-400" />
                        }
                      </div>
                    )}

                    <div className={`max-w-[85%] px-3 py-2 rounded-xl text-[11px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : msg.role === 'system'
                        ? 'bg-red-950/60 border border-red-800/40 text-red-300 rounded-tl-sm'
                        : 'bg-slate-800 border border-slate-700/50 text-slate-200 rounded-tl-sm'
                    }`}>
                      {renderText(msg.text)}
                      <div className="text-[8px] text-right mt-1 opacity-40 font-mono">{msg.ts}</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex gap-2.5 items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                      <Bot className="w-3 h-3 text-blue-400" />
                    </div>
                    <div className="bg-slate-800 border border-slate-700/50 rounded-xl rounded-tl-sm px-3 py-2.5 flex gap-1">
                      {[0, 0.2, 0.4].map((d, i) => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.7, repeat: Infinity, delay: d }} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Quick commands */}
            <div className="px-3 py-2 border-t border-white/6">
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {QUICK_COMMANDS.map((qc, i) => (
                  <button key={i} onClick={() => sendMessage(qc.cmd)}
                    className="shrink-0 px-2.5 py-1 rounded-full text-[9px] font-semibold font-sans text-slate-300 border border-slate-700 bg-slate-800/60 hover:border-blue-500/50 hover:text-blue-300 hover:bg-blue-900/20 transition-all cursor-pointer whitespace-nowrap">
                    {qc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input row */}
            <div className="p-3 border-t border-white/6 flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Copilot anything…"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-colors font-sans"
              />
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => sendMessage(input)}
                className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer border-0 shrink-0"
                style={{ background: input.trim() ? 'linear-gradient(135deg,#2563eb,#7c3aed)' : '#1e293b' }}>
                <Send className="w-3.5 h-3.5 text-white" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
