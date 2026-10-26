/**
 * MAIN.JS — Core Application Coordination, Menu Filtering & Modal Handlers
 * Dumpling & Bao Kitchen
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Copyright Year
    const copyrightYearEl = document.getElementById('currentYear');
    if (copyrightYearEl) {
      copyrightYearEl.textContent = new Date().getFullYear();
    }

    // 2. Mobile Navbar Auto-close on Nav Click (excludes dropdown toggles)
    const navbarCollapse = document.getElementById('mainNavbarContent');
    if (navbarCollapse && typeof bootstrap !== 'undefined') {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse, { toggle: false });
      const closeTargets = navbarCollapse.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item, .btn:not(.dropdown-toggle)');
      closeTargets.forEach((target) => {
        target.addEventListener('click', () => {
          if (navbarCollapse.classList.contains('show')) {
            bsCollapse.hide();
          }
        });
      });
    }

    // 3. Menu Filtering & Page Navigation (menu.html - 1, 2, 3 Pagination)
    const filterButtons = document.querySelectorAll('.menu-filter-pill');
    const menuItems = Array.from(document.querySelectorAll('.menu-item-card'));
    const menuCountEl = document.getElementById('menuItemCount');
    const paginationList = document.getElementById('menuPaginationList');
    const paginationInfo = document.getElementById('menuPaginationInfo');
    const paginationRow = document.getElementById('menuPaginationRow');
    const menuFilterBar = document.getElementById('menuFilterBar');

    if (filterButtons.length > 0 && menuItems.length > 0) {
      const ITEMS_PER_PAGE = 8;
      let currentCategory = 'all';
      let currentPage = 1;

      const scrollToMenu = () => {
        if (menuFilterBar) {
          const y = menuFilterBar.getBoundingClientRect().top + window.pageYOffset - 85;
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        }
      };

      const getMatchingItems = (category) => {
        if (category === 'all') return menuItems;
        return menuItems.filter((item) => item.getAttribute('data-category') === category);
      };

      const renderPagination = (matchingItems) => {
        const totalItems = matchingItems.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

        if (currentPage > totalPages) {
          currentPage = 1;
        }

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const currentSlice = matchingItems.slice(startIndex, endIndex);

        // Update items visibility
        menuItems.forEach((item) => {
          if (currentSlice.includes(item)) {
            item.style.display = '';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0) scale(1)';
            }, 30);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(12px) scale(0.96)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 200);
          }
        });

        // Update category items available count
        if (menuCountEl) {
          menuCountEl.textContent = `${totalItems} item${totalItems === 1 ? '' : 's'} available`;
        }

        // Render Pagination Controls (Prev, 1, 2, 3, Next)
        if (paginationList) {
          paginationList.innerHTML = '';

          if (paginationRow) {
            paginationRow.style.display = totalItems > 0 ? '' : 'none';
          }

          // Previous Page Button
          const prevLi = document.createElement('li');
          prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
          prevLi.innerHTML = `
            <button class="page-link page-link-prev" type="button" aria-label="Previous Page" ${currentPage === 1 ? 'tabindex="-1"' : ''}>
              <i class="bi bi-chevron-left" aria-hidden="true"></i>
              <span>Prev</span>
            </button>
          `;
          prevLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) {
              currentPage--;
              renderPagination(matchingItems);
              scrollToMenu();
            }
          });
          paginationList.appendChild(prevLi);

          // Page Number Buttons (1, 2, 3 ...)
          for (let p = 1; p <= totalPages; p++) {
            const pageLi = document.createElement('li');
            pageLi.className = `page-item ${p === currentPage ? 'active' : ''}`;
            pageLi.innerHTML = `
              <button class="page-link" type="button" aria-label="Page ${p}" ${p === currentPage ? 'aria-current="page"' : ''}>
                ${p}
              </button>
            `;
            pageLi.addEventListener('click', (e) => {
              e.preventDefault();
              if (currentPage !== p) {
                currentPage = p;
                renderPagination(matchingItems);
                scrollToMenu();
              }
            });
            paginationList.appendChild(pageLi);
          }

          // Next Page Button
          const nextLi = document.createElement('li');
          nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
          nextLi.innerHTML = `
            <button class="page-link page-link-next" type="button" aria-label="Next Page" ${currentPage === totalPages ? 'tabindex="-1"' : ''}>
              <span>Next</span>
              <i class="bi bi-chevron-right" aria-hidden="true"></i>
            </button>
          `;
          nextLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
              currentPage++;
              renderPagination(matchingItems);
              scrollToMenu();
            }
          });
          paginationList.appendChild(nextLi);
        }

        // Update Page Info Indicator
        if (paginationInfo) {
          if (totalItems === 0) {
            paginationInfo.textContent = 'No items found in this category';
          } else {
            const displayStart = startIndex + 1;
            const displayEnd = Math.min(endIndex, totalItems);
            paginationInfo.textContent = `Showing ${displayStart}–${displayEnd} of ${totalItems} items (Page ${currentPage} of ${totalPages})`;
          }
        }
      };

      const updateFilter = (selectedCategory) => {
        currentCategory = selectedCategory;
        currentPage = 1;
        const matching = getMatchingItems(currentCategory);
        renderPagination(matching);
      };

      filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          filterButtons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');

          const category = btn.getAttribute('data-filter') || 'all';
          updateFilter(category);

          // Smoothly center active pill on mobile/tablet horizontal scroll bar
          if (btn.scrollIntoView) {
            btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          }
        });
      });

      // Initialize page 1 on load
      const initialMatching = getMatchingItems('all');
      renderPagination(initialMatching);
    }

    // 4. Item Detail Modal Handler (menu.html)
    const menuModalEl = document.getElementById('itemDetailModal');
    if (menuModalEl && typeof bootstrap !== 'undefined') {
      const modalInstance = new bootstrap.Modal(menuModalEl);
      const detailButtons = document.querySelectorAll('.btn-view-details');

      detailButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const card = btn.closest('.food-card');
          if (!card) return;

          const title = card.getAttribute('data-title') || 'Signature Item';
          const desc = card.getAttribute('data-desc') || 'Freshly prepared daily in our kitchen.';
          const price = card.getAttribute('data-price') || '$12.00';
          const img = card.getAttribute('data-img') || '';
          const ingredients = card.getAttribute('data-ingredients') || 'Handmade dough, signature kitchen fillings, herbs, and spices.';
          const allergens = card.getAttribute('data-allergens') || 'Contains Wheat, Sesame, and Soy.';
          const badgeType = card.getAttribute('data-badge') || '';

          // Populate modal elements
          const modalTitle = menuModalEl.querySelector('.modal-item-title');
          const modalImg = menuModalEl.querySelector('.modal-item-img');
          const modalDesc = menuModalEl.querySelector('.modal-item-desc');
          const modalPrice = menuModalEl.querySelector('.modal-item-price');
          const modalIngredients = menuModalEl.querySelector('.modal-item-ingredients');
          const modalAllergens = menuModalEl.querySelector('.modal-item-allergens');
          const modalBadgeBox = menuModalEl.querySelector('.modal-item-badges');

          if (modalTitle) modalTitle.textContent = title;
          if (modalDesc) modalDesc.textContent = desc;
          if (modalPrice) modalPrice.textContent = price;
          if (modalImg) {
            modalImg.src = img;
            modalImg.alt = title;
            if (img.includes('shanghai-soup-dumplings')) {
              modalImg.classList.add('shanghai-soup-dumplings-img');
            } else {
              modalImg.classList.remove('shanghai-soup-dumplings-img');
            }
            if (img.includes('sweet-corn-chestnut')) {
              modalImg.classList.add('sweet-corn-chestnut-img');
            } else {
              modalImg.classList.remove('sweet-corn-chestnut-img');
            }
            if (img.includes('prawn-golden-broth')) {
              modalImg.classList.add('prawn-golden-broth-img');
            } else {
              modalImg.classList.remove('prawn-golden-broth-img');
            }
            if (img.includes('slow-cooked-pork-bao')) {
              modalImg.classList.add('slow-cooked-pork-bao-img');
            } else {
              modalImg.classList.remove('slow-cooked-pork-bao-img');
            }
            if (img.includes('braised-mushroom-bao')) {
              modalImg.classList.add('braised-mushroom-bao-img');
            } else {
              modalImg.classList.remove('braised-mushroom-bao-img');
            }
          }
          if (modalIngredients) modalIngredients.textContent = ingredients;
          if (modalAllergens) modalAllergens.textContent = allergens;

          if (modalBadgeBox) {
            let badgeHtml = '';
            if (badgeType.includes('veg')) {
              badgeHtml += '<span class="food-badge badge-veg"><i class="bi bi-flower1"></i> Vegetarian</span> ';
            }
            if (badgeType.includes('spicy')) {
              badgeHtml += '<span class="food-badge badge-spicy"><i class="bi bi-fire"></i> Mild Spice</span> ';
            }
            if (badgeType.includes('signature')) {
              badgeHtml += '<span class="food-badge badge-signature"><i class="bi bi-star-fill"></i> Chef Choice</span> ';
            }
            modalBadgeBox.innerHTML = badgeHtml;
          }

          // Populate modal Add to Cart button
          const modalAddBtn = menuModalEl.querySelector('#modalAddToCartBtn');
          const modalQtyInput = menuModalEl.querySelector('.modal-qty-input');
          if (modalAddBtn) {
            const productId = card.getAttribute('data-product-id') || card.getAttribute('data-id') || '';
            const numericPrice = parseFloat((price || '').replace(/[^0-9.]/g, '')) || 12.00;
            const category = card.closest('[data-category]')?.getAttribute('data-category') || 'menu';
            modalAddBtn.setAttribute('data-id', productId);
            modalAddBtn.setAttribute('data-name', title);
            modalAddBtn.setAttribute('data-price', numericPrice.toFixed(2));
            modalAddBtn.setAttribute('data-image', img);
            modalAddBtn.setAttribute('data-category', category);
          }
          if (modalQtyInput) {
            modalQtyInput.value = 1;
          }

          const modalBody = menuModalEl.querySelector('.modal-body');
          if (modalBody) {
            modalBody.scrollTop = 0;
          }

          modalInstance.show();
        });
      });
    }

    // 5. Quantity Inputs Digits-Only Protection across all pages
    document.querySelectorAll('.qty-field').forEach((input) => {
      input.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey || ['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Delete', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
          return;
        }
        if (!/[0-9]/.test(e.key)) {
          e.preventDefault();
        }
      });
      input.addEventListener('input', () => {
        let val = parseInt(input.value, 10);
        if (isNaN(val) || val < 1) input.value = 1;
        else if (val > 99) input.value = 99;
      });
    });
  });
})();
