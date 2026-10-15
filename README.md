# GreenPulse — Sustainable Campus & Office Resource & Energy Audit Portal

> **PRD Document**: SD-02 | Version 1.0 (Hackathon MVP)  
> **Tagline**: *Track Resources. Detect Waste. Build a Greener Future.*  
> **Live Dev Server**: [http://127.0.0.1:5173/](http://127.0.0.1:5173/)

GreenPulse is a centralized web platform engineered to monitor electricity, water, and paper consumption, automatically identify abnormal usage patterns (anomalies), recommend practical sustainability actions with financial savings calculations, and generate one-click audit reports.

---

## 🌟 Key Features & PRD Compliance Matrix

| PRD Requirement | Specification | Implementation in GreenPulse |
|---|---|---|
| **FR-01: Authentication & Roles** | Administrator, Facility Manager, Department Head | Top Navbar role switcher with demo personas & role-based view controls |
| **FR-02: Resource Dashboard** | Total Electricity (1,250 kWh), Water (18,500 L), Paper (2,400 sh), Cost (INR 24,500), Potential Savings (INR 4,200), 5 Active Alerts | Dynamic KPI cards, interval filter (Today, 7D, 30D, Month) that recalculates cards and Recharts trends |
| **FR-03: Waste Detection** | Rule-based baseline comparison (<20% Normal, 20-49% Warning, ≥50% Critical) | Anomaly engine with severity badges, excess quantity, waste cost/day, resolution workflows, and live spike simulators |
| **FR-04: Facility Mapping** | Interactive SVG floor plan with ≥10 rooms, color coding (Green/Yellow/Red) | Predefined SVG architectural floor plan (12 rooms), building/floor switcher, room click inspection drawer |
| **FR-05: Smart Recommendations** | 5 categories (Lighting, HVAC, Water, Paper, IT), INR savings calculator | Dynamic formula calculation (`excess/day × tariff = daily & monthly savings`), labelled estimates, implementation toggles |
| **FR-06: Green Score** | 0-100 department rating, documented weights (40% Efficiency, 30% Resolution, 20% Efforts, 10% Trend) | Department leaderboard: CS 92, Admin 86, Mech 74, Electrical 65 with audit rubric |
| **FR-07: Reports** | Working PDF and CSV downloads reflecting selected period | Real jsPDF document compilation with styled tables + raw CSV telemetry export |
| **FR-08: Settings & Data** | Configurable tariffs, thresholds, manual ingestion form, source types | Live configuration for tariffs (INR/kWh, INR/L, INR/sheet), threshold sliders, and manual meter ingestion |

---

## 🚀 Getting Started

The application is running live in your workspace.

```bash
cd "C:\Users\Tabrez Alam\.gemini\antigravity\scratch\greenpulse"
npm run dev -- --host 127.0.0.1
```

Visit **`http://127.0.0.1:5173/`** in your browser to interact with the full portal.

---

## 🏗️ Technology Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 + Lucide React
- **Visualization**: Recharts (Area charts, Bar charts, diurnal load profiles)
- **Reporting**: jsPDF & jspdf-autotable (PDF generation) + Blob CSV Exporter
- **State**: React Context API with LocalStorage persistence
