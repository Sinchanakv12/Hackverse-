import { motion } from 'framer-motion'

export default function PredictionAccuracy({ accuracyScore, accuracyReasoning, chaosState }) {
  const isIdle = chaosState === 'idle'
  const displayScore = isIdle ? 0 : (accuracyScore ?? 100)
  const displayReasoning = isIdle ? "Telemetry link standby. Waiting for chaos injection event..." : (accuracyReasoning || "Optimal asset-to-constraint alignment. Minimum risk profile.")

  // Color logic
  let textColorClass = 'text-status-safe'
  let barColorClass = 'bg-status-safe'
  let pulseClass = ''

  if (displayScore >= 85) {
    textColorClass = 'text-status-safe'
    barColorClass = 'bg-status-safe shadow-[0_0_10px_rgba(16,185,129,0.3)]'
  } else if (displayScore >= 60) {
    textColorClass = 'text-status-warning'
    barColorClass = 'bg-status-warning shadow-[0_0_10px_rgba(245,158,11,0.3)]'
  } else {
    textColorClass = 'text-status-danger'
    barColorClass = 'bg-status-danger shadow-[0_0_10px_rgba(239,68,68,0.3)]'
    pulseClass = 'animate-[pulse_2s_infinite]'
  }

  return (
    <div className="panel overflow-hidden" style={{ background: 'radial-gradient(circle at 50% 30%, #F8FAFC 0%, #FFFFFF 100%)' }}>
      {/* Panel header */}
      <div className="panel-header border-b border-border-subtle">
        <div className={`w-1.5 h-1.5 rounded-full ${isIdle ? 'bg-secondary' : displayScore >= 85 ? 'bg-status-safe' : displayScore >= 60 ? 'bg-status-warning' : 'bg-status-danger animate-pulse'}`} />
        <span>Rerouting Confidence Engine</span>
        <div className="flex-1" />
        <span className="text-[10px] font-sans font-bold tracking-wider text-secondary">
          {isIdle ? 'STANDBY' : 'ANALYSIS COMPLETE'}
        </span>
      </div>

      <div className="p-6 flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <div className="text-[9px] font-sans text-secondary font-semibold tracking-widest uppercase">
            Simulation Confidence Score
          </div>
          <div className="font-mono text-xs text-secondary/60">
            {isIdle ? 'AWAITING TELEMETRY' : 'REAL-TIME EVAL'}
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Main Percentage Display */}
          <div className="shrink-0">
            <div className={`font-sans font-black text-5xl tracking-tighter ${textColorClass} ${pulseClass}`}>
              {displayScore}%
            </div>
          </div>

          {/* Progress bar container */}
          <div className="flex-1">
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-subtle/60 p-[2px]">
              <motion.div
                className={`h-full rounded-full ${barColorClass}`}
                initial={{ width: 0 }}
                animate={{ width: `${displayScore}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Reasoning Text */}
        <div className="border-t border-subtle/40 pt-3">
          <div className="text-[9px] font-sans text-secondary/60 uppercase tracking-wider mb-1">
            Confidence Reasoning
          </div>
          <div className="font-mono text-[10px] text-secondary leading-relaxed break-words">
            {displayReasoning}
          </div>
        </div>
      </div>
    </div>
  )
}
