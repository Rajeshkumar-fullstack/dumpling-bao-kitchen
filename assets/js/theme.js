/**
 * THEME.JS — Theme Switching (Dark & Light Mode) with LocalStorage Persistence
 * Dumpling & Bao Kitchen
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'dbk_theme_preference';

  /**
   * Determine preferred initial theme
   */
  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * Apply theme to root document and update UI toggle controls
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);

    // Update all theme toggle buttons across the page
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach((btn) => {
      const icon = btn.querySelector('i');
      if (theme === 'dark') {
        if (icon) {
          icon.className = 'bi bi-sun-fill text-warning';
        }
        btn.setAttribute('aria-label', 'Switch to light mode');
        btn.setAttribute('title', 'Switch to light mode');
      } else {
        if (icon) {
          icon.className = 'bi bi-moon-stars-fill';
        }
        btn.setAttribute('aria-label', 'Switch to dark mode');
        btn.setAttribute('title', 'Switch to dark mode');
      }
    });
  }

  /**
   * Toggle between light and dark
   */
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  }

  // Apply immediately before DOM fully renders to prevent flash
  const initialTheme = getPreferredTheme();
  document.documentElement.setAttribute('data-bs-theme', initialTheme);

  // Initialize event listeners when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getPreferredTheme());

    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    });

    // Listen for OS theme preference changes if user hasn't explicitly set one
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  });

  // Expose to window
  window.DBKTheme = {
    toggle: toggleTheme,
    apply: applyTheme,
    get: () => document.documentElement.getAttribute('data-bs-theme') || 'light'
  };
})();
