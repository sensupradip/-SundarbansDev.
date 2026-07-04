/**
 * Dev Sundarbans - Delta & Tiger Conservation Policy Simulation Engine
 * Wrapped in an IIFE to protect scope and prevent naming collisions.
 */
(function() {
  // Ecological Zone specific resource data for the Sundarbans core and buffer zones
  const zoneData = {
    "Sajnakhali Sanctuary": {
      focus: "Wildlife Refuge & Core Breeding Reserve",
      desc: "One of the most critical bird sanctuaries and tiger nesting zones. Heavy riverine patrols are required due to proximity to human settlements.",
      water: "Area: 362 sq km (mangrove mudflats, estuaries)",
      systems: "Watchtowers, crocodile breeding ponds, nature trails",
      species: "Bengal Tiger, Estuarine Crocodile, River Terrapin, Spotted Deer",
      baseProd: 34 // Baseline Tiger Index
    },
    "Sudhanyakhali Camp": {
      focus: "Sweetwater Pond Monitor & Tiger Observation Core",
      desc: "Centered around an artificial freshwater pond that attracts tigers. Heavily monitored watchtower checkpoint with high ecotourism footfalls.",
      water: "Area: 120 sq km (mangrove cover, mud creeks)",
      systems: "Sweetwater retention tank, visitor observation paths",
      species: "Bengal Tiger, Wild Boar, Rhesus Macaque, Monitor Lizard",
      baseProd: 22
    },
    "Dobanki Canopy": {
      focus: "Canopy Walk & Aerial Wildlife Corridor",
      desc: "Features a half-kilometer long fenced canopy walk 20 feet above ground level. Ideal for observing arboreal species and tiger track paths.",
      water: "Area: 180 sq km (inter-tidal delta channels)",
      systems: "Fenced canopy walkway, anti-poaching boat post",
      species: "Bengal Tiger, Chital, King Cobra, Lesser Adjutant Stork",
      baseProd: 18
    },
    "Netidhopani Ruins": {
      focus: "Historical Ruins & Border Security Buffer Zone",
      desc: "Home to the ruins of a 400-year-old temple. Serves as a key delta buffer zone adjacent to open sea gates, requiring high-alert coastguard coordination.",
      water: "Area: 240 sq km (exposed sand beaches, open estuaries)",
      systems: "Patrol watchtower, coastal weather monitoring station",
      species: "Bengal Tiger, Fiddler Crab, Mudskipper, Snapping Shrimp",
      baseProd: 28
    }
  };

  // State elements
  let elements = {};
  let charts = {};

  // Initialize function
  function init() {
    // Cache DOM Elements
    elements = {
      section: document.getElementById("section-sundarbans"),
      sliderWater: document.getElementById("slider-patrols"),
      sliderLand: document.getElementById("slider-replanting"),
      sliderIntegrated: document.getElementById("slider-incentives"),
      sliderBreeds: document.getElementById("slider-visitor-cap"),
      sliderIrrigation: document.getElementById("slider-salinity"),
      sliderCold: document.getElementById("slider-sealevel"),
      
      lblWater: document.getElementById("lbl-patrols"),
      lblLand: document.getElementById("lbl-replanting"),
      lblIntegrated: document.getElementById("lbl-incentives"),
      lblBreeds: document.getElementById("lbl-visitor-cap"),
      lblIrrigation: document.getElementById("lbl-salinity"),
      lblCold: document.getElementById("lbl-sealevel"),
      
      prodFish: document.getElementById("prod-ne-fish"),
      prodCrops: document.getElementById("prod-ne-crops"),
      prodLivestock: document.getElementById("prod-ne-livestock"),
      
      // Secondary splits
      dairyYieldMilk: document.getElementById("dairy-yield-milk"),
      dairyYieldChhurpi: document.getElementById("dairy-yield-chhurpi"),
      dairyYieldGhee: document.getElementById("dairy-yield-ghee"),
      dairyYieldPaneer: document.getElementById("dairy-yield-paneer"),
      
      piggeryYieldPork: document.getElementById("piggery-yield-pork"),
      piggeryRevenuePork: document.getElementById("piggery-revenue-pork"),
      goateryYieldMutton: document.getElementById("goatery-yield-mutton"),
      goateryRevenueMutton: document.getElementById("goatery-revenue-mutton"),
      
      tourismFootfall: document.getElementById("tourism-val-footfall"),
      tourismRevenue: document.getElementById("tourism-val-revenue"),
      tourismArtisans: document.getElementById("tourism-val-artisans"),
      tourismCraftsRev: document.getElementById("tourism-val-crafts-rev"),
      
      spoilage: document.getElementById("logistics-spoilage"),
      spoilageBar: document.getElementById("logistics-spoilage-bar"),
      efficiency: document.getElementById("logistics-efficiency"),
      efficiencyBar: document.getElementById("logistics-efficiency-bar"),
      
      frameworkValJobs: document.getElementById("framework-val-jobs"),
      frameworkValExports: document.getElementById("framework-val-exports"),
      frameworkValInfra: document.getElementById("framework-val-infra"),
      frameworkValPpp: document.getElementById("framework-val-ppp"),
      frameworkValTotalInv: document.getElementById("framework-val-total-inv"),
      
      // Core KPIs
      kpiTigerPop: document.getElementById("kpi-tiger-pop"),
      kpiCanopyCover: document.getElementById("kpi-canopy-cover"),
      kpiPoaching: document.getElementById("kpi-poaching-incidents"),
      kpiEcoRevenue: document.getElementById("kpi-eco-revenue"),
      
      // Zone panel elements
      zoneTitle: document.getElementById("lbl-zone-title"),
      zoneType: document.getElementById("lbl-zone-type"),
      zoneDesc: document.getElementById("lbl-zone-desc"),
      zoneStatsContainer: document.getElementById("zone-stats-container"),
      zonePlaceholder: document.getElementById("zone-details-placeholder"),
      statTigers: document.getElementById("lbl-zone-tigers"),
      statDensity: document.getElementById("lbl-zone-density"),
      statSpecies: document.getElementById("lbl-zone-species"),
      
      mapPaths: document.querySelectorAll(".zone-interactive-node"),
      mapTooltip: document.getElementById("ne-map-tooltip"),
      
      tabButtons: document.querySelectorAll(".ne-tab-btn"),
      tabContents: document.querySelectorAll(".ne-tab-content"),
      
      scenarioBaseline: document.getElementById("preset-baseline"),
      scenarioLocal: document.getElementById("preset-high-protection"),
      scenarioExport: document.getElementById("preset-tourism-focus"),
      scenarioOptimum: document.getElementById("preset-balanced"),
      
      logisticsPaths: document.querySelectorAll(".flow-path-line")
    };

    if (!elements.section) return; // Guard clause

    // Initialize Event Listeners
    setupSliders();
    setupTabButtons();
    setupMapInteractivity();
    setupScenarios();
    
    // Initialize Charts
    initCharts();

    // Run Initial Simulation
    runSimulation();
  }

  // Setup sliders event listeners
  function setupSliders() {
    const sliders = [
      { slider: elements.sliderWater, lbl: elements.lblWater, suffix: "%" },
      { slider: elements.sliderLand, lbl: elements.lblLand, suffix: "%" },
      { slider: elements.sliderIntegrated, lbl: elements.lblIntegrated, suffix: "%" },
      { slider: elements.sliderBreeds, lbl: elements.lblBreeds, suffix: "%" },
      { slider: elements.sliderIrrigation, lbl: elements.lblIrrigation, suffix: " PPT" },
      { slider: elements.sliderCold, lbl: elements.lblCold, suffix: " cm" }
    ];

    sliders.forEach(item => {
      if (item.slider) {
        item.slider.addEventListener("input", (e) => {
          let val = e.target.value;
          if (item.slider === elements.sliderCold) {
            item.lbl.textContent = "+" + val + item.suffix;
          } else {
            item.lbl.textContent = val + item.suffix;
          }
          runSimulation();
          clearScenarioActiveStates();
        });
      }
    });
  }

  // Setup Tab control
  function setupTabButtons() {
    elements.tabButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const activeTabId = e.currentTarget.getAttribute("aria-controls");
        
        elements.tabButtons.forEach(b => b.classList.remove("active"));
        elements.tabContents.forEach(c => c.classList.remove("active"));
        
        e.currentTarget.classList.add("active");
        const activeContent = document.getElementById(activeTabId);
        if (activeContent) {
          activeContent.classList.add("active");
        }
        
        // Trigger Chart updates
        if (activeTabId === "tab-ne-prod") {
          setTimeout(() => {
            if (charts.prod) charts.prod.update();
            if (charts.farming) charts.farming.update();
          }, 50);
        }
      });
    });
  }

  // Map interactive click & hover
  function setupMapInteractivity() {
    elements.mapPaths.forEach(path => {
      // Hover Tooltip
      path.addEventListener("mousemove", (e) => {
        const zoneId = e.currentTarget.getAttribute("data-zone");
        // Capitalize for map key matching
        const zoneName = zoneId.charAt(0).toUpperCase() + zoneId.slice(1) + (zoneId === "netidhopani" ? " Ruins" : (zoneId === "dobanki" ? " Canopy" : (zoneId === "sajnakhali" ? " Sanctuary" : " Camp")));
        const currentData = zoneData[zoneName];
        if (!currentData) return;

        elements.mapTooltip.style.display = "block";
        elements.mapTooltip.style.left = (e.clientX + window.scrollX + 15) + "px";
        elements.mapTooltip.style.top = (e.clientY + window.scrollY + 10) + "px";
        elements.mapTooltip.innerHTML = `<strong>${zoneName}</strong><br>Base Tiger Index: ${currentData.baseProd}`;
      });

      path.addEventListener("mouseleave", () => {
        elements.mapTooltip.style.display = "none";
      });

      // Click to select
      path.addEventListener("click", (e) => {
        elements.mapPaths.forEach(p => p.classList.remove("active"));
        e.currentTarget.classList.add("active");

        const zoneId = e.currentTarget.getAttribute("data-zone");
        const zoneName = zoneId.charAt(0).toUpperCase() + zoneId.slice(1) + (zoneId === "netidhopani" ? " Ruins" : (zoneId === "dobanki" ? " Canopy" : (zoneId === "sajnakhali" ? " Sanctuary" : " Camp")));
        displayZoneDetails(zoneName);
      });
    });
  }

  function displayZoneDetails(zoneName) {
    const data = zoneData[zoneName];
    if (!data) return;

    elements.zoneTitle.textContent = zoneName;
    elements.zoneType.textContent = zoneName.includes("Sanctuary") || zoneName.includes("Ruins") ? "Core Zone" : "Buffer Zone";
    elements.zoneDesc.textContent = data.desc;
    
    // Scale zone-specific tigers with active anti-poaching slider
    const patrols = parseInt(elements.sliderWater.value);
    const scaledTigers = Math.round(data.baseProd * (0.8 + (patrols / 100) * 0.45));
    elements.statTigers.textContent = scaledTigers;
    
    // Scale density with salinity slider
    const salinity = parseInt(elements.sliderIrrigation.value);
    const densityVal = Math.max(10, 85 - (salinity / 45) * 50);
    elements.statDensity.textContent = densityVal.toFixed(1) + "%";
    elements.statSpecies.textContent = data.species;
    
    if (elements.zonePlaceholder) {
      elements.zonePlaceholder.style.display = "none";
    }
    elements.zoneStatsContainer.style.display = "block";
  }

  // Preset configuration
  function setupScenarios() {
    if (elements.scenarioBaseline) {
      elements.scenarioBaseline.addEventListener("click", () => {
        setPreset(15, 10, 15, 20, 12, 5);
        highlightScenario(elements.scenarioBaseline);
      });
    }
    if (elements.scenarioLocal) {
      elements.scenarioLocal.addEventListener("click", () => {
        setPreset(85, 45, 65, 15, 10, 2);
        highlightScenario(elements.scenarioLocal);
      });
    }
    if (elements.scenarioExport) {
      elements.scenarioExport.addEventListener("click", () => {
        setPreset(40, 20, 30, 85, 18, 15);
        highlightScenario(elements.scenarioExport);
      });
    }
    if (elements.scenarioOptimum) {
      elements.scenarioOptimum.addEventListener("click", () => {
        setPreset(60, 60, 50, 45, 12, 5);
        highlightScenario(elements.scenarioOptimum);
      });
    }
  }

  function setPreset(patrols, replanting, incentives, visitorCap, salinity, seaLevel) {
    elements.sliderWater.value = patrols;
    elements.lblWater.textContent = patrols + "%";

    elements.sliderLand.value = replanting;
    elements.lblLand.textContent = replanting + "%";

    elements.sliderIntegrated.value = incentives;
    elements.lblIntegrated.textContent = incentives + "%";

    elements.sliderBreeds.value = visitorCap;
    elements.lblBreeds.textContent = visitorCap + "%";

    elements.sliderIrrigation.value = salinity;
    elements.lblIrrigation.textContent = salinity + " PPT";

    elements.sliderCold.value = seaLevel;
    elements.lblCold.textContent = "+" + seaLevel + " cm";

    runSimulation();
  }

  function highlightScenario(activeBtn) {
    clearScenarioActiveStates();
    activeBtn.classList.add("active");
  }

  function clearScenarioActiveStates() {
    if (elements.scenarioBaseline) elements.scenarioBaseline.classList.remove("active");
    if (elements.scenarioLocal) elements.scenarioLocal.classList.remove("active");
    if (elements.scenarioExport) elements.scenarioExport.classList.remove("active");
    if (elements.scenarioOptimum) elements.scenarioOptimum.classList.remove("active");
  }

  // Simulation calculations
  function runSimulation() {
    const patrols = parseInt(elements.sliderWater.value);
    const replanting = parseInt(elements.sliderLand.value);
    const incentives = parseInt(elements.sliderIntegrated.value);
    const visitorCap = parseInt(elements.sliderBreeds.value);
    const salinity = parseInt(elements.sliderIrrigation.value);
    const seaLevel = parseInt(elements.sliderCold.value);

    // 1. Forest Loss / Spoilage Math
    // Base loss rate 18%. Rises with salinity and seaLevel, reduced by replanting and incentives
    const lossRate = Math.max(1.8, 18.0 + (salinity / 45) * 15.0 + (seaLevel / 50) * 8.0 - (replanting / 100) * 12.0 - (incentives / 100) * 5.0);
    elements.spoilage.textContent = lossRate.toFixed(1) + "%";
    elements.spoilageBar.style.width = lossRate.toFixed(1) + "%";
    
    // 2. Patrol Speed & Cover / Logistics Efficiency Math
    // Base coverage 35%. Rises with patrols and community incentives
    const patrolCover = Math.min(98.0, 35.0 + (patrols / 100) * 45.0 + (incentives / 100) * 18.0);
    elements.efficiency.textContent = patrolCover.toFixed(1) + "%";
    elements.efficiencyBar.style.width = patrolCover.toFixed(1) + "%";

    // Speed up patrol dashes flow
    adjustLogisticsAnimationSpeed(patrols);

    // 3. Core KPIs Calculation
    // Tiger Index (Base 102). Rises with patrols and community protection, drops with high visitors/poaching
    const poachingRisk = Math.max(0.5, 45.0 - (patrols / 100) * 35.0 - (incentives / 100) * 10.0);
    const tigerIndex = Math.round(102 * (0.6 + (patrols / 100) * 0.45 + (incentives / 100) * 0.15 - (poachingRisk / 45) * 0.25));
    elements.kpiTigerPop.textContent = tigerIndex;
    elements.kpiPoaching.textContent = Math.round(poachingRisk) + " /yr";

    // Mangrove Cover
    const canopyCover = Math.max(20.0, 88.0 - (salinity / 45) * 35.0 - (seaLevel / 50) * 20.0 + (replanting / 100) * 28.0);
    elements.kpiCanopyCover.textContent = canopyCover.toFixed(1) + "%";

    // Ecotourism valuation
    const ecoVal = (1.2 + (visitorCap / 100) * 3.8) * 125 * (patrolCover / 100);
    elements.kpiEcoRevenue.textContent = "₹" + Math.round(ecoVal).toLocaleString() + " Cr";

    // 4. Secondary Livelihoods Splits
    // Honey yield (kg/day)
    const honeyYield = 280 + (canopyCover / 100) * 850;
    const honeyWax = honeyYield * 0.12;
    const honeyExport = honeyYield * 0.45;
    const honeyProfit = honeyYield * 280; // Value in ₹/day

    elements.dairyYieldMilk.textContent = Math.round(honeyYield).toLocaleString() + " kg/day";
    elements.dairyYieldChhurpi.textContent = Math.round(honeyWax).toLocaleString() + " kg/day";
    elements.dairyYieldGhee.textContent = Math.round(honeyExport).toLocaleString() + " kg/day";
    elements.dairyYieldPaneer.textContent = "₹" + Math.round(honeyProfit).toLocaleString() + "/day";

    // Sustainable Aquaculture (Crab & Shrimp)
    const crabTons = (45 + (incentives / 100) * 180) * (canopyCover / 100);
    const crabRevenue = crabTons * 4.5; // Lakhs
    const shrimpTons = (120 + (incentives / 100) * 250) * (canopyCover / 100);
    const shrimpRevenue = shrimpTons * 6.5;

    elements.piggeryYieldPork.textContent = Math.round(crabTons).toLocaleString() + " T/yr";
    elements.piggeryRevenuePork.textContent = "₹" + Math.round(crabRevenue).toLocaleString() + " L/yr";
    elements.goateryYieldMutton.textContent = Math.round(shrimpTons).toLocaleString() + " T/yr";
    elements.goateryRevenueMutton.textContent = "₹" + Math.round(shrimpRevenue).toLocaleString() + " L/yr";

    // Eco-tourism metrics
    const tourists = 0.5 + (visitorCap / 100) * 3.5;
    const touristRev = tourists * 45;
    const guides = Math.round(150 + (visitorCap / 100) * 450 + (incentives / 100) * 200);
    const campsRev = touristRev * 0.65;

    elements.tourismFootfall.textContent = tourists.toFixed(1) + " Million/yr";
    elements.tourismRevenue.textContent = "₹" + Math.round(touristRev).toLocaleString() + " Cr/yr";
    elements.tourismArtisans.textContent = guides + " Guides";
    elements.tourismCraftsRev.textContent = "₹" + Math.round(campsRev).toLocaleString() + " Cr/yr";

    // 5. Framework Statistics
    const boats = Math.round(6 + (patrols / 100) * 34);
    const jobCreation = 120 + (patrols / 100) * 220 + (incentives / 100) * 580;
    const carbonCredits = canopyCover * 2.8;
    const partnershipFunding = (incentives * 12 + replanting * 15);
    const budgetAllocation = (patrols * 8 + replanting * 18 + incentives * 10);

    if (elements.frameworkValInfra) elements.frameworkValInfra.textContent = boats + " Boats";
    if (elements.frameworkValJobs) elements.frameworkValJobs.textContent = Math.round(jobCreation) + " Families";
    if (elements.frameworkValExports) elements.frameworkValExports.textContent = "₹" + Math.round(carbonCredits) + " Cr";
    if (elements.frameworkValPpp) elements.frameworkValPpp.textContent = "₹" + Math.round(partnershipFunding).toLocaleString() + " L";
    if (elements.frameworkValTotalInv) elements.frameworkValTotalInv.textContent = "₹" + Math.round(budgetAllocation).toLocaleString() + " L";

    // Dynamic Chart updates
    updateChartsData(tigerIndex, canopyCover, salinity, patrols);
  }

  function adjustLogisticsAnimationSpeed(patrolsVal) {
    elements.logisticsPaths.forEach(path => {
      let duration = 4.0 - (patrolsVal / 100) * 3.7;
      path.style.animationDuration = duration.toFixed(2) + "s";
    });
  }

  function initCharts() {
    const ctxProd = document.getElementById("neProdChart");
    const ctxFarming = document.getElementById("neFarmingChart");
    
    if (!ctxProd || !ctxFarming) return;

    // Tiger vs Prey (Over 10 Years)
    charts.prod = new Chart(ctxProd, {
      type: "line",
      data: {
        labels: ["Yr 1", "Yr 2", "Yr 3", "Yr 4", "Yr 5", "Yr 6", "Yr 7", "Yr 8", "Yr 9", "Yr 10"],
        datasets: [
          {
            label: "Bengal Tiger Count",
            data: [95, 98, 102, 105, 110, 115, 120, 124, 128, 132],
            borderColor: "#ea580c",
            backgroundColor: "rgba(234, 88, 12, 0.15)",
            borderWidth: 2,
            tension: 0.35,
            fill: true
          },
          {
            label: "Spotted Deer Index (Prey)",
            data: [2500, 2400, 2420, 2450, 2480, 2520, 2600, 2650, 2700, 2720],
            borderColor: "#10b981",
            backgroundColor: "transparent",
            borderWidth: 1.5,
            tension: 0.35,
            yAxisID: "yPrey"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { color: "#9ca3af", font: { family: "Outfit", size: 9 } }
          },
          yPrey: {
            position: "right",
            grid: { drawOnChartArea: false },
            ticks: { color: "#9ca3af", font: { family: "Outfit", size: 9 } }
          },
          x: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { color: "#9ca3af", font: { family: "Outfit", size: 9 } }
          }
        },
        plugins: {
          legend: {
            labels: { color: "#9ca3af", font: { family: "Outfit", size: 10 } }
          }
        }
      }
    });

    // Mangrove Species Distribution
    charts.farming = new Chart(ctxFarming, {
      type: "bar",
      data: {
        labels: ["Sundari (Heritiera)", "Gewa (Excoecaria)", "Kankra (Bruguiera)", "Gororan (Ceriops)"],
        datasets: [{
          label: "Salt-tolerance Relative Index",
          data: [4.5, 6.8, 8.2, 9.5],
          backgroundColor: [
            "rgba(16, 185, 129, 0.65)", // Low tolerance
            "rgba(14, 165, 233, 0.65)",
            "rgba(139, 92, 246, 0.65)",
            "rgba(234, 88, 12, 0.65)"   // High tolerance
          ],
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { color: "#9ca3af", font: { family: "Outfit", size: 9 } }
          },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { color: "#9ca3af", font: { family: "Outfit", size: 9 } }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  function updateChartsData(tigerIndex, canopyCover, salinity, patrols) {
    if (!charts.prod || !charts.farming) return;

    // Calculate progression based on active policies
    let curTiger = Math.round(tigerIndex * 0.85);
    const tigerTrend = [];
    const deerTrend = [];
    
    for (let i = 0; i < 10; i++) {
      curTiger += Math.round((patrols - 25) * 0.08 + (replanting - salinity) * 0.02);
      tigerTrend.push(Math.max(50, curTiger));
      
      const deer = Math.round(2200 + curTiger * 1.5 + (replanting * 4.5));
      deerTrend.push(deer);
    }

    charts.prod.data.datasets[0].data = tigerTrend;
    charts.prod.data.datasets[1].data = deerTrend;

    // Species distribution varies with salinity levels
    // Sundari declines as salinity PPT goes above 12, others adjust
    const sundari = Math.max(0.5, 9.0 - (salinity / 45) * 8.5);
    const gewa = Math.max(1.5, 8.5 - (salinity / 45) * 3.5);
    const kankra = Math.min(10.0, 3.5 + (salinity / 45) * 5.5);
    const goran = Math.min(10.0, 2.0 + (salinity / 45) * 7.5);

    charts.farming.data.datasets[0].data = [
      parseFloat(sundari.toFixed(1)),
      parseFloat(gewa.toFixed(1)),
      parseFloat(kankra.toFixed(1)),
      parseFloat(goran.toFixed(1))
    ];

    charts.prod.update("none");
    charts.farming.update("none");
  }

  // Run on load
  document.addEventListener("DOMContentLoaded", init);

})();
