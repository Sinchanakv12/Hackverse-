/**
 * CHAOS ARCHITECT — Supply Chain Demo Data
 *
 * Business Logic:
 * - Product A (UltraBook Pro 15") is stranded in the flooded Bengaluru node.
 * - Products B & C are utility-equivalent substitutes: both serve the B2B
 *   enterprise compute need that Product A would have fulfilled.
 * - The AI bundles B + C at a slight discount, preserving (and arguably
 *   enhancing) the value proposition for affected clients.
 */

const supplyChainData = {
  nodes: [
    {
      id: "bengaluru",
      name: "Bengaluru Distribution Center",
      location: { lat: 12.9716, lng: 77.5946 },
      region: "South India",
      status: "online", // will be set to "offline" on chaos injection
      products: ["product-a"],
      throughput: "12,400 units/day",
      lastHeartbeat: "2026-06-02T06:00:00Z",
      vulnerabilityScore: 0.87, // high flood/infrastructure risk
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
  ],

  inventory: {
    "product-a": {
      id: "product-a",
      name: "UltraBook Pro 15\" (Enterprise Edition)",
      category: "Enterprise Laptop",
      sku: "UBP15-ENT-2026",
      unitPrice: 1800,
      stock: 5000,
      nodeId: "bengaluru",
      status: "disrupted", // entirely at the flooded node
      demand: "HIGH",
      margin: 0.22,
      description:
        "Flagship enterprise workstation laptop. Intel Core i9, 32GB RAM, 1TB NVMe. Preferred by Fortune 500 procurement teams.",
    },
    "product-b": {
      id: "product-b",
      name: "Creator Pro 14\" (High-Margin Alternative)",
      category: "Professional Laptop",
      sku: "CPR14-PRO-2026",
      unitPrice: 1550,
      stock: 3200,
      nodeId: "mumbai",
      status: "overstocked",
      demand: "MEDIUM",
      margin: 0.31, // higher margin than Product A
      description:
        "Ultra-portable professional workstation. AMD Ryzen 9, 32GB RAM, 1TB NVMe. Comparable compute power, superior portability. Overstocked in Mumbai.",
    },
    "product-c": {
      id: "product-c",
      name: "CloudDesk Pro — 1-Year License",
      category: "Cloud Workstation License",
      sku: "CDP-1YR-2026",
      unitPrice: 420,
      stock: Infinity,
      nodeId: "digital-delivery",
      status: "available",
      demand: "LOW",
      margin: 0.78, // digital product, near-zero COGS
      description:
        "Full-featured cloud workstation environment. 32 vCPUs, 128GB RAM, GPU acceleration. Zero logistics dependency. Delivered instantly via email.",
    },
  },

  crisisScenarios: {
    "bengaluru-flood": {
      id: "bengaluru-flood",
      title: "Bengaluru Monsoon Flood — Category 4",
      affectedNodeId: "bengaluru",
      affectedProducts: ["product-a"],
      projectedRevenueLoss: 9000000, // 5,000 units × $1,800
      description:
        "Catastrophic monsoon flooding has rendered the Bengaluru Distribution Center inaccessible. 5,000 units of UltraBook Pro 15\" are stranded and undeliverable for an estimated 14–21 days.",
      severity: "CRITICAL",
      estimatedDowntimeHours: 336,
      sensorReadings: {
        rainfallMmPerHour: 87.4,
        floodWaterLevelCm: 142,
        structuralIntegrity: "COMPROMISED",
        powerStatus: "OFFLINE",
      },
    },
  },

  // The mathematically optimal bundle computed by the agent
  optimalBundle: {
    products: ["product-b", "product-c"],
    bundleDiscount: 0.08, // 8% bundle discount
    bundlePricePerUnit: (1550 + 420) * 0.92, // $1,812.40
    maxUnitsDeployable: 3200, // limited by Product B stock
    projectedRecovery: Math.round(3200 * (1550 + 420) * 0.92), // ~$5,799,680
  },
};

module.exports = supplyChainData;
