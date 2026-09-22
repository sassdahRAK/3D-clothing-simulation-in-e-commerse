import { useState } from 'react';
import { motion } from 'framer-motion';
import { CLOTHES } from '../data/clothes';

// ─── Category filter tabs ──────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Jacket', 'Pants', 'Top', 'Dress', 'Shorts', 'Set'];

// ─── Color swatches for "no image" items ──────────────────────────────────────
const CATEGORY_EMOJI = {
  jacket:  '🧥',
  pants:   '👖',
  top:     '👕',
  dress:   '👗',
  shorts:  '🩳',
  set:     '🤸',
};

export default function ShopScreen({ selectedItems, onSelect, onNext }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Toggle an item's selection (max 6)
  function toggleItem(item) {
    const isSelected = selectedItems.some((s) => s.id === item.id);
    if (isSelected) {
      onSelect(selectedItems.filter((s) => s.id !== item.id));
    } else {
      if (selectedItems.length >= 6) return; // soft cap
      onSelect([...selectedItems, item]);
    }
  }

  // Filtered list
  const filtered = CLOTHES.filter((item) => {
    const matchCat = activeFilter === 'All' || item.category === activeFilter.toLowerCase();
    const matchQ   = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="h-full overflow-auto flex flex-col">
      {/* ── Hero Header ─── */}
      <div className="pt-10 px-12 pb-6 bg-gradient-to-b from-surface to-transparent">
        <div className="max-w-[900px] mx-auto">
          <p className="text-accent font-bold text-[0.75rem] tracking-[0.12em] uppercase mb-2">
            Step 1 of 3
          </p>
          <h1 className="text-[2.2rem] font-extrabold tracking-[-0.03em] mb-2 leading-[1.1]">
            Build Your <span className="text-accent">Outfit</span>
          </h1>
          <p className="text-text-secondary text-base max-w-[480px] mb-6">
            Select the pieces you want to try on. We'll drape them on your personal 3D avatar.
          </p>

          {/* Search + Filter row */}
          <div className="flex gap-3 flex-wrap items-center">
            {/* Search */}
            <div className="relative flex-[1_1_220px] max-w-[280px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[0.9rem]">🔍</span>
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--color-surface-2)] border border-border rounded-lg text-text-primary text-[0.95rem] font-inter transition-all duration-200 focus:outline-none focus:border-accent focus:shadow-em focus:-translate-y-[1px] px-3 py-2 pl-9 h-[42px]"
              />
            </div>

            {/* Category tabs */}
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-[20px] border text-[0.8rem] font-semibold cursor-pointer transition-all duration-150 ease-in-out font-inter ${activeFilter === cat ? 'border-accent bg-accent-glass text-accent' : 'border-border bg-transparent text-text-secondary'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Grid ─── */}
      <div className="flex-1 px-12 pb-[120px] overflow-auto">
        <div className="max-w-[1100px] mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-text-muted">
              No items found for "{searchQuery}"
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
              {filtered.map((item, index) => {
                const isSelected = selectedItems.some((s) => s.id === item.id);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.3 }}
                    className={`bg-surface rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ease-in-out flex flex-col relative ${isSelected ? 'border-[2px] border-accent shadow-em' : 'border border-border hover:-translate-y-1 hover:border-border-em hover:shadow-lg'}`}
                    onClick={() => toggleItem(item)}
                  >
                    {/* Selected checkmark */}
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-accent rounded-full flex items-center justify-center z-10 shadow-sm">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}

                    {/* Image or color placeholder */}
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full aspect-[4/5] object-cover block bg-[#f5f5f0]"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full aspect-[4/5] flex items-center justify-center text-[3rem]"
                        style={{ background: item.meshColor + '22' }}
                      >
                        {CATEGORY_EMOJI[item.category] || '👔'}
                      </div>
                    )}

                    {/* Color dot overlay */}
                    <div 
                      className="absolute bottom-[54px] left-2.5 w-2.5 h-2.5 rounded-full border-2 border-white/60"
                      style={{ background: item.meshColor }}
                    />

                    <div className="p-3">
                      <div className="text-[0.9rem] font-semibold text-text-primary whitespace-nowrap overflow-hidden text-ellipsis mb-1">{item.name}</div>
                      <div className="flex justify-between items-center">
                        <span className="text-accent font-bold text-base">${item.price}</span>
                        <span className="text-[0.7rem] text-text-muted bg-[var(--color-surface-2)] px-1.5 py-0.5 rounded-sm">{item.gender}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky Bottom CTA ─── */}
      <div className="fixed bottom-0 left-0 right-0 px-12 py-4 bg-gradient-to-t from-bg from-70% to-transparent flex items-center justify-between z-50">
        {/* Selected items preview */}
        <div className="flex items-center gap-2">
          {selectedItems.slice(0, 5).map((item) => (
            <div
              key={item.id}
              title={item.name}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[1.1rem] overflow-hidden border-[2px]"
              style={{ background: item.meshColor + '33', borderColor: item.meshColor }}
            >
              {item.image ? (
                <img src={item.image} alt="" className="w-full h-full object-cover" />
              ) : (
                CATEGORY_EMOJI[item.category] || '👔'
              )}
            </div>
          ))}
          {selectedItems.length === 0 && (
            <span className="text-text-muted text-[0.85rem]">
              Select at least 1 item to continue
            </span>
          )}
        </div>

        <button
          className="inline-flex items-center justify-center gap-2 rounded bg-accent text-charcoal font-bebas tracking-[0.05em] cursor-pointer outline-none transition-all duration-200 ease-out whitespace-nowrap hover:bg-accent-dim hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(94,220,134,0.25)] active:translate-y-0 disabled:opacity-35 disabled:cursor-not-allowed disabled:transform-none border-none px-8 h-[52px] text-base"
          onClick={onNext}
          disabled={selectedItems.length === 0}
        >
          Build My Outfit →
        </button>
      </div>
    </div>
  );
}
