// ==============================================
// Floating Glyphs for Brief Wizard Section
// Optimized: CSS transitions instead of canvas
// Reduced to 3 icons (50% fewer active elements)
// ==============================================

class FloatingGlyphsCSS {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    // Ensure container has position relative
    if (getComputedStyle(this.container).position === 'static') {
      this.container.style.position = 'relative';
    }

    // Reduced from 5 to 3 icon types (50% reduction)
    this.icons = ['✏️', '📢', '💡'];
    this.currentIndex = 0;
    this.activeGlyph = null;

    this.init();
  }

  init() {
    // Inject CSS for glyph animations once
    if (!document.getElementById('glyph-styles')) {
      const style = document.createElement('style');
      style.id = 'glyph-styles';
      style.textContent = `
        .floating-glyph {
          position: absolute;
          pointer-events: none;
          z-index: 5;
          font-size: 2.5rem;
          opacity: 0;
          transform: translateY(0) rotate(0deg);
          transition: opacity 0.7s ease, transform 4s cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.3));
          will-change: transform, opacity;
        }
        .floating-glyph.active {
          opacity: 0.6;
          transform: translateY(-20px) rotate(8deg);
        }
        .floating-glyph.fade-out {
          opacity: 0;
          transform: translateY(-40px) rotate(15deg);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
      `;
      document.head.appendChild(style);
    }

    // Spawn cycle: one glyph at a time, every 5s
    this.spawnGlyph();
    this.interval = setInterval(() => this.spawnGlyph(), 5000);
  }

  spawnGlyph() {
    // Remove previous glyph
    if (this.activeGlyph) {
      const old = this.activeGlyph;
      old.classList.remove('active');
      old.classList.add('fade-out');
      setTimeout(() => old.remove(), 700);
    }

    // Create new glyph element
    const el = document.createElement('span');
    el.className = 'floating-glyph';
    el.textContent = this.icons[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.icons.length;

    // Random position in top-left quadrant
    const rect = this.container.getBoundingClientRect();
    el.style.top = (Math.random() * rect.height * 0.3 + 30) + 'px';
    el.style.right = (Math.random() * rect.width * 0.3 + 30) + 'px';

    this.container.appendChild(el);
    this.activeGlyph = el;

    // Trigger animation on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add('active');
      });
    });
  }

  destroy() {
    if (this.interval) clearInterval(this.interval);
    if (this.activeGlyph) this.activeGlyph.remove();
  }
}

// Initialize when Brief Wizard section is available
function initFloatingGlyphs() {
  setTimeout(() => {
    const briefSection = document.querySelector('#brief .noise');
    if (briefSection) {
      briefSection.id = 'brief-container';
      new FloatingGlyphsCSS('brief-container');
    }
  }, 500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFloatingGlyphs);
} else {
  initFloatingGlyphs();
}
