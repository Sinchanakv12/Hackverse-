import { useState, useCallback } from 'react'
import Header from './components/Header'
import NetworkStatusViewer from './components/NetworkStatusViewer'
import FinancialImpactMeter from './components/FinancialImpactMeter'
import ChaosInjector from './components/ChaosInjector'
import AgentConsole from './components/AgentConsole'
import CampaignCard from './components/CampaignCard'

const PROJECTED_LOSS = 9_000_000

// Chaos state machine: idle → active → resolving → resolved
export default function App() {
  const [chaosState, setChaosState] = useState('idle')    // idle | active | resolving | resolved
  const [revenueLoss, setRevenueLoss] = useState(0)
  const [campaign, setCampaign] = useState(null)
  const [agentLogs, setAgentLogs] = useState([])
  const [error, setError] = useState(null)

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

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <Header chaosState={chaosState} onReset={handleReset} />

      {/* ── Main Dashboard Grid ───────────────────────────────────────── */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-px bg-[#1a1a2e] p-px">

        {/* ── LEFT COLUMN ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-px bg-[#1a1a2e]">
          {/* Chaos Injector */}
          <ChaosInjector
            chaosState={chaosState}
            onInjectChaos={handleInjectChaos}
            error={error}
          />
          {/* Network Status */}
          <NetworkStatusViewer chaosState={chaosState} />
        </div>

        {/* ── RIGHT COLUMN ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-px bg-[#1a1a2e]">
          {/* Financial Impact Meter */}
          <FinancialImpactMeter
            chaosState={chaosState}
            projectedLoss={PROJECTED_LOSS}
            recoveredRevenue={campaign?.recoveredRevenue ?? 0}
          />

          {/* Bottom row: Agent Console + Campaign Card */}
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-px bg-[#1a1a2e]">
            <AgentConsole logs={agentLogs} chaosState={chaosState} />
            <CampaignCard campaign={campaign} chaosState={chaosState} />
          </div>
        </div>
      </main>
    </div>
  )
}
