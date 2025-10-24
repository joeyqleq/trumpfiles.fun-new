'use client'

import { useRef, Suspense, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, Float } from '@react-three/drei'
import { Group } from 'three'

function Orange({ mouse }: { mouse: { x: number; y: number } }) {
  const meshRef = useRef<Group>(null)
  const { scene } = useGLTF('/orange_hero.glb')
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotation based on mouse movement
      meshRef.current.rotation.y += (mouse.x * 0.5 - meshRef.current.rotation.y) * 0.1
      meshRef.current.rotation.x += (mouse.y * 0.3 - meshRef.current.rotation.x) * 0.1
      
      // Continuous rotation
      meshRef.current.rotation.z += delta * 0.2
    }
  })

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
        scale={2.5}
        position={[0, 0, 0]}
      />
    </Float>
  )
}

export default function OrangeHero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    setMouse({ x, y })
  }

  return (
    <div 
      className="w-full h-[500px] relative"
      onMouseMove={handleMouseMove}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#FF4500" />
          <Orange mouse={mouse} />
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  )
}

// Preload the GLB file
useGLTF.preload('/orange_hero.glb')