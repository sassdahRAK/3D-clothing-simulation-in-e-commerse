import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import BrowseAndPick from './components/BrowseAndPick';
import CheckOutfit from './components/CheckOutfit';
import ChooseBase from './components/ChooseBase';
import ScanBody from './components/ScanBody';
import InputInfo from './components/InputInfo';
import Preview3D from './components/Preview3D';
import CartScreen from './components/CartScreen';
import { CLOTHES } from './data/clothes';
import './index.css';

// ─── Step slide transition ─────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit:  (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
};

export default function App() {
  const [step, setStep]           = useState(1);
  const [direction, setDirection] = useState(1);
  const [selectedItems, setSelectedItems] = useState([CLOTHES[0], CLOTHES[1]]);
  const [avatarConfig, setAvatarConfig]   = useState({
    skinTone: '#F3D2B5',
    bodyShape: 'Inverted Triangle',
    height: 175,
    weight: 70,
    gender: 'Female',
    fit: 'Regular',
  });

  function goToStep(nextStep) {
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
  }

  const STEP_LABELS   = ['Browse', 'Outfit', 'Avatar', 'Scan', 'Info', '3D', 'Cart'];
  const VISIBLE_STEPS = [1, 2, 3, 5, 6, 7];

  return (
    <div className="min-h-screen flex flex-col bg-bg relative overflow-hidden">

      {/* ── Ambient decorative orbs ── */}
      <div className="ambient-orb-red" />
      <div className="ambient-orb-warm" />

      {/* ── Top Nav ── */}
      <header className="flex flex-col px-4 pt-3 pb-0 border-b border-border bg-glass-bg backdrop-blur-[16px] sticky top-0 z-[100]">

        {/* Brand row */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-3">
            {/* Live indicator — pulsing dot */}
            <div className="relative w-3 h-3 flex items-center justify-center">
              <div className="w-2 h-2 bg-accent rounded-full shadow-[0_0_8px_var(--color-accent-glow)] animate-pulse-glow relative z-10" />
              <div className="absolute inset-0 bg-accent rounded-full animate-ping-slow" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bebas text-[1.05rem] tracking-[0.08em] text-text-primary">UNIPRENEUR</span>
              <span className="w-px h-3 bg-border" />
              <span className="font-bebas text-[1.05rem] tracking-[0.08em] text-accent">FITTING ROOM</span>
            </div>
          </div>

          {/* Selected items badge */}
          <AnimatePresence>
            {selectedItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-accent/10 border border-accent/25 rounded-full"
              >
                <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                <span className="text-[0.6rem] font-inter font-semibold text-accent tracking-wide">
                  {selectedItems.length} ITEM{selectedItems.length !== 1 ? 'S' : ''}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step runway progress */}
        <div className="relative flex items-start pb-3.5 overflow-x-auto">
          {/* Background track */}
          <div className="absolute left-3 right-3 h-px bg-border top-[11px] pointer-events-none" />

          {VISIBLE_STEPS.map((s, i) => {
            const isActive = step === s || (s === 3 && step === 4);
            const isDone   = VISIBLE_STEPS.indexOf(step) > i && !(s === 3 && step === 4);
            return (
              <div key={s} className="flex items-start shrink-0 relative z-10">
                <div className="flex flex-col items-center gap-1 px-2.5">
                  <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center transition-all duration-250 ${
                    isActive
                      ? 'bg-accent text-white shadow-[0_0_14px_var(--color-accent-glow)] scale-110'
                      : isDone
                      ? 'bg-surface-3 border border-border'
                      : 'bg-surface border border-border'
                  }`}>
                    {isDone
                      ? <Check size={10} strokeWidth={3} className="text-text-secondary" />
                      : <span className="text-[0.55rem] font-bebas">{i + 1}</span>
                    }
                  </div>
                  <span className={`text-[0.52rem] font-inter font-medium tracking-[0.06em] whitespace-nowrap transition-colors duration-200 ${
                    isActive ? 'text-accent' : isDone ? 'text-text-muted' : 'text-text-muted/40'
                  }`}>
                    {STEP_LABELS[s - 1]}
                  </span>
                </div>
                {i < VISIBLE_STEPS.length - 1 && (
                  <div className={`w-6 h-px mt-[11px] transition-colors duration-300 ${isDone ? 'bg-surface-3' : 'bg-border'}`} />
                )}
              </div>
            );
          })}
        </div>
      </header>

      {/* ── Animated Step Screens ── */}
      <div className="flex-1 overflow-hidden relative z-[1]">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.26, ease: 'easeInOut' }} className="absolute inset-0 overflow-y-auto">
              <BrowseAndPick selectedItems={selectedItems} onSelect={setSelectedItems} onNext={() => goToStep(2)} />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.26, ease: 'easeInOut' }} className="absolute inset-0 overflow-y-auto">
              <CheckOutfit selectedItems={selectedItems} onBack={() => goToStep(1)} onNext={() => goToStep(3)} />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.26, ease: 'easeInOut' }} className="absolute inset-0 overflow-y-auto">
              <ChooseBase avatarConfig={avatarConfig} onAvatarChange={setAvatarConfig} onScan={() => goToStep(4)} onBack={() => goToStep(2)} onNext={() => goToStep(5)} />
            </motion.div>
          )}
          {step === 4 && (
            <motion.div key="step4" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.26, ease: 'easeInOut' }} className="absolute inset-0 overflow-y-auto">
              <ScanBody onBack={() => goToStep(3)} onNext={() => goToStep(5)} />
            </motion.div>
          )}
          {step === 5 && (
            <motion.div key="step5" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.26, ease: 'easeInOut' }} className="absolute inset-0 overflow-y-auto">
              <InputInfo avatarConfig={avatarConfig} onAvatarChange={setAvatarConfig} onBack={() => goToStep(2)} onNext={() => goToStep(6)} />
            </motion.div>
          )}
          {step === 6 && (
            <motion.div key="step6" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.26, ease: 'easeInOut' }} className="absolute inset-0 overflow-y-auto">
              <Preview3D selectedItems={selectedItems} avatarConfig={avatarConfig} onBack={() => goToStep(2)} onNext={() => goToStep(7)} />
            </motion.div>
          )}
          {step === 7 && (
            <motion.div key="step7" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.26, ease: 'easeInOut' }} className="absolute inset-0 overflow-y-auto">
              <CartScreen selectedItems={selectedItems} onShopMore={() => goToStep(1)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
