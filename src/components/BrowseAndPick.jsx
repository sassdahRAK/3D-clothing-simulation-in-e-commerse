import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Search } from 'lucide-react';
import { CLOTHES } from '../data/clothes';
import { ClothingIcon } from './ClothingIcon';

const CATEGORIES = ['All', 'Men', 'Outerwear', 'Bottoms'];

export default function BrowseAndPick({ selectedItems, onSelect, onNext }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  function toggleItem(item) {
    const isSelected = selectedItems.some((s) => s.id === item.id);
    onSelect(isSelected ? selectedItems.filter((s) => s.id !== item.id) : [...selectedItems, item]);
  }

  const filtered = CLOTHES.filter((item) => {
    if (!item.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Outerwear' && item.category === 'jacket') return true;
    if (activeFilter === 'Bottoms' && (item.category === 'pants' || item.category === 'shorts')) return true;
    if (activeFilter === 'Men' && item.gender === 'M') return true;
    return false;
  });

  return (
    <div className="min-h-full flex flex-col pb-safe-nav">

      {/* ── Editorial Hero Header ── */}
      <div className="relative px-4 sm:px-6 pt-5 pb-0 overflow-hidden">
        {/* Ambient glow behind hero */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.035] via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-8 right-0 w-56 h-56 bg-[var(--color-accent-warm)]/[0.035] rounded-full blur-[72px] pointer-events-none" />

        {/* Tag + count row */}
        <div className="flex items-end justify-between mb-2">
          <span className="editorial-tag">Step 1 of 6 — Catalog</span>
          <div className="text-right">
            <span className="font-bebas text-[1.8rem] leading-none text-text-muted">{CLOTHES.length}</span>
            <span className="text-[0.55rem] text-text-muted tracking-[0.12em] uppercase block">pieces</span>
          </div>
        </div>

        {/* Display heading — large Bebas with accent word */}
        <h1 className="font-bebas leading-[0.92] tracking-[0.02em] mb-4">
          <span className="text-[3rem] sm:text-[3.8rem] text-text-primary block">BROWSE &</span>
          <span className="text-[3rem] sm:text-[3.8rem] text-accent block">PICK YOUR LOOK</span>
        </h1>

        {/* Search bar */}
        <div className="relative mb-3.5">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search pieces..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl text-text-primary text-[0.875rem] font-inter pl-9 pr-4 py-2.5 focus:outline-none focus:border-accent/40 focus:bg-surface-2 transition-all duration-150 placeholder:text-text-muted"
          />
        </div>

        {/* Category filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-3.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-1.5 rounded-full border text-[0.78rem] font-inter font-medium cursor-pointer whitespace-nowrap transition-all duration-150 ${
                activeFilter === cat
                  ? 'bg-accent/10 border-accent/35 text-accent'
                  : 'bg-transparent border-border text-text-secondary hover:border-border-em hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Section divider — gradient line with warm accent hint */}
        <div className="section-line mb-0" />
      </div>

      {/* ── Grid ── */}
      <div className="flex-1 px-4 sm:px-6 pt-4">
        {filtered.length === 0 && (
          <div className="py-20 text-center text-text-muted text-sm font-inter">No items found</div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <AnimatePresence>
            {filtered.map((item, idx) => {
              const isSelected = selectedItems.some(s => s.id === item.id);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.18, delay: idx * 0.022 }}
                  key={item.id}
                  onClick={() => toggleItem(item)}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer card-lift ${
                    isSelected
                      ? 'border-2 border-accent shadow-[0_0_22px_var(--color-accent-glass)] bg-surface'
                      : 'border border-border bg-surface'
                  }`}
                >
                  {/* Image */}
                  <div className="w-full aspect-[3/4] bg-surface-2 flex items-center justify-center overflow-hidden relative">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <ClothingIcon category={item.category} size={40} className="text-text-muted" />
                    )}

                    {/* Category tag overlay */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-bg/75 backdrop-blur-sm rounded-full">
                      <span className="text-[0.52rem] font-inter font-semibold tracking-[0.1em] text-text-muted uppercase">
                        {item.category}
                      </span>
                    </div>

                    {/* Color dot */}
                    {item.meshColor && (
                      <div
                        className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full border border-white/30 shadow-sm"
                        style={{ background: item.meshColor }}
                      />
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-3 pb-2.5">
                    <div className="text-[0.82rem] font-inter font-semibold text-text-primary mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.name}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-inter font-bold text-accent text-[0.88rem]">${item.price}</span>
                      {item.gender && (
                        <span className="text-[0.58rem] text-text-muted bg-surface-2 px-1.5 py-0.5 rounded font-inter">
                          {item.gender}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Selection checkmark */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-[22px] h-[22px] bg-accent rounded-full flex items-center justify-center shadow-[0_0_10px_var(--color-accent-glow)]"
                    >
                      <Check size={11} strokeWidth={3} className="text-white" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pt-10 pb-safe bg-gradient-to-t from-bg via-bg/90 to-transparent flex justify-center pointer-events-none">
        <button
          onClick={onNext}
          disabled={selectedItems.length === 0}
          className="w-full max-w-[480px] flex items-center justify-center gap-2 rounded-2xl bg-accent text-white font-bebas text-[1.25rem] tracking-[0.08em] py-4 cursor-pointer border-none transition-all duration-200 shadow-[0_6px_28px_var(--color-accent-glow)] hover:bg-accent-dim active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none pointer-events-auto"
        >
          CHECK OUTFIT ({selectedItems.length}) →
        </button>
      </div>
    </div>
  );
}
