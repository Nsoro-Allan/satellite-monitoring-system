# 🛰️ Satellite Monitoring System

Real-time satellite tracking application with interactive 3D globe visualization powered by the N2YO API. Track satellites worldwide with live position updates, orbit visualization, and pass predictions.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![Three.js](https://img.shields.io/badge/Three.js-0.182-black?logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Zustand](https://img.shields.io/badge/Zustand-5.0-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌍 **3D Globe** | Interactive Earth with dual map views using react-globe.gl and Three.js |
| 🗺️ **Dual Map Views** | Toggle between street map (OpenStreetMap) and satellite imagery (Google Hybrid) with labels |
| 📡 **Real-time Tracking** | Track multiple satellites simultaneously with live position updates every 5 seconds |
| 🛰️ **3D Models** | Custom GLB models for ISS, Hubble Space Telescope, and generic satellites with zoom-adaptive scaling |
| 🔍 **Multi-Search** | Three search modes: by name, by category (52+ categories), or by region |
| 🌐 **Region Filter** | Find satellites over entire continents (7) or countries (195) with multi-point sampling |
| 📍 **Geolocation** | Auto-detect your location or manually set observer coordinates |
| 👁️ **Visual Passes** | Predict when satellites will be optically visible from your location with azimuth/elevation data |
| 📻 **Radio Passes** | Plan radio communication windows with minimum elevation filtering |
| 📊 **TLE Data** | View Two-Line Element sets for precise orbital calculations |
| 🎨 **Orbit Visualization** | Green orbit paths for selected satellites, colored historical trails for tracked ones (up to 300 points) |
| ⚡ **Quick Track** | One-click tracking for popular satellites (ISS, Hubble, Starlink, Tiangong, Terra, Aqua) |
| 💾 **State Persistence** | All settings, tracked satellites, and preferences saved in browser localStorage |
| 📊 **Live Stats Bar** | Real-time display of visible satellites, tracked satellites, and active region filter |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A free [N2YO API key](https://www.n2yo.com/api/)
- Modern browser with WebGL support

### Installation

```bash
# Clone the repository
git clone https://github.com/Nsoro-Allan/satellite-monitoring-system.git
cd satellite-monitoring-system

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### First-Time Setup

1. The app will automatically request your location permission on first load
2. Enter your N2YO API key in the sidebar (API Key section) - it's stored securely in your browser
3. Adjust your observer location if needed (auto-detected or manual entry)
4. Choose a search method:
   - **Browse Above You:** Find satellites by category within a custom radius (0-90°)
   - **Search Satellite:** Find specific satellites by name (e.g., "ISS", "Hubble", "Starlink")
   - **Region Filter:** Search across entire continents or countries using multi-point sampling
5. Click any satellite marker on the globe to view details and track its orbit

## 🎮 Usage Guide

**Map Views:**
- Toggle between Street (OpenStreetMap) and Satellite (Google Hybrid) views
- Both views include labels for better geographic context
- Preference is saved automatically in localStorage

**Searching for Satellites:**
- **Browse Above You:** Select from 52+ categories (All, Starlink, ISS, Weather, Amateur Radio, etc.) with adjustable search radius
- **Search Satellite:** Enter satellite name for direct lookup
- **Region Filter:** Choose from 7 continents or 195 countries for wide-area searches (uses 90° radius with multiple sampling points)

**Tracking Satellites:**
- Click any satellite marker on the globe to view its details panel
- Click "Track" button to add it to your tracked list (up to 8 simultaneous)
- Tracked satellites update positions every 5 seconds automatically
- Each tracked satellite gets a unique color for its orbit trail
- Historical trails show up to 300 position points for smooth visualization
- Use "Quick Track" buttons for instant tracking of popular satellites

**Viewing Details:**
- **Info tab:** Real-time position, altitude, velocity, NORAD ID, launch date, satellite type, and operator
- **Visual tab:** Upcoming visible passes with start/max/end times, azimuth, elevation, and magnitude
- **Radio tab:** Radio communication windows with azimuth and elevation data
- **TLE tab:** Two-Line Element orbital data for precise calculations

**Controls:**
- Drag to rotate the globe
- Scroll to zoom in/out (satellite models scale adaptively)
- Click satellites to select and view details
- Toggle "Show on globe" to display/hide your observer location marker
- Live stats bar shows: active region, visible satellites count, and tracked satellites count

---

## 🎯 How It Works

1. **Enter API Key** — Get a free key from [N2YO](https://www.n2yo.com/api/) and save it in the sidebar (stored securely in localStorage)
2. **Set Location** — Use auto-detect geolocation or manually enter your coordinates (lat/lng/alt)
3. **Choose Map View** — Toggle between Street (OpenStreetMap) or Satellite (Google Hybrid) view
4. **Search Satellites** — Browse by category (52+ options), search by name, or filter by region (7 continents + 195 countries)
5. **Track & Visualize** — Click any satellite marker to see details and track its orbit in real-time with colored trails
6. **Plan Observations** — View visual and radio pass predictions with azimuth/elevation data for optimal viewing times
7. **Monitor Live** — Watch the stats bar for real-time counts of visible and tracked satellites

## 🔌 N2YO API Integration

This project uses the following [N2YO API](https://www.n2yo.com/api/) endpoints via Next.js API routes:

| Endpoint | Purpose | Parameters |
|----------|---------|------------|
| `/api/satellite/above` | Find all satellites above a location | lat, lng, alt, radius, category, apiKey |
| `/api/satellite/positions` | Get real-time and predicted positions | satId, lat, lng, alt, seconds, apiKey |
| `/api/satellite/visualpasses` | Predict optically visible passes | satId, lat, lng, alt, days, minVisibility, apiKey |
| `/api/satellite/radiopasses` | Predict radio communication windows | satId, lat, lng, alt, days, minElevation, apiKey |
| `/api/satellite/tle` | Retrieve Two-Line Element sets | satId, apiKey |

**Supported Categories (52+):**
All, Brightest, ISS, Weather, NOAA, GOES, Earth Resources, Search & Rescue, Disaster Monitoring, Geostationary, Intelsat, Gorizont, Raduga, Molniya, Iridium, Orbcomm, Globalstar, Amateur Radio, GPS Operational, Glonass Operational, Galileo, Beidou, SBAS, NNSS, Russian LEO Navigation, Space & Earth Science, Engineering, Military, CubeSats, XM and Sirius, TV, Radar Calibration, Geodetic, TDRSS, Starlink, OneWeb, and more.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16.1](https://nextjs.org/) with App Router and React Server Components
- **UI Library:** [React 19.2](https://react.dev/) with client-side rendering for 3D components
- **3D Visualization:** [react-globe.gl 2.37](https://github.com/vasturiano/react-globe.gl) + [Three.js 0.182](https://threejs.org/)
- **3D Rendering:** [@react-three/fiber 9.5](https://docs.pmnd.rs/react-three-fiber) + [@react-three/drei 10.7](https://github.com/pmndrs/drei)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) with PostCSS
- **State Management:** [Zustand 5.0](https://zustand-demo.pmnd.rs/) with localStorage persistence middleware
- **Icons:** [Lucide React 0.562](https://lucide.dev/)
- **Language:** TypeScript 5
- **Map Tiles:** 
  - Street View: OpenStreetMap with labels
  - Satellite View: Google Hybrid (satellite imagery with labels)
- **API:** [N2YO REST API v1](https://www.n2yo.com/api/) for satellite data

---

## 🛰️ 3D Satellite Models

The application uses custom GLB (GL Transmission Format Binary) models for realistic satellite visualization:

- **ISS.glb** — International Space Station model with solar panels and modules
- **Hubble.glb** — Hubble Space Telescope with distinctive cylindrical body
- **satellite.glb** — Generic satellite model for all other satellites

**Model Features:**
- Zoom-adaptive scaling: Models scale based on camera distance for optimal visibility
- Automatic model selection: ISS and Hubble get their specific models, others use generic
- Efficient loading: Models are cached after first load for better performance
- Three.js integration: Loaded via GLTFLoader and rendered with @react-three/fiber

---

## 📁 Project Structure

```
satellite-monitoring-system/
├── public/
│   ├── ISS.glb              # International Space Station 3D model
│   ├── Hubble.glb           # Hubble Space Telescope 3D model
│   ├── satellite.glb        # Generic satellite 3D model
│   ├── earth-daylight.jpg   # Earth texture (unused - using map tiles)
│   └── *.svg                # UI icons and logos
├── src/
│   ├── app/
│   │   ├── api/satellite/   # N2YO API proxy routes (Next.js API routes)
│   │   │   ├── above/route.ts       # Find satellites above location
│   │   │   ├── positions/route.ts   # Get satellite positions
│   │   │   ├── visualpasses/route.ts # Visual pass predictions
│   │   │   ├── radiopasses/route.ts  # Radio pass predictions
│   │   │   └── tle/route.ts         # TLE data retrieval
│   │   ├── layout.tsx       # Root layout with metadata
│   │   ├── page.tsx         # Main page with Globe, Sidebar, and StatsBar
│   │   └── globals.css      # Global Tailwind styles
│   ├── components/
│   │   ├── Globe.tsx        # 3D Earth with satellites, orbits, and map tiles
│   │   ├── Globe.old.tsx    # Legacy Globe implementation (unused)
│   │   ├── SatellitePanel.tsx # Satellite details panel with tabs
│   │   └── Sidebar.tsx      # Control panel with search, settings, and tracking
│   ├── lib/
│   │   ├── n2yo.ts          # N2YO API client, types, and category definitions
│   │   └── regions.ts       # 195 countries + 7 continents with sampling points
│   └── store/
│       └── satellite-store.ts # Zustand store with localStorage persistence
├── .next/                   # Next.js build output
├── node_modules/            # Dependencies
├── eslint.config.mjs        # ESLint configuration
├── next.config.ts           # Next.js configuration
├── postcss.config.mjs       # PostCSS configuration for Tailwind
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies and scripts
```

---

## 🎨 Key Components

**Globe.tsx**
- Renders interactive 3D Earth using react-globe.gl with Three.js backend
- Dual map views: OpenStreetMap (street) and Google Hybrid (satellite with labels)
- Optimized tile loading with reduced resolution (512px) for faster performance
- Displays satellites as 3D GLB models (ISS.glb, Hubble.glb, satellite.glb) with zoom-adaptive scaling
- Shows orbit paths as colored arcs:
  - Green for selected satellite's predicted orbit
  - Custom colors for tracked satellites' historical trails (up to 300 points)
- Handles satellite selection via click interactions
- Dynamic model loading with caching for performance

**Sidebar.tsx**
- Collapsible sections with smooth animations
- **Map View Toggle:** Switch between street and satellite imagery
- **API Key Section:** Secure input for N2YO API key (stored in localStorage)
- **Observer Location:** Auto-detect via geolocation API or manual lat/lng/alt entry with "Show on globe" toggle
- **Search Modes:**
  - Browse Above You: Category dropdown (52+ categories) + radius slider (0-90°)
  - Search Satellite: Name-based search input
  - Region Filter: Continent/country dropdown (7 continents + 195 countries)
- **Quick Track Buttons:** One-click tracking for ISS, Hubble, Starlink, Tiangong, Terra, Aqua
- **Tracked Satellites List:** Shows all tracked satellites with color indicators and remove buttons
- **System Status:** Displays API key status, observer location, and search radius

**SatellitePanel.tsx**
- Slide-in panel for selected satellite details
- **Info Tab:** 
  - Real-time position (lat/lng), altitude, azimuth, elevation
  - NORAD ID, international designator, launch date
  - Satellite type detection (ISS, Space Station, Telescope, Weather, Navigation, etc.)
  - Operator/owner identification based on name patterns
  - Track button to add to tracked list
- **Visual Passes Tab:** Upcoming optically visible passes with start/max/end times, azimuth, elevation, magnitude, and duration
- **Radio Passes Tab:** Radio communication windows with azimuth and elevation data
- **TLE Tab:** Two-Line Element sets for orbital calculations
- Automatic data fetching when satellite is selected

**satellite-store.ts (Zustand Store)**
- Centralized state management with localStorage persistence
- **Persisted State:**
  - API key (encrypted in browser storage)
  - Observer location (lat, lng, alt)
  - Show observer toggle
  - Search radius and category ID
  - Tracked satellites with positions and colors
  - Selected region and region filter enabled flag
  - Map view preference (street/satellite)
- **Runtime State:**
  - Satellites above (search results)
  - Selected satellite and orbit positions
  - Loading state
- **Tracked Satellite Management:**
  - Automatic color assignment (8 colors cycling)
  - Historical position accumulation (max 300 points)
  - Position updates every 5 seconds
  - Duplicate prevention by satellite ID

---

## 🌐 Region Filtering

The region filter allows you to find satellites over entire continents or countries using intelligent multi-point sampling:

- **7 Continents:** Africa, Asia, Europe, North America, South America, Oceania, Antarctica
- **195 Countries:** All UN-recognized countries with capital city coordinates as sampling points
- **Multi-Point Sampling:** Each region uses multiple geographic points to ensure comprehensive coverage
- **Wide-Area Search:** Uses maximum 90° search radius for each sampling point
- **Duplicate Removal:** Automatically deduplicates satellites found across multiple sampling points
- **Performance:** Parallel API calls for faster results across multiple points

Example: Searching "North America" will sample multiple points across the continent and combine results, showing all satellites visible from anywhere in North America.

## 🔧 Configuration

**API Key Storage:**
- API keys are stored in browser localStorage via Zustand persistence middleware
- Keys persist across browser sessions
- Keys are only sent to N2YO API endpoints (never to any other server)
- Stored securely in the browser's origin-isolated storage

**State Persistence:**
The following state is automatically saved to localStorage:
- N2YO API key
- Observer location (latitude, longitude, altitude)
- Show observer toggle state
- Search radius and category selection
- Tracked satellites list with positions and colors
- Selected region and region filter enabled flag
- Map view preference (street/satellite)

**Non-Persisted State:**
- Search results (satellites above)
- Selected satellite details
- Loading states
- Orbit positions (fetched on-demand)

---

## ⚡ Performance Optimizations

- **Dynamic Imports:** Globe component loaded dynamically with SSR disabled for faster initial page load
- **Tile Resolution:** Map tiles reduced to 512px for faster loading without sacrificing quality
- **Model Caching:** 3D GLB models cached after first load to prevent redundant fetches
- **Position Throttling:** Historical trail points limited to 300 per satellite with 0.05° threshold
- **Parallel API Calls:** Region searches use Promise.all for concurrent API requests
- **State Persistence:** Zustand middleware persists only essential state to localStorage
- **Lazy Loading:** Satellite details fetched on-demand when selected
- **Debounced Updates:** Position updates batched every 5 seconds instead of continuous polling

---

## 🚧 Known Limitations

- **API Rate Limits:** N2YO API has rate limits based on your plan (check at n2yo.com)
- **Update Frequency:** Satellite positions update every 5 seconds (not real-time millisecond precision)
- **Region Search Performance:** Region searches may take longer due to multiple parallel API calls
- **Browser Requirements:** 
  - WebGL support required for 3D rendering
  - Modern browser with ES6+ support
  - localStorage enabled for state persistence
- **Trail Length:** Historical trails limited to 300 points per satellite for performance
- **Concurrent Tracking:** Color palette supports 8 unique colors (cycles after 8 tracked satellites)
- **Mobile Support:** Sidebar hidden on mobile devices (responsive improvements needed)

---

## 🔧 Troubleshooting

**Globe not loading:**
- Ensure WebGL is enabled in your browser
- Check browser console for errors
- Try disabling browser extensions that might block WebGL

**No satellites showing:**
- Verify your N2YO API key is correct
- Check if you've exceeded API rate limits
- Ensure observer location is set correctly
- Try increasing search radius

**Tracking not updating:**
- Check browser console for API errors
- Verify API key is still valid
- Ensure you haven't exceeded rate limits
- Try removing and re-adding the satellite

**Performance issues:**
- Reduce number of tracked satellites (max 8 recommended)
- Clear browser cache and localStorage
- Close other browser tabs using WebGL
- Try reducing search radius for fewer satellites

---

## 🙏 Acknowledgments

- [N2YO](https://www.n2yo.com/) for providing the satellite tracking API
- [react-globe.gl](https://github.com/vasturiano/react-globe.gl) for the amazing 3D globe component
- [OpenStreetMap](https://www.openstreetmap.org/) for street map tiles
- [Three.js](https://threejs.org/) for 3D rendering capabilities

---

<p align="center">
  Made with ❤️ by <b>Nsoro Allan</b>
</p>

