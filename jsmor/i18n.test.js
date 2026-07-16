// jsmor/i18n.test.js
const test = require('node:test');
const assert = require('node:assert');

global.window = {
  translations: {
    it: { 'nav.home': 'Homepage', 'only.it': 'Solo IT' },
    en: { 'nav.home': 'Home' },
    de: { 'nav.home': 'Startseite' },
    fr: { 'nav.home': 'Accueil' }
  }
};
global.document = {
  addEventListener: function () {},
  querySelectorAll: function () { return []; }
};
global.localStorage = (function () {
  var store = {};
  return {
    getItem: function (key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem: function (key, value) {
      store[key] = value;
    }
  };
})();

require('./i18n.js');

test('getStoredLang returns default "it" when nothing is stored', function () {
  assert.strictEqual(window.i18n.getStoredLang(), 'it');
});

test('getStoredLang returns the stored language when it is supported', function () {
  localStorage.setItem('lang', 'fr');
  assert.strictEqual(window.i18n.getStoredLang(), 'fr');
});

test('getStoredLang falls back to default for an unsupported language code', function () {
  localStorage.setItem('lang', 'xx');
  assert.strictEqual(window.i18n.getStoredLang(), 'it');
});

test('resolveText returns the translated string for a supported language', function () {
  assert.strictEqual(window.i18n.resolveText('en', 'nav.home'), 'Home');
});

test('resolveText falls back to Italian when the key is missing in the target language', function () {
  assert.strictEqual(window.i18n.resolveText('en', 'only.it'), 'Solo IT');
});