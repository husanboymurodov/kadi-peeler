/**
 * KadiArch - Interaktiv Kadi Archish Moslamasi va Veb-Trenajyor
 * Muallif: Husan Boymurodov
 */

(function () {
  'use strict';

  // --- Ovoz Sintezi (Web Audio API) ---
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

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2800 + Math.min(speed * 12, 1100), now);
        filter.Q.setValueAtTime(3.2, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.09, now);
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

  // --- Po'stloq Lentalari Zarrachalar Tizimi ---
  class RibbonParticleSystem {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
    }

    emit(x, y, vx, vy) {
      if (this.particles.length > 75) return;
      const length = 20 + Math.random() * 24;
      const width = 6 + Math.random() * 5;
      this.particles.push({
        x: x,
        y: y,
        vx: vx + (Math.random() - 0.5) * 4.5,
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
        p.vy += 0.28; // Gravitatsiya
        p.vx *= 0.97; // Havo qarshiligi
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

        // Spiral o'ralgan tasma
        this.ctx.beginPath();
        this.ctx.moveTo(-p.width / 2, 0);
        this.ctx.quadraticCurveTo(0, p.length * p.curl, p.width / 2, p.length);
        this.ctx.strokeStyle = p.colorOuter;
        this.ctx.lineWidth = p.width;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();

        // Ichki qizil-sariq eti
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

  // --- Asosiy Simulyator ---
  class KadiArchSimulator {
    constructor() {
      // DOM Elementlar
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

      // Doimiy yagona pichoq o'lchami (optimal 22px)
      this.peelRadius = 22;
      this.isDragging = false;
      this.lastPos = null;
      this.peeledPercentage = 0;
      this.samplePoints = [];
      this.isAutoPeeling = false;
      this.hasInteracted = false;
      this.completed = false;

      // Offscreen buferlar
      this.fleshCanvas = document.createElement('canvas');
      this.fleshCtx = this.fleshCanvas.getContext('2d');

      this.skinCanvas = document.createElement('canvas');
      this.skinCtx = this.skinCanvas.getContext('2d');

      this.ribbonSystem = new RibbonParticleSystem(this.ribbonCanvas);

      // Kadi kontur nuqtalari (Catmull-Rom spline nazorati)
      this.controlPoints = [
        { t: 0.00, r: 24 }, // Dum ulanish qismi
        { t: 0.05, r: 35 }, // Yuqori bo'yin kengayishi
        { t: 0.16, r: 36 }, // Mayin va ozg'in bo'yin
        { t: 0.30, r: 37 }, // Bo'yin o'rtasi
        { t: 0.42, r: 42 }, // Bel qismi
        { t: 0.55, r: 56 }, // Qorin boshlanishi
        { t: 0.72, r: 86 }, // To'liq dumaloq qorin cho'qqisi
        { t: 0.85, r: 84 }, // Qorin pasti
        { t: 0.94, r: 62 }, // Tag silliq aylanishi
        { t: 1.00, r: 14 }  // Tag asosi
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
      this.cx = this.width / 2;
      this.topY = 44;
      this.bottomY = this.height - 44;
      this.squashHeight = this.bottomY - this.topY;
    }

    /**
     * Catmull-Rom Spline orqali haqiqiy, silliq va chiroyli kadi konturi
     */
    getRadiusAtY(y) {
      if (y < this.topY || y > this.bottomY) return 0;
      const t = (y - this.topY) / this.squashHeight; // 0 dan 1 gacha

      const pts = this.controlPoints;
      // Oraliqni aniqlash
      let i = 0;
      while (i < pts.length - 2 && pts[i + 1].t < t) {
        i++;
      }

      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[Math.min(pts.length - 1, i + 1)];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];

      const segT = (t - p1.t) / (p2.t - p1.t);

      // Catmull-Rom formulasi
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
      const r = this.getRadiusAtY(y);
      return Math.abs(x - this.cx) <= r;
    }

    drawSquashPath(ctx) {
      ctx.beginPath();
      const steps = 70;
      // O'ng tomon
      for (let i = 0; i <= steps; i++) {
        const y = this.topY + (i / steps) * this.squashHeight;
        const r = this.getRadiusAtY(y);
        const x = this.cx + r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      // Chap tomon
      for (let i = steps; i >= 0; i--) {
        const y = this.topY + (i / steps) * this.squashHeight;
        const r = this.getRadiusAtY(y);
        const x = this.cx - r;
        ctx.lineTo(x, y);
      }
      ctx.closePath();
    }

    generateSquashLayers() {
      // 1. Lahm (Go'sht) Qatlami - Mazali va sershira to'q sariq
      const fCtx = this.fleshCtx;
      fCtx.clearRect(0, 0, this.width, this.height);

      fCtx.save();
      this.drawSquashPath(fCtx);
      fCtx.clip();

      // Asosiy to'q sariq gradyent
      const fleshGrad = fCtx.createLinearGradient(this.cx - 90, this.topY, this.cx + 90, this.bottomY);
      fleshGrad.addColorStop(0, '#ff781f');
      fleshGrad.addColorStop(0.35, '#fb923c');
      fleshGrad.addColorStop(0.7, '#ea580c');
      fleshGrad.addColorStop(1, '#c2410c');
      fCtx.fillStyle = fleshGrad;
      fCtx.fill();

      // 3D Hajm nuri
      const highlightGrad = fCtx.createLinearGradient(this.cx - 30, 0, this.cx + 50, 0);
      highlightGrad.addColorStop(0, 'rgba(254, 215, 170, 0.45)');
      highlightGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
      highlightGrad.addColorStop(1, 'rgba(0, 0, 0, 0.28)');
      fCtx.fillStyle = highlightGrad;
      fCtx.fill();

      // Lahmdagi tabiiy mayin tolalari
      fCtx.strokeStyle = 'rgba(194, 65, 12, 0.22)';
      fCtx.lineWidth = 1.2;
      for (let y = this.topY + 12; y < this.bottomY - 12; y += 7) {
        const r = this.getRadiusAtY(y);
        fCtx.beginPath();
        fCtx.moveTo(this.cx - r * 0.82, y);
        fCtx.quadraticCurveTo(this.cx + (Math.random() - 0.5) * 16, y + 2, this.cx + r * 0.82, y);
        fCtx.stroke();
      }

      // Pastki qorindagi urug' uyasi soyasi
      const cavityY = this.topY + this.squashHeight * 0.74;
      const cavityGrad = fCtx.createRadialGradient(this.cx, cavityY, 8, this.cx, cavityY, 44);
      cavityGrad.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
      cavityGrad.addColorStop(0.6, 'rgba(234, 88, 12, 0.16)');
      cavityGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      fCtx.fillStyle = cavityGrad;
      fCtx.beginPath();
      fCtx.ellipse(this.cx, cavityY, 34, 46, 0, 0, Math.PI * 2);
      fCtx.fill();

      fCtx.restore();

      // 2. Po'stloq Qatlami - Chiroyli mumsimon sarg'ish kadi po'sti
      const sCtx = this.skinCtx;
      sCtx.clearRect(0, 0, this.width, this.height);

      sCtx.save();
      this.drawSquashPath(sCtx);
      sCtx.clip();

      // Tabiiy kadi po'stlog'i tuslari
      const skinGrad = sCtx.createLinearGradient(this.cx - 90, 0, this.cx + 90, 0);
      skinGrad.addColorStop(0, '#d97706');
      skinGrad.addColorStop(0.22, '#f59e0b');
      skinGrad.addColorStop(0.48, '#fde68a'); // Quyosh yaltirashi
      skinGrad.addColorStop(0.8, '#f59e0b');
      skinGrad.addColorStop(1, '#b45309');
      sCtx.fillStyle = skinGrad;
      sCtx.fill();

      // Nozik oqish bo'ylama chiziqlar (kadiga xos chiziqlar)
      sCtx.strokeStyle = 'rgba(254, 243, 199, 0.28)';
      sCtx.lineWidth = 2.4;
      const stripeOffsets = [-0.68, -0.42, -0.16, 0.16, 0.42, 0.68];
      stripeOffsets.forEach(ratio => {
        sCtx.beginPath();
        for (let y = this.topY; y <= this.bottomY; y += 8) {
          const r = this.getRadiusAtY(y);
          const x = this.cx + r * ratio;
          if (y === this.topY) sCtx.moveTo(x, y);
          else sCtx.lineTo(x, y);
        }
        sCtx.stroke();
      });

      sCtx.restore();

      // 3. Tepadagi yog'ochsimon qovoq dumi (Stem)
      sCtx.save();
      sCtx.fillStyle = '#44403c';
      sCtx.strokeStyle = '#15803d';
      sCtx.lineWidth = 2;
      sCtx.beginPath();
      sCtx.moveTo(this.cx - 8, this.topY);
      sCtx.quadraticCurveTo(this.cx - 10, this.topY - 18, this.cx - 5, this.topY - 26);
      sCtx.lineTo(this.cx + 6, this.topY - 26);
      sCtx.quadraticCurveTo(this.cx + 9, this.topY - 16, this.cx + 8, this.topY);
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
          this.ribbonSystem.emit(
            this.cx + (Math.random() - 0.5) * 130,
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

        const r = this.getRadiusAtY(currentY);
        angle += 0.45;
        const x = this.cx + Math.sin(angle) * r;
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
