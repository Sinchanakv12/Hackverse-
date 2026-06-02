import { motion, AnimatePresence } from 'framer-motion'

const NODES = [
  {
    id: 'bengaluru',
    name: 'Bengaluru Distribution Center',
    region: 'SOUTH INDIA',
    products: ['UltraBook Pro 15" (ENT)'],
    throughput: '12,400 units/day',
    vulnerability: 'HIGH',
    vulnerable: true,
  },
  {
    id: 'mumbai',
    name: 'Mumbai Logistics Hub',
    region: 'WEST INDIA',
    products: ['Creator Pro 14"'],
    throughput: '18,200 units/day',
    vulnerability: 'LOW',
    vulnerable: false,
  },
  {
    id: 'digital',
    name: 'Digital Delivery Network',
    region: 'GLOBAL',
    products: ['CloudDesk Pro License'],
    throughput: 'Unlimited',
    vulnerability: 'MINIMAL',
    vulnerable: false,
  },
  {
    id: 'shenzhen',
    name: 'Shenzhen Manufacturing',
    region: 'CHINA',
    products: ['Upstream Production'],
    throughput: '55,000 units/day',
    vulnerability: 'LOW',
    vulnerable: false,
  },
  {
    id: 'singapore',
    name: 'Singapore Regional HQ',
    region: 'SOUTHEAST ASIA',
    products: ['Coordination'],
    throughput: '—',
    vulnerability: 'MINIMAL',
    vulnerable: false,
  },
]

function NodeRow({ node, isOffline }) {
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
          <span>{node.region}</span>
          <span className="text-[#1a1a2e]">│</span>
          <span>⚡ {node.throughput}</span>
        </div>

        <div className="mt-1 flex flex-wrap gap-1">
          {node.products.map((p) => (
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

      {/* Vulnerability score */}
      <div className={`flex-shrink-0 text-right font-mono text-[10px] ${
        node.vulnerability === 'HIGH' ? 'text-cyber-red' :
        node.vulnerability === 'LOW' ? 'text-cyber-green' : 'text-cyber-gray'
      }`}>
        <div className="text-cyber-gray/40 text-[9px]">RISK</div>
        <div>{node.vulnerability}</div>
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

export default function NetworkStatusViewer({ chaosState }) {
  const bengaluruOffline = chaosState !== 'idle'

  return (
    <div className="panel flex flex-col flex-1">
      {/* Panel header */}
      <div className="panel-header">
        <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan/60" />
        <span>Supply Chain Node Registry</span>
        <div className="flex-1" />
        <span className={bengaluruOffline ? 'text-cyber-red glow-red' : 'text-cyber-green'}>
          {bengaluruOffline ? '4/5 ONLINE' : '5/5 ONLINE'}
        </span>
      </div>

      {/* Node list */}
      <div className="flex-1 overflow-y-auto">
        {NODES.map((node) => (
          <NodeRow
            key={node.id}
            node={node}
            isOffline={node.id === 'bengaluru' && bengaluruOffline}
          />
        ))}
      </div>

      {/* Connection line SVG decoration */}
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
