"use client";

import { useRef, Suspense, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Float } from "@react-three/drei";
import { Group } from "three";

function Orange({ mouse }: { mouse: { x: number; y: number } }) {
  const meshRef = useRef<Group>(null);
  const { scene } = useGLTF("/orange_hero.glb");

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotation based on mouse movement
      meshRef.current.rotation.y +=
        (mouse.x * 0.2 - meshRef.current.rotation.y) * 0.05;
      meshRef.current.rotation.x +=
        (mouse.y * 0.2 - meshRef.current.rotation.x) * 0.05;

      // Continuous rotation
      meshRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <Float
      speed={1}
      rotationIntensity={0.2}
      floatIntensity={0.5}
      floatingRange={[-0.05, 0.05]}
      data-oid="_-z6tus"
    >
      <primitive
        ref={meshRef}
        object={scene}
        scale={3.5}
        position={[0, -1, 0]}
        data-oid="zvwsydp"
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
      className="w-full h-[500px] relative"
      onMouseMove={handleMouseMove}
      data-oid="oug96-r"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        className="w-full h-full"
        data-oid="w7jkrz3"
      >
        <Suspense fallback={null} data-oid="gd6a0pn">
          <ambientLight intensity={0.5} data-oid="f3ph3jl" />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            data-oid="whbuf2f"
          />
          <pointLight
            position={[-10, -10, -5]}
            intensity={0.5}
            color="#FF4500"
            data-oid="y-tfy-n"
          />
          <Orange mouse={mouse} data-oid="6y5v25:" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
            data-oid="l22ex_a"
          />

          <Environment preset="sunset" data-oid="61:yvgh" />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload the GLB file
useGLTF.preload("/orange_hero.glb");
