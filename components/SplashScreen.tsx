'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, Float, Stars, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RotatingCrystal(props: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meshRef = useRef<any>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
        meshRef.current.rotation.x += delta * 0.2;
        meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Icosahedron
            args={[1, 0]}
            ref={meshRef}
            scale={hovered ? 1.2 : 1}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            onClick={props.onClick}
        >
            <meshStandardMaterial
                color={hovered ? "#59a985" : "#3a7563"}
                wireframe
                emissive="#59a985"
                emissiveIntensity={0.5}
            />
        </Icosahedron>
        
        {/* Core */}
        <Icosahedron args={[0.5, 0]}>
             <meshStandardMaterial color="#e6d3a7" emissive="#e6d3a7" emissiveIntensity={0.2} />
        </Icosahedron>
    </Float>
  );
}

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div 
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#392f2f]"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, y: -50, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
        <div className="h-[60vh] w-full">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <RotatingCrystal onClick={onComplete} />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
        
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center"
        >
            <h1 className="text-4xl font-bold tracking-tighter text-[#e6d3a7] glow-text mb-2">PolySol <span className="text-[#59a985]">Studio</span></h1>
            <p className="text-[#3a7563] text-sm uppercase tracking-widest mb-8">Initialize Transpilation Engine</p>
            
            <button 
                onClick={onComplete}
                className="px-6 py-2 rounded-full border border-[#59a985] text-[#59a985] hover:bg-[#59a985] hover:text-[#392f2f] transition-all duration-300 uppercase text-xs tracking-wider"
            >
                Enter Studio
            </button>
        </motion.div>
    </motion.div>
  );
}
