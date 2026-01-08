"use client";

import { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Float } from "@react-three/drei";
import { Group, MathUtils } from "three";

function Orange({ mouse }: { mouse: { x: number; y: number } }) {
  const meshRef = useRef<Group>(null);
  const { scene } = useGLTF("/orange_hero.glb");

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Base auto-rotation (idle)
      const idleSpeed = 0.2;
      meshRef.current.rotation.y += idleSpeed * delta;

      // Mouse interaction (lerp for smoothness)
      const targetRotationY = mouse.x * 0.5; // Sensitivity
      const targetRotationX = mouse.y * 0.2;

      // Blend idle rotation with mouse interaction
      // Note: This is a simple blend. For purely idle vs interactive, we might want boolean flags.
      // But adding continuous rotation + mouse influence creates a dynamic "alive" feel.
      // Let's make it face forward (viewport) by default and rotate from there?
      // Actually user wanted: "idle... keep rotating very slowly" AND "when user plays... it interacts".
      
      // Since it's rotating continuously, "facing viewport" changes. 
      // Let's stick to a slow spin + mouse tilt.
      
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
      speed={2} // Faster float speed
      rotationIntensity={0.5} 
      floatIntensity={1} 
      floatingRange={[-0.1, 0.1]}
    >
      <primitive
        ref={meshRef}
        object={scene}
        scale={3.8} // Slightly reduced scale to fit better
        position={[0, 0.3, 0]} // Raised position to show full spherical base
        rotation={[0, 0, 0]} 
      />
    </Float>
  );
}

export default function OrangeHero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    setMouse({ x, y });
  };

  return (
    <div
      className="w-full h-full relative flex items-center justify-center cursor-grab active:cursor-grabbing"
      onMouseMove={handleMouseMove}
    >
      <Canvas
        camera={{ position: [0, 0.5, 8], fov: 45 }} // Raised camera position and pushed back to show full spherical base
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight
            position={[5, 10, 7]}
            intensity={2}
          />
          <pointLight
            position={[-10, -5, -5]}
            intensity={1}
            color="#FF4500"
          />

          <Orange mouse={mouse} />
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            // Allow some rotation interaction but keep it constrained if desired?
            // User said "mouse movement... spin". 
            // OrbitControls conflicts with manual mesh rotation if both control the view.
            // Let's use OrbitControls for interactivity if the mesh isn't auto-rotating the same axis?
            // Actually, OrbitControls rotates the Camera. Mesh rotation rotates the object.
            // The user request implies object rotation customization. 
            // Let's keep orbit controls but maybe limit it or let it handle the "spin"?
            // If we use OrbitControls, we don't need manual mesh rotation calc.
            // "When the user plays around with it... then depending on mouse movement... rotate and spin".
            // OrbitControls does exactly this.
            // So: Auto-rotate enabled via OrbitControls?
            autoRotate={true}
            autoRotateSpeed={2}
            enableDamping={true}
            // Limit vertical angle to prevent seeing top/bottom weirdly
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />

          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload the GLB file
useGLTF.preload("/orange_hero.glb");

