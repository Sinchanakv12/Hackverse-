import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const IDLE_LINES = [
  '▶  CHAOS ARCHITECT — ReAct Agent Runtime v3.0',
  '   Framework: Reason + Act (ReAct) Loop',
  '   5 tools registered | 6 reasoning cycles available',
  '   Supply Chain Monitor: ACTIVE — watching 5 nodes across 4 regions.',
  '   All sensors nominal. Awaiting crisis event to begin ReAct loop.',
  '> _',
]

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
      <div className="panel-header">
        <div className={`w-1.5 h-1.5 rounded-full ${
          chaosState === 'resolving' ? 'bg-cyber-yellow animate-pulse' :
          chaosState === 'resolved' ? 'bg-cyber-green' :
          isIdle ? 'bg-cyber-cyan/50' : 'bg-cyber-red animate-pulse'
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
        className="flex-1 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-0.5"
        style={{ background: 'rgba(5, 5, 8, 0.8)' }}
      >
        <AnimatePresence initial={false}>
          {displayLines.map((line, i) => (
            <motion.div
              key={`${chaosState}-${i}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15, delay: isIdle ? i * 0.05 : 0 }}
              className={`flex gap-2 ${
                // ReAct token colours
                line.includes('[THOUGHT]')     ? 'text-violet-400' :
                line.includes('[ACTION]')      ? 'text-cyber-cyan' :
                line.includes('[OBSERVATION]') ? 'text-cyber-gray-light' :
                // Status / severity
                line.startsWith('🔴') || line.includes('⚠') ? 'text-cyber-red' :
                line.startsWith('✅') || line.startsWith('💚') || line.startsWith('🚀') ? 'text-cyber-green glow-green' :
                line.startsWith('▶')  ? 'text-cyber-cyan font-semibold' :
                line.startsWith('🏷') ? 'text-cyber-cyan' :
                line.startsWith('📉') ? 'text-cyber-red' :
                // Divider lines
                line.startsWith('─')  ? 'text-[#1a1a2e]' :
                line === ''           ? '' :
                'text-cyber-gray'
              }`}
            >
              {line !== '' && !line.startsWith('━') && (
                <span className="text-cyber-cyan/30 flex-shrink-0 select-none">›</span>
              )}
              <span className={line.startsWith('━') ? 'w-full' : ''}>
                {line}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Blinking cursor while resolving */}
        {chaosState === 'resolving' && (
          <div className="flex gap-2 text-cyber-cyan">
            <span className="text-cyber-cyan/30">›</span>
            <span className="terminal-cursor" />
          </div>
        )}
      </div>

      {/* Line count footer */}
      <div className="panel-header border-t border-b-0 mt-auto">
        <span className="text-[10px]">
          {displayLines.length} lines
        </span>
        <div className="flex-1" />
        {!isIdle && (
          <span className="text-[10px] text-cyber-cyan/60">
            ReAct ORCHESTRATOR v3.0 — 5 TOOLS
          </span>
        )}
      </div>
    </div>
  )
}
