import { CloudRain, Wind, Thermometer, Cloud, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function WeatherTelemetry({ weather, chaosState }) {
  const isIdle = chaosState === 'idle'
  const activeWeather = isIdle ? weather?.normal : weather?.crisis

  // High-fidelity fallback details matching demoData defaults
  const condition = activeWeather?.condition || "Clear"
  const temp = activeWeather?.temp || "28°C"
  const wind = activeWeather?.wind || "12 km/h"
  const precipitation = activeWeather?.precipitation || "0%"

  return (
    <div className="space-y-4">
      {/* 2x2 Weather Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Condition */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center gap-3">
          <div className="text-accent-blue/80">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <div className="font-sans text-[9px] text-text-secondary uppercase tracking-wider font-semibold">Condition</div>
            <div className={`font-mono text-xs font-semibold ${isIdle ? 'text-slate-800' : 'text-status-danger'}`}>{condition}</div>
          </div>
        </div>

        {/* Temperature */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center gap-3">
          <div className="text-accent-blue/80">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <div className="font-sans text-[9px] text-text-secondary uppercase tracking-wider font-semibold">Temperature</div>
            <div className="font-mono text-xs font-semibold text-slate-800">{temp}</div>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center gap-3">
          <div className="text-accent-blue/80">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="font-sans text-[9px] text-text-secondary tracking-wider font-semibold uppercase">Wind Speed</div>
            <div className="font-mono text-xs font-semibold text-slate-800">{wind}</div>
          </div>
        </div>

        {/* Precipitation */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center gap-3">
          <div className="text-accent-blue/80">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <div className="font-sans text-[9px] text-text-secondary tracking-wider font-semibold uppercase">Precipitation</div>
            <div className="font-mono text-xs font-semibold text-slate-800">{precipitation}</div>
          </div>
        </div>
      </div>

      {/* Flashing Alert for Severe Weather / Crisis State */}
      {!isIdle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-status-danger/10 border border-status-danger rounded-lg p-3 flex items-center gap-3"
        >
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="text-status-danger flex-shrink-0"
          >
            <AlertTriangle className="w-5 h-5" />
          </motion.div>
          <div className="font-sans text-xs text-status-danger font-semibold tracking-wide uppercase">
            SEVERE WEATHER WARNING: Operations Suspended
          </div>
        </motion.div>
      )}
    </div>
  )
}
