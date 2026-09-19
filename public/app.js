/**
 * KadiArch - Ozg'in Qovoq (Kadi) Archish Moslamasi
 * Chiroyli va tabiiy kadi qiyofasi hamda qulay archish simulyatori
 * Muallif: Husan Boymurodov
 */

(function () {
  'use strict';

  // --- Ovoz Mexanizmi (Web Audio API) ---
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
      if (now - this.lastPlayTime < 0.045) return;
      this.lastPlayTime = now;

      try {
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.055);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        // Mayin pichoq shitirlashi uchun filtr
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2700 + Math.min(speed * 12, 1100), now);
        filter.Q.setValueAtTime(3.2, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
      } catch (err) {
        // Audio cheklovlari yuzaga kelsa jim o'tkazish
      }
    }

    playVictorySound() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];
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

  // --- Po'stloq Lentalari Zarrachalar Tizimi ---
  class RibbonParticleSystem {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
    }

    emit(x, y, vx, vy) {
      if (this.particles.length > 70) return;
      const length = 22 + Math.random() * 26;
      const width = 6 + Math.random() * 5;
      this.particles.push({
        x: x,
        y: y,
        vx: vx + (Math.random() - 0.5) * 4.2,
        vy: vy + Math.random() * 2.5 + 1.8,
        length: length,
        width: width,
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() - 0.5) * 0.28,
        curl: Math.random() * 0.4 + 0.25,
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
        p.vy += 0.28;
        p.vx *= 0.97;
        p.angle += p.vAngle;
        p.alpha -= 0.016;

        if (p.alpha <= 0 || p.y > this.canvas.height) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.angle);
        this.ctx.globalAlpha = p.alpha;

        // Spiral bukilgan po'stloq tasmasi
        this.ctx.beginPath();
        this.ctx.moveTo(-p.width / 2, 0);
        this.ctx.quadraticCurveTo(0, p.length * p.curl, p.width / 2, p.length);
        this.ctx.strokeStyle = p.colorOuter;
        this.ctx.lineWidth = p.width;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();

        // Qirqilgan ichki qizil-sariq qismi
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(0, p.length * 0.85);
        this.ctx.strokeStyle = p.colorInner;
        this.ctx.lineWidth = p.width * 0.4;
        this.ctx.stroke();

        this.ctx.restore();
      }
    }
  }

  // --- Asosiy KadiArch Simulyatori ---
  class KadiArchSimulator {
    constructor() {
      // Elementlar
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
      this.soundToggle = document.getElementById('soundToggle');
      this.soundOnIcon = document.getElementById('soundOnIcon');
      this.soundOffIcon = document.getElementById('soundOffIcon');
      this.blueprintBtn = document.getElementById('blueprintBtn');
      this.blueprintModal = document.getElementById('blueprintModal');
      this.closeModalBtn = document.getElementById('closeModalBtn');
      this.celebrationModal = document.getElementById('celebrationModal');
      this.peelAgainBtn = document.getElementById('peelAgainBtn');

      // Optimal yagona pichoq o'lchami
      this.peelRadius = 22;
      this.isDragging = false;
      this.lastPos = null;
      this.peeledPercentage = 0;
      this.samplePoints = [];
      this.isAutoPeeling = false;
      this.hasInteracted = false;
      this.completed = false;

      // Offscreen chizish buferlari
      this.fleshCanvas = document.createElement('canvas');
      this.fleshCtx = this.fleshCanvas.getContext('2d');

      this.skinCanvas = document.createElement('canvas');
      this.skinCtx = this.skinCanvas.getContext('2d');

      this.ribbonSystem = new RibbonParticleSystem(this.ribbonCanvas);

      // Kadi shakli uchun tabiiy va nafis Catmull-Rom nazorat nuqtalari
      // Haqiqiy o'zbek kadisi: uzun, muloyim ozg'in bo'yin va to'liq yumaloq qorin
      this.controlPoints = [
        { t: 0.00, r: 22 }, // Dum asosi
        { t: 0.04, r: 34 }, // Bo'yin boshlanishi
        { t: 0.15, r: 35 }, // Uzun ozg'in bo'yin
        { t: 0.28, r: 36 }, // Bo'yin o'rtasi
        { t: 0.40, r: 38 }, // Belga o'tish
        { t: 0.52, r: 48 }, // Qorin boshlanishi
        { t: 0.65, r: 76 }, // Qorin kengayishi
        { t: 0.74, r: 88 }, // Qorinning eng to'liq qismi
        { t: 0.86, r: 82 }, // Qorin pasti
        { t: 0.94, r: 58 }, // Tag qismining dumaloqligi
        { t: 1.00, r: 16 }  // Tag tugun o'rni
      ];

      this.init();
    }

    init() {
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.bindEvents();
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
      this.baseCx = this.width / 2;
      this.topY = 46;
      this.bottomY = this.height - 46;
      this.squashHeight = this.bottomY - this.topY;
    }

    /**
     * Kadi markaziy o'qining mayin tabiiy egilishi
     */
    getCenterAtY(y) {
      const t = (y - this.topY) / this.squashHeight;
      // Tabiiy qovoqlardagi nozik 3-4 piksellik mayin tiriklik egilishi
      return this.baseCx + Math.sin(t * Math.PI) * 3.5;
    }

    /**
     * Catmull-Rom Spline orqali kadi qovurg'asi radiusini hisoblash
     */
    getRadiusAtY(y) {
      if (y < this.topY || y > this.bottomY) return 0;
      const t = (y - this.topY) / this.squashHeight;

      const pts = this.controlPoints;
      let i = 0;
      while (i < pts.length - 2 && pts[i + 1].t < t) {
        i++;
      }

      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[Math.min(pts.length - 1, i + 1)];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];

      const segT = (t - p1.t) / (p2.t - p1.t);
      const t2 = segT * segT;
      const t3 = t2 * segT;
      const v0 = (p2.r - p0.r) * 0.5;
      const v1 = (p3.r - p1.r) * 0.5;

      const r = (2 * p1.r - 2 * p2.r + v0 + v1) * t3 +
                (-3 * p1.r + 3 * p2.r - 2 * v0 - v1) * t2 +
                v0 * segT + p1.r;

      return Math.max(0, r);
    }

    isPointInsideSquash(x, y) {
      if (y < this.topY || y > this.bottomY) return false;
      const cx = this.getCenterAtY(y);
      const r = this.getRadiusAtY(y);
      return Math.abs(x - cx) <= r;
    }

    drawSquashPath(ctx) {
      ctx.beginPath();
      const steps = 80;
      // O'ng tomon konturi
      for (let i = 0; i <= steps; i++) {
        const y = this.topY + (i / steps) * this.squashHeight;
        const cx = this.getCenterAtY(y);
        const r = this.getRadiusAtY(y);
        const x = cx + r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      // Pastki dumaloq asosi
      const bottomCx = this.getCenterAtY(this.bottomY);
      ctx.quadraticCurveTo(bottomCx, this.bottomY + 8, bottomCx - 14, this.bottomY);

      // Chap tomon konturi
      for (let i = steps; i >= 0; i--) {
        const y = this.topY + (i / steps) * this.squashHeight;
        const cx = this.getCenterAtY(y);
        const r = this.getRadiusAtY(y);
        const x = cx - r;
        ctx.lineTo(x, y);
      }
      // Yuqori bo'yin ulanishi
      const topCx = this.getCenterAtY(this.topY);
      ctx.quadraticCurveTo(topCx, this.topY - 4, topCx + 14, this.topY);
      ctx.closePath();
    }

    generateSquashLayers() {
      // ==========================================
      // 1. LAHM QATLAMI (Ichki shirin qovoq go'shti)
      // ==========================================
      const fCtx = this.fleshCtx;
      fCtx.clearRect(0, 0, this.width, this.height);

      fCtx.save();
      this.drawSquashPath(fCtx);
      fCtx.clip();

      // Boy va sershira tabiiy apelsin-sabzi tusidagi gradyent
      const fleshGrad = fCtx.createRadialGradient(
        this.baseCx - 35, this.topY + this.squashHeight * 0.45, 20,
        this.baseCx, this.topY + this.squashHeight * 0.6, this.squashHeight * 0.65
      );
      fleshGrad.addColorStop(0, '#ff7d26');
      fleshGrad.addColorStop(0.3, '#ff6a00');
      fleshGrad.addColorStop(0.65, '#ea580c');
      fleshGrad.addColorStop(1, '#b43b02');
      fCtx.fillStyle = fleshGrad;
      fCtx.fill();

      // Qovoq etining nozik tolalari va yaltirashi
      fCtx.fillStyle = 'rgba(255, 237, 213, 0.18)';
      fCtx.beginPath();
      fCtx.ellipse(this.baseCx - 16, this.topY + this.squashHeight * 0.35, 18, 90, -0.05, 0, Math.PI * 2);
      fCtx.fill();

      // Lahmdagi tabiiy go'sht tolalari
      fCtx.strokeStyle = 'rgba(180, 50, 5, 0.18)';
      fCtx.lineWidth = 1.3;
      for (let y = this.topY + 12; y < this.bottomY - 12; y += 6) {
        const cx = this.getCenterAtY(y);
        const r = this.getRadiusAtY(y);
        fCtx.beginPath();
        fCtx.moveTo(cx - r * 0.82, y);
        fCtx.quadraticCurveTo(cx + (Math.sin(y * 0.1) * 8), y + 1.5, cx + r * 0.82, y);
        fCtx.stroke();
      }

      // Pastdagi urug' xonasi soyasi
      const cavityY = this.topY + this.squashHeight * 0.73;
      const cavityGrad = fCtx.createRadialGradient(this.baseCx, cavityY, 8, this.baseCx, cavityY, 46);
      cavityGrad.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
      cavityGrad.addColorStop(0.55, 'rgba(234, 88, 12, 0.15)');
      cavityGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      fCtx.fillStyle = cavityGrad;
      fCtx.beginPath();
      fCtx.ellipse(this.baseCx, cavityY, 34, 48, 0, 0, Math.PI * 2);
      fCtx.fill();

      fCtx.restore();

      // ==========================================
      // 2. PO'STLOQ QATLAMI (Haqiqiy mumsimon kadi)
      // ==========================================
      const sCtx = this.skinCtx;
      sCtx.clearRect(0, 0, this.width, this.height);

      sCtx.save();
      this.drawSquashPath(sCtx);
      sCtx.clip();

      // Asosiy tabiiy kadi rangi: sarg'ish-qaymoq, asal va pista rang tovlanishi
      const skinGrad = sCtx.createLinearGradient(this.baseCx - 100, 0, this.baseCx + 100, 0);
      skinGrad.addColorStop(0.0, '#c78a36'); // Chap qirra soyasi
      skinGrad.addColorStop(0.18, '#f3cb7c'); // Nur tushgan qismi
      skinGrad.addColorStop(0.38, '#fae6b2'); // Yaltirash markazi
      skinGrad.addColorStop(0.65, '#f0c470'); // Mayin qovoq rangi
      skinGrad.addColorStop(0.88, '#d49439'); // O'ng tomon soyasi
      skinGrad.addColorStop(1.0, '#a86a1e'); // O'ng chetki to'q soya
      sCtx.fillStyle = skinGrad;
      sCtx.fill();

      // Kadining o'ziga xos bo'ylama mayin qovurg'a chiziqlari (natural ribs)
      const ribs = [-0.72, -0.48, -0.22, 0.05, 0.32, 0.58, 0.78];
      ribs.forEach(offset => {
        sCtx.beginPath();
        sCtx.lineWidth = 3.2;
        sCtx.strokeStyle = 'rgba(255, 250, 235, 0.26)';
        for (let y = this.topY; y <= this.bottomY; y += 8) {
          const cx = this.getCenterAtY(y);
          const r = this.getRadiusAtY(y);
          const x = cx + r * offset;
          if (y === this.topY) sCtx.moveTo(x, y);
          else sCtx.lineTo(x, y);
        }
        sCtx.stroke();
      });

      // Yorug'likning vertikal mayin yaltirashi (Specular highlight)
      const highlight = sCtx.createLinearGradient(this.baseCx - 40, 0, this.baseCx - 10, 0);
      highlight.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
      highlight.addColorStop(0.5, 'rgba(255, 253, 245, 0.36)');
      highlight.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      sCtx.fillStyle = highlight;
      sCtx.beginPath();
      for (let y = this.topY; y <= this.bottomY; y += 6) {
        const cx = this.getCenterAtY(y);
        const r = this.getRadiusAtY(y);
        const x1 = cx - r * 0.52;
        const x2 = cx - r * 0.22;
        if (y === this.topY) sCtx.moveTo(x1, y);
        else sCtx.lineTo(x1, y);
      }
      for (let y = this.bottomY; y >= this.topY; y -= 6) {
        const cx = this.getCenterAtY(y);
        const r = this.getRadiusAtY(y);
        const x2 = cx - r * 0.22;
        sCtx.lineTo(x2, y);
      }
      sCtx.closePath();
      sCtx.fill();

      sCtx.restore();

      // ==========================================
      // 3. DUM QISMI (Haqiqiy yog'ochsimon qovoq dumi)
      // ==========================================
      sCtx.save();
      const topCx = this.getCenterAtY(this.topY);

      // Dumning kadi bilan ulanish yashil-jigarrang asosi
      sCtx.fillStyle = '#44403c';
      sCtx.beginPath();
      sCtx.moveTo(topCx - 12, this.topY + 3);
      sCtx.lineTo(topCx - 14, this.topY);
      sCtx.lineTo(topCx - 6, this.topY - 4);
      sCtx.lineTo(topCx, this.topY - 2);
      sCtx.lineTo(topCx + 8, this.topY - 4);
      sCtx.lineTo(topCx + 14, this.topY);
      sCtx.lineTo(topCx + 12, this.topY + 3);
      sCtx.closePath();
      sCtx.fill();

      // Dum tanasi (biroz chapga tabiiy egilgan)
      const stemGrad = sCtx.createLinearGradient(topCx - 12, 0, topCx + 12, 0);
      stemGrad.addColorStop(0, '#3f3a32');
      stemGrad.addColorStop(0.4, '#635b4c');
      stemGrad.addColorStop(0.7, '#4e5b38'); // Nozik yashillik
      stemGrad.addColorStop(1, '#2f2b25');
      sCtx.fillStyle = stemGrad;

      sCtx.beginPath();
      sCtx.moveTo(topCx - 8, this.topY - 2);
      sCtx.quadraticCurveTo(topCx - 12, this.topY - 18, topCx - 6, this.topY - 28);
      sCtx.lineTo(topCx + 5, this.topY - 28);
      sCtx.quadraticCurveTo(topCx + 9, this.topY - 16, topCx + 8, this.topY - 2);
      sCtx.closePath();
      sCtx.fill();

      // Dumning kesilgan ustki qirrasi
      sCtx.fillStyle = '#78716c';
      sCtx.beginPath();
      sCtx.ellipse(topCx - 0.5, this.topY - 28, 5.5, 2.5, 0, 0, Math.PI * 2);
      sCtx.fill();

      sCtx.restore();

      // ==========================================
      // 4. TAGIDAGI GULTOJ TUGUNI (Blossom scar)
      // ==========================================
      sCtx.save();
      const bottomCx = this.getCenterAtY(this.bottomY);
      sCtx.fillStyle = '#78350f';
      sCtx.beginPath();
      sCtx.arc(bottomCx, this.bottomY + 1, 3.5, 0, Math.PI * 2);
      sCtx.fill();
      sCtx.restore();
    }

    sampleSilhouettePoints() {
      this.samplePoints = [];
      const step = 8;
      for (let y = this.topY + 10; y < this.bottomY - 10; y += step) {
        const cx = this.getCenterAtY(y);
        const r = this.getRadiusAtY(y);
        for (let x = cx - r + 4; x <= cx + r - 4; x += step) {
          this.samplePoints.push({ x, y });
        }
      }
    }

    renderPeelLayer() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.drawImage(this.fleshCanvas, 0, 0);
      this.ctx.drawImage(this.skinCanvas, 0, 0);
    }

    calculatePeeledPercentage() {
      if (this.samplePoints.length === 0) return 0;
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

      return Math.min(100, Math.round((peeledCount / this.samplePoints.length) * 100));
    }

    peelAt(x, y, prevX, prevY) {
      if (this.completed) return;

      const sCtx = this.skinCtx;
      sCtx.save();
      sCtx.globalCompositeOperation = 'destination-out';

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

      // Po'stloq lentalarini chiqarish
      if (this.isPointInsideSquash(x, y)) {
        const vx = (x - (prevX || x)) * 0.42;
        const vy = (y - (prevY || y)) * 0.42;
        const speed = Math.sqrt(vx * vx + vy * vy);
        this.ribbonSystem.emit(x, y, vx, vy);
        soundEngine.playPeelSound(speed);

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

      if (percent === 0) {
        this.statusMessage.textContent = 'Tayyor, boshlang';
      } else if (percent < 95) {
        this.statusMessage.textContent = 'Archilmoqda...';
      } else {
        this.statusMessage.textContent = '100% Mukammal!';
        if (!this.completed) {
          this.triggerCompletion();
        }
      }
    }

    triggerCompletion() {
      this.completed = true;
      soundEngine.playVictorySound();
      this.celebrationModal.classList.remove('hidden');

      for (let i = 0; i < 40; i++) {
        setTimeout(() => {
          const cx = this.getCenterAtY(this.topY + this.squashHeight * 0.5);
          this.ribbonSystem.emit(
            cx + (Math.random() - 0.5) * 130,
            this.topY + Math.random() * this.squashHeight,
            (Math.random() - 0.5) * 8,
            -Math.random() * 4
          );
        }, i * 28);
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

        const cx = this.getCenterAtY(currentY);
        const r = this.getRadiusAtY(currentY);
        angle += 0.45;
        const x = cx + Math.sin(angle) * r;
        currentY += 1.8;

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
      this.statusMessage.textContent = 'Tayyor, boshlang';
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

      // Sichqoncha hodisalari
      this.wrapper.addEventListener('mousedown', onStart);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);

      // Sensor (Touch) hodisalari
      this.wrapper.addEventListener('touchstart', onStart, { passive: false });
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onEnd);
      window.addEventListener('touchcancel', onEnd);

      // Tugmalar
      this.autoPeelBtn.addEventListener('click', () => this.startAutoPeel());
      this.resetBtn.addEventListener('click', () => this.resetSquash());
      this.peelAgainBtn.addEventListener('click', () => this.resetSquash());

      // Ovoz tugmasi
      this.soundToggle.addEventListener('click', () => {
        soundEngine.enabled = !soundEngine.enabled;
        this.soundOnIcon.classList.toggle('hidden', !soundEngine.enabled);
        this.soundOffIcon.classList.toggle('hidden', soundEngine.enabled);
      });

      // Chizma modali
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
    }

    renderLoop() {
      this.ribbonSystem.updateAndDraw();
      requestAnimationFrame(() => this.renderLoop());
    }
  }

  // Sahifa yuklanganda ishga tushirish
  window.addEventListener('DOMContentLoaded', () => {
    new KadiArchSimulator();
  });
})();
