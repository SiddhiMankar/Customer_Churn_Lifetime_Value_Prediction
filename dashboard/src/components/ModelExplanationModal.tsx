import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'

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
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.2 }}
            className="bg-[#121214] border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[88vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative font-sans text-xs text-zinc-300 custom-scrollbar"
          >
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Main Title & Subtitle */}
            <div className="mb-6 pb-4 border-b border-zinc-800">
              <h2 className="text-lg font-semibold text-white tracking-tight">
                4. Theoretical Architecture &amp; Methodology
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Empirical defense of stochastic distributions, threshold criteria, and predictive lifetime value models.
              </p>
            </div>

            {/* Section A: BG/NBD */}
            <div className="space-y-2 mt-4">
              <h3 className="text-sm font-semibold text-zinc-200">
                A. The BG/NBD Stochastic Framework (Non-Contractual Commerce)
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                In non-contractual retail, churn is a latent process. The BG/NBD model decomposes individual customer lifecycles into continuous Poisson purchasing and Beta-Geometric dropout hazards.
              </p>

              <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#18181b]/90 my-3">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800/80 bg-zinc-900/60 text-zinc-400 font-medium text-[11px]">
                      <th className="py-2.5 px-4">Component</th>
                      <th className="py-2.5 px-4">Stochastic Distribution</th>
                      <th className="py-2.5 px-4">Fitted Parameter</th>
                      <th className="py-2.5 px-4">Behavioral Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40 font-mono text-zinc-300 text-[11px]">
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-white font-medium">Transaction Rate (λ)</td>
                      <td className="py-2.5 px-4">Poisson ~ Gamma(r, α)</td>
                      <td className="py-2.5 px-4">r = 0.243, α = 4.414</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-400">Captures purchase frequency heterogeneity across cohort</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-white font-medium">Dropout Hazard (p)</td>
                      <td className="py-2.5 px-4">Geometric ~ Beta(a, b)</td>
                      <td className="py-2.5 px-4">a = 0.528, b = 2.115</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-400">Probability of churn immediately following any purchase</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-white font-medium">Inactivity State P(Alive)</td>
                      <td className="py-2.5 px-4">Conditional Posterior</td>
                      <td className="py-2.5 px-4">Threshold: &lt; 0.20</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-400">Strict binary classification cutoff for churn</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section B: Survival Threshold */}
            <div className="space-y-2 mt-6">
              <h3 className="text-sm font-semibold text-zinc-200">
                B. Cohort Survival Classification <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-[10px]">summary.json</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Empirical evaluation across all 4,285 customer profiles. A strict empirical threshold of <span className="font-mono text-zinc-200 font-medium">P(Alive) &lt; 0.20</span> flags accounts where recency has significantly lapsed past historical purchasing cadence.
              </p>

              <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#18181b]/90 my-3">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800/80 bg-zinc-900/60 text-zinc-400 font-medium text-[11px]">
                      <th className="py-2.5 px-4">Classification</th>
                      <th className="py-2.5 px-4">Decision Criterion</th>
                      <th className="py-2.5 px-4">Customer Count</th>
                      <th className="py-2.5 px-4">Cohort Share</th>
                      <th className="py-2.5 px-4">Operational Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40 font-mono text-zinc-300 text-[11px]">
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-emerald-400 font-medium">Active Retention</td>
                      <td className="py-2.5 px-4">P(Alive) ≥ 0.20</td>
                      <td className="py-2.5 px-4">2,214</td>
                      <td className="py-2.5 px-4">51.67%</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-300">Healthy recurring order cadence</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-rose-400 font-medium">At-Risk / Churned</td>
                      <td className="py-2.5 px-4">P(Alive) &lt; 0.20</td>
                      <td className="py-2.5 px-4">2,071</td>
                      <td className="py-2.5 px-4">48.33%</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-300">Dormant; high intervention priority</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section C: Gamma-Gamma */}
            <div className="space-y-2 mt-6">
              <h3 className="text-sm font-semibold text-zinc-200">
                C. Gamma-Gamma Monetary Submodel (6-Month CLTV Projection)
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Estimates customer spend per transaction independently of purchase cadence. Combined with BG/NBD expected transactions and discounted at 1% monthly to project customer lifetime equity.
              </p>

              <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#18181b]/90 my-3">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800/80 bg-zinc-900/60 text-zinc-400 font-medium text-[11px]">
                      <th className="py-2.5 px-4">Metric</th>
                      <th className="py-2.5 px-4">Total Aggregate</th>
                      <th className="py-2.5 px-4">Cohort Mean</th>
                      <th className="py-2.5 px-4">Cohort Median</th>
                      <th className="py-2.5 px-4">Modeling Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40 font-mono text-zinc-300 text-[11px]">
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-white font-medium">Monetary Spend ($)</td>
                      <td className="py-2.5 px-4">$8,832,154</td>
                      <td className="py-2.5 px-4">$2,061.18</td>
                      <td className="py-2.5 px-4">$674.45</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-400">Historical realized transaction value</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-white font-medium">Predicted 6M CLTV ($)</td>
                      <td className="py-2.5 px-4 text-emerald-400 font-bold">$3,660,119</td>
                      <td className="py-2.5 px-4 text-emerald-400 font-bold">$854.17</td>
                      <td className="py-2.5 px-4 text-emerald-400 font-bold">$520.10</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-400">Discounted future gross margin contribution</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section D: K-Means Segmentation */}
            <div className="space-y-2 mt-6">
              <h3 className="text-sm font-semibold text-zinc-200">
                D. Multivariate K-Means Segmentation <span className="px-1.5 py-0.5 rounded bg-zinc-850 border border-zinc-700 text-zinc-300 font-mono text-[10px]">k = 4</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Standardized 5D vector <span className="font-mono text-zinc-300">[Recency, Frequency, Monetary, Predicted_CLTV, Churn_Risk]</span> validated using Elbow (WCSS) and Silhouette (~0.57) metrics.
              </p>

              <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#18181b]/90 my-3">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800/80 bg-zinc-900/60 text-zinc-400 font-medium text-[11px]">
                      <th className="py-2.5 px-4">Cluster Tier</th>
                      <th className="py-2.5 px-4">Count</th>
                      <th className="py-2.5 px-4">Share</th>
                      <th className="py-2.5 px-4">Avg Recency</th>
                      <th className="py-2.5 px-4">Avg Orders</th>
                      <th className="py-2.5 px-4">Avg Spend</th>
                      <th className="py-2.5 px-4">Predicted 6M CLTV</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40 font-mono text-zinc-300 text-[11px]">
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-white font-medium">Champions</td>
                      <td className="py-2.5 px-4 text-white font-bold">1,284</td>
                      <td className="py-2.5 px-4">29.96%</td>
                      <td className="py-2.5 px-4">15.2 d</td>
                      <td className="py-2.5 px-4">12.8</td>
                      <td className="py-2.5 px-4">$3,450.12</td>
                      <td className="py-2.5 px-4 text-emerald-400 font-bold">$1,973.91</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-white font-medium">Loyal Customers</td>
                      <td className="py-2.5 px-4 text-white font-bold">1,228</td>
                      <td className="py-2.5 px-4">28.66%</td>
                      <td className="py-2.5 px-4">34.1 d</td>
                      <td className="py-2.5 px-4">4.6</td>
                      <td className="py-2.5 px-4">$1,280.45</td>
                      <td className="py-2.5 px-4 text-zinc-200">$708.20</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-white font-medium">At-Risk</td>
                      <td className="py-2.5 px-4 text-white font-bold">1,757</td>
                      <td className="py-2.5 px-4">41.00%</td>
                      <td className="py-2.5 px-4">148.6 d</td>
                      <td className="py-2.5 px-4">2.1</td>
                      <td className="py-2.5 px-4">$612.30</td>
                      <td className="py-2.5 px-4 text-zinc-400">$195.40</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-white font-medium">Hibernating / Lost</td>
                      <td className="py-2.5 px-4 text-zinc-400 font-bold">16</td>
                      <td className="py-2.5 px-4">0.37%</td>
                      <td className="py-2.5 px-4">372.1 d</td>
                      <td className="py-2.5 px-4">94.1</td>
                      <td className="py-2.5 px-4">$43,588.71</td>
                      <td className="py-2.5 px-4 text-zinc-500">$0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Close Action */}
            <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium border border-zinc-700 transition-colors cursor-pointer"
              >
                Close Methodology
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
