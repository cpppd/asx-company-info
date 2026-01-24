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

## Architectural Decisions & Approach

### 1. Client-Side Persistence (Local Storage)
**Decision:** Use `localStorage` for saving comparison lists.
**Justification:** This allows for a personalized user experience (saving favorites) without the complexity of implementing a full backend user authentication system, database, and session management. It keeps the application lightweight and privacy-friendly, as data never leaves the user's device.

### 2. Stateless State Management (URL Parameters)
**Decision:** The application drives the comparison state primarily through URL query parameters (e.g., `?tickers=ASX,BHP`).
**Justification:** This makes the application "stateless" and easily shareable. A user can copy the URL and send it to a colleague, and they will see the exact same view. It simplifies the sharing architecture by removing the need to generate and store unique "share IDs" in a database.

### 3. Unified Table View
**Decision:** Enforced a consistent **Table View** for all comparison sizes (1-5 tickers), removing a previous card-based view for smaller selections.
**Justification:** While cards are visually appealing for single items, a table is objectively superior for *comparing* data. Aligned columns make scanning financial metrics (Market Cap, P/E Ratio, Yield) across multiple companies significantly faster and clearer. A unified view also reduces maintenance overhead and provides a consistent UI.

### 4. Trade-offs & Scope
- **Scope**: The MVP focuses on the *latest* snapshot of financial data rather than historical trends.
- **Mobile Experience**: Large data tables are inherently difficult on mobile. Horizontal scrolling to preserve data density is utilized, trading off some mobile ergonomics for data completeness.
- **Data Limit**: Comparisons are capped at **5 companies** to strictly control performance and UI clutter.

## Future Improvements

If we were to expand this project further, here are the key areas for improvement:

1.  **Historical Data Visualization**: Add charts (Line/Candlestick) to compare stock price performance over time (1M, 6M, 1Y).
2.  **User Accounts (Auth)**: Implement NextAuth.js and a database (PostgreSQL/Supabase) to allow users to sync their saved comparisons across devices.
3.  **Export Data**: Add a "Download CSV" button to allow analysts to export the comparison table for use in Excel.
4.  **Advanced Filtering**: Allow users to filter the search by Industry Group or Market Cap range.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev/)
