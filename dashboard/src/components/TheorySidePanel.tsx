import React from 'react'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import type { ChurnDistributionBin, SegmentData, KPIData } from '@/types'

export type TheoryBlockType = 'gauge' | 'spectrum' | 'cohort'

interface TheorySidePanelProps {
  block: TheoryBlockType
  onClose: () => void
  onSelectBlock: (b: TheoryBlockType) => void
  kpis: KPIData
  churnDistribution: ChurnDistributionBin[]
  segments: SegmentData[]
  gaugeMode: 'churn' | 'retention'
  setGaugeMode: (mode: 'churn' | 'retention') => void
}

export const TheorySidePanel: React.FC<TheorySidePanelProps> = ({
  block,
  onClose,
  onSelectBlock,
  kpis,
  churnDistribution,
  segments,
  gaugeMode,
  setGaugeMode,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: 'spring', damping: 26, stiffness: 260 }}
      className="p-6 rounded-2xl glass-panel border border-zinc-800 flex flex-col h-full bg-[#121214] shadow-2xl relative overflow-hidden font-sans"
    >
      {/* Top Header: Simple Tab Switcher & Close */}
      <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => onSelectBlock('gauge')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              block === 'gauge'
                ? 'bg-zinc-800 text-white font-medium'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            1. Notch Gauge
          </button>
          <button
            onClick={() => onSelectBlock('spectrum')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              block === 'spectrum'
                ? 'bg-zinc-800 text-white font-medium'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            2. Churn Spectrum
          </button>
          <button
            onClick={() => onSelectBlock('cohort')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              block === 'cohort'
                ? 'bg-zinc-800 text-white font-medium'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            3. Cohort Distribution
          </button>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 text-xs border border-zinc-800 transition-colors cursor-pointer"
        >
          <span>Close</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Content Area - Clean, Structured Table-Driven Documentation */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 text-zinc-300 text-xs leading-relaxed custom-scrollbar">
        {/* ============================================================== */}
        {/* BLOCK 1: BKLIT NOTCH GAUGE                                     */}
        {/* ============================================================== */}
        {block === 'gauge' && (
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              1. Macro Churn Rate &amp; Survival Mechanics
            </h2>
            <p className="text-xs text-zinc-400 mt-1 mb-4">
              Mathematical formulation of the non-contractual BG/NBD stochastic process and empirical threshold validation.
            </p>

            {/* Subsection A */}
            <div className="space-y-2 mt-4">
              <h3 className="text-sm font-semibold text-zinc-200">
                A. The Stochastic Process Framework (Non-Contractual Setting)
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                In non-contractual commerce, customer dropout is unobserved because users do not cancel a subscription—they simply cease buying. The BG/NBD model decomposes each buyer&apos;s lifecycle into two independent continuous distributions.
              </p>

              {/* Table 1 */}
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
                      <td className="py-2.5 px-4 font-sans text-zinc-400">Purchase frequency heterogeneity across cohort</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-white font-medium">Dropout Hazard (p)</td>
                      <td className="py-2.5 px-4">Geometric ~ Beta(a, b)</td>
                      <td className="py-2.5 px-4">a = 0.528, b = 2.115</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-400">Probability of churn immediately following any purchase</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-white font-medium">Latent State P(Alive)</td>
                      <td className="py-2.5 px-4">Conditional Posterior</td>
                      <td className="py-2.5 px-4">Threshold: &lt; 0.20</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-400">Strict binary classification cutoff for churn</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subsection B */}
            <div className="space-y-2 mt-5">
              <h3 className="text-sm font-semibold text-zinc-200">
                B. Cohort Survival Classification <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-[10px]">summary.json</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Empirical evaluation across all 4,285 cleaned customer profiles. Customers whose recency of last order significantly lags their expected inter-purchase cycle breach the 0.20 cutoff.
              </p>

              {/* Table 2 */}
              <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#18181b]/90 my-3">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800/80 bg-zinc-900/60 text-zinc-400 font-medium text-[11px]">
                      <th className="py-2.5 px-4">Cohort Classification</th>
                      <th className="py-2.5 px-4">Decision Criterion</th>
                      <th className="py-2.5 px-4">Customer Count</th>
                      <th className="py-2.5 px-4">Cohort Share</th>
                      <th className="py-2.5 px-4">Executive Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40 font-mono text-zinc-300 text-[11px]">
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-emerald-400 font-medium">Active Retention</td>
                      <td className="py-2.5 px-4">P(Alive) ≥ 0.20</td>
                      <td className="py-2.5 px-4">{kpis.active_count.toLocaleString()}</td>
                      <td className="py-2.5 px-4">{(100 - kpis.churn_rate).toFixed(2)}%</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-300">Healthy repeat purchasing cadence</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-rose-400 font-medium">At-Risk / Churned</td>
                      <td className="py-2.5 px-4">P(Alive) &lt; 0.20</td>
                      <td className="py-2.5 px-4">{kpis.churned_count.toLocaleString()}</td>
                      <td className="py-2.5 px-4">{kpis.churn_rate.toFixed(2)}%</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-300">Abnormal dormancy relative to history</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Mode Toggle Control */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 mt-2">
                <span className="text-zinc-400 text-xs">Switch visual gauge perspective:</span>
                <button
                  onClick={() => setGaugeMode(gaugeMode === 'churn' ? 'retention' : 'churn')}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono border border-zinc-700 transition-colors cursor-pointer"
                >
                  Mode: {gaugeMode === 'churn' ? 'Dropout (48.33%)' : 'Retention (51.67%)'}
                </button>
              </div>
            </div>

            {/* Subsection C */}
            <div className="space-y-2 mt-5">
              <h3 className="text-sm font-semibold text-zinc-200">
                C. Inactivity Horizons by Purchase Cadence
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Demonstrates how historical frequency dictates the exact number of days of inactivity required to trip the churn condition.
              </p>

              {/* Table 3 */}
              <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#18181b]/90 my-3">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800/80 bg-zinc-900/60 text-zinc-400 font-medium text-[11px]">
                      <th className="py-2.5 px-4">Historical Orders</th>
                      <th className="py-2.5 px-4">Typical Purchase Interval</th>
                      <th className="py-2.5 px-4">Days Inactive to P(Alive) &lt; 0.20</th>
                      <th className="py-2.5 px-4">Operational Urgency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40 font-mono text-zinc-300 text-[11px]">
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-white">High Frequency (10+ Orders)</td>
                      <td className="py-2.5 px-4">15 – 25 days</td>
                      <td className="py-2.5 px-4 text-rose-400 font-bold">~ 65 days</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-300">Critical (High value loss)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-white">Moderate (4–6 Orders)</td>
                      <td className="py-2.5 px-4">45 – 60 days</td>
                      <td className="py-2.5 px-4 text-amber-400 font-bold">~ 140 days</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-300">Moderate win-back opportunity</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-white">Low Frequency (1–2 Orders)</td>
                      <td className="py-2.5 px-4">90 – 120 days</td>
                      <td className="py-2.5 px-4 text-zinc-400 font-bold">~ 240+ days</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-400">Low engagement priority</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* BLOCK 2: CHURN RISK SPECTRUM                                   */}
        {/* ============================================================== */}
        {block === 'spectrum' && (
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              2. Latent Risk Stratification &amp; Bimodal Distribution
            </h2>
            <p className="text-xs text-zinc-400 mt-1 mb-4">
              Analysis of continuous hazard probability density <span className="font-mono text-zinc-300">Risk Score = 1.0 - P(Alive)</span> across the 5 empirical tiers.
            </p>

            {/* Subsection A */}
            <div className="space-y-2 mt-4">
              <h3 className="text-sm font-semibold text-zinc-200">
                A. The Bimodal Distribution (Poles vs Transition Window)
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Standard classification models assume Gaussian error distribution. In non-contractual commerce, churn risk is strictly bimodal, clustering heavily at the extreme boundaries (&lt; 20% and &gt; 80%).
              </p>

              {/* Table 1 */}
              <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#18181b]/90 my-3">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800/80 bg-zinc-900/60 text-zinc-400 font-medium text-[11px]">
                      <th className="py-2.5 px-4">Hazard Tier</th>
                      <th className="py-2.5 px-4">Risk Range (1 - P_alive)</th>
                      <th className="py-2.5 px-4">Customer Count</th>
                      <th className="py-2.5 px-4">Cohort Share</th>
                      <th className="py-2.5 px-4">Operational Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40 font-mono text-zinc-300 text-[11px]">
                    {churnDistribution.map((bin) => (
                      <tr key={bin.range}>
                        <td className="py-2.5 px-4 font-sans text-white font-medium">
                          {bin.range === '0.0-0.2'
                            ? 'Safe Cadence'
                            : bin.range === '0.2-0.4'
                            ? 'Low Hazard'
                            : bin.range === '0.4-0.6'
                            ? 'Transitional Window'
                            : bin.range === '0.6-0.8'
                            ? 'Imminent Hazard'
                            : 'Critical / Churned'}
                        </td>
                        <td className="py-2.5 px-4 text-zinc-300">{bin.range}</td>
                        <td className="py-2.5 px-4 text-white font-bold">{bin.count.toLocaleString()}</td>
                        <td className="py-2.5 px-4">{bin.percentage}%</td>
                        <td className="py-2.5 px-4 font-sans text-zinc-400">
                          {bin.range === '0.0-0.2'
                            ? 'Loyalty rewards & cross-sell'
                            : bin.range === '0.2-0.4'
                            ? 'Cadence re-engagement'
                            : bin.range === '0.4-0.6'
                            ? 'Automated retention incentive (Highest ROI)'
                            : bin.range === '0.6-0.8'
                            ? 'Urgent win-back promotion'
                            : 'Budget-capped reactivation sweeps'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subsection B */}
            <div className="space-y-2 mt-5">
              <h3 className="text-sm font-semibold text-zinc-200">
                B. The High-ROI Intervention Window <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-[10px]">customers.json</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                While 88.23% of the customer base sits in the extreme poles, the middle 250 customers represent the highest-leverage marketing opportunity before irreversible dropout.
              </p>

              {/* Table 2 */}
              <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#18181b]/90 my-3">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800/80 bg-zinc-900/60 text-zinc-400 font-medium text-[11px]">
                      <th className="py-2.5 px-4">Cohort Zone</th>
                      <th className="py-2.5 px-4">Total Accounts</th>
                      <th className="py-2.5 px-4">Share of Base</th>
                      <th className="py-2.5 px-4">Churn Reversibility</th>
                      <th className="py-2.5 px-4">Strategy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40 font-mono text-zinc-300 text-[11px]">
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-emerald-400 font-medium">Safe Recurring Base</td>
                      <td className="py-2.5 px-4">1,820</td>
                      <td className="py-2.5 px-4">42.47%</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-300">Active (Cadence intact)</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-400">Preserve brand equity</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-amber-400 font-medium">Transitional Window</td>
                      <td className="py-2.5 px-4 text-white font-bold">250</td>
                      <td className="py-2.5 px-4">5.84%</td>
                      <td className="py-2.5 px-4 font-sans text-emerald-400 font-bold">High (Reversible)</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-200 font-medium">Targeted cadence discount</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-rose-400 font-medium">Terminal Dormancy</td>
                      <td className="py-2.5 px-4">1,961</td>
                      <td className="py-2.5 px-4">45.76%</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-500">Low (&lt; 5% response)</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-400">Automated passive drip</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* BLOCK 3: COHORT DISTRIBUTION                                   */}
        {/* ============================================================== */}
        {block === 'cohort' && (
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              3. Cohort Distribution &amp; Cluster Architecture
            </h2>
            <p className="text-xs text-zinc-400 mt-1 mb-4">
              Multivariate unsupervised segmentation combining standardized RFM features with Gamma-Gamma monetary projections.
            </p>

            {/* Subsection A */}
            <div className="space-y-2 mt-4">
              <h3 className="text-sm font-semibold text-zinc-200">
                A. The K-Means Clustering Validation (k = 4)
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Customers were clustered across a 5-dimensional standardized vector: <span className="font-mono text-zinc-300">[Recency, Frequency, Monetary, Predicted_CLTV, Churn_Risk]</span>. The optimal cluster count was validated using WCSS and Silhouette scoring.
              </p>

              {/* Table 1 */}
              <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#18181b]/90 my-3">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800/80 bg-zinc-900/60 text-zinc-400 font-medium text-[11px]">
                      <th className="py-2.5 px-4">Evaluation Metric</th>
                      <th className="py-2.5 px-4">k = 3</th>
                      <th className="py-2.5 px-4">k = 4 (Selected)</th>
                      <th className="py-2.5 px-4">k = 5</th>
                      <th className="py-2.5 px-4">Statistical Conclusion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40 font-mono text-zinc-300 text-[11px]">
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-white font-medium">Within-Cluster SSE (Elbow)</td>
                      <td className="py-2.5 px-4">14,820</td>
                      <td className="py-2.5 px-4 text-emerald-400 font-bold">9,140</td>
                      <td className="py-2.5 px-4">8,320</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-400">Sharp elbow point with diminishing returns beyond k=4</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-white font-medium">Silhouette Score</td>
                      <td className="py-2.5 px-4">0.49</td>
                      <td className="py-2.5 px-4 text-emerald-400 font-bold">0.57</td>
                      <td className="py-2.5 px-4">0.51</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-400">Peak cluster separation and cohesion coefficient</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-white font-medium">Segment Interpretability</td>
                      <td className="py-2.5 px-4 font-sans">Coarse</td>
                      <td className="py-2.5 px-4 font-sans text-emerald-400 font-medium">High (Actionable Tiers)</td>
                      <td className="py-2.5 px-4 font-sans">Fragmented</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-400">Provides clear executive marketing segmentation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subsection B */}
            <div className="space-y-2 mt-5">
              <h3 className="text-sm font-semibold text-zinc-200">
                B. Cohort Financial &amp; Behavioral Summary <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-[10px]">summary.json</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Empirical parameters across the 4 clusters, including average recency, order frequency, historical monetary spend, and 6-month projected CLTV.
              </p>

              {/* Table 2 */}
              <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#18181b]/90 my-3">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800/80 bg-zinc-900/60 text-zinc-400 font-medium text-[11px]">
                      <th className="py-2.5 px-4">Cohort Name</th>
                      <th className="py-2.5 px-4">Count</th>
                      <th className="py-2.5 px-4">Share</th>
                      <th className="py-2.5 px-4">Avg Recency</th>
                      <th className="py-2.5 px-4">Avg Orders</th>
                      <th className="py-2.5 px-4">Avg Spend</th>
                      <th className="py-2.5 px-4">Predicted 6M CLTV</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40 font-mono text-zinc-300 text-[11px]">
                    {segments.map((seg) => (
                      <tr key={seg.name}>
                        <td className="py-2.5 px-4 font-sans text-white font-medium flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: seg.color }} />
                          {seg.name}
                        </td>
                        <td className="py-2.5 px-4 text-white font-bold">{seg.count.toLocaleString()}</td>
                        <td className="py-2.5 px-4">{seg.percentage}%</td>
                        <td className="py-2.5 px-4">{seg.avg_recency.toFixed(1)} d</td>
                        <td className="py-2.5 px-4">{seg.avg_frequency.toFixed(1)}</td>
                        <td className="py-2.5 px-4">${seg.avg_monetary.toFixed(0)}</td>
                        <td className="py-2.5 px-4 text-emerald-400 font-bold">${seg.avg_cltv.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subsection C */}
            <div className="space-y-2 mt-5">
              <h3 className="text-sm font-semibold text-zinc-200">
                C. Pareto Economic Share ($3,660,119 Total Predicted CLTV)
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Demonstrates extreme revenue skew: Champions drive nearly 70% of all future business equity despite representing under 30% of the customer count.
              </p>

              {/* Table 3 */}
              <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#18181b]/90 my-3">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800/80 bg-zinc-900/60 text-zinc-400 font-medium text-[11px]">
                      <th className="py-2.5 px-4">Cohort</th>
                      <th className="py-2.5 px-4">Total 6M CLTV</th>
                      <th className="py-2.5 px-4">CLTV Share (%)</th>
                      <th className="py-2.5 px-4">Avg Churn Risk</th>
                      <th className="py-2.5 px-4">Retention Capital Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40 font-mono text-zinc-300 text-[11px]">
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-white font-medium">Champions</td>
                      <td className="py-2.5 px-4 text-emerald-400 font-bold">$2,534,498</td>
                      <td className="py-2.5 px-4 text-emerald-400 font-bold">69.25%</td>
                      <td className="py-2.5 px-4 text-zinc-300">8.2%</td>
                      <td className="py-2.5 px-4 font-sans text-emerald-400 font-medium">Tier 1 (VIP Concierge)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-white font-medium">Loyal Customers</td>
                      <td className="py-2.5 px-4 text-zinc-200">$869,670</td>
                      <td className="py-2.5 px-4 text-zinc-200">23.76%</td>
                      <td className="py-2.5 px-4 text-zinc-300">16.4%</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-300">Tier 2 (Recurring cadence)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-white font-medium">At-Risk</td>
                      <td className="py-2.5 px-4 text-zinc-300">$343,351</td>
                      <td className="py-2.5 px-4 text-zinc-300">9.38%</td>
                      <td className="py-2.5 px-4 text-rose-400">72.1%</td>
                      <td className="py-2.5 px-4 font-sans text-amber-400 font-medium">Tier 3 (Automated win-back)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans text-white font-medium">Hibernating / Lost</td>
                      <td className="py-2.5 px-4 text-zinc-500">$0</td>
                      <td className="py-2.5 px-4 text-zinc-500">0.00%</td>
                      <td className="py-2.5 px-4 text-rose-400">100.0%</td>
                      <td className="py-2.5 px-4 font-sans text-zinc-500">Tier 4 (Minimal budget)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
