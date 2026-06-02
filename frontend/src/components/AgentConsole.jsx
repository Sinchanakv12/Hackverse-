import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const IDLE_LINES = [
  '▶  CHAOS ARCHITECT — Multi-Agent Swarm Runtime v3.0',
  '   Framework: Chain of Thought Pipeline (Collaborative Agents)',
  '   5 tools registered | 3 specialized agent personas online',
  '   Supply Chain Monitor: ACTIVE — watching 5 nodes across 4 regions.',
  '   All sensors nominal. Awaiting crisis event to begin collaborative reasoning.',
  '> _',
]

const highlightAgentTags = (text) => {
  if (typeof text !== 'string') return text
  const parts = []
  const regex = /\[AGENT:\s*([^\]]+)\]/g
  let match
  let lastIndex = 0
  
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }
    const agentName = match[1].trim()
    let badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    if (agentName.includes('RISK ASSESSOR')) {
      badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    } else if (agentName.includes('LOGISTICS ROUTER')) {
      badgeColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    } else if (agentName.includes('FINANCIAL OPTIMIZER')) {
      badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    }
    parts.push(
      <span key={match.index} className={`px-1.5 py-0.5 border rounded text-[9px] font-sans font-bold uppercase tracking-wider ${badgeColor} mr-1 inline-block flex-shrink-0`}>
        {agentName}
      </span>
    )
    lastIndex = regex.lastIndex
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }
  
  return parts.length > 0 ? <span className="inline-flex items-center flex-wrap gap-1 align-middle">{parts}</span> : text
}

export default function AgentConsole({ logs, chaosState }) {
  const scrollRef = useRef(null)
  const isIdle = chaosState === 'idle'
  const displayLines = isIdle ? IDLE_LINES : logs

  // Auto-scroll to bottom as logs stream in
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div className="panel flex flex-col min-h-[280px]">
      {/* Panel header */}
      <div className="panel-header border-b border-border-subtle">
        <div className={`w-1.5 h-1.5 rounded-full ${
          chaosState === 'resolving' ? 'bg-status-warning animate-pulse' :
          chaosState === 'resolved' ? 'bg-status-safe' :
          isIdle ? 'bg-accent-blue/50' : 'bg-status-danger animate-pulse'
        }`} />
        <span>Agent Execution Console</span>
        <div className="flex-1" />
        <span className="text-[10px]">
          {chaosState === 'resolving' ? '⟳ RUNNING' :
           chaosState === 'resolved' ? '✓ COMPLETE' :
           isIdle ? 'STANDBY' : '⚠ ALERT'}
        </span>
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1 bg-slate-900 text-slate-300 rounded-md m-3 border border-border-subtle"
      >
        <AnimatePresence initial={false}>
          {displayLines.map((line, i) => (
            <motion.div
              key={`${chaosState}-${i}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15, delay: isIdle ? i * 0.05 : 0 }}
              className={`flex gap-3.5 items-baseline ${
                // Swarm handoffs
                line.includes('Handing off') || line.includes('Handover received') ? 'text-slate-200 font-bold border border-slate-700 bg-slate-800/40 p-2 my-1 px-2.5 rounded-lg w-[calc(100%-16px)]' :
                // ReAct token colours
                line.includes('[THOUGHT]')     ? 'text-violet-400 font-medium' :
                line.includes('[ACTION]')      ? 'text-sky-400 font-medium' :
                line.includes('[OBSERVATION]') ? 'text-zinc-400' :
                // Status / severity
                line.startsWith('🔴') || line.includes('⚠') ? 'text-status-danger' :
                line.startsWith('✅') || line.startsWith('💚') || line.startsWith('🚀') ? 'text-status-safe' :
                line.startsWith('▶')  ? 'text-accent-blue font-semibold' :
                line.startsWith('🏷') ? 'text-accent-blue' :
                line.startsWith('📉') ? 'text-status-danger' :
                // Divider lines
                line.startsWith('─')  ? 'opacity-30 text-text-secondary' :
                line === ''           ? '' :
                'text-text-secondary'
              }`}
            >
              {line !== '' && !line.startsWith('━') && (
                <span className="text-[#71717a]/50 flex-shrink-0 select-none w-4 text-right font-sans text-[10px]">{(i + 1)}</span>
              )}
              <span className={line.startsWith('━') ? 'w-full' : 'flex-1 inline-flex items-center flex-wrap'}>
                {highlightAgentTags(line)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Blinking cursor while resolving */}
        {chaosState === 'resolving' && (
          <div className="flex gap-3.5 text-accent-blue">
            <span className="text-[#71717a]/50 flex-shrink-0 select-none w-4 text-right font-sans text-[10px]">{displayLines.length + 1}</span>
            <span className="terminal-cursor" />
          </div>
        )}
      </div>

      {/* Line count footer */}
      <div className="panel-header border-t border-border-subtle border-b-0 mt-auto">
        <span className="text-[10px]">
          {displayLines.length} lines
        </span>
        <div className="flex-1" />
        {!isIdle && (
          <span className="text-[10px] text-accent-blue/60">
            ReAct ORCHESTRATOR v3.0 — 5 TOOLS
          </span>
        )}
      </div>
    </div>
  )
}
