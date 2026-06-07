# UAT Checklist — POC-54 Influencer Commerce Funnel
**Author:** Ranjana KP
**POC ID:** POC-54
**Date:** June 07, 2026
**Tested On:** localhost:3000
**Result:** ALL CHECKS PASSED ✅

---

## 1. Visual Identity Checks

- [x] Background is #030712 Obsidian Black
- [x] Cards/surfaces use #0B1117 Deep Navy Grey
- [x] Accent primary #38BDF8 Electric Cyan visible on active states
- [x] Accent secondary #818CF8 Indigo visible on secondary elements
- [x] Borders are #1F2937 Slate-800 at 1px width
- [x] Typography is Inter/Geist Sans with tight letter spacing
- [x] Glassmorphism effect visible on cards
- [x] Cyan glow visible on active interactive elements

---

## 2. Layout Checks

- [x] Dashboard uses 2-column split layout
- [x] Sidebar occupies exactly 30% width on large screens
- [x] Main stage occupies 70% width on large screens
- [x] Header bar present with POC-54 identifier
- [x] Version number v1.0.0 visible in header
- [x] Status indicator visible in header (DuckDB Connected)

---

## 3. Sidebar Section Checks

- [x] Section A: Title "Influencer Commerce Funnel" visible
- [x] Section A: Rail category "Distribution & Demand" visible
- [x] Section A: Total Revenue metric displayed
- [x] Section A: Avg Conversion metric displayed
- [x] Section A: vs benchmark indicator shown
- [x] Section B: "Why This Matters" panel populated
- [x] Section C: "Who Controls the Rail" panel populated
- [x] Section D: Geographic Filter dropdown functional
- [x] Section D: Campaign Category dropdown functional
- [x] Section D: Tooltip info icons working on hover
- [x] Section D: World Bank macro indicators displayed
- [x] Section E: Download Raw Dataset (CSV) button present

---

## 4. Main Stage Feature Checks

- [x] Commerce Conversion Funnel renders with 5 stages
- [x] Funnel tooltip shows on hover with stage details
- [x] Funnel bottom summary row shows all stage counts
- [x] Margin Share Breakdown doughnut renders
- [x] Margin doughnut tooltip shows on hover
- [x] Brand keep % shown in doughnut centre
- [x] Creator Performance Metrics table renders
- [x] Table shows all 4 tiers (Mega, Macro, Micro, Nano)
- [x] Table shows ROI vs industry benchmark
- [x] Attribution Windows renders with 4 windows
- [x] Attribution window tabs are clickable and update panel
- [x] Attribution progress bars animate correctly
- [x] Margin Sensitivity Simulator renders
- [x] All 4 sliders (Clicks, AOV, CVR, Commission) functional
- [x] Simulated Economics update live on slider change
- [x] Low margin warning appears when margin < 60%

---

## 5. Filter Interaction Checks

- [x] Changing Geographic Filter updates all components
- [x] Changing Campaign Category updates all components
- [x] No full page refresh occurs on filter change
- [x] Loading state shows correctly during data fetch
- [x] Data updates correctly for all region/vertical combinations

---

## 6. Fallback & Resilience Checks

- [x] Mock fallback activates when API is unavailable
- [x] "Offline Fallback Mode" amber banner displays
- [x] All components render correctly in fallback mode
- [x] Fallback data is realistic and well-labelled

---

## 7. Data Integrity Checks

- [x] Margin split percentages sum to 100%
- [x] Attribution windows show increasing conversions 1d→30d
- [x] Creator tier ROI benchmarked against 4.5x industry standard
- [x] World Bank GDP, Internet, Mobile values load per region
- [x] Sensitivity calculator revenue = clicks × CVR × AOV

---

## 8. Final Sign-off

| Area | Result |
|------|--------|
| Visual Identity | ✅ PASSED |
| Layout | ✅ PASSED |
| Sidebar | ✅ PASSED |
| Main Stage Features | ✅ PASSED |
| Filter Interactions | ✅ PASSED |
| Fallback Resilience | ✅ PASSED |
| Data Integrity | ✅ PASSED |

**Overall UAT Result: PASSED ✅**
POC-54 is approved for Real Rails Intelligence Library submission.
