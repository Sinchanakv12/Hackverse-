import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const IDLE_LINES = [
  '> CHAOS ARCHITECT v1.0.0 — Agent Runtime Initialized',
  '> Supply Chain Monitor: ACTIVE',
  '> Watching 5 nodes across 4 regions...',
  '> All sensors nominal. Awaiting crisis event.',
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
                line.startsWith('🔴') || line.startsWith('💸') || line.startsWith('⚠') ? 'text-cyber-red' :
                line.startsWith('✅') || line.startsWith('💚') ? 'text-cyber-green glow-green' :
                line.startsWith('🤖') || line.startsWith('▶') ? 'text-cyber-cyan' :
                line.startsWith('📊') || line.startsWith('🧮') ? 'text-cyber-yellow' :
                line.startsWith('📦') || line.startsWith('🔍') ? 'text-white' :
                line.startsWith('━') ? 'text-cyber-cyan/30' :
                line.startsWith('🚀') ? 'text-cyber-green' :
                line === '' ? '' :
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
            DEMAND-SHAPER ORCHESTRATOR v2.4
          </span>
        )}
      </div>
    </div>
  )
}
