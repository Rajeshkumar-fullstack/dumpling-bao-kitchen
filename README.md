# Dumpling & Bao Kitchen 🥟

> Modern, responsive, multi-page Asian street-food restaurant website showcasing handcrafted dumplings, steamed bao buns, authentic signature fillings, and frozen retail packs with a refined **Blue and White** aesthetic and client-side Shopping Cart system.

---

## 1. Project Overview

**Dumpling & Bao Kitchen** is a production-quality, frontend-only website designed with a clean, premium, modern blue-and-white restaurant aesthetic, crisp white cards, ice-blue section accents, appetizing food layouts, subtle CSS steam animations, and accessible interactive features.

### Color System (Blue & White Theme)
- **Primary Background**: Pure White (`#FFFFFF`)
- **Main Brand Color**: Deep Navy Blue (`#163A5F`)
- **Buttons & Interactive Elements**: Ocean Blue (`#2878B5`)
- **Button Hover**: Dark Blue (`#102B46`)
- **Alternate Section Backgrounds**: Ice Blue (`#EAF4FB`)
- **Borders & Dividers**: Soft Blue Gray (`#D5E4F0`)
- **Body Text**: Dark Charcoal (`#263238`)
- **Secondary Text**: Gray (`#64748B`)

### Key Highlights
- **Multi-page architecture**: 6 connected pages (`index.html`, `dumpling-experience.html`, `menu.html`, `frozen-packs.html`, `cart.html`, `contact.html`).
- **Fully Functional Shopping Cart System**:
  - **Shared Responsive Navbar Cart**: Displays **Cart 🛒 (X)** across desktop, tablet, and mobile with real-time item count synchronization and pulse animations.
  - **Card & Modal Add to Cart Controls**: Responsive quantity selectors (`-`, input `1`, `+`) and prominent **Add to Cart** buttons on all 24 Menu items and 6 Frozen Packs, plus the item detail modal.
  - **Persistent Storage**: Robust `localStorage` engine preserves cart contents across browser refreshes and inter-page navigation.
  - **Toast Notifications**: Interactive toast alerts informing customers when an item is added, with direct "View Cart" triggers.
  - **Offcanvas Cart Drawer**: Accessible slide-out cart drawer on every page featuring live item increment/decrement, item deletion, subtotal calculation, and direct checkout shortcuts.
  - **Dedicated Cart Page (`cart.html`)**: Complete shopping cart dashboard with tabular item reviews, quantity modifiers, confirmation-backed item removal and cart clearing, order summary breakdown, and empty-cart recommendation states.
  - **Frontend-Only Demo Checkout Flow**: Interactive order enquiry and checkout modal simulating order submission with generated reference codes (`#DBK-XXXXX`), itemized receipts, and explicit demo disclaimers.
- **Dual Landing Page Architecture**:
  - **Kitchen & Our Story** (`index.html`): Heritage, artisan dough, 18-fold pleating, kitchen team, signature dumplings, and cozy street-food craft.
  - **Dumpling Experience** (`dumpling-experience.html`): Sensory dining experience featuring multi-course curated tasting flights, live tableside steaming stations, "Fold With The Masters" weekend masterclasses, and craft tea/sauce pairings.
- **Home Dropdown Navigation**: Integrated dropdown in the sticky responsive navbar supporting desktop hover, touch-friendly mobile drawer menus, and RTL layout flipping.
- **Interactive Menu Filtering**: Instant, client-side category filtering across 6 culinary categories with a dynamic item counter.
- **Item Detail Modal**: Accessible Bootstrap 5 modal showcasing ingredients, allergens, flavor profiles, and instant Add to Cart for each menu item.
- **Frozen Pack & Experience Enquiries**: Seamless query parameter integration linking retail cards and tasting flights directly to pre-populated fields on `contact.html`.
- **Global Theme Switcher**: Persistent Dark Mode (Midnight Navy with Ice Blue accents) and Light Mode (Blue & White) with zero-flash early initialization.
- **Global RTL/LTR Toggle**: Full bidirectional layout support utilizing modern CSS logical properties and direction switching.
- **Form Validation**: Accessible HTML5 and Vanilla JavaScript validation with custom inline feedback and explicit frontend-only demo notice.
- **Performance & Motion**: IntersectionObserver scroll-triggered reveals with full support for `prefers-reduced-motion`.

---

## 2. Technology Stack

- **HTML5**: Semantic document structure with accessible ARIA labeling.
- **Tailwind CSS (CDN)**: Utility styling and custom design composition (with conflicting collapse utility safely disabled).
- **Bootstrap 5.3 (CSS & Bundle JS)**: Responsive flexbox/grid system, accessible collapsing navbar, offcanvas cart drawer, toasts, and interactive modals.
- **Bootstrap Icons (v1.11.3)**: Lightweight scalable SVG iconography.
- **Vanilla JavaScript (ES6+)**: Custom modular scripts for cart management, animations, validation, theme switching, and navigation (no frameworks, no heavy libraries, no backend).
- **Google Fonts**: *Playfair Display* (display serif headings) & *Inter* (clean, legible body copy).

---

## 3. Project Directory Structure

```
Dumpling & Bao Kitchen/
│
├── index.html               # Landing 1: Kitchen & Our Story (Hero, Signatures, Bao, Craft, Gallery, Favorites)
├── dumpling-experience.html # Landing 2: Dumpling Experience (Tasting Flights, Live Steamer Bar, Masterclasses)
├── menu.html                # Menu Page (6 categories, 24 items, filtering, details modal, Add to Cart)
├── frozen-packs.html        # Retail Page (6 take-home packs, 3-step cooking guide, Add to Cart, bulk enquiries)
├── cart.html                # Shopping Cart Page (Itemized table, quantity controls, totals, demo checkout)
├── contact.html             # Contact Page (Validated form, opening hours, interactive map embed)
│
├── assets/
│   ├── css/
│   │   ├── themes.css       # Blue & White CSS variables, light/dark mode definitions, fluid typography
│   │   ├── style.css        # Blue & White component styling, buttons, steam effect, cards, drawer, toasts
│   │   └── responsive.css   # Viewport breakpoints (320px–1280px+), cart responsive rules, RTL overrides
│   │
│   ├── js/
│   │   ├── cart.js          # Centralized cart engine, catalog, localStorage, drawer, toasts & cart page
│   │   ├── main.js          # Menu filtering, modal populator, mobile nav auto-close, dynamic year
│   │   ├── theme.js         # Dark/Light mode switcher with localStorage persistence
│   │   ├── rtl.js           # LTR/RTL bidirectional layout switcher with localStorage persistence
│   │   ├── animations.js    # IntersectionObserver scroll reveals and sticky navbar transitions
│   │   └── form-validation.js # Form checking, regex email validation, demo notice, URL pre-fill
│   │
│   ├── images/              # Local image asset directories
│   │   ├── hero/
│   │   ├── dumplings/
│   │   ├── bao-buns/
│   │   ├── menu/
│   │   ├── frozen-packs/
│   │   ├── kitchen/
│   │   └── restaurant/
│   │
│   └── icons/
│       └── dumpling.svg     # Brand SVG icon & favicon updated to Navy/Ocean Blue
│
└── README.md                # Documentation & operator guide
```

---

## 4. How to Run Locally

Because this project is built entirely with standard web standards and reliable CDN assets, **no build step, Node.js runtime, or compilation is required**.

### Method A: Direct Browser Opening
Simply double-click `index.html` (or right-click and select **Open with Google Chrome / Edge / Safari / Firefox**).

### Method B: Local Development Server (Recommended)
Running through an HTTP server ensures optimal module performance and iframe map handling:

- **VS Code / IDE**: Install the **Live Server** extension and click **Go Live**.
- **Python 3**:
  ```bash
  python -m http.server 8000
  ```
  Then open `http://localhost:8000` in your browser.
- **Node `npx` (optional)**:
  ```bash
  npx serve .
  ```

---

## 5. Testing & Verification Checklist

| Test Item | Expected Result | Status |
|:---|:---|:---:|
| **Blue & White Palette** | Pure White `#FFFFFF`, Navy `#163A5F`, Ocean Blue `#2878B5`, Ice Blue `#EAF4FB`, Soft Blue Gray `#D5E4F0` | ✅ Verified |
| **Typography & Contrast** | Dark Charcoal `#263238` on White/Ice Blue meets WCAG AA readability | ✅ Verified |
| **Buttons & Interactivity** | Ocean Blue `#2878B5` with Dark Blue `#102B46` hover across all buttons | ✅ Verified |
| **Dark Theme Consistency** | Midnight Navy `#0A192F` background with Ice Blue `#EAF4FB` & Ocean Blue `#5BA8E6` accents | ✅ Verified |
| **Navbar & Home Dropdown** | Sticky navbar, hover dropdown, mobile drawer, responsive at all widths | ✅ Verified |
| **Add to Cart (Menu & Retail)** | Instant add, quantity selector, toast notification, deduplication | ✅ Verified |
| **Cart Drawer & Cart Page** | Full persistent drawer & dedicated `cart.html` with item controls and totals | ✅ Verified |
| **RTL / LTR Support** | Layout and text direction cleanly flip in Arabic/Hebrew mode | ✅ Verified |
| **Mobile Responsiveness** | Tested at 320px, 360px, 390px, 425px, 720px, 768px, 1024px without overflow | ✅ Verified |

---

&copy; 2026 **Dumpling & Bao Kitchen**. Handcrafted with culinary passion.
