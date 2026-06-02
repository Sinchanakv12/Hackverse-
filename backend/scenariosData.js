/**
 * CHAOS ARCHITECT — Scenario Database
 * 
 * Contains 51 crisis scenarios across 6 categories, used by the supply chain
 * simulator to model various operational, meteorological, and cybersecurity failures.
 */

"use strict";

const scenarios = [
  // ── Category: Air Transport & Currents (9 Scenarios) ──
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
    sensorReadings: {
      windSpeedKmh: 145,
      turbulenceGForce: "2.8G",
      airDensityRatio: "0.82",
      flightAltitudeDeviationM: "+1,200m",
      atcCommsStatus: "INTERMITTENT"
    },
    descriptionTemplate: "A severe high-altitude jet stream deviation near Delhi Air Cargo Hub has triggered extreme turbulence and wind shear, grounding all medium and heavy cargo aircraft. 5,000 {cargoUnit} of {cargoName} are stranded on the runways."
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
    sensorReadings: {
      radarSignalLossPct: 100,
      backupPowerLoadPct: 34,
      atcTerminalUptimePct: 0,
      divertedFlightsCount: 28,
      transponderSignalRate: "Zero"
    },
    descriptionTemplate: "A catastrophic UPS backup battery failure at the Chennai Air Traffic Control Center has knocked out secondary radar and transponder tracking systems. Grounding of all air cargo flights has stranded 5,000 {cargoUnit} of {cargoName} in the cargo bays."
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
    sensorReadings: {
      windShearDeltaKmh: 75,
      cloudBaseHeightM: 150,
      precipitationMmPerHr: 95,
      runwayVisualRangeM: 200,
      atcRadioSignalDb: -85
    },
    descriptionTemplate: "Severe meteorological air current anomalies and microbursts at Mumbai Logistics Airport have forced air carriers to suspend operations. The sudden downward air currents make landing unsafe, keeping 5,000 {cargoUnit} of {cargoName} locked in transit."
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
    sensorReadings: {
      barometricPressureHpa: 935,
      maxWindGustKmh: 195,
      runwayFloodingCm: 18,
      structuralStressSensorPct: 82,
      powerGridFeedVoltage: "Offline"
    },
    descriptionTemplate: "Super Typhoon wind gusts exceeding safety limits for cargo loadouts have forced full grounding at Shenzhen. 5,000 {cargoUnit} of {cargoName} are stuck in warehouses waiting for the storm front to pass."
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
    sensorReadings: {
      airParticulatePm10: "480 ug/m3",
      jetEngineIcingProbabilityPct: 88,
      airspaceCapacityPct: 15,
      averageFlightHoldTimeMin: 180,
      visibilityIndexKm: 1.5
    },
    descriptionTemplate: "A volcanic eruption in the Indonesian archipelago has sent high-altitude ash clouds drifting into Singapore's flight corridors. Jet engine safety thresholds prevent flight entries, halting 5,000 {cargoUnit} of {cargoName}."
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
    sensorReadings: {
      pm25Concentration: "620 ug/m3",
      visualRangeM: 50,
      ilsSignalQualityPct: 98,
      apronMovementRatePct: 20,
      runwayTempC: 8
    },
    descriptionTemplate: "A severe winter inversion fog layer combined with agricultural smog has dropped runway visibility at Delhi Cargo Hub to under 50 meters, suspending non-Category-III cargo flights and stranding 5,000 {cargoUnit} of {cargoName}."
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
    sensorReadings: {
      cabinPressurePsi: 5.4,
      targetPressurePsi: 14.7,
      structuralStressLeakLocation: "Forward Cargo Hatch Door",
      fuselageTempC: -45,
      oxygenSupplyRemainingMin: 20
    },
    descriptionTemplate: "A cargo hold seal depressurization event mid-flight has forced an emergency return of our regional freighter to Kolkata. 5,000 {cargoUnit} of {cargoName} require extensive damage inspections and temperature-stabilization checks."
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
    sensorReadings: {
      fuelWaterContentPpm: 1200,
      microbialContaminationScore: "SEVERE",
      fuelStorageTanksQuarantinedCount: 4,
      testingQueueDelayHrs: 18,
      hydrantSystemPressurePsi: 0
    },
    descriptionTemplate: "A major water leak into the underground aviation fuel tanks at Mumbai Logistics Hub has caused microbial fuel contamination. All refueling operations are halted, preventing flight departures for 5,000 {cargoUnit} of {cargoName}."
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
    sensorReadings: {
      uasRadarIdentifiedCount: 2,
      perimeterSecurityStatus: "LOCKDOWN",
      militaryJammerActive: true,
      flightHoldQueueCount: 14,
      signalInterferenceRssi: -110
    },
    descriptionTemplate: "Unauthorized drone flights within the Hyderabad airport security zone have triggered an immediate lockdown of the airspace. Cargo planes are held on the tarmac, delaying delivery of 5,000 {cargoUnit} of {cargoName}."
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
    sensorReadings: {
      rainfallMmPerHour: 87.4,
      floodWaterLevelCm: 142,
      structuralIntegrity: "COMPROMISED",
      powerStatus: "OFFLINE"
    },
    descriptionTemplate: "Catastrophic monsoon flooding has rendered the Bengaluru Distribution Center inaccessible. Cold storage power systems have failed, endangering 5,000 {cargoUnit} of {cargoName}."
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
    sensorReadings: {
      barometricPressureHpa: 960,
      stormSurgeHeightM: 3.2,
      runwayFloodingCm: 45,
      craneStructuralWindLimitExceeded: true,
      powerStatus: "OFFLINE"
    },
    descriptionTemplate: "A Category 3 tropical cyclone has made landfall at Chennai, triggering a severe storm surge and flooding all coastal transport corridors. Crane loading is suspended, stranding 5,000 {cargoUnit} of {cargoName}."
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
    sensorReadings: {
      expresswayBlockageTons: 1400,
      detourTransitDelayHrs: 18,
      structuralDamageScore: 0.42,
      activeSlideSensorAlert: true,
      averageGridlockLengthKm: 14
    },
    descriptionTemplate: "Monsoon rains triggered a major mudslide on the Pune-Mumbai Expressway, blockading the primary ground corridor. Heavy freight vehicles cannot exit Pune, trapping 5,000 {cargoUnit} of {cargoName}."
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
    sensorReadings: {
      surgeHeightM: 2.1,
      dockBayFloodingCm: 35,
      customsOfficeStatus: "EVACUATED",
      seaWallInundationPct: 100,
      cranePowerFeedStatus: "OFFLINE"
    },
    descriptionTemplate: "A combination of high tide and cyclone-driven storm surge has flooded low-lying warehouse complexes at the Mumbai Logistics Hub. 5,000 {cargoUnit} of {cargoName} are stuck in waterlogged yards."
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
    sensorReadings: {
      pipeFreezeSensorStatus: "FROZEN",
      boilerPressurePsi: 0,
      loadingDockIceThicknessMm: 12,
      heatingSystemOperationalPct: 0,
      groundFrictionCoefficient: 0.18
    },
    descriptionTemplate: "An unprecedented cold wave in North India has frozen fire mains and water pipes at the Delhi Air Cargo Hub, triggering fire-safety lockdowns. 5,000 {cargoUnit} of {cargoName} are trapped in unheated storage cells."
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
    sensorReadings: {
      riverLevelAboveDeltam: 4.8,
      bargeTerminalFloodingCm: 80,
      bargeMooringTensionKn: 340,
      riverCurrentSpeedKts: 7.2,
      railLinkSubmergedKm: 3.5
    },
    descriptionTemplate: "Upstream discharges combined with local monsoons have caused the Ganges delta to overflow. Kolkata river barge terminals and connecting rail links are submerged, delaying 5,000 {cargoUnit} of {cargoName}."
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
    sensorReadings: {
      substationTransformerTempC: 115,
      backupGeneratorFuelRemainingHrs: 6,
      hvacCoolingEfficiencyPct: 35,
      powerGridLoadMvar: 480,
      indoorAmbientTempC: 38
    },
    descriptionTemplate: "A severe heatwave with temperatures reaching 47°C has overloaded and tripped the power grid in Hyderabad. Backup diesel generators are operating at thermal thresholds, endangering cold storage for 5,000 {cargoUnit} of {cargoName}."
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
    sensorReadings: {
      earthquakeMagnitudeRichter: 5.2,
      gasMainValvesStatus: "CLOSED (AUTO)",
      structuralVibrationScore: 0.15,
      automatedRackInspectionFailures: 4,
      cracksDetectedSensorCount: 2
    },
    descriptionTemplate: "A moderate seismic shock has triggered automatic shutoffs of electrical grids and gas pipelines at the Shenzhen Manufacturing Plant. 5,000 {cargoUnit} of {cargoName} are held while structural engineers run safety audits."
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
    sensorReadings: {
      psiHazeIndex: 325,
      pm25Concentration: "185 ug/m3",
      outdoorShiftWorkLimitHrs: 2,
      hvacAirFilterCloggingPct: 92,
      opticalVisibilityKm: 0.8
    },
    descriptionTemplate: "Severe transboundary agricultural smoke has pushed the Singapore Air Pollutant Index into the hazardous range. Warehouse operations are restricted to 2-hour shifts for worker safety, slowing transit for 5,000 {cargoUnit} of {cargoName}."
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
      alert: "NOMINAL: Meteorological"
    },
    sensorReadings: {
      activeDirectoryStatus: "COMPROMISED",
      encryptedServersCount: 140,
      icsScadaNetworkStatus: "ISOLATED",
      threatActorIdentify: "BlackByte Group",
      backupRestoreEstHrs: 120
    },
    descriptionTemplate: "A major ransomware attack has encrypted the Active Directory domain controllers at the Bengaluru Distribution Center, shutting down barcode scanners, shipping scales, and gate controls. 5,000 {cargoUnit} of {cargoName} are completely untraceable."
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
      alert: "NOMINAL: Meteorological"
    },
    sensorReadings: {
      apiGatewayErrorRatePct: 100,
      databaseDnsLookupStatus: "FAIL",
      cloudStorageReplicationSyncDb: -99,
      localFallbackCacheActive: false,
      incidentPriorityLevel: 1
    },
    descriptionTemplate: "An undersea fiber-optic cable cut has knocked out primary cloud data centers in the Mumbai region, disabling real-time ERP dispatching. Cargo trucks are stranded at the gates with 5,000 {cargoUnit} of {cargoName}."
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
    sensorReadings: {
      gpsSnrDbHz: 12,
      satelliteFixCount: 0,
      jammingSignalStrengthDbm: -65,
      telemetryBlindFleetCount: 84,
      inertialDriftSpeedErrorKmh: 14
    },
    descriptionTemplate: "A military airbase exercise or malicious jamming signal has blinded GPS receivers along the Delhi logistics corridor. Fleets are losing tracking capabilities, forcing routing shutdowns for 5,000 {cargoUnit} of {cargoName}."
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
      alert: "NOMINAL: Meteorological"
    },
    sensorReadings: {
      dnsRedirectionTarget: "185.190.140.x",
      sslCertificateMatch: "MISMATCH",
      phishedAccountsIdentified: 12,
      manifestIntegrityValidationScore: 0.12,
      firewallRulesAlteredCount: 3
    },
    descriptionTemplate: "A sophisticated DNS cache poisoning attack has redirected the Chennai seaport manifest database portal. Outbound customs clearance is suspended to prevent illegal export, locking 5,000 {cargoUnit} of {cargoName} in holding bays."
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
      alert: "NOMINAL: Meteorological"
    },
    sensorReadings: {
      databaseTablesCorruptedCount: 14,
      walLogFSyncLatencyMs: 850,
      raidArrayDegradedDrivesCount: 2,
      transactionRollbacksPerHour: 480,
      parityCheckStatus: "FAILING"
    },
    descriptionTemplate: "A RAID controller memory buffer failure has corrupted the inventory transaction logs at Kolkata. Warehouse management cannot verify locations, delaying shipments of 5,000 {cargoUnit} of {cargoName}."
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
      alert: "NOMINAL: Meteorological"
    },
    sensorReadings: {
      smartVaultStatus: "LOCKED_SHIELDED",
      lockoutResponseCode: "ERR_403_CERT_EXPIRED",
      physicalOverrideFailures: 8,
      firmwareChecksumMatch: "MISMATCH",
      unauthorizedAccessAttempts: 1400
    },
    descriptionTemplate: "An expired digital certificate or malicious firmware push has locked all IoT security vaults at the Pune yard. Physical overrides are failing, locking up 5,000 {cargoUnit} of {cargoName} inside vaults."
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
      alert: "NOMINAL: Meteorological"
    },
    sensorReadings: {
      telemetrySpoofAnomalyDetected: true,
      tamperedPacketsIdentifiedPct: 18,
      temperatureSensorDeviationC: "+85.2°C (MOCKED)",
      signatureVerificationFailures: 140,
      blockchainSyncHashRateStatus: "OUT_OF_SYNC"
    },
    descriptionTemplate: "Security software detected anomalous data packets spoofing cold-chain temperature telemetry at Hyderabad. 5,000 {cargoUnit} of {cargoName} are quarantined until manual temperature checks verify product safety."
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
      alert: "NOMINAL: Meteorological"
    },
    sensorReadings: {
      ingressTrafficGbps: 450,
      http502BadGatewayCountSec: 4200,
      maliciousIpAddressesBlocked: 12000,
      firewallCpuLoadPct: 98,
      cdnCacheMissRatePct: 95
    },
    descriptionTemplate: "A massive distributed denial-of-service (DDoS) attack has flooded Singapore's API gateways, making routing and cross-docking APIs offline. 5,000 {cargoUnit} of {cargoName} are held at checkpoints."
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
      alert: "NOMINAL: Meteorological"
    },
    sensorReadings: {
      plcControllerStatus: "HALTED",
      networkStackOverflowAlerts: 4,
      conveyorBeltSpeedMMin: 0,
      diagnosticErrorCode: "PLC_CPU_OVRFLW",
      manualOverrideReadyPct: 10
    },
    descriptionTemplate: "A firmware exception has crashed the primary programmable logic controllers (PLCs) on Shenzhen's sorting line. Manual bypass is slow, backing up 5,000 {cargoUnit} of {cargoName} in the staging area."
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
    sensorReadings: {
      craneUptimePct: 0,
      dockedCargoVesselsCount: 14,
      laborAbsenceRatePct: 98,
      containerStagingYardUtilization: "94%",
      negotiationStatus: "STALLED"
    },
    descriptionTemplate: "Crane operators at the Mumbai Port have staged a wildcat labor strike. Cargo loading is halted, trapping 5,000 {cargoUnit} of {cargoName} in the export shipyard."
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
    sensorReadings: {
      customsAuditHoldRatioPct: 85,
      averageDeclarationDelayHrs: 72,
      inspectedContainerCount: 140,
      customsOfficerFteActive: 4,
      clearanceQueueLength: 850
    },
    descriptionTemplate: "A new export regulation has triggered mandatory manual audits for cargo at the Chennai Terminal. Severe paperwork bottlenecks have locked 5,000 {cargoUnit} of {cargoName} in customs holds."
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
    sensorReadings: {
      blockedBorderCrossingCount: 5,
      protestingTruckersCount: 2200,
      freightRerouteMiles: 340,
      averageDetourDelayHrs: 14,
      policeCheckpointsActive: 8
    },
    descriptionTemplate: "A regional transport union protest has blockaded the entry highways into the Delhi Capital Territory. Heavy trucks are barred from entry, stalling transit of 5,000 {cargoUnit} of {cargoName}."
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
    sensorReadings: {
      riverBargeMovementRatePct: 0,
      strandedBargesAnchoredCount: 18,
      pilotDisputeStatus: "ARBITRATION_PENDING",
      riverDraftHeightM: 6.2,
      jettyCongestionIndex: "CRITICAL"
    },
    descriptionTemplate: "River barge pilots in Kolkata have gone on strike, bringing inland container transit along the riverway to a standstill. 5,000 {cargoUnit} of {cargoName} are stuck on river barges."
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
    sensorReadings: {
      tollPlazaBlockageCount: 3,
      chokepointDelayHrs: 8,
      divertedFreightRatioPct: 70,
      alternativeRouteCapacityPct: 40,
      incidentResponseTeamStatus: "DEPLOYED"
    },
    descriptionTemplate: "Agricultural protests have blockaded major toll gates on the Pune exit routes. Trucks cannot depart the manufacturing zones, delaying delivery of 5,000 {cargoUnit} of {cargoName}."
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
    sensorReadings: {
      closedAirspaceSectorsCount: 4,
      detourKmOffset: 850,
      freightTransitFuelCostPremiumPct: 45,
      airspaceTrafficDelayMin: 220,
      notamAlertActive: true
    },
    descriptionTemplate: "Sudden military air drills in neighboring airspaces have forced the closure of multiple flight paths. Cargo flights out of Singapore must take fuel-heavy detours, delaying 5,000 {cargoUnit} of {cargoName}."
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
    sensorReadings: {
      deniedShipmentsCount: 14,
      customsInspectionAuditRatePct: 90,
      complianceApprovalDelayHrs: 96,
      restrictedMaterialCategories: "Semiconductors / Lithography",
      embargoStrictnessScore: 0.85
    },
    descriptionTemplate: "A trade dispute has triggered a custom hold on specific electronics components at the Shenzhen facility. 5,000 {cargoUnit} of {cargoName} are held back for regulatory re-clearance."
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
    sensorReadings: {
      dockworkersPresentCount: 12,
      shiftCargoThroughputPct: 20,
      negotiatorMeetingTime: "14:00 GMT",
      unloadedTrailersCount: 42,
      gateThroughputRateSec: 1800
    },
    descriptionTemplate: "A local shift scheduling dispute has prompted a walkout by ground handlers at the Bengaluru Distribution Center, leaving 5,000 {cargoUnit} of {cargoName} unloaded in container trailers."
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
    sensorReadings: {
      airParticulatePm25: "340 ug/m3",
      sprinklerWaterPrecipitationPct: 100,
      structuralHeatSensorC: 180,
      vocChemicalConcentrationPpm: 45,
      hvacStatus: "EMERGENCY_SHUTDOWN"
    },
    descriptionTemplate: "A lithium-ion forklift battery suffered a thermal runaway event, causing a fire and toxic gas plume at the Mumbai Hub. All operations are halted, preventing the dispatch of 5,000 {cargoUnit} of {cargoName}."
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
    sensorReadings: {
      ammoniaConcentrationPpm: 350,
      safetyThresholdPpm: 25,
      evacuationZoneRadiusM: 300,
      ventilationSystemPowerStatus: "ACTIVE",
      hazmatTeamStatus: "ON_SITE"
    },
    descriptionTemplate: "A pressure valve failure on a primary refrigerant chiller has caused a severe anhydrous ammonia leak at the Chennai facility. 5,000 {cargoUnit} of {cargoName} are trapped in the evacuated hazard zone."
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
    sensorReadings: {
      craneCableTensionN: 0,
      gantryDebrisTons: 180,
      blockedAislesCount: 3,
      inspectionRobotsActive: 2,
      structuralTiltSensorDeg: 12.4
    },
    descriptionTemplate: "A steel cable snap on the primary container hoist has collapsed a 100-ton gantry crane onto Delhi's outgoing cargo docks. Loading lanes are blocked, trapping 5,000 {cargoUnit} of {cargoName} underneath."
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
      alert: "NOMINAL: Meteorological"
    },
    sensorReadings: {
      conveyorBeltTempC: 380,
      smokeDetectorsTriggeredCount: 8,
      sprinklerDischargeGallons: 450,
      burntSorterModulesCount: 14,
      manualSortingEfficiencyPct: 15
    },
    descriptionTemplate: "A bearing friction fire has burned through the main sorting loop conveyor belt at the Kolkata terminal. All high-speed barcode sorting is offline, delaying shipments of 5,000 {cargoUnit} of {cargoName}."
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
    sensorReadings: {
      roofStructuralStressScore: 1.0,
      loadingDockFloodingCm: 15,
      structuralAisleBlockedCount: 2,
      crushedStoragePalletsCount: 24,
      craneClearanceStatus: "SUSPENDED"
    },
    descriptionTemplate: "A sudden structural collapse of the warehouse loading canopy under water weight has blocked all truck dock loading gates at Pune, stranding 5,000 {cargoUnit} of {cargoName}."
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
      alert: "NOMINAL: Meteorological"
    },
    sensorReadings: {
      delugeValveStatus: "DISCHARGING",
      humidityPct: 100,
      waterFlowRateLMin: 1200,
      soakedAisleCount: 4,
      dryingEquipmentActiveCount: 20
    },
    descriptionTemplate: "A thermal sensor glitch activated the fire deluge system in Hyderabad's main vault, soaking secondary stock shelves. 5,000 {cargoUnit} of {cargoName} are halted for dry-out inspections."
  },
  {
    id: "bengaluru-power-grid",
    title: "Bengaluru High-Voltage Transformer Exploding",
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
    sensorReadings: {
      substationVoltageIn: 0,
      backupGeneratorPowerKw: 450,
      generatorCoolantTempC: 98,
      upsUptimeRemainingMin: 0,
      automaticSheddingActive: true
    },
    descriptionTemplate: "An explosion at the utility substation feeding the Bengaluru Distribution Center has cut primary grid power. Emergency generators are operating under shedding rules, stopping shipments for 5,000 {cargoUnit} of {cargoName}."
  },
  {
    id: "shenzhen-rack-collapse",
    title: "Shenzhen Automated Stacker Crane Rack Failure",
    category: "Mechanical/Safety",
    affectedNodeId: "shenzhen",
    severity: "HIGH",
    estimatedDowntimeHours: 60,
    weather: {
      condition: "Clear",
      temp: "25°C",
      precipitation: "0%",
      wind: "10 km/h",
      alert: "NOMINAL: Meteorological"
    },
    sensorReadings: {
      aisleStructuralIntegrity: "FAILED",
      asrsStackerCraneStatus: "DOCK_LOCKED",
      crushedContainerWeightsTons: 45,
      laserGuideDeflectionMm: 240,
      hydraulicPressurePsi: 0
    },
    descriptionTemplate: "An overloaded storage rack failed in Shenzhen's high-bay automated warehouse, blocking the AS/RS crane corridors. Automated stock retrieval is locked, holding 5,000 {cargoUnit} of {cargoName} in storage."
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
      alert: "NOMINAL: Meteorological"
    },
    sensorReadings: {
      supplierCreditStatus: "DEFAULT",
      rawMaterialStockDays: 1.5,
      alternativeSupplierLeadDays: 14,
      outstandingOrdersCount: 220,
      contractArbitrationStatus: "ACTIVE"
    },
    descriptionTemplate: "A primary packaging and parts supplier for our Pune facility has suddenly declared bankruptcy, halting production lines. 5,000 {cargoUnit} of {cargoName} are stranded mid-assembly."
  },
  {
    id: "bengaluru-packaging-shortage",
    title: "Bengaluru custom Eco-Board Packaging Fire",
    category: "Supply Chain Shock",
    affectedNodeId: "bengaluru",
    severity: "MEDIUM",
    estimatedDowntimeHours: 72,
    weather: {
      condition: "Light Rain",
      temp: "24°C",
      precipitation: "30%",
      wind: "15 km/h",
      alert: "NOMINAL: Meteorological"
    },
    sensorReadings: {
      ecoPackagingSheetsAvailable: 0,
      dailyPackagingDemandSheets: 8000,
      backlogOrdersCount: 420,
      expressSourcingCostPremiumPct: 35,
      alternativeStockMatchesPct: 15
    },
    descriptionTemplate: "A major fire at the packaging vendor's plant has cut the supply of compliance packaging at Bengaluru. Outbound shipments of 5,000 {cargoUnit} of {cargoName} are stalled due to packing violations."
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
      alert: "NOMINAL: Meteorological"
    },
    sensorReadings: {
      ecommerceOrdersSec: 45,
      historicalAverageOrdersSec: 1.2,
      inventoryDeficitUnits: 14000,
      fulfillmentSystemLoadPct: 98,
      stockoutProbabilityPct: 92
    },
    descriptionTemplate: "A viral marketing event has triggered a 40x spike in retail orders, exhausting the regional inventory buffer in Mumbai. 5,000 {cargoUnit} of {cargoName} must be reallocated from commercial accounts."
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
    sensorReadings: {
      recalledbatchHash: "FDA_REC_2026_09",
      quarantineAreaUtilizationPct: 100,
      chemicalPurityDeviationPct: "-0.42%",
      labTestingUptimeHours: 168,
      compliancePenaltyExposure: 250000
    },
    descriptionTemplate: "A quality deviation in the primary raw batch material has triggered an FDA regulatory quarantine at Hyderabad. 5,000 {cargoUnit} of {cargoName} are locked in quarantine holds."
  },
  {
    id: "delhi-cargo-heist",
    title: "Delhi Freight Corridor Truck Hijacking Heist",
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
    sensorReadings: {
      stolenVehiclesCount: 3,
      investigationCorridorRadiusKm: 50,
      insuranceClaimFilingCode: "THEFT_FORCE_MAJEURE",
      telemetrySignalCutTimestamp: "2026-06-02T12:00:00Z",
      recoveryForceDeployed: true
    },
    descriptionTemplate: "Organized highway cargo thieves have hijacked several freight trucks along the Delhi highway corridor. Security audits are halting all regional outbound freight, locking up 5,000 {cargoUnit} of {cargoName}."
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
      alert: "NOMINAL: Meteorological"
    },
    sensorReadings: {
      certificateVerificationErrorRatePct: 100,
      pendingCustomsApprovalCount: 1200,
      customsServerResponseMs: 15000,
      localClearanceBufferUptimePct: 22,
      digitalSignatureStatus: "UNAUTHORIZED_KEY"
    },
    descriptionTemplate: "An invalid digital certificate mismatch on the cross-border customs portal has frozen automated clearances at Singapore. 5,000 {cargoUnit} of {cargoName} are held up until manual overrides clear."
  },
  {
    id: "shenzhen-parts-shortage",
    title: "Shenzhen Microcontroller Chip Sub-tier Scarcity",
    category: "Supply Chain Shock",
    affectedNodeId: "shenzhen",
    severity: "HIGH",
    estimatedDowntimeHours: 120,
    weather: {
      condition: "Clear",
      temp: "26°C",
      precipitation: "0%",
      wind: "12 km/h",
      alert: "NOMINAL: Meteorological"
    },
    sensorReadings: {
      siliconWaferSupplyDays: 2.5,
      assemblyLineSpeedPct: 40,
      leadTimeToNewSupplyWeeks: 8,
      backloggedChipOrdersCount: 14000,
      overtimeHoursWorkedTotal: 2200
    },
    descriptionTemplate: "An upstream wafer foundry shortage has delayed raw microcontroller shipments to the Shenzhen facility. 5,000 {cargoUnit} of {cargoName} are stuck on assembly lines waiting for components."
  },
  {
    id: "chennai-container-scarcity",
    title: "Chennai Port Empty Container Shipping Deficit",
    category: "Supply Chain Shock",
    affectedNodeId: "chennai",
    severity: "MEDIUM",
    estimatedDowntimeHours: 96,
    weather: {
      condition: "Clear",
      temp: "32°C",
      precipitation: "0%",
      wind: "20 km/h",
      alert: "AMBER ALERT: Empty Container Deficit"
    },
    sensorReadings: {
      emptyContainersAvailableCount: 14,
      dailyContainerDemandRate: 180,
      spotLeasePremiumPct: 85,
      dockedContainerShipsWaiting: 8,
      freightFreightCostIndex: 12000
    },
    descriptionTemplate: "A shipping lane imbalance has created an extreme shortage of empty container boxes at Chennai Port. Exports of 5,000 {cargoUnit} of {cargoName} are suspended until empty shipping units arrive."
  }
];

module.exports = {
  scenarios
};
