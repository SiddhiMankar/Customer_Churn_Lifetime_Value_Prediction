import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, X, ExternalLink, AlertTriangle, CheckCircle, Flame } from 'lucide-react'
import type { CustomerRecord } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface CustomerExplorerProps {
  customers: CustomerRecord[]
}

export const CustomerExplorer: React.FC<CustomerExplorerProps> = ({ customers }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSegment, setSelectedSegment] = useState<string>('all')
  const [churnFilter, setChurnFilter] = useState<'all' | 'active' | 'churned'>('all')
  const [sortBy, setSortBy] = useState<keyof CustomerRecord>('cltv')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null)

  const itemsPerPage = 10

  const filteredCustomers = useMemo(() => {
    return customers
      .filter((c) => {
        const matchesSearch = searchQuery === '' || c.id.toString().includes(searchQuery.trim())
        const matchesSegment = selectedSegment === 'all' || c.segment === selectedSegment
        const matchesChurn =
          churnFilter === 'all'
            ? true
            : churnFilter === 'active'
            ? c.is_churned === 0
            : c.is_churned === 1

        return matchesSearch && matchesSegment && matchesChurn
      })
      .sort((a, b) => {
        const valA = a[sortBy]
        const valB = b[sortBy]
        if (sortOrder === 'asc') {
          return valA > valB ? 1 : -1
        } else {
          return valA < valB ? 1 : -1
        }
      })
  }, [customers, searchQuery, selectedSegment, churnFilter, sortBy, sortOrder])

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredCustomers.slice(start, start + itemsPerPage)
  }, [filteredCustomers, currentPage])

  const handleSort = (field: keyof CustomerRecord) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const getSegmentBadge = (segment: string) => {
    switch (segment) {
      case 'Champions':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      case 'Loyal Customers':
        return 'bg-zinc-800 text-zinc-200 border-zinc-700'
      case 'At-Risk':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      case 'Hibernating/Lost':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30'
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700'
    }
  }

  const getRecommendation = (customer: CustomerRecord) => {
    if (customer.segment === 'Champions') {
      return 'Enroll in VIP Loyalty Tier, offer concierge support, and extend early beta/catalog previews to maximize high retention.'
    }
    if (customer.segment === 'Loyal Customers') {
      return 'Deploy automated re-order nudges and bundle deals to maintain purchase frequency before recency decays further.'
    }
    if (customer.segment === 'At-Risk') {
      return 'High priority win-back candidate! Trigger a high-value discount (15-20%) or abandoned basket trigger within the next 7 days.'
    }
    return 'Assign a B2B account rep or review catalog pricing; high past volume indicates high potential for corporate reactivation.'
  }

  return (
    <div className="w-full flex flex-col">
      {/* Search & Filters Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by Customer ID (e.g. 12347)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900/80 border border-zinc-700/80 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition-colors font-mono"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Segment Selector */}
          <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 p-1 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-zinc-400 ml-1.5" />
            <select
              value={selectedSegment}
              onChange={(e) => {
                setSelectedSegment(e.target.value)
                setCurrentPage(1)
              }}
              className="bg-transparent text-xs text-zinc-200 py-1 px-2 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-zinc-900">All Segments</option>
              <option value="Champions" className="bg-zinc-900">Champions</option>
              <option value="Loyal Customers" className="bg-zinc-900">Loyal Customers</option>
              <option value="At-Risk" className="bg-zinc-900">At-Risk</option>
              <option value="Hibernating/Lost" className="bg-zinc-900">Hibernating/Lost</option>
            </select>
          </div>

          {/* Churn Status Toggle */}
          <div className="flex items-center gap-1 bg-zinc-900/80 border border-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => {
                setChurnFilter('all')
                setCurrentPage(1)
              }}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                churnFilter === 'all'
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => {
                setChurnFilter('active')
                setCurrentPage(1)
              }}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                churnFilter === 'active'
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => {
                setChurnFilter('churned')
                setCurrentPage(1)
              }}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                churnFilter === 'churned'
                  ? 'bg-rose-600/80 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Churned
            </button>
          </div>
        </div>
      </div>

      {/* Table Results Counter */}
      <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 px-1">
        <span>
          Showing <strong className="text-zinc-200 font-mono">{filteredCustomers.length.toLocaleString()}</strong> matching customers
        </span>
        <span className="text-[11px] text-zinc-500">
          Click any customer row to inspect individual predictive diagnostic
        </span>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#0e0e11]/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#121214] text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Customer ID</th>
              <th className="py-3 px-4">Segment</th>
              <th
                onClick={() => handleSort('recency')}
                className="py-3 px-4 cursor-pointer hover:text-zinc-200 transition-colors select-none"
              >
                <div className="flex items-center gap-1">
                  Recency
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('frequency')}
                className="py-3 px-4 cursor-pointer hover:text-zinc-200 transition-colors select-none"
              >
                <div className="flex items-center gap-1">
                  Orders
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('monetary')}
                className="py-3 px-4 cursor-pointer hover:text-zinc-200 transition-colors select-none"
              >
                <div className="flex items-center gap-1">
                  Total Spend
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('churn_risk')}
                className="py-3 px-4 cursor-pointer hover:text-zinc-200 transition-colors select-none"
              >
                <div className="flex items-center gap-1">
                  Churn Risk
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('cltv')}
                className="py-3 px-4 cursor-pointer hover:text-zinc-200 transition-colors select-none"
              >
                <div className="flex items-center gap-1">
                  Predicted CLTV (6M)
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {paginatedCustomers.map((customer) => (
              <tr
                key={customer.id}
                onClick={() => setSelectedCustomer(customer)}
                className="hover:bg-zinc-800/40 cursor-pointer transition-colors group"
              >
                <td className="py-3 px-4 font-mono font-medium text-zinc-200 group-hover:text-white transition-colors">
                  #{customer.id}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded-full border ${getSegmentBadge(
                      customer.segment
                    )}`}
                  >
                    {customer.segment}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-zinc-300">
                  {customer.recency}d
                </td>
                <td className="py-3 px-4 font-mono text-zinc-300">
                  {customer.frequency}
                </td>
                <td className="py-3 px-4 font-mono text-zinc-200 font-medium">
                  {formatCurrency(customer.monetary)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-xs font-bold ${
                        customer.churn_risk > 0.6 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {(customer.churn_risk * 100).toFixed(0)}%
                    </span>
                    <div className="w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${customer.churn_risk * 100}%`,
                          backgroundColor:
                            customer.churn_risk > 0.6 ? '#ef4444' : '#10b981',
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-emerald-400 font-bold">
                  {formatCurrency(customer.cltv)}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="p-1 rounded-md text-zinc-400 group-hover:text-white transition-colors inline-block">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-3 px-1 text-xs text-zinc-400">
        <span>
          Page <strong className="text-zinc-200 font-mono">{currentPage}</strong> of{' '}
          <span className="font-mono">{totalPages || 1}</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Customer Diagnostic Detail Modal / Drawer */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#0e0e11] border border-zinc-700/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCustomer(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-zinc-200" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                    Customer #{selectedCustomer.id}
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getSegmentBadge(
                        selectedCustomer.segment
                      )}`}
                    >
                      {selectedCustomer.segment}
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Tenure: {selectedCustomer.tenure} days active in store
                  </p>
                </div>
              </div>

              {/* Status Pill */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 mb-5">
                <div className="flex items-center gap-2">
                  {selectedCustomer.is_churned === 1 ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className="text-xs font-semibold text-zinc-200">
                    Status:{' '}
                    {selectedCustomer.is_churned === 1 ? 'Classified as Churned' : 'Active Returning Customer'}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-zinc-300">
                  P(Alive): {(selectedCustomer.prob_alive * 100).toFixed(1)}%
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                    Historical Spend
                  </span>
                  <span className="text-base font-bold text-white font-mono">
                    {formatCurrency(selectedCustomer.monetary)}
                  </span>
                  <span className="text-[10px] text-zinc-500 block">
                    Across {selectedCustomer.frequency} orders
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                    Predicted 6M CLTV
                  </span>
                  <span className="text-base font-bold text-emerald-400 font-mono">
                    {formatCurrency(selectedCustomer.cltv)}
                  </span>
                  <span className="text-[10px] text-zinc-500 block">
                    Gamma-Gamma modeled value
                  </span>
                </div>
              </div>

              {/* Purchase Frequency Forecast */}
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 mb-5">
                <span className="text-xs font-semibold text-zinc-200 block mb-2">
                  BG/NBD Future Purchase Forecast
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="bg-zinc-800/80 p-2 rounded-lg border border-zinc-700/50">
                    <span className="text-[10px] text-zinc-400 block font-sans">Next 30 Days</span>
                    <span className="text-sm font-bold text-zinc-100">
                      {selectedCustomer.pred_30d} orders
                    </span>
                  </div>
                  <div className="bg-zinc-800/80 p-2 rounded-lg border border-zinc-700/50">
                    <span className="text-[10px] text-zinc-400 block font-sans">Next 90 Days</span>
                    <span className="text-sm font-bold text-zinc-100">
                      {selectedCustomer.pred_90d} orders
                    </span>
                  </div>
                  <div className="bg-zinc-800/80 p-2 rounded-lg border border-zinc-700/50">
                    <span className="text-[10px] text-zinc-400 block font-sans">Next 180 Days</span>
                    <span className="text-sm font-bold text-zinc-100">
                      {selectedCustomer.pred_180d} orders
                    </span>
                  </div>
                </div>
              </div>

              {/* Prescriptive Strategic Action */}
              <div className="p-3.5 rounded-xl bg-zinc-800/50 border border-zinc-700/60">
                <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-wide block mb-1">
                  Recommended Action Plan:
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {getRecommendation(selectedCustomer)}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
