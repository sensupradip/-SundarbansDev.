# Dev Sundarbans - Delta & Tiger Conservation Dashboard

An immersive, premium-grade single-page dashboard designed to simulate and evaluate conservation policy models for the Sundarbans mangrove forest delta (West Bengal, India). 

This portal acts as a client-side interface integrating HTML5, CSS3, JavaScript, and Chart.js to monitor Bengal Tiger populations, mangrove canopy loss rates, salinity indicators, and community honey/crab harvesting yields in real-time.

## Features

- **Strategic Sliders**: Adjust parameters like Anti-Poaching Patrols, Mangrove Replanting, Community Incentives, Ecotourism Caps, Delta Salinity, and Sea-Level Offset to see dynamic model impacts.
- **Delta Zone Map**: Clickable pulsing radar hotspots (Sajnakhali, Sudhanyakhali, Dobanki, Netidhopani) highlighting local wildlife statistics, species mix, and canopy indices.
- **Population Trend Line Charts**: Visualizes a 10-year projected trend comparing the Bengal Tiger count and Spotted Deer index.
- **Species Distribution Bar Charts**: Compares the growth rate and salt-tolerance indices of key mangrove tree species (Sundari, Gewa, Kankra, Goran) under varying salinity inputs.
- **Supply Chain & Patrol flows**: Animated SVG pipelines representing active conservation patrols moving at speeds relative to anti-poaching settings.
- **Zero Dependencies**: Pure client-side code running instantly on any standard HTTP server.

## File Directory

```
dev-sundarbans/
├── index.html        # Main HTML layout, sliders, SVG maps & Canvas containers
├── style.css         # Responsive glassmorphism panels, HSL variables & keyframes
├── app.js            # Policy simulation logic, zone selectors & Chart.js instances
├── .gitignore        # Ignores IDE and operating system metadata
└── README.md         # Project documentation (this file)
```

## Running Locally

Because the dashboard fetches external resources and updates Chart.js canvases, it should be served via a lightweight HTTP server.

### Run with Python (Python 3+)
Execute this command inside the project directory:
```bash
python3 -m http.server 8080
```
Then navigate to `http://localhost:8080` in your web browser.
