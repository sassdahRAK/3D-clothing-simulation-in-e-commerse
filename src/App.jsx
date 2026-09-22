import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BrowseAndPick from './components/BrowseAndPick';
import CheckOutfit from './components/CheckOutfit';
import ChooseBase from './components/ChooseBase';
import ScanBody from './components/ScanBody';
import InputInfo from './components/InputInfo';
import Preview3D from './components/Preview3D';
import CartScreen from './components/CartScreen';
import './index.css';

// ─── Step slide transition config ─────────────────────────────────────────────
const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
  center: { opacity: 1, x: 0 },
  exit:  (dir) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
};

export default function App() {
  const [step, setStep] = useState(1);       // 1 to 7
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  // Items the user has selected from the catalog
  const [selectedItems, setSelectedItems] = useState([]);

  // Avatar customization config passed into steps
  const [avatarConfig, setAvatarConfig] = useState({
    skinTone: '#F3D2B5',
    bodyShape: 'Inverted Triangle',
    height: 175,
    weight: 70,
    gender: 'Male',
    fit: 'Regular',
  });

  // ── Navigation helpers ──────────────────────────────────────────────────────
  function goToStep(nextStep) {
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* ── Top Nav ─── */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-glass-bg backdrop-blur-[12px] sticky top-0 z-[100]">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 bg-accent rounded-full shadow-[0_0_8px_var(--color-accent-glow)]" />
          <span className="font-bebas text-lg tracking-[0.05em] text-text-primary">
            UniPreneur Digital Fitting Room
          </span>
        </div>
      </header>

      {/* ── Animated Step Screens ─── */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute inset-0 overflow-y-auto">
              <BrowseAndPick selectedItems={selectedItems} onSelect={setSelectedItems} onNext={() => goToStep(2)} />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute inset-0 overflow-y-auto">
              <CheckOutfit selectedItems={selectedItems} onBack={() => goToStep(1)} onNext={() => goToStep(3)} />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute inset-0 overflow-y-auto">
              <ChooseBase avatarConfig={avatarConfig} onAvatarChange={setAvatarConfig} onScan={() => goToStep(4)} onBack={() => goToStep(2)} onNext={() => goToStep(5)} />
            </motion.div>
          )}
          {step === 4 && (
            <motion.div key="step4" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute inset-0 overflow-y-auto">
              <ScanBody onBack={() => goToStep(3)} onNext={() => goToStep(5)} />
            </motion.div>
          )}
          {step === 5 && (
            <motion.div key="step5" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute inset-0 overflow-y-auto">
              <InputInfo avatarConfig={avatarConfig} onAvatarChange={setAvatarConfig} onBack={() => goToStep(2)} onNext={() => goToStep(6)} />
            </motion.div>
          )}
          {step === 6 && (
            <motion.div key="step6" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute inset-0 overflow-y-auto">
              <Preview3D selectedItems={selectedItems} avatarConfig={avatarConfig} onBack={() => goToStep(2)} onNext={() => goToStep(7)} />
            </motion.div>
          )}
          {step === 7 && (
            <motion.div key="step7" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute inset-0 overflow-y-auto">
              <CartScreen selectedItems={selectedItems} onShopMore={() => goToStep(1)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
