import { CompanyData, QuoteData } from '@/types';

export async function fetchCompanyInfo(ticker: string): Promise<CompanyData> {
  const response = await fetch(
    `/api/proxy/api/market_data/company_information?ticker=${ticker.toUpperCase()}`
  );

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  return response.json();
}

export async function fetchQuoteData(ticker: string): Promise<QuoteData> {
  const response = await fetch(
    `/api/proxy/api/market_data/quotes?market_key=asx&listing_key=${ticker.toUpperCase()}`
  );

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  return response.json();
}
