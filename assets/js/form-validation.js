/**
 * FORM-VALIDATION.JS — Accessible Form Validation & URL Query Handler
 * Dumpling & Bao Kitchen
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const confirmationAlert = document.getElementById('formSuccessAlert');

    // 1. Prepopulate form if URL query params exist (e.g. from frozen-packs.html)
    const urlParams = new URLSearchParams(window.location.search);
    const enquiryParam = urlParams.get('enquiry');
    const productParam = urlParams.get('product');

    if (contactForm) {
      const enquirySelect = document.getElementById('enquiryType');
      const subjectInput = document.getElementById('subject');

      if (enquiryParam && enquirySelect) {
        if (enquiryParam === 'frozen-packs') {
          enquirySelect.value = 'frozen-packs';
        } else if (enquiryParam === 'catering') {
          enquirySelect.value = 'catering';
        } else if (enquiryParam === 'menu') {
          enquirySelect.value = 'menu';
        }

        // Smoothly bring the form into view when navigated via enquiry param
        setTimeout(() => {
          const formCard = document.getElementById('contact-form') || contactForm;
          if (formCard) {
            formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 200);
      }

      // Handle on-page footer clicks for catering enquiries without full reload
      document.querySelectorAll('a[href*="enquiry=catering"]').forEach((link) => {
        link.addEventListener('click', (e) => {
          if (window.location.pathname.endsWith('contact.html') || window.location.pathname.endsWith('contact')) {
            e.preventDefault();
            if (enquirySelect) {
              enquirySelect.value = 'catering';
            }
            const formCard = document.getElementById('contact-form') || contactForm;
            if (formCard) {
              formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            history.pushState(null, '', 'contact.html?enquiry=catering#contact-form');
          }
        });
      });

      if (productParam && subjectInput) {
        // Format product name cleanly
        const cleanProduct = decodeURIComponent(productParam)
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        subjectInput.value = `Enquiry regarding ${cleanProduct}`;
      }

      // 2. Comprehensive Field-level Validation Rules
      const fields = {
        fullName: {
          el: document.getElementById('fullName'),
          validate: (val) => {
            const trimmed = val.trim();
            if (trimmed.length === 0) {
              return { valid: false, error: 'Please enter your full name.' };
            }
            if (/\d/.test(trimmed)) {
              return { valid: false, error: 'Name must contain letters only. Numbers are not allowed.' };
            }
            if (!/^[A-Za-z\s]+$/.test(trimmed)) {
              return { valid: false, error: 'Name must contain letters only. Special characters are not allowed.' };
            }
            if (trimmed.length < 2) {
              return { valid: false, error: 'Name must be at least 2 characters long.' };
            }
            return { valid: true };
          }
        },
        email: {
          el: document.getElementById('email'),
          validate: (val) => {
            const trimmed = val.trim();
            if (trimmed.length === 0) {
              return { valid: false, error: 'Please enter your email address.' };
            }
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(trimmed)) {
              return { valid: false, error: 'Please enter a valid email address (e.g. jane@example.com).' };
            }
            return { valid: true };
          }
        },
        phone: {
          el: document.getElementById('phone'),
          validate: (val) => {
            const trimmed = val.trim();
            if (trimmed.length === 0) {
              return { valid: false, error: 'Please enter your phone number.' };
            }
            if (/[a-zA-Z]/.test(trimmed)) {
              return { valid: false, error: 'Phone number must contain digits only. Letters are not allowed.' };
            }
            if (!/^\d+$/.test(trimmed)) {
              return { valid: false, error: 'Phone number must contain digits only. Symbols and spaces are not allowed.' };
            }
            if (trimmed.length !== 10) {
              return { valid: false, error: 'Phone number must contain exactly 10 digits.' };
            }
            return { valid: true };
          }
        },
        enquiryType: {
          el: document.getElementById('enquiryType'),
          validate: (val) => {
            if (!val || val === '' || val === 'disabled') {
              return { valid: false, error: 'Please select an enquiry category.' };
            }
            return { valid: true };
          }
        },
        subject: {
          el: document.getElementById('subject'),
          validate: (val) => {
            const trimmed = val.trim();
            if (trimmed.length === 0) {
              return { valid: false, error: 'Please enter a subject.' };
            }
            if (trimmed.length < 3) {
              return { valid: false, error: 'Subject must be at least 3 characters.' };
            }
            return { valid: true };
          }
        },
        message: {
          el: document.getElementById('message'),
          validate: (val) => {
            const trimmed = val.trim();
            if (trimmed.length === 0) {
              return { valid: false, error: 'Please enter your message.' };
            }
            if (trimmed.length < 10) {
              return { valid: false, error: 'Please write a message with at least 10 characters.' };
            }
            return { valid: true };
          }
        },
        privacyConsent: {
          el: document.getElementById('privacyConsent'),
          validate: (val, el) => {
            if (!el || !el.checked) {
              return { valid: false, error: 'You must consent before submitting your enquiry.' };
            }
            return { valid: true };
          }
        }
      };

      /**
       * Validate a single field with dynamic contextual feedback
       */
      function validateField(fieldKey) {
        const item = fields[fieldKey];
        if (!item || !item.el) return true;

        const val = item.el.value || '';
        const result = item.validate(val, item.el);
        const isValid = result.valid;

        const parent = item.el.closest('.col-md-6, .col-12, .form-check') || item.el.parentElement;
        const feedbackEl = parent ? parent.querySelector('.invalid-feedback') : item.el.parentElement.querySelector('.invalid-feedback');

        if (!isValid) {
          item.el.classList.add('is-invalid');
          item.el.classList.remove('is-valid');
          item.el.setAttribute('aria-invalid', 'true');
          if (feedbackEl) {
            feedbackEl.textContent = result.error || 'Please fill out this field correctly.';
          }
        } else {
          item.el.classList.remove('is-invalid');
          item.el.classList.add('is-valid');
          item.el.setAttribute('aria-invalid', 'false');
        }

        return isValid;
      }

      // Proactive keystroke blockers for Name (blocks 0-9) and Phone (blocks letters)
      const fullNameEl = fields.fullName.el;
      if (fullNameEl) {
        fullNameEl.addEventListener('keydown', (e) => {
          if (e.ctrlKey || e.metaKey || e.altKey || ['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Delete', 'Escape', ' '].includes(e.key)) {
            return;
          }
          if (/[0-9]/.test(e.key)) {
            e.preventDefault();
            fullNameEl.classList.add('is-invalid');
            fullNameEl.classList.remove('is-valid');
            fullNameEl.setAttribute('aria-invalid', 'true');
            const parent = fullNameEl.closest('.col-md-6') || fullNameEl.parentElement;
            const feedbackEl = parent ? parent.querySelector('.invalid-feedback') : null;
            if (feedbackEl) {
              feedbackEl.textContent = 'Name must contain letters only. Numbers are not allowed.';
            }
          }
        });
      }

      const phoneEl = fields.phone.el;
      if (phoneEl) {
        phoneEl.addEventListener('keydown', (e) => {
          if (e.ctrlKey || e.metaKey || e.altKey || ['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Delete', 'Escape'].includes(e.key)) {
            return;
          }
          if (/[a-zA-Z]/.test(e.key)) {
            e.preventDefault();
            phoneEl.classList.add('is-invalid');
            phoneEl.classList.remove('is-valid');
            phoneEl.setAttribute('aria-invalid', 'true');
            const parent = phoneEl.closest('.col-md-6') || phoneEl.parentElement;
            const feedbackEl = parent ? parent.querySelector('.invalid-feedback') : null;
            if (feedbackEl) {
              feedbackEl.textContent = 'Phone number must contain digits only. Letters are not allowed.';
            }
          }
        });
      }

      // Add blur, input and change listeners for reactive validation across all fields
      Object.keys(fields).forEach((key) => {
        const item = fields[key];
        if (item && item.el) {
          item.el.addEventListener('blur', () => validateField(key));
          item.el.addEventListener('input', () => validateField(key));
          if (item.el.type === 'checkbox' || item.el.tagName === 'SELECT') {
            item.el.addEventListener('change', () => validateField(key));
          }
        }
      });

      // 3. Form Submission Handling
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let allValid = true;
        let firstInvalidEl = null;

        Object.keys(fields).forEach((key) => {
          const isValid = validateField(key);
          if (!isValid) {
            allValid = false;
            if (!firstInvalidEl && fields[key].el) {
              firstInvalidEl = fields[key].el;
            }
          }
        });

        if (!allValid) {
          if (firstInvalidEl) {
            firstInvalidEl.focus();
            firstInvalidEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }

        // Form is valid! Gather submitted values for demonstration feedback
        const nameVal = fields.fullName.el.value.trim();
        const subjectVal = fields.subject.el.value.trim();

        if (confirmationAlert) {
          confirmationAlert.innerHTML = `
            <div class="d-flex align-items-start gap-3">
              <i class="bi bi-check-circle-fill text-success fs-3 flex-shrink-0"></i>
              <div>
                <h5 class="fw-bold mb-1">Enquiry Prepared Successfully!</h5>
                <p class="mb-2">Thank you, <strong>${escapeHTML(nameVal)}</strong>. Your message regarding <em>"${escapeHTML(subjectVal)}"</em> passed all local client validation checks.</p>
                <div class="p-2.5 rounded bg-warning-subtle text-dark small border border-warning">
                  <i class="bi bi-info-circle-fill me-1"></i>
                  <strong>Frontend Demonstration Notice:</strong> This is a client-side only website prototype. No real email or server request was transmitted. To activate live submission, connect this form action to your preferred backend endpoint (such as Formspree, Netlify Forms, or an API server).
                </div>
              </div>
            </div>
          `;
          confirmationAlert.classList.remove('d-none');
          confirmationAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Reset form controls
        contactForm.reset();
        Object.keys(fields).forEach((key) => {
          if (fields[key].el) {
            fields[key].el.classList.remove('is-valid', 'is-invalid');
          }
        });
      });
    }

    /**
     * Helper to prevent basic HTML injection in the demo message
     */
    function escapeHTML(str) {
      return str.replace(/[&<>'"]/g, 
        (tag) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
      );
    }
  });
})();
