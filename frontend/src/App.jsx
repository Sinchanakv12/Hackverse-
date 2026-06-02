import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChaos } from './context/ChaosContext'
import Header from './components/Header'
import NetworkStatusViewer from './components/NetworkStatusViewer'
import FinancialImpactMeter from './components/FinancialImpactMeter'
import ChaosInjector from './components/ChaosInjector'
import AgentConsole from './components/AgentConsole'
import CampaignCard from './components/CampaignCard'
import SimulationWizard from './components/SimulationWizard'
import PredictionAccuracy from './components/PredictionAccuracy'
import LivePredictor from './components/LivePredictor'
import RouteTimeline from './components/RouteTimeline'
import AISuggestionsPanel from './components/AISuggestionsPanel'
import FinancialSandbox from './components/FinancialSandbox'
import CascadeEngine from './components/CascadeEngine'
import ComparisonView from './components/ComparisonView'
import CopilotChat from './components/CopilotChat'
import DynamicTransitMap from './components/DynamicTransitMap'
import LiveFeed from './components/LiveFeed'
import {
  History, X, BarChart3, Database, GitCompare,
  Layers, TrendingUp, Bot
} from 'lucide-react'

export default function App() {
  const {
    supplyChainData,
    fetchError,
    chaosState,
    campaign,
    agentLogs,
    error,
    deployed,
    setDeployed,
    simulationConfig,
    isWizardOpen,
    setIsWizardOpen,
    simulationHistory,
    projectedLoss,
    handleInjectChaos,
    executeSimulation,
    handleAuthorize,
    handleReset,
    isCompareOpen,
    setIsCompareOpen,
    cascadeNodes,
    autoPilotActive,
  } = useChaos()

  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  // ── Loading screen ────────────────────────────────────────────────────
  if (!supplyChainData && !fetchError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-background">
        <div className="text-center space-y-6">
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
          <div className="font-sans font-bold text-status-danger tracking-wider text-sm uppercase">NODE REGISTRY UNREACHABLE</div>
          <div className="font-sans text-xs text-text-secondary leading-relaxed">{fetchError}</div>
          <div className="font-sans text-[11px] text-text-secondary/80 border border-border-subtle p-4 text-left rounded-lg bg-bg-surface">
            <div className="text-accent-blue mb-1 font-semibold">› Ensure the backend is running:</div>
            <div className="font-mono text-[10px] bg-black/40 p-2 rounded mt-1 border border-border-subtle/50">
              <div>cd hack/backend</div>
              <div>npm install && node server.js</div>
            </div>
          </div>
          <button onClick={() => window.location.reload()}
            className="font-sans text-xs border border-accent-blue/30 text-accent-blue px-4 py-2 hover:bg-accent-blue/10 transition-colors rounded-lg font-semibold cursor-pointer">
            ↺ RETRY CONNECTION
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ── Chaos Scenario Builder Modal ─────────────────────────────── */}
      <SimulationWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onInitialize={executeSimulation}
      />

      {/* ── A/B Comparison Drawer ─────────────────────────────────────── */}
      <ComparisonView
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
      />

      {/* ── Simulation History Drawer ─────────────────────────────────── */}
      <AnimatePresence>
        {isHistoryOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={() => setIsHistoryOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l border-slate-200 p-6 z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-accent-blue" />
                  <span className="font-sans font-bold text-sm text-slate-800 tracking-wider">Simulation Archive</span>
                </div>
                <button onClick={() => setIsHistoryOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 border-0 cursor-pointer bg-transparent">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Compare button */}
              {simulationHistory.length >= 2 && (
                <button
                  onClick={() => { setIsHistoryOpen(false); setIsCompareOpen(true) }}
                  className="w-full mb-4 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-violet-200 bg-violet-50 text-violet-700 text-xs font-bold font-sans hover:bg-violet-100 transition-colors cursor-pointer"
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  COMPARE RUNS (A/B Analysis)
                </button>
              )}

              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                {simulationHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                    <Database className="w-8 h-8 mb-3 opacity-30" />
                    <div className="font-sans text-xs font-semibold">No simulation records</div>
                    <div className="font-sans text-[10px] mt-1 opacity-70">Complete an agent intervention to save data here.</div>
                  </div>
                ) : (
                  simulationHistory.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-slate-200 bg-slate-50/50 rounded-lg p-3 space-y-2 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[9px] font-mono">
                        <span className="text-accent-blue font-bold uppercase">{item.vertical}</span>
                        <span className="text-slate-400">{item.timestamp}</span>
                      </div>
                      <div className="font-sans text-[11px] text-slate-600 truncate">{item.configSummary}</div>
                      {/* Flags row */}
                      <div className="flex gap-1.5 flex-wrap">
                        {item.fullData?.autoPilotUsed && (
                          <span className="px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-600 text-[8px] font-bold flex items-center gap-0.5">
                            <Bot className="w-2.5 h-2.5" /> Auto-Pilot
                          </span>
                        )}
                        {item.fullData?.cascadeCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600 text-[8px] font-bold">
                            🌊 {item.fullData.cascadeCount} Cascade
                          </span>
                        )}
                        {item.fullData?.telemetryActive && (
                          <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600 text-[8px] font-bold">📡 GPS</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                        <span className="text-slate-400">Recovery:</span>
                        <span className="font-mono text-status-safe font-bold">+${(item.recoveredRevenue / 1000000).toFixed(2)}M</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Accuracy Score:</span>
                        <span className="font-mono text-status-warning font-bold">{item.accuracyScore}%</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Floating AI Copilot Chat ──────────────────────────────────── */}
      <CopilotChat />

      <div className="min-h-screen flex flex-col bg-slate-50">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <Header chaosState={chaosState} onReset={handleReset} />

        {/* ── Secondary Controls Bar ─────────────────────────────────── */}
        <div className="bg-white border-b border-slate-200 py-3 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
              <BarChart3 className="w-3.5 h-3.5 text-accent-blue" />
              <span>REAL-TIME INTERACTION TERMINAL v4.0</span>
            </div>
            {/* Status chips */}
            {cascadeNodes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-700 font-sans text-[9px] font-bold"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                {cascadeNodes.length} CASCADE ACTIVE
              </motion.div>
            )}
            {autoPilotActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-100 border border-violet-200 text-violet-700 font-sans text-[9px] font-bold"
              >
                <Bot className="w-3 h-3" />
                AUTO-PILOT ENGAGED
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* A/B Compare button */}
            <button
              onClick={() => setIsCompareOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-violet-700 hover:bg-violet-50 hover:border-violet-200 transition-colors rounded-lg text-xs font-semibold cursor-pointer"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>A/B COMPARE</span>
            </button>

            {/* History button */}
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors rounded-lg text-xs font-semibold cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-accent-blue" />
              <span>HISTORY ({simulationHistory.length})</span>
            </button>
          </div>
        </div>

        {/* ── Main Dashboard Grid ─────────────────────────────────────── */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 bg-slate-100/30 p-6">

          {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-6 animate-fade-in">

            {/* Chaos Injector */}
            <ChaosInjector
              chaosState={chaosState}
              onInjectChaos={handleInjectChaos}
              error={error}
              weather={supplyChainData?.nodes?.find((n) => n.id === 'bengaluru')?.weather}
              simulationConfig={simulationConfig}
            />

            {/* Network Status */}
            <NetworkStatusViewer
              chaosState={chaosState}
              nodes={supplyChainData?.nodes ?? []}
              inventory={supplyChainData?.inventory ?? {}}
              transitRoutes={supplyChainData?.transitRoutes ?? []}
              deployed={deployed}
            />

            {/* 🌊 NEW: Cascade Engine — Domino Effect */}
            <CascadeEngine />

            {/* 📡 NEW: Live Data Feed — real-time SSE stream */}
            <LiveFeed />

            {/* AI Suggestions Panel */}
            <AISuggestionsPanel
              chaosState={chaosState}
              simulationConfig={simulationConfig}
              campaign={campaign}
            />
          </div>

          {/* ── RIGHT COLUMN ────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* 🗺 LIVE SCENARIO MAP — always visible at top of right column */}
            <DynamicTransitMap
              chaosState={chaosState}
              transitRoutes={supplyChainData?.transitRoutes ?? []}
              deployed={deployed}
              nodes={supplyChainData?.nodes ?? []}
            />

            {/* Financial Impact Meter */}
            <FinancialImpactMeter
              chaosState={chaosState}
              projectedLoss={projectedLoss}
              recoveredRevenue={campaign?.recoveredRevenue ?? 0}
              campaign={campaign}
            />

            {/* 💸 NEW: Financial Sandbox — live sliders + cost breakdown */}
            <FinancialSandbox />

            {/* Prediction Accuracy + Live Predictor Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <PredictionAccuracy
                accuracyScore={campaign?.accuracyScore}
                accuracyReasoning={campaign?.accuracyReasoning}
                chaosState={chaosState}
              />
              {/* 🤖 UPGRADED: LivePredictor with Auto-Pilot engine */}
              <LivePredictor
                chaosState={chaosState}
                simulationConfig={simulationConfig}
                supplyChainData={supplyChainData}
                campaign={campaign}
              />
            </div>

            {/* Route Timeline */}
            <RouteTimeline
              chaosState={chaosState}
              deployed={deployed}
              simulationConfig={simulationConfig}
              campaign={campaign}
            />

            {/* Agent Console + Campaign Card */}
            <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6">
              <AgentConsole logs={agentLogs} chaosState={chaosState} />
              <CampaignCard
                campaign={campaign}
                chaosState={chaosState}
                deployed={deployed}
                setDeployed={setDeployed}
                onAuthorize={handleAuthorize}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
