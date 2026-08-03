(() => {
  const config = document.querySelector('[data-consent-config]');
  const banner = document.querySelector('[data-consent-banner]');
  const dialog = document.querySelector('[data-consent-dialog]');
  if (!config || !banner || !dialog) return;

  const storageKey = config.dataset.storageKey || 'faro-consent-v1';
  const version = Number(config.dataset.version) || 1;
  const consentLifetime = 180 * 24 * 60 * 60 * 1000;
  const analyticsId = config.dataset.analyticsId || '';
  const form = dialog.querySelector('[data-consent-form]');
  const analyticsInput = form.elements.analytics;
  const externalInput = form.elements.external;
  let consent = null;
  let analyticsLoaded = false;
  let pendingExternal = [];

  const read = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      const updatedAt = Date.parse(saved?.updatedAt || '');
      const isCurrent = saved?.version === version && Number.isFinite(updatedAt) && Date.now() - updatedAt < consentLifetime;
      return isCurrent ? saved : null;
    } catch (_) {
      return null;
    }
  };

  const eraseAnalyticsCookies = () => {
    const domains = [location.hostname, `.${location.hostname}`, '.faro.fdfont.com', '.fdfont.com'];
    document.cookie.split(';').forEach((entry) => {
      const name = entry.split('=')[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) return;
      domains.forEach((domain) => {
        document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}; SameSite=Lax`;
      });
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    });
  };

  const loadAnalytics = () => {
    if (analyticsLoaded || !analyticsId) return;
    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', analyticsId, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`;
    document.head.append(script);
  };

  const apply = (next, previous = consent) => {
    consent = next;
    banner.hidden = true;
    if (consent.analytics) loadAnalytics();
    else if (previous?.analytics) eraseAnalyticsCookies();
    const revoked = previous && ((previous.analytics && !consent.analytics) || (previous.external && !consent.external));
    if (revoked) window.setTimeout(() => location.reload(), 0);
    if (consent.external && pendingExternal.length) {
      const callbacks = pendingExternal;
      pendingExternal = [];
      callbacks.forEach((callback) => callback());
    }
    document.dispatchEvent(new CustomEvent('faro:consentchange', { detail: { ...consent } }));
  };

  const save = (analytics, external) => {
    const next = {
      version,
      analytics: Boolean(analytics),
      external: Boolean(external),
      updatedAt: new Date().toISOString()
    };
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch (_) {}
    apply(next);
  };

  const openPreferences = () => {
    analyticsInput.checked = Boolean(consent?.analytics);
    externalInput.checked = Boolean(consent?.external);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  };

  document.querySelectorAll('[data-consent-open], [data-consent-configure]').forEach((button) => {
    button.addEventListener('click', openPreferences);
  });
  document.querySelector('[data-consent-essential]')?.addEventListener('click', () => save(false, false));
  document.querySelector('[data-consent-accept]')?.addEventListener('click', () => save(true, true));
  document.querySelector('[data-consent-dialog-essential]')?.addEventListener('click', () => {
    save(false, false);
    dialog.close();
  });
  form.addEventListener('submit', (event) => {
    if (event.submitter?.value !== 'save') return;
    save(analyticsInput.checked, externalInput.checked);
  });

  consent = read();
  if (consent) apply(consent, null);
  else banner.hidden = false;

  window.FaroConsent = {
    allows: (purpose) => Boolean(consent?.[purpose]),
    open: openPreferences,
    requireExternal: (callback) => {
      if (consent?.external) {
        callback();
        return;
      }
      pendingExternal.push(callback);
      openPreferences();
    }
  };
})();
