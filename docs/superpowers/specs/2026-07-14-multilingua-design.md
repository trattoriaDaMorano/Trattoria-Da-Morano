# Multilingua sito Trattoria da Morano — Design

## Obiettivo
Aggiungere al sito la possibilità di visualizzare i contenuti in italiano (default), inglese, tedesco e francese, senza backend e senza duplicare le pagine HTML.

## Scope
Pagine tradotte: `index.html`, `chi_siamo.html`, `ristorante.html`, `menu.html`, `gallery.html` (header e footer comuni inclusi).
Esclusa: `documentazione.html` (documento di project management/tesi, non collegato alla navbar, non rivolto ai clienti).

## Architettura

Il sito è statico e può essere aperto sia via `file://` sia su hosting semplice: `fetch()` di file `.json` esterni fallisce per CORS quando aperto localmente come file. Le traduzioni vengono quindi definite come oggetto JS globale caricato via `<script>`, non tramite JSON caricati a runtime.

**File nuovi:**
- `jsmor/translations.js` — definisce `window.translations = { it: {...}, en: {...}, de: {...}, fr: {...} }`. Chiavi semantiche gerarchiche per sezione, es: `nav.home`, `nav.about`, `home.card1`, `menu.antipasti.title`, `menu.fish.secondi.coregone`, `footer.hours.lunch`.
- `jsmor/i18n.js` — logica di applicazione:
  1. Legge `localStorage.getItem('lang')`; default `'it'` se assente o non tra le 4 lingue supportate.
  2. Su `DOMContentLoaded`, per ogni elemento `[data-i18n]` imposta `textContent = translations[lang][chiave]`; per elementi `[data-i18n-html]` (testi con markup interno tipo `<b>pesce</b>`) imposta `innerHTML` con la stringa tradotta (contenuto sempre nostro, non input utente → nessun rischio XSS).
  3. Aggiorna `document.documentElement.lang` e il contenuto di `<title>` (via `data-i18n` sul tag `title`).
  4. Aggiunge i listener di click alle bandierine: al click, salva la nuova lingua in `localStorage` e riapplica le traduzioni senza reload.
  5. Evidenzia la bandiera attiva aggiungendo la classe `.active`.
  6. Se una chiave manca per una lingua, fa fallback al testo italiano (mai stringa vuota o `undefined` visibile).

**Markup:**
- Attributi `data-i18n="chiave"` (o `data-i18n-html`) aggiunti ai testi traducibili nelle 5 pagine pubbliche: voci di navigazione, titoli, paragrafi descrittivi, tutte le voci del menù (piatti, vini), orari e testi del footer (comune a tutte le pagine).
- Selettore lingua nell'header: 4 bandierine emoji cliccabili (🇮🇹 🇬🇧 🇩🇪 🇫🇷), nessuna immagine necessaria. Posizionate accanto al toggle hamburger; visibili sia in desktop navbar che nel menu mobile aperto. Stile coerente con la palette esistente (`#F2F2F2` su `#17284B`).
- Ogni pagina HTML carica in coda: `<script src="jsmor/translations.js"></script>` poi `<script src="jsmor/i18n.js" defer></script>`, dopo lo `scriptmor.js` esistente.

**CSS:**
- Nuove regole in `cssmor/stylemor.css` per `.lang-switch` (contenitore bandierine) e `.lang-switch button.active` (stato lingua corrente evidenziato, es. leggero contorno o opacità ridotta sulle non attive).

## Contenuto traduzioni

Le traduco io in EN/DE/FR partendo dai testi italiani attuali. Per i nomi di pesce tecnici nel menù (es. **coregone** → EN *whitefish*, DE *Felchen*, FR *corégone*; **lattarini** → EN *sand smelt*, DE *Ährenfisch*, FR *athérine*) uso una resa "turistica/da menù" invece della traduzione ittiologica secca — piatti descritti in modo naturale per un cliente straniero (es. "Fried lake whitefish fillet" invece di una traduzione letterale parola-per-parola).

## Persistenza
La lingua scelta viene salvata in `localStorage` e resta valida su tutte le pagine e visite successive, finché l'utente non la cambia esplicitamente.

## Fuori scope
- Traduzione di `documentazione.html`.
- Rilevamento automatico della lingua del browser (si parte sempre da IT o dall'ultima scelta salvata, mai da auto-detect).
- Un backend/CMS per gestire le traduzioni: restano hardcoded in `translations.js`.