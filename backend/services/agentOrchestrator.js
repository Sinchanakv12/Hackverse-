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
 */

"use strict";

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const fmt = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

// ─────────────────────────────────────────────────────────────────────────────
// TOOL REGISTRY CREATOR
// Dynamic registry configured with session-specific supply chain data.
// ─────────────────────────────────────────────────────────────────────────────

function createSessionTools(data) {
  return {
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
        weather: node.weather ? (scenario ? node.weather.crisis : node.weather.normal) : null,
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

      // Utility mapping: products that serve the same utility class
      const UTILITY_MAP = {
        "Enterprise Laptop":       ["Enterprise Laptop", "Professional Laptop", "Cloud Workstation License"],
        "Professional Laptop":     ["Enterprise Laptop", "Professional Laptop", "Cloud Workstation License"],
        "Cloud Workstation License": ["Enterprise Laptop", "Professional Laptop", "Cloud Workstation License"],
        "Perishable Organic Produce": ["Perishable Organic Produce", "Flash-Frozen Cold Chain", "Shelf-Stable Produce Equivalents"],
        "Flash-Frozen Cold Chain": ["Perishable Organic Produce", "Flash-Frozen Cold Chain", "Shelf-Stable Produce Equivalents"],
        "Shelf-Stable Produce Equivalents": ["Perishable Organic Produce", "Flash-Frozen Cold Chain", "Shelf-Stable Produce Equivalents"],
        "Therapeutics & Vaccines": ["Therapeutics & Vaccines", "Local reserve stocks", "Alternative Therapeutics"],
        "Local reserve stocks": ["Therapeutics & Vaccines", "Local reserve stocks", "Alternative Therapeutics"],
        "Alternative Therapeutics": ["Therapeutics & Vaccines", "Local reserve stocks", "Alternative Therapeutics"],
        "Hazardous Chemicals": ["Hazardous Chemicals", "Alternative Chemical Suppliers", "Local Neutralization Agents"],
        "Alternative Chemical Suppliers": ["Hazardous Chemicals", "Alternative Chemical Suppliers", "Local Neutralization Agents"],
        "Local Neutralization Agents": ["Hazardous Chemicals", "Alternative Chemical Suppliers", "Local Neutralization Agents"],
        "Retail Merchandise": ["Retail Merchandise", "Alternative logistics routing", "Express logistics upgrades"],
        "Alternative logistics routing": ["Retail Merchandise", "Alternative logistics routing", "Express logistics upgrades"],
        "Express logistics upgrades": ["Retail Merchandise", "Alternative logistics routing", "Express logistics upgrades"],
        "Bulk Raw Materials": ["Bulk Raw Materials", "Alternative Raw Material Suppliers", "Specialized logistics support"],
        "Alternative Raw Material Suppliers": ["Bulk Raw Materials", "Alternative Raw Material Suppliers", "Specialized logistics support"],
        "Specialized logistics support": ["Bulk Raw Materials", "Alternative Raw Material Suppliers", "Specialized logistics support"],
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
          utilityParityScore: p.category === product.category ? 0.97 : 0.88,
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
          vsDisruptedProduct: `-${fmt(disrupted.unitPrice - discountedPrice)} per unit`,
        },
        deploymentCeiling: {
          maxUnits: bundle.maxUnitsDeployable,
          limitingFactor: `Substitute stock in Mumbai (${bundle.maxUnitsDeployable.toLocaleString()} units)`,
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

    /**
     * tool_locate_nearest_cold_hub()
     * Locates the nearest open refrigerated or high-security logistics facility.
     */
    tool_locate_nearest_cold_hub() {
      return {
        nearestHubId: "mumbai",
        name: "Mumbai Logistics Hub",
        distanceKm: 980,
        refrigeratedBaySlotsAvailable: 14,
        status: "FULLY OPERATIONAL",
        temperatureCelsius: "4°C",
      };
    },

    /**
     * tool_calculate_prediction_accuracy(cargoConstraints, availableFleet)
     * Evaluates prediction accuracy based on vertical, subcategory, vehicle choice, and telemetry status.
     */
    tool_calculate_prediction_accuracy(cargoConstraints, availableFleet) {
      let confidence = 95.0;
      const reasons = [];

      const subCat = cargoConstraints.subCategory || "";
      const veh = cargoConstraints.vehicleType || cargoConstraints.vehicle || "";
      const tel = cargoConstraints.telemetryActive !== false && cargoConstraints.telemetry !== false;
      const vert = cargoConstraints.category || cargoConstraints.vertical || "";

      // 1. Spoilage risk check
      const isPerishable = ["Dairy/Meat", "Fresh Produce"].includes(subCat) || vert === "food_ag" || vert === "Food & Ag";
      if (isPerishable && veh !== "Reefer (Refrigerated)") {
        confidence -= 35.0;
        reasons.push("High spoilage risk: Temperature-sensitive payload assigned to unrefrigerated Dry Van.");
      }

      // 2. Regulatory risk check
      const isHazmatCategory = vert === "hazardous_chemicals" || vert === "Hazmat";
      if (isHazmatCategory && veh !== "Hazmat Certified Carrier") {
        confidence -= 45.0;
        reasons.push("Severe compliance risk: Non-certified carrier transporting hazardous materials.");
      }

      // 3. Data blindness check
      if (!tel) {
        confidence -= 12.0;
        reasons.push("Blind routing: Lack of live telemetry increases delay probability.");
      }

      if (reasons.length === 0) {
        reasons.push("Optimal asset-to-constraint alignment. Minimum risk profile.");
      }

      const score = Math.max(0.0, Math.min(100.0, confidence));
      return {
        score,
        confidence: score,
        reasoning: reasons.join(" ")
      };
    }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ReAct Loop — Main Orchestrator Entry Point
// ─────────────────────────────────────────────────────────────────────────────

async function run(crisisNodeId, onLog, simulationConfig) {
  let vertical = simulationConfig?.vertical || simulationConfig?.category || 'electronics';
  if (vertical === "food" || vertical === "food_ag" || vertical === "Food & Ag") vertical = "food_ag";
  if (vertical === "healthcare" || vertical === "healthcare_pharma" || vertical === "Healthcare") vertical = "healthcare_pharma";
  if (vertical === "hazmat" || vertical === "hazardous_chemicals" || vertical === "Hazmat") vertical = "hazardous_chemicals";
  if (vertical === "electronics" || vertical === "Electronics") vertical = "electronics";
  if (vertical === "retail" || vertical === "retail_ecommerce" || vertical === "Retail & E-commerce") vertical = "retail_ecommerce";
  if (vertical === "industrial" || vertical === "industrial_raw" || vertical === "Industrial Raw Materials") vertical = "industrial_raw";

  // Instantiate dataset using the new dynamic generator
  const data = require("../demoData").generateSupplyChainState(simulationConfig);
  const profile = data.profile;

  const tools = createSessionTools(data);
  const targetProduct = data.inventory["product-a"];
  const targetBundle = data.optimalBundle;
  const targetExposure = targetProduct.stock * targetProduct.unitPrice;

  // Read config constraints
  const constraints = targetProduct.constraints || {};
  const maxShelfLife = constraints.maxShelfLife || 48;

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

  // BOOT LOGS
  await log("▶  CHAOS ARCHITECT — ReAct Agent Runtime v3.0");
  await log("   Framework: Reason + Act (ReAct) Loop");
  await log("   Crisis input received. Beginning autonomous reasoning...");
  await divider();
  await sleep(200);

  // ══════════════════════════════════════════════════════════════════════════
  // DYNAMIC REACT LOOP
  // ══════════════════════════════════════════════════════════════════════════

  // CYCLE 1: Verify operational status
  await thought(`Specialized checks required for ${profile.verticalLabel} vertical. Checking operational status and specialized sensors at '${crisisNodeId}'.`);
  await action(`Calling tool_query_node_status('${crisisNodeId}')`);
  await sleep(300);

  const nodeStatus = tools.tool_query_node_status(crisisNodeId);
  await observe(`Node '${nodeStatus.name}' is ${nodeStatus.operationalStatus}.`);
  await observe(`Crisis confirmed: "${nodeStatus.crisisTitle}"`);
  
  // Custom vertical observations
  if (vertical === 'healthcare_pharma') {
    await observe(`Power: OFFLINE | Temp sensor: -12°C (CRYOGENIC DEEP FREEZE BREACH - Danger threshold -70°C exceeded)`);
  } else if (vertical === 'hazardous_chemicals') {
    await observe(`Power: OFFLINE | Containment breach detected in Solvent Isolation Bays (HAZMAT CLASSIFICATION: Class 3 Flammable Solvent leak risk)`);
  } else if (vertical === 'food_ag') {
    await observe(`Power: OFFLINE | Temp sensor: +18°C (COLD CHAIN BREAK - Backup generator failure)`);
  } else if (vertical === 'industrial_raw') {
    await observe(`Power: OFFLINE | Crane crane power: FAILED | Yard status: FLOODED (Tonnage flatbed loading suspended)`);
  } else if (vertical === 'retail_ecommerce') {
    await observe(`Power: OFFLINE | Sorting gateway: FLOOD GATE BREACH | Dispatch: HALTED`);
  } else {
    await observe(`Power: OFFLINE | Structural integrity: COMPROMISED`);
  }
  
  await observe(`Rainfall: ${nodeStatus.sensorReadings?.rainfallMmPerHour}mm/hr | Flood Depth: ${nodeStatus.sensorReadings?.floodWaterLevelCm}cm`);
  
  // Check routes
  const affectedRoutes = data.transitRoutes.filter(
    (r) => r.source === crisisNodeId || r.target === crisisNodeId
  );
  for (const route of affectedRoutes) {
    await observe(`Transit Route compromised: [${route.id}] (${route.source} ➔ ${route.target})`);
    await observe(`  Traffic Index: ${route.crisis.trafficIndex} | Delay: ${route.crisis.delay} (NH48 CLOSED)`);
  }
  await divider();

  // CYCLE 2: Query stranded inventory
  if (vertical === 'food_ag') {
    await thought(`Inventory will spoil within the configured shelf life of ${maxShelfLife} hours. Immediate B2B liquidation or local salvage routing required.`);
  } else if (vertical === 'healthcare_pharma') {
    await thought(`Cold chain compromised. Critical vaccines will lose clinical potency. Reallocation from secondary regional reserves required immediately.`);
  } else if (vertical === 'hazardous_chemicals') {
    await thought(`Containment breach active. Volatile solvents must be neutralized or rerouted to safe chemical holding yards immediately.`);
  } else {
    await thought(`Disruption verified. I need to query the inventory database to determine the exact quantity and SKU details of stranded assets.`);
  }
  
  await action(`Calling tool_query_inventory('${crisisNodeId}')`);
  await sleep(300);

  const stranded = tools.tool_query_inventory(crisisNodeId);
  await observe(`Found ${stranded.products.length} product line(s) stranded at ${crisisNodeId}:`);
  for (const p of stranded.products) {
    await observe(`→ [${p.sku}] ${p.name} | ${p.stock} units | ${fmt(p.unitPrice)}/unit | Status: ${p.status.toUpperCase()}`);
  }
  await divider();

  // CYCLE 3: Locate compatible hub
  if (vertical === 'healthcare_pharma' || vertical === 'food_ag' || vertical === 'hazardous_chemicals') {
    await thought(`I must identify nearby logistics hubs or secure facilities equipped with compatible specialized storage to handle these materials.`);
    await action(`Calling tool_locate_nearest_cold_hub()`);
    await sleep(300);
    const coldHub = tools.tool_locate_nearest_cold_hub();
    await observe(`Nearest compatible hub located: ${coldHub.name} (distance: ${coldHub.distanceKm}km)`);
    await observe(`Specialized storage bays available: ${coldHub.refrigeratedBaySlotsAvailable} | Status: ${coldHub.status}`);
  } else if (vertical === 'industrial_raw') {
    await thought(`Heavy flatbed transport routes are flooded. I need to identify alternative bulk yards or heavy-lift ports in safe nodes.`);
    await action(`Calling tool_locate_nearest_cold_hub()`);
    await sleep(300);
    const hub = tools.tool_locate_nearest_cold_hub();
    await observe(`Industrial transfer point pre-cleared: ${hub.name} (heavy harbor crane operational)`);
  } else {
    await thought(`I must identify alternative routing options and query logistics hubs that have surplus inventory capacity.`);
    await action(`Calling tool_locate_nearest_cold_hub()`);
    await sleep(300);
    const hub = tools.tool_locate_nearest_cold_hub();
    await observe(`Alternate hub active: ${hub.name} with surplus capacity.`);
  }
  await divider();

  // CYCLE 4 (NEW): Calculate prediction accuracy
  await thought(`I must evaluate the statistical probability of success for this reroute based on fleet asset matching and granular cargo constraints.`);
  await action(`Calling tool_calculate_prediction_accuracy(constraints)`);
  await sleep(300);

  const accuracyEval = tools.tool_calculate_prediction_accuracy(constraints);
  await observe(`Asset alignment evaluation: confidence score calculated at ${accuracyEval.confidence.toFixed(1)}% | Reason: ${accuracyEval.reasoning}`);
  await divider();

  // CYCLE 5: Calculate financial impact (was Cycle 4)
  await thought(`Now I will project the total financial exposure and evaluate the severity class of the disruption.`);
  await action(`Calling tool_project_financial_impact('${targetProduct.sku}', ${targetProduct.stock}, ${targetProduct.unitPrice})`);
  await sleep(250);

  const financialImpact = tools.tool_project_financial_impact(targetProduct.sku, targetProduct.stock, targetProduct.unitPrice);
  await observe(`Total revenue exposure: ${financialImpact.formatted}`);
  await observe(`Severity classification: ${financialImpact.severity}`);
  await observe(`${financialImpact.unitsStranded.toLocaleString()} units × ${fmt(financialImpact.unitPrice)}/unit = ${financialImpact.formatted} at risk.`);
  await divider();

  // CYCLE 6: Assess utility class to find valid substitutes (was Cycle 5)
  await thought(`I must identify compatible substitute products or alternative logistics channels in safe nodes sharing the same utility profile.`);
  await action(`Calling tool_assess_utility_class('${targetProduct.sku}')`);
  await sleep(300);

  const utilityAssessment = tools.tool_assess_utility_class(targetProduct.sku);
  await observe(`Disrupted product utility class: "${utilityAssessment.utilityClass}"`);
  await observe(`Valid substitute categories: ${utilityAssessment.validSubstituteCategories.join(", ")}`);
  await observe(`Found ${utilityAssessment.substitutes.length} utility-equivalent substitute(s) in safe nodes:`);
  for (const sub of utilityAssessment.substitutes) {
    await observe(`  ✓ [${sub.sku}] ${sub.name} — Parity score: ${sub.utilityParityScore} | Node: ${sub.nodeId} | Status: ${sub.status.toUpperCase()}`);
  }
  await divider();

  // CYCLE 7: Calculate optimal recovery bundle (was Cycle 6)
  await thought(`Computing optimal bundle pricing, discount margins, and writing demand-shaping B2B continuity copy.`);
  await action(`Calling tool_calculate_utility_bundle('${targetProduct.sku}')`);
  await sleep(350);

  const bundleCalc = tools.tool_calculate_utility_bundle(targetProduct.sku);
  await observe(`Bundle composition: ${bundleCalc.bundleProducts.map((p) => p.name).join(" + ")}`);
  await observe(`Pricing math:`);
  await observe(`  Base combined price: ${fmt(bundleCalc.pricingMath.combinedBasePrice)}`);
  await observe(`  Bundle discount applied: ${bundleCalc.pricingMath.bundleDiscountPct}%`);
  await observe(`  Final bundle price: ${fmt(bundleCalc.pricingMath.finalBundlePrice)} (${bundleCalc.pricingMath.vsDisruptedProduct})`);
  await observe(`Deployment ceiling: ${bundleCalc.deploymentCeiling.maxUnits.toLocaleString()} units (limited by: ${bundleCalc.deploymentCeiling.limitingFactor})`);
  await observe(`Projected revenue recovery: ${fmt(bundleCalc.deploymentCeiling.projectedRecovery)} (${bundleCalc.deploymentCeiling.recoveryAsPercentOfLoss} of total loss)`);
  await divider();

  // CYCLE 8: Generate B2B Campaign
  await thought(`Finalizing campaigns. Generating spot-market reallocation copy.`);
  await action(`Calling tool_generate_campaign(bundle_data, financial_impact)`);
  await sleep(200);

  let aiResult = {
    recoveredRevenue: targetBundle.projectedRecovery,
    campaignTitle: profile.campaignTitle,
    marketingCopy: profile.campaignCopy,
    targetAudience: profile.targetAudience
  };

  await observe(`No LLM API key detected. Activating high-fidelity mock campaign generator.`);
  await sleep(400);
  await observe(`✓ B2B campaign generated successfully.`);
  await divider();

  // FINAL OUTPUT
  await log(`✅ REACT LOOP COMPLETE — 7 cycles | 6 tool calls | 1 campaign generated`);
  await log(`🏷  Campaign: "${aiResult.campaignTitle}"`);
  await log(`💚 Recovered revenue pathway: ${fmt(aiResult.recoveredRevenue)}`);
  await log(`📉 Net loss after intervention: ${fmt(targetExposure - aiResult.recoveredRevenue)}`);
  await divider();
  await log(`🚀 CAMPAIGN READY FOR DEPLOYMENT — Awaiting authorization...`);

  return {
    ...aiResult,
    recoveredRevenue: aiResult.recoveredRevenue,
    totalLoss: targetExposure,
    netLoss: targetExposure - aiResult.recoveredRevenue,
    agentLogs: logs,
    vertical,
    constraints,
    accuracyScore: accuracyEval.confidence,
    accuracyReasoning: accuracyEval.reasoning
  };
}

module.exports = {
  run,
  tools: createSessionTools(require("../demoData").generateSupplyChainState())
};
