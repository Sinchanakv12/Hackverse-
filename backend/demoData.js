/**
 * CHAOS ARCHITECT — Dynamic Supply Chain State Generator
 *
 * This module dynamically shapes the nodes, inventory, transit routes, and
 * crisis scenarios depending on the vertical selected and the selected scenario.
 */

"use strict";

const { scenarios } = require("./scenariosData");

const baseNodes = [
  {
    id: "bengaluru",
    name: "Bengaluru Distribution Center",
    location: { lat: 12.9716, lng: 77.5946 },
    region: "South India",
    status: "online",
    products: ["product-a"],
    throughput: "12,400 units/day",
    lastHeartbeat: "2026-06-02T06:00:00Z",
    vulnerabilityScore: 0.87,
    weather: {
      normal: { condition: "Clear", temp: "28°C", precipitation: "0%", wind: "12 km/h" },
      crisis: { condition: "Severe Monsoon", temp: "24°C", precipitation: "100%", wind: "85 km/h", alert: "RED ALERT: Flash Flooding" }
    },
  },
  {
    id: "mumbai",
    name: "Mumbai Logistics Hub",
    location: { lat: 19.076, lng: 72.8777 },
    region: "West India",
    status: "online",
    products: ["product-b"],
    throughput: "18,200 units/day",
    lastHeartbeat: "2026-06-02T06:58:00Z",
    vulnerabilityScore: 0.21,
    weather: {
      normal: { condition: "Partly Cloudy", temp: "31°C", precipitation: "10%", wind: "18 km/h" },
      crisis: { condition: "Partly Cloudy", temp: "31°C", precipitation: "10%", wind: "18 km/h" }
    },
  },
  {
    id: "digital-delivery",
    name: "Digital Delivery Network",
    location: { lat: 1.3521, lng: 103.8198 },
    region: "Global / Singapore",
    status: "online",
    products: ["product-c"],
    throughput: "Unlimited",
    lastHeartbeat: "2026-06-02T06:59:00Z",
    vulnerabilityScore: 0.02,
  },
  {
    id: "shenzhen",
    name: "Shenzhen Manufacturing Plant",
    location: { lat: 22.5431, lng: 114.0579 },
    region: "China",
    status: "online",
    products: [],
    throughput: "55,000 units/day",
    lastHeartbeat: "2026-06-02T06:55:00Z",
    vulnerabilityScore: 0.15,
  },
  {
    id: "singapore",
    name: "Singapore Regional HQ",
    location: { lat: 1.3521, lng: 103.8198 },
    region: "Southeast Asia",
    status: "online",
    products: [],
    throughput: "Coordination only",
    lastHeartbeat: "2026-06-02T06:59:00Z",
    vulnerabilityScore: 0.05,
  },
  {
    id: "delhi",
    name: "Delhi Air Cargo Hub",
    location: { lat: 28.6139, lng: 77.2090 },
    region: "North India",
    status: "online",
    products: [],
    throughput: "24,500 units/day",
    lastHeartbeat: "2026-06-02T06:57:00Z",
    vulnerabilityScore: 0.45,
    weather: {
      normal: { condition: "Sunny", temp: "25°C", precipitation: "0%", wind: "15 km/h" },
      crisis: { condition: "Severe Wind Shear", temp: "19°C", precipitation: "5%", wind: "145 km/h", alert: "BLACK ALERT: Jet Stream Turbulence" }
    }
  },
  {
    id: "chennai",
    name: "Chennai Maritime Port",
    location: { lat: 13.0827, lng: 80.2707 },
    region: "South India",
    status: "online",
    products: [],
    throughput: "31,000 units/day",
    lastHeartbeat: "2026-06-02T06:54:00Z",
    vulnerabilityScore: 0.65,
    weather: {
      normal: { condition: "Partly Cloudy", temp: "32°C", precipitation: "10%", wind: "20 km/h" },
      crisis: { condition: "Tropical Cyclone", temp: "23°C", precipitation: "100%", wind: "130 km/h", alert: "RED ALERT: Cyclone Landfall" }
    }
  },
  {
    id: "kolkata",
    name: "Kolkata Riverine Hub",
    location: { lat: 22.5726, lng: 88.3639 },
    region: "East India",
    status: "online",
    products: [],
    throughput: "14,800 units/day",
    lastHeartbeat: "2026-06-02T06:50:00Z",
    vulnerabilityScore: 0.38,
    weather: {
      normal: { condition: "Warm / Clear", temp: "31°C", precipitation: "10%", wind: "10 km/h" },
      crisis: { condition: "Monsoon Inundation", temp: "27°C", precipitation: "100%", wind: "35 km/h", alert: "RED ALERT: Delta Overflow" }
    }
  },
  {
    id: "pune",
    name: "Pune Manufacturing Facility",
    location: { lat: 18.5204, lng: 73.8567 },
    region: "West India",
    status: "online",
    products: [],
    throughput: "20,500 units/day",
    lastHeartbeat: "2026-06-02T06:51:00Z",
    vulnerabilityScore: 0.28,
    weather: {
      normal: { condition: "Clear", temp: "28°C", precipitation: "0%", wind: "10 km/h" },
      crisis: { condition: "Heavy Rain / Mudslide", temp: "22°C", precipitation: "100%", wind: "45 km/h", alert: "RED ALERT: Expressway Blocked" }
    }
  },
  {
    id: "hyderabad",
    name: "Hyderabad Bio-Pharma Hub",
    location: { lat: 17.3850, lng: 78.4867 },
    region: "South-Central India",
    status: "online",
    products: [],
    throughput: "16,000 units/day",
    lastHeartbeat: "2026-06-02T06:53:00Z",
    vulnerabilityScore: 0.32,
    weather: {
      normal: { condition: "Clear / Dry", temp: "30°C", precipitation: "0%", wind: "10 km/h" },
      crisis: { condition: "Extreme Heat", temp: "47°C", precipitation: "0%", wind: "8 km/h", alert: "RED ALERT: Heatwave Emergency" }
    }
  }
];

const baseTransitRoutes = [
  {
    id: 'route-blr-mum',
    source: 'bengaluru',
    target: 'mumbai',
    type: 'Ground Freight',
    normal: { trafficIndex: "Optimal", delay: "0 hrs", roadblocks: [] },
    crisis: { trafficIndex: "Severe Gridlock", delay: "+48 hrs", roadblocks: [{ type: "Flooded Highway", location: "NH48 Route Segment", coordinates: "12.9716, 77.5946" }] }
  },
  {
    id: 'route-del-mum',
    source: 'delhi',
    target: 'mumbai',
    type: 'Air Cargo',
    normal: { trafficIndex: "Optimal", delay: "0 hrs", roadblocks: [] },
    crisis: { trafficIndex: "Airspace Closed", delay: "+36 hrs", roadblocks: [{ type: "Severe Turbulence", location: "North Flight Corridor", coordinates: "28.6139, 77.2090" }] }
  },
  {
    id: 'route-chn-mum',
    source: 'chennai',
    target: 'mumbai',
    type: 'Ground Freight',
    normal: { trafficIndex: "Optimal", delay: "0 hrs", roadblocks: [] },
    crisis: { trafficIndex: "Severe Gridlock", delay: "+48 hrs", roadblocks: [{ type: "Storm Surge", location: "Coastal Expressway", coordinates: "13.0827, 80.2707" }] }
  },
  {
    id: 'route-kol-mum',
    source: 'kolkata',
    target: 'mumbai',
    type: 'Ground Freight',
    normal: { trafficIndex: "Optimal", delay: "0 hrs", roadblocks: [] },
    crisis: { trafficIndex: "Severe Gridlock", delay: "+60 hrs", roadblocks: [{ type: "Flooded Delta Link", location: "NH19 Route Segment", coordinates: "22.5726, 88.3639" }] }
  },
  {
    id: 'route-pun-mum',
    source: 'pune',
    target: 'mumbai',
    type: 'Ground Freight',
    normal: { trafficIndex: "Optimal", delay: "0 hrs", roadblocks: [] },
    crisis: { trafficIndex: "Severe Gridlock", delay: "+24 hrs", roadblocks: [{ type: "Mudslide", location: "Ghat Expressway", coordinates: "18.5204, 73.8567" }] }
  },
  {
    id: 'route-hyd-mum',
    source: 'hyderabad',
    target: 'mumbai',
    type: 'Ground Freight',
    normal: { trafficIndex: "Optimal", delay: "0 hrs", roadblocks: [] },
    crisis: { trafficIndex: "Gridlock / Heat", delay: "+36 hrs", roadblocks: [{ type: "Grid Failure Check", location: "Outer Ring Road", coordinates: "17.3850, 78.4867" }] }
  },
  {
    id: 'route-szn-sgp',
    source: 'shenzhen',
    target: 'singapore',
    type: 'Ocean Freight',
    normal: { trafficIndex: "Optimal", delay: "0 hrs", roadblocks: [] },
    crisis: { trafficIndex: "Typhoon Haze", delay: "+72 hrs", roadblocks: [{ type: "Typhoon Path", location: "South China Sea", coordinates: "1.3521, 103.8198" }] }
  },
  {
    id: 'route-sgp-mum',
    source: 'singapore',
    target: 'mumbai',
    type: 'Ocean Freight',
    normal: { trafficIndex: "Optimal", delay: "0 hrs", roadblocks: [] },
    crisis: { trafficIndex: "Ocean Gridlock", delay: "+48 hrs", roadblocks: [{ type: "Strait Congestion", location: "Malacca Strait", coordinates: "1.3521, 103.8198" }] }
  }
];

// Profile configuration mapping for all 6 hackathon verticals
const profiles = {
  food_ag: {
    verticalLabel: "Food & Agriculture",
    disrupted: {
      name: "Organic Produce Pallets",
      sku: "AVO-FRESH-2026",
      category: "Perishable Organic Produce",
      unitPrice: 1200,
      description: "Fresh organic produce pallets. Highly time-sensitive, requires continuous cold-chain compliance to avoid rapid decay."
    },
    subB: {
      name: "Flash-Frozen Avocado Purée",
      sku: "AVO-FROZEN-2026",
      category: "Flash-Frozen Cold Chain",
      unitPrice: 800,
      description: "Premium flash-frozen avocado purée. Retains 100% of flavor with 12-month frozen shelf life."
    },
    subC: {
      name: "Dehydrated Superfood Powder Packets",
      sku: "AVO-DEHYD-2026",
      category: "Shelf-Stable Produce Equivalents",
      unitPrice: 400,
      description: "Dehydrated organic produce powder. Shelf-stable, lightweight, and easy shipping with zero cold-chain dependency."
    },
    scenarioTitle: "Bengaluru Monsoon Flood — Category 4",
    scenarioDescription: "Catastrophic monsoon flooding has rendered the Bengaluru Distribution Center inaccessible. Cold storage power systems have failed, endangering 5,000 pallets of organic produce.",
    campaignTitle: "OPERATION FRESH FREEZE — Perishable Cold-Chain Preservation Protocol",
    campaignCopy: "Your Organic Produce Pallets shipment has been halted by severe flooding at our facility, risking total spoilage within the max shelf life window. We are immediately activating our Perishable Continuity Protocol: redirecting your allocation to our Mumbai Cold-Chain hub, substituting the fresh produce with our premium Flash-Frozen Purée and Dehydrated Superfood Powder. This delivers identical nutritional utility and removes transit shelf-life risks. You receive an 8% bundle discount to keep your logistics operational. Zero compromise.",
    targetAudience: "B2B grocery distributors, restaurant chain procurement officers, and food service directors with active produce orders."
  },
  healthcare_pharma: {
    verticalLabel: "Healthcare & Pharma",
    disrupted: {
      name: "mRNA Vaccine Batches",
      sku: "VAC-MRNA-2026",
      category: "Therapeutics & Vaccines",
      unitPrice: 25000,
      description: "Critical vaccine supplies. Highly temperature-sensitive, requiring deep freeze environments (cryogenic) to maintain product efficacy."
    },
    subB: {
      name: "Local Reserve Vaccine Stocks",
      sku: "VAC-RESERVE-2026",
      category: "Local reserve stocks",
      unitPrice: 22000,
      description: "Secure secondary reserve stocks located in regional hubs. Pre-vetted for emergency distribution."
    },
    subC: {
      name: "Alternative Therapeutic Regimens",
      sku: "THER-ALT-2026",
      category: "Alternative Therapeutics",
      unitPrice: 6000,
      description: "Clinically compatible oral antiviral/therapeutic treatments. Stable at standard temperatures, enabling rapid deployment."
    },
    scenarioTitle: "Bengaluru Healthcare Center Flooding",
    scenarioDescription: "Catastrophic flooding has cut primary and backup power to the medical deep-freeze cells at Bengaluru, endangering 5,000 vaccine batches.",
    campaignTitle: "OPERATION VAX SHIELD — Medical Logistics & Reserve Reallocation Protocol",
    campaignCopy: "Your mRNA Vaccine order has been disrupted at the active site. To preserve clinical supply continuity, we are immediately activating our Medical Reallocation Protocol: supplying Local Reserve Vaccine Stocks from our Mumbai Hub coupled with temperature-stable Alternative Therapeutic Regimens. This dual-access mitigation guarantees therapeutic coverage with zero cold-chain transport delay. As a priority health network partner, you receive an 8% emergency discount. Safe, secure, and fully compliant.",
    targetAudience: "Hospital procurement networks, regional health authorities, and clinical directors with active vaccine orders."
  },
  hazardous_chemicals: {
    verticalLabel: "Hazardous Chemicals",
    disrupted: {
      name: "Industrial Solvents (Class 3)",
      sku: "CHEM-SOLV-2026",
      category: "Hazardous Chemicals",
      unitPrice: 8000,
      description: "Class 3 flammable industrial solvents. Requires highly specialized hazmat isolation storage and restricted transit lanes."
    },
    subB: {
      name: "Alternative Chemical Suppliers (Local)",
      sku: "CHEM-ALT-2026",
      category: "Alternative Chemical Suppliers",
      unitPrice: 7500,
      description: "Locally stocked alternative solvents matching chemical purity requirements. Ready for local short-haul delivery."
    },
    subC: {
      name: "Local Neutralization Agents",
      sku: "CHEM-NEUT-2026",
      category: "Local Neutralization Agents",
      unitPrice: 1500,
      description: "Emergency neutralization and safety containment kits. Crucial for localized spill control and risk mitigation."
    },
    scenarioTitle: "Bengaluru Chemical Hub Incident",
    scenarioDescription: "Monsoon flooding has breached containment barriers at the Bengaluru Chemical Hub. 5,000 units of industrial solvents are stranded and pose leakage risks.",
    campaignTitle: "OPERATION HAZ-GUARD — Emergency Chemical Supply & Safety Protocol",
    campaignCopy: "Your Industrial Solvents shipment is stranded due to severe disruptions at our terminal. To prevent downstream shut-down and manage containment risks, we are activating the Hazmat Continuity Protocol: routing alternative local solvents from Mumbai paired with safety Neutralization Kits. This allows you to maintain manufacturing operations while mitigating environmental hazards. An 8% bundle discount is applied to cover emergency logistics costs. Fully vetted by chemical compliance safety officers.",
    targetAudience: "Industrial manufacturing safety managers, chemical plant directors, and B2B process engineers."
  },
  electronics: {
    verticalLabel: "Consumer Electronics",
    disrupted: {
      name: "Enterprise UltraBook Pro 15\"",
      sku: "UBP15-ENT-2026",
      category: "Enterprise Laptop",
      unitPrice: 1800,
      description: "Flagship enterprise workstation laptop. Preferred by corporate clients requiring robust physical compute environments."
    },
    subB: {
      name: "Creator Pro 14\" (High-Margin Alternative)",
      sku: "CPR14-PRO-2026",
      category: "Professional Laptop",
      unitPrice: 1550,
      description: "Professional high-performance laptop. Comparable computing specs in a portable 14\" form factor. Overstocked in Mumbai."
    },
    subC: {
      name: "CloudDesk Pro — 1-Year License",
      sku: "CDP-1YR-2026",
      category: "Cloud Workstation License",
      unitPrice: 420,
      description: "High-performance virtual workstation license. Zero physical logistics dependencies, delivered instantly."
    },
    scenarioTitle: "Bengaluru Monsoon Flood — Category 4",
    scenarioDescription: "Catastrophic monsoon flooding has rendered the Bengaluru Distribution Center inaccessible. 5,000 units of Enterprise UltraBook Pro 15\" are stranded.",
    campaignTitle: "OPERATION CLOUD PIVOT — Enterprise Business Continuity Bundle",
    campaignCopy: "Your UltraBook Pro 15\" order has been impacted by unprecedented disruptions at our facility. We are immediately activating our Business Continuity Protocol: offering you an exclusive enterprise bundle consisting of the Creator Pro 14\" paired with a 1-Year CloudDesk Pro License. This dual-access approach delivers physical compute power and instant cloud workstation redundancy. As a priority client, you receive an 8% bundle discount, locking in productivity with zero compromise.",
    targetAudience: "B2B procurement managers and IT directors at active corporate clients with zero-downtime mandates."
  },
  retail_ecommerce: {
    verticalLabel: "Retail & E-commerce",
    disrupted: {
      name: "High-Demand Retail Batches",
      sku: "RET-HIGH-2026",
      category: "Retail Merchandise",
      unitPrice: 500,
      description: "Premium retail consumer goods batches. Rapid turnarounds required to prevent shelf-empty losses."
    },
    subB: {
      name: "Priority Ground Freight Alternate",
      sku: "RET-GROUND-2026",
      category: "Alternative logistics routing",
      unitPrice: 450,
      description: "Secondary premium ground transit route from Mumbai, bypassing main flood-blocked expressways."
    },
    subC: {
      name: "Express Courier Delivery Upgrades",
      sku: "RET-COURIER-2026",
      category: "Express logistics upgrades",
      unitPrice: 120,
      description: "Last-mile courier upgrades. Re-routes delivery through local express distribution networks."
    },
    scenarioTitle: "Bengaluru E-commerce Logistics Disruption",
    scenarioDescription: "Monsoon flooding has blocked main roads surrounding the Bengaluru retail sorting facility, stranding 5,000 retail batches.",
    campaignTitle: "OPERATION RETAIL REACH — Express Courier & Logistics Re-routing Protocol",
    campaignCopy: "Your Retail Goods shipment has been delayed due to disruptions at the logistics gateway. We are immediately activating our Priority Re-routing Protocol: dispatching equivalent inventory from our Mumbai hub using Priority Ground Freight paired with Express last-mile courier delivery upgrades. This ensures your retail shelves remain stocked with minimal delays. An 8% service discount has been applied to offset transit adjustments. Keeping your commerce moving.",
    targetAudience: "Retail supply managers, e-commerce operations leads, and retail inventory control officers."
  },
  industrial_raw: {
    verticalLabel: "Industrial Raw Materials",
    disrupted: {
      name: "Industrial Steel Coils",
      sku: "IND-STEEL-2026",
      category: "Bulk Raw Materials",
      unitPrice: 5000,
      description: "Heavy structural steel coils. Requires specialized heavy lift handling, flatbed logistics, and high-load bridges."
    },
    subB: {
      name: "Alternative Structural Steel Suppliers",
      sku: "IND-ALT-2026",
      category: "Alternative Raw Material Suppliers",
      unitPrice: 4800,
      description: "Secondary steel supplier stockpiles located in West India, pre-cleared for load quality compliance."
    },
    subC: {
      name: "Alternative Heavy Lift Logistics",
      sku: "IND-LOG-2026",
      category: "Specialized logistics support",
      unitPrice: 1100,
      description: "Specialized heavy transport flatbed trailers and crane equipment. Facilitates direct delivery to fabrication yards."
    },
    scenarioTitle: "Bengaluru Heavy Steel Yard Flooding",
    scenarioDescription: "Extreme flooding has halted crane operations and stranded 5,000 industrial steel coils in the Bengaluru industrial storage yards.",
    campaignTitle: "OPERATION BULK IRON — Emergency Raw Materials Sourcing & Logistics Protocol",
    campaignCopy: "Your Industrial Steel Coils order is delayed due to weather-induced shutdowns at our yard. To avoid structural fabrication line shutdowns, we are activating our Industrial raw materials protocol: supplying alternative compliant structural steel coils from Mumbai along with pre-booked heavy lift logistics support. This provides direct supply chain bypass. You receive an 8% discount on this emergency bulk routing. Operations secured.",
    targetAudience: "Factory supply officers, procurement directors, and project managers of large construction sites."
  }
};

function generateSupplyChainState(config) {
  const cfg = config || {};
  
  // Normalize vertical keys in case of string mismatches
  let vertical = cfg.vertical || cfg.category || cfg.constraints?.category || cfg.constraints?.vertical || 'electronics';
  let verticalKey = vertical;
  if (verticalKey === "food" || verticalKey === "food_ag" || verticalKey === "Food & Ag") verticalKey = "food_ag";
  if (verticalKey === "healthcare" || verticalKey === "healthcare_pharma" || verticalKey === "Healthcare") verticalKey = "healthcare_pharma";
  if (verticalKey === "hazmat" || verticalKey === "hazardous_chemicals" || verticalKey === "Hazmat") verticalKey = "hazardous_chemicals";
  if (verticalKey === "electronics" || verticalKey === "Electronics") verticalKey = "electronics";
  if (verticalKey === "retail" || verticalKey === "retail_ecommerce" || verticalKey === "Retail & E-commerce") verticalKey = "retail_ecommerce";
  if (verticalKey === "industrial" || verticalKey === "industrial_raw" || verticalKey === "Industrial Raw Materials") verticalKey = "industrial_raw";

  // Fallback to electronics if profile doesn't exist
  const profile = profiles[verticalKey] || profiles.electronics;
  
  // Locate the active scenario configuration
  const selectedScenarioId = cfg.scenario || cfg.scenarioId || "bengaluru-flood";
  const activeScenarioMeta = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];
  const affectedNodeId = activeScenarioMeta.affectedNodeId;

  // If the affected node is mumbai, redirect the fallback hub elsewhere (e.g. delhi)
  const fallbackHubNodeId = affectedNodeId === "mumbai" ? "delhi" : "mumbai";

  const nodes = JSON.parse(JSON.stringify(baseNodes));
  const transitRoutes = JSON.parse(JSON.stringify(baseTransitRoutes));

  // Update nodes and routes to reflect the active scenario
  nodes.forEach(node => {
    if (node.id === affectedNodeId) {
      node.status = "offline";
      // Merge weather parameters from the active scenario
      if (activeScenarioMeta.weather) {
        if (!node.weather) node.weather = { normal: {}, crisis: {} };
        node.weather.crisis = {
          ...node.weather.normal,
          ...activeScenarioMeta.weather
        };
      }
    }
  });

  // Build a unified constraints object that extracts from both cfg and cfg.constraints
  const constraints = {
    category: cfg.category || cfg.constraints?.category || (verticalKey === 'food_ag' ? 'Food & Ag' : (verticalKey === 'healthcare_pharma' ? 'Healthcare' : (verticalKey === 'hazardous_chemicals' ? 'Hazmat' : 'Electronics'))),
    subCategory: cfg.subCategory || cfg.constraints?.subCategory || "",
    payloadTons: cfg.payloadTons !== undefined ? cfg.payloadTons : (cfg.constraints?.payloadTons !== undefined ? cfg.constraints.payloadTons : 50),
    vehicleType: cfg.vehicleType || cfg.vehicle || cfg.constraints?.vehicleType || cfg.constraints?.vehicle || "Dry Van (Standard)",
    telemetryActive: cfg.telemetryActive !== undefined ? cfg.telemetryActive : (cfg.telemetry !== undefined ? cfg.telemetry : (cfg.constraints?.telemetryActive !== undefined ? cfg.constraints.telemetryActive : (cfg.constraints?.telemetry !== undefined ? cfg.constraints.telemetry : true))),
    scenario: selectedScenarioId,
    
    // backwards compatibility fields if any
    maxShelfLife: cfg.maxShelfLife || cfg.constraints?.maxShelfLife || (verticalKey === 'food_ag' ? 48 : null),
    requiresColdStorage: cfg.requiresColdStorage || cfg.constraints?.requiresColdStorage || (cfg.vehicleType === 'Reefer (Refrigerated)' || cfg.vehicle === 'Reefer (Refrigerated)' || cfg.constraints?.vehicleType === 'Reefer (Refrigerated)' || verticalKey === 'food_ag')
  };

  const cargoValue = disruptedProductPrice(verticalKey, constraints);
  
  const inventory = {
    "product-a": {
      ...(constraints || {}),
      id: "product-a",
      name: profile.disrupted.name,
      category: profile.disrupted.category,
      sku: profile.disrupted.sku,
      unitPrice: cargoValue,
      stock: 5000,
      nodeId: affectedNodeId, // Dynmically placed at the affected node!
      status: "disrupted",
      demand: "HIGH",
      margin: 0.22,
      description: profile.disrupted.description,
      constraints: constraints
    },
    "product-b": {
      id: "product-b",
      name: profile.subB.name,
      category: profile.subB.category,
      sku: profile.subB.sku,
      unitPrice: profile.subB.unitPrice,
      stock: 3200,
      nodeId: fallbackHubNodeId, // Dynamically placed at Mumbai or fallback hub!
      status: "overstocked",
      demand: "MEDIUM",
      margin: 0.31,
      description: profile.subB.description,
    },
    "product-c": {
      id: "product-c",
      name: profile.subC.name,
      category: profile.subC.category,
      sku: profile.subC.sku,
      unitPrice: profile.subC.unitPrice,
      stock: Infinity,
      nodeId: "digital-delivery",
      status: "available",
      demand: "LOW",
      margin: 0.78,
      description: profile.subC.description,
    }
  };

  // Add the affected products to whichever node contains it
  nodes.forEach(n => {
    if (n.id === affectedNodeId) {
      n.products = ["product-a"];
    } else if (n.id === fallbackHubNodeId) {
      n.products = ["product-b"];
    } else if (n.id === "digital-delivery") {
      n.products = ["product-c"];
    } else {
      n.products = [];
    }
  });

  const cargoUnitLabel = verticalKey === 'food_ag' ? 'pallets' : verticalKey === 'healthcare_pharma' ? 'batches' : 'units';
  const customScenarioDescription = activeScenarioMeta.descriptionTemplate
    .replace("{cargoName}", profile.disrupted.name)
    .replace("{cargoUnit}", cargoUnitLabel);

  const crisisScenarios = {
    [selectedScenarioId]: {
      id: selectedScenarioId,
      title: activeScenarioMeta.title,
      affectedNodeId: affectedNodeId,
      affectedProducts: ["product-a"],
      projectedRevenueLoss: 5000 * cargoValue,
      description: customScenarioDescription,
      severity: activeScenarioMeta.severity,
      estimatedDowntimeHours: activeScenarioMeta.estimatedDowntimeHours,
      sensorReadings: activeScenarioMeta.sensorReadings,
    }
  };

  const basePrice = profile.subB.unitPrice + profile.subC.unitPrice;
  const discountedPrice = basePrice * 0.92;

  const optimalBundle = {
    products: ["product-b", "product-c"],
    bundleDiscount: 0.08,
    bundlePricePerUnit: Math.round(discountedPrice * 100) / 100,
    maxUnitsDeployable: 3200,
    projectedRecovery: Math.round(3200 * discountedPrice),
  };

  return {
    nodes,
    transitRoutes,
    inventory,
    crisisScenarios,
    optimalBundle,
    profile, // Helper metadata
    config: cfg
  };
}

function disruptedProductPrice(vertical, constraints) {
  if (vertical === "healthcare_pharma") return 25000;
  if (vertical === "hazardous_chemicals") return 8000;
  if (vertical === "food_ag") return 1200;
  if (vertical === "retail_ecommerce") return 500;
  if (vertical === "industrial_raw") return 5000;
  
  // Electronics cargo value logic
  if (constraints && constraints.primaryCargoValue) {
    return parseFloat(constraints.primaryCargoValue) || 1800;
  }
  return 1800;
}

// Wrapper for backwards compatibility
function getElectronicsData(primaryCargoValue) {
  return generateSupplyChainState({
    vertical: "electronics",
    constraints: { primaryCargoValue }
  });
}

// Wrapper for backwards compatibility
function getPerishablesData(shelfLife, requiresColdStorage) {
  return generateSupplyChainState({
    vertical: "food_ag",
    constraints: { maxShelfLife: shelfLife, requiresColdChain: requiresColdStorage }
  });
}

const defaultState = generateSupplyChainState();

module.exports = {
  generateSupplyChainState,
  getElectronicsData,
  getPerishablesData,
  ...defaultState
};
