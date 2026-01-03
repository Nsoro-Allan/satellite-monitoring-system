# Satellite Monitor

Real-time satellite tracking system with 3D globe visualization using the N2YO API.

## Features

- **3D Globe Visualization**: Interactive Earth globe with Three.js showing satellite positions
- **Real-time Tracking**: Track multiple satellites simultaneously with orbit visualization
- **Satellite Search**: Find satellites above your location by category
- **Visual Passes**: Predict when satellites will be visible from your location
- **Radio Passes**: Plan radio communication windows with satellites
- **TLE Data**: View Two-Line Element sets for orbital calculations

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Get your free N2YO API key at [n2yo.com/api](https://www.n2yo.com/api/)

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) and enter your API key in the dashboard

## N2YO API Features Used

- **TLE**: Retrieve Two Line Elements for satellites
- **Positions**: Get real-time and predicted satellite positions
- **Visual Passes**: Predict optically visible satellite passes
- **Radio Passes**: Predict radio communication windows
- **Above**: Find all satellites above a location

## Tech Stack

- Next.js 15 with App Router
- Three.js with React Three Fiber
- Tailwind CSS
- Zustand for state management
- TypeScript
