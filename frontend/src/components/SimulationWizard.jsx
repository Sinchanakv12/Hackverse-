import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Cpu, Apple, Pill, AlertTriangle, ArrowRight, X, Search, Check,
  Plane, AlertOctagon, ShieldAlert, Users, Wrench, PackageOpen,
  Biohazard, Wind, TrendingDown, Anchor, Train
} from 'lucide-react'
import { scenarios } from '../scenariosData'

const verticals = [
  {
    id: 'Food & Ag',
    label: 'Food & Agriculture',
    description: 'Produce, dairy, and cold-chain perishables.',
    icon: Apple,
  },
  {
    id: 'Healthcare',
    label: 'Healthcare & Pharma',
    description: 'Vaccines, biologics, and clinical therapies.',
    icon: Pill,
  },
  {
    id: 'Electronics',
    label: 'Consumer Electronics',
    description: 'Laptops, server systems, and microchips.',
    icon: Cpu,
  },
  {
    id: 'Hazmat',
    label: 'Hazardous Materials',
    description: 'Volatile solvents, acids, and class-3 chemicals.',
    icon: AlertTriangle,
  },
]

const subCategoriesMap = {
  'Food & Ag': ['Fresh Produce', 'Dairy/Meat'],
  'Healthcare': ['Vaccines', 'Biologics'],
  'Electronics': ['Consumer Devices', 'High-End Servers'],
  'Hazmat': ['Flammable', 'Toxic'],
}

const vehicleTypes = [
  'Dry Van (Standard)',
  'Reefer (Refrigerated)',
  'Hazmat Certified Carrier',
  'Armored Convoy',
]

const categories = [
  { id: 'ALL',                  label: 'All Crises',           icon: AlertOctagon  },
  { id: 'Air Transport',        label: 'Air Transport',        icon: Plane         },
  { id: 'Natural Disasters',    label: 'Natural Disasters',    icon: AlertTriangle  },
  { id: 'Cyber/Technical',      label: 'Cyber & Technical',    icon: ShieldAlert   },
  { id: 'Geopolitical/Labor',   label: 'Labor & Geopolitical', icon: Users         },
  { id: 'Mechanical/Safety',    label: 'Mechanical & Safety',  icon: Wrench        },
  { id: 'Supply Chain Shock',   label: 'Supply Chain Shock',   icon: PackageOpen   },
  { id: 'Pandemic/Biological',  label: 'Pandemic/Biological',  icon: Biohazard     },
  { id: 'Climate/Environmental',label: 'Climate/Environment',  icon: Wind          },
  { id: 'Financial/Market',     label: 'Financial/Market',     icon: TrendingDown  },
  { id: 'Maritime/Port',        label: 'Maritime & Port',      icon: Anchor        },
  { id: 'Rail/Road',            label: 'Rail & Road',          icon: Train         },
]

const severityStyles = {
  CRITICAL: 'bg-red-50 border-red-200 text-red-700',
  HIGH: 'bg-amber-50 border-amber-200 text-amber-700',
  MEDIUM: 'bg-blue-50 border-blue-200 text-blue-700',
}

export default function SimulationWizard({ isOpen, onClose, onInitialize }) {
  const [step, setStep] = useState(1)
  const [activeCategoryTab, setActiveCategoryTab] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  
  const [state, setState] = useState({
    category: '',
    subCategory: '',
    payloadTons: 50,
    vehicleType: '',
    telemetryActive: true,
    scenario: 'bengaluru-flood',
  })

  // Reset wizard state whenever it opens fresh
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setActiveCategoryTab('ALL')
      setSearchQuery('')
      setState({
        category: 'Electronics',
        subCategory: 'Consumer Devices',
        payloadTons: 50,
        vehicleType: 'Dry Van (Standard)',
        telemetryActive: true,
        scenario: 'bengaluru-flood',
      })
    }
  }, [isOpen])

  // Sync sub-category when category changes
  useEffect(() => {
    if (state.category && subCategoriesMap[state.category]) {
      setState((prev) => ({
        ...prev,
        subCategory: subCategoriesMap[state.category][0],
      }))
    }
  }, [state.category])

  const selectCategory = (cat) => {
    setState((prev) => ({
      ...prev,
      category: cat,
      subCategory: subCategoriesMap[cat] ? subCategoriesMap[cat][0] : '',
      vehicleType: prev.vehicleType || 'Dry Van (Standard)',
    }))
  }

  // Filtered scenarios for Step 2
  const filteredScenarios = useMemo(() => {
    return scenarios.filter(s => {
      const matchesTab = activeCategoryTab === 'ALL' || s.category === activeCategoryTab
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.affectedNodeId.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesTab && matchesSearch
    })
  }, [activeCategoryTab, searchQuery])

  const activeScenarioObj = useMemo(() => {
    return scenarios.find(s => s.id === state.scenario) || scenarios[0]
  }, [state.scenario])

  const isStep1Valid = state.category !== '' && state.subCategory !== '' && state.payloadTons > 0
  const isStep2Valid = state.scenario !== ''
  const isStep3Valid = state.vehicleType !== ''

  const handleNext = () => setStep((p) => Math.min(p + 1, 4))
  const handleBack = () => setStep((p) => Math.max(p - 1, 1))

  const handleSubmit = (e) => {
    e.preventDefault()
    onInitialize(state)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="wizard-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            key="wizard-card"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full flex flex-col overflow-hidden h-[90vh] md:h-[80vh]"
          >
            {/* ── Modal Header ─────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <div>
                  <div className="font-sans text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                    Chaos Simulator v3.5
                  </div>
                  <div className="font-sans font-black text-sm text-slate-900 uppercase tracking-wide leading-tight">
                    Configure Disaster Sandbox
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Step pills */}
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        s <= step ? 'w-6 bg-blue-600' : 'w-4 bg-slate-200'
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-sans text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Step {step} / 4
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer border-0 bg-transparent p-1 rounded-md hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Modal Body ───────────────────────────────────────────── */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 min-h-0">
                <AnimatePresence mode="wait">

                  {/* ── STEP 1: CARGO PROFILING ─────────────────────────── */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block font-sans text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3">
                          Select Verticals
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {verticals.map((vert) => {
                            const Icon = vert.icon
                            const isSelected = state.category === vert.id
                            return (
                              <div
                                key={vert.id}
                                onClick={() => selectCategory(vert.id)}
                                className={`p-4 border rounded-xl cursor-pointer transition-all flex flex-col gap-2.5 select-none ${
                                  isSelected
                                    ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                                    : 'border-slate-200 bg-white hover:border-slate-350 hover:bg-slate-50/30'
                                }`}
                              >
                                <div className={`p-2 w-fit rounded-lg border ${
                                  isSelected
                                    ? 'border-blue-200 bg-blue-100 text-blue-600'
                                    : 'border-slate-200 bg-slate-50 text-slate-400'
                                }`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-sans font-bold text-xs text-slate-800 leading-tight">{vert.label}</span>
                                  <span className="font-sans text-[10px] text-slate-500 mt-1 leading-normal">{vert.description}</span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {state.category && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-150"
                        >
                          <div>
                            <label className="block font-sans text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">
                              Sub-Category
                            </label>
                            <select
                              value={state.subCategory}
                              onChange={(e) => setState((p) => ({ ...p, subCategory: e.target.value }))}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-3 text-xs text-slate-800 font-semibold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all cursor-pointer"
                            >
                              {subCategoriesMap[state.category]?.map((sub) => (
                                <option key={sub} value={sub}>{sub}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block font-sans text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">
                              Payload Volume (Metric Tons)
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="1000"
                              value={state.payloadTons}
                              onChange={(e) => setState((p) => ({ ...p, payloadTons: Math.max(1, parseInt(e.target.value, 10) || 0) }))}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-3 text-xs text-slate-800 font-mono outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
                              required
                            />
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* ── STEP 2: CRISIS SCENARIO SELECTION (51 Scenarios) ── */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-4 h-full flex flex-col"
                    >
                      {/* Search and Tabs */}
                      <div className="flex flex-col md:flex-row gap-3 items-center justify-between shrink-0">
                        <div className="relative w-full md:w-72">
                          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search 51 scenarios..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all"
                          />
                        </div>

                        {/* Category tabs */}
                        <div className="flex gap-1 overflow-x-auto w-full md:w-auto pb-1 max-w-full">
                          {categories.map((cat) => {
                            const TabIcon = cat.icon
                            const isActive = activeCategoryTab === cat.id
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => setActiveCategoryTab(cat.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors ${
                                  isActive
                                    ? 'bg-slate-900 border-slate-900 text-white'
                                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                              >
                                <TabIcon className="w-3.5 h-3.5" />
                                <span>{cat.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Scenarios Grid */}
                      <div className="flex-1 overflow-y-auto border border-slate-200 rounded-xl bg-slate-50/50 p-4 min-h-[300px]">
                        {filteredScenarios.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                            <AlertTriangle className="w-8 h-8 mb-3 opacity-30 text-amber-500" />
                            <div className="font-sans text-xs font-bold">No matching scenarios found</div>
                            <div className="font-sans text-[10px] mt-1 opacity-70">Try updating your filters or search keywords.</div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {filteredScenarios.map((sc) => {
                              const isSelected = state.scenario === sc.id
                              return (
                                <div
                                  key={sc.id}
                                  onClick={() => setState(prev => ({ ...prev, scenario: sc.id }))}
                                  className={`p-3.5 border rounded-xl cursor-pointer select-none transition-all flex flex-col gap-2 relative ${
                                    isSelected
                                      ? 'border-blue-500 bg-white shadow-md ring-2 ring-blue-100'
                                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                                  }`}
                                >
                                  {/* Badges */}
                                  <div className="flex items-center gap-2 justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <span className={`px-1.5 py-0.5 border rounded text-[8px] font-sans font-extrabold uppercase tracking-wider ${severityStyles[sc.severity]}`}>
                                        {sc.severity}
                                      </span>
                                      <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded text-[8px] font-mono font-semibold">
                                        ⏱ {sc.estimatedDowntimeHours}h downtime
                                      </span>
                                    </div>
                                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                                      {sc.affectedNodeId}
                                    </span>
                                  </div>

                                  {/* Title & description */}
                                  <div>
                                    <div className="font-sans font-bold text-xs text-slate-800 leading-tight flex items-center gap-2">
                                      {sc.title}
                                    </div>
                                    <div className="font-sans text-[10px] text-slate-500 leading-relaxed mt-1">
                                      {sc.description}
                                    </div>
                                  </div>

                                  {/* Selected Checkmark overlay */}
                                  {isSelected && (
                                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 3: FLEET & TELEMETRY ───────────────────── */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block font-sans text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">
                          Available Rerouting Fleet
                        </label>
                        <select
                          value={state.vehicleType}
                          onChange={(e) => setState((p) => ({ ...p, vehicleType: e.target.value }))}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-3 text-xs text-slate-800 font-semibold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all cursor-pointer"
                        >
                          <option value="" disabled>Select vehicle type…</option>
                          {vehicleTypes.map((v) => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                      </div>

                      {/* Telemetry Toggle */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-sans font-bold text-xs text-slate-800">Real-time GPS Telemetry Active</span>
                          <span className="font-sans text-[10px] text-slate-500 leading-normal">
                            Streams live geographic coordinates and status updates.
                          </span>
                        </div>
                        <div
                          onClick={() => setState((p) => ({ ...p, telemetryActive: !p.telemetryActive }))}
                          className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 flex-shrink-0 ${
                            state.telemetryActive ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        >
                          <motion.div
                            layout
                            className="bg-white w-4 h-4 rounded-full shadow-md pointer-events-none"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 4: REVIEW & INITIALIZE ─────────────────────── */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block font-sans text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3">
                          Simulation Configuration Summary
                        </label>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
                            <div>
                              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">Selected Crisis</div>
                              <div className="font-sans font-extrabold text-red-600 leading-tight">{activeScenarioObj.title}</div>
                              <div className="font-mono text-[9px] text-slate-400 mt-0.5">{activeScenarioObj.category} · Node: {activeScenarioObj.affectedNodeId.toUpperCase()}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">Vertical Category</div>
                              <div className="font-sans font-extrabold text-slate-900">{state.category} ({state.subCategory})</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">Rerouting Fleet</div>
                              <div className="font-sans font-extrabold text-blue-600">{state.vehicleType}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">Payload Capacity</div>
                              <div className="font-mono font-bold text-amber-600">{state.payloadTons} Metric Tons</div>
                            </div>
                          </div>
                          <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-xs">
                            <span className="text-slate-500">GPS Telemetry Status</span>
                            <span className={`font-sans font-extrabold px-2.5 py-0.5 rounded-md text-[10px] border ${
                              state.telemetryActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}>
                              {state.telemetryActive ? '● ACTIVE' : '○ INACTIVE'}
                            </span>
                          </div>
                        </div>

                        {/* Warnings */}
                        {((state.subCategory === 'Dairy/Meat' || state.category === 'Food & Ag') && state.vehicleType !== 'Reefer (Refrigerated)') && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2"
                          >
                            <span className="text-amber-500 text-sm mt-0.5">⚠</span>
                            <div className="font-sans text-[11px] text-amber-700 leading-relaxed">
                              <strong>Spoilage Risk:</strong> Temperature-sensitive perishable cargo should use a Reefer vehicle. Prediction accuracy will be reduced.
                            </div>
                          </motion.div>
                        )}
                        {(state.vehicleType === 'Hazmat Certified Carrier' && state.category !== 'Hazmat') && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2"
                          >
                            <span className="text-blue-500 text-sm mt-0.5">ℹ</span>
                            <div className="font-sans text-[11px] text-blue-700 leading-relaxed">
                              Hazmat Certified Carrier selected for non-hazardous cargo — regulatory overhead may reduce route speed.
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Modal Footer / Navigation ────────────────────────────── */}
              <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 shrink-0">
                <button
                  type="button"
                  onClick={step === 1 ? onClose : handleBack}
                  className="font-sans font-semibold text-xs text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-350 bg-white px-4 py-2.5 rounded-lg cursor-pointer transition-all"
                >
                  {step === 1 ? 'Cancel' : '← Back'}
                </button>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={step === 1 ? !isStep1Valid : step === 2 ? !isStep2Valid : !isStep3Valid}
                    className={`font-sans font-bold text-xs py-2.5 px-5 rounded-lg flex items-center gap-2 cursor-pointer border-0 transition-all shadow-sm ${
                      (step === 1 ? isStep1Valid : step === 2 ? isStep2Valid : isStep3Valid)
                        ? 'bg-slate-900 hover:bg-slate-700 text-white shadow-slate-900/20'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <span>{step === 1 ? 'CONTINUE TO SCENARIO' : step === 2 ? 'CONTINUE TO LOGISTICS' : 'REVIEW SETUP'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-sans font-bold text-xs py-2.5 px-5 rounded-lg flex items-center gap-2 cursor-pointer border-0 transition-all shadow-sm shadow-red-600/20 uppercase tracking-wider"
                  >
                    <span>⚡ INJECT CHAOS SCENARIO</span>
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
