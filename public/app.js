/**
 * KadiPeel 360 - Interactive Peeling Simulation & Invented Device Engine
 * Developed for Uzbek "Kadi" (Butternut Squash / Figured Gourd)
 * Author: Husan Boymurodov
 */

(function () {
  'use strict';

  // --- Localization Dictionary ---
  const i18n = {
    uz: {
      tagline: 'Озғин фигурали кади (butternut squash) арчиш мосламаси',
      blueprintBtn: 'Мослама чизмаси',
      instruction: 'Бармоғингиз ёки сичқонча билан кади устидан судраб арчинг!',
      peeledLabel: 'Арчилди:',
      statusLabel: 'Ҳолат:',
      statusReady: 'Тайёр, бошланг',
      statusPeeling: 'Арчилмоқда...',
      statusDone: '100% Мукаммал!',
      swipeHint: 'Судраб арчинг (Swipe to peel)',
      chuteLabel: 'Пўстлоқ лотоги',
      autoPeelBtn: 'KadiPeel 360 Автo-Арчиш',
      resetBtn: 'Янги кади қўйиш',
      bladeSizeLabel: 'Пичоқ:',
      innovTag: 'Инновацион Ечим',
      whyTitle: 'Нима учун кади (butternut squash)ни оддий пичоқда арчиш қийин?',
      whyDesc: 'Кадининг иккита асосий муаммоси бор: 1) Сирти жуда қаттиқ ва мумсимон (сирғанади); 2) Шакли гитарасимон (юқориси озғин бўйин, пасти думалоқ қорин). Оддий арчгичлар бурилишда тўхтайди, қўл чарчайди ва шикастланиш хавфи юқори бўлади.',
      feat1Title: '1. Телескопик 2-ўқли қисқич (Spindle Clamp)',
      feat1Desc: 'Кадининг узунлигига (20–45 см) мослашувчан вертикал ўқ. Дум ва пастки марказини маҳкам тутиб, мутлақо барқарор айлантиради.',
      feat2Title: '2. Сузувчи контур кузатувчи (Contour Follower)',
      feat2Desc: 'Пружинали эркин шарнир ёрдамида пичоқ озғин бўйинчадан кенг қорингача бўлган ҳар бир эгриликни 100% аниқ такрорлаб сирпанади.',
      feat3Title: '3. 0.8 мм Микророликли чекловчи',
      feat3Desc: 'Пичоқ олдида юрувчи силикон ролик чуқурликни 0.8 мм да қатъий ушлайди. Ширин ва мазали ички қисми мутлақо исроф бўлмайди.',
      feat4Title: '4. Сайд-Редуктор ёки Type-C Мотор',
      feat4Desc: 'Қўлда айлантириш учун 1:4 тезлаштирувчи қулай дастак ёки 15 сонияда бутун кадини спирал қилиб тозалаб берувчи ихчам мотор.',
      feat5Title: '5. Спирал тасма чиқинди лотоги',
      feat5Desc: 'Арчилган пўстлоқ атрофга сачрамасдан, яхлит чиройли лента бўлиб пастдаги олинадиган тоза лотокка тушади. Қўллар тоза қолади.',
      feat6Title: 'Ўзбек ошхонаси учун идеал',
      feat6Desc: 'Кади сомса, кади манти ва ширин қовоқ оши учун ошқовоқ тайёрлаш вақтини 15 дақиқадан 30 сонияга қисқартиради!',
      modalTitle: 'KadiPeel 360 Инженерлик Чизмаси',
      diagramNote: '⚡ Ишлаш принципи: Фойдаланувчи кадини 2 та қисқич ўртасига ўрнатади. Пружинали сузувчи пичоқ бошчаси кадининг бўйнидан бошлаб қовурғасини қаттиқ сиқиб туради. Дастакни айлантирганда ёки моторни ёққанда, кади айланади ва пичоқ автоматик пастга йўналади — бутун пўстлоқ лентадек сидириб олинади.',
      celebTitle: 'Кади Мукаммал Арчилди! 🎉',
      celebSub: 'Бирорта ҳам тотли лаҳм қисми исроф бўлмади. Энди нима таом тайёрлаймиз?',
      rec1Title: 'Кади Сомса',
      rec1Desc: 'Тандирда пишган ширин қовоқ, майда туғралган думба ва зирали хушбўй сомса.',
      rec2Title: 'Кади Манти',
      rec2Desc: 'Касконда пишган юпқа хамирли, сершира ва майин қовоқ манти.',
      rec3Title: 'Қовоқли Тўй Оши',
      rec3Desc: 'Думба ёғида қовурилган девзира гуручи ва тилларанг кади бўлаклари.',
      peelAgain: 'Яна битта кади арчиш'
    },
    en: {
      tagline: 'Contour Peeling Mechanism for Butternut Squash (Kadi)',
      blueprintBtn: 'Device Blueprint',
      instruction: 'Drag your finger or mouse across the squash to peel!',
      peeledLabel: 'Peeled:',
      statusLabel: 'Status:',
      statusReady: 'Ready, begin',
      statusPeeling: 'Peeling...',
      statusDone: '100% Perfect!',
      swipeHint: 'Swipe to peel',
      chuteLabel: 'Peel Waste Chute',
      autoPeelBtn: 'KadiPeel 360 Auto-Peel',
      resetBtn: 'Load Fresh Kadi',
      bladeSizeLabel: 'Blade:',
      innovTag: 'Innovative Design',
      whyTitle: 'Why is peeling butternut squash (Kadi) so difficult with a standard peeler?',
      whyDesc: 'Butternut squash has two major hurdles: 1) The rind is dense, waxy and dangerously slippery; 2) The hourglass shape (slender neck transition to bulbous belly). Standard peelers catch on curves, cause hand fatigue, and waste edible sweet flesh.',
      feat1Title: '1. Telescopic Dual-Axis Spindle Clamp',
      feat1Desc: 'Telescoping vertical post adjusts to any length (20–45 cm). Clamps the top stem and bottom blossom center for vibration-free rotation.',
      feat2Title: '2. Floating Contour-Tracking Blade Arm',
      feat2Desc: 'Spring-loaded dual-pivot follower hugs the exact curvature from narrow neck through waist to bulbous base with zero manual angle adjustments.',
      feat3Title: '3. 0.8 mm Micro-Depth Guide Roller',
      feat3Desc: 'Precision micro-roller glides ahead of the ceramic/steel blade, locking peeling depth strictly to 0.8 mm. Zero sweet flesh wasted.',
      feat4Title: '4. Planetary Crank or Type-C Motor',
      feat4Desc: 'Smooth 1:4 gear ratio hand crank or whisper-quiet rechargeable USB-C motor peels the entire squash in under 15 seconds.',
      feat5Title: '5. Continuous Spiral Waste Chute',
      feat5Desc: 'Peel ribbons peel off in a clean continuous spiral directly down into an easy-empty collection tray. Hands stay 100% clean and safe.',
      feat6Title: 'Ideal for Uzbek Cuisine',
      feat6Desc: 'Cuts prep time for Kadi Somsa, Kadi Manti, and Holiday Osh from 15 minutes of strenuous knife work to just 30 seconds!',
      modalTitle: 'KadiPeel 360 Engineering Schematic',
      diagramNote: '⚡ Principle: Clamp squash between top chuck and rotary turntable. Floating spring arm presses against neck. Turning the crank or motor rotates the squash while the arm spirals downward, removing peel in a single smooth ribbon.',
      celebTitle: '100% Perfectly Peeled! 🎉',
      celebSub: 'Zero sweet flesh was wasted. What traditional dish are we cooking?',
      rec1Title: 'Kadi Somsa',
      rec1Desc: 'Crisp tandoor samosas filled with sweet diced pumpkin, tender spices, and savory accents.',
      rec2Title: 'Kadi Manti',
      rec2Desc: 'Steamed delicate dumplings bursting with juicy, melt-in-your-mouth spiced squash.',
      rec3Title: 'Holiday Festive Palov',
      rec3Desc: 'Golden devzira rice pilaf simmered with tender beef and golden cubes of sweet kadi.',
      peelAgain: 'Peel Another Kadi'
    }
  };

  let currentLang = 'uz';

  // --- Audio Synthesis Engine (Web Audio API) ---
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.lastPlayTime = 0;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playPeelSound(speed = 1) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      if (now - this.lastPlayTime < 0.05) return; // Throttle sound bursts
      this.lastPlayTime = now;

      try {
        const bufferSize = this.ctx.sampleRate * 0.06; // 60ms sound
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        // Bandpass filter for slicing "shhhk" sound
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2600 + Math.min(speed * 15, 1200), now);
        filter.Q.setValueAtTime(3.0, now);

        // Amplitude envelope
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
      } catch (err) {
        // Silently catch audio restrictions
      }
    }

    playVictorySound() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.12, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.4);
      });
    }
  }

  const soundEngine = new SoundEngine();

  // --- Peel Ribbon Particle System ---
  class RibbonParticleSystem {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
    }

    emit(x, y, vx, vy) {
      if (this.particles.length > 60) return;
      const length = 18 + Math.random() * 22;
      const width = 6 + Math.random() * 5;
      this.particles.push({
        x: x,
        y: y,
        vx: vx + (Math.random() - 0.5) * 4,
        vy: vy + Math.random() * 2 + 1.5,
        length: length,
        width: width,
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() - 0.5) * 0.25,
        curl: Math.random() * 0.4 + 0.2,
        alpha: 1.0,
        colorOuter: '#f59e0b',
        colorInner: '#ea580c'
      });
    }

    updateAndDraw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.vx *= 0.98; // air drag
        p.angle += p.vAngle;
        p.alpha -= 0.018;

        if (p.alpha <= 0 || p.y > this.canvas.height) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.angle);
        this.ctx.globalAlpha = p.alpha;

        // Draw curled ribbon strip
        this.ctx.beginPath();
        this.ctx.moveTo(-p.width / 2, 0);
        this.ctx.quadraticCurveTo(0, p.length * p.curl, p.width / 2, p.length);
        this.ctx.strokeStyle = p.colorOuter;
        this.ctx.lineWidth = p.width;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();

        // Inner flesh sliver
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(0, p.length * 0.8);
        this.ctx.strokeStyle = p.colorInner;
        this.ctx.lineWidth = p.width * 0.4;
        this.ctx.stroke();

        this.ctx.restore();
      }
    }
  }

  // --- Main Interactive Peeling Application ---
  class KadiSimulator {
    constructor() {
      // DOM Elements
      this.wrapper = document.getElementById('canvasWrapper');
      this.canvas = document.getElementById('peelCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.ribbonCanvas = document.getElementById('ribbonCanvas');
      this.virtualBlade = document.getElementById('virtualBlade');
      this.hintOverlay = document.getElementById('hintOverlay');

      this.progressText = document.getElementById('progressText');
      this.statusMessage = document.getElementById('statusMessage');
      this.autoPeelBtn = document.getElementById('autoPeelBtn');
      this.resetBtn = document.getElementById('resetBtn');
      this.depthThin = document.getElementById('depthThin');
      this.depthThick = document.getElementById('depthThick');
      this.soundToggle = document.getElementById('soundToggle');
      this.soundOnIcon = document.getElementById('soundOnIcon');
      this.soundOffIcon = document.getElementById('soundOffIcon');
      this.blueprintBtn = document.getElementById('blueprintBtn');
      this.blueprintModal = document.getElementById('blueprintModal');
      this.closeModalBtn = document.getElementById('closeModalBtn');
      this.celebrationModal = document.getElementById('celebrationModal');
      this.peelAgainBtn = document.getElementById('peelAgainBtn');
      this.langToggle = document.getElementById('langToggle');
      this.langLabel = document.getElementById('langLabel');

      // State
      this.peelRadius = 18; // Default thin blade (0.8mm representation)
      this.isDragging = false;
      this.lastPos = null;
      this.peeledPercentage = 0;
      this.samplePoints = [];
      this.isAutoPeeling = false;
      this.autoPeelTimer = null;
      this.hasInteracted = false;
      this.completed = false;

      // Offscreen buffers
      this.fleshCanvas = document.createElement('canvas');
      this.fleshCtx = this.fleshCanvas.getContext('2d');

      this.skinCanvas = document.createElement('canvas');
      this.skinCtx = this.skinCanvas.getContext('2d');

      this.ribbonSystem = new RibbonParticleSystem(this.ribbonCanvas);

      this.init();
    }

    init() {
      this.resize();
      window.addEventListener('resize', () => this.resize());

      this.bindEvents();
      this.updateTranslations();
      this.renderLoop();
    }

    resize() {
      const rect = this.wrapper.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = rect.width;
      const h = rect.height;

      this.canvas.width = w * dpr;
      this.canvas.height = h * dpr;
      this.canvas.style.width = `${w}px`;
      this.canvas.style.height = `${h}px`;
      this.ctx.scale(dpr, dpr);

      this.ribbonCanvas.width = w * dpr;
      this.ribbonCanvas.height = h * dpr;
      this.ribbonCanvas.style.width = `${w}px`;
      this.ribbonCanvas.style.height = `${h}px`;
      this.ribbonSystem.ctx.scale(dpr, dpr);

      this.fleshCanvas.width = w;
      this.fleshCanvas.height = h;

      this.skinCanvas.width = w;
      this.skinCanvas.height = h;

      this.width = w;
      this.height = h;

      this.setupSquashGeometry();
      this.generateSquashLayers();
      this.sampleSilhouettePoints();
      this.renderPeelLayer();
    }

    setupSquashGeometry() {
      // Geometry of authentic slender hourglass butternut squash ("Kadi")
      this.cx = this.width / 2;
      this.topY = 40;
      this.bottomY = this.height - 40;
      this.squashHeight = this.bottomY - this.topY;
    }

    /**
     * Radius function defining the butternut squash figure:
     * - Top stem: slender
     * - Neck: long, slender cylindrical figure
     * - Waist: gentle waist indentation
     * - Bottom belly: wide bulbous pear-shaped round body
     */
    getRadiusAtY(y) {
      if (y < this.topY || y > this.bottomY) return 0;
      const t = (y - this.topY) / this.squashHeight; // 0 (top) to 1 (bottom)

      if (t < 0.03) {
        // Stem neck taper
        return 16 + (t / 0.03) * 12;
      } else if (t < 0.38) {
        // Slender neck portion (Ozgin kadi bo'yni)
        const neckProgress = (t - 0.03) / 0.35;
        return 28 + Math.sin(neckProgress * Math.PI) * 4;
      } else if (t < 0.52) {
        // Waist transition (Bel qismi)
        const waistProgress = (t - 0.38) / 0.14;
        return 32 + waistProgress * 14;
      } else if (t < 0.88) {
        // Bulbous body (Dumaloq qorin qismi)
        const bellyProgress = (t - 0.52) / 0.36;
        return 46 + Math.sin(bellyProgress * Math.PI) * 32;
      } else {
        // Bottom base curve (Tag qismi)
        const baseProgress = (t - 0.88) / 0.12;
        return 78 * Math.cos(baseProgress * (Math.PI / 2));
      }
    }

    isPointInsideSquash(x, y) {
      if (y < this.topY || y > this.bottomY) return false;
      const r = this.getRadiusAtY(y);
      return Math.abs(x - this.cx) <= r;
    }

    /**
     * Draw the organic silhouette path of the kadi
     */
    drawSquashPath(ctx) {
      ctx.beginPath();
      const steps = 60;
      // Right side contour from top to bottom
      for (let i = 0; i <= steps; i++) {
        const y = this.topY + (i / steps) * this.squashHeight;
        const r = this.getRadiusAtY(y);
        const x = this.cx + r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      // Left side contour from bottom to top
      for (let i = steps; i >= 0; i--) {
        const y = this.topY + (i / steps) * this.squashHeight;
        const r = this.getRadiusAtY(y);
        const x = this.cx - r;
        ctx.lineTo(x, y);
      }
      ctx.closePath();
    }

    generateSquashLayers() {
      // 1. Render Flesh Layer (Rich, sweet orange meat)
      const fCtx = this.fleshCtx;
      fCtx.clearRect(0, 0, this.width, this.height);

      fCtx.save();
      this.drawSquashPath(fCtx);
      fCtx.clip();

      // Deep orange radial/linear gradient
      const fleshGrad = fCtx.createLinearGradient(this.cx - 80, this.topY, this.cx + 80, this.bottomY);
      fleshGrad.addColorStop(0, '#f97316');
      fleshGrad.addColorStop(0.4, '#fb923c');
      fleshGrad.addColorStop(0.7, '#ea580c');
      fleshGrad.addColorStop(1, '#c2410c');
      fCtx.fillStyle = fleshGrad;
      fCtx.fill();

      // Juicy pulp 3D highlight down the center
      const highlightGrad = fCtx.createLinearGradient(this.cx - 20, 0, this.cx + 40, 0);
      highlightGrad.addColorStop(0, 'rgba(254, 215, 170, 0.45)');
      highlightGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
      highlightGrad.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
      fCtx.fillStyle = highlightGrad;
      fCtx.fill();

      // Fine organic squash fibers texture
      fCtx.strokeStyle = 'rgba(194, 65, 12, 0.25)';
      fCtx.lineWidth = 1.2;
      for (let y = this.topY + 10; y < this.bottomY - 10; y += 6) {
        const r = this.getRadiusAtY(y);
        fCtx.beginPath();
        fCtx.moveTo(this.cx - r * 0.8, y);
        fCtx.quadraticCurveTo(this.cx + (Math.random() - 0.5) * 15, y + 2, this.cx + r * 0.8, y);
        fCtx.stroke();
      }

      // Seeds cavity shadow in the lower belly
      const cavityY = this.topY + this.squashHeight * 0.76;
      const cavityGrad = fCtx.createRadialGradient(this.cx, cavityY, 5, this.cx, cavityY, 40);
      cavityGrad.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
      cavityGrad.addColorStop(0.5, 'rgba(234, 88, 12, 0.15)');
      cavityGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      fCtx.fillStyle = cavityGrad;
      fCtx.beginPath();
      fCtx.ellipse(this.cx, cavityY, 32, 42, 0, 0, Math.PI * 2);
      fCtx.fill();

      fCtx.restore();

      // 2. Render Skin Layer (Waxy pale golden butternut rind)
      const sCtx = this.skinCtx;
      sCtx.clearRect(0, 0, this.width, this.height);

      sCtx.save();
      this.drawSquashPath(sCtx);
      sCtx.clip();

      // Golden waxy rind gradient
      const skinGrad = sCtx.createLinearGradient(this.cx - 80, 0, this.cx + 80, 0);
      skinGrad.addColorStop(0, '#d97706');
      skinGrad.addColorStop(0.2, '#f59e0b');
      skinGrad.addColorStop(0.45, '#fde68a'); // soft waxy sheen
      skinGrad.addColorStop(0.75, '#f59e0b');
      skinGrad.addColorStop(1, '#b45309');
      sCtx.fillStyle = skinGrad;
      sCtx.fill();

      // Longitudinal pale subtle stripes characteristic of Kadi
      sCtx.strokeStyle = 'rgba(254, 243, 199, 0.28)';
      sCtx.lineWidth = 2.5;
      const stripeOffsets = [-0.65, -0.4, -0.15, 0.15, 0.4, 0.65];
      stripeOffsets.forEach(ratio => {
        sCtx.beginPath();
        for (let y = this.topY; y <= this.bottomY; y += 10) {
          const r = this.getRadiusAtY(y);
          const x = this.cx + r * ratio;
          if (y === this.topY) sCtx.moveTo(x, y);
          else sCtx.lineTo(x, y);
        }
        sCtx.stroke();
      });

      // Stem at top
      sCtx.restore();

      // Draw Top Woody Stem (Dumi)
      sCtx.save();
      sCtx.fillStyle = '#3f3f46';
      sCtx.strokeStyle = '#15803d';
      sCtx.lineWidth = 2;
      sCtx.beginPath();
      sCtx.moveTo(this.cx - 7, this.topY);
      sCtx.quadraticCurveTo(this.cx - 9, this.topY - 18, this.cx - 4, this.topY - 26);
      sCtx.lineTo(this.cx + 5, this.topY - 26);
      sCtx.quadraticCurveTo(this.cx + 8, this.topY - 16, this.cx + 7, this.topY);
      sCtx.closePath();
      sCtx.fill();
      sCtx.stroke();
      sCtx.restore();
    }

    sampleSilhouettePoints() {
      this.samplePoints = [];
      const step = 8;
      for (let y = this.topY + 10; y < this.bottomY - 10; y += step) {
        const r = this.getRadiusAtY(y);
        for (let x = this.cx - r + 4; x <= this.cx + r - 4; x += step) {
          this.samplePoints.push({ x, y });
        }
      }
    }

    renderPeelLayer() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      // Draw underlying flesh
      this.ctx.drawImage(this.fleshCanvas, 0, 0);
      // Draw peel layer on top
      this.ctx.drawImage(this.skinCanvas, 0, 0);
    }

    calculatePeeledPercentage() {
      if (this.samplePoints.length === 0) return 0;

      // Sample pixels on skinCanvas
      const imgData = this.skinCtx.getImageData(0, 0, this.width, this.height).data;
      let peeledCount = 0;

      for (let i = 0; i < this.samplePoints.length; i++) {
        const pt = this.samplePoints[i];
        const idx = (Math.floor(pt.y) * this.width + Math.floor(pt.x)) * 4;
        const alpha = imgData[idx + 3];
        if (alpha < 60) {
          peeledCount++;
        }
      }

      const percent = Math.min(100, Math.round((peeledCount / this.samplePoints.length) * 100));
      return percent;
    }

    peelAt(x, y, prevX, prevY) {
      if (this.completed) return;

      const sCtx = this.skinCtx;
      sCtx.save();
      sCtx.globalCompositeOperation = 'destination-out';

      // Draw stroke erasing skin
      sCtx.beginPath();
      if (prevX !== null && prevY !== null) {
        sCtx.moveTo(prevX, prevY);
        sCtx.lineTo(x, y);
        sCtx.lineWidth = this.peelRadius * 2;
        sCtx.lineCap = 'round';
        sCtx.stroke();
      } else {
        sCtx.arc(x, y, this.peelRadius, 0, Math.PI * 2);
        sCtx.fill();
      }
      sCtx.restore();

      // Emit peel ribbons
      if (this.isPointInsideSquash(x, y)) {
        const vx = (x - (prevX || x)) * 0.4;
        const vy = (y - (prevY || y)) * 0.4;
        const speed = Math.sqrt(vx * vx + vy * vy);
        this.ribbonSystem.emit(x, y, vx, vy);
        soundEngine.playPeelSound(speed);

        // Haptic feedback for touch devices
        if (navigator.vibrate && Math.random() < 0.25) {
          navigator.vibrate(12);
        }
      }

      this.renderPeelLayer();
      this.updateProgress();
    }

    updateProgress() {
      const percent = this.calculatePeeledPercentage();
      this.peeledPercentage = percent;
      this.progressText.textContent = `${percent}%`;

      const t = i18n[currentLang];
      if (percent === 0) {
        this.statusMessage.textContent = t.statusReady;
      } else if (percent < 95) {
        this.statusMessage.textContent = t.statusPeeling;
      } else {
        this.statusMessage.textContent = t.statusDone;
        if (!this.completed) {
          this.triggerCompletion();
        }
      }
    }

    triggerCompletion() {
      this.completed = true;
      soundEngine.playVictorySound();
      this.celebrationModal.classList.remove('hidden');

      // Launch victory ribbons
      for (let i = 0; i < 40; i++) {
        setTimeout(() => {
          this.ribbonSystem.emit(
            this.cx + (Math.random() - 0.5) * 120,
            this.topY + Math.random() * this.squashHeight,
            (Math.random() - 0.5) * 8,
            -Math.random() * 4
          );
        }, i * 30);
      }
    }

    startAutoPeel() {
      if (this.isAutoPeeling) return;
      this.resetSquash();
      this.isAutoPeeling = true;
      this.autoPeelBtn.disabled = true;
      this.autoPeelBtn.style.opacity = '0.6';

      let currentY = this.topY + 6;
      let angle = 0;
      let lastX = null;
      let lastY = null;

      this.virtualBlade.classList.add('active');

      const autoInterval = setInterval(() => {
        if (!this.isAutoPeeling || currentY >= this.bottomY) {
          clearInterval(autoInterval);
          this.isAutoPeeling = false;
          this.autoPeelBtn.disabled = false;
          this.autoPeelBtn.style.opacity = '1';
          this.virtualBlade.classList.remove('active');
          if (currentY >= this.bottomY) {
            this.progressText.textContent = '100%';
            this.triggerCompletion();
          }
          return;
        }

        const r = this.getRadiusAtY(currentY);
        // Spiral motion around contour
        angle += 0.45;
        const x = this.cx + Math.sin(angle) * r;
        currentY += 1.8; // Downward feed rate

        this.updateVirtualBlade(x, currentY, angle);
        this.peelAt(x, currentY, lastX, lastY);

        lastX = x;
        lastY = currentY;
      }, 25);
    }

    updateVirtualBlade(x, y, angle = 0) {
      this.virtualBlade.style.left = `${x}px`;
      this.virtualBlade.style.top = `${y}px`;
      this.virtualBlade.style.transform = `translate(-50%, -50%) rotate(${angle * 20}deg)`;
    }

    resetSquash() {
      this.isAutoPeeling = false;
      this.completed = false;
      this.peeledPercentage = 0;
      this.progressText.textContent = '0%';
      this.statusMessage.textContent = i18n[currentLang].statusReady;
      this.celebrationModal.classList.add('hidden');
      this.virtualBlade.classList.remove('active');

      this.generateSquashLayers();
      this.renderPeelLayer();
    }

    getPointerPos(e) {
      const rect = this.wrapper.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    bindEvents() {
      const onStart = (e) => {
        if (this.isAutoPeeling) return;
        this.isDragging = true;
        soundEngine.init();

        if (!this.hasInteracted) {
          this.hasInteracted = true;
          this.hintOverlay.style.opacity = '0';
        }

        const pos = this.getPointerPos(e);
        this.lastPos = pos;
        this.virtualBlade.classList.add('active');
        this.updateVirtualBlade(pos.x, pos.y);
        this.peelAt(pos.x, pos.y, null, null);
      };

      const onMove = (e) => {
        if (!this.isDragging || this.isAutoPeeling) return;
        e.preventDefault();

        const pos = this.getPointerPos(e);
        const prev = this.lastPos;
        this.updateVirtualBlade(pos.x, pos.y, Math.atan2(pos.y - prev.y, pos.x - prev.x));
        this.peelAt(pos.x, pos.y, prev.x, prev.y);
        this.lastPos = pos;
      };

      const onEnd = () => {
        this.isDragging = false;
        this.lastPos = null;
        if (!this.isAutoPeeling) {
          this.virtualBlade.classList.remove('active');
        }
      };

      // Mouse Listeners
      this.wrapper.addEventListener('mousedown', onStart);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);

      // Touch Listeners
      this.wrapper.addEventListener('touchstart', onStart, { passive: false });
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onEnd);
      window.addEventListener('touchcancel', onEnd);

      // Buttons
      this.autoPeelBtn.addEventListener('click', () => this.startAutoPeel());
      this.resetBtn.addEventListener('click', () => this.resetSquash());
      this.peelAgainBtn.addEventListener('click', () => this.resetSquash());

      // Depth Selectors
      this.depthThin.addEventListener('click', () => {
        this.peelRadius = 18;
        this.depthThin.classList.add('active');
        this.depthThick.classList.remove('active');
      });

      this.depthThick.addEventListener('click', () => {
        this.peelRadius = 28;
        this.depthThick.classList.add('active');
        this.depthThin.classList.remove('active');
      });

      // Sound Toggle
      this.soundToggle.addEventListener('click', () => {
        soundEngine.enabled = !soundEngine.enabled;
        this.soundOnIcon.classList.toggle('hidden', !soundEngine.enabled);
        this.soundOffIcon.classList.toggle('hidden', soundEngine.enabled);
      });

      // Blueprint Modal
      this.blueprintBtn.addEventListener('click', () => {
        this.blueprintModal.classList.remove('hidden');
      });
      this.closeModalBtn.addEventListener('click', () => {
        this.blueprintModal.classList.add('hidden');
      });
      this.blueprintModal.addEventListener('click', (e) => {
        if (e.target === this.blueprintModal) {
          this.blueprintModal.classList.add('hidden');
        }
      });

      // Language Switcher
      this.langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'uz' ? 'en' : 'uz';
        this.langLabel.textContent = currentLang.toUpperCase();
        this.updateTranslations();
      });
    }

    updateTranslations() {
      const t = i18n[currentLang];
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
          el.textContent = t[key];
        }
      });
      this.updateProgress();
    }

    renderLoop() {
      this.ribbonSystem.updateAndDraw();
      requestAnimationFrame(() => this.renderLoop());
    }
  }

  // Launch when DOM is ready
  window.addEventListener('DOMContentLoaded', () => {
    new KadiSimulator();
  });
})();
