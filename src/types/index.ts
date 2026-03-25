export interface CriterionResult {
  pass: boolean;
  score: number; // 0-100
  value: string; // display value
  detail: string;
}

export interface CANSLIMResult {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  compositeScore: number;
  C: CriterionResult;
  A: CriterionResult;
  N: CriterionResult;
  S: CriterionResult;
  L: CriterionResult;
  I: CriterionResult;
  M: CriterionResult;
}

export interface MarketDirection {
  trend: "uptrend" | "downtrend" | "neutral";
  sp500Price: number;
  ma200: number;
  ma50: number;
}

export interface StockResult extends CANSLIMResult {
  scannedAt?: string;
}
