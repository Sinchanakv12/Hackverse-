import { motion, AnimatePresence } from 'framer-motion'
import WeatherTelemetry from './WeatherTelemetry'

export default function ChaosInjector({ chaosState, onInjectChaos, error, weather, simulationConfig }) {
  const isIdle = chaosState === 'idle'
  const isResolving = chaosState === 'resolving'

  const category = simulationConfig?.category || simulationConfig?.vertical || 'Electronics'
  const isFood = category === 'Food & Ag' || category === 'food_ag' || category === 'vegetables'
  const isHealthcare = category === 'Healthcare' || category === 'healthcare_pharma'
  const isHazmat = category === 'Hazmat' || category === 'hazardous_chemicals'

  let cargoName = "UltraBook Pro 15\""
  let cargoUnit = "units"
  let subTitle = "BENGALURU FLOOD SCENARIO"

  if (isFood) {
    cargoName = "Organic Produce Pallets"
    cargoUnit = "pallets"
    subTitle = "AVOCADO SUPPLY COLD-CHAIN DISRUPTION"
  } else if (isHealthcare) {
    cargoName = "mRNA Vaccine Batches"
    cargoUnit = "batches"
    subTitle = "VACCINE TEMPERATURE DISRUPTION"
  } else if (isHazmat) {
    cargoName = "Industrial Solvents (Class 3)"
    cargoUnit = "units"
    subTitle = "CHEMICAL CONTAINMENT DISRUPTION"
  }

  return (
    <div className="panel">
      {/* Panel header */}
      <div className="panel-header">
        <div className="w-1.5 h-1.5 rounded-full bg-status-danger/80" />
        <span>Chaos Injection Module</span>
        <div className="flex-1" />
        <span className="text-[10px] text-text-secondary font-sans font-medium">
          TARGET: BENGALURU-DC-01
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Weather Telemetry */}
        <div>
          <div className="font-sans text-[9px] text-text-secondary uppercase tracking-widest mb-2 font-semibold">
            Live Weather Telemetry — Bengaluru
          </div>
          <WeatherTelemetry weather={weather} chaosState={chaosState} />
        </div>

        {/* Scenario info */}
        <div className="border border-status-danger/20 bg-status-danger/5 rounded-lg p-4">
          <div className="font-sans text-[9px] text-status-danger uppercase tracking-widest mb-1.5 font-semibold">Scenario: BENGALURU-FLOOD-CAT4</div>
          <div className="font-sans text-xs text-text-primary leading-relaxed">
            Simulates a Category 4 monsoon flood disabling the Bengaluru Distribution Center.
            <span className="text-status-danger font-semibold"> 5,000 {cargoUnit}</span> of{' '}
            <span className="text-text-primary font-semibold font-sans">{cargoName}</span> stranded.
            Est. downtime: <span className="text-status-warning font-semibold">14–21 days</span>.
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
              className="w-full bg-status-danger hover:bg-red-700 text-white font-sans font-medium rounded-md shadow-sm py-4 px-4 transition-all duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer border-0"
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-lg">⚡</span>
                <span>BUILD &amp; INJECT SCENARIO</span>
              </div>
              <div className="text-[10px] font-normal tracking-widest mt-0.5 opacity-80 uppercase">
                Configure chaos parameters →
              </div>
            </motion.button>
          ) : (
            <motion.div
              key="status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`w-full border px-4 py-3 font-sans text-sm text-center rounded-lg ${
                isResolving
                  ? 'border-status-warning/40 bg-status-warning/5 text-status-warning'
                  : 'border-status-danger/40 bg-status-danger/10 text-status-danger'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${isResolving ? 'bg-status-warning' : 'bg-status-danger'}`} />
                {isResolving
                  ? 'AGENT INTERVENTION IN PROGRESS...'
                  : 'CHAOS ACTIVE — NODE FAILURE CONFIRMED'
                }
              </div>
              {isResolving && (
                <div className="text-[10px] text-status-warning/60 mt-1 tracking-widest">
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
              className="font-sans text-[11px] text-status-danger border border-status-danger/30 bg-status-danger/5 p-3 rounded-lg"
            >
              ⚠ AGENT ERROR: {error}
              <div className="text-[10px] text-text-secondary mt-1">Check that backend is running on port 5000.</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
