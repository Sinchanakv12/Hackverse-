import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

function formatCurrency(value) {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`
  }
  return `$${Math.round(value).toLocaleString()}`
}

// Animated counter that counts between two values
function AnimatedCounter({ value, duration = 2.5, className }) {
  const motionValue = useMotionValue(0)
  const [display, setDisplay] = useState('$0.00M')
  const prevValue = useRef(0)

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: value > prevValue.current ? [0.16, 1, 0.3, 1] : 'easeOut',
      onUpdate: (v) => setDisplay(formatCurrency(v)),
    })
    prevValue.current = value
    return controls.stop
  }, [value, duration])

  return <span className={className}>{display}</span>
}

export default function FinancialImpactMeter({ chaosState, projectedLoss, recoveredRevenue }) {
  // Determine what value the counter should display
  const isIdle = chaosState === 'idle'
  const isResolved = chaosState === 'resolved'

  const displayedLoss = isIdle ? 0 : projectedLoss
  const netLoss = Math.max(0, projectedLoss - recoveredRevenue)
  const finalDisplay = isResolved ? netLoss : displayedLoss

  // Recovery percentage
  const recoveryPct = recoveredRevenue > 0 ? Math.min(100, (recoveredRevenue / projectedLoss) * 100) : 0

  // Color logic
  const isRecovering = isResolved && recoveredRevenue > 0
  const meterColor = isIdle
    ? 'text-cyber-gray'
    : isRecovering
    ? 'text-cyber-green glow-green'
    : 'text-cyber-red glow-red'

  return (
    <div className="panel">
      {/* Panel header */}
      <div className="panel-header">
        <div className={`w-1.5 h-1.5 rounded-full ${isIdle ? 'bg-cyber-gray' : isRecovering ? 'bg-cyber-green' : 'bg-cyber-red animate-pulse'}`} />
        <span>Financial Impact Meter</span>
        <div className="flex-1" />
        {!isIdle && (
          <span className={`text-[10px] ${isRecovering ? 'text-cyber-green' : 'text-cyber-red'}`}>
            {isRecovering ? '▼ RECOVERING' : '▲ ESCALATING'}
          </span>
        )}
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

          {/* ── Main Loss Counter ─────────────────────────────────────── */}
          <div className="md:col-span-2">
            <div className="text-[10px] font-mono text-cyber-gray tracking-widest mb-2 uppercase">
              {isResolved ? 'Net Projected Loss (Post-Intervention)' : 'Projected Revenue Loss'}
            </div>

            <div className="relative">
              <AnimatedCounter
                value={finalDisplay}
                duration={isResolved ? 3.5 : 2.8}
                className={`font-mono font-bold text-5xl md:text-6xl leading-none tracking-tight transition-colors duration-700 ${meterColor}`}
              />

              {/* Idle state label */}
              {isIdle && (
                <div className="font-mono text-xs text-cyber-gray/50 mt-2 tracking-wider">
                  — MONITORING — No active disruptions
                </div>
              )}
            </div>

            {/* Recovery breakdown */}
            {isResolved && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-4 font-mono text-[11px]"
              >
                <span className="text-cyber-red/80">
                  Loss: {formatCurrency(projectedLoss)}
                </span>
                <span className="text-cyber-gray/40">—</span>
                <span className="text-cyber-green">
                  Recovered: +{formatCurrency(recoveredRevenue)}
                </span>
              </motion.div>
            )}
          </div>

          {/* ── Recovery Progress ─────────────────────────────────────── */}
          <div>
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="panel p-2 text-center">
                <div className="font-mono text-[9px] text-cyber-gray/60 uppercase tracking-wider mb-1">Units at Risk</div>
                <div className={`font-mono text-sm font-bold ${isIdle ? 'text-cyber-gray' : 'text-cyber-red'}`}>
                  {isIdle ? '—' : '5,000'}
                </div>
              </div>
              <div className="panel p-2 text-center">
                <div className="font-mono text-[9px] text-cyber-gray/60 uppercase tracking-wider mb-1">Recovery</div>
                <div className={`font-mono text-sm font-bold ${recoveryPct > 0 ? 'text-cyber-green' : 'text-cyber-gray'}`}>
                  {recoveryPct > 0 ? `${recoveryPct.toFixed(0)}%` : '—'}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${recoveryPct}%` }}
                transition={{ duration: 3, ease: 'easeOut', delay: 0.5 }}
                className="h-full bg-cyber-green rounded-full"
                style={{ boxShadow: recoveryPct > 0 ? '0 0 8px rgba(57,255,20,0.6)' : 'none' }}
              />
            </div>
            {recoveryPct > 0 && (
              <div className="font-mono text-[10px] text-cyber-green/60 mt-1 text-right">
                {formatCurrency(recoveredRevenue)} recovered
              </div>
            )}
          </div>
        </div>

        {/* ── Severity indicators ───────────────────────────────────── */}
        {!isIdle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 pt-4 border-t border-[#1a1a2e] grid grid-cols-3 gap-3"
          >
            {[
              { label: 'Disrupted SKUs', value: '1', color: 'text-cyber-red' },
              { label: 'ETA Recovery', value: '14–21 days', color: 'text-cyber-yellow' },
              { label: 'Affected Clients', value: '~240 B2B', color: 'text-cyber-gray-light' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className={`font-mono text-sm font-bold ${item.color}`}>{item.value}</div>
                <div className="font-mono text-[9px] text-cyber-gray/60 tracking-wider">{item.label}</div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
