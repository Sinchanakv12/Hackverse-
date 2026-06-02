import { motion, AnimatePresence } from 'framer-motion'

// Map the backend's numeric vulnerabilityScore (0–1) to a display label + color
function getRiskLabel(score) {
  if (score >= 0.7)  return { label: 'HIGH',    color: 'text-cyber-red' }
  if (score >= 0.3)  return { label: 'MEDIUM',  color: 'text-cyber-yellow' }
  if (score >= 0.1)  return { label: 'LOW',     color: 'text-cyber-green' }
  return               { label: 'MINIMAL', color: 'text-cyber-gray' }
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
      className={`relative flex items-start gap-3 p-3 border-b border-[#1a1a2e] last:border-b-0 transition-colors duration-500 ${
        isOffline ? 'bg-cyber-red/5' : 'hover:bg-white/[0.02]'
      }`}
    >
      {/* Status indicator */}
      <div className="mt-1 flex-shrink-0">
        {isOffline ? (
          <div className="w-2.5 h-2.5 rounded-full bg-cyber-red animate-pulseRed" />
        ) : (
          <div className="w-2.5 h-2.5 rounded-full bg-cyber-green"
            style={{ boxShadow: '0 0 6px rgba(57,255,20,0.6)' }} />
        )}
      </div>

      {/* Node info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-mono text-xs font-semibold truncate ${isOffline ? 'text-cyber-red glow-red' : 'text-white'}`}>
            {node.name}
          </span>
          {isOffline && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-shrink-0 px-1.5 py-0.5 bg-cyber-red/20 border border-cyber-red/40 rounded text-[9px] font-mono text-cyber-red tracking-wider"
            >
              OFFLINE
            </motion.span>
          )}
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] text-cyber-gray">
          <span>{node.region?.toUpperCase()}</span>
          <span className="text-[#1a1a2e]">│</span>
          <span>⚡ {node.throughput}</span>
        </div>

        <div className="mt-1 flex flex-wrap gap-1">
          {(productNames.length ? productNames : ['—']).map((p) => (
            <span
              key={p}
              className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${
                isOffline
                  ? 'bg-cyber-red/10 border-cyber-red/20 text-cyber-red/80'
                  : 'bg-cyber-cyan/5 border-cyber-cyan/15 text-cyber-cyan/70'
              }`}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Risk label derived from vulnerabilityScore */}
      <div className={`flex-shrink-0 text-right font-mono text-[10px] ${risk.color}`}>
        <div className="text-cyber-gray/40 text-[9px]">RISK</div>
        <div>{risk.label}</div>
      </div>

      {/* Offline overlay pulse */}
      {isOffline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.06, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-cyber-red pointer-events-none rounded"
        />
      )}
    </motion.div>
  )
}

export default function NetworkStatusViewer({ chaosState, nodes, inventory }) {
  const bengaluruOffline = chaosState !== 'idle'

  return (
    <div className="panel flex flex-col flex-1">
      {/* Panel header */}
      <div className="panel-header">
        <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan/60" />
        <span>Supply Chain Node Registry</span>
        <div className="flex-1" />
        <span className={bengaluruOffline ? 'text-cyber-red glow-red' : 'text-cyber-green'}>
          {bengaluruOffline ? `${nodes.length - 1}/${nodes.length} ONLINE` : `${nodes.length}/${nodes.length} ONLINE`}
        </span>
      </div>

      {/* ── MAP CONTAINER ── */}
      <div className="relative h-48 border-b border-[#1a1a2e] bg-[rgba(5,5,8,0.4)] overflow-hidden">
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <pattern id="map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0, 245, 255, 0.018)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#map-grid)" />

          {/* Connections (Shenzhen → Singapore, Singapore → Mumbai) */}
          <line
            x1="85%" y1="25%"
            x2="75%" y2="80%"
            stroke="rgba(0,245,255,0.2)"
            strokeWidth="1.5"
          />
          <line
            x1="75%" y1="80%"
            x2="25%" y2="45%"
            stroke="rgba(0,245,255,0.2)"
            strokeWidth="1.5"
          />

          {/* Connection (Mumbai → Bengaluru) - dynamic based on chaosState */}
          <motion.line
            x1="25%" y1="45%"
            x2="35%" y2="75%"
            strokeWidth="1.5"
            animate={{
              stroke: chaosState === 'idle' ? 'rgba(0,245,255,0.2)' : 'rgba(255,45,85,0.8)',
              strokeDasharray: chaosState === 'idle' ? '0' : '4 4',
              opacity: chaosState === 'idle' ? 1 : 0.4,
            }}
            transition={{ duration: 0.5 }}
          />

          {/* Rerouted Connection (Mumbai → Digital Delivery / Cloud) - Active during crisis only */}
          <AnimatePresence>
            {chaosState !== 'idle' && (
              <motion.line
                x1="25%" y1="45%"
                x2="50%" y2="15%"
                stroke="rgba(57,255,20,0.8)"
                strokeWidth="2.5"
                strokeDasharray="6 4"
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
                  strokeDashoffset: { repeat: Infinity, ease: "linear", duration: 1 }
                }}
              />
            )}
          </AnimatePresence>

          {/* Nodes Circles & Glowing Rings */}
          {/* Shenzhen (SZX) */}
          <circle cx="85%" cy="25%" r="4" fill="#00f5ff" />
          <circle cx="85%" cy="25%" r="8" fill="rgba(0, 245, 255, 0.15)" />

          {/* Digital Delivery / Cloud (CLOUD) */}
          <circle cx="50%" cy="15%" r="4" fill="#00f5ff" />
          <circle cx="50%" cy="15%" r="8" fill="rgba(0, 245, 255, 0.15)" />

          {/* Mumbai (BOM) */}
          <circle cx="25%" cy="45%" r="4" fill="#00f5ff" />
          <circle cx="25%" cy="45%" r="8" fill="rgba(0, 245, 255, 0.15)" />

          {/* Singapore (SGP) */}
          <circle cx="75%" cy="80%" r="4" fill="#00f5ff" />
          <circle cx="75%" cy="80%" r="8" fill="rgba(0, 245, 255, 0.15)" />

          {/* Bengaluru (BLR) - Disrupted Node */}
          <motion.circle
            cx="35%"
            cy="75%"
            r="4"
            animate={{
              fill: chaosState === 'idle' ? '#00f5ff' : '#ff2d55',
            }}
            transition={{ duration: 0.5 }}
          />
          <AnimatePresence mode="popLayout">
            {chaosState === 'idle' ? (
              <motion.circle
                key="blr-glow-idle"
                cx="35%"
                cy="75%"
                r="8"
                fill="rgba(0, 245, 255, 0.15)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            ) : (
              <g key="blr-glow-active">
                <motion.circle
                  cx="35%"
                  cy="75%"
                  r="8"
                  fill="rgba(255, 45, 85, 0.25)"
                />
                <motion.circle
                  cx="35%"
                  cy="75%"
                  animate={{ r: [6, 18], opacity: [0.6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                  fill="none"
                  stroke="#ff2d55"
                  strokeWidth="1.5"
                />
              </g>
            )}
          </AnimatePresence>

          {/* Node Labels */}
          <text x="85%" y="25%" dx={10} dy={3} textAnchor="start" className="font-mono text-[9px]" fill="#8892a4">SZX</text>
          <text x="50%" y="15%" dx={0} dy={-10} textAnchor="middle" className="font-mono text-[9px]" fill="#8892a4">CLOUD</text>
          <text x="25%" y="45%" dx={-10} dy={3} textAnchor="end" className="font-mono text-[9px]" fill="#8892a4">BOM</text>
          <text x="35%" y="75%" dx={-10} dy={3} textAnchor="end" className="font-mono text-[9px]" fill="#8892a4">BLR</text>
          <text x="75%" y="80%" dx={10} dy={3} textAnchor="start" className="font-mono text-[9px]" fill="#8892a4">SGP</text>
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
      <div className="panel-header border-t border-b-0 border-[#1a1a2e] mt-auto">
        <span className="text-[10px]">
          {bengaluruOffline
            ? '⚠ REROUTING: Mumbai → Singapore → Clients'
            : '✓ All nodes nominal — Mesh topology active'}
        </span>
      </div>
    </div>
  )
}
