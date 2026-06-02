import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChaos } from '../context/ChaosContext'
import {
  Waves, AlertTriangle, Activity, ChevronRight,
  MapPin, Clock, Radio, Zap, CloudLightning
} from 'lucide-react'

const CATEGORY_ICONS = {
  'Natural Disasters':    '🌊',
  'Cyber/Technical':      '🔐',
  'Geopolitical/Labor':   '✊',
  'Mechanical/Safety':    '⚙️',
  'Supply Chain Shock':   '📦',
  'Air Transport':        '✈️',
}

const RISK_COLOR = (risk) => {
  if (risk >= 70) return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', dot: 'bg-red-500', bar: '#EF4444' }
  if (risk >= 45) return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', dot: 'bg-amber-400', bar: '#F59E0B' }
  return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', dot: 'bg-emerald-400', bar: '#10B981' }
}

function CascadeNodeCard({ node, index }) {
  const color = RISK_COLOR(node.risk)
  const icon  = CATEGORY_ICONS[node.type] || '⚡'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: index * 0.15, type: 'spring', damping: 20 }}
      className={`border rounded-xl p-3 ${color.bg} ${color.border} relative overflow-hidden`}
    >
      {/* Pulse ring */}
      <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${color.dot} animate-ping opacity-50`} />
      <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${color.dot}`} />

      <div className="flex items-start gap-2.5">
        <div className="text-lg leading-none mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-sans text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              {node.nodeId.toUpperCase()}
            </span>
            <span className={`font-sans text-[8px] font-bold uppercase tracking-wider ${color.text}`}>
              CASCADE
            </span>
          </div>
          <div className="font-sans text-xs font-bold text-slate-700 leading-tight">{node.label}</div>
          <div className="flex items-center gap-2 mt-1.5">
            {/* Risk bar */}
            <div className="flex-1 h-1.5 bg-white/60 rounded-full overflow-hidden border border-white/40">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${node.risk}%` }}
                transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
                className="h-full rounded-full"
                style={{ background: color.bar }}
              />
            </div>
            <span className={`font-mono text-[9px] font-black ${color.text}`}>{node.risk}%</span>
          </div>
          <div className="flex items-center gap-1 mt-1.5">
            <Clock className="w-2.5 h-2.5 text-slate-400" />
            <span className="font-mono text-[8px] text-slate-400">Triggered {node.triggeredAt}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function CascadeEngine() {
  const { cascadeNodes, cascadeActive, chaosState, simulationConfig } = useChaos()
  const [expanded, setExpanded] = useState(true)
  const isCrisis = chaosState !== 'idle'

  if (!isCrisis && cascadeNodes.length === 0) return null

  const cascadeRisk = cascadeNodes.length > 0
    ? Math.round(cascadeNodes.reduce((s, n) => s + n.risk, 0) / cascadeNodes.length)
    : 0

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="panel overflow-hidden"
        style={{
          background: cascadeNodes.length > 0
            ? 'linear-gradient(135deg, #fff7ed 0%, #ffffff 60%)'
            : undefined
        }}
      >
        {/* Header */}
        <div
          className="panel-header border-b border-border-subtle cursor-pointer select-none"
          onClick={() => setExpanded(e => !e)}
        >
          <div className="flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 text-amber-500" />
            <span>Cascade Engine — Domino Effect</span>
          </div>
          <div className="flex-1" />

          {cascadeNodes.length > 0 && (
            <div className="flex items-center gap-1.5 mr-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-mono text-[9px] font-bold text-amber-600 uppercase">
                {cascadeNodes.length} CASCADING
              </span>
            </div>
          )}
          <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </motion.div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4"
            >
              {/* Status banner */}
              <div className={`flex items-center gap-3 p-3 rounded-xl border mb-4 ${
                cascadeNodes.length > 0
                  ? 'border-amber-200 bg-amber-50/60'
                  : 'border-slate-200 bg-slate-50/40'
              }`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  cascadeNodes.length > 0 ? 'bg-amber-100' : 'bg-slate-100'
                }`}>
                  {cascadeNodes.length > 0
                    ? <CloudLightning className="w-4 h-4 text-amber-600" />
                    : <Activity className="w-4 h-4 text-slate-400" />
                  }
                </div>
                <div className="flex-1">
                  {cascadeNodes.length > 0 ? (
                    <>
                      <div className="font-sans text-xs font-bold text-amber-700">
                        Domino Effect Active — {cascadeNodes.length} secondary node(s) compromised
                      </div>
                      <div className="font-sans text-[10px] text-amber-600/80 mt-0.5">
                        Primary crisis at <strong>{simulationConfig?.scenario?.split('-')?.[0]?.toUpperCase()}</strong> is
                        spreading across the network topology.
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-sans text-xs font-bold text-slate-600">
                        Monitoring for cascade propagation...
                      </div>
                      <div className="font-sans text-[10px] text-slate-400 mt-0.5">
                        Adjacent nodes are being monitored for secondary failure signals.
                      </div>
                    </>
                  )}
                </div>
                {cascadeNodes.length > 0 && (
                  <div className="text-right shrink-0">
                    <div className="font-mono text-xs font-black text-amber-700">{cascadeRisk}%</div>
                    <div className="font-sans text-[8px] text-amber-500 uppercase tracking-wider">Avg Risk</div>
                  </div>
                )}
              </div>

              {/* Cascade node cards */}
              {cascadeNodes.length > 0 ? (
                <div className="space-y-2.5">
                  <div className="font-sans text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5">
                    <Radio className="w-3 h-3 animate-pulse text-amber-500" />
                    Secondary Failure Events
                  </div>
                  {cascadeNodes.map((node, i) => (
                    <CascadeNodeCard key={node.nodeId + i} node={node} index={i} />
                  ))}
                </div>
              ) : (
                /* Scanning animation */
                <div className="space-y-2">
                  {[1, 2].map(i => (
                    <div key={i} className="h-14 bg-slate-100/60 rounded-xl border border-slate-200 animate-pulse"
                      style={{ animationDelay: `${i * 0.3}s` }}
                    />
                  ))}
                  <div className="flex items-center justify-center gap-2 py-2">
                    <Zap className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
                    <span className="font-sans text-[10px] text-slate-400 font-semibold">
                      Scanning adjacent nodes for cascade signals...
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
