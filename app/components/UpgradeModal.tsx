'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  usageCount: number;
  freeLimit: number;
}

export default function UpgradeModal({ isOpen, onClose, usageCount, freeLimit }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-brand-base/80 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-brand-surface border border-brand-border rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Glow effect */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-brand-accent/[0.08] rounded-full blur-[80px]" />
            <div className="absolute -bottom-16 -right-16 w-[200px] h-[200px] bg-brand-rose/[0.06] rounded-full blur-[60px]" />

            {/* Content */}
            <div className="relative p-8">
              {/* Close button */}
              <button onClick={onClose} className="absolute top-4 right-4 text-brand-tertiary hover:text-brand-text transition w-8 h-8 flex items-center justify-center rounded-lg hover:bg-brand-elevated">
                ✕
              </button>

              {/* Limit indicator */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-brand-rose/10 border-2 border-brand-rose/30 flex items-center justify-center">
                    <span className="text-3xl">🔒</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-brand-rose text-white text-[10px] font-bold flex items-center justify-center">
                    {usageCount}
                  </div>
                </div>
              </div>

              <h2 className="font-heading text-2xl font-bold text-center text-brand-text mb-2">
                Free limit reached
              </h2>
              <p className="text-center text-brand-muted text-sm mb-8">
                You&apos;ve used all {freeLimit} free artifacts this month.
                Upgrade to Pro for unlimited generation.
              </p>

              {/* Plan comparison */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {/* Free */}
                <div className="bg-brand-base rounded-2xl border border-brand-border p-4">
                  <p className="text-xs text-brand-tertiary mb-1">Current plan</p>
                  <p className="font-heading font-bold text-brand-text mb-3">Free</p>
                  <ul className="space-y-2 text-xs text-brand-muted">
                    <li className="flex items-center gap-1.5"><span className="text-brand-rose">✕</span> {freeLimit} artifacts/month</li>
                    <li className="flex items-center gap-1.5"><span className="text-brand-accent">✓</span> 4 artifact types</li>
                    <li className="flex items-center gap-1.5"><span className="text-brand-accent">✓</span> Markdown export</li>
                    <li className="flex items-center gap-1.5"><span className="text-brand-rose">✕</span> No DOCX export</li>
                  </ul>
                </div>

                {/* Pro */}
                <div className="bg-brand-accent/[0.06] rounded-2xl border border-brand-accent/30 p-4 relative">
                  <div className="absolute -top-2 right-3 bg-brand-accent text-brand-base text-[9px] font-bold px-2 py-0.5 rounded-full">RECOMMENDED</div>
                  <p className="text-xs text-brand-accent mb-1">Upgrade to</p>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="font-heading font-bold text-brand-text text-xl">€29</span>
                    <span className="text-brand-tertiary text-xs">/mo</span>
                  </div>
                  <ul className="space-y-2 text-xs text-brand-muted">
                    <li className="flex items-center gap-1.5"><span className="text-brand-accent">✓</span> <strong className="text-brand-text">Unlimited</strong> artifacts</li>
                    <li className="flex items-center gap-1.5"><span className="text-brand-accent">✓</span> All 7 types</li>
                    <li className="flex items-center gap-1.5"><span className="text-brand-accent">✓</span> DOCX + Markdown</li>
                    <li className="flex items-center gap-1.5"><span className="text-brand-accent">✓</span> Refine & iterate</li>
                  </ul>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => {
                  // TODO: Stripe Checkout integration
                  // For now, redirect to pricing section
                  window.open('/#pricing', '_blank');
                  onClose();
                }}
                className="w-full bg-brand-accent hover:bg-brand-accent-bright text-brand-base font-bold py-4 rounded-xl transition text-lg shadow-xl shadow-brand-accent/25 hover:-translate-y-0.5 active:translate-y-0"
              >
                Upgrade to Pro — €29/mo →
              </button>

              <p className="text-center text-[10px] text-brand-tertiary mt-3">
                Cancel anytime · 7-day money-back guarantee · Secure checkout via Stripe
              </p>

              {/* Usage bar */}
              <div className="mt-6 pt-4 border-t border-brand-border/50">
                <div className="flex justify-between text-[10px] text-brand-tertiary mb-1.5">
                  <span>Monthly usage</span>
                  <span>{usageCount}/{freeLimit} artifacts</span>
                </div>
                <div className="h-2 bg-brand-base rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-accent to-brand-rose rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (usageCount / freeLimit) * 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-brand-tertiary mt-1">Resets on the 1st of each month</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
