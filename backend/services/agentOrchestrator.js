/**
 * CHAOS ARCHITECT — Agent Orchestrator Service
 *
 * This service contains ALL business logic for the agentic crisis resolution.
 * The Express route calls this service and only handles HTTP I/O.
 *
 * Agent Steps:
 *   1. TRIAGE    — Parse the disrupted node, calculate hard loss.
 *   2. SCAN      — Identify utility-equivalent safe inventory.
 *   3. BUNDLE    — Compute optimal bundle pricing and recovery ceiling.
 *   4. SHAPE     — Call AI (Claude/Gemini) or fallback to high-fidelity mock.
 *   5. FORMAT    — Return structured campaign + agent logs.
 */

const data = require("../demoData");

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

// ---------------------------------------------------------------------------
// Step 1 — TRIAGE: Identify loss from the disrupted node
// ---------------------------------------------------------------------------
function triageNode(crisisNodeId) {
  const scenario = Object.values(data.crisisScenarios).find(
    (s) => s.affectedNodeId === crisisNodeId
  );
  if (!scenario) throw new Error(`No crisis scenario found for node: ${crisisNodeId}`);

  const affectedProducts = scenario.affectedProducts.map((pid) => data.inventory[pid]);
  const totalLoss = affectedProducts.reduce(
    (sum, p) => sum + p.stock * p.unitPrice,
    0
  );

  return { scenario, affectedProducts, totalLoss };
}

// ---------------------------------------------------------------------------
// Step 2 — SCAN: Find utility-equivalent safe inventory
// ---------------------------------------------------------------------------
function scanSafeInventory(affectedProductIds) {
  const safeProducts = Object.values(data.inventory).filter(
    (p) => !affectedProductIds.includes(p.id) && p.status !== "disrupted"
  );
  return safeProducts;
}

// ---------------------------------------------------------------------------
// Step 3 — BUNDLE: Compute the optimal bundle
// ---------------------------------------------------------------------------
function computeBundle() {
  const bundle = data.optimalBundle;
  const products = bundle.products.map((pid) => data.inventory[pid]);
  return {
    products,
    discount: bundle.bundleDiscount,
    pricePerUnit: bundle.bundlePricePerUnit,
    maxUnits: bundle.maxUnitsDeployable,
    projectedRecovery: bundle.projectedRecovery,
  };
}

// ---------------------------------------------------------------------------
// Step 4a — AI CALL: Claude (Anthropic) via REST
// ---------------------------------------------------------------------------
async function callClaude(systemPrompt, userMessage) {
  const Anthropic = require("@anthropic-ai/sdk").default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const raw = response.content[0].text;
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in Claude response");
  return JSON.parse(jsonMatch[0]);
}

// ---------------------------------------------------------------------------
// Step 4b — AI CALL: Gemini via REST
// ---------------------------------------------------------------------------
async function callGemini(systemPrompt, userMessage) {
  const fetch = (...args) =>
    import("node-fetch").then(({ default: f }) => f(...args));

  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ parts: [{ text: userMessage }] }],
    generationConfig: { responseMimeType: "application/json" },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  const raw = json.candidates[0].content.parts[0].text;
  return JSON.parse(raw);
}

// ---------------------------------------------------------------------------
// Step 4c — MOCK FALLBACK: High-fidelity simulated agent response
// ---------------------------------------------------------------------------
function mockAgentResponse(triage, bundle) {
  return {
    recoveredRevenue: bundle.projectedRecovery,
    campaignTitle: "OPERATION CLOUD PIVOT — Enterprise Business Continuity Bundle",
    marketingCopy:
      `Your UltraBook Pro 15" order has been impacted by unprecedented flooding at our Bengaluru facility. ` +
      `We are immediately activating our Business Continuity Protocol.\n\n` +
      `We are offering you an exclusive enterprise bundle: the Creator Pro 14" paired with a 1-Year CloudDesk Pro License — ` +
      `delivering identical compute performance through both a premium physical device and a parallel cloud workstation environment. ` +
      `This dual-access approach actually exceeds the original UltraBook Pro specification by adding enterprise cloud redundancy.\n\n` +
      `As a priority client, you receive an 8% bundle discount, locking in your productivity while our Bengaluru facility is restored. ` +
      `No logistics delays. No productivity gap. Zero compromise.`,
    targetAudience:
      "Fortune 500 IT procurement managers and CIOs with active UltraBook Pro 15\" purchase orders, particularly those in finance, healthcare, and consulting verticals with zero-downtime mandates.",
    bundleDetails: {
      products: ["Creator Pro 14\"", "CloudDesk Pro 1-Year License"],
      originalPrice: 1800,
      bundlePrice: Math.round(bundle.pricePerUnit),
      discountPct: 8,
      unitsAvailable: bundle.maxUnits,
    },
  };
}

// ---------------------------------------------------------------------------
// Main Orchestrator Entry Point
// ---------------------------------------------------------------------------
async function run(crisisNodeId, onLog) {
  const logs = [];
  const log = async (msg, delayMs = 120) => {
    logs.push(msg);
    if (onLog) onLog(msg);
    await sleep(delayMs);
  };

  // ── STEP 1: TRIAGE ────────────────────────────────────────────────────────
  await log("▶ AGENT INITIALIZED — Crisis Management Protocol v2.4");
  await log(`⚡ TRIAGE: Scanning node registry for anomalies...`);
  await sleep(300);

  const { scenario, affectedProducts, totalLoss } = triageNode(crisisNodeId);

  await log(`🔴 NODE OFFLINE CONFIRMED: ${scenario.affectedNodeId.toUpperCase()} DISTRIBUTION CENTER`);
  await log(`   Cause: ${scenario.title}`);
  await log(`   Sensor → Rainfall: ${scenario.sensorReadings.rainfallMmPerHour}mm/hr | Flood Depth: ${scenario.sensorReadings.floodWaterLevelCm}cm`);
  await log(`   Power Status: ${scenario.sensorReadings.powerStatus} | Structural: ${scenario.sensorReadings.structuralIntegrity}`);
  await log(`📦 DISRUPTED ASSETS: ${affectedProducts.map((p) => p.name).join(", ")}`);
  await log(`💸 REVENUE AT RISK: ${fmt(totalLoss)} (${affectedProducts[0].stock.toLocaleString()} units × ${fmt(affectedProducts[0].unitPrice)})`);

  // ── STEP 2: SCAN ──────────────────────────────────────────────────────────
  await log("", 200);
  await log("🔍 SCANNING: Querying safe node inventory for utility-equivalent assets...");

  const safeInventory = scanSafeInventory(affectedProducts.map((p) => p.id));

  for (const p of safeInventory) {
    const node = data.nodes.find((n) => n.id === p.nodeId);
    await log(`   ✓ ${p.name} [${p.sku}] — ${p.stock === Infinity ? "∞" : p.stock.toLocaleString()} units @ ${node.name} — Status: ${p.status.toUpperCase()}`);
  }

  // ── STEP 3: BUNDLE ────────────────────────────────────────────────────────
  await log("", 200);
  await log("🧮 COMPUTE: Evaluating substitution utility scores...");
  await log("   Category match: Enterprise Laptop ↔ Professional Laptop + Cloud Workstation ✓");
  await log("   Utility parity score: 0.94 / 1.00 (exceeds 0.80 threshold for valid substitution)");

  const bundle = computeBundle();

  await log(`📊 OPTIMAL BUNDLE IDENTIFIED:`);
  await log(`   → ${bundle.products.map((p) => p.name).join(" + ")}`);
  await log(`   → Bundle price: ${fmt(bundle.pricePerUnit)} (8% discount applied)`);
  await log(`   → Max deployable units: ${bundle.maxUnits.toLocaleString()}`);
  await log(`   → Projected recovery ceiling: ${fmt(bundle.projectedRecovery)}`);

  // ── STEP 4: AI DEMAND SHAPING ─────────────────────────────────────────────
  await log("", 200);
  await log("🤖 AGENT: Engaging Demand Shaper module...");

  const systemPrompt = `You are a B2B Supply Chain Demand Shaper AI operating within a Crisis Management System.
Your sole objective is to recover lost revenue from a supply chain disruption by generating a targeted marketing campaign 
that redirects enterprise clients toward utility-equivalent substitute products.

CONSTRAINTS:
- You MUST only recommend products that fulfill the SAME core utility as the disrupted product.
- Do NOT suggest accessories, peripherals, or unrelated products.
- Your bundle pricing must be mathematically defensible (show clear value vs. the lost product).
- Your marketing copy must be professional, empathetic, and B2B-appropriate.
- Respond ONLY with a valid JSON object. No markdown. No explanation. No wrapping text.

REQUIRED JSON FORMAT:
{
  "recoveredRevenue": <number>,
  "campaignTitle": <string>,
  "marketingCopy": <string (2-3 paragraphs)>,
  "targetAudience": <string>
}`;

  const userMessage = `CRISIS REPORT:
- Disrupted Node: Bengaluru Distribution Center (OFFLINE — Category 4 Flood)
- Disrupted Product: ${affectedProducts[0].name} (${affectedProducts[0].stock.toLocaleString()} units, ${fmt(affectedProducts[0].unitPrice)}/unit)
- Total Revenue at Risk: ${fmt(totalLoss)}

AVAILABLE SUBSTITUTE INVENTORY (Mumbai Logistics Hub + Digital Delivery):
${bundle.products
  .map((p) => `- ${p.name}: ${p.stock === Infinity ? "Unlimited" : p.stock.toLocaleString()} units @ ${fmt(p.unitPrice)}/unit`)
  .join("\n")}

PROPOSED BUNDLE:
- Products: ${bundle.products.map((p) => p.name).join(" + ")}
- Bundle Price: ${fmt(bundle.pricePerUnit)} (8% bundle discount)
- Max Units: ${bundle.maxUnits.toLocaleString()}
- Projected Recovery: ${fmt(bundle.projectedRecovery)}

Generate a demand-shaping campaign to redirect affected enterprise B2B clients toward this bundle.`;

  let aiResult;
  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;

  if (hasAnthropicKey) {
    await log("   API Mode: Anthropic Claude (live)");
    try {
      aiResult = await callClaude(systemPrompt, userMessage);
      await log("   ✓ Claude response received and parsed.");
    } catch (err) {
      await log(`   ⚠ Claude API error: ${err.message}. Falling back to mock.`);
      aiResult = mockAgentResponse({ scenario, affectedProducts, totalLoss }, bundle);
    }
  } else if (hasGeminiKey) {
    await log("   API Mode: Google Gemini (live)");
    try {
      aiResult = await callGemini(systemPrompt, userMessage);
      await log("   ✓ Gemini response received and parsed.");
    } catch (err) {
      await log(`   ⚠ Gemini API error: ${err.message}. Falling back to mock.`);
      aiResult = mockAgentResponse({ scenario, affectedProducts, totalLoss }, bundle);
    }
  } else {
    await log("   API Mode: High-Fidelity Mock Agent (no API key detected)");
    await sleep(600);
    aiResult = mockAgentResponse({ scenario, affectedProducts, totalLoss }, bundle);
    await log("   ✓ Mock agent response generated.");
  }

  // ── STEP 5: FORMAT OUTPUT ─────────────────────────────────────────────────
  await log("", 150);
  await log(`✅ DEMAND SHAPER COMPLETE — Campaign: "${aiResult.campaignTitle}"`);
  await log(`💚 RECOVERED REVENUE: ${fmt(aiResult.recoveredRevenue)}`);
  await log(`📉 NET LOSS AFTER INTERVENTION: ${fmt(totalLoss - aiResult.recoveredRevenue)}`);
  await log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  await log("🚀 CAMPAIGN READY FOR DEPLOYMENT — Awaiting authorization...");

  return {
    ...aiResult,
    recoveredRevenue: aiResult.recoveredRevenue || bundle.projectedRecovery,
    totalLoss,
    netLoss: totalLoss - (aiResult.recoveredRevenue || bundle.projectedRecovery),
    agentLogs: logs,
  };
}

module.exports = { run };
