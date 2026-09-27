import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, BookOpen, Brain, Activity, Target, ShieldAlert } from 'lucide-react'

interface ModelExplanationModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ModelExplanationModal: React.FC<ModelExplanationModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-[#0e0e11] border border-zinc-700/80 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl relative"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700">
                <BookOpen className="w-6 h-6 text-zinc-200" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-white">
                  Mathematical &amp; Modeling Architecture
                </h3>
                <p className="text-xs text-zinc-400">
                  Customer Churn &amp; CLTV Probabilistic Methodology
                </p>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-6 text-xs text-zinc-300 leading-relaxed">
              {/* Section 1: BG/NBD */}
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <div className="flex items-center gap-2 mb-2 text-zinc-200 font-semibold text-sm">
                  <Brain className="w-4 h-4 text-zinc-300" />
                  1. BG/NBD Model (Beta Geometric / Negative Binomial Distribution)
                </div>
                <p className="mb-2">
                  Used for non-contractual customer settings where churn is unobserved. It splits customer behavior into two stochastic processes:
                </p>
                <ul className="list-disc list-inside space-y-1 text-zinc-400 ml-1">
                  <li>
                    <strong className="text-zinc-200">Transaction Process:</strong> While active, transaction counts follow a Poisson process with rate $\lambda$, which varies across customers following a Gamma distribution ($r, \alpha$).
                  </li>
                  <li>
                    <strong className="text-zinc-200">Dropout Process:</strong> After any transaction, a customer drops out (churns) with probability $p$, distributed across the population as Beta ($a, b$).
                  </li>
                </ul>
              </div>

              {/* Section 2: Churn Threshold */}
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <div className="flex items-center gap-2 mb-2 text-rose-300 font-semibold text-sm">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  2. Churn Classification Criterion
                </div>
                <p className="mb-2">
                  The model evaluates each customer's conditional probability of still being active:
                </p>
                <div className="bg-black p-2.5 rounded-lg font-mono text-center text-zinc-200 my-2 border border-zinc-800">
                  Churn Risk Score = 1.0 - P(Alive)
                </div>
                <p>
                  A strict empirical threshold of <span className="font-mono text-rose-400 font-bold">P(Alive) &lt; 0.20</span> classifies a customer as <span className="font-mono text-zinc-200">Is_Churned = 1</span>. In this cohort of 4,285 customers, 48.3% have breached this threshold due to long inactivity relative to their historical frequency.
                </p>
              </div>

              {/* Section 3: Gamma-Gamma */}
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <div className="flex items-center gap-2 mb-2 text-emerald-300 font-semibold text-sm">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  3. Gamma-Gamma Submodel (Monetary &amp; CLTV)
                </div>
                <p className="mb-2">
                  Estimates the average monetary spend per transaction by assuming spend follows a Gamma distribution with shape parameter $p$ and scale parameter $v$.
                </p>
                <p>
                  Combined with the BG/NBD expected transaction rate and discounted at <strong className="text-zinc-200">1% monthly</strong> over a 6-month horizon, it projects future financial contribution.
                </p>
              </div>

              {/* Section 4: K-Means Segmentation */}
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <div className="flex items-center gap-2 mb-2 text-amber-300 font-semibold text-sm">
                  <Target className="w-4 h-4 text-amber-400" />
                  4. K-Means Customer Segmentation ($k = 4$)
                </div>
                <p className="mb-2">
                  Features standardized using <span className="font-mono text-zinc-200">StandardScaler</span>:
                  <span className="font-mono text-zinc-400 block mt-1">
                    ['Recency', 'Frequency', 'Monetary', 'Predicted_CLTV', 'Churn_Risk_Score']
                  </span>
                </p>
                <p>
                  Evaluated via the Elbow Method (WCSS) and Silhouette Score (peaking at ~0.57 for $k=4$), producing actionable business clusters: Champions, Loyal Customers, At-Risk, and Hibernating Outliers.
                </p>
              </div>
            </div>

            {/* Footer action */}
            <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl font-medium transition-colors"
              >
                Close Documentation
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
