# 🛰️ Satellite Monitor

Real-time satellite tracking system with 3D globe visualization powered by the N2YO API.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Three.js](https://img.shields.io/badge/Three.js-0.182-black?logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌍 **3D Globe** | Interactive Earth visualization with Three.js and React Three Fiber |
| 📡 **Real-time Tracking** | Track multiple satellites simultaneously with live orbit paths |
| 🔍 **Satellite Search** | Find satellites above your location by category |
| 👁️ **Visual Passes** | Predict when satellites will be visible from your location |
| 📻 **Radio Passes** | Plan radio communication windows with satellites |
| 📊 **TLE Data** | View Two-Line Element sets for orbital calculations |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- A free [N2YO API key](https://www.n2yo.com/api/)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/satellite-monitor.git
cd satellite-monitor

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and enter your API key in the dashboard to start tracking!

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint |

---

## 🔌 N2YO API Endpoints

This project integrates with the following [N2YO API](https://www.n2yo.com/api/) endpoints:

- **TLE** — Retrieve Two-Line Element sets for satellites
- **Positions** — Get real-time and predicted satellite positions
- **Visual Passes** — Predict optically visible satellite passes
- **Radio Passes** — Predict radio communication windows
- **Above** — Find all satellites above a given location

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) with App Router
- **3D Graphics:** [Three.js](https://threejs.org/) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Language:** TypeScript

---

## 📁 Project Structure

```
satellite-monitor/
├── public/
│   ├── *.glb          # 3D satellite models (ISS, Hubble, etc.)
│   └── earth-*.jpg    # Earth textures
├── src/
│   ├── app/
│   │   ├── api/satellite/   # N2YO API route handlers
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Globe.tsx        # 3D Earth visualization
│   │   ├── SatellitePanel.tsx
│   │   └── Sidebar.tsx
│   ├── lib/
│   │   └── n2yo.ts          # N2YO API client
│   └── store/
│       └── satellite-store.ts
└── package.json
```


<p align="center">
  Made with ❤️ by <b> Nsoro Allan. </b>
</p>
