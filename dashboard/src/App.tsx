import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import {
  DollarSign,
  TrendingUp,
  AlertOctagon,
  Users,
  Menu,
  BookOpen,
  BarChart3,
  RefreshCw,
  Layers,
  FileSpreadsheet,
} from 'lucide-react'
import type { SummaryData, CustomerRecord, RawTransaction } from '@/types'
import { KPICard } from '@/components/KPICard'
import { BklitGauge } from '@/components/charts/BklitGauge'
import { BklitAreaChart } from '@/components/charts/BklitAreaChart'
import { BklitDonutChart } from '@/components/charts/BklitDonutChart'
import { BklitSegmentBarChart } from '@/components/charts/BklitSegmentBarChart'
import { CustomerExplorer } from '@/components/CustomerExplorer'
import { ExcelSheetView } from '@/components/ExcelSheetView'
import { Sidebar } from '@/components/Sidebar'
import { ModelExplanationModal } from '@/components/ModelExplanationModal'
import { formatCurrency } from '@/lib/utils'

export default function App() {
  const [currentPage, setCurrentPage] = useState<'raw-data' | 'analytics'>('raw-data')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [customers, setCustomers] = useState<CustomerRecord[]>([])
  const [transactions, setTransactions] = useState<RawTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [gaugeMode, setGaugeMode] = useState<'churn' | 'retention'>('churn')
  const [activeHighlight, setActiveHighlight] = useState<'cltv' | 'churn' | 'active' | 'spend' | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [sumRes, custRes, txRes] = await Promise.all([
          fetch('/data/summary.json'),
          fetch('/data/customers.json'),
          fetch('/data/raw_transactions_sample.json'),
        ])
        const sumData: SummaryData = await sumRes.json()
        const custData: CustomerRecord[] = await custRes.json()
        const txData: RawTransaction[] = await txRes.json()

        setSummary(sumData)
        setCustomers(custData)
        setTransactions(txData)
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading || !summary) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-zinc-300">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          className="w-12 h-12 rounded-full border-2 border-zinc-400 border-t-transparent mb-4"
        />
        <p className="font-heading text-lg font-semibold tracking-wide text-zinc-200">
          Loading Data &amp; Intelligence Pipeline...
        </p>
        <span className="text-xs text-zinc-500 mt-1 font-mono">
          Parsing transactions &amp; 4,285 customer models
        </span>
      </div>
    )
  }

  const { kpis, segments, churn_distribution } = summary

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col selection:bg-zinc-700/50 selection:text-white">
      {/* Top Ambient Grey Highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-white/[0.07] via-zinc-400/[0.02] to-transparent blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#050505]/90 backdrop-blur-xl border-b border-zinc-800/80 px-4 sm:px-6 py-3">
        <div className="w-full flex items-center justify-between gap-4">
          {/* Top-Left: Sidebar Toggle (Far Left) & Branding */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-center group cursor-pointer shadow-md"
              title="Open Navigation Sidebar"
              aria-label="Open Navigation Sidebar"
            >
              <Menu className="w-5 h-5 text-zinc-300 group-hover:text-white group-hover:scale-110 transition-transform" />
            </button>

            <div>
              <h1 className="font-heading text-2xl tracking-tight text-white m-0">
                Customer Churn &amp; CLTV Intelligence
              </h1>
            </div>
          </div>

          {/* Top-Right: Quick Page Switcher & Methodology Button */}
          <div className="flex items-center gap-2.5">
            {/* Direct Page Switcher Buttons */}
            <div className="hidden sm:flex items-center bg-zinc-900/90 border border-zinc-800 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => setCurrentPage('raw-data')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  currentPage === 'raw-data'
                    ? 'bg-zinc-700 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Raw Data</span>
              </button>
              <button
                onClick={() => setCurrentPage('analytics')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  currentPage === 'analytics'
                    ? 'bg-zinc-700 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Analytics</span>
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden md:inline">Methodology</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 sm:py-6 flex-1 w-full relative z-10">
        {/* ============================================================== */}
        {/* PAGE 1: EXCEL RAW DATA SHEET & THE 4 CORE EXECUTIVE COMPONENTS */}
        {/* ============================================================== */}
        {currentPage === 'raw-data' && (
          <motion.div
            key="page-raw-data"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {/* Split Layout: Excel Sheet on Left (maximum area), 4 KPI Cards on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch h-[calc(100vh-140px)] min-h-[640px]">
              {/* Left Column: Excel Sheet Interface */}
              <div className="lg:col-span-8 xl:col-span-9 flex flex-col h-full overflow-hidden">
                <ExcelSheetView
                  transactions={transactions}
                  customers={customers}
                  activeHighlight={activeHighlight}
                  onClearHighlight={() => setActiveHighlight(null)}
                />
              </div>

              {/* Right Column: The 4 Core Components Vertically Stacked & Aligned */}
              <div className="lg:col-span-4 xl:col-span-3 grid grid-rows-4 gap-3.5 h-full">
                <KPICard
                  title="Predicted 6M CLTV"
                  value={formatCurrency(kpis.total_cltv)}
                  subValue={`Avg: ${formatCurrency(kpis.avg_cltv)} • Median: ${formatCurrency(kpis.median_cltv)}`}
                  badgeText="Gamma-Gamma"
                  badgeVariant="success"
                  icon={DollarSign}
                  iconColor="text-emerald-400"
                  index={0}
                  isSelected={activeHighlight === 'cltv'}
                  onClick={() => setActiveHighlight(activeHighlight === 'cltv' ? null : 'cltv')}
                  highlightColor="amber"
                />

                <KPICard
                  title="Customer Churn Rate"
                  value={`${kpis.churn_rate}%`}
                  subValue={`${kpis.churned_count.toLocaleString()} customers flagged at-risk`}
                  badgeText="P(Alive) < 0.20"
                  badgeVariant="danger"
                  icon={AlertOctagon}
                  iconColor="text-rose-400"
                  index={1}
                  isSelected={activeHighlight === 'churn'}
                  onClick={() => setActiveHighlight(activeHighlight === 'churn' ? null : 'churn')}
                  highlightColor="rose"
                />

                <KPICard
                  title="Active Returning Base"
                  value={`${(100 - kpis.churn_rate).toFixed(1)}%`}
                  subValue={`${kpis.active_count.toLocaleString()} customers with regular repeat cadence`}
                  badgeText="Healthy"
                  badgeVariant="info"
                  icon={TrendingUp}
                  iconColor="text-zinc-200"
                  index={2}
                  isSelected={activeHighlight === 'active'}
                  onClick={() => setActiveHighlight(activeHighlight === 'active' ? null : 'active')}
                  highlightColor="emerald"
                />

                <KPICard
                  title="Cohort Size & Spend"
                  value={`${kpis.total_customers.toLocaleString()}`}
                  subValue={`Avg Spend: ${formatCurrency(kpis.avg_monetary)} • Avg Orders: ${kpis.avg_frequency}`}
                  badgeText="Cleaned & Capped"
                  badgeVariant="warning"
                  icon={Users}
                  iconColor="text-amber-400"
                  index={3}
                  isSelected={activeHighlight === 'spend'}
                  onClick={() => setActiveHighlight(activeHighlight === 'spend' ? null : 'spend')}
                  highlightColor="zinc"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* ============================================================== */}
        {/* PAGE 2: PREDICTIVE ANALYTICS & CUSTOMER INTELLIGENCE (ORIGINAL) */}
        {/* ============================================================== */}
        {currentPage === 'analytics' && (
          <motion.div
            key="page-analytics"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Visual Analytics Showcase (Bklit UI + Motion.dev) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Card 1: Bklit Notch Gauge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-4 p-6 rounded-2xl glass-panel flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      Bklit Notch Gauge
                    </h3>
                    <button
                      onClick={() =>
                        setGaugeMode(gaugeMode === 'churn' ? 'retention' : 'churn')
                      }
                      className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 bg-zinc-850 px-2 py-0.5 rounded-md border border-zinc-700/60 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Toggle</span>
                    </button>
                  </div>
                  <p className="text-xs text-zinc-400">
                    {gaugeMode === 'churn'
                      ? 'BG/NBD Customer Dropout Risk Rate'
                      : 'Active Customer Retention Rate'}
                  </p>
                </div>

                <div className="my-3 flex items-center justify-center">
                  <BklitGauge
                    value={gaugeMode === 'churn' ? kpis.churn_rate : 100 - kpis.churn_rate}
                    totalNotches={38}
                    defaultLabel={gaugeMode === 'churn' ? 'Churn Rate' : 'Retention Rate'}
                    centerValue={
                      gaugeMode === 'churn'
                        ? `${kpis.churn_rate}%`
                        : `${(100 - kpis.churn_rate).toFixed(1)}%`
                    }
                    subLabel={
                      gaugeMode === 'churn'
                        ? `${kpis.churned_count.toLocaleString()} Churned`
                        : `${kpis.active_count.toLocaleString()} Active`
                    }
                    gradientFrom={gaugeMode === 'churn' ? '#f59e0b' : '#a1a1aa'}
                    gradientTo={gaugeMode === 'churn' ? '#ef4444' : '#10b981'}
                    size={270}
                  />
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-center">
                  <span className="text-[11px] text-zinc-400 block font-medium">
                    Decision Criterion:
                  </span>
                  <span className="text-xs font-mono text-zinc-300">
                    A customer is flagged churned if <span className="text-rose-400 font-bold">P(Alive) &lt; 0.20</span>
                  </span>
                </div>
              </motion.div>

              {/* Card 2: Bklit Churn Risk Spectrum */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="lg:col-span-5 p-6 rounded-2xl glass-panel flex flex-col justify-between"
              >
                <BklitAreaChart data={churn_distribution} />

                <div className="mt-4 pt-3 border-t border-zinc-800/80 grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-800/60">
                    <span className="text-zinc-400 block text-[10px] uppercase font-medium">Safe (&lt; 20% Risk)</span>
                    <span className="font-mono text-emerald-400 font-bold text-sm">
                      {churn_distribution[0]?.count.toLocaleString()}{' '}
                      <span className="text-[11px] text-zinc-500 font-normal">
                        ({churn_distribution[0]?.percentage}%)
                      </span>
                    </span>
                  </div>
                  <div className="bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-800/60">
                    <span className="text-zinc-400 block text-[10px] uppercase font-medium">Critical (&gt; 80% Risk)</span>
                    <span className="font-mono text-rose-400 font-bold text-sm">
                      {churn_distribution[4]?.count.toLocaleString()}{' '}
                      <span className="text-[11px] text-zinc-500 font-normal">
                        ({churn_distribution[4]?.percentage}%)
                      </span>
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Segment Donut Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-3 p-6 rounded-2xl glass-panel flex flex-col justify-between"
              >
                <div className="mb-2">
                  <h3 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase flex items-center gap-2">
                    <Layers className="w-4 h-4 text-zinc-300" />
                    Cohort Distribution
                  </h3>
                  <p className="text-xs text-zinc-400">
                    4 Discovered Customer Clusters
                  </p>
                </div>

                <div className="my-2">
                  <BklitDonutChart
                    segments={segments}
                    totalCustomers={kpis.total_customers}
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-center">
                  <span className="text-[11px] text-zinc-400">
                    Champions drive <strong className="text-emerald-400 font-mono">69.2%</strong> of predicted revenue
                  </span>
                </div>
              </motion.div>
            </section>

            {/* Section: Segment Deep Dive & Comparison */}
            <section className="p-6 rounded-2xl glass-panel">
              <BklitSegmentBarChart segments={segments} />
            </section>

            {/* Section: Interactive Customer Explorer & Diagnostic */}
            <section className="p-6 rounded-2xl glass-panel">
              <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
                <div>
                  <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2 m-0">
                    <BarChart3 className="w-5 h-5 text-zinc-300" />
                    Customer Intelligence Explorer
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Explore all 4,285 customer profiles with dynamic filtering, sorting, and diagnostic action plans
                  </p>
                </div>
              </div>

              <CustomerExplorer customers={customers} />
            </section>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#050505]/90 px-6 py-6 mt-12 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Customer Churn &amp; CLTV Prediction • Advanced Data Science Mini-Project
          </p>
          <p className="flex items-center gap-1.5 font-mono text-[11px]">
            <span>Powered by</span>
            <span className="text-zinc-300 font-semibold">Motion.dev</span>
            <span>&amp;</span>
            <span className="text-zinc-300 font-semibold">Bklit.ui</span>
          </p>
        </div>
      </footer>

      {/* Sidebar with Blurred Backdrop */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        onOpenModelDoc={() => setIsModalOpen(true)}
      />

      {/* Model Methodology Modal */}
      <ModelExplanationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
