export const scenarios = [
  // ── Category: Air Transport (9 Scenarios) ──
  {
    id: "delhi-jet-stream",
    title: "Delhi Jet Stream Turbulence Anomaly",
    category: "Air Transport",
    affectedNodeId: "delhi",
    severity: "HIGH",
    estimatedDowntimeHours: 48,
    weather: {
      condition: "Severe Wind Shear",
      temp: "19°C",
      precipitation: "5%",
      wind: "145 km/h",
      alert: "BLACK ALERT: Jet Stream Turbulences"
    },
    description: "A severe high-altitude jet stream deviation near Delhi Air Cargo Hub has triggered extreme turbulence and wind shear, grounding all cargo aircraft."
  },
  {
    id: "chennai-atc-failure",
    title: "Chennai ATC Radar & System Outage",
    category: "Air Transport",
    affectedNodeId: "chennai",
    severity: "CRITICAL",
    estimatedDowntimeHours: 36,
    weather: {
      condition: "Overcast / Heavy Rain",
      temp: "27°C",
      precipitation: "95%",
      wind: "40 km/h",
      alert: "RED ALERT: Airspace Closed"
    },
    description: "A catastrophic UPS backup battery failure at the Chennai Air Traffic Control Center has knocked out secondary radar and transponder tracking systems, grounding cargo flights."
  },
  {
    id: "mumbai-monsoon-turbulence",
    title: "Mumbai Microburst & Air Currents Disruption",
    category: "Air Transport",
    affectedNodeId: "mumbai",
    severity: "HIGH",
    estimatedDowntimeHours: 24,
    weather: {
      condition: "Severe Microburst / Thunderstorm",
      temp: "26°C",
      precipitation: "100%",
      wind: "110 km/h",
      alert: "RED ALERT: Microburst Wind Shear"
    },
    description: "Severe meteorological air current anomalies and microbursts at Mumbai Logistics Airport have forced air carriers to suspend landing operations."
  },
  {
    id: "shenzhen-typhoon-grounding",
    title: "Shenzhen Cross-Wind Typhoon Grounding",
    category: "Air Transport",
    affectedNodeId: "shenzhen",
    severity: "CRITICAL",
    estimatedDowntimeHours: 72,
    weather: {
      condition: "Super Typhoon",
      temp: "25°C",
      precipitation: "100%",
      wind: "165 km/h",
      alert: "BLACK ALERT: Super Typhoon Warnings"
    },
    description: "Super Typhoon wind gusts exceeding safety limits for cargo loadouts have forced full grounding at Shenzhen."
  },
  {
    id: "singapore-atc-congestion",
    title: "Singapore Ash Cloud Airspace Gridlock",
    category: "Air Transport",
    affectedNodeId: "singapore",
    severity: "HIGH",
    estimatedDowntimeHours: 96,
    weather: {
      condition: "Volcanic Ash Haze",
      temp: "29°C",
      precipitation: "0%",
      wind: "22 km/h",
      alert: "AMBER ALERT: Volcanic Ash in Airspace"
    },
    description: "A volcanic eruption in the Indonesian archipelago has sent high-altitude ash clouds drifting into Singapore's flight corridors, halting flights."
  },
  {
    id: "delhi-fog-smog",
    title: "Delhi Winter Smog Zero-Visibility Event",
    category: "Air Transport",
    affectedNodeId: "delhi",
    severity: "MEDIUM",
    estimatedDowntimeHours: 36,
    weather: {
      condition: "Dense Toxic Smog",
      temp: "11°C",
      precipitation: "0%",
      wind: "4 km/h",
      alert: "AMBER ALERT: Category-III ILS Active"
    },
    description: "A severe winter inversion fog layer combined with agricultural smog has dropped runway visibility at Delhi Cargo Hub to under 50 meters, suspending flights."
  },
  {
    id: "kolkata-cargo-depressurization",
    title: "Kolkata High-Altitude Depressurization Recall",
    category: "Air Transport",
    affectedNodeId: "kolkata",
    severity: "MEDIUM",
    estimatedDowntimeHours: 48,
    weather: {
      condition: "Clear Sky",
      temp: "30°C",
      precipitation: "0%",
      wind: "12 km/h",
      alert: "NOMINAL: Ground Conditions"
    },
    description: "A cargo hold seal depressurization event mid-flight has forced an emergency return of our regional freighter to Kolkata for damage inspections."
  },
  {
    id: "mumbai-jetfuel-contamination",
    title: "Mumbai Aviation Fuel Biocide Disruption",
    category: "Air Transport",
    affectedNodeId: "mumbai",
    severity: "HIGH",
    estimatedDowntimeHours: 60,
    weather: {
      condition: "Light Showers",
      temp: "29°C",
      precipitation: "40%",
      wind: "15 km/h",
      alert: "AMBER ALERT: Aviation Fuel Contamination"
    },
    description: "A major water leak into the underground aviation fuel tanks at Mumbai Logistics Hub has caused fuel contamination, halting all refueling."
  },
  {
    id: "hyderabad-drone-infringement",
    title: "Hyderabad Airspace Drone Intrusion Incident",
    category: "Air Transport",
    affectedNodeId: "hyderabad",
    severity: "MEDIUM",
    estimatedDowntimeHours: 12,
    weather: {
      condition: "Clear / Windy",
      temp: "34°C",
      precipitation: "0%",
      wind: "28 km/h",
      alert: "AMBER ALERT: Unauthorized UAS Active"
    },
    description: "Unauthorized drone flights within the Hyderabad airport security zone have triggered an airspace lockdown, holding all cargo flights."
  },

  // ── Category: Natural Disasters (9 Scenarios) ──
  {
    id: "bengaluru-flood",
    title: "Bengaluru Monsoon Flood — Category 4",
    category: "Natural Disasters",
    affectedNodeId: "bengaluru",
    severity: "CRITICAL",
    estimatedDowntimeHours: 336,
    weather: {
      condition: "Severe Monsoon",
      temp: "24°C",
      precipitation: "100%",
      wind: "85 km/h",
      alert: "RED ALERT: Flash Flooding"
    },
    description: "Catastrophic monsoon flooding has rendered the Bengaluru Distribution Center inaccessible. Cold storage power systems have failed."
  },
  {
    id: "chennai-cyclone",
    title: "Chennai Tropical Cyclone (Category 3)",
    category: "Natural Disasters",
    affectedNodeId: "chennai",
    severity: "CRITICAL",
    estimatedDowntimeHours: 168,
    weather: {
      condition: "Tropical Cyclone",
      temp: "23°C",
      precipitation: "100%",
      wind: "130 km/h",
      alert: "RED ALERT: Cyclone Landfall"
    },
    description: "A Category 3 tropical cyclone has made landfall at Chennai, triggering a severe storm surge and flooding all coastal transport corridors."
  },
  {
    id: "pune-landslide",
    title: "Pune Expressway Landslide Blockade",
    category: "Natural Disasters",
    affectedNodeId: "pune",
    severity: "HIGH",
    estimatedDowntimeHours: 96,
    weather: {
      condition: "Heavy Rain / Mudslide",
      temp: "22°C",
      precipitation: "100%",
      wind: "45 km/h",
      alert: "RED ALERT: Expressway Blocked"
    },
    description: "Monsoon rains triggered a major mudslide on the Pune-Mumbai Expressway, blockading the primary ground corridor."
  },
  {
    id: "mumbai-sea-surge",
    title: "Mumbai Coastal Storm Surge Flooding",
    category: "Natural Disasters",
    affectedNodeId: "mumbai",
    severity: "HIGH",
    estimatedDowntimeHours: 72,
    weather: {
      condition: "Storm Surge / Tidal Wave",
      temp: "28°C",
      precipitation: "95%",
      wind: "75 km/h",
      alert: "RED ALERT: Harbor Surge Flooding"
    },
    description: "A combination of high tide and cyclone-driven storm surge has flooded low-lying warehouse complexes at the Mumbai Logistics Hub."
  },
  {
    id: "delhi-cold-wave",
    title: "Delhi Extreme Cold Wave & Frozen Pipes",
    category: "Natural Disasters",
    affectedNodeId: "delhi",
    severity: "MEDIUM",
    estimatedDowntimeHours: 48,
    weather: {
      condition: "Severe Cold / Frost",
      temp: "2°C",
      precipitation: "0%",
      wind: "10 km/h",
      alert: "AMBER ALERT: Frost & Ice Hazard"
    },
    description: "An unprecedented cold wave in North India has frozen fire mains and water pipes at the Delhi Air Cargo Hub, triggering safety lockdowns."
  },
  {
    id: "kolkata-ganges-flood",
    title: "Kolkata Ganges Delta Riverine Overflow",
    category: "Natural Disasters",
    affectedNodeId: "kolkata",
    severity: "HIGH",
    estimatedDowntimeHours: 120,
    weather: {
      condition: "Monsoon Inundation",
      temp: "27°C",
      precipitation: "100%",
      wind: "35 km/h",
      alert: "RED ALERT: River Delta Overflow"
    },
    description: "Upstream discharges combined with local monsoons have caused the Ganges delta to overflow, submerging Kolkata barge terminals."
  },
  {
    id: "hyderabad-heatwave",
    title: "Hyderabad Extreme Heatwave Power Outage",
    category: "Natural Disasters",
    affectedNodeId: "hyderabad",
    severity: "HIGH",
    estimatedDowntimeHours: 72,
    weather: {
      condition: "Extreme Heat / Sun",
      temp: "47°C",
      precipitation: "0%",
      wind: "8 km/h",
      alert: "RED ALERT: Heatwave Emergency"
    },
    description: "A severe heatwave with temperatures reaching 47°C has overloaded and tripped the power grid in Hyderabad, endangering cold storage."
  },
  {
    id: "shenzhen-earthquake",
    title: "Shenzhen Seismic Disruption",
    category: "Natural Disasters",
    affectedNodeId: "shenzhen",
    severity: "HIGH",
    estimatedDowntimeHours: 96,
    weather: {
      condition: "Clear",
      temp: "24°C",
      precipitation: "0%",
      wind: "12 km/h",
      alert: "AMBER ALERT: Aftershock Warnings"
    },
    description: "A moderate seismic shock has triggered automatic shutoffs of electrical grids and gas pipelines at the Shenzhen Manufacturing Plant."
  },
  {
    id: "singapore-haze",
    title: "Singapore Regional Transboundary Haze",
    category: "Natural Disasters",
    affectedNodeId: "singapore",
    severity: "MEDIUM",
    estimatedDowntimeHours: 48,
    weather: {
      condition: "Toxic Haze / Fog",
      temp: "31°C",
      precipitation: "0%",
      wind: "6 km/h",
      alert: "AMBER ALERT: Pollutant Index HAZARDOUS"
    },
    description: "Severe transboundary agricultural smoke has pushed the Singapore Pollutant Index to hazardous levels, limiting warehouse shifts."
  },

  // ── Category: Cyber & Technical (9 Scenarios) ──
  {
    id: "bengaluru-ransomware",
    title: "Bengaluru AD Ransomware Attack",
    category: "Cyber/Technical",
    affectedNodeId: "bengaluru",
    severity: "CRITICAL",
    estimatedDowntimeHours: 168,
    weather: {
      condition: "Normal / Rain",
      temp: "25°C",
      precipitation: "30%",
      wind: "10 km/h",
      alert: "NOMINAL"
    },
    description: "A major ransomware attack has encrypted the Active Directory domain controllers at the Bengaluru DC, shutting down sorting and barcode scanners."
  },
  {
    id: "mumbai-cloud-outage",
    title: "Mumbai AWS/Azure Region Outage",
    category: "Cyber/Technical",
    affectedNodeId: "mumbai",
    severity: "HIGH",
    estimatedDowntimeHours: 24,
    weather: {
      condition: "Cloudy",
      temp: "30°C",
      precipitation: "10%",
      wind: "12 km/h",
      alert: "NOMINAL"
    },
    description: "An undersea fiber-optic cable cut has knocked out primary cloud data centers in the Mumbai region, disabling real-time ERP dispatching."
  },
  {
    id: "delhi-gps-jamming",
    title: "Delhi Freight Corridor GPS Jamming",
    category: "Cyber/Technical",
    affectedNodeId: "delhi",
    severity: "HIGH",
    estimatedDowntimeHours: 48,
    weather: {
      condition: "Sunny / Clear",
      temp: "25°C",
      precipitation: "0%",
      wind: "15 km/h",
      alert: "AMBER ALERT: GPS Signal Loss"
    },
    description: "A military airbase exercise or malicious jamming signal has blinded GPS receivers along the Delhi logistics corridor."
  },
  {
    id: "chennai-dns-hijacking",
    title: "Chennai Port Manifest DNS Hijacking",
    category: "Cyber/Technical",
    affectedNodeId: "chennai",
    severity: "HIGH",
    estimatedDowntimeHours: 48,
    weather: {
      condition: "Partly Cloudy",
      temp: "32°C",
      precipitation: "10%",
      wind: "20 km/h",
      alert: "NOMINAL"
    },
    description: "A sophisticated DNS cache poisoning attack has redirected the Chennai seaport manifest database portal, suspending customs clearance."
  },
  {
    id: "kolkata-database-corruption",
    title: "Kolkata ERP Database Corruption",
    category: "Cyber/Technical",
    affectedNodeId: "kolkata",
    severity: "MEDIUM",
    estimatedDowntimeHours: 36,
    weather: {
      condition: "Warm / Humidity",
      temp: "33°C",
      precipitation: "15%",
      wind: "8 km/h",
      alert: "NOMINAL"
    },
    description: "A RAID controller memory buffer failure has corrupted the inventory transaction logs at Kolkata, disabling locations auditing."
  },
  {
    id: "pune-smartlock-tampering",
    title: "Pune Smart Lock Vault Lockout",
    category: "Cyber/Technical",
    affectedNodeId: "pune",
    severity: "HIGH",
    estimatedDowntimeHours: 72,
    weather: {
      condition: "Light Rain",
      temp: "24°C",
      precipitation: "40%",
      wind: "12 km/h",
      alert: "NOMINAL"
    },
    description: "An expired digital certificate or malicious firmware push has locked all IoT security vaults at the Pune yard, disabling physical overrides."
  },
  {
    id: "hyderabad-telemetry-spoofing",
    title: "Hyderabad Bio-Pharma Telemetry Spoofing",
    category: "Cyber/Technical",
    affectedNodeId: "hyderabad",
    severity: "HIGH",
    estimatedDowntimeHours: 60,
    weather: {
      condition: "Humid",
      temp: "35°C",
      precipitation: "20%",
      wind: "10 km/h",
      alert: "NOMINAL"
    },
    description: "Security software detected anomalous data packets spoofing cold-chain temperature telemetry at Hyderabad, forcing quarantines."
  },
  {
    id: "singapore-api-gateway",
    title: "Singapore API Gateway DDoS Attack",
    category: "Cyber/Technical",
    affectedNodeId: "singapore",
    severity: "MEDIUM",
    estimatedDowntimeHours: 24,
    weather: {
      condition: "Hot",
      temp: "32°C",
      precipitation: "10%",
      wind: "8 km/h",
      alert: "NOMINAL"
    },
    description: "A massive distributed denial-of-service (DDoS) attack has flooded Singapore's API gateways, stalling real-time routing engines."
  },
  {
    id: "shenzhen-scada-failure",
    title: "Shenzhen Automated PLC Controller Crash",
    category: "Cyber/Technical",
    affectedNodeId: "shenzhen",
    severity: "HIGH",
    estimatedDowntimeHours: 48,
    weather: {
      condition: "Clear",
      temp: "27°C",
      precipitation: "0%",
      wind: "14 km/h",
      alert: "NOMINAL"
    },
    description: "A firmware exception has crashed the primary programmable logic controllers (PLCs) on Shenzhen's sorting line, halting conveyor belts."
  },

  // ── Category: Labor & Geopolitical (8 Scenarios) ──
  {
    id: "mumbai-port-strike",
    title: "Mumbai Port Crane Operators Strike",
    category: "Geopolitical/Labor",
    affectedNodeId: "mumbai",
    severity: "CRITICAL",
    estimatedDowntimeHours: 168,
    weather: {
      condition: "Rainy",
      temp: "28°C",
      precipitation: "80%",
      wind: "30 km/h",
      alert: "AMBER ALERT: Crane Ops Suspended"
    },
    description: "Crane operators at the Mumbai Port have staged a wildcat labor strike, bringing ocean freight loading to a complete standstill."
  },
  {
    id: "chennai-customs-blockade",
    title: "Chennai Sea Customs Audit Lockout",
    category: "Geopolitical/Labor",
    affectedNodeId: "chennai",
    severity: "HIGH",
    estimatedDowntimeHours: 120,
    weather: {
      condition: "Sunny / Hot",
      temp: "33°C",
      precipitation: "0%",
      wind: "15 km/h",
      alert: "AMBER ALERT: Customs Auditing Active"
    },
    description: "A trade compliance dispute has triggered mandatory manual audits for cargo at Chennai Customs, creating severe gate bottlenecks."
  },
  {
    id: "delhi-border-dispute",
    title: "Delhi Border Trucker Protest Blockade",
    category: "Geopolitical/Labor",
    affectedNodeId: "delhi",
    severity: "HIGH",
    estimatedDowntimeHours: 96,
    weather: {
      condition: "Foggy",
      temp: "15°C",
      precipitation: "5%",
      wind: "8 km/h",
      alert: "RED ALERT: Highway Access Blocked"
    },
    description: "A regional transport union protest has blockaded the entry highways into the Delhi Capital Territory, barring heavy trucks."
  },
  {
    id: "kolkata-riverway-strike",
    title: "Kolkata Barge Pilot Strike",
    category: "Geopolitical/Labor",
    affectedNodeId: "kolkata",
    severity: "MEDIUM",
    estimatedDowntimeHours: 72,
    weather: {
      condition: "Humid / Overcast",
      temp: "29°C",
      precipitation: "60%",
      wind: "14 km/h",
      alert: "AMBER ALERT: River Navigation Closed"
    },
    description: "River barge pilots in Kolkata have gone on strike, bringing inland container transit along the riverway to a standstill."
  },
  {
    id: "pune-highway-protest",
    title: "Pune Expressway Toll Plaza Blockade",
    category: "Geopolitical/Labor",
    affectedNodeId: "pune",
    severity: "MEDIUM",
    estimatedDowntimeHours: 48,
    weather: {
      condition: "Clear",
      temp: "28°C",
      precipitation: "0%",
      wind: "10 km/h",
      alert: "AMBER ALERT: Toll Blockade"
    },
    description: "Agricultural protests have blockaded major toll gates on the Pune exit routes, disabling outbound trucking lanes."
  },
  {
    id: "singapore-airspace-closure",
    title: "Singapore Regional Airspace Lockout",
    category: "Geopolitical/Labor",
    affectedNodeId: "singapore",
    severity: "HIGH",
    estimatedDowntimeHours: 72,
    weather: {
      condition: "Clear",
      temp: "30°C",
      precipitation: "0%",
      wind: "12 km/h",
      alert: "RED ALERT: Airspace Closed"
    },
    description: "Sudden military air drills in neighboring airspaces have forced the closure of multiple flight paths out of Singapore."
  },
  {
    id: "shenzhen-export-embargo",
    title: "Shenzhen Raw Material Custom Embargo",
    category: "Geopolitical/Labor",
    affectedNodeId: "shenzhen",
    severity: "HIGH",
    estimatedDowntimeHours: 120,
    weather: {
      condition: "Humid",
      temp: "31°C",
      precipitation: "10%",
      wind: "10 km/h",
      alert: "AMBER ALERT: Export Restrictions Active"
    },
    description: "A trade dispute has triggered a custom hold on specific critical raw materials at the Shenzhen manufacturing hub."
  },
  {
    id: "bengaluru-dockworkers-walkout",
    title: "Bengaluru Cargo Yard Labor Dispute",
    category: "Geopolitical/Labor",
    affectedNodeId: "bengaluru",
    severity: "MEDIUM",
    estimatedDowntimeHours: 48,
    weather: {
      condition: "Cloudy / Warm",
      temp: "27°C",
      precipitation: "20%",
      wind: "15 km/h",
      alert: "AMBER ALERT: Yard Walkout"
    },
    description: "A local shift scheduling dispute has prompted a walkout by ground handlers at the Bengaluru Distribution Center."
  },

  // ── Category: Mechanical & Safety (8 Scenarios) ──
  {
    id: "mumbai-battery-explosion",
    title: "Mumbai Forklift Thermal Runaway Incident",
    category: "Mechanical/Safety",
    affectedNodeId: "mumbai",
    severity: "HIGH",
    estimatedDowntimeHours: 48,
    weather: {
      condition: "Sunny / Hot",
      temp: "34°C",
      precipitation: "0%",
      wind: "8 km/h",
      alert: "RED ALERT: Hazmat Lockdown Active"
    },
    description: "A lithium-ion forklift battery suffered a thermal runaway event, causing a fire and toxic gas plume at the Mumbai Hub."
  },
  {
    id: "chennai-refrigerant-leak",
    title: "Chennai Cold Chain Ammonia Gas Leak",
    category: "Mechanical/Safety",
    affectedNodeId: "chennai",
    severity: "CRITICAL",
    estimatedDowntimeHours: 72,
    weather: {
      condition: "Clear",
      temp: "29°C",
      precipitation: "0%",
      wind: "18 km/h",
      alert: "RED ALERT: Ammonia Leak - Evacuation"
    },
    description: "A pressure valve failure on a primary refrigerant chiller has caused a severe anhydrous ammonia leak at Chennai."
  },
  {
    id: "delhi-crane-collapse",
    title: "Delhi Yard Gantry Crane Structural Failure",
    category: "Mechanical/Safety",
    affectedNodeId: "delhi",
    severity: "HIGH",
    estimatedDowntimeHours: 96,
    weather: {
      condition: "Clear / Winds",
      temp: "22°C",
      precipitation: "0%",
      wind: "32 km/h",
      alert: "AMBER ALERT: Loading Gantry Failure"
    },
    description: "A steel cable snap on the primary container hoist has collapsed a 100-ton gantry crane onto Delhi's outgoing cargo docks."
  },
  {
    id: "kolkata-conveyor-fire",
    title: "Kolkata High-Speed Conveyor Belt Fire",
    category: "Mechanical/Safety",
    affectedNodeId: "kolkata",
    severity: "MEDIUM",
    estimatedDowntimeHours: 48,
    weather: {
      condition: "Warm",
      temp: "31°C",
      precipitation: "0%",
      wind: "11 km/h",
      alert: "NOMINAL"
    },
    description: "A bearing friction fire has burned through the main sorting loop conveyor belt at the Kolkata terminal."
  },
  {
    id: "pune-roof-collapse",
    title: "Pune Storage Yard Canopy Collapse",
    category: "Mechanical/Safety",
    affectedNodeId: "pune",
    severity: "HIGH",
    estimatedDowntimeHours: 96,
    weather: {
      condition: "Severe Torrential Rain",
      temp: "23°C",
      precipitation: "100%",
      wind: "40 km/h",
      alert: "RED ALERT: Structural Collapse"
    },
    description: "A sudden structural collapse of the warehouse loading canopy under water weight has blocked all truck dock loading gates at Pune."
  },
  {
    id: "hyderabad-sprinkler-activation",
    title: "Hyderabad Accidental Sprinkler Activation",
    category: "Mechanical/Safety",
    affectedNodeId: "hyderabad",
    severity: "MEDIUM",
    estimatedDowntimeHours: 24,
    weather: {
      condition: "Clear",
      temp: "30°C",
      precipitation: "0%",
      wind: "6 km/h",
      alert: "NOMINAL"
    },
    description: "A thermal sensor glitch activated the fire deluge system in Hyderabad's main vault, soaking stored goods."
  },
  {
    id: "bengaluru-power-grid",
    title: "Bengaluru Transformer Explosion Outage",
    category: "Mechanical/Safety",
    affectedNodeId: "bengaluru",
    severity: "HIGH",
    estimatedDowntimeHours: 72,
    weather: {
      condition: "Stormy",
      temp: "25°C",
      precipitation: "85%",
      wind: "45 km/h",
      alert: "AMBER ALERT: Primary Power Grid Failure"
    },
    description: "An explosion at the utility substation feeding the Bengaluru Distribution Center has cut primary grid power."
  },
  {
    id: "shenzhen-rack-collapse",
    title: "Shenzhen Stacker Crane Rack Failure",
    category: "Mechanical/Safety",
    affectedNodeId: "shenzhen",
    severity: "HIGH",
    estimatedDowntimeHours: 60,
    weather: {
      condition: "Clear",
      temp: "25°C",
      precipitation: "0%",
      wind: "10 km/h",
      alert: "NOMINAL"
    },
    description: "An overloaded storage rack failed in Shenzhen's high-bay automated warehouse, blocking stacker crane corridors."
  },

  // ── Category: Supply Chain Shock (8 Scenarios) ──
  {
    id: "pune-steel-scarcity",
    title: "Pune Upstream Supplier Bankruptcy Shutdown",
    category: "Supply Chain Shock",
    affectedNodeId: "pune",
    severity: "HIGH",
    estimatedDowntimeHours: 144,
    weather: {
      condition: "Normal",
      temp: "26°C",
      precipitation: "0%",
      wind: "10 km/h",
      alert: "NOMINAL"
    },
    description: "A primary packaging and parts supplier for our Pune facility has suddenly declared bankruptcy, halting assembly."
  },
  {
    id: "bengaluru-packaging-shortage",
    title: "Bengaluru Eco-Board Packaging Fire",
    category: "Supply Chain Shock",
    affectedNodeId: "bengaluru",
    severity: "MEDIUM",
    estimatedDowntimeHours: 72,
    weather: {
      condition: "Light Rain",
      temp: "24°C",
      precipitation: "30%",
      wind: "15 km/h",
      alert: "NOMINAL"
    },
    description: "A major fire at the packaging vendor's plant has cut the supply of compliance packaging sheets at Bengaluru."
  },
  {
    id: "mumbai-demand-surge",
    title: "Mumbai Viral Social Media Demand Surge",
    category: "Supply Chain Shock",
    affectedNodeId: "mumbai",
    severity: "MEDIUM",
    estimatedDowntimeHours: 36,
    weather: {
      condition: "Clear",
      temp: "30°C",
      precipitation: "0%",
      wind: "14 km/h",
      alert: "NOMINAL"
    },
    description: "A viral marketing event has triggered a 40x spike in e-commerce orders, exhausting the regional stock buffers."
  },
  {
    id: "hyderabad-pharma-recall",
    title: "Hyderabad Active Ingredient FDA Quarantine",
    category: "Supply Chain Shock",
    affectedNodeId: "hyderabad",
    severity: "CRITICAL",
    estimatedDowntimeHours: 168,
    weather: {
      condition: "Clear",
      temp: "33°C",
      precipitation: "0%",
      wind: "8 km/h",
      alert: "RED ALERT: FDA Quarantine Active"
    },
    description: "A quality deviation in the primary raw batch material has triggered an FDA regulatory quarantine at Hyderabad."
  },
  {
    id: "delhi-cargo-heist",
    title: "Delhi Freight Corridor Highway Hijacking",
    category: "Supply Chain Shock",
    affectedNodeId: "delhi",
    severity: "HIGH",
    estimatedDowntimeHours: 48,
    weather: {
      condition: "Overcast",
      temp: "21°C",
      precipitation: "10%",
      wind: "12 km/h",
      alert: "AMBER ALERT: Cargo Theft Investigation"
    },
    description: "Organized highway cargo thieves have hijacked several freight trucks, triggering intensive police investigations."
  },
  {
    id: "singapore-customs-redtape",
    title: "Singapore Trade Portal Paperwork Interruption",
    category: "Supply Chain Shock",
    affectedNodeId: "singapore",
    severity: "MEDIUM",
    estimatedDowntimeHours: 36,
    weather: {
      condition: "Clear",
      temp: "31°C",
      precipitation: "0%",
      wind: "10 km/h",
      alert: "NOMINAL"
    },
    description: "An invalid digital certificate mismatch on the cross-border customs portal has frozen automated clearances."
  },
  {
    id: "shenzhen-parts-shortage",
    title: "Shenzhen Chip Wafer Foundry Shortage",
    category: "Supply Chain Shock",
    affectedNodeId: "shenzhen",
    severity: "HIGH",
    estimatedDowntimeHours: 120,
    weather: {
      condition: "Clear",
      temp: "26°C",
      precipitation: "0%",
      wind: "12 km/h",
      alert: "NOMINAL"
    },
    description: "An upstream wafer foundry shortage has delayed microcontroller shipments, stalling assembly lines."
  },
  {
    id: "chennai-container-scarcity",
    title: "Chennai Empty Container Shipping Deficit",
    category: "Supply Chain Shock",
    affectedNodeId: "chennai",
    severity: "MEDIUM",
    estimatedDowntimeHours: 96,
    weather: {
      condition: "Clear",
      temp: "32°C",
      precipitation: "0%",
      wind: "20 km/h",
      alert: "AMBER ALERT: Container Deficit"
    },
    description: "A shipping lane imbalance has created an extreme shortage of empty container boxes at Chennai Port, halting shipments."
  },

  // ── Category: Pandemic / Biological (6 Scenarios) ──
  {
    id: "bengaluru-bio-quarantine",
    title: "Bengaluru Warehouse Bio-Contamination Quarantine",
    category: "Pandemic/Biological",
    affectedNodeId: "bengaluru",
    severity: "CRITICAL",
    estimatedDowntimeHours: 336,
    weather: { condition: "Humid / Rain", temp: "26°C", precipitation: "70%", wind: "15 km/h", alert: "RED ALERT: Facility Quarantine Active" },
    description: "A novel pathogen detection in food-contact surfaces has triggered a full WHO-protocol biological quarantine at the Bengaluru DC, with no staff access permitted."
  },
  {
    id: "mumbai-crew-illness",
    title: "Mumbai Port Mass Crew Illness Outbreak",
    category: "Pandemic/Biological",
    affectedNodeId: "mumbai",
    severity: "HIGH",
    estimatedDowntimeHours: 168,
    weather: { condition: "Hot / Humid", temp: "33°C", precipitation: "30%", wind: "18 km/h", alert: "AMBER ALERT: Containment Protocol Active" },
    description: "A gastrointestinal outbreak among 60% of dock crew has triggered emergency containment protocols at Mumbai Port, with shifts reduced to skeleton staff."
  },
  {
    id: "delhi-pest-infestation",
    title: "Delhi Cold Storage Rodent Infestation Recall",
    category: "Pandemic/Biological",
    affectedNodeId: "delhi",
    severity: "HIGH",
    estimatedDowntimeHours: 120,
    weather: { condition: "Dry / Warm", temp: "28°C", precipitation: "0%", wind: "10 km/h", alert: "AMBER ALERT: Recall Protocol Initiated" },
    description: "A rodent infestation discovered in two cold storage vaults at Delhi has triggered a FSSAI-mandated product recall and facility fumigation shutdown."
  },
  {
    id: "hyderabad-pharma-contamination",
    title: "Hyderabad API Drug Batch Contamination Alert",
    category: "Pandemic/Biological",
    affectedNodeId: "hyderabad",
    severity: "CRITICAL",
    estimatedDowntimeHours: 240,
    weather: { condition: "Clear", temp: "34°C", precipitation: "0%", wind: "8 km/h", alert: "RED ALERT: FDA Contamination Hold" },
    description: "A microbial contamination test failure on API batches has triggered an FDA-level hold across the Hyderabad pharmaceutical storage facility."
  },
  {
    id: "chennai-algae-bloom-port",
    title: "Chennai Port Toxic Algae Bloom Vessel Ban",
    category: "Pandemic/Biological",
    affectedNodeId: "chennai",
    severity: "MEDIUM",
    estimatedDowntimeHours: 72,
    weather: { condition: "Sunny / Hot", temp: "35°C", precipitation: "0%", wind: "6 km/h", alert: "AMBER ALERT: Port Access Restricted" },
    description: "A harmful algal bloom in Chennai harbor is producing hydrogen sulfide gas, prompting authorities to suspend vessel docking operations."
  },
  {
    id: "kolkata-mosquito-vector",
    title: "Kolkata Vector Disease Outbreak — Staff Shortage",
    category: "Pandemic/Biological",
    affectedNodeId: "kolkata",
    severity: "MEDIUM",
    estimatedDowntimeHours: 96,
    weather: { condition: "Monsoon / Standing Water", temp: "28°C", precipitation: "80%", wind: "12 km/h", alert: "AMBER ALERT: Health Emergency" },
    description: "A rapid-spreading vector disease outbreak has hospitalized 35% of Kolkata logistics staff, causing critical operational workforce shortages."
  },

  // ── Category: Climate / Environmental (6 Scenarios) ──
  {
    id: "pune-air-quality-lockdown",
    title: "Pune Industrial AQI Emergency Lockdown",
    category: "Climate/Environmental",
    affectedNodeId: "pune",
    severity: "HIGH",
    estimatedDowntimeHours: 96,
    weather: { condition: "Smog / Fog", temp: "22°C", precipitation: "0%", wind: "3 km/h", alert: "RED ALERT: AQI 500+ — Shutdown Order" },
    description: "The Pune district collector has issued an emergency order shutting industrial facilities after the Air Quality Index hit 500+ (Severe+). All loading bays sealed."
  },
  {
    id: "shenzhen-carbon-tax-shutdown",
    title: "Shenzhen Carbon Emissions Cap Enforcement Halt",
    category: "Climate/Environmental",
    affectedNodeId: "shenzhen",
    severity: "HIGH",
    estimatedDowntimeHours: 120,
    weather: { condition: "Hazy", temp: "29°C", precipitation: "5%", wind: "8 km/h", alert: "AMBER ALERT: Carbon Cap Enforcement" },
    description: "Shenzhen's municipal government has issued an immediate production halt after the manufacturing zone exceeded its annual CO₂ emissions cap."
  },
  {
    id: "singapore-sea-level-surge",
    title: "Singapore King Tide Sea Level Inundation",
    category: "Climate/Environmental",
    affectedNodeId: "singapore",
    severity: "HIGH",
    estimatedDowntimeHours: 48,
    weather: { condition: "High Tide / Overcast", temp: "30°C", precipitation: "40%", wind: "25 km/h", alert: "RED ALERT: Coastal Inundation" },
    description: "A combination of king tide and climate-driven sea level rise has inundated Singapore's low-lying port terminals under 40cm of seawater."
  },
  {
    id: "delhi-water-scarcity",
    title: "Delhi Groundwater Crisis — Cooling System Failure",
    category: "Climate/Environmental",
    affectedNodeId: "delhi",
    severity: "MEDIUM",
    estimatedDowntimeHours: 72,
    weather: { condition: "Dry / Extreme Heat", temp: "46°C", precipitation: "0%", wind: "5 km/h", alert: "AMBER ALERT: Groundwater Level Critical" },
    description: "Severe groundwater depletion under Delhi has dropped cooling water pressure below operational minimums, forcing cold-chain shutdowns."
  },
  {
    id: "bengaluru-flash-drought",
    title: "Bengaluru Flash Drought — Solar Panel Dust Surge",
    category: "Climate/Environmental",
    affectedNodeId: "bengaluru",
    severity: "MEDIUM",
    estimatedDowntimeHours: 48,
    weather: { condition: "Dust Storm / Dry", temp: "42°C", precipitation: "0%", wind: "55 km/h", alert: "AMBER ALERT: Dust Storm Warning" },
    description: "An unprecedented dust storm driven by flash drought conditions has coated solar arrays and HVAC intakes, cutting facility power generation by 65%."
  },
  {
    id: "kolkata-cyclone-induced-landslide",
    title: "Kolkata Cyclone-Induced Hillside Erosion",
    category: "Climate/Environmental",
    affectedNodeId: "kolkata",
    severity: "CRITICAL",
    estimatedDowntimeHours: 200,
    weather: { condition: "Post-Cyclone / Rain", temp: "25°C", precipitation: "100%", wind: "60 km/h", alert: "RED ALERT: Structural Ground Erosion" },
    description: "Post-cyclone saturated hillside soil has triggered progressive ground erosion under Kolkata's elevated cargo rail line, suspending rail transit."
  },

  // ── Category: Financial / Market Shock (6 Scenarios) ──
  {
    id: "mumbai-insurance-lapse",
    title: "Mumbai Cargo Insurance Lapse — Operations Hold",
    category: "Financial/Market",
    affectedNodeId: "mumbai",
    severity: "CRITICAL",
    estimatedDowntimeHours: 72,
    weather: { condition: "Normal", temp: "31°C", precipitation: "10%", wind: "12 km/h", alert: "AMBER ALERT: Compliance Hold" },
    description: "An administrative lapse in cargo liability insurance renewal has triggered a port authority compliance hold on all Mumbai outbound shipments."
  },
  {
    id: "delhi-currency-devaluation",
    title: "Delhi Import Cost Surge — Currency Flash Crash",
    category: "Financial/Market",
    affectedNodeId: "delhi",
    severity: "HIGH",
    estimatedDowntimeHours: 96,
    weather: { condition: "Clear", temp: "27°C", precipitation: "0%", wind: "10 km/h", alert: "NOMINAL" },
    description: "A sudden INR devaluation spike has caused import costs for critical components to surge 40% overnight, forcing procurement halts at Delhi."
  },
  {
    id: "hyderabad-credit-freeze",
    title: "Hyderabad Supplier Credit Line Freeze",
    category: "Financial/Market",
    affectedNodeId: "hyderabad",
    severity: "HIGH",
    estimatedDowntimeHours: 120,
    weather: { condition: "Clear", temp: "33°C", precipitation: "0%", wind: "8 km/h", alert: "NOMINAL" },
    description: "A banking system credit line freeze has suspended payment to critical Tier-2 suppliers, triggering a component delivery halt at Hyderabad."
  },
  {
    id: "shenzhen-tariff-spike",
    title: "Shenzhen Export Tariff Overnight Surge",
    category: "Financial/Market",
    affectedNodeId: "shenzhen",
    severity: "CRITICAL",
    estimatedDowntimeHours: 168,
    weather: { condition: "Clear", temp: "28°C", precipitation: "0%", wind: "12 km/h", alert: "AMBER ALERT: Export Duty Alert" },
    description: "An overnight executive order imposing 35% export tariffs on finished goods has frozen all Shenzhen cross-border shipment dispatches."
  },
  {
    id: "singapore-fuel-price-shock",
    title: "Singapore Bunkering Fuel Price Shock",
    category: "Financial/Market",
    affectedNodeId: "singapore",
    severity: "MEDIUM",
    estimatedDowntimeHours: 48,
    weather: { condition: "Normal", temp: "31°C", precipitation: "10%", wind: "15 km/h", alert: "NOMINAL" },
    description: "A geopolitical disruption has caused bunker fuel prices at Singapore to spike 120%, forcing shipping lines to idle vessels pending route renegotiation."
  },
  {
    id: "chennai-sanctions-freeze",
    title: "Chennai International Sanctions Asset Freeze",
    category: "Financial/Market",
    affectedNodeId: "chennai",
    severity: "CRITICAL",
    estimatedDowntimeHours: 240,
    weather: { condition: "Sunny", temp: "34°C", precipitation: "0%", wind: "18 km/h", alert: "RED ALERT: OFAC Sanctions Hold" },
    description: "New OFAC economic sanctions have frozen the financial accounts of a key logistics partner at Chennai, halting all port activity linked to those vessels."
  },

  // ── Category: Maritime & Port (6 Scenarios) ──
  {
    id: "mumbai-vessel-grounding",
    title: "Mumbai Harbor Vessel Grounding Blockage",
    category: "Maritime/Port",
    affectedNodeId: "mumbai",
    severity: "CRITICAL",
    estimatedDowntimeHours: 120,
    weather: { condition: "Low Visibility / Fog", temp: "27°C", precipitation: "20%", wind: "10 km/h", alert: "RED ALERT: Harbor Channel Blocked" },
    description: "A bulk carrier has run aground on a sandbar at the entrance to Mumbai's main harbor channel, blocking all inbound and outbound vessel traffic."
  },
  {
    id: "chennai-port-fire",
    title: "Chennai Container Terminal Chemical Fire",
    category: "Maritime/Port",
    affectedNodeId: "chennai",
    severity: "CRITICAL",
    estimatedDowntimeHours: 192,
    weather: { condition: "Clear / Windy", temp: "31°C", precipitation: "0%", wind: "35 km/h", alert: "BLACK ALERT: Terminal Fire — Full Evacuation" },
    description: "A fire ignited by misdeclared hazardous goods in a container stack is spreading through Chennai's Terminal 2, triggering full port evacuation."
  },
  {
    id: "singapore-piracy-diversion",
    title: "Singapore Strait Maritime Piracy Diversion",
    category: "Maritime/Port",
    affectedNodeId: "singapore",
    severity: "HIGH",
    estimatedDowntimeHours: 96,
    weather: { condition: "Clear", temp: "30°C", precipitation: "5%", wind: "20 km/h", alert: "AMBER ALERT: Maritime Security Zone Active" },
    description: "Coordinated piracy activity in the Singapore Strait has triggered a naval escort requirement, adding 4+ day diversions to all cargo vessels."
  },
  {
    id: "kolkata-river-lock-failure",
    title: "Kolkata River Lock Gate Mechanical Failure",
    category: "Maritime/Port",
    affectedNodeId: "kolkata",
    severity: "HIGH",
    estimatedDowntimeHours: 120,
    weather: { condition: "Monsoon", temp: "28°C", precipitation: "80%", wind: "25 km/h", alert: "RED ALERT: Lock Gate Failure" },
    description: "The primary hydraulic gates at the Kolkata river lock have seized shut due to mechanical failure, trapping 12 loaded barges and halting river freight."
  },
  {
    id: "shenzhen-port-cyber-lockout",
    title: "Shenzhen Port Terminal OS Cyber Lockout",
    category: "Maritime/Port",
    affectedNodeId: "shenzhen",
    severity: "CRITICAL",
    estimatedDowntimeHours: 168,
    weather: { condition: "Partly Cloudy", temp: "26°C", precipitation: "10%", wind: "15 km/h", alert: "RED ALERT: Port TOS Offline" },
    description: "A sophisticated cyberattack has knocked the Shenzhen port Terminal Operating System offline, disabling crane scheduling and container tracking."
  },
  {
    id: "mumbai-oil-spill",
    title: "Mumbai Harbor Fuel Tanker Oil Spill",
    category: "Maritime/Port",
    affectedNodeId: "mumbai",
    severity: "HIGH",
    estimatedDowntimeHours: 144,
    weather: { condition: "Calm Sea / Humid", temp: "30°C", precipitation: "10%", wind: "8 km/h", alert: "RED ALERT: Harbor Oil Spill — Cleanup Active" },
    description: "A fuel tanker collision in Mumbai harbor has caused a 40,000-liter diesel spill, triggering Coast Guard operations and closing the harbor to all vessels."
  },

  // ── Category: Rail & Road Infrastructure (6 Scenarios) ──
  {
    id: "delhi-rail-derailment",
    title: "Delhi Freight Rail Derailment — Track Closure",
    category: "Rail/Road",
    affectedNodeId: "delhi",
    severity: "HIGH",
    estimatedDowntimeHours: 96,
    weather: { condition: "Clear", temp: "24°C", precipitation: "0%", wind: "12 km/h", alert: "AMBER ALERT: Rail Line Blocked" },
    description: "A freight train derailment on the Golden Quadrilateral rail corridor has blocked 3 tracks near Delhi, halting all bulk cargo rail movement."
  },
  {
    id: "pune-tunnel-rockfall",
    title: "Pune Western Ghats Tunnel Rockfall Blockade",
    category: "Rail/Road",
    affectedNodeId: "pune",
    severity: "HIGH",
    estimatedDowntimeHours: 120,
    weather: { condition: "Heavy Rain", temp: "21°C", precipitation: "100%", wind: "30 km/h", alert: "RED ALERT: Tunnel Access Suspended" },
    description: "A rockfall inside the Bhor Ghat highway tunnel has completely blocked the Mumbai-Pune expressway alternative route, stranding 800+ trucks."
  },
  {
    id: "bengaluru-bridge-closure",
    title: "Bengaluru Flyover Emergency Structural Inspection",
    category: "Rail/Road",
    affectedNodeId: "bengaluru",
    severity: "MEDIUM",
    estimatedDowntimeHours: 72,
    weather: { condition: "Rain / Humidity", temp: "24°C", precipitation: "60%", wind: "20 km/h", alert: "AMBER ALERT: Bridge Load Restricted" },
    description: "Engineering inspectors have detected micro-fractures in a critical highway flyover at the Bengaluru DC access road, closing it to heavy goods vehicles."
  },
  {
    id: "hyderabad-highway-sinkhole",
    title: "Hyderabad National Highway Sinkhole Collapse",
    category: "Rail/Road",
    affectedNodeId: "hyderabad",
    severity: "CRITICAL",
    estimatedDowntimeHours: 168,
    weather: { condition: "Post-Rain", temp: "29°C", precipitation: "30%", wind: "10 km/h", alert: "RED ALERT: Highway Sinkhole Active" },
    description: "An underground drainage collapse has created a 15-meter sinkhole on NH-44, the primary arterial road connecting Hyderabad to the national freight network."
  },
  {
    id: "kolkata-rail-strike",
    title: "Kolkata Railway Staff Wildcat Strike",
    category: "Rail/Road",
    affectedNodeId: "kolkata",
    severity: "HIGH",
    estimatedDowntimeHours: 96,
    weather: { condition: "Monsoon", temp: "27°C", precipitation: "90%", wind: "22 km/h", alert: "AMBER ALERT: Rail Ops Suspended" },
    description: "A wildcat industrial action by locomotive drivers at the Kolkata Rail Yard has suspended all freight train departures from the Eastern region hub."
  },
  {
    id: "mumbai-expressway-multi-crash",
    title: "Mumbai Expressway Multi-Vehicle Pile-Up",
    category: "Rail/Road",
    affectedNodeId: "mumbai",
    severity: "MEDIUM",
    estimatedDowntimeHours: 36,
    weather: { condition: "Dense Fog", temp: "24°C", precipitation: "10%", wind: "5 km/h", alert: "AMBER ALERT: Expressway Closed" },
    description: "A 23-vehicle pile-up on the Mumbai-Pune Expressway due to zero-visibility fog has closed both carriageways and stranded hundreds of freight trucks."
  }
];
