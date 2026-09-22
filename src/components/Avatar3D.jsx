import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  useGLTF,
  useTexture,
} from '@react-three/drei';
import * as THREE from 'three';
import { BODY_SHAPES } from '../data/clothes';

// ─── Preload both models so they're cached ─────────────────────────────────────
useGLTF.preload('/models/xbot.glb');
useGLTF.preload('/models/michelle.glb');

// ─── Clothing overlay: real product image on a plane in front of the body ─────

function ClothingTexturePlane({ item, scale }) {
  const texture = useTexture(item.image);
  const cfg = getClothingConfig(item, scale);
  return (
    <mesh position={cfg.position} rotation={cfg.rotation}>
      <planeGeometry args={cfg.size} />
      <meshStandardMaterial
        map={texture}
        transparent
        alphaTest={0.05}
        roughness={0.7}
        metalness={0.0}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function ClothingColorPlane({ item, scale }) {
  const cfg = getClothingConfig(item, scale);
  return (
    <mesh position={cfg.position} rotation={cfg.rotation}>
      <planeGeometry args={cfg.size} />
      <meshStandardMaterial
        color={new THREE.Color(item.meshColor)}
        transparent
        opacity={0.85}
        roughness={0.7}
        metalness={0}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// Maps body part → plane position/size relative to the GLB model space
// Xbot/Michelle are ~1.7 units tall, standing with feet at y=0
function getClothingConfig(item, scale) {
  const s = scale || 1;
  const cat = item.bodyPart || item.category;
  switch (cat) {
    case 'torso':
    case 'top':
      return { position: [0, 1.22 * s, 0.13 * s], rotation: [0.06, 0, 0], size: [0.72 * s, 0.62 * s] };
    case 'jacket':
      return { position: [0, 1.18 * s, 0.13 * s], rotation: [0.05, 0, 0], size: [0.84 * s, 0.72 * s] };
    case 'legs':
    case 'pants':
      return { position: [0, 0.56 * s, 0.12 * s], rotation: [0.04, 0, 0], size: [0.60 * s, 0.90 * s] };
    case 'lower':
    case 'shorts':
      return { position: [0, 0.72 * s, 0.12 * s], rotation: [0.04, 0, 0], size: [0.60 * s, 0.48 * s] };
    case 'full':
    case 'dress':
    case 'set':
      return { position: [0, 0.88 * s, 0.13 * s], rotation: [0.04, 0, 0], size: [0.80 * s, 1.42 * s] };
    default:
      return { position: [0, 1.0  * s, 0.13 * s], rotation: [0.05, 0, 0], size: [0.75 * s, 0.80 * s] };
  }
}

// ─── The loaded human model ────────────────────────────────────────────────────

function HumanModel({ avatarConfig, selectedItems, onRotationChange }) {
  const controlsRef = useRef();

  const isFemale = avatarConfig.gender === 'F';
  const modelPath = isFemale ? '/models/michelle.glb' : '/models/xbot.glb';

  const { scene } = useGLTF(modelPath);

  // Clone the scene so multiple instances don't share state
  const clonedScene = scene.clone(true);

  // ── Body scale from height/weight/shape ──────────────────────────────────
  const shape = BODY_SHAPES[avatarConfig.bodyShape] || BODY_SHAPES.M;
  const heightScale = THREE.MathUtils.mapLinear(avatarConfig.height, 140, 215, 0.86, 1.14);
  const widthScale  = shape.torsoScale[0] *
    THREE.MathUtils.mapLinear(avatarConfig.weight, 40, 160, 0.88, 1.18);

  // Apply skin tone tint to the model's materials
  const skinColor = new THREE.Color(avatarConfig.skinTone);
  clonedScene.traverse((child) => {
    if (child.isMesh) {
      // Clone material so we don't mutate the cached original
      child.material = child.material.clone();
      child.material.roughness = 0.6;
      child.material.metalness = 0.0;
      child.castShadow    = true;
      child.receiveShadow = true;

      // Skin areas — tint by detected material name
      const name = (child.material.name || child.name || '').toLowerCase();
      if (
        name.includes('skin') ||
        name.includes('body') ||
        name.includes('face') ||
        name.includes('hands') ||
        name.includes('head')
      ) {
        child.material.color = skinColor;
      }
    }
  });

  // Clothing
  const fullItem   = selectedItems.find((i) => ['full','dress','set'].includes(i.bodyPart || i.category));
  const torsoItem  = !fullItem && selectedItems.find((i) => ['torso','top','jacket'].includes(i.bodyPart || i.category));
  const bottomItem = !fullItem && selectedItems.find((i) => ['legs','lower','pants','shorts'].includes(i.bodyPart || i.category));
  const clothItems = [fullItem, torsoItem, bottomItem].filter(Boolean);

  useFrame(() => {
    if (controlsRef.current) {
      const deg = Math.round(
        THREE.MathUtils.radToDeg(controlsRef.current.getAzimuthalAngle()) + 360
      ) % 360;
      onRotationChange(deg);
    }
  });

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={1.8}
        maxDistance={6}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 1.7}
        rotateSpeed={0.5}
        zoomSpeed={0.6}
        target={[0, 0.85, 0]}
      />

      {/* The human model, centered */}
      <group
        scale={[widthScale, heightScale, widthScale]}
        position={[0, 0, 0]}
      >
        <primitive object={clonedScene} />

        {/* Clothing overlays */}
        {clothItems.map((item) =>
          item.image ? (
            <ClothingTexturePlane key={item.id} item={item} scale={1} />
          ) : (
            <ClothingColorPlane key={item.id} item={item} scale={1} />
          )
        )}
      </group>
    </>
  );
}

// ─── Loading fallback ──────────────────────────────────────────────────────────

function LoadingStand() {
  const mesh = useRef();
  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.y += delta * 1.2;
  });
  return (
    <group>
      <mesh ref={mesh} position={[0, 0.9, 0]}>
        <torusGeometry args={[0.25, 0.04, 12, 48]} />
        <meshStandardMaterial color="#20b2aa" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <torusGeometry args={[0.18, 0.03, 10, 36]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#20b2aa" roughness={0.3} metalness={0.6} />
      </mesh>
    </group>
  );
}

// ─── Exported canvas ───────────────────────────────────────────────────────────

export default function Avatar3D({ avatarConfig, selectedItems, onRotationChange }) {
  return (
    <Canvas
      camera={{ position: [0, 1.0, 3.2], fov: 46 }}
      className="w-full h-full"
      shadows
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
    >
      {/* Background */}
      <color attach="background" args={['#f0f0f0']} />
      <fog attach="fog" args={['#f0f0f0', 7, 18]} />

      {/* ── Lighting — warm skin tones + accent accent ── */}
      <ambientLight intensity={0.5} color="#d0dde8" />

      {/* Key light — soft warm from front-left */}
      <directionalLight
        position={[-3, 6, 5]}
        intensity={1.8}
        color="#fff8f0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={5}
        shadow-camera-bottom={-3}
      />
      {/* Fill — cooler from right */}
      <directionalLight position={[4, 4, -2]} intensity={1.0} color="#c8d8f0" />
      {/* Rim / backlight */}
      <directionalLight position={[0, 2, -5]} intensity={0.7} color="#7090b0" />
      {/* Under-chin fill — removes harsh under-shadow */}
      <directionalLight position={[0, -2, 3]} intensity={0.3} color="#d0b8a0" />

      {/* Emerald floor glow */}
      <pointLight position={[0, -0.1, 1.2]} intensity={2.0} color="#20b2aa" distance={4} />

      {/* HDR — critical for realistic skin/material reflections */}
      <Environment preset="apartment" />

      {/* Floor shadow */}
      <ContactShadows
        position={[0, -0.02, 0]}
        opacity={0.5}
        width={5}
        height={5}
        blur={2}
        far={3}
        color="#000a14"
      />

      {/* Human model with Suspense loading state */}
      <Suspense fallback={<LoadingStand />}>
        <HumanModel
          avatarConfig={avatarConfig}
          selectedItems={selectedItems}
          onRotationChange={onRotationChange}
        />
      </Suspense>

      {/* Floor grid */}
      <gridHelper args={[8, 22, '#cccccc', '#e5e5e5']} position={[0, -0.03, 0]} />
    </Canvas>
  );
}
