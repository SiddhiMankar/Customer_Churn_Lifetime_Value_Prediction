export interface KPIData {
  total_customers: number
  active_count: number
  churned_count: number
  churn_rate: number
  total_cltv: number
  avg_cltv: number
  median_cltv: number
  total_monetary: number
  avg_monetary: number
  avg_recency: number
  avg_frequency: number
}

export interface SegmentData {
  name: string
  count: number
  percentage: number
  avg_cltv: number
  total_cltv: number
  avg_churn_risk: number
  avg_recency: number
  avg_frequency: number
  avg_monetary: number
  avg_tenure: number
  pred_purchases_30d: number
  pred_purchases_90d: number
  pred_purchases_180d: number
  color: string
  badge: string
}

export interface ChurnDistributionBin {
  range: string
  count: number
  percentage: number
}

export interface CLTVDistributionBin {
  tier: string
  count: number
  percentage: number
}

export interface SummaryData {
  kpis: KPIData
  segments: SegmentData[]
  churn_distribution: ChurnDistributionBin[]
  cltv_distribution: CLTVDistributionBin[]
}

export interface CustomerRecord {
  id: number
  segment: string
  recency: number
  frequency: number
  monetary: number
  tenure: number
  pred_30d: number
  pred_90d: number
  pred_180d: number
  prob_alive: number
  churn_risk: number
  is_churned: number
  cltv: number
}

export interface RawTransaction {
  row: number
  invoice: string
  stock_code: string
  description: string
  quantity: number
  invoice_date: string
  price: number
  customer_id: number | string
  country: string
}

