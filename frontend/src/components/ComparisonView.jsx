import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChaos } from '../context/ChaosContext'
import {
  GitCompare, X, TrendingUp, TrendingDown, Clock, Shield,
  Route, Bot, Zap, CheckCircle, AlertCircle, BarChart2, Database
} from 'lucide-react'

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

function DeltaBadge({ a, b, higherIsBetter = true, suffix = '' }) {
  if (a == null || b == null) return <span className="text-slate-400 text-[9px]">—</span>
  const delta = b - a
  const pct   = a !== 0 ? ((delta / Math.abs(a)) * 100).toFixed(1) : '∞'
  const positive = higherIsBetter ? delta > 0 : delta < 0
  return (
    <span className={`text-[9px] font-bold font-sans px-1.5 py-0.5 rounded-full ${
      delta === 0 ? 'bg-slate-100 text-slate-500'
      : positive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
    }`}>
      {delta > 0 ? '▲' : delta < 0 ? '▼' : '='} {Math.abs(pct)}%
    </span>
  )
}

function CompareBar({ labelA, labelB, valueA, valueB, color = '#2563eb', suffix = '', higherIsBetter = false }) {
  const maxVal = Math.max(valueA || 0, valueB || 0, 1)
  const wA = ((valueA || 0) / maxVal) * 100
  const wB = ((valueB || 0) / maxVal) * 100

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[9px]">
        <span className="font-sans text-slate-500 font-semibold uppercase tracking-wider">{labelA}</span>
        <DeltaBadge a={valueA} b={valueB} higherIsBetter={higherIsBetter} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {/* Run A bar */}
        <div className="space-y-1">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${wA}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: '#2563eb' }}
            />
          </div>
          <div className="font-mono text-[9px] text-slate-600 font-bold text-right">
            {suffix === '$' ? fmt(valueA || 0) : `${valueA || 0}${suffix}`}
          </div>
        </div>
        {/* Run B bar */}
        <div className="space-y-1">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${wB}%` }}
              transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: '#7c3aed' }}
            />
          </div>
          <div className="font-mono text-[9px] text-slate-600 font-bold text-right">
            {suffix === '$' ? fmt(valueB || 0) : `${valueB || 0}${suffix}`}
          </div>
        </div>
      </div>
    </div>
  )
}

function RunCard({ run, label, color, onSelect, isSelected }) {
  if (!run) {
    return (
      <button
        onClick={onSelect}
        className="flex-1 border-2 border-dashed border-slate-200 rounded-xl p-3 text-center text-slate-400 hover:border-slate-300 hover:bg-slate-50/50 transition-all cursor-pointer bg-transparent"
      >
        <Database className="w-5 h-5 mx-auto mb-1.5 opacity-40" />
        <div className="font-sans text-[10px] font-semibold">Select Run {label}</div>
        <div className="font-sans text-[9px] opacity-60 mt-0.5">Pick from history</div>
      </button>
    )
  }

  return (
    <div
      className={`flex-1 border-2 rounded-xl p-3 cursor-pointer transition-all ${
        isSelected ? 'border-dashed border-slate-300' : ''
      }`}
      style={{ borderColor: color + '60', background: color + '08' }}
      onClick={onSelect}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
        <span className="font-sans text-[9px] font-black uppercase tracking-wider" style={{ color }}>Run {label}</span>
      </div>
      <div className="font-sans text-[10px] text-slate-600 font-semibold truncate">{run.vertical}</div>
      <div className="font-sans text-[9px] text-slate-400 mt-0.5 truncate">{run.configSummary}</div>
      <div className="font-mono text-[10px] font-black text-emerald-600 mt-1.5">
        {fmt(run.recoveredRevenue)}
      </div>
      <div className="font-sans text-[8px] text-slate-400">recovered revenue</div>
    </div>
  )
}

export default function ComparisonView({ isOpen, onClose }) {
  const {
    simulationHistory,
    compareRunA, setCompareRunA,
    compareRunB, setCompareRunB,
  } = useChaos()

  const [selectingFor, setSelectingFor] = useState(null) // 'A' | 'B' | null

  const handlePickRun = (item) => {
    if (selectingFor === 'A') setCompareRunA(item)
    else if (selectingFor === 'B') setCompareRunB(item)
    setSelectingFor(null)
  }

  const a = compareRunA?.fullData
  const b = compareRunB?.fullData

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-[480px] bg-white border-l border-slate-200 z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                <GitCompare className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-sans font-black text-sm text-slate-800 tracking-wider">A/B RUN COMPARISON</div>
                <div className="font-sans text-[10px] text-slate-400 font-semibold">Side-by-side simulation analysis</div>
              </div>
              <button onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 border-0 bg-transparent cursor-pointer transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">

              {/* Run Selector */}
              <div className="p-5 border-b border-slate-100">
                <div className="font-sans text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-3">
                  Select Runs to Compare
                </div>
                <div className="flex gap-3">
                  <RunCard
                    run={compareRunA}
                    label="A"
                    color="#2563eb"
                    onSelect={() => setSelectingFor(selectingFor === 'A' ? null : 'A')}
                    isSelected={selectingFor === 'A'}
                  />
                  <div className="flex items-center font-sans text-[10px] text-slate-400 font-bold">VS</div>
                  <RunCard
                    run={compareRunB}
                    label="B"
                    color="#7c3aed"
                    onSelect={() => setSelectingFor(selectingFor === 'B' ? null : 'B')}
                    isSelected={selectingFor === 'B'}
                  />
                </div>
              </div>

              {/* History picker (shown when selecting) */}
              <AnimatePresence>
                {selectingFor && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-b border-slate-100"
                  >
                    <div className="p-4 space-y-2">
                      <div className="font-sans text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                        Pick a run for Slot {selectingFor}
                      </div>
                      {simulationHistory.length === 0 ? (
                        <div className="text-center py-4 text-slate-400 text-xs">
                          No simulation history yet. Run a simulation first.
                        </div>
                      ) : (
                        simulationHistory.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => handlePickRun(item)}
                            className="w-full text-left border border-slate-200 rounded-lg p-3 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-3 cursor-pointer bg-white"
                          >
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-500">
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-sans text-[10px] font-bold text-slate-700 truncate">{item.vertical}</div>
                              <div className="font-sans text-[9px] text-slate-400 truncate">{item.configSummary}</div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="font-mono text-[10px] font-black text-emerald-600">{fmt(item.recoveredRevenue)}</div>
                              <div className="font-sans text-[8px] text-slate-400">{item.timestamp}</div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Comparison Charts */}
              {a && b ? (
                <div className="p-5 space-y-5">
                  {/* Legend */}
                  <div className="flex items-center gap-4 text-[9px] font-sans font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      <span className="text-slate-500">Run A — {compareRunA.vertical}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />
                      <span className="text-slate-500">Run B — {compareRunB.vertical}</span>
                    </div>
                  </div>

                  {/* Financial comparison */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 font-sans text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                      <BarChart2 className="w-3 h-3 text-blue-600" />
                      Financial Performance
                    </div>
                    <CompareBar labelA="Recovered Revenue" valueA={a.recoveredRevenue} valueB={b.recoveredRevenue} suffix="$" higherIsBetter={true} />
                    <CompareBar labelA="Total Loss Exposure" valueA={a.totalLoss} valueB={b.totalLoss} suffix="$" higherIsBetter={false} />
                    <CompareBar labelA="Net Loss After Recovery" valueA={a.netLoss} valueB={b.netLoss} suffix="$" higherIsBetter={false} />
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Routing */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 font-sans text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                      <Route className="w-3 h-3 text-violet-600" />
                      Route Performance
                    </div>
                    <CompareBar labelA="Standard Route (hrs)" valueA={a.routeStandard} valueB={b.routeStandard} suffix=" hrs" higherIsBetter={false} />
                    <CompareBar labelA="Bypass Route (hrs)" valueA={a.routeBypass} valueB={b.routeBypass} suffix=" hrs" higherIsBetter={false} />
                    <CompareBar labelA="AI Accuracy Score" valueA={a.accuracyScore} valueB={b.accuracyScore} suffix="%" higherIsBetter={true} />
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Config comparison */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 font-sans text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                      <Shield className="w-3 h-3 text-emerald-600" />
                      Configuration Flags
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[10px]">
                      {[
                        { label: 'Telemetry Active',   kA: a.telemetryActive,   kB: b.telemetryActive   },
                        { label: 'Auto-Pilot Used',    kA: a.autoPilotUsed,     kB: b.autoPilotUsed     },
                        { label: 'Cascade Events',     kA: a.cascadeCount + ' nodes', kB: b.cascadeCount + ' nodes' },
                        { label: 'Product Margin',     kA: a.productMargin + '%', kB: b.productMargin + '%' },
                      ].map(row => (
                        <div key={row.label} className="border border-slate-100 rounded-lg p-2.5 bg-slate-50/40">
                          <div className="font-sans text-[8px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">{row.label}</div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              <span className="font-mono text-[9px] text-slate-600">
                                {typeof row.kA === 'boolean' ? (row.kA ? '✅ Yes' : '❌ No') : row.kA ?? '—'}
                              </span>
                            </span>
                            <span className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                              <span className="font-mono text-[9px] text-slate-600">
                                {typeof row.kB === 'boolean' ? (row.kB ? '✅ Yes' : '❌ No') : row.kB ?? '—'}
                              </span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Winner verdict */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-gradient-to-br from-slate-50 to-white">
                    <div className="font-sans text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-2">AI VERDICT</div>
                    {(() => {
                      const aScore = (a.recoveredRevenue / Math.max(a.totalLoss, 1)) * 50 + a.accuracyScore * 0.5
                      const bScore = (b.recoveredRevenue / Math.max(b.totalLoss, 1)) * 50 + b.accuracyScore * 0.5
                      const winner = aScore > bScore ? 'A' : bScore > aScore ? 'B' : null
                      const diff   = Math.abs(a.recoveredRevenue - b.recoveredRevenue)
                      return (
                        <div className="flex items-start gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            winner === 'A' ? 'bg-blue-100' : winner === 'B' ? 'bg-violet-100' : 'bg-slate-100'
                          }`}>
                            <CheckCircle className={`w-4 h-4 ${
                              winner === 'A' ? 'text-blue-600' : winner === 'B' ? 'text-violet-600' : 'text-slate-400'
                            }`} />
                          </div>
                          <div className="font-sans text-xs text-slate-600 leading-relaxed">
                            {winner
                              ? <>Run <strong style={{ color: winner === 'A' ? '#2563eb' : '#7c3aed' }}>{winner}</strong> outperformed
                                by recovering an additional <strong className="text-emerald-600">{fmt(diff)}</strong>
                                {a.autoPilotUsed !== b.autoPilotUsed
                                  ? ` — Auto-Pilot ${winner === 'A' && a.autoPilotUsed || winner === 'B' && b.autoPilotUsed ? 'engagement' : 'absence'} was a key differentiator.`
                                  : a.telemetryActive !== b.telemetryActive
                                  ? ` — GPS telemetry status was the critical differentiating factor.`
                                  : ` — Vehicle and configuration choices drove the outcome gap.`
                                }
                              </>
                              : 'Both runs performed equivalently. Try adjusting sandbox levers to differentiate outcomes.'
                            }
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 px-6 text-center">
                  <GitCompare className="w-10 h-10 mb-3 opacity-20" />
                  <div className="font-sans text-sm font-bold text-slate-500 mb-1">Select Two Runs to Compare</div>
                  <div className="font-sans text-xs text-slate-400 leading-relaxed">
                    Complete at least 2 simulations, then pick them above to see a side-by-side performance breakdown.
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
