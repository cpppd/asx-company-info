export interface CompanyData {
  ticker: string;
  company_info: string;
}

export interface Quote {
  cf_last: number;
  cf_netchng: number;
  pctchng: number;
  cf_volume: number;
  mkt_value: number;
  '52wk_high': number;
  '52wk_low': number;
}

export interface QuoteData {
  symbol: string;
  quote: Quote;
}

export interface AppState {
  loading: boolean;
  error: string;
  companyData: CompanyData | null;
  quoteData: QuoteData | null;
  currentTicker: string;
}

export interface ComparisonItem {
  ticker: string;
  loading: boolean;
  error?: string;
  quoteData?: QuoteData;
  companyData?: CompanyData;
}
