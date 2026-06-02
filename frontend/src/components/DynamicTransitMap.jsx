import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, Radio, Activity, ShieldCheck, Map, Waves } from 'lucide-react'
import { useChaos } from '../context/ChaosContext'

const nodeCoords = {
  bengaluru: { cx: 140, cy: 150 },
  mumbai: { cx: 100, cy: 90 },
  shenzhen: { cx: 340, cy: 50 },
  singapore: { cx: 300, cy: 160 },
  cloud: { cx: 200, cy: 30 },
  "digital-delivery": { cx: 200, cy: 30 },
  delhi: { cx: 130, cy: 40 },
  chennai: { cx: 160, cy: 135 },
  kolkata: { cx: 200, cy: 80 },
  pune: { cx: 105, cy: 105 },
  hyderabad: { cx: 150, cy: 110 }
}

export default function DynamicTransitMap({ chaosState, transitRoutes, deployed, nodes = [] }) {
  const [selectedNode, setSelectedNode] = useState(null)
  const [hoveredNodeId, setHoveredNodeId] = useState(null)
  const isCrisis = chaosState !== 'idle'

  // Pull cascade nodes from context
  const { cascadeNodes = [] } = useChaos()
  const cascadeNodeIds = new Set(cascadeNodes.map(n => n.nodeId))

  // Identify the offline node and the active compromised route
  const offlineNode = useMemo(() => nodes.find(n => n.status === 'offline'), [nodes])
  const offlineNodeId = offlineNode?.id || 'bengaluru'
  const fallbackHubNodeId = offlineNodeId === 'mumbai' ? 'delhi' : 'mumbai'
  const activeRoute = useMemo(() => {
    return transitRoutes?.find((r) => r.source === offlineNodeId || r.target === offlineNodeId)
  }, [transitRoutes, offlineNodeId])

  const fallbackHubCoords = nodeCoords[fallbackHubNodeId] || nodeCoords.mumbai

  // Prepare display nodes list by merging coordinates
  const displayNodes = useMemo(() => {
    return nodes.map(node => {
      const coords = nodeCoords[node.id] || { cx: 150, cy: 100 }
      return {
        ...node,
        cx: coords.cx,
        cy: coords.cy,
        vulnerability: Math.round((node.vulnerabilityScore || 0) * 100) + "%",
        riskLevel: node.vulnerabilityScore >= 0.7 ? 'HIGH' : node.vulnerabilityScore >= 0.3 ? 'MEDIUM' : 'LOW',
        sensorCondition: node.weather ? (node.status === 'offline' ? node.weather.crisis?.condition : node.weather.normal?.condition) : 'Nominal',
        temp: node.weather ? (node.status === 'offline' ? node.weather.crisis?.temp : node.weather.normal?.temp) : 'N/A',
        humidity: node.weather ? (node.status === 'offline' ? node.weather.crisis?.humidity || 'N/A' : node.weather.normal?.humidity || 'N/A') : 'N/A',
      }
    })
  }, [nodes])

  const handleNodeClick = (node) => {
    const matchedNode = displayNodes.find(n => n.id === node.id)
    setSelectedNode(matchedNode)
  }

  return (
    <div className="panel overflow-hidden">
      {/* Panel header */}
      <div className="panel-header border-b border-border-subtle">
        <div className="flex items-center gap-1.5">
          <Map className="w-3.5 h-3.5 text-accent-blue" />
          <span>Live Scenario Map</span>
        </div>
        <div className="flex-1" />
        {cascadeNodes.length > 0 && (
          <div className="flex items-center gap-1 mr-2">
            <Waves className="w-3 h-3 text-amber-500 animate-pulse" />
            <span className="font-mono text-[9px] font-bold text-amber-500">{cascadeNodes.length} CASCADE</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${isCrisis ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
          <span className="font-mono text-[9px] font-bold text-slate-400">
            {isCrisis ? 'CRISIS ACTIVE' : 'ALL NODES NOMINAL'}
          </span>
        </div>
      </div>

      <div className="relative w-full bg-[#FAFBFD] overflow-hidden" style={{ height: '220px' }}>
      {/* ── Interactive SVG Map ── */}
      <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0, 0, 0, 0.02)" strokeWidth="1" />
          </pattern>
          <filter id="glow-safe" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-grid)" />

        {/* ── Dynamic Lanes (Curved Paths) ── */}
        {transitRoutes?.map((route) => {
          const src = nodeCoords[route.source]
          const tgt = nodeCoords[route.target]
          if (!src || !tgt) return null

          const isRouteCrisis = isCrisis && (route.source === offlineNodeId || route.target === offlineNodeId)

          // Curve logic
          const dx = tgt.cx - src.cx
          const dy = tgt.cy - src.cy
          const mx = (src.cx + tgt.cx) / 2
          const my = (src.cy + tgt.cy) / 2
          const len = Math.sqrt(dx * dx + dy * dy)
          const ux = -dy / (len || 1)
          const uy = dx / (len || 1)
          const offset = 12
          const qx = mx + ux * offset
          const qy = my + uy * offset
          const pathD = `M ${src.cx} ${src.cy} Q ${qx} ${qy} ${tgt.cx} ${tgt.cy}`

          return (
            <motion.path
              key={route.id}
              d={pathD}
              fill="none"
              strokeWidth={isRouteCrisis ? "2" : "1.2"}
              animate={{
                stroke: isRouteCrisis ? '#EF4444' : '#E2E8F0',
                strokeDasharray: isRouteCrisis ? '4 4' : '0',
              }}
              transition={{ duration: 0.5 }}
            />
          )
        })}

        {/* Agentic Reroute Lane (BOM/DEL ➔ CLOUD) — Activated on campaign deployment */}
        <AnimatePresence>
          {deployed && (
            <motion.path
              d={`M ${fallbackHubCoords.cx} ${fallbackHubCoords.cy} Q ${fallbackHubCoords.cx + 40} ${Math.min(fallbackHubCoords.cy, 30) + 15} 200 30`}
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              strokeDasharray="5 3"
              filter="url(#glow-safe)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: 1,
                strokeDashoffset: [0, -20]
              }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{
                pathLength: { duration: 0.8, ease: "easeOut" },
                opacity: { duration: 0.3 },
                strokeDashoffset: { repeat: Infinity, ease: "linear", duration: 1.2 }
              }}
            />
          )}
        </AnimatePresence>

        {/* ── Roadblock Overlay (Crisis State) ── */}
        {isCrisis && activeRoute && (
          (() => {
            const src = nodeCoords[activeRoute.source]
            const tgt = nodeCoords[activeRoute.target]
            if (!src || !tgt) return null

            const dx = tgt.cx - src.cx
            const dy = tgt.cy - src.cy
            const mx = (src.cx + tgt.cx) / 2
            const my = (src.cy + tgt.cy) / 2
            const len = Math.sqrt(dx * dx + dy * dy)
            const ux = -dy / (len || 1)
            const uy = dx / (len || 1)
            const rX = mx + ux * 12
            const rY = my + uy * 12

            const roadblockType = activeRoute.crisis.roadblocks?.[0]?.type || "NH48 BLOCKED"

            return (
              <g key="roadblock">
                {/* Pulsating Warning Icon */}
                <foreignObject x={rX - 8} y={rY - 8} width="16" height="16">
                  <div className="w-full h-full flex items-center justify-center">
                    <AlertTriangle className="w-3.5 h-3.5 text-status-danger animate-pulse" />
                  </div>
                </foreignObject>

                {/* Floating Roadblock Tooltip */}
                <foreignObject x={rX + 8} y={rY - 10} width="130" height="25">
                  <div className="font-mono text-[8px] bg-status-danger text-white px-1.5 py-0.5 rounded shadow border border-status-danger/40 uppercase font-semibold whitespace-nowrap inline-block">
                    {roadblockType}
                  </div>
                </foreignObject>
              </g>
            )
          })()
        )}

        {/* ── CASCADE NODE Amber Rings ── */}
        {cascadeNodes.map((cn) => {
          const coords = nodeCoords[cn.nodeId]
          if (!coords) return null
          return (
            <g key={`cascade-${cn.nodeId}`}>
              <motion.circle
                cx={coords.cx} cy={coords.cy} r="10"
                fill="rgba(245,158,11,0.12)"
                stroke="#F59E0B"
                strokeWidth="1.5"
                animate={{ r: [9, 13, 9], opacity: [0.8, 0.4, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <foreignObject x={coords.cx + 10} y={coords.cy - 8} width="80" height="16">
                <div className="font-mono text-[7px] bg-amber-500 text-white px-1 py-0.5 rounded font-bold uppercase whitespace-nowrap inline-block">
                  CASCADE
                </div>
              </foreignObject>
            </g>
          )
        })}

        {/* ── Interactive Nodes ── */}
        {displayNodes.map((node) => {
          const isNodeCrisis = isCrisis && node.status === 'offline'
          const isHovered = hoveredNodeId === node.id
          const isSelected = selectedNode?.id === node.id

          return (
            <g
              key={node.id}
              className="cursor-pointer group"
              onClick={() => handleNodeClick(node)}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              {/* Outer pulsing ring for hover/selection */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={isHovered || isSelected ? 12 : 8}
                fill={isNodeCrisis ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.1)'}
                className="transition-all duration-300"
              />
              
              {/* Core Node Circle */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r="4.5"
                fill={isNodeCrisis ? '#EF4444' : isSelected ? '#3B82F6' : '#94A3B8'}
                stroke={isSelected ? '#FFFFFF' : 'transparent'}
                strokeWidth="1"
                className="transition-colors duration-300"
              />

              {/* Text label */}
              <text
                x={node.cx}
                y={node.cy}
                dx={node.id === 'bengaluru' || node.id === 'mumbai' || node.id === 'delhi' || node.id === 'pune' ? -10 : 10}
                dy={3}
                textAnchor={node.id === 'bengaluru' || node.id === 'mumbai' || node.id === 'delhi' || node.id === 'pune' ? 'end' : 'start'}
                className={`font-sans text-[8px] font-bold transition-all ${
                  isHovered || isSelected ? 'fill-accent-blue font-black' : 'fill-slate-400'
                }`}
              >
                {node.id.toUpperCase()}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Helper Map Label */}
      <div className="absolute bottom-2 left-2 pointer-events-none font-mono text-[8px] text-slate-400 uppercase">
        Click node circle for telemetry status
      </div>

      {/* ── Slide-Over Telemetry Details Panel ── */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="absolute right-0 top-0 bottom-0 w-[170px] bg-white/95 backdrop-blur border-l border-slate-200 p-3 shadow-2xl z-20 flex flex-col justify-between"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
                <div className="flex items-center gap-1 text-slate-800">
                  <Radio className={`w-3.5 h-3.5 text-accent-blue ${selectedNode.status === 'offline' ? 'text-status-danger animate-pulse' : 'text-accent-blue'}`} />
                  <span className="font-sans font-bold text-[9px] uppercase tracking-wider">{selectedNode.id} Telemetry</span>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 border-0 cursor-pointer bg-transparent"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Status details */}
              <div className="space-y-2 text-[9px]">
                <div>
                  <div className="text-secondary/70 font-sans uppercase text-[7px] tracking-wider">Facility Name</div>
                  <div className="font-sans font-bold text-slate-800 leading-tight">{selectedNode.name}</div>
                </div>

                <div>
                  <div className="text-secondary/70 font-sans uppercase text-[7px] tracking-wider">Operational Status</div>
                  <div className={`font-mono font-bold uppercase flex items-center gap-1 ${
                    selectedNode.status === 'offline' ? 'text-status-danger' : 'text-status-safe'
                  }`}>
                    <Activity className="w-3 h-3" />
                    {selectedNode.status === 'offline' ? 'OFFLINE (CRISIS)' : 'ONLINE'}
                  </div>
                </div>

                <div>
                  <div className="text-secondary/70 font-sans uppercase text-[7px] tracking-wider">Throughput</div>
                  <div className="font-mono text-slate-700">{selectedNode.throughput}</div>
                </div>

                <div>
                  <div className="text-secondary/70 font-sans uppercase text-[7px] tracking-wider">Vulnerability Index</div>
                  <div className="font-mono text-slate-700">{selectedNode.vulnerability}</div>
                </div>

                {selectedNode.temp !== 'N/A' && (
                  <div className="grid grid-cols-2 gap-1 border-t border-slate-100 pt-1.5 mt-1.5">
                    <div>
                      <div className="text-secondary/70 font-sans uppercase text-[7px] tracking-wider">Temp</div>
                      <div className="font-mono text-slate-700">{selectedNode.temp}</div>
                    </div>
                    <div>
                      <div className="text-secondary/70 font-sans uppercase text-[7px] tracking-wider">Humidity</div>
                      <div className="font-mono text-slate-700">{selectedNode.humidity}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Micro Graph / Telemetry Quality Indicator */}
            <div className="border-t border-slate-100 pt-2 space-y-1">
              <div className="flex items-center justify-between text-[7px] font-sans text-secondary/60 uppercase tracking-widest">
                <span>Signal Quality</span>
                <span className="font-mono font-bold text-status-safe">100%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden p-[1px] border border-slate-150">
                <div className="h-full bg-status-safe rounded-full w-[100%]" />
              </div>
              
              <div className="flex items-center gap-1 font-sans text-[8px] text-slate-500 pt-1 leading-tight">
                <ShieldCheck className="w-3 h-3 text-status-safe shrink-0" />
                <span>TLS Secure Node</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}
