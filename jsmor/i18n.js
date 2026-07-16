(function () {
  var SUPPORTED = ['it', 'en', 'de', 'fr'];
  var DEFAULT_LANG = 'it';

  function getStoredLang() {
    var stored = localStorage.getItem('lang');
    return SUPPORTED.indexOf(stored) !== -1 ? stored : DEFAULT_LANG;
  }

  function resolveText(lang, key) {
    var dict = window.translations[lang] || {};
    var fallback = window.translations[DEFAULT_LANG] || {};
    return dict[key] !== undefined ? dict[key] : fallback[key];
  }

  function applyLanguage(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var text = resolveText(lang, el.getAttribute('data-i18n'));
      if (text !== undefined) el.textContent = text;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var html = resolveText(lang, el.getAttribute('data-i18n-html'));
      if (html !== undefined) el.innerHTML = html;
    });

    document.querySelectorAll('.lang-switch button').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  function setLanguage(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    localStorage.setItem('lang', lang);
    applyLanguage(lang);
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyLanguage(getStoredLang());
    document.querySelectorAll('.lang-switch button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLanguage(btn.getAttribute('data-lang'));
      });
    });
  });

  window.i18n = {
    getStoredLang: getStoredLang,
    resolveText: resolveText,
    applyLanguage: applyLanguage,
    setLanguage: setLanguage,
    SUPPORTED: SUPPORTED,
    DEFAULT_LANG: DEFAULT_LANG
  };
})();