import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChaos } from '../context/ChaosContext'

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
    let badgeColor = 'bg-rose-50 text-rose-700 border-rose-200'
    if (agentName.includes('RISK ASSESSOR')) {
      badgeColor = 'bg-amber-50 text-amber-700 border-amber-200'
    } else if (agentName.includes('LOGISTICS ROUTER')) {
      badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-200'
    } else if (agentName.includes('FINANCIAL OPTIMIZER')) {
      badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200'
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
  const { supplyChainData, simulationHistory } = useChaos()
  const [commandInput, setCommandInput] = useState('')
  const [localLogs, setLocalLogs] = useState([])

  const isIdle = chaosState === 'idle'
  const parentLines = isIdle ? IDLE_LINES : (
    chaosState === 'awaiting_auth'
      ? [...logs, '[SYSTEM] REROUTE PLAN DRAFTED. AWAITING HUMAN AUTHORIZATION (HITL).']
      : (chaosState === 'resolved'
          ? [...logs, '[SYSTEM] REROUTE PLAN DRAFTED. AWAITING HUMAN AUTHORIZATION (HITL).', '[SYSTEM] HUMAN AUTHORIZATION GRANTED. DEPLOYING REROUTE CAMPAIGN...']
          : logs)
  )

  const displayLines = [...parentLines, ...localLogs]

  // Command handler
  const handleCommandSubmit = (e) => {
    if (e.key === 'Enter') {
      const cmd = commandInput.trim()
      if (!cmd) return

      const newLines = [`> ${cmd}`]

      if (cmd.startsWith('/help')) {
        newLines.push(
          '  Available console commands:',
          '  /help      - Show list of active terminal commands',
          '  /nodes     - Retrieve current status registry of network nodes',
          '  /history   - Read recent agent deployment logs archive',
          '  /clear     - Flush user-command terminal history'
        )
      } else if (cmd.startsWith('/nodes')) {
        const nodes = supplyChainData?.nodes || []
        if (nodes.length === 0) {
          newLines.push('  Node Registry is offline or uninitialized.')
        } else {
          newLines.push('  Network Node Status Registry:')
          nodes.forEach((n) => {
            const statusIndicator = n.status === 'online' ? '🟢 ONLINE' : '🔴 OFFLINE'
            newLines.push(`  - ${n.name} (${n.id.toUpperCase()}): ${statusIndicator} | Vuln: ${Math.round(n.vulnerabilityScore * 100)}%`)
          })
        }
      } else if (cmd.startsWith('/history')) {
        if (simulationHistory.length === 0) {
          newLines.push('  No simulation runs recorded in current session.')
        } else {
          newLines.push(`  Simulation Archive Logs (${simulationHistory.length} run(s)):`)
          simulationHistory.forEach((h, idx) => {
            newLines.push(`  - Run #${idx + 1} [${h.timestamp}]: Category=${h.vertical} | Recov=$${((h.recoveredRevenue || 0)/1000000).toFixed(2)}M | Conf=${h.accuracyScore}%`)
          })
        }
      } else if (cmd.startsWith('/clear')) {
        setLocalLogs([])
        setCommandInput('')
        return
      } else {
        newLines.push(`  Command not recognized: "${cmd}". Type /help for available commands.`)
      }

      setLocalLogs((prev) => [...prev, ...newLines])
      setCommandInput('')
    }
  }

  // Auto-scroll to bottom as logs stream in
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs, localLogs])

  return (
    <div className="panel flex flex-col min-h-[280px]">
      {/* Panel header */}
      <div className="panel-header border-b border-border-subtle">
        <div className={`w-1.5 h-1.5 rounded-full ${
          chaosState === 'resolving' ? 'bg-status-warning animate-pulse' :
          chaosState === 'awaiting_auth' ? 'bg-status-warning animate-pulse' :
          chaosState === 'resolved' ? 'bg-status-safe' :
          isIdle ? 'bg-accent-blue/50' : 'bg-status-danger animate-pulse'
        }`} />
        <span>Agent Execution Console</span>
        <div className="flex-1" />
        <span className="text-[10px]">
          {chaosState === 'resolving' ? '⟳ RUNNING' :
           chaosState === 'awaiting_auth' ? '⏳ AWAITING HITL AUTH' :
           chaosState === 'resolved' ? '✓ COMPLETE' :
           isIdle ? 'STANDBY' : '⚠ ALERT'}
        </span>
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1 bg-slate-50 text-slate-700 rounded-md m-3 border border-slate-200 shadow-inner"
      >
        <AnimatePresence initial={false}>
          {displayLines.map((line, i) => (
            <motion.div
              key={`${chaosState}-${i}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15, delay: isIdle ? i * 0.05 : 0 }}
              className={`flex gap-3.5 items-baseline ${
                // Swarm handoffs & system messages
                line.includes('[SYSTEM] HUMAN AUTHORIZATION GRANTED') ? 'text-emerald-800 font-bold border border-emerald-250 bg-emerald-50 p-2 my-1.5 px-2.5 rounded-lg w-[calc(100%-16px)]' :
                line.includes('[SYSTEM]') ? 'text-amber-800 font-bold border border-amber-250 bg-amber-50 p-2 my-1.5 px-2.5 rounded-lg w-[calc(100%-16px)] animate-pulse' :
                line.includes('Handing off') || line.includes('Handover received') ? 'text-slate-700 font-bold border border-slate-200 bg-slate-100 p-2 my-1 px-2.5 rounded-lg w-[calc(100%-16px)]' :
                // ReAct token colours
                line.includes('[THOUGHT]')     ? 'text-violet-600 font-bold' :
                line.includes('[ACTION]')      ? 'text-sky-600 font-bold' :
                line.includes('[OBSERVATION]') ? 'text-zinc-500' :
                // Status / severity
                line.startsWith('🔴') || line.includes('⚠') ? 'text-red-650 font-semibold' :
                line.startsWith('✅') || line.startsWith('💚') || line.startsWith('🚀') ? 'text-emerald-600 font-semibold' :
                line.startsWith('▶')  ? 'text-accent-blue font-bold' :
                line.startsWith('🏷') ? 'text-accent-blue' :
                line.startsWith('📉') ? 'text-red-600 font-semibold' :
                // Divider lines
                line.startsWith('─')  ? 'opacity-40 text-slate-300' :
                line === ''           ? '' :
                'text-slate-500'
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

        {/* Interactive CLI Input Line */}
        <div className="flex gap-2 items-center mt-3 pt-2 border-t border-slate-200/60 text-slate-600">
          <span className="text-[#71717a]/50 flex-shrink-0 select-none w-4 text-right font-sans text-[10px]">&gt;</span>
          <span className="text-accent-blue font-bold font-mono select-none">$</span>
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            onKeyDown={handleCommandSubmit}
            placeholder="Type command (/help, /nodes, /history, /clear)..."
            className="flex-grow bg-transparent border-0 outline-none text-slate-800 font-mono text-[11px] placeholder-slate-400 p-0 focus:ring-0 focus:outline-none"
          />
        </div>
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
