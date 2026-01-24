# ASX Company Information Dashboard

A modern, responsive web application for searching, viewing, and comparing ASX-listed companies. Built with Next.js 16, React 19, and Tailwind CSS 4.

## Features

- **Company Search**: robust search functionality allowing users to find companies by ticker symbol or name.
- **Detailed Company Info**: View comprehensive details including company descriptions, industry sectors, and key financial statistics (Market Cap, Share Price, etc.).
- **Stock Comparison**:
  - Compare up to **5 companies** side-by-side.
  - **Table View**: A clean, data-rich table layout for easy comparison of financial metrics.
  - **Dynamic Highlights**: Hover effects on table rows to easily track specific metrics across multiple companies.
- **Save & Share**:
  - **Save Comparisons**: Save your frequently checked comparisons to your local browser storage.
  - **Shareable URLs**: Generate unique URLs for your comparisons to share with others (e.g., `/?tickers=BHP,RIO,FMG`).

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/cpppd/asx-company-info.git
   cd asx-company-info
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure Environment Variables:**

   Create a `.env.local` file in the root directory and add the following keys:

   ```bash
   NEXT_PUBLIC_API_BASE_URL=https://public.investorhub.com
   API_KEY=your_api_key_here
   ```

   > Note: You will need a valid `API_KEY` to fetch data from the InvestorHub API.

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app`: App router pages and layouts.
- `src/components`: Reusable UI components (Search, Comparison Table, Stock Cards).
- `src/lib`: Utility functions and API helpers.
- `src/types`: TypeScript interfaces and type definitions.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev/)
