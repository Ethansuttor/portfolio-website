'use client';

import React, { Suspense, useMemo, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useProgress, Html, ContactShadows } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as THREE from 'three';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center gap-2 p-3 bg-black/90 text-white rounded border border-white/20 shadow-2xl backdrop-blur-md min-w-[160px]">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-[0.65rem] font-mono tracking-widest font-bold text-primary">
          LOADING 3D PCB... {Math.round(progress)}%
        </span>
      </div>
    </Html>
  );
}

function StlMesh({ url, color }: { url: string; color: string }) {
  const geom = useLoader(STLLoader, url);

  const { scale, centerOffset } = useMemo(() => {
    if (!geom) return { scale: 1, centerOffset: [0, 0, 0] as [number, number, number] };
    
    geom.computeVertexNormals();
    geom.computeBoundingBox();
    geom.computeBoundingSphere();

    const box = geom.boundingBox!;
    const center = new THREE.Vector3();
    box.getCenter(center);

    const sphere = geom.boundingSphere!;
    const radius = sphere.radius || 1;
    // Scale max dimension to ~2.2 units
    const s = 2.2 / (radius * 2 || 1);

    return {
      scale: s,
      centerOffset: [-center.x * s, -center.y * s, -center.z * s] as [number, number, number],
    };
  }, [geom]);

  return (
    <group position={centerOffset} scale={scale}>
      <mesh geometry={geom} castShadow receiveShadow>
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

const PCB_COLORS = [
  { name: 'Classic PCB Green', value: '#059669' },
  { name: 'Matte Black', value: '#27272a' },
  { name: 'Crimson Red', value: '#dc2626' },
  { name: 'Royal Blue', value: '#2563eb' },
  { name: 'Gold / Copper', value: '#d97706' },
];

export function PcbStlCanvas({ url = "/assets/FC_PCB.stl" }: { url?: string }) {
  const [pcbColor, setPcbColor] = useState('#059669');

  return (
    <div className="w-full relative flex flex-col gap-2.5 my-4">
      {/* Header bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary">
            Interactive 3D PCB Model
          </span>
        </div>
        <span className="text-[0.6rem] font-sans text-on-surface-variant/60 uppercase tracking-widest hidden sm:inline">
          Click & Drag to rotate • Scroll to zoom
        </span>
      </div>

      {/* 3D Canvas Box */}
      <div className="relative w-full h-[420px] bg-[#120f17] border border-outline-variant/30 rounded overflow-hidden shadow-2xl">
        {/* Color Picker Overlay */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/80 px-2.5 py-1.5 rounded border border-white/15 backdrop-blur-md">
          <span className="text-[0.6rem] text-white/70 font-sans uppercase font-bold tracking-wider mr-1">
            Finish:
          </span>
          {PCB_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setPcbColor(c.value)}
              title={c.name}
              className={`w-4 h-4 rounded-full border transition-all duration-200 cursor-pointer ${
                pcbColor === c.value
                  ? 'border-white scale-125 ring-2 ring-primary'
                  : 'border-white/20 opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>

        <Canvas
          shadows
          camera={{ position: [0, 0, 3.5], fov: 45 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Bright, clear multi-angle lighting */}
          <ambientLight intensity={1.2} />
          <directionalLight position={[10, 10, 10]} intensity={1.8} castShadow />
          <directionalLight position={[-10, -10, -10]} intensity={0.8} />
          <directionalLight position={[0, 5, -10]} intensity={1.0} />

          <Suspense fallback={<Loader />}>
            <StlMesh url={url} color={pcbColor} />
          </Suspense>

          <ContactShadows position={[0, -1.3, 0]} opacity={0.5} scale={8} blur={2} />

          <OrbitControls
            makeDefault
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={1.2}
            minDistance={1.0}
            maxDistance={10.0}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default PcbStlCanvas;
