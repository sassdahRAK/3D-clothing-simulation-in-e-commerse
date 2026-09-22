import { SKIN_TONES, BODY_SHAPES } from '../data/clothes';

// ─── Simple SVG stick-figure / avatar for Step 2 ─────────────────────────────
// The figure reacts to: skinTone, bodyShape, gender.
// Selected clothing items are shown as color overlays on the figure.

function StickFigure({ avatarConfig, selectedItems }) {
  const shape = BODY_SHAPES[avatarConfig.bodyShape] || BODY_SHAPES.M;
  const skinHex = avatarConfig.skinTone;
  const isFemale = avatarConfig.gender === 'F';

  // Determine what to show on each body part
  const torsoItem = selectedItems.find((i) => i.bodyPart === 'torso' || i.bodyPart === 'full');
  const legItem   = selectedItems.find((i) => i.bodyPart === 'legs'  || i.bodyPart === 'lower' || i.bodyPart === 'full');

  const torsoW = 80 * (shape.torsoScale[0]);
  const hipW   = 70 * shape.hipScale;

  return (
    <svg width="220" height="380" viewBox="0 0 220 380" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="110" cy="368" rx="55" ry="8" fill="rgba(0,0,0,0.3)" />

      {/* Head */}
      <circle cx="110" cy="42" r={isFemale ? 28 : 26} fill={skinHex} />
      {/* Hair */}
      {isFemale ? (
        <ellipse cx="110" cy="26" rx="30" ry="14" fill="#3d2a1a" />
      ) : (
        <ellipse cx="110" cy="22" rx="27" ry="10" fill="#2a1a0e" />
      )}
      {/* Face dots */}
      <circle cx="103" cy="40" r="2.5" fill="rgba(0,0,0,0.25)" />
      <circle cx="117" cy="40" r="2.5" fill="rgba(0,0,0,0.25)" />
      <path d="M104 50 Q110 55 116 50" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Neck */}
      <rect x="105" y="68" width="10" height="14" rx="4" fill={skinHex} />

      {/* Torso */}
      <rect
        x={110 - torsoW / 2}
        y="82"
        width={torsoW}
        height={isFemale ? 75 : 80}
        rx="8"
        fill={torsoItem ? torsoItem.meshColor : '#1e1e2e'}
        opacity={torsoItem ? 0.9 : 0.7}
      />
      {/* Torso outline */}
      <rect
        x={110 - torsoW / 2}
        y="82"
        width={torsoW}
        height={isFemale ? 75 : 80}
        rx="8"
        fill="none"
        stroke={torsoItem ? torsoItem.meshColor : '#3a3a52'}
        strokeWidth="1.5"
        opacity="0.5"
      />

      {/* Arms */}
      <rect x={110 - torsoW / 2 - 22} y="88" width="22" height={55} rx="8" fill={torsoItem ? torsoItem.meshColor : skinHex} opacity="0.85" />
      <rect x={110 + torsoW / 2}       y="88" width="22" height={55} rx="8" fill={torsoItem ? torsoItem.meshColor : skinHex} opacity="0.85" />
      {/* Hands */}
      <circle cx={110 - torsoW / 2 - 11} cy={88 + 55 + 8} r="9" fill={skinHex} />
      <circle cx={110 + torsoW / 2 + 11} cy={88 + 55 + 8} r="9" fill={skinHex} />

      {/* Hip / waistband area */}
      <rect x={110 - hipW / 2} y={isFemale ? 155 : 160} width={hipW} height="12" rx="4"
        fill={legItem ? legItem.meshColor : '#222235'}
        opacity="0.9"
      />

      {/* Left leg */}
      <rect
        x={110 - hipW / 2}
        y={isFemale ? 164 : 169}
        width={hipW / 2 - 3}
        height={isFemale ? 120 : 115}
        rx="8"
        fill={legItem ? legItem.meshColor : '#1a1a2a'}
        opacity="0.9"
      />
      {/* Right leg */}
      <rect
        x={110 + 3}
        y={isFemale ? 164 : 169}
        width={hipW / 2 - 3}
        height={isFemale ? 120 : 115}
        rx="8"
        fill={legItem ? legItem.meshColor : '#1a1a2a'}
        opacity="0.9"
      />

      {/* Shoes */}
      <ellipse cx={110 - hipW / 4} cy={isFemale ? 292 : 290} rx="16" ry={isFemale ? 8 : 7} fill="#1a1208" />
      <ellipse cx={110 + hipW / 4} cy={isFemale ? 292 : 290} rx="16" ry={isFemale ? 8 : 7} fill="#1a1208" />

      {/* Female curves */}
      {isFemale && (
        <>
          <ellipse cx={110 - torsoW / 2 + 12} cy="115" rx="10" ry="8" fill={torsoItem ? torsoItem.meshColor : '#1e1e2e'} opacity="0.6" />
          <ellipse cx={110 + torsoW / 2 - 12} cy="115" rx="10" ry="8" fill={torsoItem ? torsoItem.meshColor : '#1e1e2e'} opacity="0.6" />
        </>
      )}
    </svg>
  );
}

// ─── Customization row helper ─────────────────────────────────────────────────
function ConfigRow({ label, children }) {
  return (
    <div className="mb-5">
      <div className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-accent mb-2 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
        {label}
      </div>
      {children}
    </div>
  );
}

// ─── OutfitScreen (Step 2) ────────────────────────────────────────────────────
export default function OutfitScreen({ selectedItems, avatarConfig, onAvatarChange, onBack, onNext }) {

  function updateConfig(key, value) {
    onAvatarChange({ ...avatarConfig, [key]: value });
  }

  return (
    <div className="h-full overflow-auto grid grid-cols-[1fr_300px] grid-rows-[auto_1fr_auto] gap-0">
      {/* ── Page Header ─── */}
      <div className="col-span-full pt-7 px-12 pb-5 border-b border-border">
        <p className="text-accent text-[0.7rem] font-bold tracking-[0.1em] uppercase mb-1">
          Step 2 of 3
        </p>
        <h2 className="text-[1.6rem] font-extrabold tracking-[-0.025em]">
          Outfit <span className="text-accent">Builder</span>
        </h2>
        <p className="text-text-secondary text-[0.875rem] mt-1">
          Customize your avatar and see how the outfit looks together.
        </p>
      </div>

      {/* ── Left: Avatar Preview ─── */}
      <div className="flex flex-col items-center py-10 px-12 gap-6 overflow-y-auto">
        {/* Avatar canvas */}
        <div className="bg-surface border border-border rounded-xl py-10 px-[60px] flex items-center justify-center relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] h-[80px] bg-[radial-gradient(ellipse,var(--color-accent-glow)_0%,transparent_70%)] pointer-events-none" />
          <StickFigure avatarConfig={avatarConfig} selectedItems={selectedItems} />
        </div>

        {/* Selected items as chips */}
        {selectedItems.length > 0 && (
          <div className="w-full max-w-[360px]">
            <p className="text-[0.7rem] font-bold tracking-[0.08em] uppercase text-text-muted mb-2">
              Your Selection
            </p>
            <div className="flex flex-col gap-1.5">
              {selectedItems.map((item, i) => (
                <div key={item.id} className="flex items-center gap-2.5 px-3 py-2 bg-surface border border-border rounded-sm">
                  {/* Emerald checkmark */}
                  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {/* Color dot */}
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.meshColor }} />
                  <span className="text-[0.8rem] font-semibold text-text-primary">
                    ITEM {i + 1}: {item.name.toUpperCase()}
                  </span>
                  <span className="text-[0.7rem] text-text-muted ml-auto">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Right: Customization Panel ─── */}
      <div className="border-l border-border py-8 px-6 overflow-y-auto bg-surface">
        <h3 className="text-base font-bold mb-6 tracking-[-0.01em]">
          Personalize Avatar
        </h3>

        {/* Skin Tone */}
        <ConfigRow label="Skin Tone">
          <div className="flex gap-2 flex-wrap">
            {SKIN_TONES.map((tone) => (
              <div
                key={tone.hex}
                className={`w-6 h-6 rounded-full cursor-pointer border-2 transition-all ${avatarConfig.skinTone === tone.hex ? 'border-accent scale-110' : 'border-transparent hover:scale-110'}`}
                style={{ background: tone.hex }}
                title={tone.label}
                onClick={() => updateConfig('skinTone', tone.hex)}
              />
            ))}
          </div>
        </ConfigRow>

        {/* Body Shape */}
        <ConfigRow label="Body Shape">
          <div className="flex bg-[var(--color-surface-2)] p-[3px] rounded-lg border border-border">
            {['S', 'M', 'L', 'XL'].map((s) => (
              <button
                key={s}
                className={`flex-1 py-1.5 px-0 text-[0.7rem] font-bold rounded-[5px] border-none transition-colors cursor-pointer ${avatarConfig.bodyShape === s ? 'bg-surface text-accent shadow-sm' : 'bg-transparent text-text-secondary hover:text-text-primary'}`}
                onClick={() => updateConfig('bodyShape', s)}
              >
                {s}
              </button>
            ))}
          </div>
        </ConfigRow>

        {/* Gender */}
        <ConfigRow label="Gender">
          <div className="flex bg-[var(--color-surface-2)] p-[3px] rounded-lg border border-border">
            {['M', 'F', 'X'].map((g) => (
              <button
                key={g}
                className={`flex-1 py-1.5 px-0 text-[0.7rem] font-bold rounded-[5px] border-none transition-colors cursor-pointer ${avatarConfig.gender === g ? 'bg-surface text-accent shadow-sm' : 'bg-transparent text-text-secondary hover:text-text-primary'}`}
                onClick={() => updateConfig('gender', g)}
              >
                {g === 'M' ? '♂ Male' : g === 'F' ? '♀ Female' : '⊕ Non-binary'}
              </button>
            ))}
          </div>
        </ConfigRow>

        {/* Height */}
        <ConfigRow label="Height">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-base font-bold text-accent min-w-[60px]">
              {avatarConfig.height} cm
            </span>
            <span className="text-[0.75rem] text-text-muted">
              ({Math.floor(avatarConfig.height / 30.48)}'{Math.round((avatarConfig.height % 30.48) / 2.54)}")
            </span>
          </div>
          <input
            type="range"
            min={140}
            max={215}
            value={avatarConfig.height}
            onChange={(e) => updateConfig('height', Number(e.target.value))}
            className="w-full accent-accent"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[0.65rem] text-text-muted">140 cm</span>
            <span className="text-[0.65rem] text-text-muted">215 cm</span>
          </div>
        </ConfigRow>

        {/* Weight */}
        <ConfigRow label="Weight">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-base font-bold text-accent min-w-[60px]">
              {avatarConfig.weight} kg
            </span>
            <span className="text-[0.75rem] text-text-muted">
              ({Math.round(avatarConfig.weight * 2.205)} lbs)
            </span>
          </div>
          <input
            type="range"
            min={40}
            max={160}
            value={avatarConfig.weight}
            onChange={(e) => updateConfig('weight', Number(e.target.value))}
            className="w-full accent-accent"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[0.65rem] text-text-muted">40 kg</span>
            <span className="text-[0.65rem] text-text-muted">160 kg</span>
          </div>
        </ConfigRow>
      </div>

      {/* ── Bottom Nav ─── */}
      <div className="col-span-full flex justify-between items-center py-4 px-12 border-t border-border bg-glass-bg backdrop-blur-md">
        <button className="inline-flex items-center justify-center gap-2 rounded bg-transparent text-text-secondary border border-transparent font-bebas tracking-[0.05em] cursor-pointer outline-none transition-all duration-200 ease-out whitespace-nowrap hover:bg-glass-hover hover:text-text-primary hover:border-white/15 px-4 h-[38px] text-[0.9rem]" onClick={onBack}>
          ← Back to Shop
        </button>
        <button
          className="inline-flex items-center justify-center gap-2 rounded bg-accent text-charcoal font-bebas tracking-[0.05em] cursor-pointer outline-none transition-all duration-200 ease-out whitespace-nowrap hover:bg-accent-dim hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(94,220,134,0.25)] active:translate-y-0 disabled:opacity-35 disabled:cursor-not-allowed disabled:transform-none border-none px-10 h-[52px] text-base"
          onClick={onNext}
        >
          See It On You — 3D Preview →
        </button>
      </div>
    </div>
  );
}
