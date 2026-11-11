/**
 * STUDIO "ХАРЫБИНА ОЛЬГА" — LUXURY EDITORIAL INTERACTIONS
 * Scope: Navigation Capsule, Scroll Reveals, Before/After Split Slider,
 * Service Modals, Reviews Carousel, Booking System & Ambient Torch
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 0. DISABLE PINCH & KEYBOARD/WHEEL ZOOM ---
  const preventZoomEvent = (e) => e.preventDefault();

  window.addEventListener(
    'wheel',
    (e) => {
      if (e.ctrlKey || e.metaKey) e.preventDefault();
    },
    { passive: false }
  );

  ['gesturestart', 'gesturechange', 'gestureend'].forEach((evtName) => {
    document.addEventListener(evtName, preventZoomEvent, { passive: false });
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && ['+', '=', '-', '_', '0'].includes(e.key)) {
      e.preventDefault();
    }
  });

  // --- 1. HEADER SCROLL MORPH, 1px READING PROGRESS & ACTIVE SECTION TRACKING ---
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const trackedSections = document.querySelectorAll('section[id]');

  const updateHeaderState = () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
    const docEl = document.documentElement;
    const maxScroll = Math.max(0, (docEl ? docEl.scrollHeight : 0) - window.innerHeight);
    const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    header.style.setProperty('--scroll-progress', progress.toFixed(4));
  };

  window.addEventListener('scroll', updateHeaderState, { passive: true });
  window.addEventListener('resize', updateHeaderState, { passive: true });
  updateHeaderState();

  const heroScrollCue = document.getElementById('heroScrollCue');
  const servicesTarget = document.getElementById('services');
  if (heroScrollCue && servicesTarget) {
    heroScrollCue.addEventListener('click', (e) => {
      e.preventDefault();
      servicesTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if ('IntersectionObserver' in window && trackedSections.length > 0) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              const targetSection = link.getAttribute('data-section');
              link.classList.toggle('is-active', targetSection === id);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );

    trackedSections.forEach((sec) => {
      if (sec.id !== 'hero') navObserver.observe(sec);
    });
  }

  // --- 2. SMOOTH SCROLL REVEAL FOR SECTIONS ---
  const revealItems = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealItems.forEach((el) => revealObserver.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add('is-visible'));
  }

  // --- 3. MOBILE NAVIGATION DRAWER ---
  const btnBurger = document.getElementById('btnBurger');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const btnDrawerClose = document.getElementById('btnDrawerClose');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const openDrawer = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (btnBurger) btnBurger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (btnBurger) btnBurger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (btnBurger) btnBurger.addEventListener('click', openDrawer);
  if (btnDrawerClose) btnDrawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
  drawerLinks.forEach((link) => link.addEventListener('click', closeDrawer));

  const btnDrawerBook = document.getElementById('btnDrawerBook');
  if (btnDrawerBook) {
    btnDrawerBook.addEventListener('click', closeDrawer);
  }

  // --- 5. SERVICES EXPANDABLE TABLE (ACCORDION) ---
  const serviceRows = document.querySelectorAll('.service-row');

  serviceRows.forEach((row) => {
    const trigger = row.querySelector('.service-row-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const willOpen = !row.classList.contains('is-open');
      row.classList.toggle('is-open', willOpen);
      trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
  });

  // --- 6. PORTFOLIO CATEGORY FILTERS & INTERACTIVE BEFORE/AFTER SLIDER ---
  const filterTabs = document.querySelectorAll('.filter-tab');
  const baViewer = document.getElementById('baViewer');
  const baAfterLayer = document.getElementById('baAfterLayer');
  const baDivider = document.getElementById('baDivider');
  const baImgBefore = document.getElementById('baImgBefore');
  const baImgAfter = document.getElementById('baImgAfter');
  const baCaptionTitle = document.getElementById('baCaptionTitle');
  const baCaptionDesc = document.getElementById('baCaptionDesc');

  const portfolioBaData = {
    brows: {
      before: 'assets/ba-brows-before.jpg',
      after: 'assets/ba-brows-after.jpg',
      title: 'Перманентный макияж бровей',
      desc: 'Передвигайте разделитель, чтобы сравнить исходный тон и мягкий пудровый результат.'
    },
    lips: {
      before: 'assets/ba-lips-before.jpg',
      after: 'assets/ba-lips-after.jpg',
      title: 'Перманентный макияж губ',
      desc: 'Передвигайте разделитель, чтобы оценить мягкое нюдово-акварельное тонирование.'
    },
    eyes: {
      before: 'assets/ba-eyes-before.jpg',
      after: 'assets/ba-eyes-after.jpg',
      title: 'Перманентный макияж век',
      desc: 'Передвигайте разделитель, чтобы увидеть деликатную проработку межресничной линии.'
    }
  };

  const setBaZone = (zone) => {
    const data = portfolioBaData[zone];
    if (!data) return;

    if (baImgBefore) baImgBefore.src = data.before;
    if (baImgAfter) baImgAfter.src = data.after;
    if (baCaptionTitle) baCaptionTitle.textContent = data.title;
    if (baCaptionDesc) baCaptionDesc.textContent = data.desc;
    setSliderPosition(50);
  };

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-filter');
      filterTabs.forEach((t) => {
        const isCurrent = t === tab;
        t.classList.toggle('is-active', isCurrent);
        t.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
      });

      if (category && portfolioBaData[category]) {
        setBaZone(category);
      }
    });
  });

  let isDraggingSlider = false;
  let userInteractedSlider = false;

  const setSliderPosition = (pct) => {
    const clamped = Math.max(0, Math.min(100, pct));
    if (baAfterLayer) {
      baAfterLayer.style.clipPath = `polygon(0 0, ${clamped}% 0, ${clamped}% 100%, 0 100%)`;
      baAfterLayer.style.webkitClipPath = `polygon(0 0, ${clamped}% 0, ${clamped}% 100%, 0 100%)`;
    }
    if (baDivider) {
      baDivider.style.left = `${clamped}%`;
    }
    if (baViewer) {
      baViewer.setAttribute('aria-valuenow', Math.round(clamped));
    }
  };

  const updateSliderFromPointer = (e) => {
    if (!baViewer) return;
    const rect = baViewer.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(pct);
  };

  if (baViewer) {
    baViewer.addEventListener('pointerdown', (e) => {
      userInteractedSlider = true;
      baViewer.classList.remove('is-hinting');
      isDraggingSlider = true;
      updateSliderFromPointer(e);
      baViewer.setPointerCapture(e.pointerId);
    });

    baViewer.addEventListener('pointermove', (e) => {
      if (isDraggingSlider) updateSliderFromPointer(e);
    });

    const stopDrag = (e) => {
      if (isDraggingSlider) {
        isDraggingSlider = false;
        try { baViewer.releasePointerCapture(e.pointerId); } catch (_) {}
      }
    };

    baViewer.addEventListener('pointerup', stopDrag);
    baViewer.addEventListener('pointercancel', stopDrag);

    baViewer.addEventListener('keydown', (e) => {
      userInteractedSlider = true;
      baViewer.classList.remove('is-hinting');
      const currentVal = parseInt(baViewer.getAttribute('aria-valuenow') || '50', 10);
      if (e.key === 'ArrowLeft') {
        setSliderPosition(currentVal - 5);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        setSliderPosition(currentVal + 5);
        e.preventDefault();
      }
    });

    if ('IntersectionObserver' in window && !isReducedMotion) {
      let hasRunSliderHint = false;
      const sliderHintObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting || hasRunSliderHint || userInteractedSlider) return;
            hasRunSliderHint = true;
            observer.unobserve(baViewer);

            const nowFn = () => (typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now());
            const startTime = nowFn();
            const duration = 950;
            baViewer.classList.add('is-hinting');

            const runHint = () => {
              if (userInteractedSlider) {
                baViewer.classList.remove('is-hinting');
                return;
              }
              const t = Math.min(1, (nowFn() - startTime) / duration);
              const wave = Math.sin(t * Math.PI);
              setSliderPosition(50 + wave * 14);
              if (t < 1) {
                requestAnimationFrame(runHint);
              } else {
                setSliderPosition(50);
                baViewer.classList.remove('is-hinting');
              }
            };

            setTimeout(() => requestAnimationFrame(runHint), 220);
          });
        },
        { threshold: 0.42 }
      );
      sliderHintObserver.observe(baViewer);
    }
  }

  // --- 7. REVIEWS PAGINATED CAROUSEL NAVIGATION (ALL 5-STAR REVIEWS) ---
  const reviewCards = document.querySelectorAll('.review-card');
  const reviewsDotsWrap = document.getElementById('reviewsDots');
  const reviewsCounter = document.getElementById('reviewsCounter');
  const reviewPrev = document.getElementById('reviewPrev');
  const reviewNext = document.getElementById('reviewNext');
  let activeReviewPage = 0;
  let lastDotCount = 0;

  const getReviewsPerPage = () => {
    if (window.innerWidth <= 767) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  };

  const renderReviewDots = (totalPages) => {
    if (!reviewsDotsWrap) return;
    if (lastDotCount !== totalPages) {
      reviewsDotsWrap.innerHTML = '';
      for (let p = 0; p < totalPages; p++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'review-dot';
        dot.setAttribute('aria-label', `Страница отзывов ${p + 1}`);
        dot.addEventListener('click', () => updateReviewSlide(p));
        reviewsDotsWrap.appendChild(dot);
      }
      lastDotCount = totalPages;
    }

    const dots = reviewsDotsWrap.querySelectorAll('.review-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === activeReviewPage);
    });
  };

  const updateReviewSlide = (pageIndex) => {
    if (reviewCards.length === 0) return;
    const perPage = getReviewsPerPage();
    const totalPages = Math.max(1, Math.ceil(reviewCards.length / perPage));
    activeReviewPage = ((pageIndex % totalPages) + totalPages) % totalPages;

    const start = activeReviewPage * perPage;
    const end = start + perPage;
    const spotlightIndex = perPage === 3 && start + 1 < reviewCards.length ? start + 1 : start;

    reviewCards.forEach((card, i) => {
      const visible = i >= start && i < end;
      card.style.display = visible ? 'flex' : 'none';
      card.classList.toggle('is-highlighted', visible && i === spotlightIndex);
    });

    if (reviewsCounter) {
      reviewsCounter.textContent = `${activeReviewPage + 1} / ${totalPages}`;
    }
    renderReviewDots(totalPages);
  };

  if (reviewPrev) reviewPrev.addEventListener('click', () => updateReviewSlide(activeReviewPage - 1));
  if (reviewNext) reviewNext.addEventListener('click', () => updateReviewSlide(activeReviewPage + 1));

  window.addEventListener('resize', () => updateReviewSlide(activeReviewPage), { passive: true });
  updateReviewSlide(0);

  // --- 8. LEGAL DOCUMENTS MODAL (152-ФЗ, ПДн, COOKIE, УСЛОВИЯ) ---
  const legalModal = document.getElementById('legalModal');
  const legalModalOverlay = document.getElementById('legalModalOverlay');
  const legalModalClose = document.getElementById('legalModalClose');
  const legalModalTitle = document.getElementById('legalModalTitle');
  const legalModalBody = document.getElementById('legalModalBody');
  const legalTabs = document.querySelectorAll('[data-legal-tab]');
  const legalPanels = document.querySelectorAll('[data-legal-panel]');

  const legalDocTitles = {
    privacy: 'Политика конфиденциальности',
    consent: 'Согласие на обработку персональных данных',
    cookies: 'Политика использования cookie',
    terms: 'Условия записи и правовая информация'
  };

  const setLegalTab = (docKey) => {
    const targetKey = legalDocTitles[docKey] ? docKey : 'privacy';
    if (legalModalTitle) legalModalTitle.textContent = legalDocTitles[targetKey];

    legalTabs.forEach((tab) => {
      const active = tab.getAttribute('data-legal-tab') === targetKey;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    legalPanels.forEach((panel) => {
      const active = panel.getAttribute('data-legal-panel') === targetKey;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });

    if (legalModalBody) legalModalBody.scrollTop = 0;
  };

  const openLegalModal = (docKey) => {
    if (!legalModal) return;
    setLegalTab(docKey);
    legalModal.classList.add('is-open');
    legalModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      if (legalModalClose) legalModalClose.focus();
    }, 150);
  };

  const closeLegalModal = () => {
    if (!legalModal) return;
    legalModal.classList.remove('is-open');
    legalModal.setAttribute('aria-hidden', 'true');
    const drawerOpen = mobileDrawer && mobileDrawer.classList.contains('is-open');
    if (!drawerOpen) {
      document.body.style.overflow = '';
    }
  };

  legalTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      setLegalTab(tab.getAttribute('data-legal-tab'));
    });
  });

  document.querySelectorAll('[data-legal-doc]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      openLegalModal(trigger.getAttribute('data-legal-doc'));
    });
  });

  if (legalModalClose) legalModalClose.addEventListener('click', closeLegalModal);
  if (legalModalOverlay) legalModalOverlay.addEventListener('click', closeLegalModal);

  // --- 9. COOKIE CONSENT BANNER ---
  const COOKIE_STORAGE_KEY = 'kharybina_cookie_consent';
  const cookieBanner = document.getElementById('cookieBanner');
  const btnCookieAccept = document.getElementById('btnCookieAccept');
  const btnCookieEssential = document.getElementById('btnCookieEssential');
  const btnOpenCookieSettings = document.getElementById('btnOpenCookieSettings');
  const legalCookieAcceptAllBtn = document.getElementById('legalCookieAcceptAllBtn');
  const legalCookieEssentialBtn = document.getElementById('legalCookieEssentialBtn');
  let memoryCookieChoice = null;

  const getCookieChoice = () => {
    try {
      return window.localStorage.getItem(COOKIE_STORAGE_KEY) || memoryCookieChoice;
    } catch (_) {
      return memoryCookieChoice;
    }
  };

  const showCookieBanner = () => {
    if (!cookieBanner) return;
    cookieBanner.hidden = false;
    requestAnimationFrame(() => {
      cookieBanner.classList.add('is-visible');
    });
  };

  const hideCookieBanner = () => {
    if (!cookieBanner) return;
    cookieBanner.classList.remove('is-visible');
    setTimeout(() => {
      if (!cookieBanner.classList.contains('is-visible')) {
        cookieBanner.hidden = true;
      }
    }, 350);
  };

  const saveCookieChoice = (choice) => {
    memoryCookieChoice = choice;
    try {
      window.localStorage.setItem(COOKIE_STORAGE_KEY, choice);
    } catch (_) {}
    hideCookieBanner();
  };

  if (btnCookieAccept) btnCookieAccept.addEventListener('click', () => saveCookieChoice('all'));
  if (btnCookieEssential) btnCookieEssential.addEventListener('click', () => saveCookieChoice('essential'));
  if (legalCookieAcceptAllBtn) {
    legalCookieAcceptAllBtn.addEventListener('click', () => {
      saveCookieChoice('all');
      closeLegalModal();
    });
  }
  if (legalCookieEssentialBtn) {
    legalCookieEssentialBtn.addEventListener('click', () => {
      saveCookieChoice('essential');
      closeLegalModal();
    });
  }
  if (btnOpenCookieSettings) {
    btnOpenCookieSettings.addEventListener('click', showCookieBanner);
  }

  if (!getCookieChoice()) {
    setTimeout(showCookieBanner, 700);
  }

  // --- 10. ESCAPE KEY HANDLER FOR MODALS & DRAWER ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (legalModal && legalModal.classList.contains('is-open')) {
        closeLegalModal();
      } else if (mobileDrawer && mobileDrawer.classList.contains('is-open')) {
        closeDrawer();
      }
    }
  });

  // --- 11. GLOBAL AMBIENT COPPER TORCH & ELEMENT SPOTLIGHTS ---
  const cursorTorch = document.getElementById('cursorTorch');
  const heroTorch = document.getElementById('heroTorch');

  if ((cursorTorch || heroTorch) && isFinePointer && !isReducedMotion) {
    let mouseX = window.innerWidth * 0.35;
    let mouseY = window.innerHeight * 0.45;
    let currentX = mouseX;
    let currentY = mouseY;
    let isTicking = false;

    const applyTorchPositions = () => {
      if (cursorTorch) {
        cursorTorch.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0)`;
      }
      if (heroTorch) {
        heroTorch.style.transform = `translate3d(${currentX.toFixed(1)}px, ${(currentY + window.scrollY).toFixed(1)}px, 0)`;
      }
    };

    const setTorchActive = (active) => {
      if (cursorTorch) cursorTorch.classList.toggle('is-active', active);
      if (heroTorch) heroTorch.classList.toggle('is-active', active);
    };

    const updateTorch = () => {
      currentX += (mouseX - currentX) * 0.11;
      currentY += (mouseY - currentY) * 0.11;
      applyTorchPositions();

      const dist = Math.abs(mouseX - currentX) + Math.abs(mouseY - currentY);
      if (dist > 0.25) {
        requestAnimationFrame(updateTorch);
      } else {
        isTicking = false;
      }
    };

    window.addEventListener(
      'pointermove',
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        setTorchActive(true);
        if (!isTicking) {
          isTicking = true;
          requestAnimationFrame(updateTorch);
        }
      },
      { passive: true }
    );

    window.addEventListener('scroll', applyTorchPositions, { passive: true });
    document.addEventListener('mouseleave', () => setTorchActive(false));

    // Subtle local copper spotlight inside rows & cards
    const attachSpotlight = (selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        el.addEventListener(
          'pointermove',
          (e) => {
            const rect = el.getBoundingClientRect();
            el.style.setProperty('--mx', `${(e.clientX - rect.left).toFixed(1)}px`);
            el.style.setProperty('--my', `${(e.clientY - rect.top).toFixed(1)}px`);
          },
          { passive: true }
        );
      });
    };

    attachSpotlight('.service-row');
    attachSpotlight('.review-card');
    attachSpotlight('.contacts-panel');
  }

  // --- 12. SERVICES LOOKBOOK FLOATING PREVIEW (DESKTOP ONLY) ---
  const serviceLookbook = document.getElementById('serviceLookbook');
  const serviceLookbookImg = document.getElementById('serviceLookbookImg');
  const servicesTable = document.getElementById('servicesTable');

  if (serviceLookbook && serviceLookbookImg && servicesTable && isFinePointer && !isReducedMotion) {
    let lbTargetX = 0;
    let lbTargetY = 0;
    let lbCurrX = 0;
    let lbCurrY = 0;
    let lbActive = false;
    let lbTicking = false;

    const animateLookbook = () => {
      lbCurrX += (lbTargetX - lbCurrX) * 0.16;
      lbCurrY += (lbTargetY - lbCurrY) * 0.16;
      serviceLookbook.style.transform = `translate3d(${lbCurrX.toFixed(1)}px, ${lbCurrY.toFixed(1)}px, 0)`;

      const dist = Math.abs(lbTargetX - lbCurrX) + Math.abs(lbTargetY - lbCurrY);
      if (lbActive && dist > 0.3) {
        requestAnimationFrame(animateLookbook);
      } else {
        lbTicking = false;
      }
    };

    const placeLookbook = (e) => {
      const clampedX = Math.min(e.clientX + 26, Math.max(16, window.innerWidth - 224));
      const clampedY = Math.max(92, Math.min(e.clientY - 125, Math.max(100, window.innerHeight - 268)));
      lbTargetX = clampedX;
      lbTargetY = clampedY;
      if (!lbActive) {
        lbCurrX = clampedX;
        lbCurrY = clampedY;
      }
    };

    const hideLookbook = () => {
      lbActive = false;
      serviceLookbook.classList.remove('is-visible');
    };

    document.querySelectorAll('.service-row[data-preview-img]').forEach((row) => {
      row.addEventListener('pointerenter', (e) => {
        if (window.innerWidth <= 1024) return;
        const src = row.getAttribute('data-preview-img');
        if (!src) return;
        if (serviceLookbookImg.getAttribute('src') !== src) {
          serviceLookbookImg.setAttribute('src', src);
        }
        placeLookbook(e);
        lbActive = true;
        serviceLookbook.classList.add('is-visible');
        serviceLookbook.style.transform = `translate3d(${lbCurrX.toFixed(1)}px, ${lbCurrY.toFixed(1)}px, 0)`;
      });

      row.addEventListener(
        'pointermove',
        (e) => {
          if (!lbActive || window.innerWidth <= 1024) return;
          placeLookbook(e);
          if (!lbTicking) {
            lbTicking = true;
            requestAnimationFrame(animateLookbook);
          }
        },
        { passive: true }
      );

      row.addEventListener('pointerleave', hideLookbook);
    });

    servicesTable.addEventListener('mouseleave', hideLookbook);
    window.addEventListener('scroll', hideLookbook, { passive: true });
  }

  // --- 13. ONE-CLICK COPY CONTACTS + MINIMALIST TOAST ---
  const copyToast = document.getElementById('copyToast');
  const copyToastText = document.getElementById('copyToastText');
  let toastHideTimer = null;

  const showCopyToast = (message) => {
    if (!copyToast || !copyToastText) return;
    copyToastText.textContent = message;
    copyToast.hidden = false;
    requestAnimationFrame(() => copyToast.classList.add('is-visible'));

    if (toastHideTimer) clearTimeout(toastHideTimer);
    toastHideTimer = setTimeout(() => {
      copyToast.classList.remove('is-visible');
      setTimeout(() => {
        if (!copyToast.classList.contains('is-visible')) {
          copyToast.hidden = true;
        }
      }, 260);
    }, 2400);
  };

  const fallbackCopyText = (text) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand && document.execCommand('copy');
    } catch (_) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  };

  document.querySelectorAll('.btn-copy-contact').forEach((btn) => {
    btn.addEventListener('click', () => {
      const value = btn.getAttribute('data-copy');
      const feedback = btn.getAttribute('data-copy-label') || 'Скопировано';
      if (!value) return;

      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(value)
          .then(() => showCopyToast(feedback))
          .catch(() => {
            if (fallbackCopyText(value)) showCopyToast(feedback);
          });
      } else if (fallbackCopyText(value)) {
        showCopyToast(feedback);
      }
    });
  });

  // --- 14. EDITORIAL PORTRAIT DEPTH IN "ABOUT MASTER" ---
  const aboutFramePhoto = document.querySelector('.about-frame-photo');
  if (aboutFramePhoto && isFinePointer && !isReducedMotion) {
    aboutFramePhoto.addEventListener(
      'pointermove',
      (e) => {
        const rect = aboutFramePhoto.getBoundingClientRect();
        const rx = (e.clientX - rect.left) / rect.width - 0.5;
        const ry = (e.clientY - rect.top) / rect.height - 0.5;
        aboutFramePhoto.style.setProperty('--about-x', `${(rx * 10).toFixed(1)}px`);
        aboutFramePhoto.style.setProperty('--about-y', `${(ry * 10).toFixed(1)}px`);
        aboutFramePhoto.style.setProperty('--about-ix', `${(rx * -6).toFixed(1)}px`);
        aboutFramePhoto.style.setProperty('--about-iy', `${(ry * -6).toFixed(1)}px`);
      },
      { passive: true }
    );

    aboutFramePhoto.addEventListener('mouseleave', () => {
      aboutFramePhoto.style.setProperty('--about-x', '0px');
      aboutFramePhoto.style.setProperty('--about-y', '0px');
      aboutFramePhoto.style.setProperty('--about-ix', '0px');
      aboutFramePhoto.style.setProperty('--about-iy', '0px');
    });
  }
});
