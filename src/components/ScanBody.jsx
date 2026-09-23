import { useState } from 'react';
import { User } from 'lucide-react';

export default function ScanBody({ onBack, onNext }) {
  const [isScanning, setIsScanning] = useState(false);

  function handleScan() {
    setIsScanning(true);
    setTimeout(() => {
      onNext();
    }, 2000);
  }

  return (
    <div className="min-h-full flex flex-col p-4 sm:p-6 pb-safe-nav">

      {/* ── Editorial Header ── */}
      <div className="mb-4">
        <span className="editorial-tag block mb-2">Step 3 of 6 — Body Scan</span>
        <h1 className="font-bebas text-[2.8rem] sm:text-[3.4rem] tracking-[0.02em] leading-none">
          SCAN <span className="text-accent">YOUR BODY</span>
        </h1>
        <p className="text-text-muted text-[0.78rem] font-inter mt-1.5">
          Place your phone at hip height and frame your full body
        </p>
      </div>

      <div className="section-line mb-4" />

      {/* ── Mode Tabs ── */}
      <div className="flex gap-1.5 mb-5 p-1 bg-surface rounded-xl">
        <button
          onClick={onBack}
          className="flex-1 py-2.5 px-4 bg-transparent text-text-secondary border-none rounded-lg font-bebas text-[0.95rem] cursor-pointer hover:text-text-primary transition-colors tracking-wide"
        >
          SELECT SHAPE
        </button>
        <button className="flex-1 py-2.5 px-4 bg-surface-3 text-text-primary border-none rounded-lg font-bebas text-[0.95rem] cursor-pointer tracking-wide">
          SCAN BODY
        </button>
      </div>

      {/* ── Viewfinder ── */}
      <div
        className="flex-1 rounded-2xl relative flex items-center justify-center overflow-hidden border border-border min-h-[260px]"
        style={{ background: 'linear-gradient(160deg, var(--color-surface) 0%, var(--color-surface-2) 100%)' }}
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(var(--color-text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-primary) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Silhouette */}
        <User size={110} className="text-text-muted opacity-25" />

        {/* Scanner frame */}
        <div className="absolute inset-[10%] border border-accent/40 rounded-xl pointer-events-none" />

        {/* Corner accents */}
        {[
          'top-[10%] left-[10%] border-t-2 border-l-2',
          'top-[10%] right-[10%] border-t-2 border-r-2',
          'bottom-[10%] left-[10%] border-b-2 border-l-2',
          'bottom-[10%] right-[10%] border-b-2 border-r-2',
        ].map((cls) => (
          <div key={cls} className={`absolute w-5 h-5 border-accent pointer-events-none ${cls}`} />
        ))}

        {/* HUD: top-left label */}
        <div className="absolute top-4 left-4 font-bebas text-accent text-[1.1rem] tracking-[0.06em] leading-tight">
          FULL BODY<br />SCAN 360
        </div>

        {/* HUD: top-right instructions */}
        <div className="absolute top-4 right-4 bg-bg/55 backdrop-blur-sm px-2.5 py-2 rounded-xl text-[0.62rem] text-text-secondary max-w-[110px] text-right leading-relaxed font-inter border border-border/40">
          Frame your full body. Keep still.
        </div>

        {/* Scan line animation */}
        {isScanning && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent shadow-[0_0_12px_var(--color-accent)] animate-scan-line" />
        )}

        {/* Status pill bottom-center */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-bg/60 backdrop-blur-sm rounded-full border border-border/40">
          <div className={`w-1.5 h-1.5 rounded-full ${isScanning ? 'bg-accent animate-pulse' : 'bg-text-muted'}`} />
          <span className="text-[0.58rem] font-inter font-medium text-text-muted tracking-wide">
            {isScanning ? 'SCANNING...' : 'READY'}
          </span>
        </div>
      </div>

      {/* ── Bottom Fixed Buttons ── */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pt-8 pb-safe bg-gradient-to-t from-bg via-bg/90 to-transparent flex flex-col items-center gap-3 pointer-events-none">
        <button
          onClick={handleScan}
          disabled={isScanning}
          className="w-20 h-20 rounded-full bg-accent border-4 border-bg shadow-[0_0_0_3px_var(--color-accent),0_0_24px_var(--color-accent-glow)] pointer-events-auto cursor-pointer flex items-center justify-center text-white font-bebas text-[0.75rem] tracking-wide transition-all duration-200 disabled:opacity-60 active:scale-95"
        >
          {isScanning ? '...' : 'SCAN'}
        </button>
        <button
          onClick={onBack}
          className="py-3 px-4 font-inter text-[0.85rem] font-medium text-text-secondary cursor-pointer bg-transparent border-none pointer-events-auto hover:text-text-primary transition-colors duration-150"
        >
          ← Back to shape select
        </button>
      </div>
    </div>
  );
}
