import { useState, useCallback, useEffect } from 'react'
import Header from './components/Header'
import NetworkStatusViewer from './components/NetworkStatusViewer'
import FinancialImpactMeter from './components/FinancialImpactMeter'
import ChaosInjector from './components/ChaosInjector'
import AgentConsole from './components/AgentConsole'
import CampaignCard from './components/CampaignCard'
import SimulationWizard from './components/SimulationWizard'
import PredictionAccuracy from './components/PredictionAccuracy'

// Chaos state machine: idle → active → resolving → resolved
export default function App() {
  const [supplyChainData, setSupplyChainData] = useState(null)
  const [fetchError, setFetchError] = useState(null)
  const [chaosState, setChaosState] = useState('idle')    // idle | active | resolving | resolved
  const [revenueLoss, setRevenueLoss] = useState(0)
  const [campaign, setCampaign] = useState(null)
  const [agentLogs, setAgentLogs] = useState([])
  const [error, setError] = useState(null)
  const [deployed, setDeployed] = useState(false)
  const [simulationConfig, setSimulationConfig] = useState(null)
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  // Fetch live supply chain state from backend on mount or when simulationConfig changes
  useEffect(() => {
    let url = '/api/supply-chain';
    if (simulationConfig) {
      const params = new URLSearchParams();
      const vertical = simulationConfig.category || simulationConfig.vertical || 'Electronics';
      params.append('vertical', vertical);
      params.append('constraints', JSON.stringify(simulationConfig));
      url += `?${params.toString()}`;
    }
    
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Registry unreachable: HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => setSupplyChainData(data))
      .catch((err) => setFetchError(err.message))
  }, [simulationConfig])

  // Derive projected loss dynamically from backend data
  const projectedLoss =
    supplyChainData?.crisisScenarios?.['bengaluru-flood']?.projectedRevenueLoss ?? 9_000_000

  // Opens the chaos scenario wizard modal
  const handleInjectChaos = useCallback(() => {
    if (chaosState !== 'idle') return
    setIsWizardOpen(true)
  }, [chaosState])

  // Called when the wizard is confirmed — actually runs the simulation
  const executeSimulation = useCallback(async (config) => {
    setSimulationConfig(config)
    setError(null)
    setCampaign(null)
    setAgentLogs([])
    setDeployed(false)
    setChaosState('active')

    // Give the financial meter animation time to start, then fire the API
    setTimeout(async () => {
      setChaosState('resolving')
      try {
        const res = await fetch('/api/resolve-crisis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            crisisNodeId: 'bengaluru',
            scenario: 'bengaluru-flood',
            simulationConfig: config,
          }),
        })
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        const data = await res.json()

        // Stream the agent logs in with staggered delay for terminal effect
        const streamLogs = (logs, idx = 0) => {
          if (idx >= logs.length) {
            setChaosState('resolved')
            setCampaign(data)
            return
          }
          setAgentLogs((prev) => [...prev, logs[idx]])
          setTimeout(() => streamLogs(logs, idx + 1), 80)
        }
        streamLogs(data.agentLogs || [])
      } catch (err) {
        setError(err.message)
        setChaosState('active') // stay in active so user can retry
      }
    }, 1200)
  }, [])

  // Reset everything — only accessible via the header Reset icon
  const handleReset = useCallback(() => {
    setChaosState('idle')
    setRevenueLoss(0)
    setCampaign(null)
    setAgentLogs([])
    setError(null)
    setDeployed(false)
    setSimulationConfig(null)
    setIsWizardOpen(false)
  }, [])

  // ── Loading screen while supply chain data is being fetched ──────────
  if (!supplyChainData && !fetchError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-background">
        <div className="text-center space-y-6">
          {/* Animated logo mark */}
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-2 border-accent-blue/30 rotate-45 animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-2 border border-accent-blue/20 rotate-45 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-accent-blue text-2xl">⚡</span>
            </div>
          </div>

          <div>
            <div className="font-sans text-xs text-text-secondary tracking-[0.4em] mb-3 uppercase font-semibold">
              CHAOS ARCHITECT // Supply Chain Resilience AI
            </div>
            <div className="font-sans text-sm text-accent-blue tracking-widest font-bold">
              ESTABLISHING SECURE CONNECTION TO NODE REGISTRY
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 font-sans text-[10px] text-text-secondary">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
            Contacting backend on port 5000...
          </div>
        </div>
      </div>
    )
  }

  // ── Fetch error screen ────────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-background">
        <div className="text-center space-y-4 max-w-md px-6">
          <div className="text-4xl text-status-danger">⚠</div>
          <div className="font-sans font-bold text-status-danger tracking-wider text-sm uppercase">
            NODE REGISTRY UNREACHABLE
          </div>
          <div className="font-sans text-xs text-text-secondary leading-relaxed">
            {fetchError}
          </div>
          <div className="font-sans text-[11px] text-text-secondary/80 border border-border-subtle p-4 text-left rounded-lg bg-bg-surface">
            <div className="text-accent-blue mb-1 font-semibold">› Ensure the backend is running:</div>
            <div className="font-mono text-[10px] bg-black/40 p-2 rounded mt-1 border border-border-subtle/50">
              <div>cd hack/backend</div>
              <div>npm install && node server.js</div>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="font-sans text-xs border border-accent-blue/30 text-accent-blue px-4 py-2 hover:bg-accent-blue/10 transition-colors rounded-lg font-semibold cursor-pointer"
          >
            ↺ RETRY CONNECTION
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ── Chaos Scenario Builder Modal ────────────────────────────── */}
      <SimulationWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onInitialize={executeSimulation}
      />

      <div className="min-h-screen flex flex-col">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <Header chaosState={chaosState} onReset={handleReset} />

        {/* ── Main Dashboard Grid ─────────────────────────────────────── */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 bg-[#09090b] p-6">

          {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Chaos Injector */}
            <ChaosInjector
              chaosState={chaosState}
              onInjectChaos={handleInjectChaos}
              error={error}
              weather={supplyChainData?.nodes?.find((n) => n.id === 'bengaluru')?.weather}
              simulationConfig={simulationConfig}
            />
            {/* Network Status — receives live nodes + inventory from backend */}
            <NetworkStatusViewer
              chaosState={chaosState}
              nodes={supplyChainData?.nodes ?? []}
              inventory={supplyChainData?.inventory ?? {}}
              transitRoutes={supplyChainData?.transitRoutes ?? []}
              deployed={deployed}
            />
          </div>

          {/* ── RIGHT COLUMN ────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Financial Impact Meter — uses dynamic projectedLoss from backend */}
            <FinancialImpactMeter
              chaosState={chaosState}
              projectedLoss={projectedLoss}
              recoveredRevenue={campaign?.recoveredRevenue ?? 0}
            />

            {/* Prediction Accuracy Gauge */}
            <PredictionAccuracy
              accuracyScore={campaign?.accuracyScore}
              accuracyReasoning={campaign?.accuracyReasoning}
              chaosState={chaosState}
            />

            {/* Bottom row: Agent Console + Campaign Card */}
            <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6">
              <AgentConsole logs={agentLogs} chaosState={chaosState} />
              <CampaignCard campaign={campaign} chaosState={chaosState} deployed={deployed} setDeployed={setDeployed} />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
