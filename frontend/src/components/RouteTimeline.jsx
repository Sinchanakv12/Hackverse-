import { motion } from 'framer-motion'
import { MapPin, AlertTriangle, Navigation, Clock, CheckCircle2 } from 'lucide-react'

export default function RouteTimeline({ chaosState, deployed, simulationConfig, campaign }) {
  const isIdle = chaosState === 'idle'
  const isResolving = chaosState === 'resolving' || chaosState === 'active'
  const isAwaitingAuth = chaosState === 'awaiting_auth'
  const isResolved = chaosState === 'resolved' || deployed

  // Parse vehicle details
  const vehicle = simulationConfig?.vehicleType || 'Dry Van (Standard)'
  const hasTelemetry = simulationConfig?.telemetryActive !== false

  // Dynamic Speed and Base Time calculations
  let speed = 60 // km/h
  if (vehicle.includes('Reefer')) speed = 50
  else if (vehicle.includes('Hazmat')) speed = 45
  else if (vehicle.includes('Armored')) speed = 40

  const baseDistance = 980 // km from Mumbai to Bengaluru
  const baseTransitTime = Math.round(baseDistance / speed) // e.g. 16 to 24 hrs
  
  // Rerouting and roadblock status
  const roadblockDelay = 48 // hours
  const bypassOverhead = hasTelemetry ? 4 : 12 // extra hours for air/cloud redirect

  // Timeline points & graph parameters
  let startHour = 0
  let roadblockHour = 24 // roadblock hit hour (hypothetical)
  
  // Calculate ETA depending on the current state
  let etaHours = baseTransitTime
  let routeStatus = 'Optimal path active'
  let activeBypass = false

  if (isResolving || isAwaitingAuth) {
    // Roadblock is active, but bypass not yet authorized
    etaHours = baseTransitTime + roadblockDelay
    routeStatus = 'Standard route blocked. Substantial delay active.'
  } else if (isResolved) {
    // Alternate bypass route is now active
    etaHours = baseTransitTime + bypassOverhead
    routeStatus = `Bypass route active. Saved ${roadblockHour + roadblockDelay - etaHours} hrs.`
    activeBypass = true
  }

  // Generate points for the SVG latency graph
  // X: Time (0 to 80 hours), Y: Latency (0 to 100 representing risk/congestion index)
  let graphPoints = []
  if (isIdle) {
    graphPoints = [
      { x: 0, y: 10, label: 'Start (0h)' },
      { x: baseTransitTime * 0.5, y: 15, label: 'En-route' },
      { x: baseTransitTime, y: 10, label: 'Dest' }
    ]
  } else if (isResolving || isAwaitingAuth) {
    graphPoints = [
      { x: 0, y: 10, label: 'Start' },
      { x: 12, y: 20, label: 'Normal' },
      { x: 24, y: 90, label: 'Roadblock (24h)' },
      { x: 48, y: 85, label: 'Gridlock' },
      { x: etaHours, y: 15, label: 'Delayed Dest' }
    ]
  } else {
    // Resolved - Bypass path
    graphPoints = [
      { x: 0, y: 10, label: 'Start' },
      { x: 12, y: 20, label: 'Normal' },
      { x: 20, y: 40, label: 'Reroute' },
      { x: 30, y: 25, label: 'Air Bypass' },
      { x: etaHours, y: 10, label: 'Bypass Dest' }
    ]
  }

  // Convert points to SVG polyline string format (width=100, height=50)
  const maxX = Math.max(...graphPoints.map(p => p.x)) || 1
  const maxY = 100
  const svgPoints = graphPoints
    .map(p => `${(p.x / maxX) * 90 + 5},${50 - (p.y / maxY) * 35}`)
    .join(' ')

  return (
    <div className="panel overflow-hidden" style={{ background: 'radial-gradient(circle at 50% 30%, #F8FAFC 0%, #FFFFFF 100%)' }}>
      <div className="panel-header border-b border-border-subtle">
        <div className={`w-1.5 h-1.5 rounded-full ${isIdle ? 'bg-secondary' : isResolved ? 'bg-status-safe animate-pulse' : 'bg-status-danger animate-pulse'}`} />
        <span>Transit Timeline & Route Interventions</span>
        <div className="flex-1" />
        <span className="text-[10px] font-sans font-bold text-secondary">
          {isIdle ? 'STANDBY' : isResolved ? 'BYPASS ACTIVE' : 'DISRUPTED'}
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Dynamic Route Info Summary */}
        <div className="flex justify-between items-center text-xs">
          <div>
            <div className="text-[9px] font-sans text-secondary/60 uppercase tracking-widest">Selected Transport Profile</div>
            <div className="font-sans font-bold text-slate-800 mt-0.5">{vehicle}</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] font-sans text-secondary/60 uppercase tracking-widest">Adjusted Transit ETA</div>
            <div className="font-mono font-bold text-accent-blue text-sm flex items-center justify-end gap-1">
              <Clock className="w-3.5 h-3.5" />
              {isIdle ? `${baseTransitTime} hrs` : `${etaHours} hrs`}
            </div>
          </div>
        </div>

        {/* ── Sleek Horizontal Milestone Stepper ── */}
        <div className="relative pt-3 pb-5 px-2">
          {/* Horizontal line connector */}
          <div className="absolute top-[28px] left-[5%] right-[5%] h-0.5 bg-slate-200">
            {/* Active bypass pathway */}
            {isResolved && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.2 }}
                className="h-full bg-status-safe shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              />
            )}
            {/* Gridlock pathway */}
            {(isResolving || isAwaitingAuth) && (
              <div className="h-full w-[60%] bg-status-danger" />
            )}
          </div>

          {/* Stepper milestones */}
          <div className="relative flex justify-between">
            {/* Milestone 1: Start (Mumbai Log Hub) */}
            <div className="flex flex-col items-center w-20 text-center">
              <div className="w-7 h-7 rounded-full bg-accent-blue/15 border border-accent-blue flex items-center justify-center z-10 bg-white">
                <MapPin className="w-3.5 h-3.5 text-accent-blue" />
              </div>
              <div className="font-sans font-bold text-[10px] text-slate-700 mt-1.5 leading-tight">Mumbai Hub</div>
              <div className="font-mono text-[9px] text-secondary/70">Hour 0</div>
            </div>

            {/* Milestone 2: Obstacle (NH48 Highway roadblock) */}
            <div className="flex flex-col items-center w-24 text-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 bg-white border ${
                isIdle ? 'border-slate-350 bg-slate-50' : 
                isResolved ? 'border-status-safe bg-status-safe/10 text-status-safe' : 
                'border-status-danger bg-status-danger/10 text-status-danger'
              }`}>
                {isResolved ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className={`w-3.5 h-3.5 ${isIdle ? 'text-slate-400' : 'text-status-danger animate-bounce'}`} />
                )}
              </div>
              <div className="font-sans font-bold text-[10px] text-slate-700 mt-1.5 leading-tight">NH48 Obstacle</div>
              <div className="font-mono text-[9px] text-secondary/70">
                {isIdle ? 'Standby' : isResolved ? 'Bypassed' : 'Block (+48h)'}
              </div>
            </div>

            {/* Milestone 3: Alternate Bypass (Aerial/Cloud Redirect) */}
            <div className="flex flex-col items-center w-24 text-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 bg-white border ${
                activeBypass ? 'border-status-safe bg-status-safe/25 text-status-safe shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 
                isIdle ? 'border-slate-200 bg-slate-50 text-slate-300' : 'border-slate-300 bg-white text-slate-400'
              }`}>
                <Navigation className="w-3.5 h-3.5" />
              </div>
              <div className="font-sans font-bold text-[10px] text-slate-700 mt-1.5 leading-tight">Air Redirect</div>
              <div className="font-mono text-[9px] text-secondary/70">
                {activeBypass ? 'Bypass Active' : 'Alternate'}
              </div>
            </div>

            {/* Milestone 4: Destination (Bengaluru Client) */}
            <div className="flex flex-col items-center w-20 text-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 bg-white border ${
                isResolved ? 'border-accent-blue bg-accent-blue/10 text-accent-blue' : 'border-slate-200 bg-slate-50 text-slate-300'
              }`}>
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="font-sans font-bold text-[10px] text-slate-700 mt-1.5 leading-tight">Bengaluru</div>
              <div className="font-mono text-[9px] text-secondary/70">
                {isIdle ? `~${baseTransitTime}h` : `ETA: ${etaHours}h`}
              </div>
            </div>
          </div>
        </div>

        {/* ── Timeline SVG Latency Curve Graph ── */}
        <div className="border border-slate-200 bg-slate-50/50 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-sans font-semibold text-[10px] text-secondary/70 uppercase tracking-widest">
              Real-Time Route Latency Graph (Hour vs Risk/Delay Index)
            </span>
            <span className="font-sans text-[9px] text-accent-blue font-bold uppercase">
              {isIdle ? 'Normal Curve' : isResolved ? 'Bypass Recovery Curve' : 'Crisis Delay Curve'}
            </span>
          </div>

          <div className="relative h-20 w-full bg-white border border-slate-100 rounded flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
              {/* Reference Grid lines */}
              <line x1="0" y1="12.5" x2="100" y2="12.5" stroke="#F1F5F9" strokeWidth="0.5" strokeDasharray="1 1" />
              <line x1="0" y1="25" x2="100" y2="25" stroke="#E2E8F0" strokeWidth="0.5" />
              <line x1="0" y1="37.5" x2="100" y2="37.5" stroke="#F1F5F9" strokeWidth="0.5" strokeDasharray="1 1" />

              {/* Congestion curve */}
              <motion.polyline
                fill="none"
                stroke={isIdle ? '#3B82F6' : isResolved ? '#10B981' : '#EF4444'}
                strokeWidth="1.5"
                points={svgPoints}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
              />

              {/* Data points */}
              {graphPoints.map((pt, idx) => {
                const cx = (pt.x / maxX) * 90 + 5
                const cy = 50 - (pt.y / maxY) * 35
                return (
                  <g key={idx}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="1.5"
                      fill={isIdle ? '#3B82F6' : isResolved ? '#10B981' : '#EF4444'}
                    />
                  </g>
                )
              })}
            </svg>

            {/* Tooltip or state note */}
            <div className="absolute bottom-1 right-2 font-mono text-[8px] text-slate-400">
              Max Time: {maxX} hrs | Max Risk: {isIdle ? 'Low' : isResolved ? 'Medium' : 'Critical'}
            </div>
          </div>
          
          <div className="font-mono text-[9px] text-slate-500 leading-normal flex items-start gap-1.5">
            <span className="text-accent-blue font-bold">›</span>
            <span>{routeStatus}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
