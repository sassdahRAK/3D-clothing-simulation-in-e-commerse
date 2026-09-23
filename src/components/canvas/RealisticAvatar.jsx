import { useRef, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';
import { BODY_SHAPES } from '../../data/clothes';
import { ClothItem3D } from './Cloth3D';

useGLTF.preload('/models/rp_posed_00178_29.glb');
useGLTF.preload('/models/Ch06_nonPBR.glb');

export default function RealisticAvatar({ avatarConfig, selectedItems = [], ...props }) {
  const group = useRef();

  // Support female photogrammetry scan (rp_posed) and male human model (Ch06_nonPBR)
  const isFemale =
    !avatarConfig ||
    avatarConfig.gender === 'Female' ||
    avatarConfig.gender === 'F';
  const modelPath = isFemale ? '/models/rp_posed_00178_29.glb' : '/models/Ch06_nonPBR.glb';

  const { scene } = useGLTF(modelPath);

  // Use SkeletonUtils.clone to properly clone skinned meshes & bones independently
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // Renderpeople models are exported with unit scale 0.001 (mm), raw height ~0.1725m.
  // Scale by 10 to bring to standard life-size 1.725m. Ch06 is already 1.825m in meters (scale 1).
  const isRenderPeople = modelPath.includes('rp_posed');
  const baseModelScale = isRenderPeople ? 10 : 1;

  // Body scale adjustments based on user height, weight, and shape
  const shape = (avatarConfig && BODY_SHAPES[avatarConfig.bodyShape]) || BODY_SHAPES.M;
  const heightScale = avatarConfig?.height
    ? THREE.MathUtils.mapLinear(avatarConfig.height, 140, 215, 0.86, 1.14)
    : 1.0;
  const widthScale = avatarConfig?.weight
    ? (shape.torsoScale ? shape.torsoScale[0] : 1.0) *
      THREE.MathUtils.mapLinear(avatarConfig.weight, 40, 160, 0.88, 1.18)
    : 1.0;

  // Apply natural standing pose and realistic materials
  useEffect(() => {
    // For male model (Ch06_nonPBR), pose arms down from T-pose to natural standing casual pose
    if (!isFemale) {
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

    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
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
  }, [clonedScene, isFemale]);

  // Selected clothing items to overlay on the avatar
  const fullItem = selectedItems.find((i) => ['full', 'dress', 'set'].includes(i.bodyPart || i.category));
  const torsoItem = !fullItem && selectedItems.find((i) => ['torso', 'top', 'jacket'].includes(i.bodyPart || i.category));
  const bottomItem = !fullItem && selectedItems.find((i) => ['legs', 'lower', 'pants', 'shorts'].includes(i.bodyPart || i.category));
  const clothItems = [fullItem, torsoItem, bottomItem].filter(Boolean);

  const genderStr = isFemale ? 'Female' : 'Male';

  return (
    <group ref={group} {...props} dispose={null}>
      <group scale={[widthScale, heightScale, widthScale]}>
        <primitive
          object={clonedScene}
          scale={[baseModelScale, baseModelScale, baseModelScale]}
        />

        {clothItems.map((item) => (
          <ClothItem3D
            key={item.id}
            item={item}
            scale={1}
            gender={genderStr}
          />
        ))}
      </group>
    </group>
  );
}
