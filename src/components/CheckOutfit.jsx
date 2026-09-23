import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ClothingIcon } from './ClothingIcon';

export default function CheckOutfit({ selectedItems, onBack, onNext }) {
  const constraintsRef = useRef(null);

  return (
    <div className="min-h-full flex flex-col p-4 sm:p-6 pb-safe-nav">

      {/* ── Editorial Header ── */}
      <div className="mb-4">
        <span className="editorial-tag block mb-2">Step 2 of 6 — Review</span>
        <h1 className="font-bebas text-[2.8rem] sm:text-[3.4rem] tracking-[0.02em] leading-none mb-0.5">
          CHECK <span className="text-accent">OUTFIT</span>
        </h1>
        <p className="text-text-muted text-[0.78rem] font-inter mt-1.5">
          Drag pieces to rearrange your look
        </p>
      </div>

      {/* Section divider */}
      <div className="section-line mb-4" />

      {/* ── Selected Items strip ── */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {selectedItems.length === 0 && (
          <div className="text-text-secondary text-sm font-inter">No items selected.</div>
        )}
        {selectedItems.map((item) => (
          <div
            key={item.id}
            className="min-w-[64px] w-[64px] h-[80px] bg-surface rounded-xl flex flex-col items-end justify-start border border-border overflow-hidden shrink-0 relative"
          >
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-[68%] object-cover" />
            ) : (
              <div className="w-full h-[68%] flex items-center justify-center">
                <ClothingIcon category={item.category} size={26} className="text-text-muted" />
              </div>
            )}
            <span className="text-[0.5rem] text-center px-1 py-0.5 whitespace-nowrap overflow-hidden text-ellipsis w-full text-text-muted font-inter">
              {item.name}
            </span>
            {/* Color dot */}
            {item.meshColor && (
              <div
                className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full border border-white/20"
                style={{ background: item.meshColor }}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Preview canvas ── */}
      <div
        ref={constraintsRef}
        className="flex-1 bg-surface rounded-2xl border border-border flex flex-col items-center justify-center mb-4 relative overflow-hidden min-h-[200px]"
        style={{ background: 'linear-gradient(160deg, var(--color-surface) 0%, var(--color-surface-2) 100%)' }}
      >
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(var(--color-text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-primary) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {selectedItems.map((item, idx) => (
          <motion.div
            key={item.id}
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            whileHover={{ scale: 1.05 }}
            whileDrag={{ scale: 1.1, zIndex: 10, cursor: 'grabbing' }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="my-[-10px] w-[58%] h-[30%] flex justify-center cursor-grab relative z-10"
          >
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-contain pointer-events-none drop-shadow-lg" />
            ) : (
              <ClothingIcon category={item.category} size={64} className="text-text-muted pointer-events-none" />
            )}
          </motion.div>
        ))}

        {selectedItems.length > 0 && (
          <p className="absolute bottom-3 text-[0.6rem] text-text-muted font-inter tracking-wide">
            DRAG TO REARRANGE
          </p>
        )}
        {selectedItems.length === 0 && (
          <p className="text-text-muted text-sm font-inter">No items to preview</p>
        )}
      </div>

      {/* ── Style stats ── */}
      <div className="bg-surface rounded-xl border border-border p-4 mb-5">
        <div className="text-[0.62rem] font-inter font-semibold tracking-[0.12em] text-text-muted uppercase mb-3">Style Analysis</div>
        {[['Color Match', 80], ['Style Score', 90], ['Comfort', 85]].map(([label, pct]) => (
          <div key={label} className="flex items-center gap-3 mb-2.5 last:mb-0">
            <div className="w-[88px] text-[0.72rem] text-text-secondary font-inter shrink-0">{label}</div>
            <div className="flex-1 h-1 bg-surface-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent-warm) 100%)` }}
              />
            </div>
            <span className="text-[0.68rem] font-inter font-semibold text-accent-warm w-8 text-right">{pct}%</span>
          </div>
        ))}
      </div>

      {/* ── Bottom Fixed Buttons ── */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pt-8 pb-safe bg-gradient-to-t from-bg via-bg/90 to-transparent flex flex-col items-center gap-2 pointer-events-none">
        <button
          onClick={onNext}
          disabled={selectedItems.length === 0}
          className="w-full max-w-[480px] flex items-center justify-center gap-2 rounded-2xl bg-accent text-white font-bebas text-[1.25rem] tracking-[0.08em] py-4 cursor-pointer border-none transition-all duration-200 shadow-[0_6px_28px_var(--color-accent-glow)] hover:bg-accent-dim active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none pointer-events-auto"
        >
          TRY ON MY BODY →
        </button>
        <button
          onClick={onBack}
          className="py-3 px-4 font-inter text-[0.85rem] font-medium text-text-secondary cursor-pointer bg-transparent border-none pointer-events-auto hover:text-text-primary transition-colors duration-150"
        >
          ← Change items
        </button>
      </div>
    </div>
  );
}
