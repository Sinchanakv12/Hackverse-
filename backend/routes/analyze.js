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

// GET /api/resolve-crisis/stream
router.get("/resolve-crisis/stream", async (req, res) => {
  const { crisisNodeId, scenario, config } = req.query;

  let parsedConfig = {};
  if (config) {
    try {
      parsedConfig = JSON.parse(config);
    } catch (e) {
      console.error("[CHAOS ARCHITECT] Failed to parse config query:", e.message);
    }
  }

  // Set headers for Server-Sent Events
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });

  // Keep connection alive
  res.write(":\n\n");

  try {
    const result = await orchestrator.run(
      crisisNodeId || "bengaluru",
      (logMsg) => {
        res.write(`data: ${JSON.stringify({ type: "log", message: logMsg })}\n\n`);
      },
      parsedConfig
    );

    // Send complete result
    res.write(`data: ${JSON.stringify({ type: "complete", result })}\n\n`);
    res.end();
  } catch (error) {
    console.error("[CHAOS ARCHITECT] SSE stream error:", error);
    res.write(`data: ${JSON.stringify({ type: "error", message: error.message })}\n\n`);
    res.end();
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

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/live-stream — Real-time SSE live data feed
// Streams sensor readings, node health, weather, and synthetic events every 2s
// ─────────────────────────────────────────────────────────────────────────────

const NODE_IDS = ['bengaluru','mumbai','delhi','chennai','hyderabad','kolkata','pune','shenzhen','singapore'];

const LIVE_EVENTS = [
  { tag: 'SENSOR',    color: 'blue',   msgs: [
    'Cold chain temp sensor at {node} — reading {temp}°C',
    'Humidity index at {node} warehouse: {humidity}%',
    'Vibration alert on conveyor belt B-{num} at {node}',
    'RFID gate scan rate at {node}: {rate} tags/min',
    'Backup generator fuel level at {node}: {fuel}%',
  ]},
  { tag: 'TRAFFIC',   color: 'amber',  msgs: [
    'Route NH-{num} congestion index updated: {congestion}/10',
    'Outbound truck queue at {node}: {trucks} vehicles',
    'Freight rail delay on {node}–{node2} corridor: +{delay} min',
    'Border crossing wait time at {node}: {wait} hours',
    'Air cargo terminal queue at {node}: {cargo} pallets pending',
  ]},
  { tag: 'WEATHER',   color: 'sky',    msgs: [
    'Wind speed at {node} updated: {wind} km/h',
    'Barometric pressure drop at {node}: {pressure} hPa',
    'Precipitation forecast at {node}: {rain}mm next 6h',
    'Visibility at {node} airfield: {vis} meters',
    'Lightning strike detected {km}km from {node} facility',
  ]},
  { tag: 'SECURITY',  color: 'red',    msgs: [
    'Access card scan anomaly at {node} Gate-{gate}',
    'CCTV motion trigger in {node} cold vault sector {sector}',
    'Perimeter breach alert cleared at {node} — false positive',
    'Vehicle inspection checkpoint at {node} flagged {num} containers',
    'Cybersecurity scan at {node}: {threats} low-severity events logged',
  ]},
  { tag: 'INVENTORY', color: 'emerald',msgs: [
    'SKU reorder triggered at {node}: {sku} below threshold',
    'Pallet count mismatch at {node} dock {dock}: -{units} units',
    'Inbound shipment confirmed at {node}: {pallets} pallets',
    'Outbound batch dispatched from {node}: {batch} kg',
    'Cold chain compliance scan at {node}: {pct}% passed',
  ]},
];

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function fillTemplate(tpl, nodeId) {
  const node2 = randFrom(NODE_IDS.filter(n => n !== nodeId));
  return tpl
    .replace(/{node2}/g, node2.toUpperCase())
    .replace(/{node}/g, nodeId.toUpperCase())
    .replace(/{temp}/g, randInt(2, 42))
    .replace(/{humidity}/g, randInt(30, 95))
    .replace(/{num}/g, randInt(1, 99))
    .replace(/{rate}/g, randInt(120, 800))
    .replace(/{fuel}/g, randInt(15, 95))
    .replace(/{congestion}/g, randInt(1, 10))
    .replace(/{trucks}/g, randInt(5, 60))
    .replace(/{delay}/g, randInt(10, 180))
    .replace(/{wait}/g, (randInt(1, 18) / 2).toFixed(1))
    .replace(/{cargo}/g, randInt(50, 400))
    .replace(/{wind}/g, randInt(8, 120))
    .replace(/{pressure}/g, randInt(990, 1020))
    .replace(/{rain}/g, randInt(0, 80))
    .replace(/{vis}/g, randInt(50, 9999))
    .replace(/{km}/g, randInt(1, 50))
    .replace(/{gate}/g, `G${randInt(1, 12)}`)
    .replace(/{sector}/g, String.fromCharCode(65 + randInt(0, 5)))
    .replace(/{threats}/g, randInt(0, 7))
    .replace(/{sku}/g, `SKU-${randInt(1000, 9999)}`)
    .replace(/{dock}/g, randInt(1, 20))
    .replace(/{units}/g, randInt(1, 30))
    .replace(/{pallets}/g, randInt(10, 200))
    .replace(/{batch}/g, (randInt(100, 5000)))
    .replace(/{pct}/g, randInt(88, 100));
}

function generateLiveTick(crisisNodeId, isCrisis, tick) {
  const nodeId = randFrom(NODE_IDS);
  const category = randFrom(LIVE_EVENTS);
  const msg = fillTemplate(randFrom(category.msgs), nodeId);

  // Node health scores (all fluctuate slightly, crisis node tanks)
  const nodeHealth = {};
  NODE_IDS.forEach(n => {
    const base = n === crisisNodeId && isCrisis ? randInt(10, 35) : randInt(72, 99);
    nodeHealth[n] = base;
  });

  // Sensor readings per node
  const sensors = {};
  NODE_IDS.forEach(n => {
    const isCrisisNode = n === crisisNodeId && isCrisis;
    sensors[n] = {
      temp:        isCrisisNode ? randInt(28, 52) : randInt(18, 32),
      humidity:    isCrisisNode ? randInt(80, 100): randInt(40, 65),
      floodDepth:  isCrisisNode ? randInt(20, 150): 0,
      windSpeed:   isCrisisNode ? randInt(60, 145): randInt(5, 30),
      congestion:  isCrisisNode ? randInt(7, 10)  : randInt(1, 5),
      power:       isCrisisNode ? randInt(0, 60)  : randInt(85, 100),
    };
  });

  // Overall risk score
  const baseRisk = isCrisis ? randInt(58, 92) : randInt(8, 22);
  const riskScore = Math.min(100, baseRisk + (tick % 5 === 0 ? randInt(-5, 8) : 0));

  return {
    type: 'tick',
    ts: new Date().toISOString(),
    tick,
    event: { tag: category.tag, color: category.color, msg, nodeId },
    nodeHealth,
    sensors,
    riskScore,
    activeAlerts: isCrisis ? randInt(2, 6) : 0,
    throughput: isCrisis ? randInt(1200, 4000) : randInt(6000, 12000),
  };
}

router.get('/live-stream', (req, res) => {
  const { crisisNodeId, crisis } = req.query;
  const isCrisis = crisis === 'true';
  const targetNode = crisisNodeId || 'bengaluru';

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });
  res.write(':\n\n'); // comment to keep alive

  let tick = 0;
  const interval = setInterval(() => {
    tick++;
    const data = generateLiveTick(targetNode, isCrisis, tick);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 2000);

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

module.exports = router;

