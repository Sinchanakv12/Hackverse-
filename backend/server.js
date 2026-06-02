/**
 * CHAOS ARCHITECT — Express Server Entry Point
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes/analyze");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: true,   // allow all origins — restrict to your Vercel URL in production if needed
  methods: ['GET', 'POST'],
  credentials: false,
}));
app.use(express.json());

// ── Health check ────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    system: "CHAOS ARCHITECT",
    version: "1.0.0-mvp",
    status: "OPERATIONAL",
    endpoints: [
      "POST /api/resolve-crisis",
      "GET  /api/supply-chain",
    ],
    aiMode: process.env.ANTHROPIC_API_KEY
      ? "Anthropic Claude (live)"
      : process.env.GEMINI_API_KEY
      ? "Google Gemini (live)"
      : "High-Fidelity Mock (no API key)",
  });
});

// ── API Routes ───────────────────────────────────────────────────────────────
app.use("/api", apiRouter);

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  ██████╗██╗  ██╗ █████╗  ██████╗ ███████╗");
  console.log("  ██╔════╝██║  ██║██╔══██╗██╔═══██╗██╔════╝");
  console.log("  ██║     ███████║███████║██║   ██║███████╗");
  console.log("  ██║     ██╔══██║██╔══██║██║   ██║╚════██║");
  console.log("  ╚██████╗██║  ██║██║  ██║╚██████╔╝███████║");
  console.log("   ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  Supply Chain Resilience AI — Backend`);
  console.log(`  Listening on http://localhost:${PORT}`);
  console.log(`  AI Mode: ${
    process.env.ANTHROPIC_API_KEY
      ? "Anthropic Claude (live)"
      : process.env.GEMINI_API_KEY
      ? "Google Gemini (live)"
      : "High-Fidelity Mock"
  }`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
});
