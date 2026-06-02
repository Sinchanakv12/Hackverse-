import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

export default function DynamicTransitMap({ chaosState, transitRoutes, deployed }) {
  const isCrisis = chaosState !== 'idle'
  
  // Find route route-blr-mum
  const blrMumRoute = transitRoutes?.find((r) => r.id === 'route-blr-mum')
  const hasRoadblock = isCrisis && blrMumRoute?.crisis?.roadblocks?.length > 0

  // Coordinates mapped on a standard 400x200 viewBox for responsive aspect ratio
  // SZX: (340, 50)
  // CLOUD: (200, 30)
  // BOM: (100, 90)
  // BLR: (140, 150)
  // SGP: (300, 160)

  // Mid-point of BOM (100, 90) -> BLR (140, 150) with Q 105 120
  // t=0.5: mx = 112.5, my = 120
  const roadblockX = 112.5
  const roadblockY = 120

  return (
    <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern id="map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="1" />
        </pattern>
        <filter id="glow-safe" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#map-grid)" />

      {/* ── Shipping & Logistics Lanes (Curved Paths) ── */}

      {/* Shenzhen (SZX) ➔ Singapore (SGP) */}
      <path
        d="M 340 50 Q 330 105 300 160"
        fill="none"
        stroke="#27272a"
        strokeWidth="1.5"
      />

      {/* Singapore (SGP) ➔ Mumbai (BOM) */}
      <path
        d="M 300 160 Q 200 135 100 90"
        fill="none"
        stroke="#27272a"
        strokeWidth="1.5"
      />

      {/* Mumbai (BOM) ➔ Bengaluru (BLR) - Ground Freight Route */}
      <motion.path
        d="M 100 90 Q 105 120 140 150"
        fill="none"
        strokeWidth="2"
        animate={{
          stroke: isCrisis ? '#f59e0b' : '#27272a',
          strokeDasharray: isCrisis ? '4 4' : '0',
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Agentic Reroute Lane (BOM ➔ CLOUD) — Activated on campaign deployment */}
      <AnimatePresence>
        {deployed && (
          <motion.path
            d="M 100 90 Q 140 55 200 30"
            fill="none"
            stroke="#10b981"
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
      {hasRoadblock && (
        <g>
          {/* Pulsating Warning Icon */}
          <foreignObject x={roadblockX - 10} y={roadblockY - 10} width="20" height="20">
            <div className="w-full h-full flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-status-danger animate-pulse" />
            </div>
          </foreignObject>

          {/* Floating Roadblock Tooltip */}
          <foreignObject x={roadblockX + 12} y={roadblockY - 12} width="165" height="35">
            <div className="font-mono text-[9px] bg-status-danger text-white px-2 py-0.5 rounded shadow-lg border border-status-danger/40 uppercase font-semibold whitespace-nowrap inline-block">
              NH48 CLOSED - +48H DELAY
            </div>
          </foreignObject>
        </g>
      )}

      {/* ── Nodes Circles & Labels ── */}

      {/* Shenzhen (SZX) */}
      <circle cx="340" cy="50" r="4" fill="#3b82f6" />
      <circle cx="340" cy="50" r="8" fill="rgba(59, 130, 246, 0.15)" />
      <text x="340" y="50" dx={10} dy={3} textAnchor="start" className="font-sans text-[9px] font-bold fill-[#a1a1aa]">SZX</text>

      {/* Digital Delivery / Cloud (CLOUD) */}
      <circle cx="200" cy="30" r="4" fill="#3b82f6" />
      <circle cx="200" cy="30" r="8" fill="rgba(59, 130, 246, 0.15)" />
      <text x="200" y="30" dx={0} dy={-10} textAnchor="middle" className="font-sans text-[9px] font-bold fill-[#a1a1aa]">CLOUD</text>

      {/* Mumbai (BOM) */}
      <circle cx="100" cy="90" r="4" fill="#3b82f6" />
      <circle cx="100" cy="90" r="8" fill="rgba(59, 130, 246, 0.15)" />
      <text x="100" y="90" dx={-10} dy={3} textAnchor="end" className="font-sans text-[9px] font-bold fill-[#a1a1aa]">BOM</text>

      {/* Singapore (SGP) */}
      <circle cx="300" cy="160" r="4" fill="#3b82f6" />
      <circle cx="300" cy="160" r="8" fill="rgba(59, 130, 246, 0.15)" />
      <text x="300" y="160" dx={10} dy={3} textAnchor="start" className="font-sans text-[9px] font-bold fill-[#a1a1aa]">SGP</text>

      {/* Bengaluru (BLR) */}
      <motion.circle
        cx="140"
        cy="150"
        r="4"
        animate={{
          fill: isCrisis ? '#ef4444' : '#3b82f6',
        }}
        transition={{ duration: 0.5 }}
      />
      <AnimatePresence mode="popLayout">
        {!isCrisis ? (
          <motion.circle
            key="blr-glow-idle"
            cx="140"
            cy="150"
            r="8"
            fill="rgba(59, 130, 246, 0.15)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        ) : (
          <g key="blr-glow-active">
            <motion.circle
              cx="140"
              cy="150"
              r="8"
              fill="rgba(239, 68, 68, 0.25)"
            />
            <motion.circle
              cx="140"
              cy="150"
              animate={{ r: [6, 18], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              fill="none"
              stroke="#ef4444"
              strokeWidth="1.5"
            />
          </g>
        )}
      </AnimatePresence>
      <text x="140" y="150" dx={-10} dy={3} textAnchor="end" className="font-sans text-[9px] font-bold fill-[#a1a1aa]">BLR</text>
    </svg>
  )
}
