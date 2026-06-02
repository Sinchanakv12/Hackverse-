import { useState, useCallback, useEffect } from 'react'
import Header from './components/Header'
import NetworkStatusViewer from './components/NetworkStatusViewer'
import FinancialImpactMeter from './components/FinancialImpactMeter'
import ChaosInjector from './components/ChaosInjector'
import AgentConsole from './components/AgentConsole'
import CampaignCard from './components/CampaignCard'



// Chaos state machine: idle → active → resolving → resolved
export default function App() {
  const [supplyChainData, setSupplyChainData] = useState(null)
  const [fetchError, setFetchError] = useState(null)
  const [chaosState, setChaosState] = useState('idle')    // idle | active | resolving | resolved
  const [revenueLoss, setRevenueLoss] = useState(0)
  const [campaign, setCampaign] = useState(null)
  const [agentLogs, setAgentLogs] = useState([])
  const [error, setError] = useState(null)

  // Fetch live supply chain state from backend on mount
  useEffect(() => {
    fetch('/api/supply-chain')
      .then((res) => {
        if (!res.ok) throw new Error(`Registry unreachable: HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => setSupplyChainData(data))
      .catch((err) => setFetchError(err.message))
  }, [])

  // Derive projected loss dynamically from backend data
  const projectedLoss =
    supplyChainData?.crisisScenarios?.['bengaluru-flood']?.projectedRevenueLoss ?? 9_000_000

  // Called when chaos button is clicked
  const handleInjectChaos = useCallback(async () => {
    if (chaosState !== 'idle') return

    setError(null)
    setCampaign(null)
    setAgentLogs([])
    setChaosState('active')

    // Give the financial meter animation time to start, then fire the API
    setTimeout(async () => {
      setChaosState('resolving')
      try {
        const res = await fetch('/api/resolve-crisis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ crisisNodeId: 'bengaluru', scenario: 'bengaluru-flood' }),
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
  }, [chaosState])

  // Reset everything — only accessible via the header Reset icon
  const handleReset = useCallback(() => {
    setChaosState('idle')
    setRevenueLoss(0)
    setCampaign(null)
    setAgentLogs([])
    setError(null)
  }, [])

  // ── Loading screen while supply chain data is being fetched ──────────
  if (!supplyChainData && !fetchError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cyber-black">
        <div className="text-center space-y-6">
          {/* Animated logo mark */}
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-2 border-cyber-cyan/30 rotate-45 animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-2 border border-cyber-cyan/20 rotate-45 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-cyber-cyan text-2xl glow-cyan">⚡</span>
            </div>
          </div>

          <div>
            <div className="font-mono text-xs text-cyber-gray tracking-[0.4em] mb-3 uppercase">
              CHAOS ARCHITECT // Supply Chain Resilience AI
            </div>
            <div className="font-mono text-sm text-cyber-cyan glow-cyan tracking-widest terminal-cursor">
              ESTABLISHING SECURE CONNECTION TO NODE REGISTRY
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 font-mono text-[10px] text-cyber-gray/50">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
            Contacting backend on port 5000...
          </div>
        </div>
      </div>
    )
  }

  // ── Fetch error screen ────────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cyber-black">
        <div className="text-center space-y-4 max-w-md px-6">
          <div className="text-4xl">⚠</div>
          <div className="font-mono font-bold text-cyber-red glow-red tracking-widest">
            NODE REGISTRY UNREACHABLE
          </div>
          <div className="font-mono text-xs text-cyber-gray leading-relaxed">
            {fetchError}
          </div>
          <div className="font-mono text-[11px] text-cyber-gray/50 border border-[#1a1a2e] p-3 text-left">
            <div className="text-cyber-cyan/60 mb-1">› Ensure the backend is running:</div>
            <div>cd hack/backend</div>
            <div>npm install && node server.js</div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="font-mono text-xs border border-cyber-cyan/30 text-cyber-cyan px-4 py-2 hover:bg-cyber-cyan/10 transition-colors"
          >
            ↺ RETRY CONNECTION
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <Header chaosState={chaosState} onReset={handleReset} />

      {/* ── Main Dashboard Grid ───────────────────────────────────────── */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 bg-[#09090b] p-6">

        {/* ── LEFT COLUMN ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* Chaos Injector */}
          <ChaosInjector
            chaosState={chaosState}
            onInjectChaos={handleInjectChaos}
            error={error}
          />
          {/* Network Status — receives live nodes + inventory from backend */}
          <NetworkStatusViewer
            chaosState={chaosState}
            nodes={supplyChainData.nodes}
            inventory={supplyChainData.inventory}
          />
        </div>

        {/* ── RIGHT COLUMN ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* Financial Impact Meter — uses dynamic projectedLoss from backend */}
          <FinancialImpactMeter
            chaosState={chaosState}
            projectedLoss={projectedLoss}
            recoveredRevenue={campaign?.recoveredRevenue ?? 0}
          />

          {/* Bottom row: Agent Console + Campaign Card */}
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AgentConsole logs={agentLogs} chaosState={chaosState} />
            <CampaignCard campaign={campaign} chaosState={chaosState} />
          </div>
        </div>
      </main>
    </div>
  )
}
