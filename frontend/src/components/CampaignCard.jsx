import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function formatCurrency(n) {
  if (!n) return '$0'
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toLocaleString()}`
}

export default function CampaignCard({ campaign, chaosState }) {
  const [deployed, setDeployed] = useState(false)
  const isResolved = chaosState === 'resolved'

  // Reset deployed state when campaign changes
  if (!campaign && deployed) setDeployed(false)

  return (
    <div className="panel flex flex-col min-h-[280px]">
      {/* Panel header */}
      <div className="panel-header">
        <div className={`w-1.5 h-1.5 rounded-full ${campaign ? 'bg-cyber-green' : 'bg-cyber-gray/40'}`} />
        <span>Demand Architect Intervention</span>
        <div className="flex-1" />
        {campaign && !deployed && (
          <span className="text-[10px] text-cyber-green animate-pulse">READY TO DEPLOY</span>
        )}
        {deployed && (
          <span className="text-[10px] text-cyber-green">✓ DEPLOYED</span>
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
              <div className="w-12 h-12 border border-[#1a1a2e] rounded flex items-center justify-center mb-3 text-cyber-gray/30 text-2xl">
                🤖
              </div>
              <div className="font-mono text-xs text-cyber-gray/40 tracking-wider">
                Awaiting agent output...
              </div>
              <div className="font-mono text-[10px] text-cyber-gray/20 mt-1">
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
                    className="w-1 h-4 bg-cyber-cyan rounded-full"
                  />
                ))}
              </div>
              <div className="font-mono text-xs text-cyber-cyan tracking-widest">
                DEMAND SHAPER ACTIVE
              </div>
              <div className="font-mono text-[10px] text-cyber-gray/50 mt-1">
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
                <div className="font-mono text-[9px] text-cyber-gray/60 uppercase tracking-widest mb-1">
                  Campaign Title
                </div>
                <h2 className="font-mono font-bold text-sm text-cyber-cyan glow-cyan leading-tight">
                  {campaign.campaignTitle}
                </h2>
              </div>

              {/* Target audience */}
              <div>
                <div className="font-mono text-[9px] text-cyber-gray/60 uppercase tracking-widest mb-1.5">
                  Target Audience
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(campaign.targetAudience || '').split(',').slice(0, 3).map((seg, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 border border-cyber-cyan/20 bg-cyber-cyan/5 rounded text-[10px] font-mono text-cyber-cyan/80"
                    >
                      {seg.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recovery stat */}
              <div className="panel p-3 border-cyber-green/20 bg-cyber-green/5 flex items-center justify-between">
                <div>
                  <div className="font-mono text-[9px] text-cyber-gray/60 uppercase tracking-widest">Projected Recovery</div>
                  <div className="font-mono text-xl font-bold text-cyber-green glow-green">
                    {formatCurrency(campaign.recoveredRevenue)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[9px] text-cyber-gray/60 uppercase tracking-widest">Bundle Discount</div>
                  <div className="font-mono text-sm font-bold text-cyber-yellow">8% OFF</div>
                </div>
              </div>

              {/* Marketing copy */}
              <div className="flex-1">
                <div className="font-mono text-[9px] text-cyber-gray/60 uppercase tracking-widest mb-1.5">
                  Marketing Copy
                </div>
                <div className="font-mono text-[11px] text-cyber-gray leading-relaxed line-clamp-6 overflow-hidden">
                  {campaign.marketingCopy}
                </div>
              </div>

              {/* Deploy button */}
              <motion.button
                id="deploy-campaign-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDeployed(true)}
                className="w-full py-3 font-mono font-bold text-sm tracking-[0.15em] uppercase border-2 border-cyber-green text-cyber-green hover:bg-cyber-green/10 transition-all relative overflow-hidden group"
                style={{ boxShadow: '0 0 20px rgba(57,255,20,0.2)' }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>▶ DEPLOY CAMPAIGN</span>
                </span>
                <div className="absolute inset-0 bg-cyber-green/5 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
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
                className="w-16 h-16 border-2 border-cyber-green rounded-full flex items-center justify-center mb-4"
                style={{ boxShadow: '0 0 30px rgba(57,255,20,0.4)' }}
              >
                <span className="text-cyber-green text-2xl font-bold glow-green">✓</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="font-mono font-bold text-lg text-cyber-green glow-green tracking-widest">
                  REALLOCATION COMPLETE
                </div>
                <div className="font-mono text-[11px] text-cyber-gray mt-2 max-w-xs">
                  Campaign "{campaign.campaignTitle}" deployed to{' '}
                  <span className="text-cyber-cyan">~240 B2B clients</span>.
                </div>
                <div className="font-mono text-xs text-cyber-green/70 mt-3">
                  {formatCurrency(campaign.recoveredRevenue)} revenue pathway activated.
                </div>
              </motion.div>

              {/* Recovered breakdown */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 grid grid-cols-2 gap-3 w-full max-w-xs"
              >
                {[
                  { label: 'Creator Pro 14"', units: '3,200', color: 'text-cyber-cyan' },
                  { label: 'CloudDesk Licenses', units: '3,200', color: 'text-cyber-yellow' },
                ].map((item) => (
                  <div key={item.label} className="panel p-2 text-center">
                    <div className={`font-mono text-sm font-bold ${item.color}`}>{item.units}</div>
                    <div className="font-mono text-[9px] text-cyber-gray/60 mt-0.5">{item.label}</div>
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
