'use client';

/* eslint-disable react/no-unknown-property */
import React, { Suspense, useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useFBX, useProgress, Html, Environment, ContactShadows } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as THREE from 'three';

const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
const deg2rad = (d: number) => (d * Math.PI) / 180;
const ROTATE_SPEED = 0.005;
const INERTIA = 0.925;
const PARALLAX_MAG = 0.05;
const PARALLAX_EASE = 0.12;
const HOVER_MAG = deg2rad(6);
const HOVER_EASE = 0.15;

const Loader = ({ placeholderSrc }: { placeholderSrc?: string }) => {
  const { progress, active } = useProgress();
  if (!active && placeholderSrc) return null;
  return (
    <Html center>
      {placeholderSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={placeholderSrc} width={128} height={128} alt="Loading model..." style={{ filter: 'blur(8px)', borderRadius: 8 }} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 p-3 bg-black/90 text-white rounded border border-white/20 shadow-2xl backdrop-blur-md min-w-[150px]">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-[0.65rem] font-mono tracking-widest font-bold text-primary">
            LOADING 3D PCB... {Math.round(progress)}%
          </span>
        </div>
      )}
    </Html>
  );
};

function StlObject({ url, color }: { url: string; color: string }) {
  const geom = useLoader(STLLoader, url);
  const meshRef = useRef<THREE.Mesh>(null);

  const scaleFactor = useMemo(() => {
    if (!geom) return 1;
    geom.computeVertexNormals();
    geom.center();
    geom.computeBoundingSphere();
    const r = geom.boundingSphere?.radius || 1;
    return 1.4 / (r * 2);
  }, [geom]);

  return (
    <mesh ref={meshRef} geometry={geom} scale={scaleFactor} castShadow receiveShadow>
      <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function GltfObject({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const clone = useMemo(() => scene.clone(), [scene]);
  return <primitive object={clone} />;
}

function FbxObject({ url }: { url: string }) {
  const fbx = useFBX(url);
  const clone = useMemo(() => fbx.clone(), [fbx]);
  return <primitive object={clone} />;
}

function ObjObject({ url }: { url: string }) {
  const obj = useLoader(OBJLoader, url) as THREE.Group;
  const clone = useMemo(() => obj.clone(), [obj]);
  return <primitive object={clone} />;
}

function ModelContent({ url, pcbColor }: { url: string; pcbColor: string }) {
  const ext = useMemo(() => url.split('.').pop()?.toLowerCase() || '', [url]);

  if (ext === 'stl') {
    return <StlObject url={url} color={pcbColor} />;
  }
  if (ext === 'glb' || ext === 'gltf') {
    return <GltfObject url={url} />;
  }
  if (ext === 'fbx') {
    return <FbxObject url={url} />;
  }
  if (ext === 'obj') {
    return <ObjObject url={url} />;
  }
  return null;
}

interface DesktopControlsProps {
  pivot: THREE.Vector3;
  min: number;
  max: number;
  zoomEnabled: boolean;
}

const DesktopControls = ({ pivot, min, max, zoomEnabled }: DesktopControlsProps) => {
  const ref = useRef<any>(null);
  useFrame(() => ref.current?.target.copy(pivot));
  return (
    <OrbitControls
      ref={ref}
      makeDefault
      enablePan={false}
      enableRotate={false}
      enableZoom={zoomEnabled}
      minDistance={min}
      maxDistance={max}
    />
  );
};

interface ModelInnerProps {
  url: string;
  pcbColor: string;
  xOff: number;
  yOff: number;
  pivot: THREE.Vector3;
  initYaw: number;
  initPitch: number;
  minZoom: number;
  maxZoom: number;
  enableMouseParallax: boolean;
  enableManualRotation: boolean;
  enableHoverRotation: boolean;
  enableManualZoom: boolean;
  autoRotate: boolean;
  autoRotateSpeed: number;
}

const ModelInnerContainer = ({
  url,
  pcbColor,
  xOff,
  yOff,
  initYaw,
  initPitch,
  minZoom,
  maxZoom,
  enableMouseParallax,
  enableManualRotation,
  enableHoverRotation,
  enableManualZoom,
  autoRotate,
  autoRotateSpeed,
}: ModelInnerProps) => {
  const outer = useRef<THREE.Group>(null);
  const { gl } = useThree();

  const vel = useRef({ x: 0, y: 0 });
  const tPar = useRef({ x: 0, y: 0 });
  const cPar = useRef({ x: 0, y: 0 });
  const tHov = useRef({ x: 0, y: 0 });
  const cHov = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (outer.current) {
      outer.current.rotation.set(initPitch, initYaw, 0);
    }
  }, [initPitch, initYaw]);

  useEffect(() => {
    if (!enableManualRotation || isTouch) return;
    const el = gl.domElement;
    let drag = false;
    let lx = 0,
      ly = 0;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      drag = true;
      lx = e.clientX;
      ly = e.clientY;
      window.addEventListener('pointerup', up);
    };
    const move = (e: PointerEvent) => {
      if (!drag || !outer.current) return;
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      lx = e.clientX;
      ly = e.clientY;
      outer.current.rotation.y += dx * ROTATE_SPEED;
      outer.current.rotation.x += dy * ROTATE_SPEED;
      vel.current = { x: dx * ROTATE_SPEED, y: dy * ROTATE_SPEED };
    };
    const up = () => (drag = false);
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [gl, enableManualRotation]);

  useEffect(() => {
    if (!isTouch) return;
    const el = gl.domElement;
    const pts = new Map<number, { x: number; y: number }>();

    let mode = 'idle';
    let lx = 0,
      ly = 0;

    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 1) {
        mode = 'rotate';
        lx = e.clientX;
        ly = e.clientY;
      }
    };

    const move = (e: PointerEvent) => {
      const p = pts.get(e.pointerId);
      if (!p) return;
      p.x = e.clientX;
      p.y = e.clientY;

      if (mode === 'rotate' && outer.current) {
        e.preventDefault();
        const dx = e.clientX - lx;
        const dy = e.clientY - ly;
        lx = e.clientX;
        ly = e.clientY;
        outer.current.rotation.y += dx * ROTATE_SPEED;
        outer.current.rotation.x += dy * ROTATE_SPEED;
        vel.current = { x: dx * ROTATE_SPEED, y: dy * ROTATE_SPEED };
      }
    };

    const up = (e: PointerEvent) => {
      pts.delete(e.pointerId);
      if (pts.size === 0) mode = 'idle';
    };

    el.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', up, { passive: true });
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [gl, enableManualRotation, enableManualZoom, minZoom, maxZoom]);

  useEffect(() => {
    if (isTouch) return;
    const mm = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      if (enableMouseParallax) tPar.current = { x: -nx * PARALLAX_MAG, y: -ny * PARALLAX_MAG };
      if (enableHoverRotation) tHov.current = { x: ny * HOVER_MAG, y: nx * HOVER_MAG };
    };
    window.addEventListener('pointermove', mm);
    return () => window.removeEventListener('pointermove', mm);
  }, [enableMouseParallax, enableHoverRotation]);

  useFrame((_, dt) => {
    if (!outer.current) return;
    cPar.current.x += (tPar.current.x - cPar.current.x) * PARALLAX_EASE;
    cPar.current.y += (tPar.current.y - cPar.current.y) * PARALLAX_EASE;
    const phx = cHov.current.x,
      phy = cHov.current.y;
    cHov.current.x += (tHov.current.x - cHov.current.x) * HOVER_EASE;
    cHov.current.y += (tHov.current.y - cHov.current.y) * HOVER_EASE;

    outer.current.position.x = xOff + cPar.current.x;
    outer.current.position.y = yOff + cPar.current.y;

    outer.current.rotation.x += cHov.current.x - phx;
    outer.current.rotation.y += cHov.current.y - phy;

    if (autoRotate) {
      outer.current.rotation.y += autoRotateSpeed * dt;
    }

    outer.current.rotation.y += vel.current.x;
    outer.current.rotation.x += vel.current.y;
    vel.current.x *= INERTIA;
    vel.current.y *= INERTIA;
  });

  return (
    <group ref={outer}>
      <ModelContent url={url} pcbColor={pcbColor} />
    </group>
  );
};

export interface ModelViewerProps {
  url: string;
  width?: number | string;
  height?: number | string;
  modelXOffset?: number;
  modelYOffset?: number;
  defaultRotationX?: number;
  defaultRotationY?: number;
  defaultZoom?: number;
  minZoomDistance?: number;
  maxZoomDistance?: number;
  enableMouseParallax?: boolean;
  enableManualRotation?: boolean;
  enableHoverRotation?: boolean;
  enableManualZoom?: boolean;
  ambientIntensity?: number;
  keyLightIntensity?: number;
  fillLightIntensity?: number;
  rimLightIntensity?: number;
  environmentPreset?: 'none' | 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby';
  autoFrame?: boolean;
  placeholderSrc?: string;
  showScreenshotButton?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  onModelLoaded?: () => void;
}

const PCB_COLOR_OPTIONS = [
  { name: 'Matte Dark Green', value: '#1b4332' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Crimson Red', value: '#991b1b' },
  { name: 'Royal Blue', value: '#1e3a8a' },
  { name: 'Stealth Black', value: '#27272a' },
];

export function ModelViewer({
  url,
  width = 400,
  height = 420,
  modelXOffset = 0,
  modelYOffset = 0,
  defaultRotationX = -35,
  defaultRotationY = 25,
  defaultZoom = 2.0,
  minZoomDistance = 0.5,
  maxZoomDistance = 10,
  enableMouseParallax = true,
  enableManualRotation = true,
  enableHoverRotation = true,
  enableManualZoom = true,
  ambientIntensity = 0.9,
  keyLightIntensity = 1.6,
  fillLightIntensity = 0.8,
  rimLightIntensity = 1.0,
  environmentPreset = 'city',
  autoFrame = true,
  placeholderSrc,
  showScreenshotButton = true,
  autoRotate = true,
  autoRotateSpeed = 0.4,
  onModelLoaded
}: ModelViewerProps) {
  const [pcbColor, setPcbColor] = useState('#1b4332');
  const pivot = useRef(new THREE.Vector3()).current;
  const contactRef = useRef<any>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);

  const initYaw = deg2rad(defaultRotationX);
  const initPitch = deg2rad(defaultRotationY);

  const capture = () => {
    const g = rendererRef.current,
      s = sceneRef.current,
      c = cameraRef.current;
    if (!g || !s || !c) return;
    g.shadowMap.enabled = false;
    const tmp: { l: any; cast: boolean }[] = [];
    s.traverse((o: any) => {
      if (o.isLight && 'castShadow' in o) {
        tmp.push({ l: o, cast: o.castShadow });
        o.castShadow = false;
      }
    });
    if (contactRef.current) contactRef.current.visible = false;
    g.render(s, c);
    const urlPNG = g.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.download = 'pcb-model.png';
    a.href = urlPNG;
    a.click();
    g.shadowMap.enabled = true;
    tmp.forEach(({ l, cast }) => (l.castShadow = cast));
    if (contactRef.current) contactRef.current.visible = true;
  };

  return (
    <div
      style={{
        width,
        height,
        touchAction: 'pan-y pinch-zoom',
        position: 'relative'
      }}
      className="overflow-hidden bg-background border border-outline-variant/20 rounded shadow-inner flex flex-col justify-between"
    >
      {/* Top overlay controls */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {/* PCB Color palette selector */}
        <div className="flex items-center gap-1.5 bg-background/90 p-1 rounded border border-outline-variant/30 backdrop-blur-md pointer-events-auto">
          {PCB_COLOR_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setPcbColor(opt.value);
              }}
              title={opt.name}
              className={`w-4 h-4 rounded-full border transition-all duration-200 cursor-pointer ${
                pcbColor === opt.value
                  ? 'border-white scale-125 ring-1 ring-primary'
                  : 'border-white/20 opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: opt.value }}
            />
          ))}
        </div>

        {showScreenshotButton && (
          <button
            type="button"
            onClick={capture}
            className="px-2.5 py-1 bg-background/90 hover:bg-background text-on-surface border border-outline-variant/30 hover:border-primary text-[0.6rem] font-bold uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer pointer-events-auto"
          >
            Take Screenshot
          </button>
        )}
      </div>

      <Canvas
        shadows
        frameloop="always"
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        onCreated={({ gl, scene, camera }) => {
          rendererRef.current = gl;
          sceneRef.current = scene;
          cameraRef.current = camera;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        camera={{ fov: 45, position: [0, 0, 2.2], near: 0.01, far: 100 }}
        style={{ touchAction: 'pan-y pinch-zoom' }}
      >
        {environmentPreset !== 'none' && <Environment preset={environmentPreset} background={false} />}

        <ambientLight intensity={ambientIntensity} />
        <directionalLight position={[5, 8, 5]} intensity={keyLightIntensity} castShadow />
        <directionalLight position={[-5, 3, 5]} intensity={fillLightIntensity} />
        <directionalLight position={[0, 4, -5]} intensity={rimLightIntensity} />

        <ContactShadows ref={contactRef} position={[0, -0.6, 0]} opacity={0.4} scale={6} blur={1.5} />

        <Suspense fallback={<Loader placeholderSrc={placeholderSrc} />}>
          <ModelInnerContainer
            url={url}
            pcbColor={pcbColor}
            xOff={modelXOffset}
            yOff={modelYOffset}
            pivot={pivot}
            initYaw={initYaw}
            initPitch={initPitch}
            minZoom={minZoomDistance}
            maxZoom={maxZoomDistance}
            enableMouseParallax={enableMouseParallax}
            enableManualRotation={enableManualRotation}
            enableHoverRotation={enableHoverRotation}
            enableManualZoom={enableManualZoom}
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
          />
        </Suspense>

        {!isTouch && (
          <DesktopControls pivot={pivot} min={minZoomDistance} max={maxZoomDistance} zoomEnabled={enableManualZoom} />
        )}
      </Canvas>
    </div>
  );
}

export default ModelViewer;
