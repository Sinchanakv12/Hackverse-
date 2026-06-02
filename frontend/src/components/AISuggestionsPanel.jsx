import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Navigation, CalendarClock, Truck, BadgePercent,
  ShieldCheck, Package, Zap, X, ChevronRight, Check, RefreshCw
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// Suggestion Engine — generates context-aware AI suggestions
// ─────────────────────────────────────────────────────────────
function buildSuggestions(chaosState, simulationConfig, campaign) {
  const isIdle = chaosState === 'idle'
  const isActive = chaosState === 'active' || chaosState === 'resolving'
  const isAwaitingAuth = chaosState === 'awaiting_auth'
  const isResolved = chaosState === 'resolved'

  const vehicle = simulationConfig?.vehicleType || 'Dry Van (Standard)'
  const hasGPS = simulationConfig?.telemetryActive !== false
  const vertical = simulationConfig?.category || 'Electronics'

  const today = new Date()
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)
  const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 3)
  const fmt = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

  const all = [
    // ── Always-present general suggestions ──
    {
      id: 'idle-route-audit',
      show: isIdle,
      priority: 'low',
      type: 'ROUTING',
      icon: Navigation,
      iconColor: 'text-accent-blue',
      iconBg: 'bg-blue-50 border-blue-100',
      title: 'Pre-emptive Route Audit',
      description: `NH48 monsoon season forecast shows 62% flood risk in the next 7 days. Pre-book alternate coastal highway corridor now to lock in lower spot rates.`,
      action: 'Pre-book Route',
      actionStyle: 'border-accent-blue/30 text-accent-blue hover:bg-accent-blue/5',
    },
    {
      id: 'idle-gps',
      show: isIdle,
      priority: 'medium',
      type: 'TELEMETRY',
      icon: Zap,
      iconColor: 'text-status-warning',
      iconBg: 'bg-amber-50 border-amber-100',
      title: 'Enable Live GPS Telemetry',
      description: `Fleet tracking is currently set to passive polling. Switching to real-time GPS reduces delay detection latency by 83% and improves rerouting accuracy.`,
      action: 'Enable Telemetry',
      actionStyle: 'border-amber-300 text-amber-700 hover:bg-amber-50',
    },

    // ── Crisis / Active state suggestions ──
    {
      id: 'crisis-date-shift',
      show: isActive || isAwaitingAuth,
      priority: 'critical',
      type: 'SCHEDULING',
      icon: CalendarClock,
      iconColor: 'text-status-danger',
      iconBg: 'bg-red-50 border-red-100',
      title: `Shift Delivery Date: ${fmt(today)} → ${fmt(dayAfter)}`,
      description: `Bengaluru DC is offline with a +48h delay. Rescheduling delivery from ${fmt(today)} to ${fmt(dayAfter)} avoids SLA penalty triggers and aligns with expected flood clearance window.`,
      action: 'Apply Date Shift',
      actionStyle: 'border-status-danger/30 text-status-danger hover:bg-red-50',
      badge: 'Saves $450K in SLA penalties',
    },
    {
      id: 'crisis-reroute',
      show: isActive || isAwaitingAuth,
      priority: 'critical',
      type: 'REROUTING',
      icon: Navigation,
      iconColor: 'text-accent-blue',
      iconBg: 'bg-blue-50 border-blue-100',
      title: 'Activate Mumbai → Cloud Bypass Corridor',
      description: `Dijkstra solver identified a 4-hour overhead bypass via Mumbai Hub → Digital Delivery Network, saving 44 hours vs. the NH48 gridlock route.`,
      action: 'Activate Bypass',
      actionStyle: 'border-accent-blue/30 text-accent-blue hover:bg-blue-50',
      badge: 'Saves 44 hrs',
    },
    {
      id: 'crisis-carrier',
      show: isActive || isAwaitingAuth,
      priority: 'high',
      type: 'CARRIER',
      icon: Truck,
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-50 border-violet-100',
      title: vehicle.includes('Dry Van') ? 'Upgrade to Reefer Carrier' : 'Switch to Air Freight Express',
      description: vehicle.includes('Dry Van')
        ? `Your ${vertical} cargo requires temperature-controlled transport. Reefer upgrade eliminates 35% confidence penalty and prevents spoilage.`
        : `Air freight express carrier reduces transit time from ${vehicle.includes('Armored') ? '24' : '20'} hrs to 6 hrs. Recommended for time-critical payloads.`,
      action: 'Upgrade Carrier',
      actionStyle: 'border-violet-300 text-violet-700 hover:bg-violet-50',
    },
    {
      id: 'crisis-bundle',
      show: isActive || isAwaitingAuth,
      priority: 'high',
      type: 'BUNDLE',
      icon: Package,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border-emerald-100',
      title: 'Deploy Emergency Bundle to At-Risk Clients',
      description: `AI detected 3,200 units of substitute stock in Mumbai. Dispatching the emergency bundle now secures $${((3200 * 800) / 1000000).toFixed(1)}M in recaptured revenue before competitors respond.`,
      action: 'Deploy Bundle',
      actionStyle: 'border-emerald-300 text-emerald-700 hover:bg-emerald-50',
      badge: 'Revenue Opportunity',
    },
    {
      id: 'crisis-gps',
      show: (isActive || isAwaitingAuth) && !hasGPS,
      priority: 'medium',
      type: 'TELEMETRY',
      icon: Zap,
      iconColor: 'text-status-warning',
      iconBg: 'bg-amber-50 border-amber-100',
      title: 'Enable GPS — Active Crisis Detected',
      description: `GPS telemetry is currently OFF. During active crisis conditions, blind routing increases delay probability by 12% and reduces Dijkstra path accuracy.`,
      action: 'Enable Now',
      actionStyle: 'border-amber-300 text-amber-700 hover:bg-amber-50',
    },

    // ── Post-resolution suggestions ──
    {
      id: 'resolved-discount',
      show: isResolved,
      priority: 'high',
      type: 'PRICING',
      icon: BadgePercent,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border-emerald-100',
      title: 'Increase Bundle Discount to 18% for High-Volume Clients',
      description: `Demand elasticity model predicts a +24% volume response at 18% discount, recovering an additional $${((campaign?.recoveredRevenue || 3000000) * 0.12 / 1000000).toFixed(2)}M in the next 48 hours from priority enterprise accounts.`,
      action: 'Apply Discount',
      actionStyle: 'border-emerald-300 text-emerald-700 hover:bg-emerald-50',
      badge: '+$' + ((campaign?.recoveredRevenue || 3000000) * 0.12 / 1000000).toFixed(2) + 'M potential',
    },
    {
      id: 'resolved-date-forward',
      show: isResolved,
      priority: 'medium',
      type: 'SCHEDULING',
      icon: CalendarClock,
      iconColor: 'text-accent-blue',
      iconBg: 'bg-blue-50 border-blue-100',
      title: `Schedule Follow-Up Delivery: ${fmt(tomorrow)}`,
      description: `Bypass corridor is now active. Booking a follow-up delivery slot for ${fmt(tomorrow)} at Mumbai Hub ensures continuous supply for affected B2B clients without additional routing delay.`,
      action: 'Schedule Delivery',
      actionStyle: 'border-accent-blue/30 text-accent-blue hover:bg-blue-50',
    },
    {
      id: 'resolved-insurance',
      show: isResolved,
      priority: 'low',
      type: 'RISK',
      icon: ShieldCheck,
      iconColor: 'text-slate-600',
      iconBg: 'bg-slate-50 border-slate-200',
      title: 'Enable Monsoon Season Flood Insurance Policy',
      description: `Post-incident analysis: Bengaluru DC sits in a Zone-A flood risk region. Activating a parametric flood insurance policy at ₹2.4L/month offsets up to 80% of future disruption losses.`,
      action: 'View Policy',
      actionStyle: 'border-slate-300 text-slate-600 hover:bg-slate-50',
    },
  ]

  return all.filter((s) => s.show)
}

// ─────────────────────────────────────────────────────────────
// Priority Badge
// ─────────────────────────────────────────────────────────────
const priorityStyles = {
  critical: 'bg-red-50 border-red-200 text-red-700',
  high:     'bg-amber-50 border-amber-200 text-amber-700',
  medium:   'bg-blue-50 border-blue-200 text-blue-700',
  low:      'bg-slate-50 border-slate-200 text-slate-500',
}

// ─────────────────────────────────────────────────────────────
// Single Suggestion Card
// ─────────────────────────────────────────────────────────────
function SuggestionCard({ suggestion, onDismiss, onApply, applied }) {
  const Icon = suggestion.icon
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className={`relative border rounded-xl p-3.5 space-y-2.5 transition-all duration-200 ${
        applied
          ? 'border-status-safe/40 bg-emerald-50/50'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      {/* Type badge + Dismiss */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-1.5 py-0.5 border rounded text-[8px] font-sans font-bold uppercase tracking-wider ${priorityStyles[suggestion.priority]}`}>
            {suggestion.type}
          </span>
          {suggestion.badge && (
            <span className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded text-[8px] font-sans font-semibold">
              {suggestion.badge}
            </span>
          )}
        </div>
        <button
          onClick={() => onDismiss(suggestion.id)}
          className="p-0.5 rounded hover:bg-slate-100 text-slate-300 hover:text-slate-500 border-0 cursor-pointer bg-transparent transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Icon + Title + Description */}
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${suggestion.iconBg}`}>
          <Icon className={`w-4 h-4 ${suggestion.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-sans font-bold text-[11px] text-slate-800 leading-tight mb-1">
            {suggestion.title}
          </div>
          <div className="font-sans text-[10px] text-slate-500 leading-relaxed">
            {suggestion.description}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-between pt-1">
        {applied ? (
          <div className="flex items-center gap-1.5 text-status-safe font-sans font-bold text-[10px]">
            <Check className="w-3.5 h-3.5" />
            Applied Successfully
          </div>
        ) : (
          <button
            onClick={() => onApply(suggestion.id)}
            className={`flex items-center gap-1 px-2.5 py-1 border rounded-lg font-sans font-bold text-[10px] cursor-pointer bg-transparent transition-colors ${suggestion.actionStyle}`}
          >
            {suggestion.action}
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
// Main Panel
// ─────────────────────────────────────────────────────────────
export default function AISuggestionsPanel({ chaosState, simulationConfig, campaign }) {
  const [dismissed, setDismissed] = useState(new Set())
  const [applied, setApplied] = useState(new Set())
  const [refreshKey, setRefreshKey] = useState(0)

  const suggestions = useMemo(
    () => buildSuggestions(chaosState, simulationConfig, campaign),
    [chaosState, simulationConfig, campaign, refreshKey]
  )

  const visible = suggestions.filter((s) => !dismissed.has(s.id))
  const isIdle = chaosState === 'idle'

  const handleDismiss = (id) => setDismissed((prev) => new Set([...prev, id]))
  const handleApply = (id) => setApplied((prev) => new Set([...prev, id]))
  const handleRefresh = () => {
    setDismissed(new Set())
    setApplied(new Set())
    setRefreshKey((k) => k + 1)
  }

  return (
    <div className="panel overflow-hidden" style={{ background: 'radial-gradient(circle at 50% 0%, #F0FDF4 0%, #FFFFFF 60%)' }}>
      {/* Panel Header */}
      <div className="panel-header border-b border-border-subtle">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-accent-blue" />
          <span>AI Suggestions</span>
        </div>
        <div className="flex-1" />
        <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border ${
          visible.length === 0
            ? 'bg-slate-50 border-slate-200 text-slate-400'
            : isIdle
            ? 'bg-blue-50 border-blue-200 text-accent-blue'
            : 'bg-amber-50 border-amber-200 text-amber-700 animate-pulse'
        }`}>
          {visible.length} ACTIVE
        </span>
        <button
          onClick={handleRefresh}
          title="Refresh suggestions"
          className="ml-2 p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 border-0 cursor-pointer bg-transparent transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      {/* Suggestions List */}
      <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {visible.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3">
                <Check className="w-5 h-5 text-status-safe" />
              </div>
              <div className="font-sans font-bold text-xs text-slate-600 mb-1">All Suggestions Applied</div>
              <div className="font-sans text-[10px] text-slate-400 mb-3">
                No pending AI recommendations for current state.
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-500 rounded-lg text-[10px] font-semibold cursor-pointer bg-white hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Regenerate Suggestions
              </button>
            </motion.div>
          ) : (
            visible.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onDismiss={handleDismiss}
                onApply={handleApply}
                applied={applied.has(suggestion.id)}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {visible.length > 0 && (
        <div className="panel-header border-t border-border-subtle border-b-0 mt-auto">
          <div className="flex items-center gap-1 text-[9px] font-sans text-secondary/70">
            <Sparkles className="w-3 h-3 text-accent-blue" />
            <span>Generated by Chaos Architect AI Engine — context-aware</span>
          </div>
          <div className="flex-1" />
          <span className="font-mono text-[9px] text-slate-400">
            {applied.size} applied · {dismissed.size} dismissed
          </span>
        </div>
      )}
    </div>
  )
}
