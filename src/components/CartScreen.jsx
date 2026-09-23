import { CheckCircle, ShoppingBag } from 'lucide-react';
import { ClothingIcon } from './ClothingIcon';

export default function CartScreen({ selectedItems, onShopMore }) {
  const total = selectedItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="min-h-full flex flex-col p-4 sm:p-6 pb-safe-nav">

      {/* ── Editorial Header ── */}
      <div className="mb-4">
        <span className="editorial-tag block mb-2">Step 6 of 6 — Checkout</span>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent/10 border border-accent/30 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle size={17} className="text-accent" />
          </div>
          <h1 className="font-bebas text-[2.8rem] sm:text-[3.4rem] tracking-[0.02em] leading-none">
            ADDED TO <span className="text-accent">CART</span>
          </h1>
        </div>
        <p className="text-text-muted text-[0.78rem] font-inter mt-1.5 ml-[3rem]">
          Great choice — here's your final look.
        </p>
      </div>

      <div className="section-line mb-4" />

      {/* ── Items list ── */}
      <div className="flex flex-col gap-3 flex-1">
        {selectedItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-text-muted">
            <ShoppingBag size={32} className="opacity-30" />
            <span className="text-sm font-inter">Your cart is empty</span>
          </div>
        )}

        {selectedItems.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 items-center p-3 bg-surface rounded-2xl border border-border card-lift"
          >
            {/* Thumbnail */}
            <div className="w-[64px] h-[80px] bg-surface-2 rounded-xl border border-border/50 flex items-center justify-center overflow-hidden shrink-0">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <ClothingIcon category={item.category} size={32} className="text-text-muted" />
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="text-[0.88rem] font-inter font-semibold text-text-primary mb-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
                {item.name}
              </div>
              <div className="flex gap-1.5 mb-2">
                <span className="text-[0.65rem] py-0.5 px-2 bg-surface-2 rounded-md text-text-muted font-inter">Size M</span>
                <span className="text-[0.65rem] py-0.5 px-2 bg-surface-2 rounded-md text-text-muted font-inter">Qty 1</span>
                {item.gender && (
                  <span className="text-[0.65rem] py-0.5 px-2 bg-surface-2 rounded-md text-text-muted font-inter">{item.gender}</span>
                )}
              </div>
              <div className="text-accent font-inter font-bold text-[0.95rem]">${item.price.toFixed(2)}</div>
            </div>

            {/* Color dot */}
            {item.meshColor && (
              <div className="w-3 h-3 rounded-full shrink-0 border border-white/15 shadow-sm" style={{ background: item.meshColor }} />
            )}
          </div>
        ))}

        {/* ── Order summary ── */}
        {selectedItems.length > 0 && (
          <div className="bg-surface rounded-2xl border border-border p-4 mt-1">
            <div className="text-[0.62rem] font-inter font-semibold tracking-[0.1em] text-text-muted uppercase mb-3">Order Summary</div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[0.82rem] font-inter text-text-secondary">Subtotal ({selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''})</span>
              <span className="text-[0.82rem] font-inter font-semibold text-text-primary">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[0.82rem] font-inter text-text-secondary">Shipping</span>
              <span className="text-[0.82rem] font-inter font-semibold" style={{ color: 'var(--color-accent-warm)' }}>FREE</span>
            </div>
            <div className="h-px bg-border mb-3" />
            <div className="flex justify-between items-center">
              <span className="font-bebas text-[1.2rem] tracking-wide text-text-secondary">TOTAL</span>
              <span className="font-bebas text-[1.5rem] text-accent">${total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Fixed Buttons ── */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pt-8 pb-safe bg-gradient-to-t from-bg via-bg/90 to-transparent flex flex-col items-center gap-2 pointer-events-none">
        <button
          disabled={selectedItems.length === 0}
          className="w-full max-w-[480px] flex items-center justify-center gap-2 rounded-2xl bg-accent text-white font-bebas text-[1.25rem] tracking-[0.08em] py-4 cursor-pointer border-none transition-all duration-200 shadow-[0_6px_28px_var(--color-accent-glow)] hover:bg-accent-dim active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none pointer-events-auto"
        >
          CHECKOUT →
        </button>
        <button
          onClick={onShopMore}
          className="py-3 px-4 font-inter text-[0.85rem] font-medium text-text-secondary cursor-pointer bg-transparent border-none pointer-events-auto hover:text-text-primary transition-colors duration-150"
        >
          ← Shop more looks
        </button>
      </div>
    </div>
  );
}
