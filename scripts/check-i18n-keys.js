// scripts/check-i18n-keys.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const filePath = path.join(__dirname, '..', 'jsmor', 'translations.js');
const code = fs.readFileSync(filePath, 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const translations = sandbox.window.translations;
const baseLang = 'it';
const languages = Object.keys(translations);
const baseKeys = Object.keys(translations[baseLang]).sort();

let hasError = false;
for (const lang of languages) {
  if (lang === baseLang) continue;
  const keys = Object.keys(translations[lang]).sort();
  const missing = baseKeys.filter((k) => !keys.includes(k));
  const extra = keys.filter((k) => !baseKeys.includes(k));
  if (missing.length || extra.length) {
    hasError = true;
    console.error(`Language "${lang}" is out of sync with "${baseLang}"`);
    if (missing.length) console.error('  Missing keys:', missing.join(', '));
    if (extra.length) console.error('  Extra keys:', extra.join(', '));
  }
}

if (hasError) {
  process.exit(1);
} else {
  console.log(`OK: all ${languages.length} languages have matching keys (${baseKeys.length} keys each).`);
}