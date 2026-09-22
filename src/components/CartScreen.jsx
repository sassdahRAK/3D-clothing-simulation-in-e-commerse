export default function CartScreen({ selectedItems, onShopMore }) {
  const total = selectedItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="h-full flex flex-col p-6 pb-[120px]">
      
      {/* ── Title Banner ── */}
      <div className="bg-[#e0e0e0] p-3 text-center mb-4">
        <h1 className="font-bebas text-[2rem] tracking-[0.05em] text-charcoal m-0">
          ADDED TO CART
        </h1>
      </div>

      <p className="text-text-secondary text-[0.85rem] mb-8 leading-relaxed">
        Awesome choice. Here is the final look and the garments.
      </p>

      {/* ── Items List ── */}
      <div className="flex flex-col gap-4 flex-1">
        {selectedItems.length === 0 && (
          <div className="text-text-secondary text-center mt-10">
            Your cart is empty.
          </div>
        )}
        {selectedItems.map(item => (
          <div key={item.id} className="flex gap-4 items-center pb-4 border-b border-border">
            
            {/* Thumbnail */}
            <div className="min-w-[80px] w-[80px] h-[100px] bg-surface rounded-lg border border-border flex items-center justify-center text-[2.5rem] overflow-hidden">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                item.category === 'jacket' ? '🧥' : item.category === 'pants' ? '👖' : '👕'
              )}
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="text-[0.9rem] font-semibold mb-1">{item.name}</div>
              <div className="flex gap-2 mb-2">
                <span className="text-[0.75rem] py-0.5 px-1.5 bg-[var(--color-surface-2)] rounded text-text-secondary">Size M</span>
                <span className="text-[0.75rem] py-0.5 px-1.5 bg-[var(--color-surface-2)] rounded text-text-secondary">Qty 1</span>
              </div>
              <div className="text-accent font-bold">${item.price.toFixed(2)}</div>
            </div>

          </div>
        ))}

        {selectedItems.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <span className="text-[1.2rem] font-bebas">TOTAL</span>
            <span className="text-[1.2rem] font-bold text-accent">${total.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* ── Bottom Fixed Buttons ── */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg from-80% to-transparent flex flex-col items-center gap-3 pointer-events-none">
        <button 
          disabled={selectedItems.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded bg-accent text-charcoal font-bebas text-[1.4rem] tracking-[0.05em] cursor-pointer outline-none transition-all duration-200 ease-out whitespace-nowrap hover:bg-accent-dim hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(94,220,134,0.25)] active:translate-y-0 disabled:opacity-35 disabled:cursor-not-allowed disabled:transform-none w-full max-w-[400px] pointer-events-auto p-4 border-none"
        >
          CHECKOUT →
        </button>
        <button 
          onClick={onShopMore}
          className="inline-flex items-center justify-center gap-2 rounded bg-transparent text-text-secondary border border-transparent font-bebas text-[1.1rem] tracking-[0.05em] cursor-pointer outline-none transition-all duration-200 ease-out whitespace-nowrap hover:bg-glass-hover hover:text-text-primary hover:border-white/15 pointer-events-auto"
        >
          SHOP MORE LOOKS
        </button>
      </div>
    </div>
  );
}
