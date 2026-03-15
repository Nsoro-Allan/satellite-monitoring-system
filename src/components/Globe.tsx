'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSatelliteStore } from '@/store/satellite-store';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Dynamically import Globe to avoid SSR issues
const GlobeComponent = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 gap-4">
      <div className="w-10 h-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      <p className="text-gray-400 text-sm">Loading Globe...</p>
    </div>
  ),
});

// Model cache
const modelCache: { [key: string]: THREE.Group } = {};
const loader = new GLTFLoader();

// Load and cache 3D models
const loadModel = (path: string): Promise<THREE.Group> => {
  if (modelCache[path]) {
    return Promise.resolve(modelCache[path].clone());
  }

  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (gltf) => {
        const model = gltf.scene;
        
        // Enhance materials for better visibility
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material) {
              const material = mesh.material as THREE.MeshStandardMaterial;
              material.emissive = new THREE.Color(0x88ddff);
              material.emissiveIntensity = 0.3;
              material.metalness = 0.8;
              material.roughness = 0.3;
              material.needsUpdate = true;
            }
          }
        });
        
        modelCache[path] = model;
        resolve(model.clone());
      },
      undefined,
      reject
    );
  });
};

// Determine which model to use based on satellite name
const getModelPath = (name: string): { path: string; scale: number } => {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('iss') || nameLower.includes('zarya') || 
      nameLower.includes('space station') || nameLower.includes('tiangong') ||
      nameLower.includes('tianhe')) {
    return { path: '/ISS.glb', scale: 0.8 };
  }
  
  if (nameLower.includes('hubble')) {
    return { path: '/Hubble.glb', scale: 0.8 };
  }
  
  return { path: '/satellite.glb', scale: 0.6 };
};

export default function Globe() {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [modelsLoaded, setModelsLoaded] = useState(false);
  
  const {
    satellitesAbove,
    trackedSatellites,
    observer,
    selectedSatellite,
    setSelectedSatellite,
    selectTrackedSatellite,
    showObserver,
    selectedOrbitPositions,
  } = useSatelliteStore();

  // Prepare 3D objects data (satellites) - MUST be before any conditional returns
  const satelliteObjects = useMemo(() => {
    const objects = [
      // Satellites from search results
      ...satellitesAbove.map(sat => ({
        lat: sat.satlat,
        lng: sat.satlng,
        alt: sat.satalt / 6371,
        name: sat.satname,
        id: sat.satid,
        color: '#4ecdc4',
        isSelected: selectedSatellite?.satid === sat.satid,
        type: 'search',
        modelInfo: getModelPath(sat.satname),
      })),
      // Tracked satellites
      ...trackedSatellites
        .filter(sat => sat.positions.length > 0)
        .map(sat => ({
          lat: sat.positions[0].satlatitude,
          lng: sat.positions[0].satlongitude,
          alt: sat.positions[0].sataltitude / 6371,
          name: sat.name,
          id: sat.id,
          color: sat.color,
          isSelected: selectedSatellite?.satid === sat.id,
          type: 'tracked',
          modelInfo: getModelPath(sat.name),
        })),
    ];
    
    return objects;
  }, [satellitesAbove, trackedSatellites, selectedSatellite]);

  // Observer marker as a simple object
  const observerObjects = useMemo(() => {
    if (!showObserver) return [];
    
    return [{
      lat: observer.lat,
      lng: observer.lng,
      alt: 0.001,
      name: '📍 You',
      id: -1,
      type: 'observer',
    }];
  }, [showObserver, observer]);

  // Prepare arcs data for selected satellite orbit (green line)
  const orbitArcs = useMemo(() => {
    if (selectedOrbitPositions.length < 2) return [];
    
    return selectedOrbitPositions.slice(0, -1).map((pos, i) => {
      const nextPos = selectedOrbitPositions[i + 1];
      // Check for date line crossing
      const lngDiff = Math.abs(nextPos.satlongitude - pos.satlongitude);
      if (lngDiff > 180) return null; // Skip segments that cross date line
      
      return {
        startLat: pos.satlatitude,
        startLng: pos.satlongitude,
        startAlt: pos.sataltitude / 6371,
        endLat: nextPos.satlatitude,
        endLng: nextPos.satlongitude,
        endAlt: nextPos.sataltitude / 6371,
        color: '#00ff00',
        stroke: 1.5,
      };
    }).filter(Boolean);
  }, [selectedOrbitPositions]);

  // Prepare arcs for tracked satellites
  const trackedArcs = useMemo(() => {
    return trackedSatellites.flatMap(sat => {
      if (sat.positions.length < 2) return [];
      
      return sat.positions.slice(0, -1).map((pos, i) => {
        const nextPos = sat.positions[i + 1];
        const lngDiff = Math.abs(nextPos.satlongitude - pos.satlongitude);
        if (lngDiff > 180) return null;
        
        return {
          startLat: pos.satlatitude,
          startLng: pos.satlongitude,
          startAlt: pos.sataltitude / 6371,
          endLat: nextPos.satlatitude,
          endLng: nextPos.satlongitude,
          endAlt: nextPos.sataltitude / 6371,
          color: sat.color,
          stroke: 1,
        };
      }).filter(Boolean);
    });
  }, [trackedSatellites]);

  const allArcs = [...orbitArcs, ...trackedArcs];

  // Effects AFTER all hooks
  useEffect(() => {
    setMounted(true);
    
    // Preload models
    Promise.all([
      loadModel('/satellite.glb'),
      loadModel('/ISS.glb'),
      loadModel('/Hubble.glb'),
    ]).then(() => {
      setModelsLoaded(true);
    }).catch(err => {
      console.error('Error loading models:', err);
      setModelsLoaded(true); // Continue anyway
    });
  }, []);

  // Handle container resize
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [mounted]);

  // Initialize globe view
  useEffect(() => {
    if (globeRef.current && mounted) {
      globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 0);
    }
  }, [mounted]);

  // Early return AFTER all hooks
  if (!mounted) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-slate-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full bg-gradient-to-b from-slate-900 to-black">
      {dimensions.width > 0 && dimensions.height > 0 && (
        <GlobeComponent
          ref={globeRef}
          
          // Use container dimensions
          width={dimensions.width}
          height={dimensions.height}
          
          // Use OpenStreetMap tiles for real map
          globeImageUrl={null}
          showGlobe={true}
          showAtmosphere={false}
          
          // OpenStreetMap tile engine
          globeTileEngineUrl={(x: number, y: number, l: number) => 
            `https://tile.openstreetmap.org/${l}/${x}/${y}.png`
          }
          
          // Background
          backgroundColor="#000011"
          
          // 3D Objects (Satellites with models)
          objectsData={satelliteObjects}
          objectLat="lat"
          objectLng="lng"
          objectAltitude="alt"
          objectLabel={(d: any) => `
            <div style="
              background: ${d.isSelected ? 'rgba(0, 150, 0, 0.95)' : 'rgba(17, 24, 39, 0.95)'};
              border: 2px solid ${d.isSelected ? '#00ff00' : '#06b6d4'};
              color: white;
              padding: 8px 12px;
              border-radius: 8px;
              font-size: 13px;
              line-height: 1.5;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            ">
              <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${d.name}</div>
              <div style="font-size: 11px; color: #d1d5db;">
                Altitude: ${Math.round(d.alt * 6371)} km
              </div>
              <div style="font-size: 10px; color: #9ca3af; margin-top: 2px;">
                Click to ${d.isSelected ? 'view details' : 'select'}
              </div>
            </div>
          `}
          objectThreeObject={(d: any) => {
            // Get camera distance for zoom-based scaling
            const cameraDistance = globeRef.current?.camera()?.position?.length() || 2.5;
            // Scale inversely with zoom (closer = smaller satellites)
            const zoomScale = Math.max(0.3, Math.min(1.5, cameraDistance / 2.5));
            
            const model = modelCache[d.modelInfo.path];
            if (!model) {
              // Fallback: simple sphere if model not loaded yet
              const geometry = new THREE.SphereGeometry(0.05 * zoomScale, 16, 16);
              const material = new THREE.MeshStandardMaterial({
                color: d.isSelected ? 0x00ff00 : 0x4ecdc4,
                emissive: d.isSelected ? 0x00ff00 : 0x4ecdc4,
                emissiveIntensity: 0.5,
                metalness: 0.8,
                roughness: 0.3,
              });
              return new THREE.Mesh(geometry, material);
            }
            
            const clone = model.clone();
            const finalScale = d.modelInfo.scale * zoomScale;
            clone.scale.set(finalScale, finalScale, finalScale);
            
            // Add glow effect for selected satellites
            if (d.isSelected) {
              clone.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                  const mesh = child as THREE.Mesh;
                  if (mesh.material) {
                    const mat = mesh.material as THREE.MeshStandardMaterial;
                    mat.emissive = new THREE.Color(0x00ff00);
                    mat.emissiveIntensity = 0.5;
                  }
                }
              });
            }
            
            return clone;
          }}
          onObjectClick={(obj: any) => {
            if (obj.type === 'search') {
              const sat = satellitesAbove.find(s => s.satid === obj.id);
              if (sat) setSelectedSatellite(sat);
            } else if (obj.type === 'tracked') {
              selectTrackedSatellite(obj.id);
            }
          }}
          
          // Observer marker (simple HTML marker)
          htmlElementsData={observerObjects}
          htmlLat="lat"
          htmlLng="lng"
          htmlAltitude="alt"
          htmlElement={(d: any) => {
            const el = document.createElement('div');
            el.innerHTML = `
              <div style="
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
                border: 2px solid white;
                white-space: nowrap;
                cursor: default;
              ">
                📍 Your Location
              </div>
            `;
            return el;
          }}
          
          // Arcs (orbital paths)
          arcsData={allArcs}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcStartAlt="startAlt"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcEndAlt="endAlt"
          arcColor="color"
          arcStroke={(d: any) => d.stroke || 1}
          arcDashLength={1}
          arcDashGap={0}
          arcDashAnimateTime={0}
          arcAltitudeAutoScale={0.3}
          
          // Controls
          enablePointerInteraction={true}
          
          // Performance
          waitForGlobeReady={true}
          animateIn={true}
        />
      )}
    </div>
  );
}
