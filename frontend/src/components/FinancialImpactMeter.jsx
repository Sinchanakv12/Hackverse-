import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

function formatCurrency(value) {
  const isNegative = value < 0
  const abs = Math.abs(value)
  let result = ''
  if (abs >= 1_000_000) {
    result = `$${(abs / 1_000_000).toFixed(2)}M`
  } else if (abs >= 1_000) {
    result = `$${(abs / 1_000).toFixed(1)}K`
  } else {
    result = `$${Math.round(abs).toLocaleString()}`
  }
  return isNegative ? `-${result}` : result
}

// Animated counter that counts between two values
function AnimatedCounter({ value, duration = 2.5, className }) {
  const motionValue = useMotionValue(0)
  const [display, setDisplay] = useState('$0')
  const prevValue = useRef(0)

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: Math.abs(value) > Math.abs(prevValue.current) ? [0.16, 1, 0.3, 1] : 'easeOut',
      onUpdate: (v) => setDisplay(formatCurrency(v)),
    })
    prevValue.current = value
    return controls.stop
  }, [value, duration])

  return <span className={className}>{display}</span>
}

export default function FinancialImpactMeter({ chaosState, projectedLoss, recoveredRevenue, campaign }) {
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
    ? 'text-text-secondary'
    : isRecovering
    ? 'text-status-safe'
    : 'text-status-danger'

  return (
    <div className="panel overflow-hidden" style={{ background: 'radial-gradient(circle at 50% 30%, #F8FAFC 0%, #FFFFFF 100%)' }}>
      {/* Panel header */}
      <div className="panel-header border-b border-border-subtle">
        <div className={`w-1.5 h-1.5 rounded-full ${isIdle ? 'bg-text-secondary' : isRecovering ? 'bg-status-safe' : 'bg-status-danger animate-pulse'}`} />
        <span>Financial Impact Meter</span>
        <div className="flex-1" />
        {!isIdle && (
          <span className={`text-[10px] font-sans font-bold tracking-wider ${isRecovering ? 'text-status-safe' : 'text-status-danger'}`}>
            {isRecovering ? '▼ RECOVERING' : '▲ ESCALATING'}
          </span>
        )}
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

          {/* ── Main Loss Counter ─────────────────────────────────────── */}
          <div className="md:col-span-2">
            <div className="text-[9px] font-sans text-text-secondary font-semibold tracking-widest mb-3 uppercase">
              {isResolved ? 'Net Projected Loss (Post-Intervention)' : 'Projected Revenue Loss'}
            </div>

            <div className="relative">
              <AnimatedCounter
                value={finalDisplay}
                duration={isResolved ? 3.5 : 2.8}
                className={`font-sans font-black text-5xl md:text-6xl leading-none tracking-tight transition-colors duration-700 ${meterColor}`}
              />

              {/* Idle state label */}
              {isIdle && (
                <div className="font-sans text-xs text-text-secondary/60 mt-2 tracking-wider">
                  — MONITORING — No active disruptions
                </div>
              )}
            </div>

            {/* Recovery breakdown */}
            {isResolved && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-4 font-sans text-[11px]"
              >
                <span className="text-status-danger/80 font-medium">
                  Loss: <span className="font-mono">{formatCurrency(projectedLoss)}</span>
                </span>
                <span className="text-border-subtle">—</span>
                <span className="text-status-safe font-medium">
                  Recovered: <span className="font-mono">+{formatCurrency(recoveredRevenue)}</span>
                </span>
              </motion.div>
            )}

            {/* Swarm Financial Breakdown */}
            {isResolved && campaign?.financialBreakdown && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                className="mt-5 pt-4 border-t border-border-subtle/50"
              >
                <div className="text-[10px] font-sans text-text-secondary font-bold tracking-wider mb-3 uppercase">
                  Swarm Financial Optimization Breakdown
                </div>
                <div className="grid grid-cols-3 gap-3 bg-slate-50 border border-slate-200 rounded-md p-3">
                  <div className="text-center">
                    <div className="font-mono text-sm font-bold text-status-safe">
                      +<AnimatedCounter value={campaign.financialBreakdown.avoidedPenalties} duration={2.5} />
                    </div>
                    <div className="font-sans text-[9px] text-text-secondary font-semibold mt-1 uppercase tracking-wider">
                      SLA Penalties Avoided
                    </div>
                  </div>
                  <div className="text-center border-l border-r border-slate-200 px-2">
                    <div className="font-mono text-sm font-bold text-status-safe">
                      +<AnimatedCounter value={campaign.financialBreakdown.salvagedCOGS} duration={2.5} />
                    </div>
                    <div className="font-sans text-[9px] text-text-secondary font-semibold mt-1 uppercase tracking-wider">
                      Inventory Value Salvaged
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono text-sm font-bold text-status-danger">
                      <AnimatedCounter value={campaign.financialBreakdown.newFreightCosts} duration={2.5} />
                    </div>
                    <div className="font-sans text-[9px] text-text-secondary font-semibold mt-1 uppercase tracking-wider">
                      Expedited Freight Cost
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Recovery Progress ─────────────────────────────────────── */}
          <div>
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="border border-border-subtle bg-slate-50 rounded-lg p-2.5 text-center">
                <div className="font-sans text-[9px] text-text-secondary uppercase tracking-wider mb-1 font-semibold">Units at Risk</div>
                <div className={`font-mono text-sm font-bold ${isIdle ? 'text-text-secondary' : 'text-status-danger'}`}>
                  {isIdle ? '—' : '5,000'}
                </div>
              </div>
              <div className="border border-border-subtle bg-slate-50 rounded-lg p-2.5 text-center">
                <div className="font-sans text-[9px] text-text-secondary uppercase tracking-wider mb-1 font-semibold">Recovery</div>
                <div className={`font-mono text-sm font-bold ${recoveryPct > 0 ? 'text-status-safe' : 'text-text-secondary'}`}>
                  {recoveryPct > 0 ? `${recoveryPct.toFixed(0)}%` : '—'}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-border-subtle">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${recoveryPct}%` }}
                transition={{ duration: 3, ease: 'easeOut', delay: 0.5 }}
                className="h-full bg-status-safe rounded-full"
              />
            </div>
            {recoveryPct > 0 && (
              <div className="font-sans text-[10px] text-status-safe/80 mt-1.5 text-right font-medium">
                <span className="font-mono">{formatCurrency(recoveredRevenue)}</span> recovered
              </div>
            )}
          </div>
        </div>

        {/* ── Severity indicators ───────────────────────────────────── */}
        {!isIdle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-5 pt-4 border-t border-border-subtle/60 grid grid-cols-3 gap-3"
          >
            {[
              { label: 'Disrupted SKUs', value: '1', color: 'text-status-danger' },
              { label: 'ETA Recovery', value: '14–21 days', color: 'text-status-warning' },
              { label: 'Affected Clients', value: '~240 B2B', color: 'text-text-primary' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className={`font-mono text-sm font-bold ${item.color}`}>{item.value}</div>
                <div className="font-sans text-[9px] text-text-secondary font-semibold tracking-wider mt-0.5 uppercase">{item.label}</div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
