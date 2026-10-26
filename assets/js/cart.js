/**
 * CART.JS — Centralized Shopping Cart Management & UI Coordination
 * Dumpling & Bao Kitchen
 * 
 * Features:
 * - Persistent cart storage via localStorage
 * - Centralized product catalog & resilient DOM-fallback lookup
 * - Real-time synchronized navbar cart count (Cart 🛒 (X)) across all pages
 * - Smooth Toast notifications on Add to Cart
 * - Offcanvas Cart Drawer with live item adjustments (+, -, remove, clear)
 * - Dedicated Shopping Cart Page (cart.html) rendering & calculation
 * - Frontend-only Demo Checkout workflow with order summary & clear disclaimer
 * - Prevention of duplicate listeners via unified event delegation
 * - Full Dark Mode & RTL / LTR compatibility
 */

(function () {
  'use strict';

  // 1. Centralized Product Catalog (Menu & Frozen Packs)
  const DBK_CATALOG = [
    // --- VEGETABLE DUMPLINGS ---
    {
      id: 'menu-garden-chive-tofu',
      name: 'Garden Chive & Tofu Dumplings',
      price: 12.50,
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80',
      category: 'vegetable',
      unit: 'Plate (6 pcs)',
      badge: 'Vegetarian'
    },
    {
      id: 'menu-shiitake-bok-choy',
      name: 'Shiitake & Baby Bok Choy Dumplings',
      price: 13.00,
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
      category: 'vegetable',
      unit: 'Plate (6 pcs)',
      badge: 'Vegetarian'
    },
    {
      id: 'menu-sweet-corn-chestnut',
      name: 'Sweet Corn & Water Chestnut',
      price: 12.00,
      image: 'assets/images/dumplings/sweet-corn-chestnut.jpg',
      category: 'vegetable',
      unit: 'Plate (6 pcs)',
      badge: 'Vegetarian'
    },
    {
      id: 'menu-truffle-wild-mushroom',
      name: 'Truffle Wild Forest Mushroom',
      price: 15.00,
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
      category: 'vegetable',
      unit: 'Plate (6 pcs)',
      badge: 'Chef Choice'
    },

    // --- CHICKEN DUMPLINGS ---
    {
      id: 'menu-ginger-scallion-chicken',
      name: 'Ginger Scallion Chicken Dumplings',
      price: 13.50,
      image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
      category: 'chicken',
      unit: 'Plate (6 pcs)',
      badge: 'Best Seller'
    },
    {
      id: 'menu-lemongrass-cilantro-chicken',
      name: 'Lemongrass & Cilantro Chicken',
      price: 14.00,
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
      category: 'chicken',
      unit: 'Plate (6 pcs)',
      badge: 'Aromatic'
    },
    {
      id: 'menu-spicy-mala-chicken',
      name: 'Spicy Mala Chicken Dumplings',
      price: 14.50,
      image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
      category: 'chicken',
      unit: 'Plate (6 pcs)',
      badge: 'Mild Spice'
    },
    {
      id: 'menu-golden-chicken-gyoza',
      name: 'Golden Pan-Fried Chicken Gyoza',
      price: 13.50,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
      category: 'chicken',
      unit: 'Plate (6 pcs)',
      badge: 'Pan-Fried'
    },

    // --- PORK DUMPLINGS ---
    {
      id: 'menu-shanghai-soup-dumplings',
      name: 'Shanghai Soup Dumplings (Xiao Long Bao)',
      price: 14.50,
      image: 'assets/images/dumplings/shanghai-soup-dumplings.jpg',
      category: 'pork',
      unit: 'Steamer (6 pcs)',
      badge: 'House Signature'
    },
    {
      id: 'menu-crispy-lace-pork-potstickers',
      name: 'Crispy Lace Pork Potstickers',
      price: 14.00,
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80',
      category: 'pork',
      unit: 'Plate (6 pcs)',
      badge: 'Crispy Crust'
    },
    {
      id: 'menu-szechuan-red-oil-wontons',
      name: 'Szechuan Red Oil Pork Wontons',
      price: 14.50,
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
      category: 'pork',
      unit: 'Bowl (8 pcs)',
      badge: 'Signature Spice'
    },
    {
      id: 'menu-traditional-pork-cabbage',
      name: 'Traditional Pork & Napa Cabbage',
      price: 13.00,
      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
      category: 'pork',
      unit: 'Plate (6 pcs)',
      badge: 'Classic'
    },

    // --- SEAFOOD DUMPLINGS ---
    {
      id: 'menu-crystal-har-gow',
      name: 'Crystal Har Gow (Shrimp)',
      price: 16.50,
      image: 'https://images.unsplash.com/photo-1576577445504-6af96477db52?auto=format&fit=crop&w=800&q=80',
      category: 'seafood',
      unit: 'Steamer (4 pcs)',
      badge: 'Dim Sum Icon'
    },
    {
      id: 'menu-scallop-garlic-chive',
      name: 'Scallop & Garlic Chive Dumplings',
      price: 17.50,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      category: 'seafood',
      unit: 'Steamer (4 pcs)',
      badge: 'Chef Special'
    },
    {
      id: 'menu-crab-prawn-shumai',
      name: 'Crab & Prawn Shumai',
      price: 16.00,
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80',
      category: 'seafood',
      unit: 'Steamer (4 pcs)',
      badge: 'House Classic'
    },
    {
      id: 'menu-golden-prawn-broth',
      name: 'Golden Prawn Dumpling in Broth',
      price: 15.50,
      image: 'assets/images/dumplings/prawn-golden-broth.jpg',
      category: 'seafood',
      unit: 'Bowl (4 pcs)',
      badge: 'Warm Broth'
    },

    // --- BAO BUNS ---
    {
      id: 'menu-pork-belly-gua-bao',
      name: 'Slow-Cooked Pork Belly Gua Bao',
      price: 12.50,
      image: 'assets/images/bao-buns/slow-cooked-pork-bao.jpg',
      category: 'bao',
      unit: 'Set of 2 Bao',
      badge: 'Signature'
    },
    {
      id: 'menu-korean-crispy-chicken-bao',
      name: 'Korean Crispy Fried Chicken Bao',
      price: 14.00,
      image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
      category: 'bao',
      unit: 'Set of 2 Bao',
      badge: 'Spicy Glaze'
    },
    {
      id: 'menu-braised-soy-mushroom-bao',
      name: 'Braised Soy Mushroom Bao',
      price: 10.50,
      image: 'assets/images/bao-buns/braised-mushroom-bao.jpg',
      category: 'bao',
      unit: 'Set of 2 Bao',
      badge: 'Vegetarian'
    },
    {
      id: 'menu-custard-lava-bao',
      name: 'Sweet Golden Custard Lava Bao',
      price: 12.00,
      image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
      category: 'bao',
      unit: 'Steamer (3 pcs)',
      badge: 'Sweet Dessert'
    },

    // --- SIDES & SAUCES ---
    {
      id: 'menu-szechuan-chili-crisp-jar',
      name: 'House Szechuan Chili Crisp Jar',
      price: 9.50,
      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
      category: 'sides',
      unit: 'Glass Jar (200g)',
      badge: 'Handcrafted'
    },
    {
      id: 'menu-smashed-cucumber-salad',
      name: 'Garlic Smashed Cucumber Salad',
      price: 7.50,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      category: 'sides',
      unit: 'Share Bowl',
      badge: 'Vegetarian'
    },
    {
      id: 'menu-scallion-pancake',
      name: 'Crispy Sesame Scallion Pancake',
      price: 8.00,
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80',
      category: 'sides',
      unit: '8 Triangles',
      badge: 'Vegetarian'
    },
    {
      id: 'menu-daikon-carrot-slaw',
      name: 'Pickled Daikon & Carrot Slaw',
      price: 6.50,
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
      category: 'sides',
      unit: 'Side Bowl',
      badge: 'Plant-Based'
    },

    // --- FROZEN PACKS ---
    {
      id: 'frozen-classic-veg-12',
      name: 'Classic Vegetable Dumplings (12 Pack)',
      price: 14.50,
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80',
      category: 'frozen',
      unit: 'Retail Pack (12 pcs)',
      badge: 'Frozen Pack'
    },
    {
      id: 'frozen-juicy-chicken-12',
      name: 'Juicy Chicken Dumplings (12 Pack)',
      price: 15.50,
      image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
      category: 'frozen',
      unit: 'Retail Pack (12 pcs)',
      badge: 'Frozen Pack'
    },
    {
      id: 'frozen-spiced-pork-12',
      name: 'Spiced Pork Dumplings (12 Pack)',
      price: 16.00,
      image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
      category: 'frozen',
      unit: 'Retail Pack (12 pcs)',
      badge: 'Frozen Pack'
    },
    {
      id: 'frozen-shrimp-garlic-12',
      name: 'Shrimp & Garlic Dumplings (12 Pack)',
      price: 18.50,
      image: 'https://images.unsplash.com/photo-1576577445504-6af96477db52?auto=format&fit=crop&w=800&q=80',
      category: 'frozen',
      unit: 'Retail Pack (12 pcs)',
      badge: 'Frozen Pack'
    },
    {
      id: 'frozen-mixed-selection-24',
      name: 'Mixed Dumpling Selection (24 Pack Party Pack)',
      price: 29.00,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      category: 'frozen',
      unit: 'Party Pack (24 pcs)',
      badge: 'Party Pack'
    },
    {
      id: 'frozen-mini-bao-8',
      name: 'Mini Bao Buns Collection (8 Pack)',
      price: 16.50,
      image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
      category: 'frozen',
      unit: 'Retail Pack (8 pcs)',
      badge: 'Frozen Pack'
    }
  ];

  // 2. Central Cart State Management
  const DBKCart = {
    STORAGE_KEY: 'dbk_kitchen_cart_v1',

    // Read and safely validate stored cart
    getItems: function () {
      try {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        // Validate items
        return parsed.filter(item => {
          return item &&
            typeof item.id === 'string' &&
            typeof item.name === 'string' &&
            typeof item.price === 'number' &&
            !isNaN(item.price) &&
            item.price > 0 &&
            typeof item.quantity === 'number' &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0;
        });
      } catch (e) {
        console.warn('[DBK Cart] Failed to parse cart from localStorage, initializing fresh cart:', e);
        return [];
      }
    },

    // Save items to localStorage and notify UI
    saveItems: function (items) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error('[DBK Cart] LocalStorage write failed:', e);
      }
      this.syncUI();
      // Dispatch custom event for cross-component sync
      window.dispatchEvent(new CustomEvent('dbk:cart-updated', { detail: { items } }));
    },

    // Add item (or increment quantity if already present)
    addItem: function (productData, quantityToAdd = 1) {
      const qty = parseInt(quantityToAdd, 10);
      if (isNaN(qty) || qty <= 0) return false;

      const items = this.getItems();
      const existingIndex = items.findIndex(item => item.id === productData.id);

      let finalName = productData.name;
      let finalImg = productData.image;

      if (existingIndex > -1) {
        items[existingIndex].quantity += qty;
        finalName = items[existingIndex].name;
        finalImg = items[existingIndex].image;
      } else {
        // Find in catalog or fallback to supplied data
        const catalogEntry = DBK_CATALOG.find(p => p.id === productData.id) || {};
        const newItem = {
          id: productData.id,
          name: productData.name || catalogEntry.name || 'Dumpling Special',
          price: parseFloat(productData.price) || catalogEntry.price || 12.00,
          image: productData.image || catalogEntry.image || 'assets/icons/dumpling.svg',
          category: productData.category || catalogEntry.category || 'menu',
          unit: productData.unit || catalogEntry.unit || 'Portion',
          quantity: qty
        };
        items.push(newItem);
        finalName = newItem.name;
        finalImg = newItem.image;
      }

      this.saveItems(items);
      this.showToast(finalName, finalImg, qty);
      return true;
    },

    // Update quantity of an item
    updateQuantity: function (productId, newQuantity) {
      let items = this.getItems();
      const itemIndex = items.findIndex(item => item.id === productId);
      if (itemIndex === -1) return;

      const qty = parseInt(newQuantity, 10);
      if (qty <= 0) {
        // Remove item if quantity falls to 0 or below
        items.splice(itemIndex, 1);
      } else {
        items[itemIndex].quantity = Math.min(qty, 99); // Max cap 99
      }

      this.saveItems(items);
    },

    // Remove single item
    removeItem: function (productId) {
      let items = this.getItems();
      items = items.filter(item => item.id !== productId);
      this.saveItems(items);
    },

    // Clear whole cart
    clearCart: function () {
      this.saveItems([]);
    },

    // Total quantity of items in cart
    getTotalQuantity: function () {
      const items = this.getItems();
      return items.reduce((sum, item) => sum + item.quantity, 0);
    },

    // Grand total calculation
    getGrandTotal: function () {
      const items = this.getItems();
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return Math.round(total * 100) / 100;
    },

    // Format currency string
    formatPrice: function (amount) {
      return '$' + (Number(amount) || 0).toFixed(2);
    },

    // Find product in catalog by ID
    findInCatalog: function (id) {
      return DBK_CATALOG.find(p => p.id === id);
    },

    // 3. UI Synchronization
    syncUI: function () {
      this.updateNavbarBadges();
      this.renderDrawer();
      if (window.location.pathname.endsWith('cart.html') || window.location.href.includes('cart.html')) {
        this.renderCartPage();
      }
    },

    // Navbar cart count badges
    updateNavbarBadges: function () {
      const count = this.getTotalQuantity();
      const countEls = document.querySelectorAll('.cart-count, #navCartCount');
      countEls.forEach(el => {
        el.textContent = count;
        // Pulse badge on change
        el.classList.remove('badge-bump');
        void el.offsetWidth; // Trigger reflow
        el.classList.add('badge-bump');
      });

      // Update ARIA labels
      const cartBtns = document.querySelectorAll('.btn-nav-cart, #navbarCartBtn');
      cartBtns.forEach(btn => {
        btn.setAttribute('aria-label', `Shopping Cart, ${count} item${count === 1 ? '' : 's'}`);
      });
    },

    // Toast notification
    showToast: function (title, imageSrc, qtyAdded) {
      let container = document.getElementById('dbkToastContainer');
      if (!container) {
        container = document.createElement('div');
        container.id = 'dbkToastContainer';
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '1090';
        document.body.appendChild(container);
      }

      const toastId = 'toast-' + Date.now();
      const toastHtml = `
        <div id="${toastId}" class="toast dbk-cart-toast show align-items-center shadow-lg border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="4000">
          <div class="d-flex p-3 align-items-center">
            <div class="toast-thumb me-3 flex-shrink-0">
              <img src="${imageSrc || 'assets/icons/dumpling.svg'}" alt="${title}" class="rounded-3" style="width: 48px; height: 48px; object-fit: cover;">
            </div>
            <div class="toast-body p-0 flex-grow-1">
              <div class="d-flex align-items-center gap-1.5 mb-1 text-chili fw-bold small text-uppercase">
                <i class="bi bi-check-circle-fill"></i> Added to Cart
              </div>
              <div class="fw-semibold text-primary-custom text-sm lh-sm mb-1">${qtyAdded > 1 ? qtyAdded + '× ' : ''}${title}</div>
              <div class="small text-muted-custom">Cart Total: <strong class="text-chili">${this.formatPrice(this.getGrandTotal())}</strong> (${this.getTotalQuantity()} items)</div>
            </div>
            <button type="button" class="btn-close ms-2 me-1" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-footer px-3 pb-3 pt-0 d-flex gap-2">
            <button type="button" class="btn dbk-toast-btn dbk-toast-btn-cart flex-fill" data-bs-toggle="offcanvas" data-bs-target="#cartOffcanvas" aria-label="View Shopping Cart">
              <i class="bi bi-bag text-chili"></i>
              <span>View Cart</span>
              <span class="dbk-toast-count">(${this.getTotalQuantity()})</span>
            </button>
            <a href="cart.html" class="btn dbk-toast-btn dbk-toast-btn-checkout flex-fill" aria-label="Proceed to Checkout">
              <span>Checkout</span>
              <i class="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>
      `;

      container.insertAdjacentHTML('beforeend', toastHtml);
      const toastEl = document.getElementById(toastId);

      // Auto remove after delay
      setTimeout(() => {
        if (toastEl && toastEl.parentNode) {
          toastEl.classList.remove('show');
          setTimeout(() => toastEl.remove(), 400);
        }
      }, 4500);

      // Handle close button
      if (toastEl) {
        const closeBtn = toastEl.querySelector('.btn-close');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            toastEl.classList.remove('show');
            setTimeout(() => toastEl.remove(), 250);
          });
        }
      }
    },

    // Ensure Offcanvas Drawer exists on the page
    ensureDrawerMarkup: function () {
      if (document.getElementById('cartOffcanvas')) return;

      const drawerHtml = `
        <!-- =======================================================================
             OFFCANVAS SHOPPING CART DRAWER
             ======================================================================= -->
        <div class="offcanvas offcanvas-end cart-offcanvas" tabindex="-1" id="cartOffcanvas" aria-labelledby="cartOffcanvasLabel" data-lenis-prevent="true">
          <div class="offcanvas-header border-bottom border-light-subtle">
            <div class="d-flex align-items-center gap-2">
              <span class="brand-icon-box" style="width: 32px; height: 32px; font-size: 0.95rem;">
                <i class="bi bi-bag-check-fill text-chili"></i>
              </span>
              <h2 class="offcanvas-title fs-5 fw-bold text-primary-custom mb-0" id="cartOffcanvasLabel">Your Cart</h2>
              <span class="badge rounded-pill bg-chili text-white ms-1 cart-count" id="drawerCartCount">0</span>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close cart drawer"></button>
          </div>

          <div class="offcanvas-body d-flex flex-column p-0" data-lenis-prevent="true">
            <!-- Scrollable Items List Container -->
            <div class="cart-drawer-items flex-grow-1 p-3 overflow-y-auto" id="drawerCartItems" data-lenis-prevent="true">
              <!-- Rendered dynamically -->
            </div>

            <!-- Drawer Footer Summary -->
            <div class="cart-drawer-footer border-top border-light-subtle p-3" id="drawerCartFooter">
              <!-- Rendered dynamically -->
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', drawerHtml);
    },

    // Programmatically close cart drawer & restore scrolling
    closeDrawer: function () {
      const drawerEl = document.getElementById('cartOffcanvas');
      if (!drawerEl) return;

      if (window.bootstrap && window.bootstrap.Offcanvas) {
        try {
          const bsOffcanvas = window.bootstrap.Offcanvas.getOrCreateInstance(drawerEl);
          if (bsOffcanvas) {
            bsOffcanvas.hide();
          }
        } catch (e) {
          console.warn('Bootstrap offcanvas.hide() error:', e);
        }
      }

      // Explicit cleanup to guarantee drawer closes and scroll unlock in all scenarios
      drawerEl.classList.remove('show', 'showing');
      drawerEl.setAttribute('aria-hidden', 'true');
      drawerEl.removeAttribute('aria-modal');
      drawerEl.removeAttribute('role');
      drawerEl.style.visibility = '';

      const backdrops = document.querySelectorAll('.offcanvas-backdrop');
      backdrops.forEach((b) => {
        b.classList.remove('show');
        b.remove();
      });

      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';

      if (window.DBKLenis && typeof window.DBKLenis.start === 'function') {
        window.DBKLenis.start();
      }
    },

    // Render Cart Drawer Content
    renderDrawer: function () {
      const drawerItemsContainer = document.getElementById('drawerCartItems');
      const drawerFooterContainer = document.getElementById('drawerCartFooter');
      if (!drawerItemsContainer || !drawerFooterContainer) return;

      const items = this.getItems();
      const totalQty = this.getTotalQuantity();
      const grandTotal = this.getGrandTotal();

      if (items.length === 0) {
        // Empty State
        drawerItemsContainer.innerHTML = `
          <div class="text-center py-5 px-3">
            <div class="empty-cart-illustration mb-3">
              <span class="empty-cart-icon-box">
                <i class="bi bi-basket3 text-chili" style="font-size: 3rem;"></i>
              </span>
            </div>
            <h3 class="fs-5 fw-bold text-primary-custom mb-2">Your cart is waiting for something delicious!</h3>
            <p class="small text-secondary-custom mb-4 leading-relaxed">
              Explore our handmade dumplings, steamed lotus bao buns, and flash-frozen retail packs.
            </p>
            <a href="menu.html" class="btn btn-chili btn-sm px-4 py-2">
              <i class="bi bi-book me-1"></i> Browse Kitchen Menu
            </a>
          </div>
        `;

        drawerFooterContainer.innerHTML = `
          <div class="d-flex justify-content-between align-items-center mb-2 text-muted-custom small">
            <span>Items (0)</span>
            <span>$0.00</span>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-3 fw-bold text-primary-custom">
            <span>Estimated Total</span>
            <span class="fs-5 text-chili">$0.00</span>
          </div>
          <a href="menu.html" class="btn btn-outline-chili w-100">
            Explore Dishes
          </a>
        `;
        return;
      }

      // Populate Items List
      let itemsHtml = '<ul class="list-unstyled mb-0 d-flex flex-column gap-3">';
      items.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        itemsHtml += `
          <li class="cart-drawer-item d-flex gap-3 p-2.5 rounded-3 align-items-center" data-product-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-drawer-item-img rounded-3 flex-shrink-0" loading="lazy">
            <div class="flex-grow-1 min-w-0">
              <div class="d-flex justify-content-between align-items-start gap-1">
                <h4 class="fs-6 fw-bold text-primary-custom text-truncate mb-0" title="${item.name}">${item.name}</h4>
                <button type="button" class="btn-drawer-remove text-muted-custom p-0 border-0 bg-transparent" data-remove-id="${item.id}" aria-label="Remove ${item.name} from cart" title="Remove item">
                  <i class="bi bi-trash3 fs-6"></i>
                </button>
              </div>
              <div class="small text-secondary-custom mb-2">${this.formatPrice(item.price)} each</div>
              
              <div class="d-flex justify-content-between align-items-center">
                <!-- Quantity Controls -->
                <div class="cart-qty-pill d-inline-flex align-items-center">
                  <button type="button" class="btn-qty-action btn-decrease" data-id="${item.id}" aria-label="Decrease quantity for ${item.name}">-</button>
                  <span class="qty-display fw-bold">${item.quantity}</span>
                  <button type="button" class="btn-qty-action btn-increase" data-id="${item.id}" aria-label="Increase quantity for ${item.name}">+</button>
                </div>
                <!-- Subtotal -->
                <span class="fw-bold text-chili small">${this.formatPrice(itemSubtotal)}</span>
              </div>
            </div>
          </li>
        `;
      });
      itemsHtml += '</ul>';
      drawerItemsContainer.innerHTML = itemsHtml;

      // Drawer Footer
      drawerFooterContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-1 text-secondary-custom small">
          <span>Total Items:</span>
          <span class="fw-bold text-primary-custom">${totalQty}</span>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="fw-bold text-primary-custom">Subtotal:</span>
          <span class="fs-5 fw-bold text-chili">${this.formatPrice(grandTotal)}</span>
        </div>
        <div class="d-grid gap-2">
          <a href="cart.html" class="btn btn-chili w-100 py-2 d-flex align-items-center justify-content-center gap-2">
            <span>View Cart &amp; Checkout</span>
            <i class="bi bi-arrow-right"></i>
          </a>
          <div class="d-flex justify-content-between align-items-center pt-1">
            <button type="button" class="btn btn-link btn-sm text-muted-custom p-0 text-decoration-none" id="drawerClearCartBtn">
              <i class="bi bi-trash"></i> Clear Cart
            </button>
            <span class="small text-muted-custom">Freshly prepared daily</span>
          </div>
        </div>
      `;
    },

    // Render Full Cart Page (cart.html)
    renderCartPage: function () {
      const cartTableBody = document.getElementById('cartTableBody');
      const emptyCartView = document.getElementById('emptyCartView');
      const activeCartView = document.getElementById('activeCartView');
      const cartSummaryItemsQty = document.getElementById('cartSummaryItemsQty');
      const cartSummarySubtotal = document.getElementById('cartSummarySubtotal');
      const cartSummaryGrandTotal = document.getElementById('cartSummaryGrandTotal');
      const cartPageItemCountBadge = document.getElementById('cartPageItemCountBadge');

      if (!activeCartView || !emptyCartView) return;

      const items = this.getItems();
      const totalQty = this.getTotalQuantity();
      const grandTotal = this.getGrandTotal();

      if (cartPageItemCountBadge) {
        cartPageItemCountBadge.textContent = `${totalQty} item${totalQty === 1 ? '' : 's'}`;
      }

      if (items.length === 0) {
        activeCartView.classList.add('d-none');
        emptyCartView.classList.remove('d-none');
        return;
      }

      // Show Active View
      emptyCartView.classList.add('d-none');
      activeCartView.classList.remove('d-none');

      // Populate Table Body / Mobile Cards
      if (cartTableBody) {
        let tableRowsHtml = '';
        items.forEach(item => {
          const itemSubtotal = item.price * item.quantity;
          tableRowsHtml += `
            <tr class="cart-item-row" data-product-id="${item.id}">
              <!-- Product Info -->
              <td class="py-3 ps-3 align-middle">
                <div class="d-flex align-items-center gap-3">
                  <img src="${item.image}" alt="${item.name}" class="rounded-3 flex-shrink-0 cart-table-img" style="width: 72px; height: 72px; object-fit: cover;">
                  <div>
                    <h3 class="fs-6 fw-bold text-primary-custom mb-1">${item.name}</h3>
                    <div class="d-flex flex-wrap align-items-center gap-2 small text-secondary-custom">
                      <span class="badge bg-secondary-subtle text-body border">${item.unit || item.category}</span>
                      <span>Unit Price: <strong>${this.formatPrice(item.price)}</strong></span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Unit Price (Desktop) -->
              <td class="py-3 align-middle text-center d-none d-md-table-cell">
                <span class="fw-semibold text-secondary-custom">${this.formatPrice(item.price)}</span>
              </td>

              <!-- Quantity Controls -->
              <td class="py-3 align-middle text-center">
                <div class="quantity-input-group d-inline-flex align-items-center">
                  <button type="button" class="btn-qty btn-qty-minus btn-page-qty-minus" data-id="${item.id}" aria-label="Decrease quantity for ${item.name}">-</button>
                  <input type="number" class="qty-field page-qty-input" data-id="${item.id}" value="${item.quantity}" min="1" max="99" aria-label="Quantity for ${item.name}">
                  <button type="button" class="btn-qty btn-qty-plus btn-page-qty-plus" data-id="${item.id}" aria-label="Increase quantity for ${item.name}">+</button>
                </div>
              </td>

              <!-- Subtotal -->
              <td class="py-3 align-middle text-end">
                <span class="fs-6 fw-bold text-chili">${this.formatPrice(itemSubtotal)}</span>
              </td>

              <!-- Remove Action -->
              <td class="py-3 pe-3 align-middle text-center">
                <button type="button" class="btn btn-outline-danger btn-sm rounded-circle btn-page-remove p-2" data-id="${item.id}" aria-label="Remove ${item.name} from cart" title="Remove item">
                  <i class="bi bi-trash3"></i>
                </button>
              </td>
            </tr>
          `;
        });
        cartTableBody.innerHTML = tableRowsHtml;
      }

      // Update Summary Values
      if (cartSummaryItemsQty) cartSummaryItemsQty.textContent = totalQty;
      if (cartSummarySubtotal) cartSummarySubtotal.textContent = this.formatPrice(grandTotal);
      if (cartSummaryGrandTotal) cartSummaryGrandTotal.textContent = this.formatPrice(grandTotal);
    },

    // 4. Modal Confirmation for Clear Cart
    confirmClearCart: function () {
      if (this.getItems().length === 0) return;
      const confirmed = window.confirm('Are you sure you want to clear all items from your cart?');
      if (confirmed) {
        this.clearCart();
        this.showToast('Cart Cleared', 'assets/icons/dumpling.svg', 0);
      }
    },

    // 5. Initialize & Event Delegation
    init: function () {
      this.ensureDrawerMarkup();
      this.syncUI();
      this.bindEvents();
    },

    bindEvents: function () {
      // Prevent double binding by attaching to document with guarded flag
      if (document.body.dataset.dbkCartBound === 'true') return;
      document.body.dataset.dbkCartBound = 'true';

      // Global click handler for cart actions
      document.addEventListener('click', (e) => {
        // 0. Cart Drawer Navigation Links (Explore Dishes, Browse Kitchen Menu, Checkout)
        const drawerNavLink = e.target.closest('#cartOffcanvas a[href]');
        if (drawerNavLink) {
          const href = drawerNavLink.getAttribute('href');
          if (href && href !== '#' && !href.startsWith('javascript:')) {
            this.closeDrawer();

            const currentPath = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
            const targetBase = href.split('#')[0].split('?')[0].toLowerCase();

            if (currentPath === targetBase) {
              // Already on the destination page: close drawer and smoothly scroll to content
              e.preventDefault();
              const targetHash = href.includes('#') ? href.split('#')[1] : null;
              const targetElement = targetHash 
                ? document.getElementById(targetHash) 
                : (document.getElementById('menuFilterBar') || document.getElementById('menuGridContainer') || document.getElementById('cartTableBody'));
              
              if (targetElement) {
                setTimeout(() => {
                  if (window.DBKLenis && typeof window.DBKLenis.scrollTo === 'function') {
                    window.DBKLenis.scrollTo(targetElement, { offset: -90 });
                  } else {
                    const y = targetElement.getBoundingClientRect().top + window.pageYOffset - 90;
                    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
                  }
                }, 100);
              }
            } else {
              // Different page: navigate directly to destination
              window.location.href = href;
            }
            return;
          }
        }

        // A. Add to Cart Button (Card or Modal)
        const addBtn = e.target.closest('.btn-add-to-cart');
        if (addBtn) {
          e.preventDefault();
          this.handleAddClick(addBtn);
          return;
        }

        // B. Card Quantity Minus Button
        const qtyMinusBtn = e.target.closest('.btn-qty-minus:not(.btn-page-qty-minus)');
        if (qtyMinusBtn) {
          e.preventDefault();
          const group = qtyMinusBtn.closest('.quantity-input-group');
          const input = group ? group.querySelector('.qty-field') : null;
          if (input) {
            let val = parseInt(input.value, 10) || 1;
            if (val > 1) {
              input.value = val - 1;
            }
          }
          return;
        }

        // C. Card Quantity Plus Button
        const qtyPlusBtn = e.target.closest('.btn-qty-plus:not(.btn-page-qty-plus)');
        if (qtyPlusBtn) {
          e.preventDefault();
          const group = qtyPlusBtn.closest('.quantity-input-group');
          const input = group ? group.querySelector('.qty-field') : null;
          if (input) {
            let val = parseInt(input.value, 10) || 1;
            if (val < 99) {
              input.value = val + 1;
            }
          }
          return;
        }

        // D. Drawer Quantity Decrease
        const drawerDecBtn = e.target.closest('.cart-offcanvas .btn-decrease');
        if (drawerDecBtn) {
          e.preventDefault();
          const id = drawerDecBtn.getAttribute('data-id');
          const item = this.getItems().find(i => i.id === id);
          if (item) {
            this.updateQuantity(id, item.quantity - 1);
          }
          return;
        }

        // E. Drawer Quantity Increase
        const drawerIncBtn = e.target.closest('.cart-offcanvas .btn-increase');
        if (drawerIncBtn) {
          e.preventDefault();
          const id = drawerIncBtn.getAttribute('data-id');
          const item = this.getItems().find(i => i.id === id);
          if (item) {
            this.updateQuantity(id, item.quantity + 1);
          }
          return;
        }

        // F. Drawer Remove Single Item
        const drawerRemoveBtn = e.target.closest('.btn-drawer-remove');
        if (drawerRemoveBtn) {
          e.preventDefault();
          const id = drawerRemoveBtn.getAttribute('data-remove-id');
          if (id) this.removeItem(id);
          return;
        }

        // G. Drawer Clear Cart
        const drawerClearBtn = e.target.closest('#drawerClearCartBtn');
        if (drawerClearBtn) {
          e.preventDefault();
          this.confirmClearCart();
          return;
        }

        // H. Cart Page (+ / - / Remove / Clear)
        const pageDecBtn = e.target.closest('.btn-page-qty-minus');
        if (pageDecBtn) {
          e.preventDefault();
          const id = pageDecBtn.getAttribute('data-id');
          const item = this.getItems().find(i => i.id === id);
          if (item) {
            if (item.quantity === 1) {
              const confirmRemove = window.confirm(`Remove ${item.name} from your cart?`);
              if (confirmRemove) this.removeItem(id);
            } else {
              this.updateQuantity(id, item.quantity - 1);
            }
          }
          return;
        }

        const pageIncBtn = e.target.closest('.btn-page-qty-plus');
        if (pageIncBtn) {
          e.preventDefault();
          const id = pageIncBtn.getAttribute('data-id');
          const item = this.getItems().find(i => i.id === id);
          if (item) {
            this.updateQuantity(id, item.quantity + 1);
          }
          return;
        }

        const pageRemoveBtn = e.target.closest('.btn-page-remove');
        if (pageRemoveBtn) {
          e.preventDefault();
          const id = pageRemoveBtn.getAttribute('data-id');
          const item = this.getItems().find(i => i.id === id);
          const confirmRemove = window.confirm(`Remove "${item ? item.name : 'this item'}" from your cart?`);
          if (confirmRemove && id) {
            this.removeItem(id);
          }
          return;
        }

        const pageClearBtn = e.target.closest('#btnClearCartPage');
        if (pageClearBtn) {
          e.preventDefault();
          this.confirmClearCart();
          return;
        }
      });

      // Handle manual input change on Cart Page
      document.addEventListener('change', (e) => {
        const pageQtyInput = e.target.closest('.page-qty-input');
        if (pageQtyInput) {
          const id = pageQtyInput.getAttribute('data-id');
          let val = parseInt(pageQtyInput.value, 10);
          if (isNaN(val) || val < 1) val = 1;
          if (val > 99) val = 99;
          this.updateQuantity(id, val);
        }
      });
    },

    // Handle Add to Cart Click
    handleAddClick: function (btn) {
      // Find associated product data
      let id = btn.getAttribute('data-id');
      let name = btn.getAttribute('data-name');
      let price = parseFloat(btn.getAttribute('data-price'));
      let image = btn.getAttribute('data-image');
      let category = btn.getAttribute('data-category');

      // If button doesn't have attributes, search parent food-card
      if (!id) {
        const card = btn.closest('.food-card');
        if (card) {
          id = card.getAttribute('data-product-id') || card.getAttribute('data-id');
          name = card.getAttribute('data-title') || card.querySelector('h3')?.textContent?.trim();
          const priceRaw = card.getAttribute('data-price') || card.querySelector('.food-price')?.textContent?.trim();
          price = parseFloat((priceRaw || '').replace(/[^0-9.]/g, ''));
          image = card.getAttribute('data-img') || card.querySelector('img')?.src;
          category = card.closest('[data-category]')?.getAttribute('data-category') || 'dumplings';
        }
      }

      // Match in Catalog if attributes are partial
      if (id && (!name || isNaN(price) || !image)) {
        const cat = this.findInCatalog(id);
        if (cat) {
          name = name || cat.name;
          price = !isNaN(price) ? price : cat.price;
          image = image || cat.image;
          category = category || cat.category;
        }
      }

      if (!id || !name || isNaN(price)) {
        console.warn('[DBK Cart] Insufficient product data for Add to Cart:', { id, name, price });
        return;
      }

      // Quantity selector value from adjacent group if exists
      let quantity = 1;
      const cardParent = btn.closest('.food-card, .modal-content, .product-actions');
      if (cardParent) {
        const qtyField = cardParent.querySelector('.qty-field');
        if (qtyField) {
          quantity = parseInt(qtyField.value, 10) || 1;
          qtyField.value = 1; // Reset to 1 after adding
        }
      }

      // Add to Cart
      this.addItem({ id, name, price, image, category }, quantity);

      // Button Feedback Animation
      const originalHtml = btn.innerHTML;
      btn.innerHTML = `<i class="bi bi-check2"></i> <span>Added!</span>`;
      btn.classList.add('btn-added-feedback');
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalHtml;
        btn.classList.remove('btn-added-feedback');
        btn.disabled = false;
      }, 1000);
    }
  };

  // Expose globally for page components
  window.DBKCart = DBKCart;
  window.DBK_CATALOG = DBK_CATALOG;

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DBKCart.init());
  } else {
    DBKCart.init();
  }
})();
