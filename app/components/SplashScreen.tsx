"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box, Torus, Sphere } from "@react-three/drei";

function Model() {
  return (
    <group>
        <Torus position={[-1.2, 0, 0]} args={[0.8, 0.2, 16, 100]}>
            <meshStandardMaterial color="#59a985" wireframe />
        </Torus>
        <Box position={[0, 0, 0]} args={[1, 1, 1]}>
             <meshStandardMaterial color="#e6d3a7" />
        </Box>
        <Sphere position={[1.2, 0, 0]} args={[0.7, 32, 32]}>
             <meshStandardMaterial color="#3a7563" wireframe />
        </Sphere>
    </group>
  );
}

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#392f2f]"
    >
      <div className="h-[300px] w-full">
          <Canvas>
             <ambientLight intensity={0.5} />
             <pointLight position={[10, 10, 10]} />
             <Model />
             <OrbitControls autoRotate enableZoom={false} />
          </Canvas>
      </div>
      <h1 className="mt-4 text-3xl font-bold text-[#e6d3a7] tracking-widest">POLYSOL</h1>
      <p className="text-[#3a7563] text-sm tracking-widest uppercase">Initializing Studio</p>
    </motion.div>
  );
}
