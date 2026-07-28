'use client';

import { Suspense, useMemo, useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useProgress, Html, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center gap-2 p-3.5 bg-black/90 text-white rounded border border-white/20 shadow-2xl backdrop-blur-md min-w-[160px]">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-[0.65rem] font-mono tracking-widest font-bold text-primary">
          LOADING 3D PCB... {Math.round(progress)}%
        </span>
      </div>
    </Html>
  );
}

function GlbMesh({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  // Compute bounding box & auto-scale GLB scene to ~2.5 units
  const { scale, position } = useMemo(() => {
    if (!scene) return { scale: 1, position: [0, 0, 0] as [number, number, number] };

    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const radius = sphere.radius || 1;

    const targetSize = 2.5;
    const s = targetSize / (radius * 2 || 1);

    return {
      scale: s,
      position: [-center.x * s, -center.y * s, -center.z * s] as [number, number, number],
    };
  }, [scene]);

  // Freeze matrix auto-updates on static sub-meshes (boosts FPS by skipping
  // matrix calculations for 1,000+ nodes). useGLTF caches and shares the scene
  // graph, so we mutate a clone rather than the hook's cached object.
  const preparedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.matrixAutoUpdate = false;
    clone.traverse((child: THREE.Object3D) => {
      child.matrixAutoUpdate = false;
      child.castShadow = false;
      child.receiveShadow = false;
      child.updateMatrix();
    });
    clone.updateMatrixWorld(true);
    return clone;
  }, [scene]);

  return (
    <group position={position} scale={scale}>
      <primitive object={preparedScene} />
    </group>
  );
}

// The camera's initial position/fov was tuned for a wide box. On a narrow or
// near-square container (small browser windows, phones) that same distance
// clips the edges of the model. Refit the camera distance to the container's
// actual aspect ratio whenever it changes, preserving the original viewing angle.
function FitCameraToAspect({
  halfSize = 1.4,
  minDist = 0.8,
  maxDist = 12,
}: {
  halfSize?: number;
  minDist?: number;
  maxDist?: number;
}) {
  const { camera, size } = useThree();

  useEffect(() => {
    if (size.width === 0 || size.height === 0) return;
    const persp = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    const vFov = (persp.fov * Math.PI) / 180;
    const distForHeight = halfSize / Math.tan(vFov / 2);
    const distForWidth = halfSize / (Math.tan(vFov / 2) * aspect);
    const dist = THREE.MathUtils.clamp(Math.max(distForHeight, distForWidth), minDist, maxDist);

    const dir = camera.position.lengthSq() > 0
      ? camera.position.clone().normalize()
      : new THREE.Vector3(0, 0.35, 0.94);
    camera.position.copy(dir.multiplyScalar(dist));
    camera.updateProjectionMatrix();
  }, [size.width, size.height, camera, halfSize, minDist, maxDist]);

  return null;
}

/** The only board model on the site; kept here so the preload and the component
 *  default can't point at different files. */
const DEFAULT_MODEL_URL = "/assets/FC_PC_1.glb";

useGLTF.preload(DEFAULT_MODEL_URL);

export function PcbGlbCanvas({ url = DEFAULT_MODEL_URL }: { url?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [isSpinning, setIsSpinning] = useState(true);

  // Stop the render loop entirely while the viewer is scrolled off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '100px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full relative flex flex-col gap-2.5 my-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 px-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shrink-0" />
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary truncate">
            Interactive 3D PCB Model
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[0.6rem] font-sans text-on-surface-variant/60 uppercase tracking-widest hidden sm:inline">
            Drag to rotate • Pinch/Scroll to zoom
          </span>
          <button
            type="button"
            onClick={() => setIsSpinning((v) => !v)}
            aria-pressed={isSpinning}
            aria-label={isSpinning ? "Pause auto-rotation" : "Resume auto-rotation"}
            className="inline-flex items-center gap-1.5 px-2 py-1 bg-surface-container-high border border-outline-variant/30 hover:border-primary text-on-surface-variant hover:text-primary text-[0.6rem] font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer"
          >
            {isSpinning ? (
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
            {isSpinning ? "Pause" : "Spin"}
          </button>
        </div>
      </div>

      {/* 3D Canvas Box */}
      <div
        className="relative w-full h-[300px] sm:h-[420px] md:h-[560px] bg-[#120f17] border border-outline-variant/30 rounded overflow-hidden shadow-2xl overscroll-contain"
        style={{ touchAction: 'none' }}
      >
        <Canvas
          frameloop={inView ? 'always' : 'never'}
          dpr={[1, 1.5]}
          gl={{
            powerPreference: 'high-performance',
            antialias: true,
            precision: 'mediump',
            alpha: false,
          }}
          camera={{ position: [0, 1.2, 3.2], fov: 45 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <FitCameraToAspect />

          {/* Fast Studio Lighting */}
          <ambientLight intensity={1.8} />
          <directionalLight position={[10, 15, 10]} intensity={2.2} />
          <directionalLight position={[-10, 10, -10]} intensity={1.2} />

          <Suspense fallback={<Loader />}>
            <GlbMesh url={url} />
            {/* Soft Ground Contact Shadow — baked once after the model loads */}
            <ContactShadows frames={1} position={[0, -1.2, 0]} opacity={0.5} scale={5} blur={1.5} far={2} />
          </Suspense>

          <OrbitControls
            makeDefault
            enablePan={false}
            autoRotate={isSpinning}
            autoRotateSpeed={1.0}
            minDistance={0.8}
            maxDistance={12.0}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default PcbGlbCanvas;
