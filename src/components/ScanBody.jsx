import { useState } from 'react';

export default function ScanBody({ onBack, onNext }) {
  const [isScanning, setIsScanning] = useState(false);

  function handleScan() {
    setIsScanning(true);
    // Simulate a scan delay before moving to next screen
    setTimeout(() => {
      onNext();
    }, 2000);
  }

  return (
    <div className="h-full flex flex-col p-6 pb-[120px]">
      
      {/* ── Title ── */}
      <h1 className="font-bebas text-[2.5rem] tracking-[0.05em] mb-5">
        CHOOSE YOUR 3D BASE
      </h1>

      {/* ── Tabs ── */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-4 bg-surface text-text-secondary border border-border rounded font-bebas text-[1.1rem] cursor-pointer"
        >
          SELECT AVATAR
        </button>
        <button
          className="flex-1 py-3 px-4 bg-accent text-charcoal border-none rounded font-bebas text-[1.1rem] cursor-pointer"
        >
          SCAN BODY SHAPE
        </button>
      </div>

      {/* ── Viewfinder ── */}
      <div className="flex-1 bg-surface rounded-xl relative flex items-center justify-center overflow-hidden border border-border">
        {/* Fake Camera Feed (Silhouette) */}
        <div className="text-[10rem] opacity-50">👤</div>
        
        {/* Red Frame Overlay */}
        <div className="absolute inset-[10%] border-2 border-red-500 pointer-events-none" />

        {/* HUD UI */}
        <div className="absolute top-4 left-4 font-bebas text-[#4db8ff] text-[1.5rem] tracking-[0.05em]">
          FULL BODY<br/>SCAN 360
        </div>
        
        <div className="absolute top-4 right-4 bg-black/60 px-3 py-2 rounded-lg text-xs text-white max-w-[120px] text-right">
          Please place your phone at hip height and frame your entire body.
        </div>

        {/* Scan Line Animation */}
        {isScanning && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-accent shadow-[0_0_10px_var(--color-accent)] animate-scan-line" />
        )}
      </div>

      {/* ── Bottom Fixed Buttons ── */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg from-80% to-transparent flex flex-col items-center gap-3 pointer-events-none">
        <button 
          onClick={handleScan}
          disabled={isScanning}
          className="w-20 h-20 rounded-full bg-accent border-4 border-bg shadow-[0_0_0_4px_var(--color-accent),0_0_20px_var(--color-accent-glow)] pointer-events-auto cursor-pointer flex items-center justify-center"
        >
          {isScanning ? '...' : ''}
        </button>
        <button 
          onClick={onBack}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded bg-transparent text-text-secondary border border-transparent font-bebas text-[1.1rem] tracking-[0.05em] cursor-pointer outline-none transition-all duration-200 ease-out whitespace-nowrap hover:bg-glass-hover hover:text-text-primary hover:border-white/15 pointer-events-auto"
        >
          ← BACK TO AVATAR SELECT
        </button>
      </div>
    </div>
  );
}
