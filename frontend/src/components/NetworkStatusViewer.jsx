import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

// Map the backend's numeric vulnerabilityScore (0–1) to a display label + color
function getRiskLabel(score) {
  if (score >= 0.7)  return { label: 'HIGH',    color: 'text-status-danger' }
  if (score >= 0.3)  return { label: 'MEDIUM',  color: 'text-status-warning' }
  if (score >= 0.1)  return { label: 'LOW',     color: 'text-status-safe' }
  return               { label: 'MINIMAL', color: 'text-secondary' }
}

// Resolve product IDs (e.g. "product-a") to short display names via inventory
function resolveProductNames(productIds, inventory) {
  if (!inventory || !productIds?.length) return []
  return productIds.map((id) => {
    const item = inventory[id]
    if (!item) return id
    // Trim to a concise display label
    return item.name.replace(' (Enterprise Edition)', ' (ENT)')
                    .replace(' (High-Margin Alternative)', '')
                    .replace(' — 1-Year License', ' License')
  })
}

function NodeRow({ node, isOffline, inventory }) {
  const risk = getRiskLabel(node.vulnerabilityScore ?? 0)
  const productNames = resolveProductNames(node.products, inventory)
  return (
    <motion.div
      layout
      className={`relative flex items-start gap-3 p-3 border-b border-border-subtle last:border-b-0 transition-colors duration-500 ${
        isOffline ? 'bg-status-danger/5' : 'hover:bg-slate-50'
      }`}
    >
      {/* Status indicator */}
      <div className="mt-1 flex-shrink-0">
        {isOffline ? (
          <div className="w-2.5 h-2.5 rounded-full bg-status-danger animate-pulse" />
        ) : (
          <div className="w-2.5 h-2.5 rounded-full bg-status-safe" />
        )}
      </div>

      {/* Node info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-sans text-xs font-bold truncate ${isOffline ? 'text-status-danger' : 'text-primary'}`}>
            {node.name}
          </span>
          {isOffline && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-shrink-0 px-1.5 py-0.5 bg-status-danger/20 border border-status-danger/30 rounded-md text-[9px] font-sans font-bold text-status-danger tracking-wider"
            >
              OFFLINE
            </motion.span>
          )}
        </div>

        <div className="flex items-center gap-2 font-sans text-[10px] text-secondary">
          <span>{node.region?.toUpperCase()}</span>
          <span className="text-subtle">│</span>
          <span>⚡ {node.throughput}</span>
        </div>

        {node.weather && (
          <div className="mt-1 font-sans text-[9px] text-secondary/80 flex flex-wrap items-center gap-1.5">
            <span>☁ {isOffline ? node.weather.crisis.condition : node.weather.normal.condition}</span>
            <span className="text-subtle">|</span>
            <span>🌡 {isOffline ? node.weather.crisis.temp : node.weather.normal.temp}</span>
            <span className="text-subtle">|</span>
            <span>💨 {isOffline ? node.weather.crisis.wind : node.weather.normal.wind}</span>
          </div>
        )}
        {node.weather && isOffline && node.weather.crisis.alert && (
          <div className="mt-1 font-sans text-[9px] text-status-danger font-semibold animate-pulse">
            ⚠ {node.weather.crisis.alert}
          </div>
        )}

        <div className="mt-2 flex flex-wrap gap-1.5">
          {(productNames.length ? productNames : ['—']).map((p) => (
            <span
              key={p}
              className={`px-2 py-0.5 rounded-md text-[9px] font-sans font-medium border ${
                isOffline
                  ? 'bg-status-danger/10 border-status-danger/20 text-status-danger/80'
                  : 'bg-accent-blue/5 border-accent-blue/15 text-accent-blue/70'
              }`}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Risk label derived from vulnerabilityScore */}
      <div className={`flex-shrink-0 text-right font-sans text-[10px] ${risk.color} font-bold`}>
        <div className="text-secondary/60 text-[9px] font-semibold">RISK</div>
        <div>{risk.label}</div>
      </div>

      {/* Offline overlay pulse */}
      {isOffline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.06, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-status-danger pointer-events-none rounded"
        />
      )}
    </motion.div>
  )
}

export default function NetworkStatusViewer({ chaosState, nodes, inventory, transitRoutes, deployed }) {
  const bengaluruOffline = chaosState !== 'idle'
  const route = transitRoutes?.find((r) => r.id === 'route-blr-mum')

  return (
    <div className="panel flex flex-col flex-1">
      {/* Panel header */}
      <div className="panel-header">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-blue/60" />
        <span>Supply Chain Node Registry</span>
        <div className="flex-1" />
        <span className={bengaluruOffline ? 'text-status-danger' : 'text-status-safe'}>
          {bengaluruOffline ? `${nodes.length - 1}/${nodes.length} ONLINE` : `${nodes.length}/${nodes.length} ONLINE`}
        </span>
      </div>

      {/* ── MAP CONTAINER ── */}
      <div className="relative h-56 border-b border-subtle bg-[#F8FAFC] overflow-hidden shrink-0">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          {/* Normal routes */}
          <line x1="85" y1="25" x2="75" y2="75" stroke="#CBD5E1" strokeWidth="0.5" />
          <line x1="75" y1="75" x2="25" y2="55" stroke="#CBD5E1" strokeWidth="0.5" />

          {/* BOM -> BLR Route */}
          <motion.line
            x1="25"
            y1="55"
            x2="35"
            y2="80"
            stroke={bengaluruOffline ? '#ef4444' : '#CBD5E1'}
            strokeWidth={bengaluruOffline ? '0.8' : '0.5'}
            strokeDasharray={bengaluruOffline ? '2 2' : 'none'}
            animate={bengaluruOffline ? { strokeDashoffset: [0, -10] } : {}}
            transition={{ repeat: Infinity, ease: "linear", duration: 2 }}
          />

          {/* Resolved Route BOM -> CLOUD */}
          <AnimatePresence>
            {chaosState === 'resolved' && (
              <motion.path
                d="M 25 55 L 50 15"
                fill="none"
                stroke="#10b981"
                strokeWidth="0.8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>

          {/* Nodes */}
          {/* SZX (85,25) */}
          <circle cx="85" cy="25" r="2" className="fill-status-safe" />
          <text x="85" y="25" dx="3" dy="1" className="font-sans text-[3px] font-bold fill-[#64748B]">SZX</text>

          {/* CLOUD (50,15) */}
          <circle cx="50" cy="15" r="2" className="fill-status-safe" />
          <text x="50" y="15" dx="-8" dy="-1" className="font-sans text-[3px] font-bold fill-[#64748B]">CLOUD</text>

          {/* BOM (25,55) */}
          <circle cx="25" cy="55" r="2" className="fill-status-safe" />
          <text x="25" y="55" dx="-8" dy="1" className="font-sans text-[3px] font-bold fill-[#64748B]">BOM</text>

          {/* SGP (75,75) */}
          <circle cx="75" cy="75" r="2" className="fill-status-safe" />
          <text x="75" y="75" dx="3" dy="1" className="font-sans text-[3px] font-bold fill-[#64748B]">SGP</text>

          {/* BLR (35,80) */}
          <motion.circle
            cx="35"
            cy="80"
            r="2"
            animate={bengaluruOffline ? { fill: '#ef4444' } : { fill: '#10b981' }}
            transition={{ duration: 0.5 }}
          />
          {bengaluruOffline && (
            <motion.circle
              cx="35"
              cy="80"
              animate={{ r: [2, 6], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              fill="none"
              stroke="#ef4444"
              strokeWidth="0.5"
            />
          )}
          <text x="35" y="80" dx="-8" dy="1" className="font-sans text-[3px] font-bold fill-[#64748B]">BLR</text>

          {/* Roadblock overlay */}
          {bengaluruOffline && (
            <foreignObject x="30" y="67.5" width="40" height="20" style={{ overflow: 'visible' }}>
              <div className="flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center gap-1 bg-status-danger text-white text-[5px] font-mono font-bold px-1 py-0.5 rounded shadow-lg border border-status-danger/40 uppercase tracking-wider animate-pulse">
                  <AlertTriangle className="w-1.5 h-1.5 shrink-0" />
                  <span>NH48 FLOODED</span>
                </div>
              </div>
            </foreignObject>
          )}
        </svg>
      </div>

      {/* Node list — rendered from live backend data */}
      <div className="flex-1 overflow-y-auto">
        {nodes.map((node) => (
          <NodeRow
            key={node.id}
            node={node}
            inventory={inventory}
            isOffline={node.id === 'bengaluru' && bengaluruOffline}
          />
        ))}
      </div>

      {/* Connection status footer */}
      <div className="panel-header border-t border-b-0 border-border-subtle mt-auto flex flex-col gap-1 items-start">
        <span className="font-sans text-[10px] font-semibold tracking-wide text-secondary">
          {bengaluruOffline
            ? '⚠ REROUTING: Mumbai → Singapore → Clients'
            : '✓ All nodes nominal — Mesh topology active'}
        </span>
        {route && (
          <span className="font-sans text-[9px] text-secondary/60 normal-case tracking-normal">
            🛣 Route {route.source.toUpperCase()}–{route.target.toUpperCase()} ({route.type}):{' '}
            <span className={bengaluruOffline ? 'text-status-danger font-semibold' : 'text-status-safe font-semibold'}>
              {bengaluruOffline ? `${route.crisis.trafficIndex} (${route.crisis.delay} delay)` : `${route.normal.trafficIndex}`}
            </span>
            {bengaluruOffline && route.crisis.roadblocks?.[0] && (
              <span className="text-status-danger/80"> — 🚧 roadblock: {route.crisis.roadblocks[0].type} ({route.crisis.roadblocks[0].location})</span>
            )}
          </span>
        )}
      </div>
    </div>
  )
}
