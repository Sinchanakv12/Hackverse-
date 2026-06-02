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
