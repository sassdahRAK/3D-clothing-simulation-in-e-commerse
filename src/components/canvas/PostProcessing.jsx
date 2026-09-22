import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing';

export default function PostProcessing() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom 
        intensity={0.35} 
        luminanceThreshold={0.85} 
        luminanceSmoothing={0.2} 
      />
      <Vignette 
        offset={0.3} 
        darkness={0.4} 
        eskil={false} 
      />
      <ToneMapping />
    </EffectComposer>
  );
}
