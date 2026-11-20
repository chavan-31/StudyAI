import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import "./NeuralSphere.css";

function NeuralCore() {
  const core = useRef();
  const rings = useRef();

  useFrame((state, delta) => {
    if (core.current) {
      core.current.rotation.y += delta * 0.22;
      core.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.12;
    }

    if (rings.current) {
      rings.current.rotation.y += delta * 0.15;
      rings.current.rotation.x += delta * 0.08;
    }
  });

  return (
    <group>
      {/* Main glowing neural sphere */}
      <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.4}>
        <mesh ref={core}>
          <icosahedronGeometry args={[1.15, 4]} />
          <meshPhysicalMaterial
            color="#5725ff"
            wireframe
            emissive="#682cff"
            emissiveIntensity={1.8}
            roughness={0.25}
            metalness={0.8}
          />
        </mesh>

        {/* Inner energy core */}
        <mesh>
          <icosahedronGeometry args={[0.65, 3]} />
          <meshBasicMaterial
            color="#22d3ee"
            wireframe
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Central light */}
        <mesh>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshBasicMaterial color="#a5f3fc" />
        </mesh>
      </Float>

      {/* Rotating orbit rings */}
      <group ref={rings}>
        {[1.55, 1.75, 1.95].map((radius, index) => (
          <mesh key={index} rotation={[index * 0.7, index * 0.8, index * 0.5]}>
            <torusGeometry args={[radius, 0.009, 8, 120]} />
            <meshBasicMaterial
              color={index % 2 === 0 ? "#22d3ee" : "#a855f7"}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* Floating particles */}
      <Sparkles count={120} scale={5} size={2.5} speed={0.4} color="#67e8f9" />

      <pointLight position={[2, 2, 3]} intensity={3} color="#8b5cf6" />
      <pointLight position={[-2, -2, 2]} intensity={2} color="#22d3ee" />
    </group>
  );
}

export default function NeuralSphere() {
  return (
    <div className="neural-sphere">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <NeuralCore />
      </Canvas>
    </div>
  );
}
