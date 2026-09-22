import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RealisticAvatar from './canvas/RealisticAvatar';
import CinematicLighting from './canvas/CinematicLighting';
import PostProcessing from './canvas/PostProcessing';

export default function Preview3D({ selectedItems, avatarConfig, onBack, onNext }) {
  const [size, setSize] = useState('M');
  const SIZES = ['S', 'M', 'L', 'XL'];

  return (
    <div className="h-full flex flex-col p-6 pb-[120px]">
      
      {/* ── Title ── */}
      <h1 className="font-bebas text-[2.5rem] tracking-[0.05em] mb-5">
        3D PREVIEW - 360° VIEW
      </h1>

      {/* ── 3D Viewfinder & Controls ── */}
      <div className="flex-1 bg-surface rounded-xl relative flex items-center justify-center overflow-hidden border border-border">
        
        {/* Actual 3D Canvas */}
        <Canvas 
          shadows 
          camera={{ position: [0, 1.5, 3], fov: 45 }}
          className="w-full h-full"
        >
          <CinematicLighting />
          
          <RealisticAvatar 
            position={[0, -1, 0]} 
            avatarConfig={avatarConfig} 
            selectedItems={selectedItems} 
          />
          
          <OrbitControls 
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            minDistance={1.5}
            maxDistance={5}
          />
          
          <PostProcessing />
        </Canvas>

        {/* 360 Icon */}
        <div className="absolute top-4 left-4 text-3xl opacity-50">
          🔄
        </div>

        {/* Right Side Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-3 items-center">
          {/* Small thumbnail of selected top item */}
          {selectedItems[0] && (
            <div className="w-12 h-12 bg-bg rounded-lg border border-border flex items-center justify-center text-2xl overflow-hidden">
              {selectedItems[0].image ? (
                <img src={selectedItems[0].image} alt={selectedItems[0].name} className="w-full h-full object-cover" />
              ) : (
                selectedItems[0].category === 'jacket' ? '🧥' : selectedItems[0].category === 'pants' ? '👖' : '👕'
              )}
            </div>
          )}
          
          {/* Size Selector */}
          <div className="bg-bg rounded-full p-1 flex flex-col gap-1 border border-border">
            {SIZES.map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`w-9 h-9 rounded-full border-none font-bebas text-[1.1rem] cursor-pointer ${
                  size === s ? 'bg-accent text-charcoal' : 'bg-transparent text-text-secondary'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* ── Bottom Fixed Buttons ── */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg from-80% to-transparent flex flex-col items-center gap-3 pointer-events-none">
        <button 
          onClick={onNext}
          className="inline-flex items-center justify-center gap-2 rounded bg-accent text-charcoal font-bebas text-[1.4rem] tracking-[0.05em] cursor-pointer outline-none transition-all duration-200 ease-out whitespace-nowrap hover:bg-accent-dim hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(94,220,134,0.25)] active:translate-y-0 disabled:opacity-35 disabled:cursor-not-allowed disabled:transform-none w-full max-w-[400px] pointer-events-auto p-4 border-none"
        >
          ADD TO CART
        </button>
        <button 
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded bg-transparent text-text-secondary border border-transparent font-bebas text-[1.1rem] tracking-[0.05em] cursor-pointer outline-none transition-all duration-200 ease-out whitespace-nowrap hover:bg-glass-hover hover:text-text-primary hover:border-white/15 pointer-events-auto"
        >
          ← ADJUST OUTFIT
        </button>
      </div>
    </div>
  );
}
