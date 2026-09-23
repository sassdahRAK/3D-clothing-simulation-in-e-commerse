export default function InputInfo({ avatarConfig, onAvatarChange, onBack, onNext }) {
  const skinTones = ['#F3D2B5', '#E5B991', '#D49D6A', '#BA7B46', '#8C562B', '#5A3415', '#331F0E'];

  const toggleClass = (active) =>
    `flex-1 py-2.5 px-2 rounded-lg font-inter text-[0.85rem] font-medium cursor-pointer border-none transition-all duration-150 ${
      active ? 'bg-surface-3 text-text-primary' : 'bg-transparent text-text-secondary hover:text-text-primary'
    }`;

  const fieldLabel = 'text-[0.62rem] font-inter font-semibold tracking-[0.1em] text-text-muted uppercase mb-2 block';

  return (
    <div className="min-h-full flex flex-col p-4 sm:p-6 pb-safe-nav">

      {/* ── Editorial Header ── */}
      <div className="mb-4">
        <span className="editorial-tag block mb-2">Step 4 of 6 — Profile</span>
        <h1 className="font-bebas text-[2.8rem] sm:text-[3.4rem] tracking-[0.02em] leading-none">
          YOUR <span className="text-accent">BODY INFO</span>
        </h1>
        <p className="text-text-muted text-[0.78rem] font-inter mt-1.5">
          Personalise your 3D avatar for an accurate fit
        </p>
      </div>

      <div className="section-line mb-5" />

      {/* ── Skin Tone ── */}
      <div className="mb-5">
        <span className={fieldLabel}>Skin Tone</span>
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {skinTones.map((hex) => (
            <button
              key={hex}
              onClick={() => onAvatarChange({ ...avatarConfig, skinTone: hex })}
              className="w-9 h-9 rounded-full cursor-pointer shrink-0 border-none transition-transform duration-100 active:scale-90"
              style={{
                backgroundColor: hex,
                outline: avatarConfig.skinTone === hex ? '2px solid var(--color-accent)' : '2px solid transparent',
                outlineOffset: '2px',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Gender ── */}
      <div className="mb-4">
        <span className={fieldLabel}>Gender</span>
        <div className="flex gap-1.5 p-1 bg-surface rounded-xl">
          <button onClick={() => onAvatarChange({ ...avatarConfig, gender: 'Male' })}   className={toggleClass(avatarConfig.gender === 'Male')}>Male</button>
          <button onClick={() => onAvatarChange({ ...avatarConfig, gender: 'Female' })} className={toggleClass(avatarConfig.gender === 'Female')}>Female</button>
        </div>
      </div>

      {/* ── Fit ── */}
      <div className="mb-4">
        <span className={fieldLabel}>Fit Preference</span>
        <div className="flex gap-1.5 p-1 bg-surface rounded-xl">
          <button onClick={() => onAvatarChange({ ...avatarConfig, fit: 'Regular' })} className={toggleClass(avatarConfig.fit === 'Regular')}>Regular</button>
          <button onClick={() => onAvatarChange({ ...avatarConfig, fit: 'Fit' })}     className={toggleClass(avatarConfig.fit === 'Fit')}>Fitted</button>
        </div>
      </div>

      {/* ── Height & Weight ── */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <span className={fieldLabel}>Height (cm)</span>
          <input
            type="number"
            value={avatarConfig.height}
            onChange={(e) => onAvatarChange({ ...avatarConfig, height: e.target.value })}
            className="w-full p-3 min-h-[46px] bg-surface border border-border rounded-xl text-text-primary font-inter text-[0.95rem] focus:outline-none focus:border-accent/40 focus:bg-surface-2 transition-all"
          />
        </div>
        <div className="flex-1">
          <span className={fieldLabel}>Weight (kg)</span>
          <input
            type="number"
            value={avatarConfig.weight}
            onChange={(e) => onAvatarChange({ ...avatarConfig, weight: e.target.value })}
            className="w-full p-3 min-h-[46px] bg-surface border border-border rounded-xl text-text-primary font-inter text-[0.95rem] focus:outline-none focus:border-accent/40 focus:bg-surface-2 transition-all"
          />
        </div>
      </div>

      {/* ── Style ── */}
      <div className="mb-5">
        <span className={fieldLabel}>Style</span>
        <div className="flex gap-1.5 p-1 bg-surface rounded-xl">
          {['Daily', 'Formal', 'Streetwear'].map(s => (
            <button
              key={s}
              onClick={() => onAvatarChange({ ...avatarConfig, style: s })}
              className={toggleClass(avatarConfig.style === s)}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* ── Bottom Fixed Buttons ── */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pt-8 pb-safe bg-gradient-to-t from-bg via-bg/90 to-transparent flex flex-col items-center gap-2 pointer-events-none">
        <button
          onClick={onNext}
          className="w-full max-w-[480px] flex items-center justify-center gap-2 rounded-2xl bg-accent text-white font-bebas text-[1.25rem] tracking-[0.08em] py-4 cursor-pointer border-none transition-all duration-200 shadow-[0_6px_28px_var(--color-accent-glow)] hover:bg-accent-dim active:scale-[0.98] pointer-events-auto"
        >
          GENERATE MY 3D PREVIEW →
        </button>
        <button
          onClick={onBack}
          className="py-3 px-4 font-inter text-[0.85rem] font-medium text-text-secondary cursor-pointer bg-transparent border-none pointer-events-auto hover:text-text-primary transition-colors duration-150"
        >
          ← Back to outfit check
        </button>
      </div>
    </div>
  );
}
