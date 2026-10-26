/**
 * ANIMATIONS.JS — Comprehensive Animation & Micro-Interactions Suite
 * Dumpling & Bao Kitchen
 * 
 * Features:
 * - Sticky navbar state transition & shadow elevation on scroll
 * - IntersectionObserver staggered scroll reveal for all cards, sections, and grids
 * - Floating Back to Top action button with smooth scroll
 * - Cart button bump & pulse on cart add/update
 * - Hero element smooth entrance sequencing
 * - Mobile touch-optimized & prefers-reduced-motion fully respected
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Sticky Navbar State & Back to Top
    const header = document.querySelector('.site-header') || document.querySelector('header');
    const navbar = document.querySelector('.navbar-custom');
    
    // Dynamic Header Height Synchronizer for Stacking Sticky Elements
    const updateHeaderHeight = () => {
      if (header) {
        const height = header.getBoundingClientRect().height || header.offsetHeight || 64;
        const finalHeight = Math.round(Math.min(Math.max(height, 50), 90));
        document.documentElement.style.setProperty('--header-height', finalHeight + 'px');
      }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight, { passive: true });

    const mobileCollapse = document.getElementById('mainNavbarContent');
    if (mobileCollapse) {
      mobileCollapse.addEventListener('hidden.bs.collapse', updateHeaderHeight);
      mobileCollapse.addEventListener('shown.bs.collapse', updateHeaderHeight);
    }

    // Remove any legacy scroll progress indicator if present
    const existingProgressBar = document.querySelector('.scroll-progress-bar');
    if (existingProgressBar) {
      existingProgressBar.remove();
    }

    // Inject Floating Back-to-Top Button if not present
    let backToTopBtn = document.getElementById('backToTopBtn');
    if (!backToTopBtn) {
      backToTopBtn = document.createElement('button');
      backToTopBtn.id = 'backToTopBtn';
      backToTopBtn.className = 'back-to-top-btn';
      backToTopBtn.type = 'button';
      backToTopBtn.setAttribute('aria-label', 'Scroll back to top');
      backToTopBtn.title = 'Back to top';
      backToTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      document.body.appendChild(backToTopBtn);
    }

    // Scroll Handler (Throttled with requestAnimationFrame)
    let ticking = false;
    const onScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;

      // Navbar scrolled state
      if (navbar) {
        if (scrollY > 30) {
          navbar.classList.add('navbar-scrolled');
        } else {
          navbar.classList.remove('navbar-scrolled');
        }
        updateHeaderHeight();
      }


      // Back to top button visibility
      if (backToTopBtn) {
        if (scrollY > 350) {
          backToTopBtn.classList.add('is-shown');
        } else {
          backToTopBtn.classList.remove('is-shown');
        }
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    onScroll(); // Initial check on load

    // 2. Cart Bump Animation
    const triggerCartBump = () => {
      const cartPill = document.querySelector('.btn-nav-cart');
      if (cartPill && !prefersReducedMotion) {
        cartPill.classList.remove('cart-bump');
        void cartPill.offsetWidth; // Force reflow to retrigger animation
        cartPill.classList.add('cart-bump');
      }
    };

    window.addEventListener('dbk:cart-updated', triggerCartBump);
    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn-add-to-cart')) {
        triggerCartBump();
      }
    });

    // 3. Staggered Scroll Reveal Animations
    // Auto-discover cards and sections that should animate smoothly
    const animCandidates = document.querySelectorAll(
      '.animate-on-scroll, .animate-fade-up, .animate-fade-left, .animate-fade-right, .animate-scale-in, .food-card, .craft-step-card, .feature-card, .menu-item-card'
    );

    // Apply auto-staggering to siblings in grid rows
    const parentGroups = new Set();
    animCandidates.forEach((el) => {
      el.classList.add('animate-on-scroll');
      if (el.parentElement) parentGroups.add(el.parentElement);
    });

    parentGroups.forEach((parent) => {
      const children = parent.querySelectorAll(':scope > .animate-on-scroll, :scope > [class*="col"] > .food-card, :scope > [class*="col"] > .animate-on-scroll');
      children.forEach((child, index) => {
        if (!child.style.transitionDelay && !child.className.includes('delay-')) {
          const delay = Math.min((index % 4) * 90, 360);
          child.style.transitionDelay = delay + 'ms';
        }
      });
    });

    const animElements = document.querySelectorAll('.animate-on-scroll, .animate-fade-up, .animate-fade-left, .animate-fade-right, .animate-scale-in');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      animElements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animElements.forEach((el) => {
      revealObserver.observe(el);
    });

    // 4. Footer Column Staggered Scroll Reveal
    const footerCols = document.querySelectorAll('.footer-col');
    if (footerCols.length > 0) {
      const footerCustom = document.querySelector('.footer-custom');
      if (footerCustom && !prefersReducedMotion && 'IntersectionObserver' in window) {
        footerCustom.classList.add('has-observer');
        const footerObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        }, { root: null, rootMargin: '60px 0px 0px 0px', threshold: 0.01 });

        footerCols.forEach((col) => footerObserver.observe(col));
      } else {
        footerCols.forEach((col) => col.classList.add('is-visible'));
      }

      // Safety timeout: ensure footer columns are always visible on mobile/theme switches
      setTimeout(() => {
        footerCols.forEach((col) => col.classList.add('is-visible'));
      }, 700);
    }

    // 5. Professional 3D Card Tilt Interactions (Mouse / Fine Pointer Only)
    const canHoverFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (canHoverFine && !prefersReducedMotion) {
      // Exclude food-card to eliminate vertical jumping/jittering when hovering or selecting
      const tiltCards = document.querySelectorAll(
        '.craft-step-card, .value-card, .cooking-card, .team-card, .testimonial-card'
      );

      tiltCards.forEach((card) => {
        let cardRect = null;
        let isHovered = false;

        const onMouseEnter = () => {
          isHovered = true;
          cardRect = card.getBoundingClientRect();
          card.style.transition = 'transform 0.15s ease-out, box-shadow 0.25s ease-out';
          card.style.transformStyle = 'preserve-3d';
        };

        const onMouseMove = (e) => {
          if (!isHovered) return;
          if (e.target.closest('.btn, a, button, input')) return;
          if (window.getSelection && window.getSelection().toString().length > 0) return;
          if (!cardRect) cardRect = card.getBoundingClientRect();

          const x = e.clientX - cardRect.left;
          const y = e.clientY - cardRect.top;
          const centerX = cardRect.width / 2;
          const centerY = cardRect.height / 2;

          // Subtle restrained tilt (-4.5deg to +4.5deg) with lift
          const rotateX = ((centerY - y) / centerY) * 4.5;
          const rotateY = ((x - centerX) / centerX) * 4.5;

          card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
        };

        const onMouseLeave = () => {
          isHovered = false;
          cardRect = null;
          card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';
          card.style.transform = '';
        };

        card.addEventListener('mouseenter', onMouseEnter);
        card.addEventListener('mousemove', onMouseMove);
        card.addEventListener('mouseleave', onMouseLeave);
      });

      // 3D Micro-tilt on social media pill buttons
      const socialPillBtns = document.querySelectorAll('.social-pill-btn');
      socialPillBtns.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          const tiltX = -(y / (rect.height / 2)) * 12;
          const tiltY = (x / (rect.width / 2)) * 12;
          btn.style.transform = `perspective(400px) rotateX(${tiltX.toFixed(1)}deg) rotateY(${tiltY.toFixed(1)}deg) translateY(-4px) scale(1.08) translateZ(8px)`;
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.transform = '';
        });
      });
    }

    // 6. Hero Visual Sequence Entrance
    const heroVisual = document.querySelector('.hero-image-wrapper');
    if (heroVisual) {
      setTimeout(() => {
        heroVisual.classList.add('is-visible');
      }, 100);
    }
  });
})();
