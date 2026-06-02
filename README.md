# CHAOS ARCHITECT 
### Supply Chain Resilience AI — Setup Guide

---

## Prerequisites

You need **Node.js** installed. Download it from: **https://nodejs.org** (LTS version recommended).

After installing, verify with:
```bash
node --version   # Should print v18+ or v20+
npm --version    # Should print 9+
```

---

## Project Structure

```
hack/
├── backend/
│   ├── server.js                    ← Express entry point
│   ├── demoData.js                  ← Supply chain mock data
│   ├── package.json
│   ├── .env.example                 ← Copy to .env and add API keys
│   ├── routes/
│   │   └── analyze.js               ← HTTP route (thin layer only)
│   └── services/
│       └── agentOrchestrator.js     ← All agentic business logic
│
└── frontend/
    ├── index.html
    ├── vite.config.js               ← Proxies /api to backend:5000
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx                  ← State machine & layout
        ├── index.css                ← Cyberpunk global styles
        └── components/
            ├── Header.jsx           ← Branding + reset button
            ├── NetworkStatusViewer.jsx
            ├── FinancialImpactMeter.jsx
            ├── ChaosInjector.jsx
            ├── AgentConsole.jsx
            └── CampaignCard.jsx
```

---

## Running the App (Two terminals)

### Terminal 1 — Backend

```bash
cd hack/backend
npm install
node server.js
```

Backend will start at **http://localhost:5000**

### Terminal 2 — Frontend

```bash
cd hack/frontend
npm install
npm run dev
```

Frontend will start at **http://localhost:5173**

Open **http://localhost:5173** in your browser.

---

## (Optional) Enable Live AI

Copy the env template and add your API key:

```bash
cd hack/backend
copy .env.example .env
```

Edit `.env`:
```
# Option 1: Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-...

# Option 2: Google Gemini  
GEMINI_API_KEY=AIza...
```

If no key is provided, the app runs in **High-Fidelity Mock Mode** (perfect for demos).

---

## The Demo Flow

1. Open the dashboard — all 5 nodes show **ONLINE**, revenue meter at **$0**
2. Click **"⚡ INJECT CHAOS: BENGALURU FLOOD SCENARIO"**
3. Watch:
   - Bengaluru node turns **red (OFFLINE)**
   - Financial meter counts up to **$9,000,000**
   - Agent Console begins streaming live execution logs
4. Agent completes — Campaign card fades in with recovery strategy
5. Financial meter counts **back down** by $5.8M recovered
6. Click **"▶ DEPLOY CAMPAIGN"** → Success animation (green checkmark + "REALLOCATION COMPLETE")
7. Use the **↺** icon in the header to reset for QA / repeat demos

---

## Architecture

```
Frontend (React/Vite)
       │
       │  POST /api/resolve-crisis
       ▼
routes/analyze.js  (HTTP only — validates, delegates)
       │
       │  orchestrator.run()
       ▼
services/agentOrchestrator.js  (all business logic)
   ├── Step 1: TRIAGE  — Parse disrupted node, calculate loss
   ├── Step 2: SCAN    — Find utility-equivalent safe inventory  
   ├── Step 3: BUNDLE  — Compute optimal bundle + pricing
   ├── Step 4: SHAPE   — Call Claude / Gemini / Mock Agent
   └── Step 5: FORMAT  — Return structured campaign + logs
```

## Data Model (Business Logic)

| Product | Status | Value | Utility |
|---------|--------|-------|---------|
| UltraBook Pro 15" (Enterprise) | ❌ DISRUPTED | $1,800/unit | Enterprise compute |
| Creator Pro 14" (Professional) | ✅ SAFE (Mumbai) | $1,550/unit | Professional compute |
| CloudDesk Pro 1-Year License | ✅ SAFE (Digital) | $420/unit | Cloud compute |

**Bundle**: Creator Pro 14" + CloudDesk Pro @ 8% discount = **$1,812.40/unit**  
**Recovery ceiling**: 3,200 units × $1,812.40 = **~$5.8M** of a $9M loss

This is economically coherent substitution: all three products serve the same enterprise compute utility class.
