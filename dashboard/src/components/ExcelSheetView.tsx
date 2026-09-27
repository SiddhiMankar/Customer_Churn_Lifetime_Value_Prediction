import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import {
  FileSpreadsheet,
  Search,
  Download,
  Table as TableIcon,
  X,
  DollarSign,
  AlertOctagon,
  TrendingUp,
  Users,
} from 'lucide-react'
import type { RawTransaction, CustomerRecord } from '@/types'

export type HighlightType = 'cltv' | 'churn' | 'active' | 'spend' | null

interface ExcelSheetViewProps {
  transactions: RawTransaction[]
  customers: CustomerRecord[]
  activeHighlight?: HighlightType
  onClearHighlight?: () => void
}

type SheetTab = 'transactions' | 'rfm_profiles'

const ROW_HEIGHT = 35 // Exact row height in pixels for virtualized continuous scroll

export const ExcelSheetView: React.FC<ExcelSheetViewProps> = ({
  transactions,
  customers,
  activeHighlight = null,
  onClearHighlight,
}) => {
  const [activeTab, setActiveTab] = useState<SheetTab>('transactions')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOnlyMatches, setFilterOnlyMatches] = useState(false)
  const [selectedCell, setSelectedCell] = useState<{
    col: string
    row: number
    value: string
  }>({
    col: 'A',
    row: 1,
    value: transactions[0]?.invoice || '489434',
  })

  // Virtualization scroll state
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(550)

  // Measure viewport height dynamically
  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return

    const updateDimensions = () => {
      setViewportHeight(el.clientHeight || 550)
    }

    updateDimensions()
    const resizeObserver = new ResizeObserver(updateDimensions)
    resizeObserver.observe(el)

    return () => resizeObserver.disconnect()
  }, [])

  // Fast customer ID map for transaction lookup
  const customerMap = useMemo(() => {
    const map = new Map<number, CustomerRecord>()
    customers.forEach((c) => map.set(c.id, c))
    return map
  }, [customers])

  // Enriched customers data with explicit analytical columns for Sheet 2
  const enrichedCustomers = useMemo(() => {
    return customers.map((c) => ({
      ...c,
      churn_status: c.is_churned === 1 ? 'Churned' : 'Active',
      churn_risk_pct: `${(c.churn_risk * 100).toFixed(0)}%`,
      cltv_formatted: `$${c.cltv.toFixed(2)}`,
    }))
  }, [customers])

  // Columns specification
  const txColumns = [
    { key: 'invoice', letter: 'A', label: 'Invoice', width: 'w-24' },
    { key: 'stock_code', letter: 'B', label: 'StockCode', width: 'w-28' },
    { key: 'description', letter: 'C', label: 'Description', width: 'w-72' },
    { key: 'quantity', letter: 'D', label: 'Quantity', width: 'w-24', isNum: true },
    { key: 'invoice_date', letter: 'E', label: 'InvoiceDate', width: 'w-44' },
    { key: 'price', letter: 'F', label: 'Price ($)', width: 'w-24', isNum: true },
    { key: 'customer_id', letter: 'G', label: 'Customer ID', width: 'w-32' },
    { key: 'country', letter: 'H', label: 'Country', width: 'w-36' },
  ]

  const rfmColumns = [
    { key: 'id', letter: 'A', label: 'Customer ID', width: 'w-28' },
    { key: 'segment', letter: 'B', label: 'Segment', width: 'w-36' },
    { key: 'recency', letter: 'C', label: 'Recency (Days)', width: 'w-32', isNum: true },
    { key: 'frequency', letter: 'D', label: 'Orders', width: 'w-24', isNum: true },
    { key: 'monetary', letter: 'E', label: 'Monetary ($)', width: 'w-32', isNum: true },
    { key: 'churn_status', letter: 'F', label: 'Status', width: 'w-28' },
    { key: 'churn_risk_pct', letter: 'G', label: 'Churn Risk', width: 'w-28', isNum: true },
    { key: 'cltv_formatted', letter: 'H', label: 'Predicted 6M CLTV', width: 'w-36', isNum: true },
  ]

  // Evaluation of row matching for active KPI block highlights
  const checkRowHighlight = useCallback(
    (rowItem: any, isTx: boolean): {
      isMatch: boolean
      color: 'rose' | 'emerald' | 'amber' | 'zinc'
    } => {
      if (!activeHighlight) return { isMatch: false, color: 'zinc' }

      if (isTx) {
        const custId = Number(rowItem.customer_id)
        const cust = customerMap.get(custId)
        if (activeHighlight === 'cltv') {
          return { isMatch: (cust?.cltv ?? 0) >= 802.13, color: 'amber' }
        }
        if (activeHighlight === 'churn') {
          return { isMatch: cust?.is_churned === 1, color: 'rose' }
        }
        if (activeHighlight === 'active') {
          return { isMatch: cust?.is_churned === 0, color: 'emerald' }
        }
        if (activeHighlight === 'spend') {
          const isMatch = (cust?.monetary ?? 0) >= 1429.48 || rowItem.quantity * rowItem.price >= 100
          return { isMatch, color: 'zinc' }
        }
      } else {
        if (activeHighlight === 'cltv') {
          return { isMatch: rowItem.cltv >= 802.13, color: 'amber' }
        }
        if (activeHighlight === 'churn') {
          return { isMatch: rowItem.is_churned === 1, color: 'rose' }
        }
        if (activeHighlight === 'active') {
          return { isMatch: rowItem.is_churned === 0, color: 'emerald' }
        }
        if (activeHighlight === 'spend') {
          return { isMatch: rowItem.monetary >= 1429.48, color: 'zinc' }
        }
      }

      return { isMatch: false, color: 'zinc' }
    },
    [activeHighlight, customerMap]
  )

  // Filter dataset by search and optional "only matches" toggle
  const filteredTransactions = useMemo(() => {
    let result = transactions
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (t) =>
          t.invoice.toLowerCase().includes(q) ||
          t.stock_code.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.customer_id.toString().includes(q) ||
          t.country.toLowerCase().includes(q)
      )
    }
    if (activeHighlight && filterOnlyMatches) {
      result = result.filter((t) => checkRowHighlight(t, true).isMatch)
    }
    return result
  }, [transactions, searchQuery, activeHighlight, filterOnlyMatches, checkRowHighlight])

  const filteredCustomers = useMemo(() => {
    let result = enrichedCustomers
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (c) =>
          c.id.toString().includes(q) ||
          c.segment.toLowerCase().includes(q) ||
          c.churn_status.toLowerCase().includes(q)
      )
    }
    if (activeHighlight && filterOnlyMatches) {
      result = result.filter((c) => checkRowHighlight(c, false).isMatch)
    }
    return result
  }, [enrichedCustomers, searchQuery, activeHighlight, filterOnlyMatches, checkRowHighlight])

  // Count total matches in the active full dataset
  const totalMatchesCount = useMemo(() => {
    if (!activeHighlight) return 0
    if (activeTab === 'transactions') {
      return transactions.filter((t) => checkRowHighlight(t, true).isMatch).length
    } else {
      return enrichedCustomers.filter((c) => checkRowHighlight(c, false).isMatch).length
    }
  }, [activeHighlight, activeTab, transactions, enrichedCustomers, checkRowHighlight])

  const currentDataset = activeTab === 'transactions' ? filteredTransactions : filteredCustomers
  const totalRowsInDataset = currentDataset.length

  // Continuous scroll virtualization calculation
  const bufferRows = 20
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - bufferRows)
  const visibleCount = Math.ceil(viewportHeight / ROW_HEIGHT) + bufferRows * 2
  const endIndex = Math.min(totalRowsInDataset, startIndex + visibleCount)

  const visibleRows = useMemo(() => {
    return currentDataset.slice(startIndex, endIndex)
  }, [currentDataset, startIndex, endIndex])

  const topSpacerHeight = startIndex * ROW_HEIGHT
  const bottomSpacerHeight = Math.max(0, (totalRowsInDataset - endIndex) * ROW_HEIGHT)

  // Handle scroll event
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  // Handle tab switch - scroll smoothly back to top
  const handleTabSwitch = (tab: SheetTab) => {
    setActiveTab(tab)
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
    }
    setScrollTop(0)
  }

  const handleCellClick = (colLetter: string, rowIdx: number, val: any) => {
    setSelectedCell({
      col: colLetter,
      row: rowIdx,
      value: String(val ?? ''),
    })
  }

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      (activeTab === 'transactions'
        ? 'Invoice,StockCode,Description,Quantity,InvoiceDate,Price,CustomerID,Country\n' +
          transactions
            .map(
              (t) =>
                `${t.invoice},${t.stock_code},"${t.description}",${t.quantity},${t.invoice_date},${t.price},${t.customer_id},${t.country}`
            )
            .join('\n')
        : 'CustomerID,Segment,Recency,Frequency,Monetary,ChurnStatus,ChurnRisk,Predicted6MCLTV\n' +
          enrichedCustomers
            .map(
              (c) =>
                `${c.id},"${c.segment}",${c.recency},${c.frequency},${c.monetary},${c.churn_status},${c.churn_risk_pct},${c.cltv}`
            )
            .join('\n'))
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute(
      'download',
      activeTab === 'transactions' ? 'online_retail_raw.csv' : 'rfm_customer_data.csv'
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Highlight badge metadata
  const highlightInfo = {
    cltv: {
      title: 'Predicted 6M CLTV',
      desc: 'Top CLTV (≥ $802 Avg Benchmark)',
      badge: 'bg-amber-950/70 border-amber-600/60 text-amber-300',
      dot: 'bg-amber-400',
      icon: DollarSign,
    },
    churn: {
      title: 'Customer Churn Rate',
      desc: 'Churned Customers (P_alive < 0.20)',
      badge: 'bg-rose-950/70 border-rose-600/60 text-rose-300',
      dot: 'bg-rose-400',
      icon: AlertOctagon,
    },
    active: {
      title: 'Active Returning Base',
      desc: 'Active Repeat Cadence (P_alive ≥ 0.20)',
      badge: 'bg-emerald-950/70 border-emerald-600/60 text-emerald-300',
      dot: 'bg-emerald-400',
      icon: TrendingUp,
    },
    spend: {
      title: 'Cohort Size & Spend',
      desc: 'Above-Average Spend (≥ $1,429 Benchmark)',
      badge: 'bg-zinc-800 border-zinc-600 text-zinc-100',
      dot: 'bg-zinc-300',
      icon: Users,
    },
  }

  const cols = activeTab === 'transactions' ? txColumns : rfmColumns

  return (
    <div className="flex flex-col h-full rounded-2xl glass-panel border border-zinc-800 overflow-hidden shadow-2xl">
      {/* Formula & Coordinate Bar (Topmost Bar of Excel Window) */}
      <div className="bg-[#0e0e11] border-b border-zinc-800/80 px-3 py-2 flex flex-wrap items-center gap-2 text-xs font-mono">
        {/* Active Cell Coordinates */}
        <div className="bg-zinc-900 border border-zinc-700/80 rounded px-2.5 py-1 text-emerald-400 font-bold min-w-[52px] text-center shadow-inner">
          {selectedCell.col}{selectedCell.row}
        </div>
        <div className="text-zinc-500 font-bold px-1 select-none font-serif italic text-sm">
          fx
        </div>
        <div className="flex-1 min-w-[120px] bg-zinc-900/80 border border-zinc-800 rounded px-3 py-1 text-zinc-200 truncate">
          {selectedCell.value}
        </div>

        {/* Active KPI Highlight Indicator (Triggered by clicking blocks) */}
        {activeHighlight && highlightInfo[activeHighlight] && (
          <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-sans shadow-md animate-in fade-in duration-200 ${highlightInfo[activeHighlight].badge}`}>
            <span className={`w-2 h-2 rounded-full animate-ping ${highlightInfo[activeHighlight].dot}`} />
            <span className="font-semibold">{highlightInfo[activeHighlight].desc}</span>
            <span className="font-mono text-[10px] opacity-80 border-l border-white/20 pl-2">
              {totalMatchesCount.toLocaleString()} matches
            </span>
            <button
              onClick={() => setFilterOnlyMatches(!filterOnlyMatches)}
              className={`ml-1 px-2 py-0.5 rounded text-[10px] font-mono transition-colors border cursor-pointer ${
                filterOnlyMatches
                  ? 'bg-white/20 text-white border-white/40 shadow-inner'
                  : 'bg-black/40 hover:bg-black/60 border-black/30'
              }`}
              title="Toggle filter: Show only highlighted matching rows"
            >
              {filterOnlyMatches ? 'Filtered' : 'Filter Matches'}
            </button>
            {onClearHighlight && (
              <button
                onClick={onClearHighlight}
                className="ml-1 p-0.5 rounded hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Clear row highlight"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Compact Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search all rows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-zinc-900 border border-zinc-700/80 rounded pl-8 pr-3 py-1 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-mono w-28 sm:w-40"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          title="Export CSV"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors border border-zinc-700/60 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>

      {/* Main Grid Viewport - Continuous scroll within its frame containing ALL rows */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-auto bg-[#0a0a0a] relative select-none will-change-scroll"
      >
        <table className="w-full border-collapse text-xs font-mono table-fixed">
          <thead className="sticky top-0 z-20 bg-[#121214] shadow-sm">
            <tr style={{ height: `${ROW_HEIGHT}px` }}>
              {/* Top-left corner box */}
              <th className="w-14 min-w-[56px] p-2 bg-[#141416] border-r border-b border-zinc-800 text-zinc-500 text-[10px] text-center font-normal">
                #
              </th>
              {cols.map((col) => (
                <th
                  key={col.key}
                  className={`${col.width} min-w-[100px] p-2 border-r border-b border-zinc-800 text-zinc-300 text-left font-medium`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 block">
                      {col.letter}
                    </span>
                    <span className="truncate text-zinc-200 font-semibold font-sans">
                      {col.label}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Top virtual spacer to preserve continuous scrollbar position */}
            {topSpacerHeight > 0 && (
              <tr style={{ height: `${topSpacerHeight}px` }} aria-hidden="true">
                <td colSpan={cols.length + 1} className="p-0 border-0 pointer-events-none" />
              </tr>
            )}

            {/* Continuous rendered rows */}
            {visibleRows.map((rowItem: any, index: number) => {
              const rowNumber = startIndex + index + 1
              const { isMatch, color } = checkRowHighlight(rowItem, activeTab === 'transactions')

              // Row highlight styles
              const rowNumberHighlightClasses = isMatch
                ? color === 'rose'
                  ? 'border-l-4 border-l-rose-500 bg-rose-950/60 text-rose-300 font-bold'
                  : color === 'emerald'
                  ? 'border-l-4 border-l-emerald-500 bg-emerald-950/60 text-emerald-300 font-bold'
                  : color === 'amber'
                  ? 'border-l-4 border-l-amber-400 bg-amber-950/60 text-amber-300 font-bold'
                  : 'border-l-4 border-l-zinc-300 bg-zinc-800 text-white font-bold'
                : 'text-zinc-500'

              const cellHighlightBg = isMatch
                ? color === 'rose'
                  ? 'bg-rose-950/20 text-rose-100 hover:bg-rose-950/30'
                  : color === 'emerald'
                  ? 'bg-emerald-950/20 text-emerald-100 hover:bg-emerald-950/30'
                  : color === 'amber'
                  ? 'bg-amber-950/20 text-amber-100 hover:bg-amber-950/30'
                  : 'bg-zinc-800/40 text-zinc-100 hover:bg-zinc-800/60'
                : activeHighlight
                ? 'opacity-40 text-zinc-500 hover:opacity-80'
                : 'text-zinc-300 hover:bg-zinc-800/20'

              return (
                <tr
                  key={rowNumber}
                  style={{ height: `${ROW_HEIGHT}px` }}
                  className={`transition-colors group ${isMatch ? 'font-medium' : ''}`}
                >
                  {/* Row Number header */}
                  <td
                    className={`sticky left-0 z-10 bg-[#101012] border-r border-b border-zinc-800/80 text-center text-[10px] py-1.5 px-1 select-none transition-colors group-hover:bg-zinc-800/80 ${rowNumberHighlightClasses}`}
                  >
                    {rowNumber}
                  </td>

                  {/* Row Cells */}
                  {cols.map((col) => {
                    const rawVal = rowItem[col.key]
                    const isSelected =
                      selectedCell.col === col.letter && selectedCell.row === rowNumber

                    return (
                      <td
                        key={col.key}
                        onClick={() => handleCellClick(col.letter, rowNumber, rawVal)}
                        className={`p-2 border-r border-b border-zinc-800/50 truncate cursor-cell relative transition-colors ${
                          isSelected
                            ? 'bg-zinc-700/30 outline outline-2 outline-zinc-400 z-10 text-white font-semibold'
                            : cellHighlightBg
                        } ${col.isNum ? 'text-right' : 'text-left'}`}
                      >
                        {col.key === 'churn_status' ? (
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-sans font-medium ${
                              rawVal === 'Churned'
                                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {rawVal}
                          </span>
                        ) : col.key === 'price' || col.key === 'monetary' ? (
                          typeof rawVal === 'number' ? `$${rawVal.toFixed(2)}` : rawVal
                        ) : (
                          String(rawVal ?? '')
                        )}

                        {/* Little Excel selection fill handle box */}
                        {isSelected && (
                          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-zinc-300 border border-zinc-600 pointer-events-none" />
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}

            {/* Bottom virtual spacer to preserve continuous scrollbar position */}
            {bottomSpacerHeight > 0 && (
              <tr style={{ height: `${bottomSpacerHeight}px` }} aria-hidden="true">
                <td colSpan={cols.length + 1} className="p-0 border-0 pointer-events-none" />
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Excel Sheet Tabs & Continuous Status Bar */}
      <div className="bg-[#0e0e11] border-t border-zinc-800 px-3 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Sheet Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleTabSwitch('transactions')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-t-md font-sans text-xs transition-colors border-t-2 cursor-pointer ${
              activeTab === 'transactions'
                ? 'bg-[#18181b] text-zinc-200 border-zinc-400 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-zinc-900/60'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sheet1: online_retail_II</span>
          </button>

          <button
            onClick={() => handleTabSwitch('rfm_profiles')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-t-md font-sans text-xs transition-colors border-t-2 cursor-pointer ${
              activeTab === 'rfm_profiles'
                ? 'bg-[#18181b] text-zinc-200 border-zinc-400 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-zinc-900/60'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sheet2: rfm_customer_data</span>
          </button>
        </div>

        {/* Continuous Scroll Status */}
        <div className="flex items-center gap-3 text-zinc-400 font-mono text-[11px]">
          {activeHighlight && (
            <span className="hidden sm:inline-block text-zinc-300">
              Matches: <strong className="text-white">{totalMatchesCount.toLocaleString()}</strong>
            </span>
          )}
          <span className="hidden sm:inline-flex items-center gap-1.5 text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Continuous Scroll
          </span>
          <span className="border-l border-zinc-800 pl-3">
            {totalRowsInDataset.toLocaleString()} rows • {cols.length} columns
          </span>
          {searchQuery && (
            <span className="text-zinc-400 border-l border-zinc-800 pl-3">
              Filtered: {currentDataset.length.toLocaleString()} matches
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
