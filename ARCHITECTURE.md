┌─────────────────────────────────────────────────────────┐
│                    BROWSER CLIENT                        │
│              localhost:3000 (Next.js 16)                 │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP fetch /api/data
                         ▼
┌─────────────────────────────────────────────────────────┐
│              NEXT.JS API ROUTE HANDLER                   │
│         src/app/api/data/route.ts                        │
│   • DuckDB-style synthetic event engine (TypeScript)     │
│   • World Bank macro calibration                         │
│   • Seeded PRNG (Mulberry32) — deterministic data        │
│   • Filters: region, vertical                            │
│   • Returns structured JSON                              │
└────────────────────────┬────────────────────────────────┘
                         │ JSON Response
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  DASHBOARD SHELL                         │
│              src/app/page.tsx                            │
│   • Fetches /api/data on filter change                   │
│   • Self-healing fallback (local mock engine)            │
│   • 70/30 split layout orchestrator                      │
└────┬──────────────────────────────────────┬─────────────┘
     │ 30% Sidebar                          │ 70% Main Stage
     ▼                                      ▼
┌──────────────┐                ┌───────────────────────────┐
│   SIDEBAR    │                │       MAIN STAGE          │
│  sidebar.tsx │                │                           │
│              │                │  ┌─────────────────────┐  │
│ • Title &    │                │  │  funnel-chart.tsx   │  │
│   Metrics    │                │  │  Commerce Funnel    │  │
│ • Why This   │                │  │  (Apache ECharts)   │  │
│   Matters    │                │  └─────────────────────┘  │
│ • Who        │                │  ┌─────────────────────┐  │
│   Controls   │                │  │  margin-split.tsx   │  │
│   the Rail   │                │  │  Doughnut Chart     │  │
│ • Filters    │                │  │  (Apache ECharts)   │  │
│   Region /   │                │  └─────────────────────┘  │
│   Vertical   │                │  ┌─────────────────────┐  │
│ • World Bank │                │  │  creator-table.tsx  │  │
│   Macro Data │                │  │  TanStack Table     │  │
│ • Download   │                │  └─────────────────────┘  │
│   CSV        │                │  ┌─────────────────────┐  │
└──────────────┘                │  │ attribution-view.tsx│  │
                                │  │  Progress Bars      │  │
                                │  └─────────────────────┘  │
                                │  ┌─────────────────────┐  │
                                │  │sensitivity-calc.tsx │  │
                                │  │  Live Sliders       │  │
                                │  └─────────────────────┘  │
                                └───────────────────────────┘


                                DATA FLOW

                                World Bank Benchmarks (GDP, Internet, Mobile)
          +
Synthetic Commerce Events (Mulberry32 PRNG seed=42)
          │
          ▼
   250 Campaigns Generated
   × 3–7 Days Each
   = ~1,250 Event Rows
          │
          ▼
   Filter by Region + Vertical
          │
          ▼
   Aggregate Metrics
   ├── Funnel Stages (Impressions → Clicks → Cart → Purchase)
   ├── Creator Tier Breakdown (Nano/Micro/Macro/Mega)
   ├── Margin Split (Creator / Platform / Rails / Merchant)
   ├── Attribution Windows (1d / 7d / 14d / 30d)
   └── Macro Indicators (World Bank Context)
          │
          ▼
   JSON Response → React Components → ECharts Visualizations

 | Component                  | Purpose                        | Library              |
|---------------------------|--------------------------------|----------------------|
| sidebar.tsx               | Filters, metrics, insights,    | shadcn/ui            |
|                           | download                       |                      |
| funnel-chart.tsx          | Discovery-to-purchase funnel   | Apache ECharts       |
| margin-split.tsx          | Economic yield doughnut        | Apache ECharts       |
| creator-table.tsx         | Tier performance comparison    | TanStack Table       |
| attribution-view.tsx      | Attribution window tabs        | Custom               |
| sensitivity-calculator.tsx| Live margin simulator          | Custom sliders       |
| api/data/route.ts         | Data engine + API handler      | Next.js + TypeScript |

        Fallback Architecture
        Primary: /api/data (Next.js route handler)
         │
         ▼ if error
Fallback: getLocalFallbackData()
         (inline TypeScript mock engine)
         │
         ▼
UI stays functional — "Offline Fallback Mode" banner shown

| Layer                | Source               | Usage                                        |
|---------------------|----------------------|----------------------------------------------|
| Macro Calibration   | World Bank Data      | Scales AOV and volume by country GDP,        |
|                     |                      | internet penetration, mobile coverage        |
| Commerce Events     | Synthetic (seeded)   | 250 campaigns × tiers × verticals            |
| Benchmark Comparison| Industry standards   | CTR 1.5%, CVR 2.2%, ROI 4.5x                |

   
