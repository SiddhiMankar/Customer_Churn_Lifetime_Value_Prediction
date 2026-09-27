import React, { useMemo } from 'react'
import { motion } from 'motion/react'

interface BklitGaugeProps {
  value: number // 0 to 100
  totalNotches?: number
  defaultLabel?: string
  centerValue?: string | number
  subLabel?: string
  color?: string
  gradientFrom?: string
  gradientTo?: string
  size?: number
}

export const BklitGauge: React.FC<BklitGaugeProps> = ({
  value,
  totalNotches = 36,
  defaultLabel = 'Churn Rate',
  centerValue,
  subLabel = 'Threshold: < 20% Alive',
  gradientFrom = '#f59e0b',
  gradientTo = '#ef4444',
  size = 280,
}) => {
  // Arc parameters: 270 degrees sweep from 135 to 405
  const startAngle = 135
  const sweepAngle = 270
  const activeNotchesCount = Math.round((Math.min(100, Math.max(0, value)) / 100) * totalNotches)

  const notches = useMemo(() => {
    const list = []
    const center = size / 2
    const outerRadius = size * 0.44
    const innerRadius = size * 0.35

    for (let i = 0; i < totalNotches; i++) {
      const fraction = i / (totalNotches - 1)
      const angleDeg = startAngle + fraction * sweepAngle
      const angleRad = (angleDeg * Math.PI) / 180

      const cos = Math.cos(angleRad)
      const sin = Math.sin(angleRad)

      const x1 = center + innerRadius * cos
      const y1 = center + innerRadius * sin
      const x2 = center + outerRadius * cos
      const y2 = center + outerRadius * sin

      const isActive = i < activeNotchesCount

      list.push({
        index: i,
        x1,
        y1,
        x2,
        y2,
        isActive,
        fraction,
      })
    }
    return list
  }, [value, totalNotches, size, activeNotchesCount])

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="gaugeActiveGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradientFrom} />
            <stop offset="100%" stopColor={gradientTo} />
          </linearGradient>
          <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Notches */}
        {notches.map((notch) => (
          <motion.line
            key={notch.index}
            x1={notch.x1}
            y1={notch.y1}
            x2={notch.x2}
            y2={notch.y2}
            stroke={notch.isActive ? 'url(#gaugeActiveGradient)' : 'var(--gauge-inactive-notch, rgba(255, 255, 255, 0.08))'}
            strokeWidth={size > 240 ? 4 : 3}
            strokeLinecap="round"
            filter={notch.isActive ? 'url(#gaugeGlow)' : undefined}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: notch.isActive ? 1 : 0.85,
              scale: 1,
            }}
            transition={{
              duration: 0.4,
              delay: notch.index * 0.015,
              ease: 'easeOut',
            }}
          />
        ))}
      </svg>

      {/* Center Label (Bklit style overlay) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none mt-2">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium mb-1">
            {defaultLabel}
          </span>
          <span className="text-4xl font-extrabold tracking-tight text-white font-heading">
            {centerValue ?? `${value.toFixed(1)}%`}
          </span>
          {subLabel && (
            <span className="text-[11px] text-zinc-400 mt-1 max-w-[140px] leading-tight">
              {subLabel}
            </span>
          )}
        </motion.div>
      </div>
    </div>
  )
}
