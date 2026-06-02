import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Sensor 1: Rainfall — jitter around spike value when active ────────────
function RainfallSensor({ isIdle }) {
  const SPIKE = 145.2
  const NOMINAL = 12.3
  const [display, setDisplay] = useState(NOMINAL.toFixed(1))

  useEffect(() => {
    if (isIdle) {
      setDisplay(NOMINAL.toFixed(1))
      return
    }
    // Immediately show spike, then jitter every 600ms
    setDisplay(SPIKE.toFixed(1))
    const interval = setInterval(() => {
      setDisplay((SPIKE + (Math.random() - 0.5) * 4).toFixed(1))
    }, 600)
    return () => clearInterval(interval)
  }, [isIdle])

  return (
    <div className="flex justify-between items-center py-2 border-b border-cyber-border">
      <span className="font-sans text-[10px] text-cyber-gray uppercase tracking-wider">Rainfall</span>
      <span className={`font-mono text-xs font-semibold transition-colors duration-300 ${
        isIdle ? 'text-cyber-gray-light' : 'text-cyber-yellow glow-yellow'
      }`}>
        {display} mm/hr
      </span>
    </div>
  )
}

// ── Sensor 2: Flood Depth — count up from 0 to 182.5 over 1s, then jitter ─
function FloodDepthSensor({ isIdle }) {
  const TARGET = 182.5
  const [display, setDisplay] = useState('0.0')
  const frameRef = useRef(null)

  useEffect(() => {
    if (isIdle) {
      cancelAnimationFrame(frameRef.current)
      setDisplay('0.0')
      return
    }

    // Count-up animation over ~1000ms using rAF
    const start = performance.now()
    const DURATION = 1000

    const tick = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / DURATION, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out-cubic
      setDisplay((eased * TARGET).toFixed(1))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        // Jitter phase after count-up completes
        const jitter = setInterval(() => {
          setDisplay((TARGET + (Math.random() - 0.5) * 3).toFixed(1))
        }, 500)
        frameRef.current = jitter
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frameRef.current)
      clearInterval(frameRef.current)
    }
  }, [isIdle])

  return (
    <div className="flex justify-between items-center py-2 border-b border-cyber-border">
      <span className="font-sans text-[10px] text-cyber-gray uppercase tracking-wider">Flood Depth</span>
      <span className={`font-mono text-xs font-semibold transition-colors duration-300 ${
        isIdle ? 'text-cyber-gray-light' : 'text-cyber-red'
      }`}>
        {display} cm
      </span>
    </div>
  )
}

// ── Sensor 3: Power Grid — binary flip with pulse glow when critical ───────
function PowerGridSensor({ isIdle }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-cyber-border">
      <span className="font-sans text-[10px] text-cyber-gray uppercase tracking-wider">Power Grid</span>
      <span className={`font-sans text-xs font-semibold transition-colors duration-200 ${
        isIdle ? 'text-cyber-green' : 'text-cyber-red glow-red'
      }`}>
        {isIdle ? 'NOMINAL' : 'CRITICAL FAILURE'}
      </span>
    </div>
  )
}

// ── Sensor 4: Structural — binary flip ───────────────────────────────────
function StructuralSensor({ isIdle }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="font-sans text-[10px] text-cyber-gray uppercase tracking-wider">Structural</span>
      <span className={`font-sans text-xs font-semibold transition-colors duration-200 ${
        isIdle ? 'text-cyber-green' : 'text-cyber-red'
      }`}>
        {isIdle ? 'STABLE' : 'COMPROMISED'}
      </span>
    </div>
  )
}

export default function ChaosInjector({ chaosState, onInjectChaos, error }) {
  const isIdle = chaosState === 'idle'
  const isActive = chaosState === 'active'
  const isResolving = chaosState === 'resolving'

  const [btnHovered, setBtnHovered] = useState(false)

  return (
    <div className="panel">
      {/* Panel header */}
      <div className="panel-header">
        <div className="w-1.5 h-1.5 rounded-full bg-cyber-red/60" />
        <span>Chaos Injection Module</span>
        <div className="flex-1" />
        <span className="text-[10px] text-cyber-gray">
          TARGET: BENGALURU-DC-01
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Pre-crisis sensors */}
        <div>
          <div className="font-sans text-[9px] text-[#a1a1aa] uppercase tracking-widest mb-2 font-semibold">
            Live Environmental Sensors — Bengaluru
          </div>
          <div className="border border-[#27272a] rounded-lg p-3 space-y-0 bg-[#09090b]/40">
            <RainfallSensor    isIdle={isIdle} />
            <FloodDepthSensor  isIdle={isIdle} />
            <PowerGridSensor   isIdle={isIdle} />
            <StructuralSensor  isIdle={isIdle} />
          </div>
        </div>

        {/* Scenario info */}
        <div className="border border-cyber-red/20 bg-cyber-red/5 rounded-lg p-4">
          <div className="font-sans text-[9px] text-cyber-red/80 uppercase tracking-widest mb-1.5 font-semibold">Scenario: BENGALURU-FLOOD-CAT4</div>
          <div className="font-sans text-xs text-[#d4d4d8] leading-relaxed">
            Simulates a Category 4 monsoon flood disabling the Bengaluru Distribution Center.
            <span className="text-cyber-red font-semibold"> 5,000 units</span> of{' '}
            <span className="text-white font-semibold font-sans">UltraBook Pro 15"</span> stranded.
            Est. downtime: <span className="text-cyber-yellow font-semibold">14–21 days</span>.
          </div>
        </div>

        {/* ── INJECT CHAOS BUTTON ──────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {isIdle ? (
            <motion.button
              key="inject"
              id="chaos-inject-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onInjectChaos}
              className="w-full bg-cyber-red hover:bg-cyber-red-dim text-white font-sans font-bold tracking-wider py-4 px-4 rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(244,63,94,0.3)] flex flex-col items-center justify-center gap-1 cursor-pointer border-0"
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-lg">⚡</span>
                <span>INJECT CHAOS</span>
              </div>
              <div className="text-[10px] font-normal tracking-widest mt-0.5 opacity-80 uppercase">
                BENGALURU FLOOD SCENARIO
              </div>
            </motion.button>
          ) : (
            <motion.div
              key="status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`w-full border px-4 py-3 font-sans text-sm text-center rounded-lg ${
                isResolving
                  ? 'border-cyber-yellow/40 bg-cyber-yellow/5 text-cyber-yellow'
                  : 'border-cyber-red/40 bg-cyber-red/10 text-cyber-red'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${isResolving ? 'bg-cyber-yellow' : 'bg-cyber-red'}`} />
                {isResolving
                  ? 'AGENT INTERVENTION IN PROGRESS...'
                  : 'CHAOS ACTIVE — NODE FAILURE CONFIRMED'
                }
              </div>
              {isResolving && (
                <div className="text-[10px] text-cyber-yellow/60 mt-1 tracking-widest">
                  Demand Shaper analyzing substitution vectors...
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error state */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="font-sans text-[11px] text-cyber-red border border-cyber-red/30 bg-cyber-red/5 p-3 rounded-lg"
            >
              ⚠ AGENT ERROR: {error}
              <div className="text-[10px] text-cyber-gray mt-1">Check that backend is running on port 5000.</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
