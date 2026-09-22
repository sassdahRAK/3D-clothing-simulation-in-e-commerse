import { useRef } from 'react';
import { motion } from 'framer-motion';

export default function CheckOutfit({ selectedItems, onBack, onNext }) {
  const constraintsRef = useRef(null);

  return (
    <div className="h-full flex flex-col p-6 pb-[120px]">
      
      {/* ── Title ── */}
      <h1 className="font-bebas text-[2.5rem] tracking-[0.05em] mb-5">
        FEATURE #1 : CHECK OUTFIT
      </h1>

      {/* ── Selected Items Thumbnails ── */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {selectedItems.length === 0 && (
          <div className="text-text-secondary">No items selected.</div>
        )}
        {selectedItems.map((item) => (
          <div key={item.id} className="min-w-[80px] w-[80px] h-[100px] bg-surface rounded-lg flex flex-col items-center justify-center border border-border overflow-hidden">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-[70%] object-cover" />
            ) : (
              <span className="text-[1.5rem] mb-1">
                {item.category === 'jacket' ? '🧥' : item.category === 'pants' ? '👖' : '👕'}
              </span>
            )}
            <span className="text-[0.6rem] text-center px-1 whitespace-nowrap overflow-hidden text-ellipsis w-full">
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* ── Large Preview ── */}
      <div 
        ref={constraintsRef}
        className="flex-1 bg-surface rounded-xl border border-border flex flex-col items-center justify-center mb-6 relative overflow-hidden"
      >
        {selectedItems.map((item, idx) => (
          <motion.div
            key={item.id}
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            whileHover={{ scale: 1.05 }}
            whileDrag={{ scale: 1.1, zIndex: 10, cursor: 'grabbing' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="my-[-10px] w-[60%] h-[30%] flex justify-center cursor-grab"
          >
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-contain pointer-events-none" />
            ) : (
              <span className="text-[4rem] pointer-events-none">
                {item.category === 'jacket' ? '🧥' : item.category === 'pants' ? '👖' : '👕'}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* ── Stats ── */}
      <div className="mb-10">
        <div className="flex items-center mb-3">
          <div className="w-[100px] text-[0.8rem] text-text-secondary">Color Match</div>
          <div className="flex-1 h-1 bg-surface rounded-full">
            <div className="w-[80%] h-full bg-accent rounded-full" />
          </div>
        </div>
        <div className="flex items-center mb-3">
          <div className="w-[100px] text-[0.8rem] text-text-secondary">Style Match</div>
          <div className="flex-1 h-1 bg-surface rounded-full">
            <div className="w-[90%] h-full bg-accent rounded-full" />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-[100px] text-[0.8rem] text-text-secondary">Comfort</div>
          <div className="flex-1 h-1 bg-surface rounded-full">
            <div className="w-[85%] h-full bg-accent rounded-full" />
          </div>
        </div>
      </div>

      {/* ── Bottom Fixed Buttons ── */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg from-80% to-transparent flex flex-col items-center gap-3 pointer-events-none">
        <button 
          onClick={onNext}
          disabled={selectedItems.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded bg-accent text-charcoal font-bebas text-[1.4rem] tracking-[0.05em] cursor-pointer outline-none transition-all duration-200 ease-out whitespace-nowrap hover:bg-accent-dim hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(94,220,134,0.25)] active:translate-y-0 disabled:opacity-35 disabled:cursor-not-allowed disabled:transform-none w-full max-w-[400px] pointer-events-auto p-4 border-none"
        >
          TRY ON MY BODY →
        </button>
        <button 
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded bg-transparent text-text-secondary border border-transparent font-bebas text-[1.1rem] tracking-[0.05em] cursor-pointer outline-none transition-all duration-200 ease-out whitespace-nowrap hover:bg-glass-hover hover:text-text-primary hover:border-white/15 pointer-events-auto"
        >
          ← CHANGE ITEMS
        </button>
      </div>
    </div>
  );
}
