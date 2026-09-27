import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  X,
  FileSpreadsheet,
  BrainCircuit,
  BookOpen,
  ChevronRight,
  Layers,
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  currentPage: 'raw-data' | 'analytics'
  onSelectPage: (page: 'raw-data' | 'analytics') => void
  onOpenModelDoc: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentPage,
  onSelectPage,
  onOpenModelDoc,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blurring the entire main screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Left-hand sliding sidebar drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 bottom-0 left-0 z-50 w-80 sm:w-96 bg-[#0a0a0a] border-r border-zinc-800/80 shadow-2xl flex flex-col justify-between overflow-y-auto"
          >
            {/* Top Section */}
            <div className="p-6">
              {/* Header with Title & Close Button */}
              <div className="flex items-center justify-between pb-5 border-b border-zinc-800/80 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-md">
                    <Layers className="w-5 h-5 text-zinc-200" />
                  </div>
                  <div>
                    <h2 className="font-heading text-base font-bold text-white tracking-wide m-0">
                      Customer Intelligence
                    </h2>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      Navigation &amp; Controls
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors"
                  aria-label="Close sidebar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Menu */}
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block px-2 mb-2">
                    Navigation Views
                  </span>

                  <div className="space-y-2">
                    {/* Page 1: Raw Data & KPIs */}
                    <button
                      onClick={() => {
                        onSelectPage('raw-data')
                        onClose()
                      }}
                      className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all group ${
                        currentPage === 'raw-data'
                          ? 'bg-zinc-800/90 border-zinc-600 shadow-lg shadow-black/40'
                          : 'bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-850 hover:border-zinc-700'
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-lg mt-0.5 transition-colors ${
                          currentPage === 'raw-data'
                            ? 'bg-zinc-700 text-white'
                            : 'bg-zinc-800 text-zinc-400 group-hover:text-zinc-200'
                        }`}
                      >
                        <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-bold font-heading ${
                              currentPage === 'raw-data'
                                ? 'text-white'
                                : 'text-zinc-300 group-hover:text-white'
                            }`}
                          >
                            Page 1: Raw Data &amp; KPIs
                          </span>
                          {currentPage === 'raw-data' && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                          Excel-style spreadsheet viewer &amp; core executive revenue &amp; churn metrics.
                        </p>
                      </div>
                    </button>

                    {/* Page 2: Predictive Analytics & Intelligence */}
                    <button
                      onClick={() => {
                        onSelectPage('analytics')
                        onClose()
                      }}
                      className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all group ${
                        currentPage === 'analytics'
                          ? 'bg-zinc-800/90 border-zinc-600 shadow-lg shadow-black/40'
                          : 'bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-850 hover:border-zinc-700'
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-lg mt-0.5 transition-colors ${
                          currentPage === 'analytics'
                            ? 'bg-zinc-700 text-white'
                            : 'bg-zinc-800 text-zinc-400 group-hover:text-zinc-200'
                        }`}
                      >
                        <BrainCircuit className="w-5 h-5 text-zinc-300" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-bold font-heading ${
                              currentPage === 'analytics'
                                ? 'text-white'
                                : 'text-zinc-300 group-hover:text-white'
                            }`}
                          >
                            Page 2: Predictive Analytics
                          </span>
                          {currentPage === 'analytics' && (
                            <span className="w-2 h-2 rounded-full bg-zinc-300 animate-pulse" />
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                          Bklit Notch Gauge, Churn Risk Spectrum, Cohort Donut, Segment Deep-Dive, &amp; Explorer.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Quick Shortcuts & Documentation */}
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block px-2 mb-2">
                    Methodology &amp; Architecture
                  </span>

                  <button
                    onClick={() => {
                      onOpenModelDoc()
                      onClose()
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all text-xs group"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-zinc-400" />
                      <span className="font-medium">Model Formulas &amp; Methodology</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* Model Architecture Metadata */}
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-2 text-[11px]">
                  <span className="text-zinc-400 font-semibold block uppercase tracking-wide text-[10px]">
                    Pipeline Specifications
                  </span>
                  <div className="flex justify-between text-zinc-400">
                    <span>Dataset:</span>
                    <span className="font-mono text-zinc-200">online_retail_II</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Profiles:</span>
                    <span className="font-mono text-zinc-200">4,285 customers</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Churn Model:</span>
                    <span className="font-mono text-zinc-200">BG/NBD</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>CLTV Model:</span>
                    <span className="font-mono text-zinc-200">Gamma-Gamma</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Segmentation:</span>
                    <span className="font-mono text-zinc-200">K-Means (k=4)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Attribution */}
            <div className="p-5 border-t border-zinc-800/80 bg-zinc-950 text-[11px] text-zinc-500 flex items-center justify-between">
              <span>Customer Churn &amp; CLTV</span>
              <span className="font-mono text-zinc-400">v1.2</span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
