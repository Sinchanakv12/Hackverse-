import { motion, AnimatePresence } from 'framer-motion'

const STATUS_COLORS = {
  idle:      { dot: 'bg-cyber-cyan', label: 'STANDBY',      textColor: 'text-cyber-cyan' },
  active:    { dot: 'bg-cyber-red animate-pulse', label: 'CRITICAL ALERT', textColor: 'text-cyber-red' },
  resolving: { dot: 'bg-cyber-yellow animate-pulse', label: 'AGENT ACTIVE', textColor: 'text-cyber-yellow' },
  resolved:  { dot: 'bg-cyber-green', label: 'STABILIZING',  textColor: 'text-cyber-green' },
}

export default function Header({ chaosState, onReset }) {
  const status = STATUS_COLORS[chaosState] || STATUS_COLORS.idle
  const now = new Date()
  const timeStr = now.toISOString().replace('T', ' ').split('.')[0] + ' UTC'

  return (
    <header className="panel border-b border-[#1a1a2e] border-t-0 border-l-0 border-r-0 z-10">
      <div className="flex items-center justify-between px-6 py-3">

        {/* ── Brand ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-4">
          {/* Logo mark */}
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="absolute inset-0 border border-cyber-cyan/40 rotate-45" />
            <div className="absolute inset-1 border border-cyber-cyan/20 rotate-45" />
            <span className="text-cyber-cyan font-mono font-bold text-sm glow-cyan z-10">⚡</span>
          </div>

          <div>
            <h1 className="font-mono font-bold text-lg tracking-[0.3em] text-white glow-cyan leading-none">
              CHAOS ARCHITECT
            </h1>
            <p className="font-mono text-[10px] tracking-widest text-cyber-gray mt-0.5">
              SUPPLY CHAIN RESILIENCE AI // v1.0.0-MVP
            </p>
          </div>
        </div>

        {/* ── System Status Bar ──────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-6">
          {/* Alert Level */}
          <AnimatePresence mode="wait">
            <motion.div
              key={chaosState}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex items-center gap-2"
            >
              <div className={`w-2 h-2 rounded-full ${status.dot}`} />
              <span className={`font-mono text-xs tracking-widest font-semibold ${status.textColor}`}>
                {status.label}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Divider */}
          <div className="w-px h-6 bg-[#1a1a2e]" />

          {/* Uptime / Timestamp */}
          <div className="font-mono text-[10px] text-cyber-gray tracking-wider">
            <span className="text-cyber-gray/50">SYS_TIME </span>
            {timeStr}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-[#1a1a2e]" />

          {/* Node Health */}
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-cyber-gray">
            <span className="text-cyber-gray/50">NODES </span>
            <span className={chaosState === 'idle' ? 'text-cyber-green' : 'text-cyber-red'}>
              {chaosState === 'idle' ? '5/5 ONLINE' : '4/5 ONLINE'}
            </span>
          </div>
        </div>

        {/* ── Reset Button (subtle, right side) ──────────────────────── */}
        <AnimatePresence>
          {chaosState !== 'idle' && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={onReset}
              title="Reset Simulation"
              className="ml-4 w-8 h-8 flex items-center justify-center border border-[#1a1a2e] hover:border-cyber-gray/40 text-cyber-gray hover:text-white transition-all rounded font-mono text-sm"
            >
              ↺
            </motion.button>
          )}
        </AnimatePresence>

      </div>

      {/* ── Alert Banner ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {chaosState === 'active' || chaosState === 'resolving' ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-cyber-red/10 border-t border-cyber-red/30 px-6 py-1.5 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-pulse" />
              <span className="font-mono text-[11px] text-cyber-red tracking-widest">
                CRITICAL: BENGALURU DISTRIBUTION CENTER — NODE FAILURE DETECTED — CATEGORY 4 FLOOD EVENT
              </span>
              <div className="flex-1" />
              <span className="font-mono text-[10px] text-cyber-red/60">
                {chaosState === 'resolving' ? '⟳ AGENT INTERVENTION IN PROGRESS' : '⚠ AWAITING RESPONSE'}
              </span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
