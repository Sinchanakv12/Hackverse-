import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { scenarios } from '../scenariosData'

const ChaosContext = createContext()

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'https://hackverse-production-9017.up.railway.app').replace(/\/$/, '')

// ─── Cascade adjacency map ───────────────────────────────────────────────────
// When a node fails, these are the secondary nodes that cascade
const CASCADE_MAP = {
  bengaluru: ['chennai', 'hyderabad'],
  mumbai:    ['pune', 'delhi'],
  delhi:     ['mumbai', 'kolkata'],
  chennai:   ['bengaluru', 'hyderabad'],
  hyderabad: ['bengaluru', 'chennai'],
  kolkata:   ['delhi', 'shenzhen'],
  pune:      ['mumbai', 'bengaluru'],
  shenzhen:  ['singapore', 'kolkata'],
  singapore: ['shenzhen', 'mumbai'],
}

const CASCADE_SCENARIOS = [
  { label: 'Power Grid Brownout',   risk: 55, icon: '⚡', type: 'Mechanical/Safety'     },
  { label: 'Logistics Bottleneck',  risk: 40, icon: '🚚', type: 'Supply Chain Shock'    },
  { label: 'Staff Strike',          risk: 50, icon: '✊', type: 'Geopolitical/Labor'    },
  { label: 'Cyber Intrusion Alert', risk: 65, icon: '🔐', type: 'Cyber/Technical'       },
  { label: 'Flood Waters Rising',   risk: 72, icon: '🌊', type: 'Natural Disasters'     },
  { label: 'Air Traffic Hold',      risk: 60, icon: '✈️',  type: 'Air Transport'         },
]

export function ChaosProvider({ children }) {
  const [supplyChainData, setSupplyChainData] = useState(null)
  const [fetchError, setFetchError]           = useState(null)
  const [chaosState, setChaosState]           = useState('idle')
  const [revenueLoss, setRevenueLoss]         = useState(0)
  const [campaign, setCampaign]               = useState(null)
  const [agentLogs, setAgentLogs]             = useState([])
  const [error, setError]                     = useState(null)
  const [deployed, setDeployed]               = useState(false)
  const [simulationConfig, setSimulationConfig] = useState(null)
  const [isWizardOpen, setIsWizardOpen]       = useState(false)

  // Simulation History & ROI Sandboxing
  const [simulationHistory, setSimulationHistory] = useState([])
  const [sandboxDiscount, setSandboxDiscount]     = useState(8)

  // ─── NEW: Financial Sandbox Levers ──────────────────────────────────
  const [productMargin, setProductMargin]   = useState(28)    // %
  const [penaltyRate, setPenaltyRate]       = useState(15)    // $/hr
  const [insurancePct, setInsurancePct]     = useState(40)    // % covered
  const [emergencyBudget, setEmergencyBudget] = useState(500000) // $

  // ─── NEW: Auto-Pilot ────────────────────────────────────────────────
  const [autoPilotMode, setAutoPilotMode]   = useState(false)
  const [autoPilotLog, setAutoPilotLog]     = useState([])
  const [autoPilotActive, setAutoPilotActive] = useState(false)
  const autoPilotRef = useRef(false)

  // ─── NEW: Cascade Engine ────────────────────────────────────────────
  const [cascadeNodes, setCascadeNodes]     = useState([])   // [{nodeId, label, risk, icon, type, triggeredAt}]
  const [cascadeActive, setCascadeActive]   = useState(false)
  const cascadeTimerRef = useRef(null)

  // ─── NEW: A/B Comparison ────────────────────────────────────────────
  const [compareRunA, setCompareRunA]       = useState(null)
  const [compareRunB, setCompareRunB]       = useState(null)
  const [isCompareOpen, setIsCompareOpen]   = useState(false)

  // Sync state data on config changes
  useEffect(() => {
    let url = `${API_BASE}/api/supply-chain`
    if (simulationConfig) {
      const params = new URLSearchParams()
      const vertical = simulationConfig.category || simulationConfig.vertical || 'Electronics'
      params.append('vertical', vertical)
      params.append('constraints', JSON.stringify(simulationConfig))
      url += `?${params.toString()}`
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Registry unreachable: HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => setSupplyChainData(data))
      .catch((err) => setFetchError(err.message))
  }, [simulationConfig])

  // Derive projected loss dynamically
  const activeScenarioKey = Object.keys(supplyChainData?.crisisScenarios || {})[0]
  const projectedLoss =
    supplyChainData?.crisisScenarios?.[activeScenarioKey]?.projectedRevenueLoss ?? 9000000

  // ─── Cascade Engine Trigger ─────────────────────────────────────────
  const triggerCascade = useCallback((primaryNodeId) => {
    if (!primaryNodeId) return
    const neighbors = CASCADE_MAP[primaryNodeId] || []
    if (!neighbors.length) return

    setCascadeActive(true)
    const triggered = []

    neighbors.forEach((nodeId, idx) => {
      const scenario = CASCADE_SCENARIOS[Math.floor(Math.random() * CASCADE_SCENARIOS.length)]
      cascadeTimerRef.current = setTimeout(() => {
        const node = {
          nodeId,
          label: scenario.label,
          risk: scenario.risk + Math.floor(Math.random() * 15),
          icon: scenario.icon,
          type: scenario.type,
          triggeredAt: new Date().toLocaleTimeString()
        }
        triggered.push(node)
        setCascadeNodes(prev => [...prev, node])
      }, (idx + 1) * 2800)
    })
  }, [])

  // ─── Auto-Pilot Engine ──────────────────────────────────────────────
  const activateAutoPilot = useCallback(async (overallRisk, mitigations, toggleMitigation) => {
    if (autoPilotRef.current) return
    autoPilotRef.current = true
    setAutoPilotActive(true)
    setAutoPilotLog([])

    const pushLog = (msg, delay = 0) => new Promise(res => setTimeout(() => {
      setAutoPilotLog(prev => [...prev, { msg, ts: new Date().toLocaleTimeString(), delay }])
      res()
    }, delay))

    await pushLog('⚡ AUTO-PILOT ENGAGED — Risk threshold breached at ' + overallRisk + '%', 0)
    await pushLog('🔍 SCAN: Analyzing all active threat vectors...', 600)
    await pushLog('📡 TELEMETRY: Cross-referencing live sensor data with risk model...', 1400)

    // Step 1 — Met/Air mitigation
    await pushLog('🌀 ACTION: Activating Wind/Current Stabilization protocol...', 2200)
    if (!mitigations.stabilizeCurrents) toggleMitigation('stabilizeCurrents')
    await pushLog('✅ CONFIRM: Air current shear override ACTIVE. Met risk reduced.', 2800)

    // Step 2 — Route/Customs
    await pushLog('🚀 ACTION: Pre-clearing customs manifests across all transit gateways...', 3600)
    if (!mitigations.preClearCustoms) toggleMitigation('preClearCustoms')
    await pushLog('✅ CONFIRM: Digital customs signatures pushed. Route congestion relief expected.', 4200)

    // Step 3 — Cargo cold chain
    await pushLog('🧊 ACTION: Pre-cooling emergency cold-chain storage chambers...', 5000)
    if (!mitigations.preLoadColdChambers) toggleMitigation('preLoadColdChambers')
    await pushLog('✅ CONFIRM: Cold chambers pre-cooled. Cargo thermal degradation halted.', 5600)

    // Step 4 — Power backup
    await pushLog('⚡ ACTION: Synchronizing backup microgrid to facility power bus...', 6400)
    if (!mitigations.backupPowerGrid) toggleMitigation('backupPowerGrid')
    await pushLog('✅ CONFIRM: Microgrid synchronized. Blackout probability dropped to <5%.', 7000)

    await pushLog('🏁 AUTO-PILOT COMPLETE — All mitigation protocols deployed successfully.', 7800)
    await pushLog('📊 Net risk reduction: ' + Math.round(overallRisk * 0.65) + '% → System stabilizing...', 8400)
  }, [])

  const handleInjectChaos = useCallback(() => {
    if (chaosState !== 'idle') return
    setIsWizardOpen(true)
  }, [chaosState])

  // Executes the simulation using SSE or fallback fetch
  const executeSimulation = useCallback(async (config) => {
    setSimulationConfig(config)
    setError(null)
    setCampaign(null)
    setAgentLogs([])
    setDeployed(false)
    setChaosState('active')
    setSandboxDiscount(8)
    setCascadeNodes([])
    setCascadeActive(false)
    setAutoPilotLog([])
    autoPilotRef.current = false
    setAutoPilotActive(false)

    const activeScenario = scenarios.find(s => s.id === config.scenario) || scenarios[0]
    const crisisNodeId   = activeScenario.affectedNodeId || 'bengaluru'
    const scenarioId     = activeScenario.id

    // Trigger cascade after 4 seconds
    setTimeout(() => triggerCascade(crisisNodeId), 4000)

    setTimeout(async () => {
      setChaosState('resolving')

      try {
        const url = `${API_BASE}/api/resolve-crisis/stream?crisisNodeId=${crisisNodeId}&scenario=${scenarioId}&config=${encodeURIComponent(JSON.stringify(config))}`
        const eventSource = new EventSource(url)

        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data)
          if (data.type === 'log') {
            setAgentLogs((prev) => [...prev, data.message])
          } else if (data.type === 'complete') {
            setCampaign(data.result)
            setChaosState('awaiting_auth')
            eventSource.close()
          } else if (data.type === 'error') {
            setError(data.message)
            setChaosState('active')
            eventSource.close()
          }
        }

        eventSource.onerror = (err) => {
          console.warn('SSE stream error. Falling back to HTTP POST.', err)
          eventSource.close()
          fallbackPost(config, crisisNodeId, scenarioId)
        }
      } catch (err) {
        fallbackPost(config, crisisNodeId, scenarioId)
      }
    }, 1200)
  }, [triggerCascade])

  const fallbackPost = async (config, crisisNodeId, scenarioId) => {
    try {
      const res = await fetch(`${API_BASE}/api/resolve-crisis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crisisNodeId: crisisNodeId || 'bengaluru',
          scenario: scenarioId || 'bengaluru-flood',
          simulationConfig: config,
        }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()

      const streamLogs = (logs, idx = 0) => {
        if (idx >= logs.length) {
          setChaosState('awaiting_auth')
          setCampaign(data)
          return
        }
        setAgentLogs((prev) => [...prev, logs[idx]])
        setTimeout(() => streamLogs(logs, idx + 1), 80)
      }
      streamLogs(data.agentLogs || [])
    } catch (err) {
      setError(err.message)
      setChaosState('active')
    }
  }

  const handleAuthorize = useCallback(() => {
    setChaosState('resolved')
    setDeployed(true)

    if (campaign) {
      const runHistoryItem = {
        timestamp: new Date().toLocaleTimeString(),
        vertical: simulationConfig?.category || 'Electronics',
        configSummary: `${simulationConfig?.vehicleType || 'Dry Van'} | GPS: ${simulationConfig?.telemetryActive ? 'On' : 'Off'}`,
        recoveredRevenue: campaign?.recoveredRevenue ?? 0,
        accuracyScore: campaign?.accuracyScore ?? 0,
        discount: sandboxDiscount,
        // Full run data for A/B comparison
        fullData: {
          scenario: simulationConfig?.scenario,
          vehicleType: simulationConfig?.vehicleType,
          telemetryActive: simulationConfig?.telemetryActive,
          totalLoss: campaign?.totalLoss ?? 0,
          netLoss: campaign?.netLoss ?? 0,
          recoveredRevenue: campaign?.recoveredRevenue ?? 0,
          accuracyScore: campaign?.accuracyScore ?? 0,
          routeStandard: campaign?.routePathways?.standard?.duration,
          routeBypass: campaign?.routePathways?.bypass?.duration,
          cascadeCount: cascadeNodes.length,
          autoPilotUsed: autoPilotActive,
          productMargin,
          penaltyRate,
          insurancePct,
          emergencyBudget,
        }
      }
      setSimulationHistory((prev) => [runHistoryItem, ...prev])
    }
  }, [campaign, simulationConfig, sandboxDiscount, cascadeNodes.length, autoPilotActive, productMargin, penaltyRate, insurancePct, emergencyBudget])

  const handleReset = useCallback(() => {
    setChaosState('idle')
    setRevenueLoss(0)
    setCampaign(null)
    setAgentLogs([])
    setError(null)
    setDeployed(false)
    setSimulationConfig(null)
    setIsWizardOpen(false)
    setCascadeNodes([])
    setCascadeActive(false)
    setAutoPilotLog([])
    autoPilotRef.current = false
    setAutoPilotActive(false)
    if (cascadeTimerRef.current) clearTimeout(cascadeTimerRef.current)
  }, [])

  // ─── Copilot command parser ──────────────────────────────────────────
  const parseCopilotCommand = useCallback((text) => {
    const lower = text.toLowerCase()
    const result = { type: 'unknown', response: '', action: null }

    // Trigger simulation commands
    const nodeKeywords = {
      bengaluru: ['bengaluru', 'bangalore', 'blr'],
      mumbai:    ['mumbai', 'bombay'],
      delhi:     ['delhi', 'ncr'],
      chennai:   ['chennai', 'madras'],
      hyderabad: ['hyderabad', 'hyd'],
      kolkata:   ['kolkata', 'calcutta'],
      shenzhen:  ['shenzhen', 'china'],
      singapore: ['singapore', 'sgp'],
    }
    const scenarioKeywords = {
      cyber:    ['cyber', 'hack', 'ransomware', 'malware', 'attack', 'breach'],
      flood:    ['flood', 'monsoon', 'rain', 'water'],
      fire:     ['fire', 'blaze', 'inferno', 'burn'],
      strike:   ['strike', 'labor', 'worker', 'protest', 'union'],
      quake:    ['earthquake', 'quake', 'seismic', 'tremor'],
      power:    ['power', 'blackout', 'outage', 'grid'],
    }

    let detectedNode = null
    let detectedScenario = null

    for (const [nodeId, keywords] of Object.entries(nodeKeywords)) {
      if (keywords.some(k => lower.includes(k))) { detectedNode = nodeId; break }
    }
    for (const [scenarioType, keywords] of Object.entries(scenarioKeywords)) {
      if (keywords.some(k => lower.includes(k))) { detectedScenario = scenarioType; break }
    }

    // Find matching scenario from data
    let matchedScenario = null
    if (detectedNode || detectedScenario) {
      matchedScenario = scenarios.find(s => {
        const nodeMatch = detectedNode ? s.affectedNodeId === detectedNode : true
        const catMatch = detectedScenario
          ? (detectedScenario === 'cyber' && s.category === 'Cyber/Technical') ||
            (detectedScenario === 'flood' && s.title?.toLowerCase().includes('flood')) ||
            (detectedScenario === 'fire'  && s.title?.toLowerCase().includes('fire')) ||
            (detectedScenario === 'strike' && s.category === 'Geopolitical/Labor') ||
            (detectedScenario === 'quake' && s.title?.toLowerCase().includes('earthquake')) ||
            (detectedScenario === 'power' && (s.category === 'Mechanical/Safety' || s.title?.toLowerCase().includes('power')))
          : true
        return nodeMatch && catMatch
      }) || scenarios.find(s => detectedNode ? s.affectedNodeId === detectedNode : false)
    }

    // Status queries
    if (lower.includes('status') || lower.includes('how many') || lower.includes('current')) {
      result.type = 'info'
      result.response = chaosState === 'idle'
        ? '🟢 All systems nominal. Supply chain operating at full capacity. No active crises detected.'
        : `🔴 Active crisis: ${simulationConfig?.scenario || 'Unknown'}. State: ${chaosState.toUpperCase()}. ${cascadeNodes.length} cascade node(s) affected.`
      return result
    }

    // Risk query
    if (lower.includes('risk') || lower.includes('threat')) {
      result.type = 'info'
      result.response = `📊 Current threat matrix: Cyber=${chaosState !== 'idle' ? 'ELEVATED' : 'LOW'}, Met=${chaosState !== 'idle' ? 'MODERATE' : 'LOW'}, Logistics=${cascadeNodes.length > 0 ? 'HIGH' : 'NOMINAL'}. ${autoPilotActive ? '🤖 Auto-Pilot is actively managing mitigations.' : ''}`
      return result
    }

    // Reset command
    if (lower.includes('reset') || lower.includes('clear') || lower.includes('stop')) {
      result.type = 'action'
      result.response = '🔄 Resetting all systems to nominal state. Clearing active crisis data...'
      result.action = 'reset'
      return result
    }

    // Autopilot command
    if (lower.includes('auto') || lower.includes('pilot') || lower.includes('autopilot')) {
      result.type = 'action'
      result.response = '🤖 Auto-Pilot mode enabled. Risk thresholds being monitored. Will engage automatically if risk exceeds 85%.'
      result.action = 'autopilot'
      return result
    }

    // Scenario injection
    if (matchedScenario) {
      result.type = 'simulate'
      result.response = `⚡ Understood. Queuing simulation: "${matchedScenario.title}" at ${matchedScenario.affectedNodeId.toUpperCase()}. Opening Chaos Wizard...`
      result.action = 'simulate'
      result.scenario = matchedScenario
      return result
    }

    // Simulate generic
    if (lower.includes('simulat') || lower.includes('inject') || lower.includes('trigger')) {
      result.type = 'action'
      result.response = '🔬 Opening Chaos Scenario Builder. Please select parameters in the wizard.'
      result.action = 'wizard'
      return result
    }

    // Help
    if (lower.includes('help') || lower.includes('what can') || lower.includes('commands')) {
      result.type = 'info'
      result.response = `🛠 Available commands:\n• "Simulate cyber attack at Bengaluru"\n• "What if Mumbai floods?"\n• "Status / current risk?"\n• "Reset all systems"\n• "Enable auto-pilot"\n• "What happens if Delhi loses power?"`
      return result
    }

    result.type = 'info'
    result.response = `🤔 I didn't recognize that command. Try: "Simulate a flood at Chennai" or "Status" or "Help" for a command list.`
    return result
  }, [chaosState, simulationConfig, cascadeNodes, autoPilotActive])

  return (
    <ChaosContext.Provider
      value={{
        supplyChainData,
        fetchError,
        chaosState,
        setChaosState,
        revenueLoss,
        campaign,
        setCampaign,
        agentLogs,
        setAgentLogs,
        error,
        deployed,
        setDeployed,
        simulationConfig,
        isWizardOpen,
        setIsWizardOpen,
        simulationHistory,
        sandboxDiscount,
        setSandboxDiscount,
        projectedLoss,
        // Financial sandbox
        productMargin, setProductMargin,
        penaltyRate, setPenaltyRate,
        insurancePct, setInsurancePct,
        emergencyBudget, setEmergencyBudget,
        // Auto-pilot
        autoPilotMode, setAutoPilotMode,
        autoPilotLog,
        autoPilotActive,
        activateAutoPilot,
        // Cascade engine
        cascadeNodes,
        cascadeActive,
        // A/B comparison
        compareRunA, setCompareRunA,
        compareRunB, setCompareRunB,
        isCompareOpen, setIsCompareOpen,
        // Copilot
        parseCopilotCommand,
        handleInjectChaos,
        executeSimulation,
        handleAuthorize,
        handleReset,
      }}
    >
      {children}
    </ChaosContext.Provider>
  )
}

export function useChaos() {
  const context = useContext(ChaosContext)
  if (!context) throw new Error('useChaos must be used within a ChaosProvider')
  return context
}
