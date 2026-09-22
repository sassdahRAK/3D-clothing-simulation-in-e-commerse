import { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function RealisticAvatar({ ...props }) {
  const group = useRef();
  // Using michelle.glb as a placeholder for our realistic avatar
  const { scene } = useGLTF('/models/michelle.glb');

  // Apply highly realistic materials when the scene loads
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          // Enable shadows
          child.castShadow = true;
          child.receiveShadow = true;

          // If the material is a StandardMaterial (like skin or fabric)
          if (child.material && child.material.isMeshStandardMaterial) {
            
            // Check if this is likely a skin material (heuristics based on typical naming)
            const isSkin = child.name.toLowerCase().includes('skin') || 
                           child.name.toLowerCase().includes('body') ||
                           child.name.toLowerCase().includes('face');

            if (isSkin) {
              // Upgrade skin to MeshPhysicalMaterial for subsurface scattering approximation
              const physicalSkin = new THREE.MeshPhysicalMaterial({
                map: child.material.map,
                normalMap: child.material.normalMap,
                color: child.material.color,
                roughness: 0.4, // Skin is slightly oily/rough
                metalness: 0.1,
                
                // Advanced Physical properties
                clearcoat: 0.1,         // Subtle sweat/oil reflection
                clearcoatRoughness: 0.2,
                
                // Transmission and thickness simulate light bleeding through skin (SSS)
                transmission: 0.1, 
                thickness: 0.5,
              });
              
              child.material = physicalSkin;
            } else {
              // For clothing/fabric, enhance roughness to look like cloth
              child.material.roughness = 0.8;
              // If we had a sheen map, we could use MeshPhysicalMaterial here too
            }
          }
        }
      });
    }
  }, [scene]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/models/michelle.glb');
