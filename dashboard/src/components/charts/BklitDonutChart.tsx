import React, { useState } from 'react'
import { motion } from 'motion/react'
import type { SegmentData } from '@/types'

interface BklitDonutChartProps {
  segments: SegmentData[]
  totalCustomers: number
}

export const BklitDonutChart: React.FC<BklitDonutChartProps> = ({
  segments,
  totalCustomers,
}) => {
  const [activeSegment, setActiveSegment] = useState<SegmentData | null>(null)

  const size = 200
  const center = size / 2
  const strokeWidth = 24
  const radius = center - strokeWidth / 2
  const circumference = 2 * Math.PI * radius

  let accumulatedPercent = 0

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90 overflow-visible"
        >
          <defs>
            {/* Ambient drop shadow for the 3D glass tube */}
            <filter id="glassTubeShadow" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.8" />
            </filter>

            {/* Specular highlights across the curved glass torus */}
            <linearGradient id="glassTopSheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="25%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0.04" />
              <stop offset="85%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
            </linearGradient>

            {/* Hollow glass tube cavity gradient */}
            <linearGradient id="glassTubeCavity" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.16)" />
              <stop offset="35%" stopColor="rgba(14, 14, 18, 0.95)" />
              <stop offset="70%" stopColor="rgba(8, 8, 10, 0.98)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.08)" />
            </linearGradient>

            {/* Cylindrical crest reflection along tube crown */}
            <linearGradient id="glassCrestHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="28%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="65%" stopColor="#ffffff" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.55" />
            </linearGradient>

            {/* Soft glare blur */}
            <filter id="glassSoftBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1" />
            </filter>

            {/* Internal luminous fluid glow */}
            <filter id="glassLiquidGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Layer 1: Glass Tube Deep Shadow */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="rgba(0, 0, 0, 0.9)"
            strokeWidth={strokeWidth + 2}
            filter="url(#glassTubeShadow)"
          />

          {/* Layer 2: Transparent Hollow Glass Tube Casing */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="url(#glassTubeCavity)"
            strokeWidth={strokeWidth}
          />

          {/* Layer 3: Glass Channel Inset Bevel (Dark Inset Core) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="rgba(0, 0, 0, 0.55)"
            strokeWidth={strokeWidth - 6}
          />

          {/* Layer 4: Encased Luminescent Fluid Slices */}
          {segments.map((segment) => {
            const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`
            const strokeDashoffset = -((accumulatedPercent / 100) * circumference)
            accumulatedPercent += segment.percentage

            const isHovered = activeSegment?.name === segment.name

            return (
              <motion.circle
                key={segment.name}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={segment.color}
                strokeWidth={isHovered ? strokeWidth - 2 : strokeWidth - 6}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="cursor-pointer transition-all duration-300"
                style={{
                  filter: isHovered
                    ? `drop-shadow(0 0 14px ${segment.color}) drop-shadow(0 0 4px #ffffff)`
                    : 'url(#glassLiquidGlow)',
                  opacity: isHovered ? 1 : 0.88,
                }}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                onMouseEnter={() => setActiveSegment(segment)}
                onMouseLeave={() => setActiveSegment(null)}
              />
            )
          })}

          {/* Layer 5: Glass Tube Inner & Outer Clear Rims (Wall Thickness) */}
          {/* Outer Glass Rim */}
          <circle
            cx={center}
            cy={center}
            r={radius + strokeWidth / 2 - 0.75}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.28)"
            strokeWidth={1.2}
            className="pointer-events-none"
          />
          {/* Inner Glass Rim */}
          <circle
            cx={center}
            cy={center}
            r={radius - strokeWidth / 2 + 0.75}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth={1}
            className="pointer-events-none"
          />

          {/* Layer 6: Cylindrical 3D Crown Highlight (Gloss streak along the top curvature of the tube) */}
          <circle
            cx={center}
            cy={center}
            r={radius + strokeWidth * 0.2}
            fill="transparent"
            stroke="url(#glassCrestHighlight)"
            strokeWidth={1.8}
            filter="url(#glassSoftBlur)"
            opacity={0.8}
            className="pointer-events-none"
          />

          {/* Layer 7: Specular Curved Glare Spot (Top-Left light reflection) */}
          <circle
            cx={center}
            cy={center}
            r={radius + strokeWidth * 0.22}
            fill="transparent"
            stroke="#ffffff"
            strokeWidth={2}
            strokeDasharray={`${0.2 * circumference} ${circumference}`}
            strokeDashoffset={`${-0.08 * circumference}`}
            strokeLinecap="round"
            filter="url(#glassSoftBlur)"
            opacity={0.7}
            className="pointer-events-none"
          />

          {/* Layer 8: Overall Glass Overlay Sheen (Gives entire torus glass refraction) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="url(#glassTopSheen)"
            strokeWidth={strokeWidth}
            opacity={0.28}
            style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <motion.div
            key={activeSegment ? activeSegment.name : 'total'}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
              {activeSegment ? activeSegment.name : 'Total Cohort'}
            </span>
            <span className="text-xl font-extrabold text-white font-heading">
              {activeSegment
                ? `${activeSegment.count.toLocaleString()}`
                : totalCustomers.toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-zinc-300 font-semibold">
              {activeSegment ? `${activeSegment.percentage}%` : '100%'}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Legend list */}
      <div className="grid grid-cols-2 gap-2 mt-4 w-full">
        {segments.map((seg) => (
          <div
            key={seg.name}
            className={`flex items-center gap-1.5 p-1.5 rounded-lg cursor-pointer transition-all ${
              activeSegment?.name === seg.name
                ? 'bg-zinc-800/80 border border-zinc-700'
                : 'hover:bg-zinc-800/40'
            }`}
            onMouseEnter={() => setActiveSegment(seg)}
            onMouseLeave={() => setActiveSegment(null)}
          >
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <div className="flex flex-col overflow-hidden">
              <span className="text-[11px] font-medium text-zinc-200 truncate">
                {seg.name}
              </span>
              <span className="text-[9px] font-mono text-zinc-400">
                {seg.count} ({seg.percentage}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
