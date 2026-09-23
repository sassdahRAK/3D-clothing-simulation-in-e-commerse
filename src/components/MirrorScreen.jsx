import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import Avatar3D from './Avatar3D';
import { CLOTHES, SKIN_TONES } from '../data/clothes';
import { ClothingIcon } from './ClothingIcon';

// ─── Personalization panel row ────────────────────────────────────────────────
function PanelRow({ label, children }) {
  return (
    <div className="mb-[18px]">
      <div className="text-[0.6rem] font-bold tracking-[0.12em] uppercase text-text-muted mb-[7px] flex items-center gap-[5px]">
        <span className="w-[5px] h-[5px] rounded-full bg-surface-3 inline-block" />
        {label}
      </div>
      {children}
    </div>
  );
}

// ─── Single clothing sidebar card ─────────────────────────────────────────────
function SidebarClothCard({ item, isApplied, onClick, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      onClick={() => onClick(item)}
      title={`${item.name} — click to apply`}
      className={`w-[64px] rounded-[10px] overflow-hidden cursor-grab transition-all duration-200 ease-in-out shrink-0 ${isApplied ? 'bg-accent-glass border-[1.5px] border-accent shadow-em' : 'bg-[var(--color-surface-2)] border-[1.5px] border-border'}`}
    >
      {item.image ? (
        <img src={item.image} alt={item.name} className="w-full aspect-square object-cover block bg-[#f5f5f0]" />
      ) : (
        <div 
          className="w-full aspect-square flex items-center justify-center text-[1.5rem]"
          style={{ background: item.meshColor + '22' }}
        >
          <ClothingIcon category={item.category} size={24} className="text-text-muted" />
        </div>
      )}
      {isApplied && (
        <div className="bg-accent text-center text-[0.55rem] font-bold text-white py-[2px] tracking-[0.04em]">
          ON
        </div>
      )}
    </div>
  );
}

// ─── Checkout modal ───────────────────────────────────────────────────────────
function CheckoutModal({ items, onClose }) {
  const total = items.reduce((sum, i) => sum + i.price, 0);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1000] p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface border border-border-em rounded-xl p-9 max-w-[420px] w-full shadow-[0_0_80px_rgba(16,185,129,0.2)]"
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Check size={28} className="text-accent" />
          </div>
          <h2 className="font-extrabold text-[1.4rem] tracking-tight">
            Your Fit is <span className="text-accent">Perfect!</span>
          </h2>
          <p className="text-text-secondary text-sm mt-2">
            {items.length} item{items.length !== 1 ? 's' : ''} added to cart with your avatar measurements.
          </p>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-3 py-2.5 bg-[var(--color-surface-2)] rounded-sm">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.meshColor }} />
              <span className="text-[0.8rem] font-semibold flex-1">{item.name}</span>
              <span className="text-[0.8rem] text-accent font-bold">${item.price}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-border pt-3 mt-1">
            <span className="font-bold">Total</span>
            <span className="font-extrabold text-accent text-[1.1rem]">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          className="inline-flex items-center justify-center gap-2 rounded bg-accent text-white font-bebas tracking-[0.05em] cursor-pointer outline-none transition-all duration-200 ease-out whitespace-nowrap hover:bg-accent-dim hover:-translate-y-[1px] hover:shadow-[0_8px_24px_var(--color-accent-glow)] active:translate-y-0 disabled:opacity-35 disabled:cursor-not-allowed disabled:transform-none border-none w-full h-[52px] text-base"
          onClick={onClose}
        >
          Confirm & Pay 💳
        </button>
        <button
          className="inline-flex items-center justify-center gap-2 rounded bg-transparent text-text-secondary border border-transparent font-bebas tracking-[0.05em] cursor-pointer outline-none transition-all duration-200 ease-out whitespace-nowrap hover:bg-glass-hover hover:text-text-primary hover:border-white/15 w-full h-[44px] mt-2 text-sm"
          onClick={onClose}
        >
          Continue Shopping
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── MirrorScreen — Step 3 main component ─────────────────────────────────────
export default function MirrorScreen({ selectedItems, avatarConfig, onAvatarChange, onBack }) {
  // Items currently dressed on the mannequin (subset of selectedItems)
  const [dressedItems, setDressedItems] = useState(selectedItems.slice(0, 2));

  // Avatar rotation degrees (synced from OrbitControls via callback)
  const [rotationDeg, setRotationDeg] = useState(0);

  // Split view: false = single full, true = side-by-side split
  const [splitView, setSplitView] = useState(false);

  // The second mannequin's dressed item (right side of split)
  const [splitItem, setSplitItem] = useState(null);

  // Personalization panel visibility
  const [showPanel, setShowPanel] = useState(true);

  // Checkout modal
  const [showCheckout, setShowCheckout] = useState(false);


  // Drag-and-drop: which item is being dragged
  const dragItem = useRef(null);

  // Drop zone ref on the canvas
  const canvasZoneRef = useRef(null);

  function updateConfig(key, value) {
    onAvatarChange({ ...avatarConfig, [key]: value });
  }

  // ── Toggle a clothing item onto the mannequin ─────────────────────────────
  function applyItem(item) {
    const alreadyOn = dressedItems.some((d) => d.id === item.id);
    if (alreadyOn) {
      setDressedItems(dressedItems.filter((d) => d.id !== item.id));
    } else {
      // Remove conflicting body parts
      const filtered = dressedItems.filter((d) => {
        const a = d.bodyPart || d.category;
        const b = item.bodyPart || item.category;
        // Dress/set replaces everything; jacket/torso replaces other tops; legs replaces shorts
        if (['full', 'dress', 'set'].includes(b)) return false;
        if (['full', 'dress', 'set'].includes(a)) return false;
        if (['torso', 'top', 'jacket'].includes(a) && ['torso', 'top', 'jacket'].includes(b)) return false;
        if (['legs', 'lower', 'pants', 'shorts'].includes(a) && ['legs', 'lower', 'pants', 'shorts'].includes(b)) return false;
        return true;
      });
      setDressedItems([...filtered, item]);
    }
  }

  // ── Drag and drop onto canvas ─────────────────────────────────────────────
  function handleDragStart(e, item) {
    dragItem.current = item;
    e.dataTransfer.effectAllowed = 'copy';
  }

  function handleCanvasDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }

  function handleCanvasDrop(e) {
    e.preventDefault();
    if (dragItem.current) {
      applyItem(dragItem.current);
      dragItem.current = null;
    }
  }


  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* ── Top Bar ─── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-glass-bg backdrop-blur-md shrink-0">
        {/* Back + Title */}
        <div className="flex items-center gap-4">
          <button className="inline-flex items-center justify-center gap-2 rounded bg-transparent text-text-secondary border border-transparent font-bebas text-[0.8rem] tracking-[0.05em] cursor-pointer outline-none transition-all duration-200 ease-out hover:bg-glass-hover hover:text-text-primary hover:border-white/15 h-[38px] px-3.5" onClick={onBack}>
            ← Back
          </button>
          <div>
            <p className="text-[0.6rem] font-bold tracking-[0.12em] uppercase text-text-muted">
              Step 3 — 3D Mirror
            </p>
            <h2 className="text-[1.1rem] font-extrabold tracking-[-0.02em] leading-none">
              YOUR PERSONAL MATCH
            </h2>
          </div>
        </div>

        {/* Split View Toggle */}
        <div className="flex gap-1.5">
          <button
            onClick={() => setSplitView(false)}
            className={`px-3.5 py-1.5 rounded-lg text-[0.75rem] font-semibold font-inter transition-all duration-150 ease-in-out cursor-pointer border ${!splitView ? 'border-border bg-surface-3 text-text-primary' : 'border-border bg-transparent text-text-secondary'}`}
          >
            Full View
          </button>
          <button
            onClick={() => setSplitView(true)}
            className={`px-3.5 py-1.5 rounded-lg text-[0.75rem] font-semibold font-inter transition-all duration-150 ease-in-out cursor-pointer border ${splitView ? 'border-border bg-surface-3 text-text-primary' : 'border-border bg-transparent text-text-secondary'}`}
          >
            ⊢ Split Compare
          </button>
        </div>

        {/* Personalization toggle + Rotation display */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border rounded-lg text-[0.75rem] text-text-secondary">
            <span className="animate-[spin360_4s_linear_infinite] inline-block text-[0.9rem]">↻</span>
            <span className="font-bold text-text-primary">{rotationDeg}°</span>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded bg-transparent text-text-secondary border border-transparent font-bebas text-[0.8rem] tracking-[0.05em] cursor-pointer outline-none transition-all duration-200 ease-out hover:bg-glass-hover hover:text-text-primary hover:border-white/15 h-[38px] px-3.5"
            onClick={() => setShowPanel(!showPanel)}
          >
            {showPanel ? 'Hide' : 'Customize'} ✦
          </button>
        </div>
      </div>

      {/* ── Main Content Row ─── */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ── Left: Item List Strip ─── */}
        <div className="w-[170px] border-r border-border bg-glass-bg backdrop-blur-md px-3 py-4 overflow-y-auto shrink-0 flex flex-col gap-2.5">
          <p className="text-[0.6rem] font-bold tracking-[0.1em] uppercase text-text-muted mb-1">
            Dressed
          </p>

          {dressedItems.length === 0 ? (
            <div className="text-text-muted text-[0.75rem] text-center py-5">
              Drag or click items from the right →
            </div>
          ) : (
            dressedItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="bg-surface rounded-[10px] overflow-hidden cursor-pointer"
                style={{ border: `1px solid ${item.meshColor}55` }}
                onClick={() => applyItem(item)}
                title="Click to remove"
              >
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full aspect-square object-cover bg-[#f5f5f0]" />
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center" style={{ background: item.meshColor + '22' }}>
                    <ClothingIcon category={item.category} size={28} className="text-text-muted" />
                  </div>
                )}
                <div className="px-2 py-1.5">
                  <div className="text-[0.58rem] font-bold tracking-[0.06em] uppercase text-text-muted">
                    ITEM {idx + 1}
                  </div>
                  <div className="text-[0.7rem] font-semibold text-text-primary leading-tight">
                    {item.name}
                  </div>
                  <div className="flex items-center gap-1 mt-[3px]">
                    <div className="w-2 h-2 rounded-full" style={{ background: item.meshColor }} />
                    <span className="text-[0.6rem] text-text-muted">{item.colorLabel}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}

          {/* Measurement indicator */}
          <div className="mt-auto pt-4 border-t border-border">
            <p className="text-[0.6rem] font-bold tracking-[0.1em] uppercase text-text-muted mb-2">
              Measurements
            </p>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-[2px] h-[40px] bg-surface-3 shrink-0" />
              <div>
                <div className="text-[0.9rem] font-extrabold text-text-primary">{avatarConfig.height} cm</div>
                <div className="text-[0.65rem] text-text-muted">Height</div>
              </div>
            </div>
            <div className="text-[0.75rem] text-text-secondary">
              <span className="font-bold">{avatarConfig.weight} kg</span>
              <span className="text-text-muted"> · {avatarConfig.bodyShape}</span>
            </div>
          </div>
        </div>

        {/* ── Center: 3D Canvas ─── */}
        <div
          ref={canvasZoneRef}
          onDragOver={handleCanvasDragOver}
          onDrop={handleCanvasDrop}
          className="flex-1 relative overflow-hidden bg-gradient-to-b from-[#0a0f1a] via-[#0d1525] to-[#060a10]"
        >
          {splitView ? (
            /* ── Split View ── */
            <div className="flex h-full">
              {/* Left mannequin */}
              <div className="flex-1 relative border-r border-border">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[0.65rem] font-bold tracking-[0.08em] uppercase text-text-muted bg-glass-bg border border-border rounded-md px-2.5 py-1 z-10">
                  Original
                </div>
                <Avatar3D
                  avatarConfig={avatarConfig}
                  selectedItems={dressedItems.filter((_, i) => i % 2 === 0)}
                  onRotationChange={setRotationDeg}
                />
              </div>
              {/* Right mannequin — drop a different item here */}
              <div
                className="flex-1 relative"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragItem.current) {
                    setSplitItem(dragItem.current);
                    dragItem.current = null;
                  }
                }}
              >
                <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[0.65rem] font-bold tracking-[0.08em] uppercase text-text-muted bg-surface border border-border rounded-md px-2.5 py-1 z-10">
                  Compare ← Drop here
                </div>
                <Avatar3D
                  avatarConfig={avatarConfig}
                  selectedItems={splitItem ? [splitItem] : dressedItems.filter((_, i) => i % 2 === 1)}
                  onRotationChange={() => {}}
                />
              </div>
            </div>
          ) : (
            /* ── Single Full View ── */
            <Avatar3D
              avatarConfig={avatarConfig}
              selectedItems={dressedItems}
              onRotationChange={setRotationDeg}
            />
          )}

          {/* Drop-zone hint overlay */}
          <div className="absolute inset-0 border-2 border-dashed border-transparent transition-colors duration-200 pointer-events-none drop-hint" />

          {/* 360° badge */}
          <div className="absolute top-4 right-4 bg-glass-bg backdrop-blur-md border border-border rounded-full w-[54px] h-[54px] flex flex-col items-center justify-center text-[0.55rem] font-extrabold text-text-secondary tracking-[0.02em]">
            <span className="text-[1.1rem] leading-none">↻</span>
            <span>360°</span>
          </div>

          {/* Drag hint text */}
          {dressedItems.length === 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-text-muted text-[0.9rem] mb-1.5">
                Drag or click items from the right panel
              </p>
              <p className="text-text-muted text-[0.75rem]">
                Then drag to rotate the mannequin 360°
              </p>
            </div>
          )}

          {/* Bottom 360° slider */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[260px] bg-glass-bg backdrop-blur-[16px] border border-border rounded-[40px] px-[18px] py-[10px] flex items-center gap-3">
            <span className="text-[0.75rem] text-text-secondary shrink-0">0°</span>
            <div className="flex-1 relative">
              <input
                type="range"
                min={0}
                max={359}
                value={rotationDeg}
                readOnly
                className="w-full"
              />
            </div>
            <span className="text-[0.75rem] text-text-secondary shrink-0 min-w-[36px]">
              {rotationDeg}°
            </span>
          </div>
        </div>

        {/* ── Right: Clothing Sidebar ─── */}
        <div className="w-[84px] border-l border-border bg-glass-bg backdrop-blur-md px-2.5 py-3 overflow-y-auto shrink-0 flex flex-col gap-2.5 items-center">
          <p className="text-[0.55rem] font-bold tracking-[0.1em] uppercase text-text-muted mb-0.5 [writing-mode:horizontal-tb]">
            Wardrobe
          </p>
          {CLOTHES.map((item) => (
            <SidebarClothCard
              key={item.id}
              item={item}
              isApplied={dressedItems.some((d) => d.id === item.id)}
              onClick={applyItem}
              onDragStart={handleDragStart}
            />
          ))}
        </div>

        {/* ── Floating Personalization Panel ─── */}
        <AnimatePresence>
          {showPanel && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-4 right-[98px] w-[220px] bg-glass-bg backdrop-blur-[20px] border border-border rounded-xl px-4 py-[18px] z-10 shadow-[0_8px_40px_rgba(0,0,0,0.5)] max-h-[calc(100%-32px)] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[0.85rem] font-bold tracking-[-0.01em]">
                  Personalize
                </h3>
                <button onClick={() => setShowPanel(false)}
                  className="bg-transparent border-none text-text-muted cursor-pointer text-base p-0 hover:text-white transition-colors">
                  ✕
                </button>
              </div>

              {/* Skin tone */}
              <PanelRow label="Skin Tone">
                <div className="flex gap-1.5 flex-wrap">
                  {SKIN_TONES.map((t) => (
                    <div
                      key={t.hex}
                      className={`w-6 h-6 rounded-full cursor-pointer border-2 transition-all ${avatarConfig.skinTone === t.hex ? 'border-accent scale-110' : 'border-transparent hover:scale-110'}`}
                      style={{ background: t.hex }}
                      title={t.label}
                      onClick={() => updateConfig('skinTone', t.hex)}
                    />
                  ))}
                </div>
              </PanelRow>

              {/* Body shape */}
              <PanelRow label="Body Shape">
                <div className="flex bg-[var(--color-surface-2)] p-[3px] rounded-lg border border-border">
                  {['S', 'M', 'L', 'XL'].map((s) => (
                    <button key={s} 
                      className={`flex-1 py-1.5 px-0 text-[0.7rem] font-bold rounded-[5px] border-none transition-colors cursor-pointer ${avatarConfig.bodyShape === s ? 'bg-surface-3 text-text-primary' : 'bg-transparent text-text-secondary hover:text-text-primary'}`}
                      onClick={() => updateConfig('bodyShape', s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </PanelRow>

              {/* Gender */}
              <PanelRow label="Gender">
                <div className="flex bg-[var(--color-surface-2)] p-[3px] rounded-lg border border-border">
                  {[['M', '♂'], ['F', '♀'], ['X', '⊕']].map(([g, icon]) => (
                    <button key={g} 
                      className={`flex-1 py-1.5 px-0 text-[0.7rem] font-bold rounded-[5px] border-none transition-colors cursor-pointer ${avatarConfig.gender === g ? 'bg-surface-3 text-text-primary' : 'bg-transparent text-text-secondary hover:text-text-primary'}`}
                      onClick={() => updateConfig('gender', g)}
                      title={g === 'M' ? 'Male' : g === 'F' ? 'Female' : 'Non-binary'}>
                      {icon}
                    </button>
                  ))}
                </div>
              </PanelRow>

              {/* Height */}
              <PanelRow label={`Height — ${avatarConfig.height} cm`}>
                <input type="range" min={140} max={215} value={avatarConfig.height}
                  onChange={(e) => updateConfig('height', Number(e.target.value))} className="w-full accent-accent" />
              </PanelRow>

              {/* Weight */}
              <PanelRow label={`Weight — ${avatarConfig.weight} kg`}>
                <input type="range" min={40} max={160} value={avatarConfig.weight}
                  onChange={(e) => updateConfig('weight', Number(e.target.value))} className="w-full accent-accent" />
              </PanelRow>

              {/* Size selector S/L/XL — like reference */}
              <PanelRow label="Size">
                <div className="flex bg-[var(--color-surface-2)] p-[3px] rounded-lg border border-border">
                  {['S', 'M', 'L', 'XL'].map((s) => (
                    <button key={s} 
                      className={`flex-1 py-1.5 px-0 text-[0.7rem] font-bold rounded-[5px] border-none transition-colors cursor-pointer ${avatarConfig.bodyShape === s ? 'bg-surface-3 text-text-primary' : 'bg-transparent text-text-secondary hover:text-text-primary'}`}
                      onClick={() => updateConfig('bodyShape', s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </PanelRow>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom CTA ─── */}
      <div className="flex items-center justify-between px-6 py-3.5 border-t border-border bg-glass-bg backdrop-blur-md shrink-0">
        {/* Summary of dressed items */}
        <div className="flex items-center gap-2">
          {dressedItems.slice(0, 4).map((item) => (
            <div key={item.id} className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center border-[2px]"
              style={{ background: item.meshColor + '33', borderColor: item.meshColor }}>
              {item.image
                ? <img src={item.image} alt="" className="w-full h-full object-cover" />
                : <ClothingIcon category={item.category} size={18} className="text-text-muted" />
              }
            </div>
          ))}
          {dressedItems.length > 0 && (
            <span className="text-[0.8rem] text-text-secondary ml-1">
              {dressedItems.length} item{dressedItems.length !== 1 ? 's' : ''} ·{' '}
              <span className="text-accent font-bold">
                ${dressedItems.reduce((s, i) => s + i.price, 0).toFixed(2)}
              </span>
            </span>
          )}
        </div>

        {/* CTA */}
        <button
          className="inline-flex items-center justify-center gap-2 rounded bg-accent text-white font-bebas text-[1rem] tracking-[0.02em] cursor-pointer outline-none transition-all duration-200 ease-out hover:bg-accent-dim hover:-translate-y-[1px] hover:shadow-[0_8px_24px_var(--color-accent-glow)] active:translate-y-0 disabled:opacity-35 disabled:cursor-not-allowed disabled:transform-none h-[52px] px-10 animate-pulse-glow border-none"
          onClick={() => setShowCheckout(true)}
          disabled={dressedItems.length === 0}
        >
          <Check size={16} strokeWidth={2.5} /> FINALIZE & CHECKOUT
        </button>
      </div>

      {/* ── Checkout Modal ─── */}
      <AnimatePresence>
        {showCheckout && (
          <CheckoutModal
            items={dressedItems}
            onClose={() => setShowCheckout(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
