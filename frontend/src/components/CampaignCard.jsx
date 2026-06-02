import { motion, AnimatePresence } from 'framer-motion'

function formatCurrency(n) {
  if (!n) return '$0'
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toLocaleString()}`
}

export default function CampaignCard({ campaign, chaosState, deployed, setDeployed, onAuthorize }) {
  const isResolved = chaosState === 'resolved'

  return (
    <div className="panel flex flex-col min-h-[280px]">
      {/* Panel header */}
      <div className="panel-header border-b border-border-subtle/40">
        <div className={`w-1.5 h-1.5 rounded-full ${campaign ? 'bg-status-safe' : 'bg-text-secondary/40'}`} />
        <span>Demand Architect Intervention</span>
        <div className="flex-1" />
        {campaign && !deployed && (
          <span className={`text-[10px] font-sans font-bold animate-pulse ${chaosState === 'awaiting_auth' ? 'text-status-warning' : 'text-status-safe'}`}>
            {chaosState === 'awaiting_auth' ? 'AWAITING AUTHORIZATION (HITL)' : 'READY TO DEPLOY'}
          </span>
        )}
        {deployed && (
          <span className="text-[10px] font-sans font-bold text-status-safe">✓ DEPLOYED</span>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">

          {/* ── Empty state ─────────────────────────────────────────── */}
          {!campaign && !isResolved && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="w-12 h-12 border border-border-subtle rounded-lg flex items-center justify-center mb-3 text-text-secondary/30 text-2xl bg-[#09090b]/50">
                🤖
              </div>
              <div className="font-sans text-xs text-text-secondary font-medium tracking-wide">
                Awaiting agent output...
              </div>
              <div className="font-sans text-[10px] text-text-secondary/60 mt-1">
                Campaign will appear here after crisis resolution
              </div>
            </motion.div>
          )}

          {/* ── Loading state ────────────────────────────────────────── */}
          {chaosState === 'resolving' && !campaign && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-6"
            >
              <div className="flex gap-1.5 mb-3">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scaleY: [1, 2, 1] }}
                    transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
                    className="w-1 h-4 bg-accent-blue rounded-full"
                  />
                ))}
              </div>
              <div className="font-sans text-xs text-accent-blue font-bold tracking-widest uppercase">
                DEMAND SHAPER ACTIVE
              </div>
              <div className="font-sans text-[10px] text-text-secondary/50 mt-1">
                Generating campaign strategy...
              </div>
            </motion.div>
          )}

          {/* ── Campaign card ────────────────────────────────────────── */}
          {campaign && !deployed && (
            <motion.div
              key="campaign"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex-1 flex flex-col p-4 space-y-4"
            >
              {/* Campaign title */}
              <div>
                <div className="font-sans text-[9px] text-text-secondary uppercase tracking-widest mb-1.5 font-semibold">
                  Campaign Title
                </div>
                <h2 className="font-sans font-extrabold text-sm text-accent-blue leading-tight">
                  {campaign.campaignTitle}
                </h2>
              </div>

              {/* Target audience */}
              <div>
                <div className="font-sans text-[9px] text-text-secondary uppercase tracking-widest mb-1.5 font-semibold">
                  Target Audience
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(campaign.targetAudience || '').split(',').slice(0, 3).map((seg, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 border border-accent-blue/20 bg-accent-blue/5 rounded-md text-[10px] font-sans text-accent-blue/80 font-medium"
                    >
                      {seg.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recovery stat */}
              <div className="border border-status-safe/20 bg-status-safe/5 rounded-lg p-3.5 flex items-center justify-between">
                <div>
                  <div className="font-sans text-[9px] text-text-secondary uppercase tracking-widest font-semibold">Projected Recovery</div>
                  <div className="font-mono text-xl font-bold text-status-safe">
                    {formatCurrency(campaign.recoveredRevenue)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-sans text-[9px] text-text-secondary uppercase tracking-widest font-semibold">Bundle Discount</div>
                  <div className="font-sans text-sm font-bold text-status-warning">8% OFF</div>
                </div>
              </div>

              {/* Marketing copy */}
              <div className="flex-1">
                <div className="font-sans text-[9px] text-text-secondary uppercase tracking-widest mb-1.5 font-semibold">
                  Marketing Copy
                </div>
                <div className="font-sans text-[11px] text-text-primary leading-relaxed line-clamp-6 overflow-hidden bg-[#09090b]/20 p-2 border border-border-subtle/30 rounded-lg">
                  {campaign.marketingCopy}
                </div>
              </div>

              {/* Deploy button */}
              <motion.button
                id="deploy-campaign-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={chaosState === 'awaiting_auth' ? onAuthorize : () => setDeployed(true)}
                className={`w-full py-3.5 font-sans font-bold text-xs tracking-wider uppercase text-white rounded-lg transition-all duration-200 shadow-lg cursor-pointer border-0 ${
                  chaosState === 'awaiting_auth'
                    ? 'bg-status-warning hover:bg-amber-600 shadow-status-warning/20'
                    : 'bg-status-safe hover:bg-emerald-600 shadow-status-safe/20'
                }`}
              >
                <span>{chaosState === 'awaiting_auth' ? '⚡ AUTHORIZE & DEPLOY' : '▶ DEPLOY CAMPAIGN'}</span>
              </motion.button>
            </motion.div>
          )}

          {/* ── Deployed success state ───────────────────────────────── */}
          {deployed && campaign && (
            <motion.div
              key="deployed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center p-6 text-center"
            >
              {/* Success checkmark */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-14 h-14 border border-status-safe bg-status-safe/5 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-status-safe/10"
              >
                <span className="text-status-safe text-xl font-bold">✓</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="font-sans font-extrabold text-sm text-status-safe tracking-wider uppercase">
                  REALLOCATION COMPLETE
                </div>
                <div className="font-sans text-[11px] text-text-secondary mt-2 max-w-xs leading-relaxed">
                  Campaign "{campaign.campaignTitle}" deployed to{' '}
                  <span className="text-accent-blue font-semibold">~240 B2B clients</span>.
                </div>
                <div className="font-sans text-xs text-status-safe/80 mt-3 font-semibold">
                  <span className="font-mono">{formatCurrency(campaign.recoveredRevenue)}</span> revenue pathway activated.
                </div>
              </motion.div>

              {/* Recovered breakdown */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 grid grid-cols-2 gap-2.5 w-full max-w-xs"
              >
                {(campaign.vertical === 'vegetables'
                  ? [
                      { label: 'Flash-Frozen Purée', units: '3,200', color: 'text-accent-blue' },
                      { label: 'Superfood Powder', units: '3,200', color: 'text-status-warning' },
                    ]
                  : [
                      { label: 'Creator Pro 14"', units: '3,200', color: 'text-accent-blue' },
                      { label: 'CloudDesk Licenses', units: '3,200', color: 'text-status-warning' },
                    ]
                ).map((item) => (
                  <div key={item.label} className="border border-border-subtle/80 bg-[#09090b]/40 rounded-lg p-2.5 text-center">
                    <div className={`font-mono text-sm font-bold ${item.color}`}>{item.units}</div>
                    <div className="font-sans text-[9px] text-text-secondary font-semibold mt-0.5 uppercase tracking-wider">{item.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
