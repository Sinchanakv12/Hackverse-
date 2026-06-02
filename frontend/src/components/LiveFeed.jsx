/**
 * LiveFeed.jsx — Real-time Live Scenario Data Dashboard
 *
 * Subscribes to GET /api/live-stream via SSE.
 * Displays:
 *  - Live risk sparkline (30-point rolling chart)
 *  - Global metrics ticker (throughput, alerts, risk score)
 *  - Live node health bar grid (9 nodes)
 *  - Scrolling event log with category colour-coding
 *  - Per-node sensor inspector (click a node to drill in)
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChaos } from '../context/ChaosContext'
import {
  Activity, Zap, Thermometer, Droplets, Wind,
  AlertTriangle, Radio, Cpu, BarChart2, Package,
  ChevronDown, ChevronUp, RefreshCw, Wifi, WifiOff,
  Shield, TrendingUp
} from 'lucide-react'

const NODES = ['bengaluru','mumbai','delhi','chennai','hyderabad','kolkata','pune','shenzhen','singapore']

const TAG_STYLES = {
  SENSOR:    { bg: 'bg-blue-50',    border: 'border-blue-200',    dot: 'bg-blue-500',    text: 'text-blue-600'    },
  TRAFFIC:   { bg: 'bg-amber-50',   border: 'border-amber-200',   dot: 'bg-amber-500',   text: 'text-amber-600'   },
  WEATHER:   { bg: 'bg-sky-50',     border: 'border-sky-200',     dot: 'bg-sky-500',     text: 'text-sky-600'     },
  SECURITY:  { bg: 'bg-red-50',     border: 'border-red-200',     dot: 'bg-red-500',     text: 'text-red-600'     },
  INVENTORY: { bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500', text: 'text-emerald-600' },
}

const SENSOR_ICONS = { temp: Thermometer, humidity: Droplets, windSpeed: Wind, floodDepth: Droplets, congestion: BarChart2, power: Zap }

// ── Mini Sparkline (SVG) ──────────────────────────────────────────────────────
function Sparkline({ data, color = '#2563eb', height = 40 }) {
  if (!data || data.length < 2) return null
  const w = 240, h = height
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')

  const lastX = ((data.length - 1) / (data.length - 1)) * w
  const lastY = h - ((data[data.length - 1] - min) / range) * (h - 4) - 2
  const fillPts = `0,${h} ${pts} ${w},${h}`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="spark-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill="url(#spark-grad)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      {/* Live dot */}
      <circle cx={lastX} cy={lastY} r="3" fill={color} />
      <circle cx={lastX} cy={lastY} r="6" fill={color} fillOpacity="0.2">
        <animate attributeName="r" values="3;8;3" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="fill-opacity" values="0.3;0;0.3" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

// ── Health Bar ────────────────────────────────────────────────────────────────
function HealthBar({ nodeId, health, sensors, isSelected, onClick, isCrisisNode }) {
  const pct = health ?? 80
  const color = pct >= 70 ? '#10B981' : pct >= 40 ? '#F59E0B' : '#EF4444'
  return (
    <div
      onClick={() => onClick(nodeId)}
      className={`border rounded-lg p-2 cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-400 bg-blue-50/50 shadow-sm'
          : isCrisisNode
          ? 'border-red-200 bg-red-50/30'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={`font-mono text-[8px] font-black uppercase ${isCrisisNode ? 'text-red-600' : 'text-slate-500'}`}>
          {nodeId.slice(0,3).toUpperCase()}
          {isCrisisNode && <span className="ml-1">🔴</span>}
        </span>
        <span className="font-mono text-[8px] font-bold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      {sensors && (
        <div className="flex items-center gap-1.5 mt-1 text-[7px] text-slate-400 font-mono">
          <span>🌡{sensors.temp}°</span>
          <span>💧{sensors.humidity}%</span>
          <span>⚡{sensors.power}%</span>
        </div>
      )}
    </div>
  )
}

// ── Sensor Inspector ─────────────────────────────────────────────────────────
function SensorInspector({ nodeId, sensors }) {
  if (!sensors) return null
  const rows = [
    { label: 'Temperature',   key: 'temp',        unit: '°C',      icon: Thermometer, warn: v => v > 38 || v < 5  },
    { label: 'Humidity',      key: 'humidity',     unit: '%',       icon: Droplets,    warn: v => v > 80            },
    { label: 'Wind Speed',    key: 'windSpeed',    unit: ' km/h',   icon: Wind,        warn: v => v > 80            },
    { label: 'Flood Depth',   key: 'floodDepth',   unit: ' mm',     icon: Droplets,    warn: v => v > 50            },
    { label: 'Congestion',    key: 'congestion',   unit: '/10',     icon: BarChart2,   warn: v => v >= 7            },
    { label: 'Power Grid',    key: 'power',        unit: '%',       icon: Zap,         warn: v => v < 50            },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-blue-200 bg-blue-50/30 rounded-xl p-3 mt-3"
    >
      <div className="font-sans text-[9px] text-blue-600 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5">
        <Radio className="w-3 h-3 animate-pulse" /> {nodeId.toUpperCase()} LIVE TELEMETRY
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {rows.map(({ label, key, unit, icon: Icon, warn }) => {
          const val = sensors[key] ?? 0
          const isWarn = warn(val)
          return (
            <div key={key} className={`flex items-center gap-1.5 p-1.5 rounded-lg border ${
              isWarn ? 'border-amber-200 bg-amber-50/50' : 'border-slate-100 bg-white'
            }`}>
              <Icon className={`w-3 h-3 shrink-0 ${isWarn ? 'text-amber-500' : 'text-slate-400'}`} />
              <div className="flex-1 min-w-0">
                <div className="font-sans text-[7px] text-slate-400 uppercase">{label}</div>
                <div className={`font-mono text-[10px] font-black ${isWarn ? 'text-amber-600' : 'text-slate-700'}`}>
                  {val}{unit}
                  {isWarn && <span className="ml-1 text-[8px]">⚠</span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LiveFeed() {
  const { chaosState, simulationConfig } = useChaos()
  const isCrisis = chaosState !== 'idle'
  const crisisNodeId = simulationConfig?.affectedNodeId || 'bengaluru'

  const [connected, setConnected]         = useState(false)
  const [riskHistory, setRiskHistory]     = useState([])          // last 30 values
  const [nodeHealth, setNodeHealth]       = useState({})
  const [sensors, setSensors]             = useState({})
  const [events, setEvents]               = useState([])          // last 50 events
  const [metrics, setMetrics]             = useState({ riskScore: 0, activeAlerts: 0, throughput: 0 })
  const [selectedNode, setSelectedNode]   = useState(null)
  const [collapsed, setCollapsed]         = useState(false)
  const [tickCount, setTickCount]         = useState(0)

  const esRef      = useRef(null)
  const eventLogRef= useRef(null)

  const connect = useCallback(() => {
    if (esRef.current) esRef.current.close()

    const base = import.meta.env.VITE_API_BASE_URL || 'https://hackverse-production-9017.up.railway.app'
    const url = `${base}/api/live-stream?crisisNodeId=${crisisNodeId}&crisis=${isCrisis}`
    const es = new EventSource(url)
    esRef.current = es

    es.onopen = () => setConnected(true)
    es.onerror = () => setConnected(false)

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data.type !== 'tick') return

        setTickCount(t => t + 1)
        setRiskHistory(h => [...h.slice(-29), data.riskScore])
        setNodeHealth(data.nodeHealth || {})
        setSensors(data.sensors || {})
        setMetrics({ riskScore: data.riskScore, activeAlerts: data.activeAlerts, throughput: data.throughput })

        const ts = new Date().toLocaleTimeString('en-US', { hour12: false })
        setEvents(ev => [
          { id: `${data.tick}-${Date.now()}`, ts, ...data.event },
          ...ev.slice(0, 49),
        ])
      } catch (_) {}
    }
  }, [crisisNodeId, isCrisis])

  // Reconnect whenever crisis state / node changes
  useEffect(() => {
    connect()
    return () => esRef.current?.close()
  }, [connect])

  // Auto-scroll event log
  useEffect(() => {
    // Don't auto-scroll — newest events go to top
  }, [events])

  const riskColor = metrics.riskScore >= 70 ? '#EF4444' : metrics.riskScore >= 40 ? '#F59E0B' : '#10B981'

  return (
    <div className="panel overflow-hidden">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div
        className="panel-header border-b border-border-subtle cursor-pointer select-none"
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-accent-blue" />
          <span>Live Data Feed</span>
          {connected
            ? <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" title="Connected" />
            : <div className="w-1.5 h-1.5 rounded-full bg-red-500 ml-1" title="Disconnected" />
          }
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 mr-2">
          <span className="font-mono text-[9px] font-bold text-slate-400">
            {connected ? `${tickCount} TICKS` : 'OFFLINE'}
          </span>
          {isCrisis && (
            <span className="px-1.5 py-0.5 rounded-full bg-red-100 border border-red-200 text-red-600 text-[8px] font-bold font-sans">
              CRISIS STREAM
            </span>
          )}
        </div>
        <button
          onClick={e => { e.stopPropagation(); connect() }}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 border-0 bg-transparent cursor-pointer mr-1"
          title="Reconnect"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
        <motion.div animate={{ rotate: collapsed ? 0 : 180 }}>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </motion.div>
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">

              {/* ── Global Metrics Row ──────────────────────────────────── */}
              <div className="grid grid-cols-3 gap-2">
                {/* Risk Score */}
                <div className="border rounded-xl p-2.5 text-center"
                  style={{ borderColor: riskColor + '40', background: riskColor + '08' }}>
                  <div className="font-sans text-[8px] text-slate-400 uppercase tracking-widest font-bold mb-1 flex items-center justify-center gap-1">
                    <Shield className="w-2.5 h-2.5" /> Risk Score
                  </div>
                  <motion.div
                    key={metrics.riskScore}
                    initial={{ scale: 1.15 }} animate={{ scale: 1 }}
                    className="font-mono font-black text-xl"
                    style={{ color: riskColor }}
                  >
                    {metrics.riskScore}%
                  </motion.div>
                  <div className="font-sans text-[7px] text-slate-400 mt-0.5">
                    {metrics.riskScore >= 70 ? 'CRITICAL' : metrics.riskScore >= 40 ? 'ELEVATED' : 'NOMINAL'}
                  </div>
                </div>

                {/* Active Alerts */}
                <div className={`border rounded-xl p-2.5 text-center ${
                  metrics.activeAlerts > 0 ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200 bg-slate-50/30'
                }`}>
                  <div className="font-sans text-[8px] text-slate-400 uppercase tracking-widest font-bold mb-1 flex items-center justify-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5" /> Alerts
                  </div>
                  <motion.div
                    key={metrics.activeAlerts}
                    initial={{ scale: 1.15 }} animate={{ scale: 1 }}
                    className={`font-mono font-black text-xl ${
                      metrics.activeAlerts > 0 ? 'text-amber-600' : 'text-emerald-600'
                    }`}
                  >
                    {metrics.activeAlerts}
                  </motion.div>
                  <div className="font-sans text-[7px] text-slate-400 mt-0.5">ACTIVE</div>
                </div>

                {/* Throughput */}
                <div className="border border-slate-200 bg-slate-50/30 rounded-xl p-2.5 text-center">
                  <div className="font-sans text-[8px] text-slate-400 uppercase tracking-widest font-bold mb-1 flex items-center justify-center gap-1">
                    <TrendingUp className="w-2.5 h-2.5" /> Throughput
                  </div>
                  <motion.div
                    key={metrics.throughput}
                    initial={{ scale: 1.1 }} animate={{ scale: 1 }}
                    className="font-mono font-black text-xl text-slate-700"
                  >
                    {(metrics.throughput / 1000).toFixed(1)}k
                  </motion.div>
                  <div className="font-sans text-[7px] text-slate-400 mt-0.5">UNITS/HR</div>
                </div>
              </div>

              {/* ── Live Risk Sparkline ─────────────────────────────────── */}
              <div className="border border-slate-200 rounded-xl p-3 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-sans text-[9px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                    <BarChart2 className="w-3 h-3 text-accent-blue" /> Live Risk Trend (last 30 ticks)
                  </div>
                  <span className="font-mono text-[8px] font-bold" style={{ color: riskColor }}>
                    {riskHistory.length > 1
                      ? (riskHistory[riskHistory.length - 1] > riskHistory[riskHistory.length - 2] ? '▲' : '▼')
                      : '—'} {metrics.riskScore}%
                  </span>
                </div>
                {riskHistory.length > 1
                  ? <Sparkline data={riskHistory} color={riskColor} height={50} />
                  : <div className="h-12 flex items-center justify-center text-slate-400 text-xs font-sans">
                      Collecting data...
                    </div>
                }
              </div>

              {/* ── Node Health Grid ────────────────────────────────────── */}
              <div className="border border-slate-200 rounded-xl p-3 bg-white">
                <div className="font-sans text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-violet-500" /> Node Health Grid (live)
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {NODES.map(n => (
                    <HealthBar
                      key={n}
                      nodeId={n}
                      health={nodeHealth[n]}
                      sensors={sensors[n]}
                      isSelected={selectedNode === n}
                      isCrisisNode={isCrisis && n === crisisNodeId}
                      onClick={id => setSelectedNode(id === selectedNode ? null : id)}
                    />
                  ))}
                </div>

                {/* Sensor Inspector */}
                <AnimatePresence>
                  {selectedNode && sensors[selectedNode] && (
                    <SensorInspector
                      key={selectedNode}
                      nodeId={selectedNode}
                      sensors={sensors[selectedNode]}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* ── Live Scrolling Event Log ────────────────────────────── */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-accent-blue animate-pulse" />
                  <span className="font-sans text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                    Live Event Stream
                  </span>
                  <div className="flex-1" />
                  <span className="font-mono text-[8px] text-slate-400">{events.length} events</span>
                </div>
                <div
                  ref={eventLogRef}
                  className="overflow-y-auto divide-y divide-slate-50"
                  style={{ maxHeight: '220px' }}
                >
                  <AnimatePresence initial={false}>
                    {events.length === 0 ? (
                      <div className="flex items-center justify-center py-8 text-slate-400 text-xs font-sans">
                        <Activity className="w-4 h-4 mr-2 animate-pulse" /> Waiting for data stream...
                      </div>
                    ) : (
                      events.map(ev => {
                        const style = TAG_STYLES[ev.tag] || TAG_STYLES.SENSOR
                        return (
                          <motion.div
                            key={ev.id}
                            initial={{ opacity: 0, x: -10, backgroundColor: '#eff6ff' }}
                            animate={{ opacity: 1, x: 0, backgroundColor: '#ffffff' }}
                            transition={{ duration: 0.35 }}
                            className="flex items-start gap-2.5 px-3 py-2"
                          >
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${style.dot}`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className={`font-sans text-[7.5px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full border ${style.bg} ${style.border} ${style.text}`}>
                                  {ev.tag}
                                </span>
                                <span className="font-mono text-[7px] text-slate-400">{ev.ts}</span>
                                <span className="font-mono text-[7px] text-slate-300">› {(ev.nodeId || '').toUpperCase()}</span>
                              </div>
                              <div className="font-sans text-[10px] text-slate-600 leading-snug">{ev.msg}</div>
                            </div>
                          </motion.div>
                        )
                      })
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Disconnected state */}
              {!connected && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-[10px] border border-red-200 bg-red-50/40 rounded-lg p-2.5 text-red-600 font-sans"
                >
                  <WifiOff className="w-4 h-4 shrink-0" />
                  <span>Live stream disconnected. <button onClick={connect} className="underline font-bold cursor-pointer bg-transparent border-0 text-red-600">Reconnect</button></span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
