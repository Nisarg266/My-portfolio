/* ============================================================
   NISARG PANCHAL — PORTFOLIO v2 · main.js
   High-end 3D (Three.js) + Lenis smooth scroll + GSAP
   ScrollTrigger choreography + magnetic / tilt interactions
   ============================================================ */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/* ------------------------------------------------------------
   0. SCROLL PROGRESS BAR
   ------------------------------------------------------------ */
const progressBar = document.querySelector('.scroll-progress i');

/* ------------------------------------------------------------
   1. THREE.JS SCENE
   ------------------------------------------------------------ */
const canvas = document.getElementById('scene-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050609, 0.045);

/* Device detection — adjust scene for phones/tablets */
const isMobile  = window.matchMedia('(max-width: 768px)').matches;
const isTablet  = window.matchMedia('(max-width: 1024px)').matches && !isMobile;
const isLowEnd  = isMobile && (navigator.hardwareConcurrency || 4) <= 4;

/* Camera FOV widens on small screens so nothing goes off-screen */
const camFov = isMobile ? 60 : (isTablet ? 50 : 42);
const camera = new THREE.PerspectiveCamera(camFov, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0.5, isMobile ? 12 : 10);

const renderer = new THREE.WebGLRenderer({
  canvas, antialias: !isLowEnd, alpha: true,
  powerPreference: 'high-performance'
});
/* cap pixel ratio for performance on phones */
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

/* Environment for realistic reflections */
const pmrem = new THREE.PMREMGenerator(renderer);
const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environment = envTex;

/* Post-processing — bloom (reduced on mobile for performance) */
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  isMobile ? 0.5 : 0.7,   /* strength */
  isMobile ? 0.4 : 0.6,   /* radius   */
  0.2                     /* threshold*/
);
composer.addPass(bloom);

/* Lights */
scene.add(new THREE.AmbientLight(0x6a7088, 0.4));
const keyLight = new THREE.DirectionalLight(0xfff0c0, 1.6);
keyLight.position.set(5, 7, 6); scene.add(keyLight);
const goldLight = new THREE.PointLight(0xf4d97a, 4, 28);
goldLight.position.set(-5, 2, 4); scene.add(goldLight);
const purpleLight = new THREE.PointLight(0x7c5cff, 3.2, 28);
purpleLight.position.set(5, -2, 3); scene.add(purpleLight);
const cyanLight = new THREE.PointLight(0x25d8ff, 2.2, 24);
cyanLight.position.set(0, 4, -4); scene.add(cyanLight);

/* ------------------------------------------------------------
   2. PREMIUM MATERIALS (with clearcoat + env reflections)
   ------------------------------------------------------------ */
const bodyMat = new THREE.MeshPhysicalMaterial({
  color: 0x101319, metalness: 1.0, roughness: 0.22,
  clearcoat: 1.0, clearcoatRoughness: 0.15, envMapIntensity: 1.4
});
const darkMat = new THREE.MeshPhysicalMaterial({
  color: 0x080a0f, metalness: 0.9, roughness: 0.35, envMapIntensity: 1.0
});
const goldMat = new THREE.MeshPhysicalMaterial({
  color: 0xd4af37, metalness: 1.0, roughness: 0.18,
  clearcoat: 1.0, clearcoatRoughness: 0.1, envMapIntensity: 1.6,
  emissive: 0x4a3a10, emissiveIntensity: 0.35
});
const screenBezelMat = new THREE.MeshPhysicalMaterial({
  color: 0x05060a, metalness: 0.4, roughness: 0.6
});

/* ------------------------------------------------------------
   3. BUILD A DETAILED PREMIUM LAPTOP
   ------------------------------------------------------------ */
const laptop = new THREE.Group();

/* base / keyboard deck — rounded via small chamfer feel */
const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.16, 2.4), bodyMat);
base.position.y = -0.95;
laptop.add(base);

/* gold rim along front edge */
const goldRim = new THREE.Mesh(new THREE.BoxGeometry(3.66, 0.05, 2.46), goldMat);
goldRim.position.y = -0.84;
laptop.add(goldRim);

/* recessed keyboard tray */
const tray = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.04, 1.5), darkMat);
tray.position.set(0, -0.835, 0.32);
laptop.add(tray);

/* keycaps (4 rows x 11 cols) with random RGB glow accents */
const keyGeo = new THREE.BoxGeometry(0.18, 0.05, 0.18);
const keyBase = new THREE.MeshPhysicalMaterial({ color: 0x1a1d26, metalness: 0.5, roughness: 0.45, envMapIntensity: 0.8 });
const rgbColors = [0xff3b6b, 0xff8a3b, 0xfff03b, 0x3bff8a, 0x3bd8ff, 0x9b6bff];
const glowingKeys = [];
for (let r = 0; r < 4; r++) {
  for (let c = 0; c < 11; c++) {
    const glow = Math.random() > 0.82;
    let mat = keyBase;
    if (glow) {
      const col = rgbColors[(r + c) % rgbColors.length];
      mat = new THREE.MeshStandardMaterial({
        color: col, emissive: col, emissiveIntensity: 1.4,
        metalness: 0.2, roughness: 0.4
      });
      glowingKeys.push(mat);
    }
    const k = new THREE.Mesh(keyGeo, mat);
    k.position.set(-1.5 + c * 0.3, -0.79, 0.85 - r * 0.34);
    laptop.add(k);
  }
}
/* spacebar */
const space = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.05, 0.18), goldMat);
space.position.set(0, -0.79, 0.85 - 3 * 0.34);
laptop.add(space);

/* trackpad with gold outline */
const trackpad = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.02, 0.75), bodyMat);
trackpad.position.set(0, -0.83, -0.62);
laptop.add(trackpad);
const tpOutline = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.015, 0.79), goldMat);
tpOutline.position.set(0, -0.825, -0.62);
laptop.add(tpOutline);

/* logo on lid back — glowing gold ring emblem */
const emblem = new THREE.Mesh(
  new THREE.TorusGeometry(0.28, 0.035, 16, 48),
  new THREE.MeshStandardMaterial({ color: 0xf4d97a, emissive: 0xf4d97a, emissiveIntensity: 1.6, metalness: 0.5, roughness: 0.3 })
);

/* ------------------------------------------------------------
   4. SCREEN (hinged lid group) + animated code canvas
   ------------------------------------------------------------ */
const lid = new THREE.Group();
lid.position.set(0, -0.86, -1.18);

/* lid back panel */
const lidBack = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.25, 0.09), bodyMat);
lidBack.position.y = 1.125;
lid.add(lidBack);

/* gold bezel */
const bezel = new THREE.Mesh(new THREE.PlaneGeometry(3.45, 2.1), goldMat);
bezel.position.set(0, 1.125, 0.05);
lid.add(bezel);

/* emblem on back */
emblem.rotation.x = Math.PI;
emblem.position.set(0, 1.125, -0.05);
lid.add(emblem);

/* black inner frame */
const innerFrame = new THREE.Mesh(new THREE.PlaneGeometry(3.3, 1.95), screenBezelMat);
innerFrame.position.set(0, 1.125, 0.055);
lid.add(innerFrame);

/* the screen (canvas texture) */
const screenCanvas = document.createElement('canvas');
screenCanvas.width = 720; screenCanvas.height = 480;
const sctx = screenCanvas.getContext('2d');
const screenTex = new THREE.CanvasTexture(screenCanvas);
screenTex.minFilter = THREE.LinearFilter;
const screen = new THREE.Mesh(
  new THREE.PlaneGeometry(3.15, 1.85),
  new THREE.MeshBasicMaterial({ map: screenTex })
);
screen.position.set(0, 1.125, 0.06);
lid.add(screen);

/* glow plane behind screen (so it leaks light) */
const screenGlow = new THREE.Mesh(
  new THREE.PlaneGeometry(4.2, 2.9),
  new THREE.MeshBasicMaterial({
    color: 0xf4d97a, transparent: true, opacity: 0.18,
    blending: THREE.AdditiveBlending, depthWrite: false
  })
);
screenGlow.position.set(0, 1.125, 0.03);
lid.add(screenGlow);

/* code content shown on screen */
const codeLines = [
  "const developer = {",
  "  name: 'Nisarg Panchal',",
  "  role: 'Front-End Developer',",
  "  stack: ['HTML','CSS','JS','React'],",
  "  craft: 'Immersive 3D web',",
  "  available: true,",
  "  build(idea) {",
  "    return craft(animate(idea));",
  "  }",
  "};",
  "",
  "import { Scene } from 'three';",
  "const world = new Scene();",
  "world.add(developer.build(dream));",
  "",
  "// Let's build something",
  "// extraordinary together ✦",
];
const palette = {
  keyword:'#c792ea', string:'#c3e88d', func:'#82aaff',
  prop:'#f4d97a', comment:'#5d6677', text:'#e6edf3', punct:'#89ddff'
};
let codeScroll = 0;
function drawScreen(t) {
  sctx.fillStyle = '#080a10';
  sctx.fillRect(0, 0, 720, 480);
  const g = sctx.createLinearGradient(0, 0, 720, 480);
  g.addColorStop(0, 'rgba(124,92,255,0.12)');
  g.addColorStop(1, 'rgba(212,175,55,0.07)');
  sctx.fillStyle = g; sctx.fillRect(0, 0, 720, 480);

  /* window title bar */
  sctx.fillStyle = '#11141c'; sctx.fillRect(0, 0, 720, 38);
  sctx.fillStyle = '#ff5f57'; sctx.beginPath(); sctx.arc(26, 19, 6, 0, 7); sctx.fill();
  sctx.fillStyle = '#febc2e'; sctx.beginPath(); sctx.arc(50, 19, 6, 0, 7); sctx.fill();
  sctx.fillStyle = '#28c840'; sctx.beginPath(); sctx.arc(74, 19, 6, 0, 7); sctx.fill();
  sctx.fillStyle = '#5d6677'; sctx.font = '14px "JetBrains Mono", monospace';
  sctx.fillText('nisarg — portfolio.js', 300, 24);

  sctx.font = '16px "JetBrains Mono", monospace';
  const lineH = 23;
  const visible = Math.floor((480 - 38) / lineH);
  const start = Math.floor(codeScroll / lineH) % codeLines.length;
  let lastW = 0;
  for (let i = 0; i < visible + 1; i++) {
    const idx = (start + i) % codeLines.length;
    const y = 62 + i * lineH - (codeScroll % lineH);
    sctx.fillStyle = '#363d4d';
    sctx.fillText(String(idx + 1).padStart(2, '0'), 16, y);
    lastW = drawCodeLine(codeLines[idx], 52, y);
  }
  /* blinking caret */
  if (Math.floor(t / 500) % 2 === 0) {
    sctx.fillStyle = '#f4d97a';
    sctx.fillRect(52 + lastW, 62 + (visible - 1) * lineH - 14, 9, 17);
  }
  /* scanline shimmer */
  sctx.fillStyle = `rgba(244,217,122,${0.03 + 0.025 * Math.sin(t * 0.003)})`;
  for (let yy = 38; yy < 480; yy += 3) sctx.fillRect(0, yy, 720, 1);
  screenTex.needsUpdate = true;
}
function drawCodeLine(text, x, y) {
  let cx = x;
  for (const tk of tokenize(text)) {
    sctx.fillStyle = palette[tk.type] || palette.text;
    sctx.fillText(tk.value, cx, y);
    cx += sctx.measureText(tk.value).width;
  }
  return cx - x;
}
function tokenize(line) {
  const out = [];
  const kw = ['const','function','return','true','false','new','let','var','import','from'];
  let i = 0;
  while (i < line.length) {
    const ch = line[i];
    if (line.startsWith('//', i)) { out.push({type:'comment', value:line.slice(i)}); break; }
    if (ch === "'" || ch === '"' || ch === '`') {
      let j = i + 1; while (j < line.length && line[j] !== ch) j++;
      out.push({type:'string', value:line.slice(i, j + 1)}); i = j + 1; continue;
    }
    if (/[a-zA-Z_$]/.test(ch)) {
      let j = i; while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) j++;
      const w = line.slice(i, j);
      let type = 'text';
      if (kw.includes(w)) type = 'keyword';
      else if (line[j] === '(') type = 'func';
      else if (line[j] === ':') type = 'prop';
      out.push({type, value:w}); i = j; continue;
    }
    if (/[{}()[\];,.<>=:+\-*/]/.test(ch)) { out.push({type:'punct', value:ch}); i++; continue; }
    out.push({type:'text', value:ch}); i++;
  }
  return out;
}

/* tilt lid open */
lid.rotation.x = -0.28;
laptop.add(lid);

laptop.position.set(2.7, 0.5, 0);
laptop.rotation.set(0.06, -0.55, 0);
laptop.scale.setScalar(1.0);
scene.add(laptop);

/* ------------------------------------------------------------
   5. FLOATING SHAPES (gems, torus knots, rings, icosahedrons)
   ------------------------------------------------------------ */
const floaters = new THREE.Group();
scene.add(floaters);
const fMats = [goldMat,
  new THREE.MeshPhysicalMaterial({ color: 0x7c5cff, metalness: 0.7, roughness: 0.25, clearcoat: 1, emissive: 0x2a1e66, emissiveIntensity: 0.5, envMapIntensity: 1.2 }),
  new THREE.MeshPhysicalMaterial({ color: 0x25d8ff, metalness: 0.7, roughness: 0.25, clearcoat: 1, emissive: 0x0a3a44, emissiveIntensity: 0.5, envMapIntensity: 1.2 }),
  darkMat
];
const floatGeos = [
  new THREE.OctahedronGeometry(0.22, 0),
  new THREE.IcosahedronGeometry(0.2, 0),
  new THREE.TetrahedronGeometry(0.24, 0),
  new THREE.DodecahedronGeometry(0.18, 0),
];
const floatCount = isMobile ? 6 : 14;
for (let i = 0; i < floatCount; i++) {
  const geo = floatGeos[i % floatGeos.length];
  const m = new THREE.Mesh(geo, fMats[i % fMats.length]);
  const r = 3.5 + Math.random() * 3.5;
  const a = (i / floatCount) * Math.PI * 2 + Math.random();
  m.position.set(Math.cos(a) * r, (Math.random() - 0.3) * 5, Math.sin(a) * r - 1);
  const baseY = m.position.y;
  m.userData = {
    spin: new THREE.Vector3((Math.random() - 0.5) * 0.03, (Math.random() - 0.5) * 0.03, (Math.random() - 0.5) * 0.03),
    phase: Math.random() * Math.PI * 2,
    baseY,
    amp: 0.2 + Math.random() * 0.3
  };
  floaters.add(m);
}
/* big torus knots */
const knot1 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.32, 0.085, 120, 16), goldMat);
knot1.position.set(-3.4, 1.8, -2);
knot1.userData = { spin: new THREE.Vector3(0.008, 0.014, 0.004), phase: 0, baseY: 1.8, amp: 0.25 };
floaters.add(knot1);
const knot2 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.26, 0.07, 120, 16), fMats[1]);
knot2.position.set(3.6, -1.6, -1.5);
knot2.userData = { spin: new THREE.Vector3(0.012, 0.008, 0.006), phase: 2, baseY: -1.6, amp: 0.3 };
floaters.add(knot2);
/* glowing rings */
for (let i = 0; i < 3; i++) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.7 + i * 0.35, 0.01, 14, 96),
    new THREE.MeshBasicMaterial({ color: 0xf4d97a, transparent: true, opacity: 0.5 })
  );
  ring.position.set(0, 0, -3.5);
  ring.rotation.x = Math.PI / 2 + i * 0.3;
  ring.userData = { spin: new THREE.Vector3(0, 0.004 + i * 0.002, 0), phase: i, baseY: 0, amp: 0 };
  floaters.add(ring);
}

/* ------------------------------------------------------------
   6. PARTICLE FIELD
   ------------------------------------------------------------ */
const pCount = isMobile ? 600 : (isTablet ? 1000 : 1600);
const pGeo = new THREE.BufferGeometry();
const pPos = new Float32Array(pCount * 3);
const pCol = new Float32Array(pCount * 3);
const cGold = new THREE.Color(0xf4d97a), cPur = new THREE.Color(0x7c5cff), cWhite = new THREE.Color(0xffffff);
for (let i = 0; i < pCount; i++) {
  pPos[i*3]   = (Math.random() - 0.5) * 32;
  pPos[i*3+1] = (Math.random() - 0.5) * 24;
  pPos[i*3+2] = (Math.random() - 0.5) * 24;
  const c = [cGold, cPur, cWhite][Math.floor(Math.random() * 3)];
  pCol[i*3] = c.r; pCol[i*3+1] = c.g; pCol[i*3+2] = c.b;
}
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
  size: 0.04, vertexColors: true, transparent: true, opacity: 0.85,
  blending: THREE.AdditiveBlending, depthWrite: false
}));
scene.add(particles);

/* ------------------------------------------------------------
   7. LENIS SMOOTH SCROLL
   ------------------------------------------------------------ */
let lenis = null;
if (window.Lenis) {
  lenis = new window.Lenis({ duration: 1.15, smoothWheel: true, lerp: 0.1 });
  function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
}

/* ------------------------------------------------------------
   8. SCROLL-CHOREOGRAPHED 3D (GSAP ScrollTrigger)
   ------------------------------------------------------------ */
const scrollState = { progress: 0 };
if (window.gsap && window.ScrollTrigger) {
  window.gsap.registerPlugin(window.ScrollTrigger);

  /* feed lenis into ScrollTrigger */
  if (lenis) {
    lenis.on('scroll', window.ScrollTrigger.update);
  }

  /* master timeline — laptop glides to a unique pose for each section */
  const sections = ['hero', 'about', 'skills', 'services', 'experience', 'projects', 'process', 'education', 'contact'];

  /* Desktop poses — laptop moves left/right and rotates between sections */
  const desktopPoses = [
    { x: 2.7,  y: 0.5,  z: 0,    rx: 0.06,  ry: -0.55, rz: 0,     s: 1.00 }, /* hero     */
    { x: -3.0, y: 0.6,  z: -1,   rx: -0.12, ry: 0.55,  rz: 0.05,  s: 0.70 }, /* about    */
    { x: 3.1,  y: -0.2, z: -1,   rx: 0.10,  ry: -0.7,  rz: -0.05, s: 0.62 }, /* skills   */
    { x: -3.0, y: 0.3,  z: -1.2, rx: -0.08, ry: 0.5,   rz: 0.04,  s: 0.6  }, /* services */
    { x: 3.0,  y: 0.8,  z: -1.5, rx: -0.2,  ry: -0.4,  rz: -0.06, s: 0.55 }, /* work     */
    { x: -3.0, y: 0.2,  z: -1.5, rx: -0.05, ry: 0.4,   rz: 0,     s: 0.55 }, /* projects */
    { x: 2.8,  y: 0.5,  z: -1,   rx: 0.1,   ry: -0.5,  rz: -0.04, s: 0.58 }, /* process  */
    { x: -2.8, y: 0.5,  z: -1,   rx: 0.12,  ry: 0.6,   rz: -0.05, s: 0.6  }, /* edu      */
    { x: 0,    y: -0.4, z: -1,   rx: 0,     ry: 0,     rz: 0,     s: 0.78 }, /* contact  */
  ];

  /* Mobile poses — laptop stays centered (narrow screen), smaller, sits behind text */
  const mobilePoses = [
    { x: 0,    y: -1.2, z: 0,    rx: 0.12,  ry: -0.35, rz: 0,     s: 0.72 }, /* hero     */
    { x: 0,    y: 0.6,  z: -2.5, rx: -0.1,  ry: 0.4,   rz: 0.04,  s: 0.5  }, /* about    */
    { x: 0,    y: -0.8, z: -2.5, rx: 0.1,   ry: -0.45, rz: -0.04, s: 0.5  }, /* skills   */
    { x: 0,    y: 0.6,  z: -2.5, rx: -0.08, ry: 0.4,   rz: 0.04,  s: 0.5  }, /* services */
    { x: 0,    y: -0.8, z: -2.5, rx: -0.1,  ry: -0.4,  rz: -0.04, s: 0.48 }, /* work     */
    { x: 0,    y: 0.6,  z: -2.5, rx: -0.05, ry: 0.35,  rz: 0,     s: 0.48 }, /* projects */
    { x: 0,    y: -0.8, z: -2.5, rx: 0.08,  ry: -0.4,  rz: -0.04, s: 0.5  }, /* process  */
    { x: 0,    y: 0.6,  z: -2.5, rx: 0.1,   ry: 0.4,   rz: -0.04, s: 0.5  }, /* edu      */
    { x: 0,    y: -0.4, z: -2,   rx: 0,     ry: 0,     rz: 0,     s: 0.62 }, /* contact  */
  ];

  const poses = isMobile ? mobilePoses : desktopPoses;
  const tl = window.gsap.timeline({
    scrollTrigger: {
      trigger: 'main',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.1
    }
  });
  poses.forEach((p, i) => {
    if (i === 0) {
      window.gsap.set(laptop.position, { x: p.x, y: p.y, z: p.z });
      window.gsap.set(laptop.rotation, { x: p.rx, y: p.ry, z: p.rz });
      window.gsap.set(laptop.scale, { x: p.s, y: p.s, z: p.s });
      return;
    }
    tl.to(laptop.position, { x: p.x, y: p.y, z: p.z, ease: 'none' }, i)
      .to(laptop.rotation, { x: p.rx, y: p.ry, z: p.rz, ease: 'none' }, i)
      .to(laptop.scale,    { x: p.s, y: p.s, z: p.s, ease: 'none' }, i);
  });

  /* progress bar */
  window.ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (s) => {
      scrollState.progress = s.progress;
      if (progressBar) progressBar.style.width = (s.progress * 100) + '%';
    }
  });
}

/* ------------------------------------------------------------
   9. MOUSE PARALLAX + ANIMATION LOOP
   ------------------------------------------------------------ */
let mouseX = 0, mouseY = 0, tMouseX = 0, tMouseY = 0;
window.addEventListener('mousemove', (e) => {
  tMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  tMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

const clock = new THREE.Clock();
function animate() {
  const t = clock.getElapsedTime();
  mouseX += (tMouseX - mouseX) * 0.05;
  mouseY += (tMouseY - mouseY) * 0.05;

  /* screen code scrolls over time + scroll */
  const scrollPx = lenis ? lenis.scroll : window.scrollY;
  codeScroll = (t * 26 + scrollPx * 0.05) % (codeLines.length * 23);
  drawScreen(t * 1000);

  /* RGB keyboard breathing */
  glowingKeys.forEach((m, i) => {
    m.emissiveIntensity = 1.0 + Math.sin(t * 2 + i) * 0.6;
  });
  emblem.material.emissiveIntensity = 1.2 + Math.sin(t * 1.5) * 0.5;
  screenGlow.material.opacity = 0.14 + Math.sin(t * 1.2) * 0.06;

  /* gentle idle float on laptop (added on top of scroll pose) */
  laptop.position.y += Math.sin(t * 0.8) * 0.004;
  lid.rotation.x = -0.28 + Math.sin(t * 0.5) * 0.015;

  /* camera parallax — gentler on mobile so the model stays framed */
  const parAmt = isMobile ? 0.15 : 0.7;
  const parAmtY = isMobile ? 0.1 : 0.45;
  camera.position.x += (mouseX * parAmt - camera.position.x) * 0.05;
  camera.position.y += (0.5 - mouseY * parAmtY - camera.position.y) * 0.05;
  camera.lookAt(0, isMobile ? 0.2 : 0.4, 0);

  /* floaters */
  floaters.children.forEach((m) => {
    const u = m.userData;
    m.rotation.x += u.spin.x; m.rotation.y += u.spin.y; m.rotation.z += u.spin.z;
    m.position.y = u.baseY + Math.sin(t * 0.7 + u.phase) * u.amp;
  });
  floaters.rotation.y = t * 0.025 + mouseX * 0.25;

  /* particles */
  particles.rotation.y = t * 0.01;
  particles.rotation.x = mouseY * 0.08;

  /* lights orbit */
  goldLight.position.x = Math.sin(t * 0.5) * 5;
  purpleLight.position.x = Math.cos(t * 0.4) * 5;

  composer.render();
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  /* widen FOV on portrait phones so the model fits */
  const portrait = window.innerHeight > window.innerWidth;
  camera.fov = (window.innerWidth <= 768) ? (portrait ? 62 : 50) : 42;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  if (window.ScrollTrigger) window.ScrollTrigger.refresh();
});

/* ============================================================
   UI INTERACTIONS
   ============================================================ */

/* Preloader */
const preloader = document.getElementById('preloader');
const preBar = preloader.querySelector('.pre-bar i');
const prePct = preloader.querySelector('.pre-pct');
let pct = 0;
const preTimer = setInterval(() => {
  pct += Math.random() * 15 + 6;
  if (pct >= 100) {
    pct = 100;
    clearInterval(preTimer);
    setTimeout(() => {
      preloader.classList.add('done');
      heroIntro();
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    }, 350);
  }
  preBar.style.width = pct + '%';
  prePct.textContent = Math.floor(pct) + '%';
}, 130);

/* Hero intro */
function heroIntro() {
  if (!window.gsap) return;
  const tl = window.gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-tag', { y: 30, opacity: 0, duration: 0.8 })
    .from('.hero-title .word', { yPercent: 115, opacity: 0, duration: 1.1, stagger: 0.15 }, '-=0.4')
    .from('.hero-role', { y: 25, opacity: 0, duration: 0.7 }, '-=0.7')
    .from('.hero-sub', { y: 25, opacity: 0, duration: 0.8 }, '-=0.5')
    .from('.hero-cta .btn', { y: 25, opacity: 0, duration: 0.7, stagger: 0.12 }, '-=0.5')
    .from('.hero-stat', { y: 25, opacity: 0, duration: 0.6, stagger: 0.12 }, '-=0.4')
    .from('.scroll-hint', { opacity: 0, duration: 0.8 }, '-=0.2');
  countUp();
}

/* Count-up stats */
function countUp() {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const iv = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(iv); }
      el.textContent = cur;
    }, 30);
  });
}

/* Scroll reveal */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      e.target.querySelectorAll?.('.skill-bar i').forEach((b) => {
        b.style.width = b.dataset.w + '%';
      });
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

/* Nav bg on scroll */
const nav = document.getElementById('nav');
function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 60); }
window.addEventListener('scroll', onScroll, { passive: true });
if (lenis) lenis.on('scroll', ({ scroll }) => nav.classList.toggle('scrolled', scroll > 60));

/* Mobile burger */
const burger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

/* Anchor links use Lenis smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        if (lenis) lenis.scrollTo(target, { offset: -20, duration: 1.4 });
        else target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

/* Custom cursor */
const cDot = document.querySelector('.cursor-dot');
const cRing = document.querySelector('.cursor-ring');
let cx = 0, cy = 0, rx = 0, ry = 0;
window.addEventListener('mousemove', (e) => {
  cx = e.clientX; cy = e.clientY;
  cDot.style.left = cx + 'px'; cDot.style.top = cy + 'px';
});
(function ring() {
  rx += (cx - rx) * 0.18;
  ry += (cy - ry) * 0.18;
  cRing.style.left = rx + 'px'; cRing.style.top = ry + 'px';
  requestAnimationFrame(ring);
})();
document.querySelectorAll('a, .btn, [data-cursor], .skill-card, .project-card, .tl-card, .social, .nav-burger')
  .forEach((el) => {
    el.addEventListener('mouseenter', () => cRing.classList.add('grow'));
    el.addEventListener('mouseleave', () => cRing.classList.remove('grow'));
  });

/* Magnetic buttons (buttons & socials follow the cursor slightly) — skip on touch */
if (!isMobile) {
document.querySelectorAll('.magnetic').forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const mx = e.clientX - r.left - r.width / 2;
    const my = e.clientY - r.top - r.height / 2;
    if (window.gsap) {
      window.gsap.to(el, { x: mx * 0.35, y: my * 0.4, duration: 0.4, ease: 'power3.out' });
    }
  });
  el.addEventListener('mouseleave', () => {
    if (window.gsap) window.gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' });
  });
});
}

/* 3D tilt on cards — skip on touch devices */
if (!isMobile) {
document.querySelectorAll('[data-tilt]').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform =
      `perspective(900px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateY(0) rotateX(0)';
  });
});
}

/* Footer year */
document.getElementById('year').textContent = new Date().getFullYear();

/* START */
animate();
