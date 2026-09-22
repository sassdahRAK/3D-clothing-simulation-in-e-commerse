export default function InputInfo({ avatarConfig, onAvatarChange, onBack, onNext }) {

  const skinTones = ['#F3D2B5', '#E5B991', '#D49D6A', '#BA7B46', '#8C562B', '#5A3415', '#331F0E'];

  return (
    <div className="h-full flex flex-col p-6 pb-[120px]">
      
      {/* ── Title ── */}
      <h1 className="font-bebas text-[2.5rem] tracking-[0.05em] mb-2">
        INPUT MORE INFOS
      </h1>
      <p className="text-text-secondary text-[0.85rem] mb-6 leading-relaxed">
        Choose the options that best describes the configuration of your body
      </p>

      {/* ── Skin Tone ── */}
      <div className="mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {skinTones.map((hex) => (
            <div
              key={hex}
              onClick={() => onAvatarChange({ ...avatarConfig, skinTone: hex })}
              className="w-8 h-8 rounded-full cursor-pointer shrink-0"
              style={{
                backgroundColor: hex,
                border: avatarConfig.skinTone === hex ? '3px solid var(--color-accent)' : '2px solid transparent',
                boxShadow: avatarConfig.skinTone === hex ? '0 0 0 2px var(--color-bg)' : 'none'
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Gender Toggle ── */}
      <div className="mb-4">
        <div className="text-xs text-text-secondary mb-2 tracking-[0.05em]">GENDER</div>
        <div className="flex gap-2">
          <button
            onClick={() => onAvatarChange({ ...avatarConfig, gender: 'Male' })}
            className={`flex-1 p-3 rounded font-bebas text-[1.2rem] cursor-pointer border-none ${
              avatarConfig.gender === 'Male' ? 'bg-accent text-charcoal' : 'bg-surface text-text-secondary'
            }`}
          >Male</button>
          <button
            onClick={() => onAvatarChange({ ...avatarConfig, gender: 'Female' })}
            className={`flex-1 p-3 rounded font-bebas text-[1.2rem] cursor-pointer border-none ${
              avatarConfig.gender === 'Female' ? 'bg-accent text-charcoal' : 'bg-surface text-text-secondary'
            }`}
          >Female</button>
        </div>
      </div>

      {/* ── Fit Toggle ── */}
      <div className="mb-6">
        <div className="text-xs text-text-secondary mb-2 tracking-[0.05em]">FIT PREFERENCE</div>
        <div className="flex gap-2">
          <button
            onClick={() => onAvatarChange({ ...avatarConfig, fit: 'Regular' })}
            className={`flex-1 p-3 rounded font-bebas text-[1.2rem] cursor-pointer border-none ${
              avatarConfig.fit === 'Regular' ? 'bg-accent text-charcoal' : 'bg-surface text-text-secondary'
            }`}
          >Regular</button>
          <button
            onClick={() => onAvatarChange({ ...avatarConfig, fit: 'Fit' })}
            className={`flex-1 p-3 rounded font-bebas text-[1.2rem] cursor-pointer border-none ${
              avatarConfig.fit === 'Fit' ? 'bg-accent text-charcoal' : 'bg-surface text-text-secondary'
            }`}
          >Fit</button>
        </div>
      </div>

      {/* ── Height & Weight ── */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="text-xs text-text-secondary mb-2 tracking-[0.05em]">HEIGHT (CM)</div>
          <input 
            type="number" 
            value={avatarConfig.height} 
            onChange={(e) => onAvatarChange({ ...avatarConfig, height: e.target.value })}
            className="w-full p-3 bg-surface border border-border rounded text-white font-inter"
          />
        </div>
        <div className="flex-1">
          <div className="text-xs text-text-secondary mb-2 tracking-[0.05em]">WEIGHT (KG)</div>
          <input 
            type="number" 
            value={avatarConfig.weight} 
            onChange={(e) => onAvatarChange({ ...avatarConfig, weight: e.target.value })}
            className="w-full p-3 bg-surface border border-border rounded text-white font-inter"
          />
        </div>
      </div>

      {/* ── Style Toggle ── */}
      <div className="mb-10">
        <div className="text-xs text-text-secondary mb-2 tracking-[0.05em]">STYLE</div>
        <div className="flex gap-2">
          {['Daily', 'Formal', 'Streetwear'].map(s => (
            <button
              key={s}
              onClick={() => onAvatarChange({ ...avatarConfig, style: s })}
              className={`flex-1 py-3 px-1 rounded font-bebas text-[1.1rem] cursor-pointer border-none ${
                avatarConfig.style === s ? 'bg-accent text-charcoal' : 'bg-surface text-text-secondary'
              }`}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* ── Bottom Fixed Buttons ── */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg from-80% to-transparent flex flex-col items-center gap-3 pointer-events-none">
        <button 
          onClick={onNext}
          className="inline-flex items-center justify-center gap-2 rounded bg-accent text-charcoal font-bebas text-[1.4rem] tracking-[0.05em] cursor-pointer outline-none transition-all duration-200 ease-out whitespace-nowrap hover:bg-accent-dim hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(94,220,134,0.25)] active:translate-y-0 disabled:opacity-35 disabled:cursor-not-allowed disabled:transform-none w-full max-w-[400px] pointer-events-auto p-4 border-none"
        >
          GENERATE MY 3D PREVIEW →
        </button>
        <button 
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded bg-transparent text-text-secondary border border-transparent font-bebas text-[1.1rem] tracking-[0.05em] cursor-pointer outline-none transition-all duration-200 ease-out whitespace-nowrap hover:bg-glass-hover hover:text-text-primary hover:border-white/15 pointer-events-auto"
        >
          ← BACK TO OUTFIT CHECK
        </button>
      </div>
    </div>
  );
}
