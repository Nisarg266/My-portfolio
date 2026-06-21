# Nisarg Panchal — 3D Animated Portfolio

A premium, dark-luxury portfolio website featuring a **scroll-driven 3D scene**:
a glowing laptop running live scrolling code, floating geometric shapes,
particle fields, and bloom post-processing — all built with **Three.js** and pure
HTML/CSS/JavaScript (no build step, no frameworks to install).

![tech](https://img.shields.io/badge/Three.js-3D-black) ![tech](https://img.shields.io/badge/GSAP-Animation-orange) ![tech](https://img.shields.io/badge/No%20Build-Required-blue)

---

## ✨ Features

- 🖥️ **Scroll-driven 3D laptop** — a procedural (code-generated) laptop whose
  screen shows live syntax-highlighted code that scrolls as you scroll the page.
  The whole laptop flies, rotates and shrinks as you move down the site.
- 💎 **Floating 3D shapes** — octahedron gems, torus-knot "code loops", and
  glowing rings drifting in space.
- ✨ **Particle field + bloom glow** — UnrealBloomPass makes every emissive
  element glow like real neon/gold.
- 🪄 **Mouse parallax** — the camera gently follows your cursor.
- 🎯 **Custom cursor**, animated preloader, scroll-reveal sections, count-up
  stats, skill bars, a vertical experience timeline.
- 📱 **Fully responsive** with a mobile burger menu.
- 🎨 **Gold-on-near-black** luxury palette with glassmorphism cards.

## 📁 Files

```
nisarg-portfolio/
├── index.html      ← page structure + all sections
├── style.css       ← premium theme, layout, animations
├── main.js         ← Three.js 3D scene + scroll wiring + UI
└── README.md
```

## 🚀 How to run

> ⚠️ **Important:** Open it via a **local web server**, not by double-clicking
> the file. Browsers block ES-module loading from `file://`, which the 3D scene
> needs. Any one of these works:

**Option A — VS Code (easiest):**
1. Open the `nisarg-portfolio` folder in VS Code.
2. Install the **"Live Server"** extension.
3. Right-click `index.html` → **Open with Live Server**.

**Option B — Python (already installed on your machine):**
```bash
cd C:\Users\panch\ZCodeProject\nisarg-portfolio
python -m http.server 8000
```
Then open http://localhost:8000 in your browser.

**Option C — Node:**
```bash
npx serve .
```

## 🛠️ How to customize

- **Your info** (email, phone, GitHub, stats) → edit `index.html`.
- **Code shown on the laptop screen** → edit the `codeLines` array in `main.js`.
- **Colors** → tweak the CSS variables at the top of `style.css`
  (`--gold`, `--bg`, `--accent`, etc.).
- **3D behaviour** → the `animate()` function in `main.js` controls how the
  laptop moves with scroll (position, rotation, scale lerp values).

## 🧰 Tech

Three.js (WebGL + post-processing) · GSAP · Canvas Texture for the code screen ·
IntersectionObserver for scroll reveals · 100% dependency-free CSS.

---

Built for **Nisarg Panchal** — Front-End Developer. ♦
