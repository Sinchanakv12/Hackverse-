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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#09090b]/80 border-b border-cyber-border">
      <div className="flex items-center justify-between px-6 py-3">

        {/* ── Brand ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {/* Modern Logo mark */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyber-cyan to-violet-500 flex items-center justify-center shadow-lg shadow-cyber-cyan/10">
            <span className="text-white text-xs font-bold">⚡</span>
          </div>

          <div>
            <h1 className="font-sans font-black text-sm tracking-wider text-white uppercase leading-none">
              Chaos Architect
            </h1>
            <p className="font-sans text-[9px] tracking-widest text-[#a1a1aa] uppercase mt-1 font-medium">
              Supply Chain Resilience AI // v1.0.0-MVP
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
              <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              <span className={`font-sans text-[10px] tracking-widest font-bold uppercase ${status.textColor}`}>
                {status.label}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Divider */}
          <div className="w-px h-4 bg-cyber-border" />

          {/* Uptime / Timestamp */}
          <div className="font-sans text-[9px] text-[#a1a1aa] tracking-wider uppercase font-medium">
            <span className="text-[#71717a]">SYS_TIME </span>
            <span className="font-mono text-[10px] text-white font-normal lowercase">{timeStr}</span>
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-cyber-border" />

          {/* Node Health */}
          <div className="flex items-center gap-1.5 font-sans text-[9px] text-[#a1a1aa] tracking-wider uppercase font-medium">
            <span className="text-[#71717a]">NODES </span>
            <span className={`font-mono text-[10px] ${chaosState === 'idle' ? 'text-cyber-green' : 'text-cyber-red'}`}>
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
              className="ml-4 w-7 h-7 flex items-center justify-center border border-cyber-border hover:border-cyber-cyan/40 text-cyber-gray hover:text-white transition-all rounded-md font-sans text-xs bg-[#121214] cursor-pointer"
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
            <div className="bg-cyber-red/10 border-t border-cyber-red/20 px-6 py-2 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-pulse" />
              <span className="font-sans text-[10px] text-cyber-red tracking-widest uppercase font-semibold">
                CRITICAL: BENGALURU DISTRIBUTION CENTER — NODE FAILURE DETECTED — CATEGORY 4 FLOOD EVENT
              </span>
              <div className="flex-1" />
              <span className="font-sans text-[9px] text-cyber-red/80 tracking-widest uppercase font-bold">
                {chaosState === 'resolving' ? '⟳ AGENT INTERVENTION IN PROGRESS' : '⚠ AWAITING RESPONSE'}
              </span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
