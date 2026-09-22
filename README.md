# 3D Virtual Fitting Room (React + Three.js)

A full-stack web application that lets users browse 3D clothing models, customize them on a personalized avatar, and visualize the outfit in a 3D mirror environment.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Open http://localhost:5173 in your browser
```

---

## 📁 Project Structure

```text
3D-Clothing-Simulation/
├── public/                    # Static assets (GLB models, background)
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── canvas/            # 3D Canvas elements
│   │   ├── ShopScreen.jsx     # Step 1: Product listing & catalog
│   │   ├── OutfitScreen.jsx   # Step 2: Avatar customization & config
│   │   ├── MirrorScreen.jsx   # Step 3: 3D wardrobe & mirror
│   │   ├── Avatar3D.jsx       # Core 3D engine (Three.js + React Three Fiber)
│   │   └── ...                # Other UI flow components (ScanBody, CartScreen, etc.)
│   ├── data/                  # Mock data (clothes, avatars, categories)
│   ├── App.jsx                # Main application layout & navigation
│   └── index.css              # Global styles & Tailwind v4 theme
├── index.html                 # Entry point
└── package.json               # Dependencies & scripts
```

---

## 📋 Step-by-Step Workflow

### Step 1: Shopping (UI)
- **Browse & filter** clothes by category (top, bottom, dress, jacket, etc.)
- **Select items** to add to your virtual wardrobe
- **View item details** with realistic fabric mockups
- **Simple, clean** card-based layout with hover effects

### Step 2: Outfit Customization (State)
- **Customize avatar** before dressing
  - Skin tone picker (porcelain, sand, espresso, etc.)
  - Body shape presets (S, M, L, XL) with real-time previews
  - Height & weight sliders
- **Assign items** to specific body parts
  - Drag-and-drop from wardrobe to avatar slots
  - Automatic body part detection
- **State management** via `App.jsx` context

### Step 3: 3D Fitting Room (Rendering)
- **Interactive 3D scene** built with Three.js
- **Realistic rendering** with PBR materials
- **User controls**:
  - Rotate camera (orbit controls)
  - Zoom in/out
  - Pan (right-click drag)
  - Reset view
- **Lighting**:
  - Directional key light
  - Fill light
  - Rim light for depth
  - HDRI background for realistic reflections

---

## 🔧 Technical Implementation

### Core Technologies
- **Frontend**: React 19 + Vite
- **3D Rendering**: Three.js + React Three Fiber (R3F)
- **Animation**: Framer Motion
- **Styling**: Tailwind CSS v4

### Key Components

#### `@/components/MirrorScreen.jsx`
- Wraps `@/components/Avatar3D.jsx`
- Handles loading glTF models from `public/models/`
- Applies colorization to meshes based on selected items
- Configures camera controls and lighting

#### `@/components/Avatar3D.jsx`
- Renders `Canvas` with `Suspense` for 3D assets
- Loads avatar base mesh from `public/models/`
- Applies mesh colors dynamically
- Handles lighting, camera controls, and environment mapping

---

## 📦 Installation & Dependencies

```bash
# Install dependencies
npm install

# Production build
npm run build
```

**Dependencies:**
- `react`, `react-dom`, `framer-motion`
- `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
- `three`
- `tailwindcss`, `@tailwindcss/vite`

---

## 🎨 Design System

**Tailwind v4 Theme (defined in `src/index.css`):**

The application uses Tailwind CSS v4 to manage its modern, glassmorphic UI.

```css
@theme {
  --color-accent: #5edc86;
  --color-accent-dim: #4ebc73;
  --color-accent-glow: rgba(94, 220, 134, 0.25);
  --color-accent-glass: rgba(94, 220, 134, 0.1);
  --color-charcoal: #1a1a1a;
  --color-bg: #2f3638;
  --color-surface: #374244;
  --color-surface-2: #435053;
  --color-border: rgba(255, 255, 255, 0.1);
  --color-border-em: rgba(94, 220, 134, 0.4);
  --color-text-primary: #ffffff;
  --color-text-secondary: #c2c9cb;
  --color-text-muted: #8a9598;
  --color-glass-bg: rgba(47, 54, 56, 0.85);

  --font-bebas: "Bebas Neue", sans-serif;
  --font-inter: "Inter", system-ui, sans-serif;
}
```
