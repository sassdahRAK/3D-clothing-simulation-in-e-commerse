import { motion } from 'framer-motion';

const GuySVG = () => (
  <svg width="32" height="64" viewBox="0 0 40 80" className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <circle cx="20" cy="14" r="7" fill="#F3D2B5" />
    <path d="M 13 13 C 13 4, 27 4, 27 13 Z" fill="#5D4037" />
    <rect x="13" y="22" width="14" height="20" rx="2" fill="#00BFA5" />
    <rect x="9" y="23" width="6" height="10" rx="2" fill="#00BFA5" />
    <rect x="25" y="23" width="6" height="10" rx="2" fill="#00BFA5" />
    <rect x="10" y="32" width="4" height="14" rx="2" fill="#F3D2B5" />
    <rect x="26" y="32" width="4" height="14" rx="2" fill="#F3D2B5" />
    <rect x="14" y="42" width="5.5" height="24" fill="#757575" />
    <rect x="20.5" y="42" width="5.5" height="24" fill="#757575" />
    <rect x="13" y="66" width="7" height="4" rx="2" fill="#424242" />
    <rect x="20" y="66" width="7" height="4" rx="2" fill="#424242" />
  </svg>
);

const UserIcon = () => (
  <svg width="40" height="52" viewBox="0 0 60 80" className="mb-1">
    <circle cx="30" cy="25" r="16" fill="var(--color-accent)" opacity="0.7" />
    <path d="M 10 70 C 10 45, 50 45, 50 70 Z" fill="var(--color-accent)" opacity="0.7" />
  </svg>
);

const SHAPES = [
  { id: 'Inverted Triangle', shapeSvg: <svg width="52" height="52" viewBox="0 0 100 100"><polygon points="5,5 95,5 50,95" fill="#B3E5FC" opacity="0.7"/></svg> },
  { id: 'Rectangle', shapeSvg: <svg width="52" height="52" viewBox="0 0 100 100"><rect x="20" y="5" width="60" height="90" fill="#C8E6C9" opacity="0.7"/></svg> },
  { id: 'Trapezoid', shapeSvg: <svg width="52" height="52" viewBox="0 0 100 100"><polygon points="10,5 90,5 75,95 25,95" fill="#FFF9C4" opacity="0.7"/></svg> },
  { id: 'Triangle', shapeSvg: <svg width="52" height="52" viewBox="0 0 100 100"><polygon points="50,5 95,95 5,95" fill="#E1BEE7" opacity="0.7"/></svg> },
  { id: 'Oval', shapeSvg: <svg width="52" height="52" viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="35" ry="45" fill="#B2EBF2" opacity="0.7"/></svg> },
  { id: 'Custom', label: 'Scan Body', isCustom: true },
];

export default function ChooseBase({ avatarConfig, onAvatarChange, onScan, onBack, onNext }) {
  const currentShape = avatarConfig.bodyShape;

  function selectShape(id) {
    if (id === 'Custom') {
      onScan();
    } else {
      onAvatarChange({ ...avatarConfig, bodyShape: id });
    }
  }

  return (
    <div className="min-h-full flex flex-col p-4 sm:p-6 pb-safe-nav">

      {/* ── Editorial Header ── */}
      <div className="mb-4">
        <span className="editorial-tag block mb-2">Step 3 of 6 — Avatar</span>
        <h1 className="font-bebas text-[2.8rem] sm:text-[3.4rem] tracking-[0.02em] leading-none">
          CHOOSE YOUR <span className="text-accent">3D BASE</span>
        </h1>
        <p className="text-text-muted text-[0.78rem] font-inter mt-1.5">
          Pick a body shape or scan yourself for a precise fit
        </p>
      </div>

      <div className="section-line mb-4" />

      {/* ── Mode Tabs ── */}
      <div className="flex gap-1.5 mb-5 p-1 bg-surface rounded-xl">
        <button className="flex-1 py-2.5 px-4 bg-surface-3 text-text-primary border-none rounded-lg font-bebas text-[0.95rem] cursor-pointer tracking-wide">
          SELECT SHAPE
        </button>
        <button
          onClick={onScan}
          className="flex-1 py-2.5 px-4 bg-transparent text-text-secondary border-none rounded-lg font-bebas text-[0.95rem] cursor-pointer hover:text-text-primary transition-colors tracking-wide"
        >
          SCAN BODY
        </button>
      </div>

      {/* ── Shape Grid ── */}
      <div className="grid grid-cols-3 gap-3">
        {SHAPES.map((shape) => {
          const isSelected = currentShape === shape.id;
          return (
            <motion.div
              whileTap={{ scale: 0.95 }}
              key={shape.id}
              onClick={() => selectShape(shape.id)}
              className={`rounded-2xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer text-center aspect-[0.8] transition-all duration-200 card-lift ${
                isSelected
                  ? 'border-2 border-accent shadow-[0_0_18px_var(--color-accent-glass)] bg-accent/[0.04]'
                  : 'border border-border bg-surface'
              }`}
            >
              <div className="relative w-[56px] h-[56px] flex items-center justify-center">
                {shape.isCustom ? (
                  <UserIcon />
                ) : (
                  <>
                    <div className="absolute z-0">{shape.shapeSvg}</div>
                    <GuySVG />
                  </>
                )}
              </div>
              <div className={`text-[0.68rem] font-inter font-semibold leading-tight ${isSelected ? 'text-accent' : 'text-text-secondary'}`}>
                {shape.label || shape.id}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Bottom Fixed Buttons ── */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pt-8 pb-safe bg-gradient-to-t from-bg via-bg/90 to-transparent flex flex-col items-center gap-2 pointer-events-none">
        <button
          onClick={onNext}
          className="w-full max-w-[480px] flex items-center justify-center gap-2 rounded-2xl bg-accent text-white font-bebas text-[1.25rem] tracking-[0.08em] py-4 cursor-pointer border-none transition-all duration-200 shadow-[0_6px_28px_var(--color-accent-glow)] hover:bg-accent-dim active:scale-[0.98] pointer-events-auto"
        >
          USE THIS AVATAR →
        </button>
        <button
          onClick={onBack}
          className="py-3 px-4 font-inter text-[0.85rem] font-medium text-text-secondary cursor-pointer bg-transparent border-none pointer-events-auto hover:text-text-primary transition-colors duration-150"
        >
          ← Back to outfit check
        </button>
      </div>
    </div>
  );
}
