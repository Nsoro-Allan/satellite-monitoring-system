# 🛰️ Satellite Monitoring System

Real-time satellite tracking application with interactive 3D globe visualization powered by the N2YO API.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Three.js](https://img.shields.io/badge/Three.js-0.182-black?logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌍 **3D Globe** | Interactive Earth with OpenStreetMap tiles using react-globe.gl |
| 📡 **Real-time Tracking** | Track multiple satellites with live position updates every 5 seconds |
| 🛰️ **3D Models** | Custom 3D models for ISS, Hubble, and generic satellites with zoom-adaptive scaling |
| 🔍 **Multi-Search** | Search by name, browse by category, or filter by region |
| 🌐 **Region Filter** | Find satellites over entire continents or countries (195 countries supported) |
| 📍 **Geolocation** | Auto-detect your location or manually set coordinates |
| 👁️ **Visual Passes** | Predict when satellites will be visible from your location |
| 📻 **Radio Passes** | Plan radio communication windows with satellites |
| 📊 **TLE Data** | View Two-Line Element sets for orbital calculations |
| 🎨 **Orbit Visualization** | Green orbit paths for selected satellites, colored trails for tracked ones |
| ⚡ **Quick Track** | One-click tracking for popular satellites (ISS, Hubble, Starlink, etc.) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A free [N2YO API key](https://www.n2yo.com/api/)

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

### First-Time Setup

1. The app will automatically request your location permission on first load
2. Enter your N2YO API key in the sidebar (Settings section)
3. Choose a search method:
   - Browse by category (e.g., All, Starlink, ISS, Amateur Radio)
   - Search by satellite name (e.g., "ISS", "Hubble")
   - Filter by region (continent or country)
4. Click any satellite to view details and track its orbit

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on http://localhost:3000 |
| `npm run build` | Build optimized production bundle |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint for code quality checks |

---

## 🎮 Usage Guide

**Searching for Satellites:**
- Use "Browse Above You" to find satellites by category within a radius
- Use "Search Satellite" to find specific satellites by name
- Use "Region Filter" to search across entire continents or countries

**Tracking Satellites:**
- Click any satellite on the globe to view details
- Click "Track" button to add it to your tracked list
- Tracked satellites update positions every 5 seconds
- Each tracked satellite gets a unique color for its orbit trail

**Viewing Details:**
- Info tab: Position, altitude, NORAD ID, launch date, satellite type
- Visual tab: Upcoming visible passes with azimuth and elevation
- Radio tab: Radio communication windows
- TLE tab: Two-Line Element orbital data

**Controls:**
- Drag to rotate the globe
- Scroll to zoom in/out
- Click satellites to select them
- Toggle "Show on globe" to display your location marker

---

## 🎯 How It Works

1. **Enter API Key** — Get a free key from [N2YO](https://www.n2yo.com/api/) and save it in the sidebar
2. **Set Location** — Use auto-detect or manually enter your coordinates
3. **Search Satellites** — Browse by category, search by name, or filter by region
4. **Track & Visualize** — Click any satellite to see details and track its orbit in real-time
5. **Plan Observations** — View visual and radio pass predictions for optimal viewing times

## 🔌 N2YO API Integration

This project uses the following [N2YO API](https://www.n2yo.com/api/) endpoints via Next.js API routes:

- `/api/satellite/above` — Find all satellites above a location
- `/api/satellite/positions` — Get real-time and predicted satellite positions
- `/api/satellite/visualpasses` — Predict optically visible satellite passes
- `/api/satellite/radiopasses` — Predict radio communication windows
- `/api/satellite/tle` — Retrieve Two-Line Element sets

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) with App Router
- **3D Visualization:** [react-globe.gl](https://github.com/vasturiano/react-globe.gl) + [Three.js](https://threejs.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) with persistence
- **Icons:** [Lucide React](https://lucide.dev/)
- **Language:** TypeScript
- **Map Tiles:** OpenStreetMap

---

## 📁 Project Structure

```
satellite-monitoring-system/
├── public/
│   ├── ISS.glb              # ISS 3D model
│   ├── Hubble.glb           # Hubble telescope model
│   ├── satellite.glb        # Generic satellite model
│   └── earth-daylight.jpg   # Earth texture (unused - using OSM tiles)
├── src/
│   ├── app/
│   │   ├── api/satellite/   # N2YO API proxy routes
│   │   │   ├── above/       # Find satellites above location
│   │   │   ├── positions/   # Get satellite positions
│   │   │   ├── visualpasses/# Visual pass predictions
│   │   │   ├── radiopasses/ # Radio pass predictions
│   │   │   └── tle/         # TLE data retrieval
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Main page with globe and sidebar
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── Globe.tsx        # 3D Earth with satellites and orbits
│   │   ├── SatellitePanel.tsx # Satellite details panel
│   │   └── Sidebar.tsx      # Control panel with search and settings
│   ├── lib/
│   │   ├── n2yo.ts          # N2YO API client and types
│   │   └── regions.ts       # 195 countries + 7 continents with sampling points
│   └── store/
│       └── satellite-store.ts # Zustand store with persistence
└── package.json
```

---

## 🎨 Key Components

**Globe.tsx**
- Renders 3D Earth using react-globe.gl with OpenStreetMap tiles
- Displays satellites as 3D models (ISS, Hubble, generic) with zoom-adaptive scaling
- Shows orbit paths as colored arcs (green for selected, custom colors for tracked)
- Handles satellite selection and click interactions

**Sidebar.tsx**
- Collapsible sections for API key, location, search, and filters
- Three search modes: by name, by category, by region
- Quick track buttons for popular satellites (ISS, Hubble, etc.)
- Displays tracked satellites with color indicators

**SatellitePanel.tsx**
- Shows detailed info for selected satellites
- Tabs for Info, Visual Passes, Radio Passes, and TLE data
- Displays satellite type, operator, and launch information
- Track button to add satellites to real-time tracking

**satellite-store.ts**
- Zustand store with localStorage persistence
- Manages API key, observer location, search results, and tracked satellites
- Updates tracked satellite positions every 5 seconds
- Handles region filtering state

---

## 🌐 Region Filtering

The region filter allows you to find satellites over entire continents or countries:

- **7 Continents:** Africa, Asia, Europe, North America, South America, Oceania, Antarctica
- **195 Countries:** All UN-recognized countries with capital city sampling points
- Uses multiple sampling points per region for comprehensive coverage
- Maximum 90° search radius for wide-area searches

## 🔧 Configuration

**API Key Storage:**
- API keys are stored in browser localStorage via Zustand persistence
- Keys persist across sessions but are never sent to any server except N2YO

**State Persistence:**
- Observer location, search radius, category selection
- Tracked satellites and their positions
- Region filter settings
- All stored locally in browser

---

## 🚧 Known Limitations

- N2YO API has rate limits (check your plan at n2yo.com)
- Satellite positions update every 5 seconds (not real-time millisecond precision)
- Region searches may take longer due to multiple API calls
- 3D models require WebGL support in browser

---


<p align="center">
  Made with ❤️ by <b>Nsoro Allan</b>
</p>
