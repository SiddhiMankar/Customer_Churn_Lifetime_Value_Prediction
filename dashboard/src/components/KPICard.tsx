import React from 'react'
import { motion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  subValue?: string
  badgeText?: string
  badgeVariant?: 'success' | 'danger' | 'warning' | 'info'
  icon?: LucideIcon
  iconColor?: string
  index?: number
  isSelected?: boolean
  onClick?: () => void
  highlightColor?: 'emerald' | 'rose' | 'amber' | 'zinc'
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subValue,
  badgeText,
  badgeVariant = 'info',
  icon: Icon,
  iconColor = 'text-zinc-300',
  index = 0,
  isSelected = false,
  onClick,
  highlightColor = 'zinc',
}) => {
  const badgeClasses = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    info: 'bg-zinc-800/80 text-zinc-300 border-zinc-700/60',
  }[badgeVariant]

  const selectedBorderStyles = {
    emerald: 'border-emerald-500/80 ring-2 ring-emerald-500/30 bg-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    rose: 'border-rose-500/80 ring-2 ring-rose-500/30 bg-rose-950/20 shadow-[0_0_20px_rgba(244,63,94,0.15)]',
    amber: 'border-amber-500/80 ring-2 ring-amber-500/30 bg-amber-950/20 shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    zinc: 'border-zinc-400 ring-2 ring-zinc-400/30 bg-zinc-800/40 shadow-[0_0_20px_rgba(255,255,255,0.08)]',
  }[highlightColor]

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onClick}
      className={`p-5 rounded-2xl glass-panel relative overflow-hidden group transition-all duration-300 h-full flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:border-zinc-500/70 hover:scale-[1.01]' : ''
      } ${isSelected ? selectedBorderStyles : 'hover:border-zinc-700/80'}`}
    >
      {/* Background neutral grey highlight */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/[0.03] rounded-full blur-2xl group-hover:bg-white/[0.07] transition-all duration-500" />

      <div>
        <div className="flex items-start justify-between mb-2 relative z-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {title}
          </span>
          {Icon && (
            <div className="p-2 rounded-xl border bg-zinc-800/70 border-zinc-700/60 transition-colors">
              <Icon className={`w-4 h-4 ${iconColor}`} />
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2 mb-1 relative z-10">
          <span className="font-heading text-2xl lg:text-3xl font-bold text-white tracking-tight">
            {value}
          </span>
          {badgeText && (
            <span
              className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${badgeClasses}`}
            >
              {badgeText}
            </span>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-1">
        {subValue && (
          <span className="text-xs text-zinc-400 font-sans block">
            {subValue}
          </span>
        )}
      </div>
    </motion.div>
  )
}
