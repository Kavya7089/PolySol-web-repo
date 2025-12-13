import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Mesh, Group, TextureLoader } from 'three';

// Use the favicon (served as /favicon.ico)  adjust to your desired asset
const laptopScreen = '/favicon.ico';

interface FloatingLaptopProps {
  position: [number, number, number];
  // Accept a single number or a triple [x,y,z] tuple for non-uniform scaling
  scale: number | [number, number, number];
}

const FloatingLaptop: React.FC<FloatingLaptopProps> = ({ position, scale }) => {
  /* Floating Laptop Enhanced */
  const baseRef = useRef<Mesh | null>(null);
  const screenGroupRef = useRef<Group | null>(null);
  const groupRef = useRef<Group | null>(null);

  // Normalize scale
  const scaleVec: [number, number, number] = typeof scale === 'number' ? [scale, scale, scale] : [...scale] as [number, number, number];
  const screenTexture = useLoader(TextureLoader, laptopScreen);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Gentle floating
      groupRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.15;
      groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.2;
    }
    if (screenGroupRef.current) {
      // Screen open/close slightly breathing
      screenGroupRef.current.rotation.x = 0.2 + Math.sin(t * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Shadow */}
      <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial color="#000" opacity={0.15} transparent />
      </mesh>

      {/* Base */}
      <mesh ref={baseRef} position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.1, 1]} />
        <meshStandardMaterial color="#2d2d2d" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Keyboard */}
      <mesh position={[0, 0.255, 0.05]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <planeGeometry args={[1.4, 0.8]} />
        <meshStandardMaterial color="#444" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Touchpad */}
      <mesh position={[0, 0.256, 0.39]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 0.15]} />
        <meshStandardMaterial color="white" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Keys */}
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 10 }).map((_, col) => (
          <mesh
            key={`key-${row}-${col}`}
            position={[-0.65 + col * 0.15, 0.258, 0.5 + row * 0.15+-0.8]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <boxGeometry args={[0.12, 0.12, 0.04]} />
            <meshStandardMaterial color="grey" metalness={0.1} roughness={0.4} />
          </mesh>
        ))
      )}

      {/* Screen Group */}
      <group ref={screenGroupRef} position={[0, 0.7, -0.4]} rotation={[0.20, 0, 0]}>
        {/* Back of Screen */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 1, 0.05]} />
          <meshStandardMaterial color="#1f1f1f" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Display with image */}
        <mesh position={[0, 0, 0.031]}>
          <planeGeometry args={[1.4, 0.9]} />
          <meshBasicMaterial map={screenTexture} toneMapped={false} />
        </mesh>

        {/* Glow */}
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[1.45, 0.95]} />
          <meshBasicMaterial color="#6366f1" opacity={0.15} transparent />
        </mesh>
      </group>
    </group>
  );
};

export default FloatingLaptop;
