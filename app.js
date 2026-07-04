/**
 * Project Development Sundarbans - Mangrove Restoration & Delta Resilience Simulation Model
 * Wrapped in an IIFE to protect scope and prevent naming collisions.
 */
(function() {
  // Zone description data for interactive map clicks
  const zoneDetails = {
    "sb-zone-inhabited": {
      title: "Inhabited Transition Zone",
      desc: "Home to over 4.5 million delta residents across islands like Sagar and Gosaba. This area faces immediate climate vulnerability from embankment breaches, storm surges, and groundwater salinization. Strategic priorities here focus on off-grid solar microgrid deployment, geotextile embankment reinforcement, and saline-resistant crop cultivation."
    },
    "sb-zone-buffer": {
      title: "Socio-Ecological Buffer Zone",
      desc: "A restricted entry zone characterized by intermediate mangrove density and tidal channels. It acts as a critical buffer between human settlements and the wild core. Development efforts here are focused on sustainable livelihood generation like community honey cooperatives and non-invasive crab fattening farms to prevent forest trespassing."
    },
    "sb-zone-core": {
      title: "Sundarbans Core Biosphere Reserve",
      desc: "A strictly protected sanctuary containing pristine mangrove forests and the primary habitat of the Royal Bengal Tiger. Crucial for massive carbon sequestration and storm wind attenuation. Policy goals emphasize strict smart conservation patrols, human-wildlife fences, and complete restoration of degraded forest margins."
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
      
      // Sliders
      sliderMangroves: document.getElementById("slider-sb-mangroves"),
      sliderEmbankments: document.getElementById("slider-sb-embankments"),
      sliderLivelihoods: document.getElementById("slider-sb-livelihoods"),
      sliderSolar: document.getElementById("slider-sb-solar"),
      sliderConservation: document.getElementById("slider-sb-conservation"),
      
      // Slider Labels
      lblMangroves: document.getElementById("lbl-sb-mangroves"),
      lblEmbankments: document.getElementById("lbl-sb-embankments"),
      lblLivelihoods: document.getElementById("lbl-sb-livelihoods"),
      lblSolar: document.getElementById("lbl-sb-solar"),
      lblConservation: document.getElementById("lbl-sb-conservation"),
      
      // Preset Buttons
      btnBaseline: document.getElementById("scenario-sb-baseline"),
      btnEcoFocus: document.getElementById("scenario-sb-eco-focus"),
      btnInfra: document.getElementById("scenario-sb-infrastructure"),
      btnBalanced: document.getElementById("scenario-sb-balanced"),
      
      // Map SVG Elements
      mapPaths: document.querySelectorAll(".sb-zone-path"),
      embankmentLeft: document.getElementById("sb-embankment-line-left"),
      embankmentRight: document.getElementById("sb-embankment-line-right"),
      solarNodes: [
        document.getElementById("sb-solar-node-1"),
        document.getElementById("sb-solar-node-2"),
        document.getElementById("sb-solar-node-3")
      ],
      mapTooltip: document.getElementById("sb-map-tooltip"),
      
      // Map Info Output
      zoneTitle: document.getElementById("sb-zone-title"),
      zoneDesc: document.getElementById("sb-zone-desc"),
      
      // Tabs
      tabButtons: document.querySelectorAll(".sb-tab-btn"),
      tabContents: document.querySelectorAll(".sb-tab-content"),
      
      // Impact Metric Values
      valCarbon: document.getElementById("impact-sb-carbon"),
      trendCarbon: document.getElementById("trend-sb-carbon"),
      valResilience: document.getElementById("impact-sb-resilience"),
      barResilience: document.getElementById("bar-sb-resilience"),
      trendResilience: document.getElementById("trend-sb-resilience"),
      valTigers: document.getElementById("impact-sb-tigers"),
      trendTigers: document.getElementById("trend-sb-tigers"),
      valLivelihoods: document.getElementById("impact-sb-livelihoods"),
      trendLivelihoods: document.getElementById("trend-sb-livelihoods"),
      valRevenue: document.getElementById("impact-sb-revenue"),
      trendRevenue: document.getElementById("trend-sb-revenue"),
      valSolar: document.getElementById("impact-sb-solar"),
      barSolar: document.getElementById("bar-sb-solar"),
      trendSolar: document.getElementById("trend-sb-solar"),
      
      // Showcase details values
      showcaseHoneyCollectors: document.getElementById("sb-honey-collectors"),
      showcaseHoneyYield: document.getElementById("sb-honey-yield"),
      showcaseHoneyPrice: document.getElementById("sb-honey-price"),
      showcaseCrabCoops: document.getElementById("sb-crab-coops"),
      showcaseCrabOutput: document.getElementById("sb-crab-output"),
      showcaseCrabRevenue: document.getElementById("sb-crab-revenue"),
      showcasePaddyArea: document.getElementById("sb-paddy-area"),
      showcasePaddyYield: document.getElementById("sb-paddy-yield"),
      showcasePaddyTolerance: document.getElementById("sb-paddy-tolerance")
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

    // Listen for tabChange custom events from main portal app.js
    window.addEventListener("tabChange", (e) => {
      if (e.detail.activeTab === "sundarbans") {
        setTimeout(() => {
          if (charts.resilience) charts.resilience.update();
          if (charts.species) charts.species.update();
        }, 100);
      }
    });
  }

  // Setup sliders event listeners
  function setupSliders() {
    const sliders = [
      { slider: elements.sliderMangroves, lbl: elements.lblMangroves, suffix: "%" },
      { slider: elements.sliderEmbankments, lbl: elements.lblEmbankments, suffix: "%" },
      { slider: elements.sliderLivelihoods, lbl: elements.lblLivelihoods, suffix: "%" },
      { slider: elements.sliderSolar, lbl: elements.lblSolar, suffix: "%" },
      { slider: elements.sliderConservation, lbl: elements.lblConservation, suffix: "%" }
    ];

    sliders.forEach(item => {
      if (item.slider) {
        item.slider.addEventListener("input", (e) => {
          item.lbl.textContent = e.target.value + item.suffix;
          runSimulation();
          clearScenarioActiveStates();
        });
      }
    });
  }

  // Setup Visualizer tab button controls
  function setupTabButtons() {
    elements.tabButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const activeTabId = e.currentTarget.getAttribute("aria-controls");
        
        elements.tabButtons.forEach(b => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        elements.tabContents.forEach(c => c.classList.remove("active"));
        
        e.currentTarget.classList.add("active");
        e.currentTarget.setAttribute("aria-selected", "true");
        
        const activeContent = document.getElementById(activeTabId);
        if (activeContent) {
          activeContent.classList.add("active");
        }
        
        // Trigger Chart updates
        if (activeTabId === "tab-sb-charts") {
          setTimeout(() => {
            if (charts.resilience) charts.resilience.update();
            if (charts.species) charts.species.update();
          }, 50);
        }
      });
    });
  }

  // Setup SVG map click and hover tooltips
  function setupMapInteractivity() {
    elements.mapPaths.forEach(path => {
      // Hover Tooltip
      path.addEventListener("mousemove", (e) => {
        const zoneId = e.currentTarget.getAttribute("id");
        const details = zoneDetails[zoneId];
        if (!details) return;

        elements.mapTooltip.style.display = "block";
        elements.mapTooltip.style.left = (e.clientX + window.scrollX - elements.section.getBoundingClientRect().left + 15) + "px";
        elements.mapTooltip.style.top = (e.clientY + window.scrollY - elements.section.getBoundingClientRect().top + 10) + "px";
        elements.mapTooltip.innerHTML = `<strong>${details.title}</strong><br><span style="font-size: 0.75rem; color: var(--text-secondary)">Click to inspect details</span>`;
      });

      path.addEventListener("mouseleave", () => {
        elements.mapTooltip.style.display = "none";
      });

      // Click to select
      path.addEventListener("click", (e) => {
        elements.mapPaths.forEach(p => p.classList.remove("active"));
        e.currentTarget.classList.add("active");

        const zoneId = e.currentTarget.getAttribute("id");
        const details = zoneDetails[zoneId];
        if (details) {
          elements.zoneTitle.textContent = details.title;
          elements.zoneDesc.textContent = details.desc;
        }
      });
    });
  }

  // Setup scenario presets
  function setupScenarios() {
    if (elements.btnBaseline) {
      elements.btnBaseline.addEventListener("click", () => {
        setPreset(10, 20, 15, 25, 20);
        highlightScenario(elements.btnBaseline);
      });
    }
    if (elements.btnEcoFocus) {
      elements.btnEcoFocus.addEventListener("click", () => {
        setPreset(85, 30, 45, 35, 90);
        highlightScenario(elements.btnEcoFocus);
      });
    }
    if (elements.btnInfra) {
      elements.btnInfra.addEventListener("click", () => {
        setPreset(20, 90, 30, 85, 40);
        highlightScenario(elements.btnInfra);
      });
    }
    if (elements.btnBalanced) {
      elements.btnBalanced.addEventListener("click", () => {
        setPreset(60, 65, 70, 75, 75);
        highlightScenario(elements.btnBalanced);
      });
    }
    
    // Set initial active class on baseline button
    if (elements.btnBaseline) elements.btnBaseline.classList.add("active");
  }

  function setPreset(mangroves, embankments, livelihoods, solar, conservation) {
    elements.sliderMangroves.value = mangroves;
    elements.lblMangroves.textContent = mangroves + "%";

    elements.sliderEmbankments.value = embankments;
    elements.lblEmbankments.textContent = embankments + "%";

    elements.sliderLivelihoods.value = livelihoods;
    elements.lblLivelihoods.textContent = livelihoods + "%";

    elements.sliderSolar.value = solar;
    elements.lblSolar.textContent = solar + "%";

    elements.sliderConservation.value = conservation;
    elements.lblConservation.textContent = conservation + "%";

    runSimulation();
  }

  function highlightScenario(activeBtn) {
    clearScenarioActiveStates();
    activeBtn.classList.add("active");
  }

  function clearScenarioActiveStates() {
    if (elements.btnBaseline) elements.btnBaseline.classList.remove("active");
    if (elements.btnEcoFocus) elements.btnEcoFocus.classList.remove("active");
    if (elements.btnInfra) elements.btnInfra.classList.remove("active");
    if (elements.btnBalanced) elements.btnBalanced.classList.remove("active");
  }

  // Simulation Engine Math
  function runSimulation() {
    const mangroves = parseInt(elements.sliderMangroves.value);
    const embankments = parseInt(elements.sliderEmbankments.value);
    const livelihoods = parseInt(elements.sliderLivelihoods.value);
    const solar = parseInt(elements.sliderSolar.value);
    const conservation = parseInt(elements.sliderConservation.value);

    // 1. Carbon Sequestration
    const carbonVal = 1.0 + (mangroves / 100) * 1.5;
    elements.valCarbon.textContent = carbonVal.toFixed(2) + " M T/yr";
    
    let carbonTrend = "Critical";
    if (carbonVal > 1.3) carbonTrend = "Improving";
    if (carbonVal > 2.0) carbonTrend = "Optimal";
    elements.trendCarbon.textContent = carbonTrend;
    elements.trendCarbon.className = "trend-badge " + (carbonTrend === "Critical" ? "badge-orange" : carbonTrend === "Improving" ? "badge-blue" : "badge-green");

    // 2. Resilience Index
    const resilienceVal = Math.min(98, 25 + (mangroves / 100) * 40 + (embankments / 100) * 33);
    elements.valResilience.textContent = Math.round(resilienceVal) + "%";
    elements.barResilience.style.width = resilienceVal + "%";

    let resilienceTrend = "Low Guard";
    if (resilienceVal > 45) resilienceTrend = "Moderate";
    if (resilienceVal > 75) resilienceTrend = "Highly Protected";
    elements.trendResilience.textContent = resilienceTrend;
    elements.trendResilience.className = "trend-badge " + (resilienceTrend === "Low Guard" ? "badge-orange" : resilienceTrend === "Moderate" ? "badge-blue" : "badge-green");

    // 3. Tiger Population
    const tigerImpact = Math.round(88 + (conservation / 100) * 22 + (mangroves / 100) * 12 - Math.max(0, (livelihoods - conservation) * 0.08));
    elements.valTigers.textContent = tigerImpact;

    let tigerTrend = "Vulnerable";
    if (tigerImpact > 90) tigerTrend = "Stable";
    if (tigerImpact > 105) tigerTrend = "Thriving";
    elements.trendTigers.textContent = tigerTrend;
    elements.trendTigers.className = "trend-badge " + (tigerTrend === "Vulnerable" ? "badge-orange" : tigerTrend === "Stable" ? "badge-blue" : "badge-green");

    // 4. Livelihoods Supported
    const livelihoodsVal = 0.5 + (livelihoods / 100) * 1.1 + (mangroves / 100) * 0.3;
    elements.valLivelihoods.textContent = livelihoodsVal.toFixed(2) + " Lakh";

    let livelihoodsTrend = "Restricted";
    if (livelihoodsVal > 0.8) livelihoodsTrend = "Growing";
    if (livelihoodsVal > 1.4) livelihoodsTrend = "Robust";
    elements.trendLivelihoods.textContent = livelihoodsTrend;
    elements.trendLivelihoods.className = "trend-badge " + (livelihoodsTrend === "Restricted" ? "badge-orange" : livelihoodsTrend === "Growing" ? "badge-blue" : "badge-green");

    // 5. Annual Eco-Revenue
    const revenueVal = 30 + (conservation / 100) * 18 + (livelihoods / 100) * 22 + (mangroves / 100) * 12;
    elements.valRevenue.textContent = "₹" + revenueVal.toFixed(1) + " Cr";

    let revenueTrend = "Underfunded";
    if (revenueVal > 45) revenueTrend = "Stable";
    if (revenueVal > 65) revenueTrend = "Prosperous";
    elements.trendRevenue.textContent = revenueTrend;
    elements.trendRevenue.className = "trend-badge " + (revenueTrend === "Underfunded" ? "badge-orange" : revenueTrend === "Stable" ? "badge-blue" : "badge-green");

    // 6. Clean Energy Coverage
    const energyVal = Math.min(99, 10 + (solar / 100) * 88);
    elements.valSolar.textContent = energyVal.toFixed(1) + "%";
    elements.barSolar.style.width = energyVal + "%";

    let energyTrend = "Unelectrified";
    if (energyVal > 30) energyTrend = "Transitioning";
    if (energyVal > 70) energyTrend = "Sustained Grid";
    elements.trendSolar.textContent = energyTrend;
    elements.trendSolar.className = "trend-badge " + (energyTrend === "Unelectrified" ? "badge-orange" : energyTrend === "Transitioning" ? "badge-blue" : "badge-green");

    // 7. Livelihood Showcase Details
    const honeyCollectors = Math.round(2500 + (livelihoods / 100) * 2200 + (conservation / 100) * 800);
    if (elements.showcaseHoneyCollectors) elements.showcaseHoneyCollectors.textContent = honeyCollectors.toLocaleString() + " Collectors";

    const honeyYield = Math.round(honeyCollectors * (0.025 + (mangroves / 100) * 0.018));
    if (elements.showcaseHoneyYield) elements.showcaseHoneyYield.textContent = honeyYield.toLocaleString() + " Metric Tonnes";

    const honeyPrice = Math.round(350 + (livelihoods / 100) * 180 + (conservation / 100) * 70);
    if (elements.showcaseHoneyPrice) elements.showcaseHoneyPrice.textContent = "₹" + honeyPrice + " / kg average";

    const crabCoops = Math.round(150 + (livelihoods / 100) * 280);
    if (elements.showcaseCrabCoops) elements.showcaseCrabCoops.textContent = crabCoops.toLocaleString() + "+ Small Groups";

    const crabOutput = (crabCoops * 0.063).toFixed(1);
    if (elements.showcaseCrabOutput) elements.showcaseCrabOutput.textContent = crabOutput + " Tonnes export-grade";

    const crabRevenue = Math.round(7500 + (livelihoods / 100) * 7500);
    if (elements.showcaseCrabRevenue) elements.showcaseCrabRevenue.textContent = "₹" + crabRevenue.toLocaleString() + " / month";

    const paddyArea = Math.round((6000 + (livelihoods / 100) * 9000) * (0.4 + (embankments / 100) * 0.6));
    if (elements.showcasePaddyArea) elements.showcasePaddyArea.textContent = paddyArea.toLocaleString() + " Hectares";

    const paddyYield = (1.8 + (livelihoods / 100) * 1.2).toFixed(1);
    if (elements.showcasePaddyYield) elements.showcasePaddyYield.textContent = paddyYield + " Tonnes / Hectare";

    const paddyTolerance = (8.0 + (livelihoods / 100) * 6.0).toFixed(1);
    if (elements.showcasePaddyTolerance) elements.showcasePaddyTolerance.textContent = "Up to " + paddyTolerance + " dS/m";

    // Dynamic SVG updates
    // Core mangrove greening
    const coreColorValue = Math.round(150 + (mangroves / 100) * 105);
    const bufferColorValue = Math.round(148 + (mangroves / 100) * 60);
    const coreZone = document.getElementById("sb-zone-core");
    const bufferZone = document.getElementById("sb-zone-buffer");
    if (coreZone) coreZone.style.fill = `rgb(5, ${coreColorValue}, 105)`;
    if (bufferZone) bufferZone.style.fill = `rgb(13, ${bufferColorValue}, 136)`;
    
    // Embankments visual thickness and color scaling
    const embStrokeColor = embankments > 70 ? "#10b981" : embankments > 40 ? "#fbbf24" : "#ef4444";
    const embStrokeWidth = 2 + (embankments / 100) * 6;
    if (elements.embankmentLeft) {
      elements.embankmentLeft.setAttribute("stroke", embStrokeColor);
      elements.embankmentLeft.setAttribute("stroke-width", embStrokeWidth);
      elements.embankmentLeft.style.strokeDasharray = embankments > 60 ? "none" : "8, 4";
    }
    if (elements.embankmentRight) {
      elements.embankmentRight.setAttribute("stroke", embStrokeColor);
      elements.embankmentRight.setAttribute("stroke-width", embStrokeWidth);
      elements.embankmentRight.style.strokeDasharray = embankments > 60 ? "none" : "8, 4";
    }

    // Solar microgrid nodes visibility
    elements.solarNodes.forEach(node => {
      if (node) {
        node.style.fillOpacity = 0.2 + (solar / 100) * 0.8;
        node.style.filter = solar > 50 ? "drop-shadow(0 0 4px #fbbf24)" : "none";
      }
    });

    // Update charts dynamically with new simulation inputs
    updateChartsData(resilienceVal, tigerImpact, mangroves, conservation);
  }

  // Initialize Chart.js
  function initCharts() {
    const ctxResilience = document.getElementById("sbResilienceChart");
    const ctxSpecies = document.getElementById("sbSpeciesChart");
    
    if (!ctxResilience || !ctxSpecies) return;

    // Resilience Line Chart
    charts.resilience = new Chart(ctxResilience, {
      type: "line",
      data: {
        labels: ["2026", "2027", "2028", "2029", "2030"],
        datasets: [
          {
            label: "Storm Resilience Index (%)",
            data: [25, 30, 35, 40, 45],
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.3
          },
          {
            label: "Flood Inundation Vulnerability (%)",
            data: [80, 75, 70, 65, 60],
            borderColor: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.05)",
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#9ca3af",
              font: { family: "Outfit", size: 9 }
            }
          }
        },
        scales: {
          x: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { color: "#9ca3af", font: { family: "Outfit", size: 9 } }
          },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { color: "#9ca3af", font: { family: "Outfit", size: 9 } },
            min: 0,
            max: 100
          }
        }
      }
    });

    // Species Bar Chart
    charts.species = new Chart(ctxSpecies, {
      type: "bar",
      data: {
        labels: ["Royal Bengal Tiger", "Estuarine Crocodile", "River Terrapin"],
        datasets: [{
          label: "Relative Population Index",
          data: [88, 80, 65],
          backgroundColor: [
            "rgba(245, 158, 11, 0.6)",  // Amber (Tiger)
            "rgba(16, 185, 129, 0.6)",  // Emerald (Crocodile)
            "rgba(6, 182, 212, 0.6)"    // Cyan (Terrapin)
          ],
          borderColor: [
            "#f59e0b",
            "#10b981",
            "#06b6d4"
          ],
          borderWidth: 1.5
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
            ticks: { color: "#9ca3af", font: { family: "Outfit", size: 9 } },
            min: 0,
            max: 150
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // Update dynamic datasets on the charts
  function updateChartsData(resilienceVal, tigerVal, mangroves, conservation) {
    if (!charts.resilience || !charts.species) return;

    // Resilience trend projections
    const resBase = resilienceVal;
    const resProj = [
      resBase * 0.7,
      resBase * 0.8,
      resBase * 0.9,
      resBase * 0.95,
      resBase
    ];
    const vulnProj = resProj.map(v => 100 - v);
    
    charts.resilience.data.datasets[0].data = resProj.map(v => parseFloat(v.toFixed(1)));
    charts.resilience.data.datasets[1].data = vulnProj.map(v => parseFloat(v.toFixed(1)));

    // Species scaling
    const crocVal = 80 + (mangroves / 100) * 35 + (conservation / 100) * 15;
    const terrapinVal = 65 + (mangroves / 100) * 45;

    charts.species.data.datasets[0].data = [
      tigerVal,
      parseFloat(crocVal.toFixed(1)),
      parseFloat(terrapinVal.toFixed(1))
    ];

    // Trigger charts draw
    charts.resilience.update("none");
    charts.species.update("none");
  }

  // Run on page load
  document.addEventListener("DOMContentLoaded", init);

})();
