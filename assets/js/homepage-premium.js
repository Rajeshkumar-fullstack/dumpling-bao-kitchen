/**
 * HOMEPAGE-PREMIUM.JS — Ultra-Smooth Scrolling, 3D Hero Physics, & Micro-Interactions
 * Dumpling & Bao Kitchen
 * 
 * Features:
 * - Buttery Lenis Smooth Scroll Engine with Anchor Interception
 * - Kinetic Split-Line Hero Entrance Sequencing
 * - 3D Interactive Card Perspective & Cursor Tracking
 * - Magnetic Buttons with Ripple Feedback
 * - Card Glare Lighting System
 * - Ambient Desktop Cursor Glow with Damped Lerp
 * - Prefers-Reduced-Motion Fallback & Mobile Touch Optimization
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // =========================================================================
    // 1. BUTTERY LENIS SMOOTH SCROLL ENGINE
    // =========================================================================
    let lenis = null;

    if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
      try {
        lenis = new Lenis({
          lerp: 0.088,
          wheelMultiplier: 1.0,
          touchMultiplier: 1.5,
          smoothWheel: true,
          smoothTouch: false, // Maintain native mobile touch inertia for 60fps performance
        });

        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Expose to window for coordination
        window.DBKLenis = lenis;

        // Smooth in-page anchor navigation (e.g. #our-craft)
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
          anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#' || href === '#!') return;
            const targetEl = document.querySelector(href);
            if (targetEl) {
              e.preventDefault();
              lenis.scrollTo(targetEl, {
                offset: -85,
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              });
            }
          });
        });
        // Pause Lenis when Bootstrap modals or offcanvas drawers open to permit internal scrolling
        document.addEventListener('show.bs.modal', () => { if (lenis) lenis.stop(); });
        document.addEventListener('hidden.bs.modal', () => { if (lenis) lenis.start(); });
        document.addEventListener('show.bs.offcanvas', () => { if (lenis) lenis.stop(); });
        document.addEventListener('hidden.bs.offcanvas', () => { if (lenis) lenis.start(); });
      } catch (err) {
        console.warn('Lenis smooth scroll initialization skipped:', err);
      }
    }

    // =========================================================================
    // 2. KINETIC HERO TYPOGRAPHY & LOAD TRIGGER
    // =========================================================================
    const heroSections = document.querySelectorAll('.hero-home, .hero-section');
    heroSections.forEach((heroSection) => {
      // Small tick to ensure browser has painted initial frames
      requestAnimationFrame(() => {
        setTimeout(() => {
          heroSection.classList.add('hero-loaded');
        }, 80);
      });
    });

    // =========================================================================
    // 3. 3D HERO INTERACTIVE CARD PERSPECTIVE TILT
    // =========================================================================
    const heroVisual3Ds = document.querySelectorAll('.hero-visual-3d, #heroVisual3D');
    heroVisual3Ds.forEach((heroVisual3D) => {
      const heroVisualInner = heroVisual3D.querySelector('.hero-visual-inner') || heroVisual3D.querySelector('.hero-image-wrapper') || heroVisual3D;

      if (heroVisualInner && !prefersReducedMotion && window.innerWidth >= 992) {
        let isHovered = false;
        let targetRotX = 0;
        let targetRotY = 0;
        let currentRotX = 0;
        let currentRotY = 0;
        let animFrameId = null;

        const updateTilt = () => {
          currentRotX += (targetRotX - currentRotX) * 0.14;
          currentRotY += (targetRotY - currentRotY) * 0.14;

          heroVisualInner.style.transform = `rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;

          if (isHovered || Math.abs(targetRotX - currentRotX) > 0.05 || Math.abs(targetRotY - currentRotY) > 0.05) {
            animFrameId = requestAnimationFrame(updateTilt);
          } else {
            heroVisualInner.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            animFrameId = null;
          }
        };

        heroVisual3D.addEventListener('mouseenter', () => {
          isHovered = true;
          if (!animFrameId) animFrameId = requestAnimationFrame(updateTilt);
        });

        heroVisual3D.addEventListener('mousemove', (e) => {
          const rect = heroVisual3D.getBoundingClientRect();
          const normX = (e.clientX - rect.left) / rect.width;
          const normY = (e.clientY - rect.top) / rect.height;

          targetRotY = (normX - 0.5) * 14;  // -7deg to +7deg
          targetRotX = (normY - 0.5) * -14; // -7deg to +7deg
        });

        heroVisual3D.addEventListener('mouseleave', () => {
          isHovered = false;
          targetRotX = 0;
          targetRotY = 0;
        });
      }
    });

    // =========================================================================
    // 4. MAGNETIC BUTTONS (Award-Winning Creative Agency Effect)
    // =========================================================================
    if (!prefersReducedMotion && window.innerWidth >= 992) {
      const magneticButtons = document.querySelectorAll('.hero-section .btn-magnetic');

      magneticButtons.forEach((btn) => {
        btn.classList.add('btn-magnetic', 'btn-shimmer');

        let bHovered = false;
        let transX = 0;
        let transY = 0;
        let curX = 0;
        let curY = 0;
        let bFrame = null;

        const updateMagnetic = () => {
          curX += (transX - curX) * 0.22;
          curY += (transY - curY) * 0.22;

          btn.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0)`;

          if (bHovered || Math.abs(transX - curX) > 0.05 || Math.abs(transY - curY) > 0.05) {
            bFrame = requestAnimationFrame(updateMagnetic);
          } else {
            btn.style.transform = 'translate3d(0, 0, 0)';
            bFrame = null;
          }
        };

        btn.addEventListener('mouseenter', () => {
          bHovered = true;
          if (!bFrame) bFrame = requestAnimationFrame(updateMagnetic);
        });

        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const offsetX = e.clientX - rect.left - rect.width / 2;
          const offsetY = e.clientY - rect.top - rect.height / 2;

          transX = offsetX * 0.28;
          transY = offsetY * 0.28;
        });

        btn.addEventListener('mouseleave', () => {
          bHovered = false;
          transX = 0;
          transY = 0;
        });
      });
    }

    // =========================================================================
    // 5. CARD GLARE LIGHTING EFFECT
    // =========================================================================
    if (!prefersReducedMotion && window.innerWidth >= 992) {
      const cards = document.querySelectorAll(
        '.food-card, .craft-step-card, .cooking-card, .value-card, .team-card, .testimonial-card, .timeline-content-card, .menu-item-card'
      );
      cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        });
      });
    }

    // =========================================================================
    // 6. RIPPLE CLICK VISUAL FEEDBACK
    // =========================================================================
    document.addEventListener('click', (e) => {
      const targetBtn = e.target.closest('.btn-chili, .btn-outline-chili, .btn-magnetic');
      if (!targetBtn) return;

      const rect = targetBtn.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('btn-ripple-wave');

      const existingRipple = targetBtn.querySelector('.btn-ripple-wave');
      if (existingRipple) existingRipple.remove();

      targetBtn.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });

    // =========================================================================
    // 7. AMBIENT CURSOR GLOW (DESKTOP)
    // =========================================================================
    if (!prefersReducedMotion && window.innerWidth >= 1024) {
      let glowEl = document.querySelector('.ambient-cursor-glow');
      if (!glowEl) {
        glowEl = document.createElement('div');
        glowEl.className = 'ambient-cursor-glow';
        glowEl.setAttribute('aria-hidden', 'true');
        document.body.appendChild(glowEl);
      }

      let mouseX = -500;
      let mouseY = -500;
      let curGlowX = -500;
      let curGlowY = -500;
      let glowFrame = null;

      const moveGlow = () => {
        curGlowX += (mouseX - curGlowX) * 0.12;
        curGlowY += (mouseY - curGlowY) * 0.12;

        glowEl.style.transform = `translate3d(${curGlowX.toFixed(1)}px, ${curGlowY.toFixed(1)}px, 0) translate(-50%, -50%)`;

        if (Math.abs(mouseX - curGlowX) > 0.5 || Math.abs(mouseY - curGlowY) > 0.5) {
          glowFrame = requestAnimationFrame(moveGlow);
        } else {
          glowFrame = null;
        }
      };

      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!glowFrame) {
          glowFrame = requestAnimationFrame(moveGlow);
        }
      }, { passive: true });
    }
  });
})();
