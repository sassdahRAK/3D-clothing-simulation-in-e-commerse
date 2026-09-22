import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CLOTHES } from '../data/clothes';

const CATEGORIES = ['All', 'Men', 'Outerwear', 'Bottoms'];

export default function BrowseAndPick({ selectedItems, onSelect, onNext }) {
  const [activeFilter, setActiveFilter] = useState('All');

  function toggleItem(item) {
    const isSelected = selectedItems.some((s) => s.id === item.id);
    if (isSelected) {
      onSelect(selectedItems.filter((s) => s.id !== item.id));
    } else {
      onSelect([...selectedItems, item]);
    }
  }

  // Very simple filter matching for demo purposes
  const filtered = CLOTHES.filter((item) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Outerwear' && item.category === 'jacket') return true;
    if (activeFilter === 'Bottoms' && (item.category === 'pants' || item.category === 'shorts')) return true;
    if (activeFilter === 'Men' && item.gender === 'M') return true;
    return false;
  });

  return (
    <div className="h-full flex flex-col p-6 pb-[100px]">
      
      {/* ── Title ── */}
      <h1 className="font-bebas text-[2.5rem] tracking-[0.05em] mb-5">
        BROWSE & PICK
      </h1>

      {/* ── Categories ── */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-1.5 rounded-md border-none font-bebas text-base cursor-pointer whitespace-nowrap ${
              activeFilter === cat ? 'bg-accent text-charcoal' : 'bg-surface text-text-secondary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
        <AnimatePresence>
          {filtered.map((item) => {
            const isSelected = selectedItems.some(s => s.id === item.id);
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={item.id}
                onClick={() => toggleItem(item)}
                className={`bg-surface rounded-lg overflow-hidden relative cursor-pointer transition-all duration-250 ease-out hover:border-white/15 hover:-translate-y-[3px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] ${
                  isSelected 
                    ? 'border-2 border-accent shadow-[0_0_20px_rgba(94,220,134,0.15)]' 
                    : 'border border-border'
                }`}
              >
                {/* Image */}
                <div className="w-full aspect-[3/4] bg-surface-2 flex items-center justify-center text-[2.5rem] overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    item.category === 'jacket' ? '🧥' : item.category === 'pants' ? '👖' : '👕'
                  )}
                </div>
                
                {/* Details */}
                <div className="p-3 pb-2">
                  <div className="text-xs text-text-secondary mb-1">{item.category.toUpperCase()}</div>
                  <div className="text-[0.9rem] font-semibold mb-2 whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</div>
                  <div className="flex justify-between items-center">
                    <div className="text-accent font-bold">${item.price}</div>
                  </div>
                </div>

                {/* Checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-charcoal text-xs animate-check-in">
                    ✓
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Bottom Fixed Button ── */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg from-60% to-transparent flex justify-center pointer-events-none">
        <button 
          onClick={onNext}
          disabled={selectedItems.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded bg-accent text-charcoal font-bebas text-[1.4rem] tracking-[0.05em] cursor-pointer outline-none transition-all duration-200 ease-out whitespace-nowrap hover:bg-accent-dim hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(94,220,134,0.25)] active:translate-y-0 disabled:opacity-35 disabled:cursor-not-allowed disabled:transform-none w-full max-w-[400px] pointer-events-auto p-4 border-none"
        >
          CHECK OUTFIT ({selectedItems.length} ITEMS) →
        </button>
      </div>
    </div>
  );
}
