import React, { useState } from 'react'
import { motion } from 'motion/react'
import type { ChurnDistributionBin } from '@/types'

interface BklitAreaChartProps {
  data: ChurnDistributionBin[]
  title?: string
}

export const BklitAreaChart: React.FC<BklitAreaChartProps> = ({ data, title = 'Customer Churn Risk Spectrum' }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const maxCount = Math.max(...data.map(d => d.count), 1)

  // Risk bin colors from emerald (safe) to teal, amber, orange, crimson (critical)
  const barColors = [
    { start: '#10b981', end: '#059669', glow: 'rgba(16, 185, 129, 0.4)' }, // 0-20% (Safe)
    { start: '#14b8a6', end: '#0d4c94ff', glow: 'rgba(20, 80, 184, 0.4)' }, // 20-40% (Low-Mod)
    { start: '#eab308', end: '#ca8a04', glow: 'rgba(234, 179, 8, 0.4)' },  // 40-60% (Moderate)
    { start: '#f97316', end: '#ea580c', glow: 'rgba(249, 115, 22, 0.4)' }, // 60-80% (High)
    { start: '#ef4444', end: '#dc2626', glow: 'rgba(239, 68, 68, 0.4)' },  // 80-100% (Critical)
  ]

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse" />
          {title}
        </h3>
        <span className="text-xs text-zinc-400 font-mono">
          BG/NBD Risk Score (1 - P_alive)
        </span>
      </div>

      {/* Chart container */}
      <div className="h-56 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2 relative border-b border-zinc-800">
        {/* Background Grid Lines */}
        <div className="absolute inset-x-0 top-0 bottom-6 pointer-events-none flex flex-col justify-between opacity-15">
          <div className="border-b border-dashed border-zinc-600 w-full" />
          <div className="border-b border-dashed border-zinc-600 w-full" />
          <div className="border-b border-dashed border-zinc-600 w-full" />
        </div>

        {data.map((bin, index) => {
          const heightPercent = (bin.count / maxCount) * 100
          const color = barColors[index % barColors.length]
          const isHovered = hoveredIdx === index

          return (
            <div
              key={bin.range}
              className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer z-10"
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip on hover */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute -top-12 z-30 bg-zinc-900/95 border border-zinc-700/80 rounded-lg px-3 py-1.5 shadow-xl text-center pointer-events-none whitespace-nowrap"
                >
                  <p className="text-[11px] text-zinc-400">{bin.range}</p>
                  <p className="text-xs font-bold text-white font-mono">
                    {bin.count.toLocaleString()} customers ({bin.percentage}%)
                  </p>
                </motion.div>
              )}

              {/* Bar Fill with Motion.dev spring */}
              <div className="w-full max-w-[56px] h-full flex items-end">
                <motion.div
                  className="w-full rounded-t-lg relative transition-all duration-200"
                  style={{
                    background: `linear-gradient(180deg, ${color.start}, ${color.end})`,
                    boxShadow: isHovered ? `0 0 20px ${color.glow}` : `0 0 10px ${color.glow}`,
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{
                    type: 'spring',
                    stiffness: 70,
                    damping: 14,
                    delay: index * 0.08,
                  }}
                >
                  {/* Subtle top cap shimmer */}
                  <div className="w-full h-1 bg-white/40 rounded-t-lg" />
                </motion.div>
              </div>

              {/* Count label above bar */}
              <motion.span
                className="text-[11px] font-mono text-zinc-300 mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                {bin.count}
              </motion.span>
            </div>
          )
        })}
      </div>

      {/* X Axis Labels */}
      <div className="flex justify-between gap-3 px-2 pt-2">
        {data.map((bin) => (
          <div key={bin.range} className="flex-1 text-center">
            <span className="text-[10px] text-zinc-400 block truncate font-medium">
              {bin.range.split(' ')[0]}
            </span>
            <span className="text-[9px] text-zinc-500 font-mono block">
              {bin.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
