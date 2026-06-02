# ⚡ CHAOS ARCHITECT
### Supply Chain Resilience AI — Hackathon Project

> A real-time AI-powered supply chain disruption simulator with live data feeds, cascade failure detection, financial impact modeling, and autonomous mitigation.

---

## ✨ Features

- 🗺️ **Live Scenario Map** — 9-node interactive network with real-time crisis visualization
- 📡 **Live Data Feed** — SSE stream: live sensor data, weather, traffic & security events
- 🤖 **Auto-Pilot Mitigation** — AI triggers countermeasures automatically when risk ≥ 85%
- 🌊 **Cascade Engine** — Domino failure propagation across adjacent supply nodes
- 💸 **Financial Sandbox** — Live cost ticker with margin, insurance & penalty sliders
- 📊 **A/B Run Comparison** — Side-by-side simulation performance analysis
- 💬 **AI Copilot Chat** — Natural language command interface
- 🔥 **81 Chaos Scenarios** — Air, Natural Disasters, Cyber, Labor, Maritime, Pandemic, Climate, Financial, Rail/Road

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, Framer Motion, Lucide Icons |
| Backend  | Node.js + Express, Server-Sent Events (SSE) |
| AI       | Anthropic Claude / Google Gemini (optional) |

---

## 🚀 Running Locally

```bash
# Backend (http://localhost:5000)
cd backend && npm install && node server.js

# Frontend (http://localhost:5173)
cd frontend && npm install && npm run dev
```

**Optional AI key** — create `backend/.env`:
```
ANTHROPIC_API_KEY=sk-ant-...
```
Without a key the app runs in **High-Fidelity Mock** mode (fully functional).

---

## ☁️ Deploying to Production

### Backend → [Railway](https://railway.app)

1. New Project → Deploy from GitHub → select `backend/` folder
2. Railway auto-detects Node.js, runs `node server.js`
3. Copy the public Railway URL

### Frontend → [Vercel](https://vercel.com)

1. New Project → Import GitHub → set **Root Directory** to `frontend`
2. Add environment variable:
   ```
   VITE_API_BASE_URL = https://YOUR-RAILWAY-URL.up.railway.app
   ```
3. Click Deploy ✅

---

## 🗂️ Project Structure

```
hack/
├── backend/
│   ├── server.js                  # Express entry + CORS
│   ├── demoData.js                # Supply chain data generator
│   ├── railway.json               # Railway deployment config
│   ├── routes/analyze.js          # API + SSE /api/live-stream
│   └── services/agentOrchestrator.js  # ReAct AI + Dijkstra routing
│
└── frontend/
    ├── vercel.json                # Vercel SPA config
    ├── .env                       # Local env (VITE_API_BASE_URL)
    └── src/
        ├── App.jsx
        ├── scenariosData.js       # 81 chaos scenarios
        ├── context/ChaosContext.jsx
        └── components/
            ├── LiveFeed.jsx           # 📡 Real-time SSE dashboard
            ├── DynamicTransitMap.jsx  # 🗺️ Live map
            ├── CopilotChat.jsx        # 💬 AI chat
            ├── FinancialSandbox.jsx   # 💸 Cost modeling
            ├── CascadeEngine.jsx      # 🌊 Domino failures
            ├── ComparisonView.jsx     # 📊 A/B comparison
            └── LivePredictor.jsx      # 🤖 Risk + Auto-Pilot
```

---

## 🏆 Built for HackVerse Hackathon
