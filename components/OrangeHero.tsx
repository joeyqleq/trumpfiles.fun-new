"use client";

import { useRef, Suspense, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Float } from "@react-three/drei";
import { Group, MathUtils, Mesh } from "three";

// Error boundary for 3D content
function ErrorFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
      <div className="text-6xl mb-4">🍊</div>
      <p className="text-lg text-orange-400 mb-4">3D model loading failed</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 rounded-lg text-orange-400 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

// Loading component for canvas - glowing orange wireframe that rotates
function LoadingFallback() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} scale={2.5}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color="#FF6B00" wireframe transparent opacity={0.6} />
    </mesh>
  );
}

// Orange component with onLoad callback
function Orange({ mouse, onLoad }: { mouse: { x: number; y: number }; onLoad: () => void }) {
  const meshRef = useRef<Group>(null);
  const { scene } = useGLTF("/orange_hero.glb");

  // Signal that the model has loaded
  useEffect(() => {
    if (scene) {
      onLoad();
    }
  }, [scene, onLoad]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Base auto-rotation (idle)
      const idleSpeed = 0.2;
      meshRef.current.rotation.y += idleSpeed * delta;

      // Mouse interaction (lerp for smoothness)
      const targetRotationX = mouse.y * 0.2;

      // Tilt (X-axis) based on mouse Y
      meshRef.current.rotation.x = MathUtils.lerp(
        meshRef.current.rotation.x,
        targetRotationX,
        0.1
      );
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={1}
      floatingRange={[-0.1, 0.1]}
    >
      <primitive
        ref={meshRef}
        object={scene}
        scale={3.8}
        position={[0, 0.3, 0]}
        rotation={[0, 0, 0]}
      />
    </Float>
  );
}

export default function OrangeHero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hasError, setHasError] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    setMouse({ x, y });
  };

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsModelLoaded(false);
    setRetryKey((k) => k + 1);
  }, []);

  const handleModelLoad = useCallback(() => {
    setIsModelLoaded(true);
  }, []);

  // Monitor for errors during canvas creation
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (
        event.message.includes("WebGL") ||
        event.message.includes("THREE") ||
        event.message.includes("glb") ||
        event.message.includes("GLB")
      ) {
        setHasError(true);
      }
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, [retryKey]);

  if (hasError) {
    return (
      <div className="w-full h-full relative flex items-center justify-center">
        <ErrorFallback onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div
      className="w-full h-full relative flex items-center justify-center cursor-grab active:cursor-grabbing"
      onMouseMove={handleMouseMove}
    >
      {/* Loading message - shows until model is loaded */}
      {!isModelLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 z-10 pointer-events-none">
          <p className="text-base text-orange-400/80 animate-pulse" style={{ fontFamily: 'var(--font-outfit)' }}>
            Loading Mr. Trump&apos;s 3D model...
          </p>
        </div>
      )}

      <Canvas
        key={retryKey}
        camera={{ position: [0, 0.5, 8], fov: 45 }}
        className="w-full h-full"
        onError={() => setHasError(true)}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Simplified lighting */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 10, 7]} intensity={2} />
          <pointLight position={[-10, -5, -5]} intensity={1} color="#FF4500" />
          <hemisphereLight
            color="#ffffff"
            groundColor="#FF4500"
            intensity={0.5}
          />

          <Orange mouse={mouse} onLoad={handleModelLoad} />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={2}
            enableDamping={true}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload the GLB file
useGLTF.preload("/orange_hero.glb");
