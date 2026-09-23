import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  useGLTF,
} from '@react-three/drei';
import * as THREE from 'three';
import { BODY_SHAPES } from '../data/clothes';

import { SkeletonUtils } from 'three-stdlib';
import { ClothItem3D } from './canvas/Cloth3D';

// ─── Preload models so they're cached ──────────────────────────────────────────
useGLTF.preload('/models/rp_posed_00178_29.glb');
useGLTF.preload('/models/Ch06_nonPBR.glb');

// ─── The loaded human model ────────────────────────────────────────────────────

function HumanModel({ avatarConfig, selectedItems, onRotationChange }) {
  const controlsRef = useRef();

  // Load rp_posed_00178_29.glb for female avatars, Ch06_nonPBR.glb for male
  const isFemale =
    avatarConfig?.gender === 'Female' ||
    avatarConfig?.gender === 'F';
  const modelPath = isFemale ? '/models/rp_posed_00178_29.glb' : '/models/Ch06_nonPBR.glb';

  const { scene } = useGLTF(modelPath);

  // Clone using SkeletonUtils to allow independent bone posing
  const clonedScene = SkeletonUtils.clone(scene);

  // Renderpeople models are exported with unit scale 0.001 (mm), raw height ~0.1725m.
  // Scale by 10 to bring to standard life-size 1.725m. Ch06 is already 1.825m in meters.
  const isRenderPeople = modelPath.includes('rp_posed');
  const isCh06 = modelPath.includes('Ch06');
  const baseModelScale = isRenderPeople ? 10 : 1;

  // Pose male model arms down from T-pose to natural standing casual pose
  if (!isFemale && isCh06) {
    const leftArm = clonedScene.getObjectByName('mixamorig9LeftArm');
    const rightArm = clonedScene.getObjectByName('mixamorig9RightArm');
    const leftForeArm = clonedScene.getObjectByName('mixamorig9LeftForeArm');
    const rightForeArm = clonedScene.getObjectByName('mixamorig9RightForeArm');

    if (leftArm && rightArm) {
      leftArm.rotation.set(0, 0, 0);
      rightArm.rotation.set(0, 0, 0);
      leftArm.rotateX(1.25);
      rightArm.rotateX(1.25);
      if (leftForeArm) leftForeArm.rotateX(0.15);
      if (rightForeArm) rightForeArm.rotateX(0.15);
    }
  }

  // ── Body scale from height/weight/shape ──────────────────────────────────
  const shape = BODY_SHAPES[avatarConfig.bodyShape] || BODY_SHAPES.M;
  const heightScale = THREE.MathUtils.mapLinear(avatarConfig.height, 140, 215, 0.86, 1.14);
  const widthScale  = shape.torsoScale[0] *
    THREE.MathUtils.mapLinear(avatarConfig.weight, 40, 160, 0.88, 1.18);

  // Apply materials (preserve textures for photorealistic models)
  clonedScene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow    = true;
      child.receiveShadow = true;

      if (child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
          mat.roughness = 0.55;
          mat.metalness = 0.02;
          if (mat.name && mat.name.toLowerCase().includes('eyelashes')) {
            mat.transparent = true;
            mat.alphaTest = 0.15;
            mat.depthWrite = true;
          }
        });
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
        <primitive
          object={clonedScene}
          scale={[baseModelScale, baseModelScale, baseModelScale]}
        />

        {/* 3D Contoured Folded Clothing */}
        {clothItems.map((item) => (
          <ClothItem3D
            key={item.id}
            item={item}
            scale={1}
            gender={isFemale ? 'Female' : 'Male'}
          />
        ))}
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
        <meshStandardMaterial color="#e53535" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <torusGeometry args={[0.18, 0.03, 10, 36]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#e53535" roughness={0.3} metalness={0.6} />
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
      {/* Background — matches dark charcoal theme */}
      <color attach="background" args={['#191d1e']} />
      <fog attach="fog" args={['#191d1e', 8, 20]} />

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

      {/* Subtle warm floor bounce */}
      <pointLight position={[0, -0.1, 1.2]} intensity={0.6} color="#d0b8a0" distance={4} />

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
      <gridHelper args={[8, 22, '#2e3638', '#242b2d']} position={[0, -0.03, 0]} />
    </Canvas>
  );
}
