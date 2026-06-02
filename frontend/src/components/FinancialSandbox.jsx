import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChaos } from '../context/ChaosContext'
import {
  DollarSign, TrendingDown, TrendingUp, Sliders, RefreshCw,
  ShieldCheck, AlertCircle, Percent, Package, Clock
} from 'lucide-react'

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

function Ticker({ value, prefix = '', suffix = '', negative = false }) {
  const [displayed, setDisplayed] = useState(value)
  const [flash, setFlash]         = useState(false)
  const prevRef = useRef(value)

  useEffect(() => {
    if (Math.abs(prevRef.current - value) < 1) return
    setFlash(true)
    const steps = 20
    const diff  = value - prevRef.current
    let step    = 0
    const timer = setInterval(() => {
      step++
      setDisplayed(Math.round(prevRef.current + diff * (step / steps)))
      if (step >= steps) {
        clearInterval(timer)
        setFlash(false)
        prevRef.current = value
      }
    }, 30)
    return () => clearInterval(timer)
  }, [value])

  return (
    <motion.span
      animate={flash ? { color: negative ? '#EF4444' : '#10B981' } : {}}
      transition={{ duration: 0.3 }}
      className="font-mono font-black text-sm tabular-nums"
    >
      {prefix}{typeof displayed === 'number' && suffix === '' ? fmt(displayed) : `${displayed}${suffix}`}
    </motion.span>
  )
}

function SliderRow({ label, icon: Icon, value, min, max, step = 1, suffix = '', color = '#2563eb', onChange }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-sans text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
          <Icon className="w-3 h-3" style={{ color }} />
          {label}
        </div>
        <span className="font-mono text-[11px] font-bold text-slate-700">{value}{suffix}</span>
      </div>
      <div className="relative h-2 bg-slate-100 rounded-full">
        <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-200"
          style={{ width: `${pct}%`, background: color, opacity: 0.7 }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow-md transition-all duration-200"
          style={{ left: `calc(${pct}% - 7px)`, background: color }}
        />
      </div>
    </div>
  )
}

export default function FinancialSandbox() {
  const {
    chaosState, projectedLoss, campaign,
    productMargin,   setProductMargin,
    penaltyRate,     setPenaltyRate,
    insurancePct,    setInsurancePct,
    emergencyBudget, setEmergencyBudget,
    cascadeNodes,
  } = useChaos()

  const isCrisis = chaosState !== 'idle'
  const isResolved = chaosState === 'resolved'

  // ── Compute live financials ─────────────────────────────────────────
  const baseLoss          = isCrisis ? projectedLoss : 0
  const cascadePenalty    = cascadeNodes.length * 450000
  const totalExposure     = baseLoss + cascadePenalty
  const insuranceCover    = totalExposure * (insurancePct / 100)
  const netExposure       = Math.max(0, totalExposure - insuranceCover - emergencyBudget)
  const marginImpact      = isCrisis ? (productMargin / 100) * totalExposure * 0.35 : 0
  const penaltyTotal      = isCrisis ? penaltyRate * 1000 * 24 : 0   // per-day penalty
  const recoveredBase     = campaign?.recoveredRevenue ?? 0
  const totalRecovered    = isResolved
    ? Math.min(recoveredBase + insuranceCover + (emergencyBudget * 0.6), totalExposure * 0.92)
    : 0
  const finalNetLoss      = Math.max(0, totalExposure - totalRecovered)

  // ── Live ticker effect: animate loss upward during crisis ───────────
  const [liveLoss, setLiveLoss] = useState(0)
  const lossRef = useRef(null)
  useEffect(() => {
    if (!isCrisis || isResolved) { setLiveLoss(0); return }
    let current = 0
    const target = netExposure
    const duration = 8000
    const steps = 80
    const increment = target / steps
    const interval = duration / steps
    lossRef.current = setInterval(() => {
      current = Math.min(current + increment + Math.random() * increment * 0.2, target)
      setLiveLoss(Math.round(current))
      if (current >= target) clearInterval(lossRef.current)
    }, interval)
    return () => clearInterval(lossRef.current)
  }, [isCrisis, isResolved, netExposure])

  return (
    <div className="panel overflow-hidden">
      {/* Header */}
      <div className="panel-header border-b border-border-subtle">
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          <span>Financial Sandbox</span>
        </div>
        <div className="flex-1" />
        <span className="font-mono text-[9px] font-bold text-slate-400">LIVE COST ENGINE v2.0</span>
      </div>

      <div className="p-4 space-y-4">

        {/* ── Live loss ticker ─────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2">
          {/* Gross Exposure */}
          <div className="p-3 border border-red-200 bg-red-50/40 rounded-xl text-center space-y-1">
            <div className="flex items-center justify-center gap-1">
              <TrendingDown className="w-3 h-3 text-red-500" />
              <div className="font-sans text-[8px] text-red-500 uppercase tracking-widest font-bold">Gross Exposure</div>
            </div>
            <div className="text-red-700 font-mono font-black text-sm">
              {isCrisis ? fmt(totalExposure) : '—'}
            </div>
          </div>

          {/* Live Bleeding */}
          <div className="p-3 border rounded-xl text-center space-y-1 relative overflow-hidden"
            style={{
              borderColor: isCrisis ? 'rgba(239,68,68,0.4)' : '#e2e8f0',
              background: isCrisis ? 'rgba(239,68,68,0.04)' : 'rgba(248,250,252,0.4)'
            }}>
            {isCrisis && !isResolved && (
              <div className="absolute inset-0 rounded-xl animate-pulse opacity-20"
                style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.2) 0%, transparent 70%)' }} />
            )}
            <div className="flex items-center justify-center gap-1">
              <AlertCircle className="w-3 h-3 text-red-500" />
              <div className="font-sans text-[8px] text-red-500 uppercase tracking-widest font-bold">Net At-Risk</div>
            </div>
            <Ticker value={isCrisis && !isResolved ? liveLoss : (isResolved ? finalNetLoss : 0)} negative />
          </div>

          {/* Recovered */}
          <div className="p-3 border border-emerald-200 bg-emerald-50/40 rounded-xl text-center space-y-1">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <div className="font-sans text-[8px] text-emerald-600 uppercase tracking-widest font-bold">Recovered</div>
            </div>
            <div className="text-emerald-700 font-mono font-black text-sm">
              {isResolved ? fmt(totalRecovered) : '—'}
            </div>
          </div>
        </div>

        {/* ── Cost breakdown rows ──────────────────────────────────────── */}
        {isCrisis && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-[10px] font-sans space-y-1.5 p-3 border border-slate-200 rounded-xl bg-slate-50/40"
          >
            <div className="font-bold text-slate-400 uppercase tracking-widest text-[9px] mb-2">Cost Breakdown</div>
            <div className="flex justify-between text-slate-500">
              <span>Base crisis loss</span>
              <span className="font-mono text-red-600 font-semibold">{fmt(baseLoss)}</span>
            </div>
            {cascadeNodes.length > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Cascade penalties ({cascadeNodes.length} nodes)</span>
                <span className="font-mono text-red-500 font-semibold">{fmt(cascadePenalty)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>Contractual penalty (24h)</span>
              <span className="font-mono text-amber-600 font-semibold">{fmt(penaltyTotal)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Margin erosion ({productMargin}%)</span>
              <span className="font-mono text-amber-600 font-semibold">{fmt(marginImpact)}</span>
            </div>
            <div className="h-px bg-slate-200 my-1" />
            <div className="flex justify-between text-slate-500">
              <span>Insurance cover ({insurancePct}%)</span>
              <span className="font-mono text-emerald-600 font-semibold">-{fmt(insuranceCover)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Emergency budget</span>
              <span className="font-mono text-emerald-600 font-semibold">-{fmt(emergencyBudget)}</span>
            </div>
            <div className="h-px bg-slate-200 my-1" />
            <div className="flex justify-between font-bold text-slate-700">
              <span>Net exposure</span>
              <span className="font-mono text-red-600">{fmt(netExposure)}</span>
            </div>
          </motion.div>
        )}

        {/* ── Sandbox Levers ───────────────────────────────────────────── */}
        <div className="space-y-3 p-3 border border-slate-200 rounded-xl bg-slate-50/30">
          <div className="font-sans text-[9px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5 mb-1">
            <Sliders className="w-3 h-3" /> Sandbox Levers
          </div>

          <SliderRow
            label="Product Margin"
            icon={Percent}
            value={productMargin}
            min={5} max={60}
            suffix="%"
            color="#2563eb"
            onChange={setProductMargin}
          />
          <SliderRow
            label="Penalty Rate ($/hr × 1k)"
            icon={Clock}
            value={penaltyRate}
            min={1} max={50}
            suffix="k"
            color="#f59e0b"
            onChange={setPenaltyRate}
          />
          <SliderRow
            label="Insurance Coverage"
            icon={ShieldCheck}
            value={insurancePct}
            min={0} max={100}
            suffix="%"
            color="#10b981"
            onChange={setInsurancePct}
          />
          <SliderRow
            label="Emergency Budget ($k)"
            icon={Package}
            value={Math.round(emergencyBudget / 1000)}
            min={0} max={2000}
            step={50}
            suffix="k"
            color="#7c3aed"
            onChange={(v) => setEmergencyBudget(v * 1000)}
          />
        </div>

        {/* ── Cascade multiplier notice ────────────────────────────────── */}
        {cascadeNodes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-[10px] border border-amber-200 bg-amber-50/40 rounded-lg p-2.5 text-amber-700 font-sans"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>
              <strong>{cascadeNodes.length} cascade node(s)</strong> detected — adding{' '}
              <strong>{fmt(cascadePenalty)}</strong> in secondary penalties.
            </span>
          </motion.div>
        )}
      </div>
    </div>
  )
}
