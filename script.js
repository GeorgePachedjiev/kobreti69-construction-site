document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // 1. Мобилно меню
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Активен линк при скрол
  function updateActiveNav() {
    let currentSection = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 130;
      if (window.scrollY >= top && window.scrollY < top + sec.offsetHeight) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // 3. Филтриране на обекти
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      galleryCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        card.classList.toggle('hidden', filter !== 'all' && category !== filter);
      });
    });
  });

  // 4. Lightbox за снимки
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(triggerEl) {
    const src = triggerEl.getAttribute('data-lightbox');
    const caption = triggerEl.getAttribute('data-caption') || '';
    if (!src || !lightbox) return;

    lightboxImg.src = src;
    lightboxImg.alt = caption;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-lightbox]').forEach((el) => {
    el.addEventListener('click', () => openLightbox(el));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // 5. Избор на услуга от картите
  const serviceSelect = document.getElementById('serviceType');
  document.querySelectorAll('.service-cta').forEach((btn) => {
    btn.addEventListener('click', () => {
      const selected = btn.getAttribute('data-service');
      if (serviceSelect && selected) {
        serviceSelect.value = selected;
      }
      const contactEl = document.getElementById('kontakti');
      if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
    });
  });

 // 6. Изпращане на формата към имейл (стандартен POST без увисване)
  const offerForm = document.getElementById('offerForm');
  const formFeedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');
  const nextUrlInput = document.getElementById('nextUrl');

  // Ако потребителят току-що се е върнал след успешно изпращане
  if (window.location.search.includes('sent=1') && formFeedback) {
    formFeedback.style.color = '#15803d';
    formFeedback.textContent = 'Благодарим Ви! Запитването беше изпратено успешно. Ще се свържем с Вас скоро.';
    window.history.replaceState({}, document.title, window.location.pathname + '#kontakti');
  }

  if (offerForm) {
    offerForm.addEventListener('submit', (e) => {
      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();

      if (!name || !phone) {
        e.preventDefault();
        if (formFeedback) {
          formFeedback.style.color = '#b91c1c';
          formFeedback.textContent = 'Моля, въведете Вашето име и телефон за връзка.';
        }
        return;
      }

      // Задава автоматично текущия адрес на сайта за връщане след изпращане
      if (nextUrlInput) {
        const cleanUrl = window.location.origin + window.location.pathname;
        nextUrlInput.value = `${cleanUrl}?sent=1#kontakti`;
      }

      if (submitBtn) {
        submitBtn.textContent = 'Изпращане...';
      }
    });
  }
});