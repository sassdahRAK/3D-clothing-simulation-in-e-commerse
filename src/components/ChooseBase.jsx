import { motion } from 'framer-motion';

const GuySVG = () => (
  <svg width="32" height="64" viewBox="0 0 40 80" className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    {/* Head */}
    <circle cx="20" cy="14" r="7" fill="#F3D2B5" />
    {/* Hair */}
    <path d="M 13 13 C 13 4, 27 4, 27 13 Z" fill="#5D4037" />
    {/* Shirt */}
    <rect x="13" y="22" width="14" height="20" rx="2" fill="#00BFA5" />
    {/* Sleeves */}
    <rect x="9" y="23" width="6" height="10" rx="2" fill="#00BFA5" />
    <rect x="25" y="23" width="6" height="10" rx="2" fill="#00BFA5" />
    {/* Arms */}
    <rect x="10" y="32" width="4" height="14" rx="2" fill="#F3D2B5" />
    <rect x="26" y="32" width="4" height="14" rx="2" fill="#F3D2B5" />
    {/* Pants */}
    <rect x="14" y="42" width="5.5" height="24" fill="#757575" />
    <rect x="20.5" y="42" width="5.5" height="24" fill="#757575" />
    {/* Shoes */}
    <rect x="13" y="66" width="7" height="4" rx="2" fill="#424242" />
    <rect x="20" y="66" width="7" height="4" rx="2" fill="#424242" />
  </svg>
);

const UserIcon = () => (
  <svg width="48" height="64" viewBox="0 0 60 80" className="mb-2">
    <circle cx="30" cy="25" r="16" fill="#1976D2" />
    <path d="M 10 70 C 10 45, 50 45, 50 70 Z" fill="#1976D2" />
  </svg>
);

const SHAPES = [
  { 
    id: 'Inverted Triangle', 
    shapeSvg: <svg width="60" height="60" viewBox="0 0 100 100"><polygon points="5,5 95,5 50,95" fill="#B3E5FC" opacity="0.8"/></svg> 
  },
  { 
    id: 'Rectangle', 
    shapeSvg: <svg width="60" height="60" viewBox="0 0 100 100"><rect x="20" y="5" width="60" height="90" fill="#C8E6C9" opacity="0.8"/></svg> 
  },
  { 
    id: 'Trapezoid', 
    shapeSvg: <svg width="60" height="60" viewBox="0 0 100 100"><polygon points="10,5 90,5 75,95 25,95" fill="#FFF9C4" opacity="0.8"/></svg> 
  },
  { 
    id: 'Triangle', 
    shapeSvg: <svg width="60" height="60" viewBox="0 0 100 100"><polygon points="50,5 95,95 5,95" fill="#E1BEE7" opacity="0.8"/></svg> 
  },
  { 
    id: 'Oval', 
    shapeSvg: <svg width="60" height="60" viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="35" ry="45" fill="#B2EBF2" opacity="0.8"/></svg> 
  },
  { 
    id: 'Custom', 
    label: 'Select from photo', 
    isCustom: true 
  },
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
    <div className="h-full flex flex-col p-6 pb-[120px]">
      
      {/* ── Title ── */}
      <h1 className="font-bebas text-[2.5rem] tracking-[0.05em] mb-5">
        CHOOSE YOUR 3D BASE
      </h1>

      {/* ── Tabs ── */}
      <div className="flex gap-2 mb-6">
        <button
          className="flex-1 py-3 px-4 bg-accent text-charcoal border-none rounded font-bebas text-[1.1rem] cursor-pointer"
        >
          SELECT AVATAR
        </button>
        <button
          onClick={onScan}
          className="flex-1 py-3 px-4 bg-surface text-text-secondary border border-border rounded font-bebas text-[1.1rem] cursor-pointer"
        >
          SCAN BODY SHAPE
        </button>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-3 gap-3">
        {SHAPES.map((shape) => {
          const isSelected = currentShape === shape.id;
          return (
            <motion.div
              whileTap={{ scale: 0.95 }}
              key={shape.id}
              onClick={() => selectShape(shape.id)}
              className={`bg-surface rounded-lg p-4 py-4 flex flex-col items-center justify-center gap-3 cursor-pointer text-center aspect-[0.7] ${
                isSelected 
                  ? 'border-2 border-accent shadow-[0_0_12px_var(--color-accent-glow)]' 
                  : 'border border-border'
              }`}
            >
              <div className="relative w-[60px] h-[60px] flex items-center justify-center">
                {shape.isCustom ? (
                  <UserIcon />
                ) : (
                  <>
                    <div className="absolute z-0">
                      {shape.shapeSvg}
                    </div>
                    <GuySVG />
                  </>
                )}
              </div>
              <div className={`text-xs font-semibold leading-tight ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
                {shape.label || shape.id}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Bottom Fixed Buttons ── */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg from-80% to-transparent flex flex-col items-center gap-3 pointer-events-none">
        <button 
          onClick={onNext}
          className="inline-flex items-center justify-center gap-2 rounded bg-accent text-charcoal font-bebas text-[1.4rem] tracking-[0.05em] cursor-pointer outline-none transition-all duration-200 ease-out whitespace-nowrap hover:bg-accent-dim hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(94,220,134,0.25)] active:translate-y-0 disabled:opacity-35 disabled:cursor-not-allowed disabled:transform-none w-full max-w-[400px] pointer-events-auto p-4 border-none"
        >
          USE THIS AVATAR →
        </button>
        <button 
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded bg-transparent text-text-secondary border border-transparent font-bebas text-[1.1rem] tracking-[0.05em] cursor-pointer outline-none transition-all duration-200 ease-out whitespace-nowrap hover:bg-glass-hover hover:text-text-primary hover:border-white/15 pointer-events-auto"
        >
          ← BACK TO OUTFIT CHECK
        </button>
      </div>
    </div>
  );
}
