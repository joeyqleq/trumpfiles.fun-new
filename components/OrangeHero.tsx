"use client";

import { useRef, Suspense, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Float } from "@react-three/drei";
import { Group, MathUtils } from "three";

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

// Loading component for canvas
function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial color="#FF6B00" wireframe />
    </mesh>
  );
}

function Orange({ mouse }: { mouse: { x: number; y: number } }) {
  const meshRef = useRef<Group>(null);
  const { scene } = useGLTF("/orange_hero.glb");

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    setMouse({ x, y });
  };

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoaded(false);
    setRetryKey((k) => k + 1);
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

  // Set loaded after mount with delay to ensure canvas renders
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
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
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-transparent">
          <div className="animate-pulse text-2xl text-orange-400">
            Loading 3D Model...
          </div>
        </div>
      )}

      <Canvas
        key={retryKey}
        camera={{ position: [0, 0.5, 8], fov: 45 }}
        className="w-full h-full"
        onCreated={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Simplified lighting - no external Environment to avoid network requests */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 10, 7]} intensity={2} />
          <pointLight position={[-10, -5, -5]} intensity={1} color="#FF4500" />
          {/* Add hemisphere light for better ambient fill */}
          <hemisphereLight
            color="#ffffff"
            groundColor="#FF4500"
            intensity={0.5}
          />

          <Orange mouse={mouse} />

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
