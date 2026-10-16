/**
 * RTL.JS — Direction Switcher (LTR / RTL) with LocalStorage Persistence
 * Dumpling & Bao Kitchen
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'dbk_direction_preference_v2';
  const LEGACY_STORAGE_KEY = 'dbk_direction_preference';

  /**
   * Determine preferred initial direction
   * Defaults to 'ltr' mode on start so pages always open in standard LTR mode
   */
  function getPreferredDirection() {
    try {
      if (localStorage.getItem(LEGACY_STORAGE_KEY)) {
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    } catch (e) {}

    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'rtl' ? 'rtl' : 'ltr';
  }

  /**
   * Apply direction to root document and update UI toggle controls
   */
  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');

    // Update all RTL toggle buttons across the page
    const toggleBtns = document.querySelectorAll('.rtl-toggle-btn');
    toggleBtns.forEach((btn) => {
      const textSpan = btn.querySelector('.direction-label');
      if (dir === 'rtl') {
        if (textSpan) textSpan.textContent = 'LTR';
        btn.setAttribute('aria-label', 'Switch to left-to-right direction');
        btn.setAttribute('title', 'Switch to left-to-right direction');
        btn.classList.add('is-rtl');
      } else {
        if (textSpan) textSpan.textContent = 'RTL';
        btn.setAttribute('aria-label', 'Switch to right-to-left direction');
        btn.setAttribute('title', 'Switch to right-to-left direction');
        btn.classList.remove('is-rtl');
      }
    });
  }

  /**
   * Toggle between LTR and RTL
   */
  function toggleDirection() {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    localStorage.setItem(STORAGE_KEY, nextDir);
    applyDirection(nextDir);
  }

  // Apply immediately before DOM fully renders to prevent layout shift
  const initialDir = getPreferredDirection();
  document.documentElement.setAttribute('dir', initialDir);
  document.documentElement.setAttribute('lang', initialDir === 'rtl' ? 'ar' : 'en');

  // Initialize event listeners when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    applyDirection(getPreferredDirection());

    const toggleBtns = document.querySelectorAll('.rtl-toggle-btn');
    toggleBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleDirection();
      });
    });
  });

  // Expose to window
  window.DBKDirection = {
    toggle: toggleDirection,
    apply: applyDirection,
    get: () => document.documentElement.getAttribute('dir') || 'ltr'
  };
})();
