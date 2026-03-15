'use client';

import { useRef, useMemo, useEffect, useState, Suspense, createContext, useContext } from 'react';
import { Canvas, useFrame, useLoader, ThreeEvent, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Stars, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useSatelliteStore } from '@/store/satellite-store';

// Context to share camera distance across components
const CameraDistanceContext = createContext<number>(5.5);

function CameraDistanceProvider({ children }: { children: React.ReactNode }) {
  const { camera } = useThree();
  const [distance, setDistance] = useState(5.5);
  
  useFrame(() => {
    const newDistance = camera.position.length();
    if (Math.abs(newDistance - distance) > 0.1) {
      setDistance(newDistance);
    }
  });
  
  return (
    <CameraDistanceContext.Provider value={distance}>
      {children}
    </CameraDistanceContext.Provider>
  );
}

function useCameraDistance() {
  return useContext(CameraDistanceContext);
}

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, '/earth-daylight.jpg');
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      <mesh scale={[1.015, 1.015, 1.015]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#87CEEB" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

// GLB Model Loader for satellites
function SatelliteGLB({ modelPath, scale }: { modelPath: string; scale: number }) {
  const { scene } = useGLTF(modelPath);
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    // Enhance materials for better visibility
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const material = mesh.material as THREE.MeshStandardMaterial;
          // Add emissive glow to make satellites more visible (doesn't cast light)
          material.emissive = new THREE.Color(0x88ddff);
          material.emissiveIntensity = 0.5;
          // Increase brightness without casting light
          material.metalness = 0.8;
          material.roughness = 0.3;
          material.needsUpdate = true;
        }
      }
    });
    return clone;
  }, [scene]);

  return <primitive object={clonedScene} scale={scale} />;
}

// Fallback satellite model
function SimpleSatelliteModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={groupRef} scale={[0.015, 0.015, 0.015]}>
      {/* Main body */}
      <mesh>
        <boxGeometry args={[1, 0.6, 0.5]} />
        <meshStandardMaterial color="#cccccc" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Solar panels */}
      <mesh position={[-1.3, 0, 0]}>
        <boxGeometry args={[1.8, 0.04, 0.8]} />
        <meshStandardMaterial color="#1e3a5f" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[1.3, 0, 0]}>
        <boxGeometry args={[1.8, 0.04, 0.8]} />
        <meshStandardMaterial color="#1e3a5f" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

function getModelForSatellite(name: string): { path: string; scale: number } {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('iss') || nameLower.includes('zarya') || nameLower.includes('space station') || nameLower.includes('tiangong')) {
    return { path: '/ISS.glb', scale: 0.002 };
  }
  if (nameLower.includes('hubble')) {
    return { path: '/Hubble.glb', scale: 0.002 };
  }
  return { path: '/satellite.glb', scale: 0.015 };
}

// Glowing marker for easy clicking - zoom responsive
function SatelliteMarker({ color, isSelected }: { color: string; isSelected: boolean }) {
  const cameraDistance = useCameraDistance();
  // Scale marker based on camera distance (smaller when zoomed in)
  const scale = Math.max(0.3, Math.min(1, cameraDistance / 5.5));
  const markerSize = 0.025 * scale;
  
  return (
    <group scale={[scale, scale, scale]}>
      {/* Small indicator sphere */}
      <mesh>
        <sphereGeometry args={[markerSize / scale, 16, 16]} />
        <meshBasicMaterial color={isSelected ? '#00ff00' : color} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function Satellite({ 
  lat, 
  lng, 
  alt, 
  name, 
  color,
  isSelected,
  onClick 
}: { 
  lat: number; 
  lng: number; 
  alt: number; 
  name: string; 
  color: string;
  isSelected: boolean;
  onClick?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const cameraDistance = useCameraDistance();
  
  const radius = 2 + (alt / 6371) * 0.4;
  const position = useMemo(() => latLngToVector3(lat, lng, radius), [lat, lng, radius]);
  const model = useMemo(() => getModelForSatellite(name), [name]);
  
  // Scale for 3D model
  const zoomScale = Math.max(0.2, Math.min(0.6, (cameraDistance - 3) / 8));
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <group position={position}>
      {/* Invisible clickable sphere */}
      <mesh 
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Glowing marker */}
      <SatelliteMarker color={hovered ? '#ffffff' : color} isSelected={isSelected} />
      
      {/* 3D Model */}
      <group ref={groupRef} scale={[zoomScale, zoomScale, zoomScale]}>
        <Suspense fallback={<SimpleSatelliteModel />}>
          <SatelliteGLB modelPath={model.path} scale={model.scale} />
        </Suspense>
      </group>
      
      {/* Small compact tooltip - fixed size, not 3D scaled */}
      {(hovered || isSelected) && (
        <Html
          style={{ 
            pointerEvents: 'none',
            transform: 'translate(-50%, -120%)',
          }}
          center={false}
        >
          <div 
            className={`rounded shadow-md border ${
              isSelected 
                ? 'bg-green-900/95 border-green-500 text-green-100' 
                : 'bg-gray-900/95 border-cyan-500/50 text-white'
            }`}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              lineHeight: '1.3',
              whiteSpace: 'nowrap',
            }}
          >
            <div className="font-semibold">{name}</div>
            <div className="text-gray-300" style={{ fontSize: '10px' }}>{alt.toFixed(0)} km</div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Orbit path visualization - GREEN line with smooth curve around globe
function OrbitPath({ positions, color = '#00ff00' }: { positions: { lat: number; lng: number; alt: number }[]; color?: string }) {
  const { points, segments } = useMemo(() => {
    if (positions.length < 2) return { points: [], segments: [] };
    
    const allPoints: THREE.Vector3[] = [];
    const segmentIndices: number[] = [];
    
    for (let i = 0; i < positions.length; i++) {
      const p = positions[i];
      const radius = 2 + (p.alt / 6371) * 0.4;
      const point = latLngToVector3(p.lat, p.lng, radius);
      
      // Check for longitude wrap-around (crossing date line)
      if (i > 0) {
        const prevLng = positions[i - 1].lng;
        const currLng = p.lng;
        const lngDiff = Math.abs(currLng - prevLng);
        
        // If longitude jump is > 180, we're crossing the date line - start new segment
        if (lngDiff > 180) {
          segmentIndices.push(allPoints.length);
        }
      }
      
      allPoints.push(point);
    }
    
    return { points: allPoints, segments: segmentIndices };
  }, [positions]);

  if (points.length < 2) return null;

  // Create separate line segments to handle date line crossing
  const lineSegments = useMemo(() => {
    if (segments.length === 0) {
      return [points];
    }
    
    const result: THREE.Vector3[][] = [];
    let startIdx = 0;
    
    for (const segIdx of segments) {
      if (segIdx > startIdx) {
        result.push(points.slice(startIdx, segIdx));
      }
      startIdx = segIdx;
    }
    
    if (startIdx < points.length) {
      result.push(points.slice(startIdx));
    }
    
    return result;
  }, [points, segments]);

  return (
    <group>
      {lineSegments.map((segmentPoints, idx) => {
        if (segmentPoints.length < 2) return null;
        const geometry = new THREE.BufferGeometry().setFromPoints(segmentPoints);
        const material = new THREE.LineBasicMaterial({ 
          color, 
          opacity: 0.9, 
          transparent: true,
          linewidth: 2 
        });
        return <primitive key={idx} object={new THREE.Line(geometry, material)} />;
      })}
    </group>
  );
}

// Tracked satellite orbit (colored by satellite) - handles date line crossing
function TrackedOrbit({ positions, color }: { positions: { lat: number; lng: number; alt: number }[]; color: string }) {
  const { points, segments } = useMemo(() => {
    if (positions.length < 2) return { points: [], segments: [] };
    
    const allPoints: THREE.Vector3[] = [];
    const segmentIndices: number[] = [];
    
    for (let i = 0; i < positions.length; i++) {
      const p = positions[i];
      const radius = 2 + (p.alt / 6371) * 0.4;
      const point = latLngToVector3(p.lat, p.lng, radius);
      
      if (i > 0) {
        const prevLng = positions[i - 1].lng;
        const currLng = p.lng;
        const lngDiff = Math.abs(currLng - prevLng);
        
        if (lngDiff > 180) {
          segmentIndices.push(allPoints.length);
        }
      }
      
      allPoints.push(point);
    }
    
    return { points: allPoints, segments: segmentIndices };
  }, [positions]);

  if (points.length < 2) return null;

  const lineSegments = useMemo(() => {
    if (segments.length === 0) {
      return [points];
    }
    
    const result: THREE.Vector3[][] = [];
    let startIdx = 0;
    
    for (const segIdx of segments) {
      if (segIdx > startIdx) {
        result.push(points.slice(startIdx, segIdx));
      }
      startIdx = segIdx;
    }
    
    if (startIdx < points.length) {
      result.push(points.slice(startIdx));
    }
    
    return result;
  }, [points, segments]);

  return (
    <group>
      {lineSegments.map((segmentPoints, idx) => {
        if (segmentPoints.length < 2) return null;
        const geometry = new THREE.BufferGeometry().setFromPoints(segmentPoints);
        const material = new THREE.LineBasicMaterial({ 
          color, 
          opacity: 0.7, 
          transparent: true 
        });
        return <primitive key={idx} object={new THREE.Line(geometry, material)} />;
      })}
    </group>
  );
}

function ObserverMarker({ lat, lng }: { lat: number; lng: number }) {
  const position = useMemo(() => latLngToVector3(lat, lng, 2.02), [lat, lng]);
  const pulseRef = useRef<THREE.Mesh>(null);
  const cameraDistance = useCameraDistance();
  
  // Calculate zoom-responsive scale
  const zoomScale = Math.max(0.3, Math.min(1, cameraDistance / 5.5));
  const tooltipScale = Math.max(4, Math.min(12, cameraDistance * 1.5));
  const markerSize = 0.025 * zoomScale;
  const ringInner = 0.035 * zoomScale;
  const ringOuter = 0.05 * zoomScale;
  
  useFrame((state) => {
    if (pulseRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      pulseRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[markerSize, 16, 16]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh ref={pulseRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[ringInner, ringOuter, 32]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <Html distanceFactor={tooltipScale} style={{ pointerEvents: 'none' }}>
        <div 
          className="bg-red-500 text-white rounded font-medium shadow-lg whitespace-nowrap"
          style={{
            padding: `${Math.max(2, 4 * zoomScale)}px ${Math.max(4, 8 * zoomScale)}px`,
            fontSize: `${Math.max(9, 12 * zoomScale)}px`,
          }}
        >
          📍 You
        </div>
      </Html>
    </group>
  );
}

function Scene() {
  const { 
    satellitesAbove, 
    trackedSatellites, 
    observer, 
    selectedSatellite, 
    setSelectedSatellite, 
    selectTrackedSatellite,
    showObserver,
    selectedOrbitPositions 
  } = useSatelliteStore((state) => state);

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 3, 5]} intensity={2} />
      <directionalLight position={[-5, -3, -5]} intensity={1} />
      <pointLight position={[0, 0, 0]} intensity={1} />
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      
      <Suspense fallback={null}>
        <Earth />
      </Suspense>
      
      <CameraDistanceProvider>
        {showObserver && <ObserverMarker lat={observer.lat} lng={observer.lng} />}
        
        {/* Satellites from search results */}
        {satellitesAbove.map((sat) => (
          <Satellite
            key={sat.satid}
            lat={sat.satlat}
            lng={sat.satlng}
            alt={sat.satalt}
            name={sat.satname}
            color="#4ecdc4"
            isSelected={selectedSatellite?.satid === sat.satid}
            onClick={() => setSelectedSatellite(sat)}
          />
        ))}
        
        {/* Tracked satellites */}
        {trackedSatellites.map((sat) => (
          <group key={sat.id}>
            {sat.positions.length > 0 && (
              <Satellite
                lat={sat.positions[0].satlatitude}
                lng={sat.positions[0].satlongitude}
                alt={sat.positions[0].sataltitude}
                name={sat.name}
                color={sat.color}
                isSelected={selectedSatellite?.satid === sat.id}
                onClick={() => selectTrackedSatellite(sat.id)}
              />
            )}
          </group>
        ))}
      </CameraDistanceProvider>
      
      <OrbitControls 
        enablePan={false} 
        minDistance={3} 
        maxDistance={12}
        rotateSpeed={0.5}
      />
    </>
  );
}

export default function Globe() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-slate-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-900 to-black">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
        <Scene />
      </Canvas>
    </div>
  );
}

// Preload models
useGLTF.preload('/satellite.glb');
useGLTF.preload('/ISS.glb');
useGLTF.preload('/Hubble.glb');
