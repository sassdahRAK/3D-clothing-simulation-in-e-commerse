import { Environment, ContactShadows } from '@react-three/drei';

export default function CinematicLighting() {
  return (
    <>
      <ambientLight intensity={0.6} color="#eef2ff" />
      
      {/* Key Light - Warm & Strong */}
      <directionalLight
        position={[-3, 6, 4]}
        intensity={2.2}
        color="#fff5ea"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={5}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0001}
      />

      {/* Fill Light - Cool Soft */}
      <directionalLight 
        position={[4, 3, -2]} 
        intensity={1.0} 
        color="#c8dcfa" 
      />

      {/* Rim Light / Backlight - Crisp Edge Definition */}
      <directionalLight 
        position={[0, 4, -5]} 
        intensity={1.5} 
        color="#e0f2fe" 
      />

      {/* Ground Bounce Fill Light */}
      <directionalLight 
        position={[0, -2, 2]} 
        intensity={0.4} 
        color="#fef3c7" 
      />

      {/* Realistic HDRI Environment */}
      <Environment preset="city" />

      {/* Ground Contact Shadow */}
      <ContactShadows
        position={[0, -1, 0]}
        opacity={0.6}
        scale={6}
        blur={2}
        far={4}
        color="#050811"
      />
    </>
  );
}
