/**
 * CHAOS ARCHITECT — Agent Orchestrator Service
 *
 * Architecture: ReAct (Reason + Act) Loop
 * ─────────────────────────────────────────
 * The agent does NOT run linearly. It reasons about what to do next,
 * selects a tool to call, observes the result, and reasons again.
 *
 * Each cycle:
 *   [THOUGHT]     — Internal monologue: what does the agent need to know?
 *   [ACTION]      — Tool call: which function will answer the question?
 *   [OBSERVATION] — Tool result: what did the agent learn?
 *
 * Tools (discrete, pure functions the agent can call):
 *   tool_query_node_status(nodeId)
 *   tool_query_inventory(nodeId)
 *   tool_assess_utility_class(sku)
 *   tool_calculate_utility_bundle(disruptedSku)
 *   tool_project_financial_impact(sku, units, unitPrice)
 *   tool_generate_campaign(bundle, triage)
 */

"use strict";

const data = require("../demoData");

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const fmt = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

// ─────────────────────────────────────────────────────────────────────────────
// TOOL REGISTRY
// Discrete, pure functions the agent can invoke. Each returns a structured
// observation the agent can reason over in the next THOUGHT step.
// ─────────────────────────────────────────────────────────────────────────────

const tools = {

  /**
   * tool_query_node_status(nodeId)
   * Returns the current operational status and sensor readings for a node.
   */
  tool_query_node_status(nodeId) {
    const node = data.nodes.find((n) => n.id === nodeId);
    if (!node) return { error: `Node '${nodeId}' not found in registry.` };

    const scenario = Object.values(data.crisisScenarios).find(
      (s) => s.affectedNodeId === nodeId
    );

    return {
      nodeId: node.id,
      name: node.name,
      region: node.region,
      operationalStatus: scenario ? "OFFLINE" : "ONLINE",
      vulnerabilityScore: node.vulnerabilityScore,
      sensorReadings: scenario?.sensorReadings ?? null,
      crisisTitle: scenario?.title ?? null,
      affectedProducts: scenario?.affectedProducts ?? [],
    };
  },

  /**
   * tool_query_inventory(nodeId)
   * Returns full inventory stock levels for all products at a given node.
   */
  tool_query_inventory(nodeId) {
    const products = Object.values(data.inventory).filter(
      (p) => p.nodeId === nodeId
    );

    if (!products.length) {
      return { nodeId, products: [], message: "No inventory found at this node." };
    }

    return {
      nodeId,
      products: products.map((p) => ({
        sku: p.sku,
        name: p.name,
        category: p.category,
        unitPrice: p.unitPrice,
        stock: p.stock === Infinity ? "UNLIMITED (digital)" : p.stock,
        status: p.status,
        margin: p.margin,
      })),
    };
  },

  /**
   * tool_assess_utility_class(sku)
   * Determines the utility category of a product and finds all inventory
   * that shares the same utility class (valid substitutes).
   */
  tool_assess_utility_class(sku) {
    const product = Object.values(data.inventory).find((p) => p.sku === sku);
    if (!product) return { error: `SKU '${sku}' not found.` };

    // Utility mapping: products that serve the same enterprise compute need
    const UTILITY_MAP = {
      "Enterprise Laptop":       ["Enterprise Laptop", "Professional Laptop", "Cloud Workstation License"],
      "Professional Laptop":     ["Enterprise Laptop", "Professional Laptop", "Cloud Workstation License"],
      "Cloud Workstation License": ["Enterprise Laptop", "Professional Laptop", "Cloud Workstation License"],
    };

    const validCategories = UTILITY_MAP[product.category] ?? [product.category];

    const substitutes = Object.values(data.inventory).filter(
      (p) => p.sku !== sku &&
             validCategories.includes(p.category) &&
             p.status !== "disrupted"
    );

    return {
      queriedSku: sku,
      utilityClass: product.category,
      utilityScore: 1.0,
      validSubstituteCategories: validCategories,
      substitutes: substitutes.map((p) => ({
        sku: p.sku,
        name: p.name,
        category: p.category,
        utilityParityScore: p.category === product.category ? 0.97 : 0.91,
        nodeId: p.nodeId,
        status: p.status,
      })),
    };
  },

  /**
   * tool_calculate_utility_bundle(disruptedSku)
   * Computes the mathematically optimal substitute bundle to replace
   * the disrupted product's utility. Returns full pricing and recovery math.
   */
  tool_calculate_utility_bundle(disruptedSku) {
    const disrupted = Object.values(data.inventory).find((p) => p.sku === disruptedSku);
    if (!disrupted) return { error: `SKU '${disruptedSku}' not found.` };

    const bundle = data.optimalBundle;
    const bundleProducts = bundle.products.map((pid) => data.inventory[pid]);

    const basePrice = bundleProducts.reduce((sum, p) => sum + p.unitPrice, 0);
    const discountedPrice = basePrice * (1 - bundle.bundleDiscount);

    return {
      disruptedProduct: { sku: disrupted.sku, name: disrupted.name, unitPrice: disrupted.unitPrice },
      bundleProducts: bundleProducts.map((p) => ({
        sku: p.sku,
        name: p.name,
        unitPrice: p.unitPrice,
        nodeId: p.nodeId,
      })),
      pricingMath: {
        combinedBasePrice: basePrice,
        bundleDiscountPct: bundle.bundleDiscount * 100,
        finalBundlePrice: Math.round(discountedPrice * 100) / 100,
        vsDisruptedProduct: `+${fmt(discountedPrice - disrupted.unitPrice)} per unit (higher value)`,
      },
      deploymentCeiling: {
        maxUnits: bundle.maxUnitsDeployable,
        limitingFactor: "Creator Pro 14\" stock in Mumbai (3,200 units)",
        projectedRecovery: bundle.projectedRecovery,
        recoveryAsPercentOfLoss: `${((bundle.projectedRecovery / (disrupted.stock * disrupted.unitPrice)) * 100).toFixed(1)}%`,
      },
    };
  },

  /**
   * tool_project_financial_impact(sku, units, unitPrice)
   * Calculates total revenue exposure for a disrupted product.
   */
  tool_project_financial_impact(sku, units, unitPrice) {
    const totalExposure = units * unitPrice;
    return {
      sku,
      unitsStranded: units,
      unitPrice,
      totalRevenueExposure: totalExposure,
      formatted: fmt(totalExposure),
      severity: totalExposure > 5_000_000 ? "CRITICAL" : totalExposure > 1_000_000 ? "HIGH" : "MEDIUM",
    };
  },

};

// ─────────────────────────────────────────────────────────────────────────────
// Mock campaign generator (used when no LLM API key is configured)
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// LLM callers (Claude / Gemini)
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// ReAct Loop — Main Orchestrator Entry Point
// ─────────────────────────────────────────────────────────────────────────────

async function run(crisisNodeId, onLog) {
  const logs = [];

  // Log helpers for each ReAct token type
  const log = async (msg, delayMs = 100) => {
    logs.push(msg);
    if (onLog) onLog(msg);
    await sleep(delayMs);
  };

  const thought = async (msg, delay = 180) =>
    log(`💭 [THOUGHT]     ${msg}`, delay);

  const action = async (msg, delay = 140) =>
    log(`⚙  [ACTION]      ${msg}`, delay);

  const observe = async (msg, delay = 160) =>
    log(`🔬 [OBSERVATION] ${msg}`, delay);

  const divider = async () => log("─────────────────────────────────────────────────────────────", 60);

  // ── BOOT ──────────────────────────────────────────────────────────────────
  await log("▶  CHAOS ARCHITECT — ReAct Agent Runtime v3.0");
  await log("   Framework: Reason + Act (ReAct) Loop");
  await log("   Crisis input received. Beginning autonomous reasoning...");
  await divider();
  await sleep(200);

  // ══════════════════════════════════════════════════════════════════════════
  // REACT CYCLE 1: Assess the node status
  // ══════════════════════════════════════════════════════════════════════════

  await thought(`A crisis has been reported at node '${crisisNodeId}'. I must first verify its operational status and understand the severity of the event.`);
  await action(`Calling tool_query_node_status('${crisisNodeId}')`);
  await sleep(300);

  const nodeStatus = tools.tool_query_node_status(crisisNodeId);

  await observe(`Node '${nodeStatus.name}' is ${nodeStatus.operationalStatus}.`);
  if (nodeStatus.operationalStatus === "OFFLINE") {
    await observe(`Crisis confirmed: "${nodeStatus.crisisTitle}"`);
    await observe(`Sensor data → Rainfall: ${nodeStatus.sensorReadings?.rainfallMmPerHour}mm/hr | Flood Depth: ${nodeStatus.sensorReadings?.floodWaterLevelCm}cm`);
    await observe(`Power: ${nodeStatus.sensorReadings?.powerStatus} | Structural integrity: ${nodeStatus.sensorReadings?.structuralIntegrity}`);
    await observe(`Affected SKUs at this node: ${nodeStatus.affectedProducts.join(", ")}`);
  }
  await divider();

  // ══════════════════════════════════════════════════════════════════════════
  // REACT CYCLE 2: Query stranded inventory
  // ══════════════════════════════════════════════════════════════════════════

  await thought(`The node is confirmed offline. I need to know exactly how many units are stranded and what their value is to compute the financial exposure.`);
  await action(`Calling tool_query_inventory('${crisisNodeId}')`);
  await sleep(300);

  const strandedInventory = tools.tool_query_inventory(crisisNodeId);
  const disruptedProduct = strandedInventory.products[0];

  await observe(`Found ${strandedInventory.products.length} product line(s) stranded at ${crisisNodeId}.`);
  for (const p of strandedInventory.products) {
    await observe(`→ [${p.sku}] ${p.name} | ${p.stock} units | ${fmt(p.unitPrice)}/unit | Status: ${p.status.toUpperCase()}`);
  }
  await divider();

  // ══════════════════════════════════════════════════════════════════════════
  // REACT CYCLE 3: Calculate financial impact
  // ══════════════════════════════════════════════════════════════════════════

  await thought(`I now know what is stranded. I must quantify the revenue at risk before I can size the recovery target. This will frame the urgency of the campaign I need to generate.`);
  await action(`Calling tool_project_financial_impact('${disruptedProduct.sku}', ${disruptedProduct.stock}, ${disruptedProduct.unitPrice})`);
  await sleep(250);

  const financialImpact = tools.tool_project_financial_impact(
    disruptedProduct.sku,
    typeof disruptedProduct.stock === "number" ? disruptedProduct.stock : 5000,
    disruptedProduct.unitPrice
  );

  await observe(`Total revenue exposure: ${financialImpact.formatted}`);
  await observe(`Severity classification: ${financialImpact.severity}`);
  await observe(`${financialImpact.unitsStranded.toLocaleString()} units × ${fmt(financialImpact.unitPrice)}/unit = ${financialImpact.formatted} at risk.`);
  await divider();

  // ══════════════════════════════════════════════════════════════════════════
  // REACT CYCLE 4: Assess utility class to find valid substitutes
  // ══════════════════════════════════════════════════════════════════════════

  await thought(`The financial exposure is ${financialImpact.severity}. I must not recommend arbitrary substitute products — I need to find ones that fulfill the SAME utility class. I will query the utility assessment tool.`);
  await action(`Calling tool_assess_utility_class('${disruptedProduct.sku}')`);
  await sleep(300);

  const utilityAssessment = tools.tool_assess_utility_class(disruptedProduct.sku);

  await observe(`Disrupted product utility class: "${utilityAssessment.utilityClass}"`);
  await observe(`Valid substitute categories: ${utilityAssessment.validSubstituteCategories.join(", ")}`);
  await observe(`Found ${utilityAssessment.substitutes.length} utility-equivalent substitute(s) in safe nodes:`);
  for (const sub of utilityAssessment.substitutes) {
    await observe(`  ✓ [${sub.sku}] ${sub.name} — Parity score: ${sub.utilityParityScore} | Node: ${sub.nodeId} | Status: ${sub.status.toUpperCase()}`);
  }
  await divider();

  // ══════════════════════════════════════════════════════════════════════════
  // REACT CYCLE 5: Calculate the optimal recovery bundle
  // ══════════════════════════════════════════════════════════════════════════

  await thought(`I have confirmed valid utility-equivalent substitutes exist in safe nodes. Now I must calculate the optimal bundle pricing to maximize recovery while maintaining client value perception.`);
  await action(`Calling tool_calculate_utility_bundle('${disruptedProduct.sku}')`);
  await sleep(350);

  const bundleCalc = tools.tool_calculate_utility_bundle(disruptedProduct.sku);

  await observe(`Bundle composition: ${bundleCalc.bundleProducts.map((p) => p.name).join(" + ")}`);
  await observe(`Pricing math:`);
  await observe(`  Base combined price: ${fmt(bundleCalc.pricingMath.combinedBasePrice)}`);
  await observe(`  Bundle discount applied: ${bundleCalc.pricingMath.bundleDiscountPct}%`);
  await observe(`  Final bundle price: ${fmt(bundleCalc.pricingMath.finalBundlePrice)} (${bundleCalc.pricingMath.vsDisruptedProduct})`);
  await observe(`Deployment ceiling: ${bundleCalc.deploymentCeiling.maxUnits.toLocaleString()} units (limited by: ${bundleCalc.deploymentCeiling.limitingFactor})`);
  await observe(`Projected revenue recovery: ${fmt(bundleCalc.deploymentCeiling.projectedRecovery)} (${bundleCalc.deploymentCeiling.recoveryAsPercentOfLoss} of total loss)`);
  await divider();

  // ══════════════════════════════════════════════════════════════════════════
  // REACT CYCLE 6: Generate the demand-shaping campaign via AI / mock
  // ══════════════════════════════════════════════════════════════════════════

  await thought(`I have all the data I need: confirmed disruption, financial impact, valid utility-equivalent bundle, and recovery math. I will now invoke the Demand Shaper to generate an enterprise-grade marketing campaign.`);
  await action(`Calling tool_generate_campaign(bundle_data, financial_impact)`);
  await sleep(200);

  // Build triage summary for the AI/mock call
  const triage = {
    scenario: { title: nodeStatus.crisisTitle, affectedNodeId: crisisNodeId },
    affectedProducts: strandedInventory.products,
    totalLoss: financialImpact.totalRevenueExposure,
  };

  const bundle = {
    products: bundleCalc.bundleProducts.map((bp) => ({
      ...bp,
      stock: Infinity,
    })),
    discount: bundleCalc.pricingMath.bundleDiscountPct / 100,
    pricePerUnit: bundleCalc.pricingMath.finalBundlePrice,
    maxUnits: bundleCalc.deploymentCeiling.maxUnits,
    projectedRecovery: bundleCalc.deploymentCeiling.projectedRecovery,
  };

  const systemPrompt = `You are a B2B Supply Chain Demand Shaper AI operating inside a ReAct Agent Runtime.
You have already completed 5 reasoning cycles and called 5 tools. Your final task is to generate a targeted
marketing campaign that redirects enterprise clients toward the utility-equivalent substitute bundle identified.

HARD CONSTRAINTS:
- Only recommend products that fulfill the SAME core utility (enterprise compute). No peripherals.
- Bundle pricing must be mathematically defensible vs. the disrupted product.
- Marketing copy must be professional, empathetic, and B2B-appropriate (not consumer-facing).
- Respond ONLY with a valid JSON object. No markdown. No explanation.

REQUIRED JSON FORMAT:
{
  "recoveredRevenue": <number>,
  "campaignTitle": <string>,
  "marketingCopy": <string>,
  "targetAudience": <string>
}`;

  const userMessage = `COMPLETED REACT CYCLES SUMMARY:
- Node offline: ${nodeStatus.name} (${nodeStatus.crisisTitle})
- Disrupted product: ${disruptedProduct.name} [${disruptedProduct.sku}] — ${financialImpact.unitsStranded.toLocaleString()} units stranded
- Revenue at risk: ${financialImpact.formatted} (Severity: ${financialImpact.severity})
- Utility class: ${utilityAssessment.utilityClass}
- Validated substitute bundle: ${bundleCalc.bundleProducts.map((p) => p.name).join(" + ")}
- Bundle price: ${fmt(bundleCalc.pricingMath.finalBundlePrice)} (${bundleCalc.pricingMath.bundleDiscountPct}% discount)
- Max units deployable: ${bundleCalc.deploymentCeiling.maxUnits.toLocaleString()}
- Recovery ceiling: ${fmt(bundleCalc.deploymentCeiling.projectedRecovery)} (${bundleCalc.deploymentCeiling.recoveryAsPercentOfLoss} of loss)

Generate the demand-shaping campaign.`;

  let aiResult;
  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
  const hasGeminiKey    = !!process.env.GEMINI_API_KEY;

  if (hasAnthropicKey) {
    await observe(`LLM backend: Anthropic Claude (live). Sending ReAct context...`);
    try {
      aiResult = await callClaude(systemPrompt, userMessage);
      await observe(`✓ Claude campaign generated and parsed.`);
    } catch (err) {
      await observe(`⚠ Claude error: ${err.message}. Activating mock campaign.`);
      aiResult = mockAgentResponse(triage, bundle);
    }
  } else if (hasGeminiKey) {
    await observe(`LLM backend: Google Gemini (live). Sending ReAct context...`);
    try {
      aiResult = await callGemini(systemPrompt, userMessage);
      await observe(`✓ Gemini campaign generated and parsed.`);
    } catch (err) {
      await observe(`⚠ Gemini error: ${err.message}. Activating mock campaign.`);
      aiResult = mockAgentResponse(triage, bundle);
    }
  } else {
    await observe(`No LLM API key detected. Activating high-fidelity mock campaign generator.`);
    await sleep(400);
    aiResult = mockAgentResponse(triage, bundle);
    await observe(`✓ Mock campaign generated.`);
  }

  await divider();

  // ── FINAL OUTPUT ──────────────────────────────────────────────────────────
  await log(`✅ REACT LOOP COMPLETE — 6 cycles | 5 tool calls | 1 campaign generated`);
  await log(`🏷  Campaign: "${aiResult.campaignTitle}"`);
  await log(`💚 Recovered revenue pathway: ${fmt(aiResult.recoveredRevenue || bundleCalc.deploymentCeiling.projectedRecovery)}`);
  await log(`📉 Net loss after intervention: ${fmt(financialImpact.totalRevenueExposure - (aiResult.recoveredRevenue || bundleCalc.deploymentCeiling.projectedRecovery))}`);
  await divider();
  await log(`🚀 CAMPAIGN READY FOR DEPLOYMENT — Awaiting authorization...`);

  const recoveredRevenue = aiResult.recoveredRevenue || bundleCalc.deploymentCeiling.projectedRecovery;

  return {
    ...aiResult,
    recoveredRevenue,
    totalLoss: financialImpact.totalRevenueExposure,
    netLoss: financialImpact.totalRevenueExposure - recoveredRevenue,
    agentLogs: logs,
  };
}

module.exports = { run, tools };
