import { useState } from 'react';
import { RotateCcw, ZoomIn } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { ClothingIcon } from './ClothingIcon';
import { OrbitControls } from '@react-three/drei';
import RealisticAvatar from './canvas/RealisticAvatar';
import CinematicLighting from './canvas/CinematicLighting';
import PostProcessing from './canvas/PostProcessing';

export default function Preview3D({ selectedItems, avatarConfig, onBack, onNext }) {
  const [size, setSize] = useState('M');
  const SIZES = ['S', 'M', 'L', 'XL'];

  return (
    <div className="min-h-full flex flex-col p-4 sm:p-6 pb-safe-nav">

      {/* ── Editorial Header ── */}
      <div className="mb-4">
        <span className="editorial-tag block mb-2">Step 5 of 6 — 3D Preview</span>
        <h1 className="font-bebas text-[2.8rem] sm:text-[3.4rem] tracking-[0.02em] leading-none">
          3D PREVIEW <span className="text-accent">360°</span>
        </h1>
        <p className="text-text-muted text-[0.78rem] font-inter mt-1.5">
          Drag to rotate your avatar and inspect the fit from every angle
        </p>
      </div>

      <div className="section-line mb-4" />

      {/* ── 3D Viewport ── */}
      <div className="relative w-full h-[520px] max-h-[62vh] rounded-2xl overflow-hidden border border-border" style={{ background: 'linear-gradient(160deg, #131b1e 0%, #0d1214 100%)' }}>

        <Canvas
          shadows
          camera={{ position: [0, 0.85, 2.3], fov: 45 }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <CinematicLighting />
          <RealisticAvatar position={[0, 0, 0]} avatarConfig={avatarConfig} selectedItems={selectedItems} />
          <OrbitControls
            enablePan={false}
            target={[0, 0.85, 0]}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            minDistance={0.8}
            maxDistance={3.5}
          />
          <PostProcessing />
        </Canvas>

        {/* Top-left rotate hint */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-bg/60 backdrop-blur-sm rounded-xl border border-border/50">
          <RotateCcw size={12} className="text-text-muted" />
          <span className="text-[0.58rem] font-inter font-medium text-text-muted tracking-wide">DRAG TO ROTATE</span>
        </div>

        {/* Top-right: selected item thumbnail + size selector */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-center">
          {selectedItems[0] && (
            <div className="w-10 h-10 bg-bg/70 backdrop-blur-sm rounded-xl border border-border overflow-hidden">
              {selectedItems[0].image ? (
                <img src={selectedItems[0].image} alt={selectedItems[0].name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ClothingIcon category={selectedItems[0].category} size={20} className="text-text-muted" />
                </div>
              )}
            </div>
          )}

          <div className="bg-bg/70 backdrop-blur-sm rounded-xl p-1 flex flex-col gap-0.5 border border-border">
            {SIZES.map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`w-8 h-7 rounded-lg border-none font-bebas text-[0.85rem] cursor-pointer transition-all duration-150 ${
                  size === s ? 'bg-accent text-white shadow-[0_0_8px_var(--color-accent-glow)]' : 'bg-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom-left selected size pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-surface/80 backdrop-blur-sm rounded-full border border-border">
          <span className="text-[0.6rem] font-inter font-medium text-text-secondary">Size</span>
          <span className="text-[0.6rem] font-bebas text-accent tracking-wide">{size}</span>
        </div>
      </div>

      {/* ── Bottom Fixed Buttons ── */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pt-8 pb-safe bg-gradient-to-t from-bg via-bg/90 to-transparent flex flex-col items-center gap-2 pointer-events-none">
        <button
          onClick={onNext}
          className="w-full max-w-[480px] flex items-center justify-center gap-2 rounded-2xl bg-accent text-white font-bebas text-[1.25rem] tracking-[0.08em] py-4 cursor-pointer border-none transition-all duration-200 shadow-[0_6px_28px_var(--color-accent-glow)] hover:bg-accent-dim active:scale-[0.98] pointer-events-auto"
        >
          ADD TO CART →
        </button>
        <button
          onClick={onBack}
          className="py-3 px-4 font-inter text-[0.85rem] font-medium text-text-secondary cursor-pointer bg-transparent border-none pointer-events-auto hover:text-text-primary transition-colors duration-150"
        >
          ← Adjust outfit
        </button>
      </div>
    </div>
  );
}
