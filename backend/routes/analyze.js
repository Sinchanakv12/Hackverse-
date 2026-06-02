/**
 * CHAOS ARCHITECT — Express Route: /api/resolve-crisis
 *
 * HTTP layer ONLY. Parses the request, delegates to agentOrchestrator,
 * and returns the structured JSON result.
 */

const express = require("express");
const router = express.Router();
const orchestrator = require("../services/agentOrchestrator");

// POST /api/resolve-crisis
router.post("/resolve-crisis", async (req, res) => {
  const { crisisNodeId, scenario, simulationConfig } = req.body;

  if (!crisisNodeId) {
    return res.status(400).json({ error: "crisisNodeId is required." });
  }

  try {
    console.log(`[CHAOS ARCHITECT] Crisis resolution initiated for node: ${crisisNodeId}`);
    const result = await orchestrator.run(crisisNodeId, (log) => {
      // Optional: stream logs to console during execution
      console.log(`  [AGENT] ${log}`);
    }, simulationConfig);

    return res.status(200).json(result);
  } catch (error) {
    console.error(`[CHAOS ARCHITECT] Orchestrator error:`, error);
    return res.status(500).json({
      error: "Agent orchestration failed.",
      details: error.message,
    });
  }
});

// GET /api/supply-chain — Return the raw supply chain data for the frontend
const demoData = require("../demoData");
router.get("/supply-chain", (req, res) => {
  const { vertical, constraints } = req.query;

  let parsedConstraints = {};
  if (constraints) {
    try {
      parsedConstraints = JSON.parse(constraints);
    } catch (e) {
      console.error("[CHAOS ARCHITECT] Failed to parse constraints query:", e.message);
    }
  }

  const data = demoData.generateSupplyChainState({
    vertical: vertical || "electronics",
    constraints: parsedConstraints
  });

  res.json({
    nodes: data.nodes,
    inventory: data.inventory,
    crisisScenarios: data.crisisScenarios,
    transitRoutes: data.transitRoutes,
  });
});

module.exports = router;
