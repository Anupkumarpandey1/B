import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

// Check if WebGL is available
const isWebGLAvailable = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return context !== null;
  } catch (e) {
    return false;
  }
};

// Improved 3D Pen Model Component
const PenModel = () => {
  const penBodyRef = useRef<THREE.Group>(null);
  const capRef = useRef<THREE.Group>(null);
  const [capRemoved, setCapRemoved] = useState(false);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (penBodyRef.current) {
      // Smoother rotation for the pen body
      penBodyRef.current.rotation.y += delta * 0.80;
    }

    if (capRef.current && capRemoved) {
      // Animated cap removal with physics-like movement
      capRef.current.position.y += delta * 0.8;
      capRef.current.rotation.z += delta * 0.6;
      capRef.current.position.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
      
      // Reset cap position after animation
      if (capRef.current.position.y > 1.5) {
        setCapRemoved(false);
        capRef.current.position.set(0, 0.45, 0);
        capRef.current.rotation.z = 0;
      }
    }
  });

  const handleCapClick = () => {
    setCapRemoved(true);
  };

  // More realistic pen with metallic finish
  return (
    // TILTED PEN: Applied rotation to the entire pen group
    <group position={[0, 0, 0]} scale={1.5} rotation={[Math.PI * 0.15, 0, Math.PI * 0.05]}>
      {/* Pen Body Group */}
      <group ref={penBodyRef}>
        {/* Main Pen Body - make it more pen-like with a tapered design */}
        <mesh castShadow receiveShadow position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 1.4, 32]} />
          <meshStandardMaterial 
            color="#1E40AF" 
            metalness={0.8} 
            roughness={0.2} 
            envMapIntensity={1.5}
          />
        </mesh>

        {/* Pen Grip - with texture */}
        <mesh castShadow receiveShadow position={[0, -0.7, 0]}>
          <cylinderGeometry args={[0.086, 0.075, 0.32, 32]} />
          <meshStandardMaterial 
            color="#0369A1" 
            metalness={0.6} 
            roughness={0.6}
            envMapIntensity={0.8}
          />
        </mesh>

        {/* Pen Tip Base */}
        <mesh castShadow receiveShadow position={[0, -0.95, 0]}>
          <cylinderGeometry args={[0.065, 0.05, 0.1, 32]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Pen Nib (Cone) - FIXED: flipped to point downward */}
        <mesh castShadow receiveShadow position={[0, -1.1, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.04, 0.25, 32]} />
          <meshStandardMaterial color="#0F172A" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Pen Tip */}
        <mesh castShadow receiveShadow position={[0, -1.21, 0]}>
          <sphereGeometry args={[0.01, 16, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Pen Clip */}
        <mesh 
          castShadow 
          receiveShadow 
          position={[0.077, 0.2, 0]}
          rotation={[0, 0, Math.PI * 0.03]}
        >
          <boxGeometry args={[0.02, 0.4, 0.04]} />
          <meshStandardMaterial color="#0C4A6E" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Decorative Band Top */}
        <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.081, 0.081, 0.05, 32]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Decorative Band Middle */}
        <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.082, 0.082, 0.03, 32]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Decorative Band Bottom */}
        <mesh castShadow receiveShadow position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.086, 0.086, 0.03, 32]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Pen Cap - clickable and animated */}
      <group
        ref={capRef}
        position={[0, 0.45, 0]}
        onClick={handleCapClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh 
          castShadow
          receiveShadow
          scale={hovered ? 1.03 : 1}
        >
          <cylinderGeometry args={[0.082, 0.085, 0.5, 32]} />
          <meshStandardMaterial 
            color={hovered ? "#1E3A8A" : "#2563EB"} 
            metalness={0.8} 
            roughness={0.2}
            envMapIntensity={1.5}
          />
        </mesh>
        
        {/* Cap Tip */}
        <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.06, 0.082, 0.1, 32]} />
          <meshStandardMaterial color="#1E40AF" metalness={0.85} roughness={0.15} />
        </mesh>
        
        {/* Cap Finial */}
        <mesh castShadow receiveShadow position={[0, 0.38, 0]}>
          <sphereGeometry args={[0.06, 32, 32]} />
          <meshStandardMaterial color="#1E40AF" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Cap Clip */}
        <mesh 
          castShadow 
          receiveShadow 
          position={[0.075, 0.08, 0]}
          rotation={[0, 0, Math.PI * 0.05]}
        >
          <boxGeometry args={[0.02, 0.35, 0.035]} />
          <meshStandardMaterial color="#0C4A6E" metalness={0.7} roughness={0.3} />
        </mesh>
        
        {/* Cap Ring */}
        <mesh castShadow receiveShadow position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.088, 0.088, 0.04, 32]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
};

// Canvas Scene Component with WebGL error handling
const PenScene = () => {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [webglError, setWebGLError] = useState<string | null>(null);

  useEffect(() => {
    const available = isWebGLAvailable();
    setHasWebGL(available);
    if (!available) {
      setWebGLError('WebGL is not available on this device/browser. The 3D model cannot be displayed.');
    }
  }, []);

  // Show fallback if WebGL is not available
  if (hasWebGL === false) {
    return (
      <div 
        style={{ 
          width: '100%', 
          height: '400px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem',
          backgroundColor: 'rgba(30, 64, 175, 0.1)',
          borderRadius: '1rem',
          padding: '2rem'
        }}
      >
        <div style={{ fontSize: '3rem', opacity: 0.5 }}>🖊️</div>
        <p style={{ color: '#1E40AF', textAlign: 'center', margin: 0 }}>
          3D model unavailable
        </p>
        <p style={{ color: '#64748B', textAlign: 'center', margin: 0, fontSize: '0.875rem' }}>
          WebGL is disabled or not supported in this environment
        </p>
      </div>
    );
  }

  // Don't render until we know WebGL status
  if (hasWebGL === null) {
    return (
      <div 
        style={{ 
          width: '100%', 
          height: '400px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}
      >
        <p style={{ color: '#64748B' }}>Loading 3D model...</p>
      </div>
    );
  }

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      // Modified camera position to better show the tilted pen
      camera={{ position: [0, 0.5, 4], fov: 40 }}
      style={{ width: '100%', height: '400px', touchAction: 'none' }}
      onCreated={({ gl }) => {
        // Handle context loss
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault();
          console.warn('WebGL context lost. The 3D model may not display correctly.');
        });
      }}
      // Fallback for when WebGL context creation fails
      fallback={<div style={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748B' }}>3D model could not be loaded</p>
      </div>}
    >
      <ambientLight intensity={0.4} />
      <spotLight 
        position={[5, 5, 5]} 
        angle={0.3} 
        penumbra={0.8} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      
      <Environment preset="city" />
      
      <PresentationControls
        global
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.5, Math.PI / 1.5]}
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 300 }}
      >
        <PenModel />
      </PresentationControls>
      
      <OrbitControls 
        enablePan={false} 
        enableZoom={false} 
        minPolarAngle={Math.PI / 3} 
        maxPolarAngle={Math.PI / 1.6}
      />
    </Canvas>
  );
};

export default PenScene;