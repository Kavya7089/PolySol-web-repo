"use client";

import { useEffect } from "react";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { motion } from 'framer-motion';


import FloatingLaptop from './3d/FloatingLaptop';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 8.0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#392f2f]"
    >
      <div className="h-[300px] w-full">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
             <ambientLight intensity={0.7} />
             <pointLight position={[10, 10, 10]} intensity={1.5} />
             <Float 
               speed={1.5} 
               rotationIntensity={0.5} 
               floatIntensity={0.5}
             >
               <FloatingLaptop position={[0, 0, 0]} scale={1.5} />
             </Float>
             <OrbitControls 
               enableZoom={false} 
               enablePan={false}
               autoRotate 
               autoRotateSpeed={0.5}
               minPolarAngle={Math.PI / 3}
               maxPolarAngle={Math.PI / 1.5}
             />
          </Canvas>
      </div>
      <h1 className="mt-4 text-3xl font-bold text-[#e6d3a7] tracking-widest">POLYSOL</h1>
      <p className="text-[#3a7563] text-sm tracking-widest uppercase">Initializing Studio</p>
    </motion.div>
  );
}
