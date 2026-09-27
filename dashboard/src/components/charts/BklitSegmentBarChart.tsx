import React, { useState } from 'react'
import { motion } from 'motion/react'
import type { SegmentData } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface BklitSegmentBarChartProps {
  segments: SegmentData[]
}

type MetricMode = 'cltv' | 'churn' | 'orders'

export const BklitSegmentBarChart: React.FC<BklitSegmentBarChartProps> = ({ segments }) => {
  const [metricMode, setMetricMode] = useState<MetricMode>('cltv')

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Customer Segment Deep-Dive
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            K-Means clustering ($k=4$) profile comparison
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-lg border border-zinc-800 self-start sm:self-auto">
          <button
            onClick={() => setMetricMode('cltv')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
              metricMode === 'cltv'
                ? 'bg-zinc-700 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            CLTV vs Spend
          </button>
          <button
            onClick={() => setMetricMode('churn')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
              metricMode === 'churn'
                ? 'bg-zinc-700 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Churn Risk %
          </button>
          <button
            onClick={() => setMetricMode('orders')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
              metricMode === 'orders'
                ? 'bg-zinc-700 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Forecast Purchases
          </button>
        </div>
      </div>

      {/* Segment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {segments.map((segment, idx) => {
          return (
            <motion.div
              key={segment.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all duration-300 relative group overflow-hidden"
            >
              {/* Subtle accent border on left */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{ backgroundColor: segment.color }}
              />

              <div className="flex items-start justify-between mb-3 pl-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-base font-bold text-white">
                      {segment.name}
                    </span>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                      style={{
                        color: segment.color,
                        borderColor: `${segment.color}40`,
                        backgroundColor: `${segment.color}15`,
                      }}
                    >
                      {segment.count.toLocaleString()} ({segment.percentage}%)
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    Avg Recency: <span className="font-mono text-zinc-200">{segment.avg_recency}d</span> • Avg Orders: <span className="font-mono text-zinc-200">{segment.avg_frequency}</span>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 block uppercase font-medium">Avg CLTV</span>
                  <span className="font-mono text-sm font-bold text-emerald-400">
                    {formatCurrency(segment.avg_cltv)}
                  </span>
                </div>
              </div>

              {/* Dynamic Metric Progress Bar depending on mode */}
              <div className="mt-2 pl-2">
                {metricMode === 'cltv' && (
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-zinc-400">Total 6-Month CLTV Value</span>
                        <span className="font-mono font-semibold text-zinc-200">
                          {formatCurrency(segment.total_cltv)}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-zinc-800/80 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: segment.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (segment.total_cltv / 2378000) * 100)}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.1 }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/40">
                      <span>Avg Historical Spend:</span>
                      <span className="font-mono text-zinc-300 font-medium">
                        {formatCurrency(segment.avg_monetary)}
                      </span>
                    </div>
                  </div>
                )}

                {metricMode === 'churn' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-zinc-400">Average Churn Risk Score</span>
                      <span
                        className="font-mono font-bold"
                        style={{
                          color: segment.avg_churn_risk > 0.6 ? '#ef4444' : '#10b981',
                        }}
                      >
                        {(segment.avg_churn_risk * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-zinc-800/80 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: segment.avg_churn_risk > 0.6 ? '#ef4444' : '#10b981',
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${segment.avg_churn_risk * 100}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                      />
                    </div>
                    <span className="text-[10px] text-zinc-500 block pt-1">
                      {segment.avg_churn_risk > 0.6
                        ? 'High probability of non-return (P_alive < 0.2)'
                        : 'Strong repeat purchase likelihood'}
                    </span>
                  </div>
                )}

                {metricMode === 'orders' && (
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                    <div className="bg-zinc-800/50 p-1.5 rounded-lg border border-zinc-700/40">
                      <span className="text-[9px] text-zinc-400 block font-sans">Next 30d</span>
                      <span className="text-xs font-bold text-zinc-200">
                        {segment.pred_purchases_30d}
                      </span>
                    </div>
                    <div className="bg-zinc-800/50 p-1.5 rounded-lg border border-zinc-700/40">
                      <span className="text-[9px] text-zinc-400 block font-sans">Next 90d</span>
                      <span className="text-xs font-bold text-zinc-200">
                        {segment.pred_purchases_90d}
                      </span>
                    </div>
                    <div className="bg-zinc-800/50 p-1.5 rounded-lg border border-zinc-700/40">
                      <span className="text-[9px] text-zinc-400 block font-sans">Next 180d</span>
                      <span className="text-xs font-bold text-zinc-200">
                        {segment.pred_purchases_180d}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
