(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.main-nav');
  const transition = document.querySelector('[data-booking-transition]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const consentKey = 'wsrConsentV1';

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 20);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  document.querySelectorAll('.nav-dropdown').forEach((dropdown) => dropdown.removeAttribute('open'));

  const closeMenu = () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menu?.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menu?.classList.toggle('is-open', !open);
    document.body.classList.toggle('menu-open', !open);
  });
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      closeConsent();
    }
  });

  document.querySelectorAll('[data-booking]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const destination = link.href;
      if (reducedMotion || !transition) {
        window.location.assign(destination);
        return;
      }
      closeMenu();
      document.body.classList.add('is-leaving');
      transition.setAttribute('aria-hidden', 'false');
      transition.classList.add('is-active');
      window.setTimeout(() => window.location.assign(destination), 950);
    });
  });

  const revealItems = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 3, 2) * 65}ms`;
      observer.observe(item);
    });
  }

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  document.querySelectorAll('.footer-bottom').forEach((footer) => {
    if (footer.querySelector('a[href="polityka-prywatnosci.html"]')) return;
    const links = document.createElement('span');
    links.className = 'footer-legal-links';
    links.innerHTML = '<a href="polityka-prywatnosci.html">Prywatność</a><a href="polityka-cookies.html">Cookies</a>';
    footer.appendChild(links);
  });

  function readConsent() {
    try {
      const saved = JSON.parse(localStorage.getItem(consentKey));
      if (saved && typeof saved === 'object') return { necessary: true, analytics: Boolean(saved.analytics), marketing: Boolean(saved.marketing), updatedAt: saved.updatedAt || null };
    } catch (_) { /* localStorage może być zablokowany — pokażemy baner ponownie */ }
    return null;
  }

  function saveConsent(analytics, marketing) {
    const consent = { necessary: true, analytics: Boolean(analytics), marketing: Boolean(marketing), updatedAt: new Date().toISOString() };
    try { localStorage.setItem(consentKey, JSON.stringify(consent)); } catch (_) { /* fallback: stan obowiązuje do końca wizyty */ }
    window.dispatchEvent(new CustomEvent('wsr:consent-updated', { detail: consent }));
    closeConsent();
    renderConsentLauncher();
  }

  function createConsentUI() {
    if (document.querySelector('[data-consent-root]')) return;
    const root = document.createElement('div');
    root.dataset.consentRoot = '';
    root.innerHTML = `
      <section class="cookie-banner" data-consent-banner role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-description">
        <div class="cookie-banner-copy"><p class="cookie-kicker">Prywatność na tej stronie</p><h2 id="cookie-title">Ty wybierasz, co działa.</h2><p id="cookie-description">Używamy tylko technologii niezbędnych do działania strony. Opcjonalne statystyki i marketing są obecnie wyłączone. Możesz zmienić wybór w dowolnym momencie.</p><a href="polityka-cookies.html">Dowiedz się więcej</a></div>
        <div class="cookie-banner-actions"><button class="cookie-button cookie-button-primary" type="button" data-consent-accept>Akceptuj wszystkie</button><button class="cookie-button" type="button" data-consent-reject>Tylko niezbędne</button><button class="cookie-settings-link" type="button" data-open-consent>Ustawienia szczegółowe</button></div>
      </section>
      <div class="cookie-backdrop" data-consent-backdrop></div>
      <section class="cookie-modal" data-consent-modal role="dialog" aria-modal="true" aria-labelledby="settings-title" hidden>
        <div class="cookie-modal-card"><button class="cookie-modal-close" type="button" data-close-consent aria-label="Zamknij ustawienia">×</button><p class="cookie-kicker">Ustawienia prywatności</p><h2 id="settings-title">Wybierz własne ustawienia.</h2><p class="cookie-modal-intro">Kategorie opcjonalne są wyłączone domyślnie. Zmiana decyzji jest możliwa w każdej chwili przez przycisk przy dolnej krawędzi strony.</p>
          <div class="consent-choice"><div><strong>Niezbędne</strong><p>Zapewniają bezpieczeństwo i zapamiętują ten wybór.</p></div><span class="consent-always">Zawsze aktywne</span></div>
          <label class="consent-choice consent-toggle"><div><strong>Statystyczne</strong><p>Pomagają zrozumieć, jak odwiedzający korzystają ze strony. Obecnie nieaktywne narzędzie.</p></div><input type="checkbox" data-consent-analytics><span class="toggle-ui" aria-hidden="true"></span></label>
          <label class="consent-choice consent-toggle"><div><strong>Marketingowe</strong><p>Umożliwiają przyszłe mierzenie kampanii lub personalizację reklam. Obecnie nieużywane.</p></div><input type="checkbox" data-consent-marketing><span class="toggle-ui" aria-hidden="true"></span></label>
          <div class="cookie-modal-actions"><button class="cookie-button cookie-button-primary" type="button" data-consent-save>Zapisz wybór</button><a href="polityka-prywatnosci.html">Polityka prywatności</a><a href="polityka-cookies.html">Polityka cookies</a></div>
        </div>
      </section>
      <button class="cookie-launcher" type="button" data-open-consent>Ustawienia cookies</button>`;
    document.body.appendChild(root);
    root.querySelector('[data-consent-accept]').addEventListener('click', () => saveConsent(true, true));
    root.querySelector('[data-consent-reject]').addEventListener('click', () => saveConsent(false, false));
    root.querySelector('[data-consent-save]').addEventListener('click', () => saveConsent(root.querySelector('[data-consent-analytics]').checked, root.querySelector('[data-consent-marketing]').checked));
    root.querySelectorAll('[data-open-consent]').forEach((button) => button.addEventListener('click', openConsent));
    root.querySelector('[data-close-consent]').addEventListener('click', closeConsent);
    root.querySelector('[data-consent-backdrop]').addEventListener('click', closeConsent);
    syncConsentInputs(readConsent());
  }

  function syncConsentInputs(consent) {
    const root = document.querySelector('[data-consent-root]');
    if (!root) return;
    root.querySelector('[data-consent-analytics]').checked = Boolean(consent?.analytics);
    root.querySelector('[data-consent-marketing]').checked = Boolean(consent?.marketing);
  }

  function openConsent() {
    const root = document.querySelector('[data-consent-root]');
    if (!root) return;
    syncConsentInputs(readConsent());
    root.querySelector('[data-consent-banner]').hidden = true;
    root.querySelector('[data-consent-modal]').hidden = false;
    root.querySelector('[data-consent-backdrop]').classList.add('is-visible');
    root.querySelector('[data-consent-modal] h2').focus?.();
  }

  function closeConsent() {
    const root = document.querySelector('[data-consent-root]');
    if (!root) return;
    const modal = root.querySelector('[data-consent-modal]');
    if (modal.hidden) return;
    modal.hidden = true;
    root.querySelector('[data-consent-backdrop]').classList.remove('is-visible');
    if (!readConsent()) root.querySelector('[data-consent-banner]').hidden = false;
  }

  function renderConsentLauncher() {
    const root = document.querySelector('[data-consent-root]');
    if (!root) return;
    const banner = root.querySelector('[data-consent-banner]');
    banner.hidden = Boolean(readConsent());
  }

  createConsentUI();
  document.querySelectorAll('[data-open-consent]').forEach((button) => {
    if (!button.closest('[data-consent-root]')) button.addEventListener('click', openConsent);
  });
  renderConsentLauncher();
})();
