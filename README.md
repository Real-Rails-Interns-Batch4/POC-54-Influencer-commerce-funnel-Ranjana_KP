## Project Overview

**POC-54 — Influencer Commerce Funnel**
**Rail Category:** Distribution & Demand
**Author:** Ranjana KP
**Version:** 1.0.0

---

### What This Project Does

The Influencer Commerce Funnel is a production-grade Real Rails Intelligence
Dashboard that analyzes how creator-led commerce distributes margin across
platform giants, creator networks, and merchant brands.

The dashboard ingests World Bank macro data (GDP per capita, internet
penetration, mobile subscriptions) alongside a synthetic commerce event feed
to simulate and visualize the full discovery-to-purchase funnel across 5
geographic regions and 5 product verticals.

---

### The Problem It Solves

When a consumer taps "Buy Now" on a creator's post, value is distributed
across multiple parties — the platform, the creator, the payment rail, and
the merchant. Most DTC founders and allocators have no visibility into how
this margin splits, which attribution window to trust, or which creator tier
delivers the best ROI.

This dashboard makes that invisible flow visible.

---

### Key Features

- **Commerce Conversion Funnel** — Visualizes the full
  Impressions → Clicks → Add to Cart → Purchases → Creator Payout chain

- **Creator Tier Comparison** — Benchmarks Nano, Micro, Macro, and Mega
  creators across CTR, CVR, AOV, Revenue, and ROI vs industry standard

- **Margin Split Breakdown** — Shows how every dollar of GMV is divided
  between the merchant, creator, platform, and rail

- **Attribution Windows** — Compares 1-day, 7-day, 14-day, and 30-day
  attribution capture rates and their revenue impact

- **Margin Sensitivity Simulator** — Live slider tool to model how changes
  in traffic volume, AOV, conversion rate, and commission affect brand
  gross profit in real time

- **World Bank Macro Context** — Calibrates all metrics using real GDP,
  internet penetration, and mobile subscription data per region

- **Self-Healing Fallback** — Automatically switches to a local mock data
  engine if the API is unavailable, keeping the dashboard fully functional

- **Interactive Tooltips** — Hover over any metric, stage, or control to see
  contextual explanations. All interactive elements have built-in help text

- **Data Source Attribution** — "Data Sources & Attribution" button in header
  reveals exact sources, algorithms, and reproducibility details for all data

- **Synthetic Data Labeling** — All visualizations clearly marked as "Synthetic Data"
  or "Live Data" with color-coded badges and detailed transparency info

---

### Interactive Features & Tooltips

Every interactive element in the dashboard includes context-aware tooltips:

| Element | Tooltip Content | Position |
|---------|---|---|
| **Funnel Stages** | Purpose and volume metrics of each stage | On Hover |
| **Margin Categories** | How each entity captures value from GMV | On Hover |
| **Creator Tiers** | Follower ranges, CTR/CVR characteristics | On Hover |
| **Attribution Windows** | Time window scope and capture efficiency | On Button |
| **Sensitivity Sliders** | Impact of each parameter on economics | On Hover |
| **World Bank Macro** | GDP, internet penetration, mobile data context | On Hover |
| **Data Badges** | Source type (Live/Synthetic/Hybrid) details | On Hover |

**How to use:**
- Hover over any metric label or icon for instant explanations
- Click "Data Sources & Attribution" button to see full source documentation
- Look for colored badges showing data source (emerald=live, indigo=synthetic, cyan=hybrid)

---

### Who It Is For

| Audience | Use Case |
|----------|----------|
| DTC Founders | Understand margin leakage across creator campaigns |
| Brand Allocators | Identify highest ROI creator tier for budget deployment |
| Platform Analysts | Benchmark conversion performance across verticals |
| Everyday Viewers | Understand how influencer commerce actually works |

---

### Intelligence Sources

| Source | Type | Usage | Attribution |
|--------|------|-------|---|
| World Bank Data | Live macro | GDP, internet, mobile benchmarks | Badged as "Live Data" with API fallback info |
| Synthetic Event Feed | Seeded mock | 250 campaigns × tiers × verticals | Badged as "Synthetic Data" with seed=42 reproducibility |
| Industry Benchmarks | Static | CTR 1.5%, CVR 2.2%, ROI 4.5x | Linked in "Data Sources & Attribution" modal |

**Transparency:**
- Click header button to view complete source documentation
- All visualizations labeled with data source type and badge color
- Fallback mechanisms and API timeouts fully disclosed
- Determinism & reproducibility details available on demand

---

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Components | shadcn/ui, Apache ECharts, TanStack Table |
| Backend | FastAPI, Pandas, DuckDB |
| Data Engine | Mulberry32 PRNG (seed=42), deterministic synthetic data |
| Deployment | localhost:3000 (dev), GitHub repository |

---

### New Components (Tooltips & Attribution)

**File Structure:**
```
src/
  utils/
    tooltips.ts          ← Tooltip content library (50+ messages)
  components/
    tooltip.tsx          ← Tooltip, InfoIcon, DataSourceBadge components
    data-source-footer.tsx ← Data attribution modal & button
```

**Component Details:**

| File | Purpose | Exports |
|------|---------|---------|
| `tooltips.ts` | Centralized tooltip messages & source info | `TOOLTIPS`, `SOURCE_ATTRIBUTION`, `getSourceBadgeLabel()` |
| `tooltip.tsx` | Reusable tooltip components | `Tooltip`, `InfoIcon`, `DataSourceBadge`, `SourceInfoModal` |
| `data-source-footer.tsx` | Header button + attribution modal | `DataSourceFooter` |

**Usage in Components:**
- All 6 main components now import tooltips
- Funnel, Margin, Creator Table, Attribution, Sensitivity all show data badges
- Sidebar metrics have tooltip help icons
- Every parameter has context-aware explanations

---

### Latest Updates (v1.0.0 - June 10, 2026)

**✨ New Features:**
- **Interactive Tooltips** — 50+ contextual help messages across all components
  - Hover over any metric, stage, filter, or slider for instant explanations
  - Smooth animations and color-coded positioning
  
- **Data Source Attribution** — Full transparency about data provenance
  - "Data Sources & Attribution" button in header reveals complete documentation
  - World Bank API info, synthetic data algorithm (Mulberry32 seed=42), benchmark sources
  - Fallback mechanisms and API timeout behavior disclosed
  
- **Synthetic Data Labeling** — All visualizations clearly marked
  - Color-coded badges: Emerald (Live), Indigo (Synthetic), Cyan (Hybrid)
  - Shows at-a-glance which data is real vs simulated
  
- **New Components:**
  - `tooltip.tsx` — Reusable tooltip, icon, badge components
  - `data-source-footer.tsx` — Attribution modal system
  - `utils/tooltips.ts` — Centralized tooltip library (50+ messages + source info)

---

### Real Rails DNA Compliance

| Requirement | Status |
|-------------|--------|
| Background #030712 | ✅ |
| Sidebar 30% width | ✅ |
| Main stage 70% width | ✅ |
| Filters without page refresh | ✅ |
| Mock fallback active | ✅ |
| Download sample data | ✅ |
| Why This Matters panel | ✅ |
| Who Controls the Rail panel | ✅ |
| Interactive Tooltips | ✅ |
| Data Source Attribution | ✅ |
| Synthetic Data Labeling | ✅ |
| Transparency & Context | ✅ |





This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

<img width="1914" height="1021" alt="Screenshot 2026-06-07 155808" src="https://github.com/user-attachments/assets/1d7c1bfc-d438-4c76-a8e2-b58768cb535c" />
<img width="1919" height="1027" alt="Screenshot 2026-06-07 155825" src="https://github.com/user-attachments/assets/06ac4e25-2bd5-43d7-83a8-5053ff668de8" />
<img width="1913" height="951" alt="Screenshot 2026-06-07 155834" src="https://github.com/user-attachments/assets/be174bbc-16d5-49af-90b0-6adeeeaa516c" />
<img width="1907" height="998" alt="Screenshot 2026-06-07 155848" src="https://github.com/user-attachments/assets/8a306088-de75-4801-9a02-d28cc83cb9a1" />
<img width="1907" height="998" alt="Screenshot 2026-06-07 155848" src="https://github.com/user-attachments/assets/68968d4c-20c6-4a14-8960-d9cc1a6e016c" />
<img width="1911" height="912" alt="Screenshot 2026-06-07 160348" src="https://github.com/user-attachments/assets/3580d05a-c610-4833-9b91-07ab3cab3618" />



