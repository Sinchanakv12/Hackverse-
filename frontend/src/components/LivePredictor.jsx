import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChaos } from '../context/ChaosContext'
import {
  Sparkles, Radio, ShieldCheck, Thermometer, Wind, Route,
  Lock, AlertTriangle, Shield, CheckCircle, Zap, Bot,
  Terminal, Power, Activity
} from 'lucide-react'
import { scenarios } from '../scenariosData'

export default function LivePredictor({ chaosState, simulationConfig, supplyChainData, campaign }) {
  const isCrisis = chaosState !== 'idle'

  const {
    autoPilotMode, setAutoPilotMode,
    autoPilotLog, autoPilotActive,
    activateAutoPilot,
  } = useChaos()

  // Load selected scenario metadata
  const activeScenario = useMemo(() => {
    return scenarios.find(s => s.id === simulationConfig?.scenario) || scenarios[0]
  }, [simulationConfig])

  // Local state for interactive pre-emptive countermeasures
  const [mitigations, setMitigations] = useState({
    preClearCustoms:    false,
    backupPowerGrid:    false,
    stabilizeCurrents:  false,
    preLoadColdChambers: false
  })

  const toggleMitigation = (key) => {
    setMitigations(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Calculate environmental threat dimensions (0 to 100)
  const threats = useMemo(() => {
    const isAirDisruption      = activeScenario.category === 'Air Transport'
    const isNaturalDisaster    = activeScenario.category === 'Natural Disasters'
    const isCyberTech          = activeScenario.category === 'Cyber/Technical'
    const isMechanicalSafety   = activeScenario.category === 'Mechanical/Safety'
    const isSupplyShock        = activeScenario.category === 'Supply Chain Shock'

    let metBase = 15
    if (isCrisis) {
      if (isAirDisruption) metBase = 90
      else if (isNaturalDisaster) metBase = 80
      else if (isMechanicalSafety) metBase = 45
    }
    if (mitigations.stabilizeCurrents) metBase = Math.max(10, metBase - 40)

    let routeBase = 12
    if (isCrisis) {
      routeBase = 75
      if (simulationConfig?.telemetryActive === false) routeBase += 15
    }
    if (mitigations.preClearCustoms) routeBase = Math.max(10, routeBase - 30)

    let cargoBase = 10
    const vertical = simulationConfig?.category || simulationConfig?.vertical || 'Electronics'
    const isPerishable = vertical === 'Food & Ag' || vertical === 'Healthcare'
    if (isCrisis) {
      cargoBase = 50
      if (isPerishable && simulationConfig?.vehicleType !== 'Reefer (Refrigerated)') cargoBase += 35
      if (isSupplyShock) cargoBase += 15
    }
    if (mitigations.preLoadColdChambers) cargoBase = Math.max(8, cargoBase - 45)

    let cyberBase = 8
    if (isCrisis) {
      if (isCyberTech) cyberBase = 92
      else if (isMechanicalSafety) cyberBase = 60
    }
    if (mitigations.backupPowerGrid) cyberBase = Math.max(5, cyberBase - 50)

    return {
      met:   Math.min(100, Math.max(0, metBase)),
      route: Math.min(100, Math.max(0, routeBase)),
      cargo: Math.min(100, Math.max(0, cargoBase)),
      cyber: Math.min(100, Math.max(0, cyberBase))
    }
  }, [isCrisis, activeScenario, simulationConfig, mitigations])

  const overallRisk = useMemo(() => {
    const sum = threats.met * 0.35 + threats.route * 0.25 + threats.cargo * 0.25 + threats.cyber * 0.15
    return Math.round(sum)
  }, [threats])

  const riskLabel = useMemo(() => {
    if (overallRisk >= 70) return { text: 'CRITICAL THREAT',         color: 'text-status-danger',  border: 'border-red-200 bg-red-50/20'     }
    if (overallRisk >= 35) return { text: 'ELEVATED RISK',           color: 'text-status-warning', border: 'border-amber-200 bg-amber-50/20'  }
    return                        { text: 'NOMINAL OPERATIONAL STATE',color: 'text-status-safe',   border: 'border-emerald-200 bg-emerald-50/10' }
  }, [overallRisk])

  // Auto-Pilot: fire when mode is enabled and risk breaches 85%
  useEffect(() => {
    if (autoPilotMode && isCrisis && overallRisk >= 85 && !autoPilotActive) {
      activateAutoPilot(overallRisk, mitigations, toggleMitigation)
    }
  }, [autoPilotMode, isCrisis, overallRisk, autoPilotActive])

  // Also keep mitigations in sync if auto-pilot programmatically toggles them
  const applyMitigation = (key) => {
    setMitigations(prev => ({ ...prev, [key]: true }))
  }

  // Expose applyMitigation for auto-pilot via effect sync
  useEffect(() => {
    if (autoPilotActive) {
      const timer = setTimeout(() => {
        setMitigations({ preClearCustoms: true, backupPowerGrid: true, stabilizeCurrents: true, preLoadColdChambers: true })
      }, 7500)
      return () => clearTimeout(timer)
    }
  }, [autoPilotActive])

  // Live warnings
  const predictiveAlerts = useMemo(() => {
    const list = []

    if (activeScenario.category === 'Air Transport') {
      if (!mitigations.stabilizeCurrents) {
        list.push({ id: 'warn-air', type: 'warning', text: `Jet stream shear predicted to exceed cargo flight thresholds at ${activeScenario.affectedNodeId.toUpperCase()}. Landing corridors at risk.`, suggestion: 'Enable Turbine Current Stabilization.' })
      } else {
        list.push({ id: 'warn-air', type: 'resolved', text: `Freighter safety margin locked. Altitude current shear resolved via active avionics override.` })
      }
    }

    if (activeScenario.category === 'Natural Disasters') {
      list.push({ id: 'warn-weather', type: 'warning', text: `Extreme meteorological condition (${activeScenario.weather?.condition || 'Monsoon'}) breaches facility drainage and wind limits.` })
    }

    const vertical = simulationConfig?.category || simulationConfig?.vertical || 'Electronics'
    const isPerishable = vertical === 'Food & Ag' || vertical === 'Healthcare'
    if (isPerishable && simulationConfig?.vehicleType !== 'Reefer (Refrigerated)' && isCrisis) {
      if (!mitigations.preLoadColdChambers) {
        list.push({ id: 'warn-temp', type: 'warning', text: `Perishable cargo loaded without active cold refrigeration. Spoilage probability: ${threats.cargo}%.`, suggestion: 'Pre-cool emergency cold storage chambers.' })
      } else {
        list.push({ id: 'warn-temp', type: 'resolved', text: `Secondary cold containment pre-cooled. Cargo thermal decay delayed by +120 hours.` })
      }
    }

    if (isCrisis) {
      if (!mitigations.preClearCustoms) {
        list.push({ id: 'warn-customs', type: 'warning', text: `Dijkstra path indicates delay accumulation at transit gateways. Outbound manifests audit bottleneck expected.`, suggestion: 'Pre-clear digital customs signatures.' })
      } else {
        list.push({ id: 'warn-customs', type: 'resolved', text: `Customs signatures pre-cleared. Manifest pre-approved for digital corridors.` })
      }
    }

    if (isCrisis && (activeScenario.category === 'Cyber/Technical' || activeScenario.category === 'Mechanical/Safety')) {
      if (!mitigations.backupPowerGrid) {
        list.push({ id: 'warn-power', type: 'warning', text: `SCADA sort loops suffer high electrical vulnerability. Blackout probability: 82%.`, suggestion: 'Activate emergency micro-grid power backup.' })
      } else {
        list.push({ id: 'warn-power', type: 'resolved', text: `Backup power grids synchronized. Sorter loops switched to dedicated battery cells.` })
      }
    }

    if (isCrisis && !simulationConfig?.telemetryActive) {
      list.push({ id: 'warn-telemetry', type: 'warning', text: `GPS tracking is deactivated. Logistics router is operating in blind mode.` })
    }

    if (list.length === 0) {
      list.push({ id: 'warn-nominal', type: 'nominal', text: 'All environmental metrics within acceptable limits. No threats projected.' })
    }

    return list
  }, [activeScenario, simulationConfig, mitigations, isCrisis, threats.cargo])

  return (
    <div className="panel overflow-hidden flex flex-col" style={{ background: 'radial-gradient(circle at 100% 100%, #FAFBFD 0%, #FFFFFF 80%)' }}>
      {/* Panel Header */}
      <div className="panel-header border-b border-border-subtle shrink-0">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-accent-blue" />
          <span>Predictive AI Risk Monitor</span>
        </div>
        <div className="flex-1" />

        {/* ── Auto-Pilot Toggle ── */}
        <button
          id="autopilot-toggle-btn"
          onClick={() => setAutoPilotMode(m => !m)}
          title={autoPilotMode ? 'Auto-Pilot ON — will auto-engage at risk ≥ 85%' : 'Enable Auto-Pilot'}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer font-sans ${
            autoPilotMode || autoPilotActive
              ? 'border-violet-400 bg-violet-50 text-violet-700'
              : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
          }`}
        >
          <Bot className={`w-3 h-3 ${(autoPilotMode || autoPilotActive) ? 'text-violet-600' : 'text-slate-400'}`} />
          {autoPilotActive ? 'AUTO-PILOT ACTIVE' : autoPilotMode ? 'AUTO-PILOT ON' : 'AUTO-PILOT'}
          {(autoPilotMode || autoPilotActive) && (
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse ml-0.5" />
          )}
        </button>

        <span className="font-mono text-[9px] font-bold text-slate-400 ml-2">v1.4</span>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">

        {/* ── Auto-Pilot Terminal Log (shown when active) ─────────────── */}
        <AnimatePresence>
          {autoPilotActive && autoPilotLog.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border border-violet-200 rounded-xl overflow-hidden"
              style={{ background: '#0e0e1a' }}
            >
              <div className="flex items-center gap-2 px-3 py-2 border-b border-violet-900/40">
                <Terminal className="w-3 h-3 text-violet-400" />
                <span className="font-mono text-[9px] font-bold text-violet-400 uppercase tracking-widest">AUTO-PILOT TERMINAL</span>
                <div className="flex-1" />
                <div className="flex gap-1">
                  {[1,2,3].map(i => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= Math.ceil(autoPilotLog.length / 3) ? 'bg-violet-500' : 'bg-slate-700'}`} />
                  ))}
                </div>
              </div>
              <div className="p-3 space-y-1 max-h-[150px] overflow-y-auto">
                {autoPilotLog.map((entry, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-mono text-[9.5px] leading-relaxed"
                    style={{
                      color: entry.msg.startsWith('✅') ? '#34d399'
                           : entry.msg.startsWith('🏁') ? '#a78bfa'
                           : entry.msg.startsWith('📊') ? '#60a5fa'
                           : '#94a3b8'
                    }}
                  >
                    <span className="text-slate-600 mr-2">[{entry.ts}]</span>
                    {entry.msg}
                  </motion.div>
                ))}
                {autoPilotLog.length > 0 && autoPilotLog.length < 10 && (
                  <div className="font-mono text-[9px] text-violet-500 animate-pulse">█</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Risk score gauge + threat bars ──────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

          {/* Radial score gauge */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-3 border border-slate-150 rounded-xl bg-slate-50/30 relative">
            {/* Auto-pilot engaged glow */}
            {autoPilotActive && (
              <div className="absolute inset-0 rounded-xl animate-pulse opacity-20"
                style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)' }} />
            )}
            <div className="relative w-20 h-20">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E2E8F0" strokeWidth="2.5" />
                <motion.circle
                  cx="18" cy="18" r="15.915" fill="none"
                  stroke={autoPilotActive ? '#7c3aed' : overallRisk >= 70 ? '#EF4444' : overallRisk >= 35 ? '#F59E0B' : '#10B981'}
                  strokeWidth="2.5"
                  strokeDasharray={`${overallRisk} ${100 - overallRisk}`}
                  strokeDashoffset="25"
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {autoPilotActive
                  ? <Bot className="w-5 h-5 text-violet-500 mb-0.5" />
                  : <span className="font-mono font-black text-lg text-slate-800 leading-none">{overallRisk}%</span>
                }
                <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  {autoPilotActive ? 'Managed' : 'Risk'}
                </span>
              </div>
            </div>
            <div className={`mt-2 px-2 py-0.5 border rounded font-sans text-[7.5px] font-black uppercase tracking-widest leading-normal text-center ${riskLabel.color} ${riskLabel.border}`}>
              {autoPilotActive ? 'AUTO-PILOT ENGAGED' : riskLabel.text}
            </div>
          </div>

          {/* Environmental threats bars */}
          <div className="md:col-span-8 space-y-2.5">
            {[
              { label: 'Met / Air Currents',  icon: Wind,        color: 'text-sky-500',    value: threats.met   },
              { label: 'Route Congestion',    icon: Route,       color: 'text-blue-500',   value: threats.route },
              { label: 'Cargo Integrity',     icon: Thermometer, color: 'text-red-500',    value: threats.cargo },
              { label: 'Cyber & Technical',   icon: Lock,        color: 'text-indigo-500', value: threats.cyber },
            ].map(({ label, icon: Icon, color, value }) => (
              <div key={label}>
                <div className="flex items-center justify-between text-[9px] font-sans font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Icon className={`w-3 h-3 ${color}`} />{label}</span>
                  <span className="font-mono text-slate-700">{value}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden p-[1px] border border-slate-150">
                  <motion.div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${value}%`, backgroundColor: value >= 70 ? '#EF4444' : value >= 35 ? '#F59E0B' : '#10B981' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Interactive Mitigations Checklist ───────────────────────── */}
        <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/30">
          <div className="font-sans text-[9px] text-slate-400 uppercase tracking-widest mb-2 font-bold flex items-center justify-between">
            <span>Pre-emptive Mitigations</span>
            <span className="text-emerald-600 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Select to reduce risk
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {[
              { key: 'stabilizeCurrents',   icon: Zap,        label: 'Wind/Current Stabilization', sub: 'Air Current Shield override'    },
              { key: 'preClearCustoms',     icon: ShieldCheck,label: 'Pre-Clear Customs Manifest',  sub: 'Electronic signature bypass'    },
              { key: 'preLoadColdChambers', icon: Thermometer,label: 'Pre-Cool Cold Chambers',      sub: 'Preserve decay sensitive cargo'  },
              { key: 'backupPowerGrid',     icon: Power,      label: 'Sync Backup Microgrid',       sub: 'Offset grid blackout risks'      },
            ].map(({ key, icon: Icon, label, sub }) => (
              <div
                key={key}
                onClick={() => toggleMitigation(key)}
                className={`p-2 border rounded-lg cursor-pointer select-none transition-all flex items-center gap-2.5 ${
                  mitigations[key]
                    ? 'border-emerald-500 bg-emerald-50/40 text-emerald-800 font-semibold'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-350 hover:bg-slate-50/20'
                }`}
              >
                <Icon className={`w-4 h-4 ${mitigations[key] ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] leading-tight font-bold truncate">{label}</div>
                  <div className="text-[8.5px] text-slate-400 font-normal leading-tight mt-0.5">{sub}</div>
                </div>
                <input
                  type="checkbox"
                  checked={mitigations[key]}
                  onChange={() => {}}
                  className="w-3.5 h-3.5 rounded border-slate-250 pointer-events-none accent-emerald-600"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Alert Predictions Log ────────────────────────────────────── */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
          <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-1.5 font-sans text-[9px] text-slate-400 uppercase tracking-widest font-bold">
            <Radio className="w-3.5 h-3.5 text-accent-blue animate-pulse" />
            <span>AI Predictive Warnings Log</span>
          </div>

          <div className="p-3 space-y-2 max-h-[140px] overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {predictiveAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-2.5 border rounded-lg text-[10px] leading-normal flex items-start gap-2.5 ${
                    alert.type === 'resolved' ? 'border-emerald-200 bg-emerald-50/30 text-emerald-800'
                    : alert.type === 'nominal' ? 'border-slate-150 bg-slate-50/50 text-slate-500 font-medium'
                    : 'border-amber-200 bg-amber-50/30 text-amber-800'
                  }`}
                >
                  {alert.type === 'resolved'
                    ? <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    : alert.type === 'nominal'
                    ? <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    : <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  }
                  <div className="flex-1">
                    <div>{alert.text}</div>
                    {alert.suggestion && (
                      <div className="font-bold text-[8.5px] mt-1 text-slate-400 inline-flex items-center gap-0.5">
                        ↳ Action Required: {alert.suggestion}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Auto-Pilot threshold notice ──────────────────────────────── */}
        {autoPilotMode && !autoPilotActive && isCrisis && overallRisk < 85 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-[10px] border border-violet-200 bg-violet-50/40 rounded-lg p-2.5 text-violet-700 font-sans"
          >
            <Activity className="w-4 h-4 shrink-0 text-violet-500 animate-pulse" />
            <span>
              Auto-Pilot armed. Will auto-engage when risk reaches{' '}
              <strong>85%</strong>. Current: <strong>{overallRisk}%</strong>
            </span>
          </motion.div>
        )}
      </div>
    </div>
  )
}
