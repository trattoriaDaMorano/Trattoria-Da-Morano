# Multilingua sito Trattoria da Morano Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aggiungere selezione lingua (IT/EN/DE/FR) al sito statico, senza backend, con persistenza in `localStorage`.

**Architecture:** Un file dati `jsmor/translations.js` espone `window.translations` con le stringhe nelle 4 lingue; un motore `jsmor/i18n.js` applica il testo agli elementi `[data-i18n]`/`[data-i18n-html]` a runtime e gestisce il click sulle bandierine. Nessun fetch di JSON esterni (evita problemi CORS con `file://`).

**Tech Stack:** HTML/CSS/JS vanilla, nessun bundler. Test di logica pura con il test runner integrato di Node (`node --test`, richiede Node ≥ 18). Verifica di coerenza chiavi con uno script Node standalone.

## Global Constraints

- Nessuna dipendenza esterna (npm) da aggiungere: usare solo `node:test`/`node:assert` built-in e `fs`/`path`/`vm` built-in.
- Nomi dei vini nel menù restano non tradotti (nomi propri/denominazioni), solo le intestazioni di sezione (Bianchi/Rossi/Bollicine) sono tradotte.
- `documentazione.html` resta fuori scope, non va toccato.
- Lingua di default: `it`. Nessun auto-detect della lingua del browser.
- Ogni pagina pubblica (`index.html`, `chi_siamo.html`, `ristorante.html`, `menu.html`, `gallery.html`) deve caricare `jsmor/translations.js` poi `jsmor/i18n.js` (entrambi con `defer`), subito dopo il tag `<script src="scriptmor.js" defer></script>` esistente.

---

### Task 1: Dati di traduzione + verifica coerenza chiavi

**Files:**
- Create: `jsmor/translations.js`
- Create: `scripts/check-i18n-keys.js`

**Interfaces:**
- Produces: `window.translations` (oggetto globale) = `{ it: {...}, en: {...}, de: {...}, fr: {...} }`, ogni sotto-oggetto con le stesse chiavi stringa piatte (es. `"nav.home"`).

- [ ] **Step 1: Creare `jsmor/translations.js` con il dizionario completo**

```javascript
window.translations = {
  it: {
    "nav.home": "Homepage",
    "nav.about": "Chi siamo",
    "nav.restaurant": "Ristorante",
    "nav.menu": "Menù",
    "nav.gallery": "Gallery",

    "footer.contact": "Contattaci",
    "footer.phoneLabel": "Tel.:",
    "footer.location": "Dove siamo",
    "footer.maplink": "Link Google Maps",
    "footer.hours": "Orari",
    "footer.lunch": "Pranzo: 12:30-14:30",
    "footer.dinner": "Cena: 19:30-22:00",
    "footer.closedDay": "Giorno di chiusura: giovedì",
    "footer.augustNote": "(Agosto aperti tutti i giorni)",

    "home.slogan": "Per chi ama le proprie origini",
    "home.card1": "Cinque generazioni di tratto-ristoratori, cinque generazioni di passione, dedizione e amore per il territorio...<br><a href=\"chi_siamo.html\"><b>Scopri di più</b></a>",
    "home.card2": "Una location estiva mozzafiato, un posto dove il rispetto per il tempo che passa non viene mai meno...<br><a href=\"ristorante.html\"><b>Scopri di più</b></a>",
    "home.card3": "Piatti di mare e lago accompagnati da vini regionali e la volontà di rispettare i sapori di una volta...<br><a href=\"menu.html\"><b>Scopri di più</b></a>",

    "about.gen1.year": "Prima generazione",
    "about.gen1.text": "Pietro Mocini, più noto come Pietro di Morano, è stato il primo gestore del più antico ristorante che sorge sulle rive del lago. In origine era un pescatore di professione ma, dotato di grande talento anche in cucina, decide di aprire un piccolo locale immerso nei canneti del lago. In quel momento, verso i primi del Novecento, iniziò la storia della trattoria Da Morano.",
    "about.gen2.year": "Seconda generazione",
    "about.gen2.text": "A Pietro subentra il figlio Cesare. Grande appassionato di caccia, introduce nel ristorante anche piatti di carne per ingolosire i colleghi cacciatori e invitarli a rifocillarsi dopo una dura giornata venatoria.",
    "about.gen3.year": "Terza generazione",
    "about.gen3.text": "Il figlio Ubaldo prende in mano le redini della trattoria e decide di allargare il locale costruendo una veranda a vetri affacciata sul lago, ideale per le giornate di tramontana che caratterizzano il paesaggio lacustre. In lui si uniscono la passione per la caccia del padre Cesare e per la pesca del nonno Pietro. Grazie alla sua rinomata convivialità - ricordano i suoi più cari amici - l'esperienza culinaria era sempre accompagnata da quella umana.",
    "about.gen4.year": "Quarta generazione",
    "about.gen4.text": "L'amore e la dedizione verso il proprio lavoro portano Ubaldo a presenziare tra i tavoli della trattoria fino alla vecchiaia. Ma il ristorante aveva già trovato da tempo chi poteva prendersene cura: il figlio Pietro. Nato e cresciuto nella trattoria di famiglia, grazie a uno spirito infaticabile e un'esperienza fuori dal comune ancora oggi continua a lavorare con passione e serietà. Ma questo non sarebbe possibile se non avesse accanto Claudia (la nostra capo-cuoca), compagna sia nel lavoro che nella vita.",
    "about.gen5.year": "Quinta generazione",
    "about.gen5.text": "Giunti al termine di questo viaggio incontriamo il presente e il futuro della trattoria da Morano: Riccardo e Alessandro. Figli di Pietro e Claudia, si impegnano ogni giorno affinché l'importante eredità di famiglia possa continuare a regalare gioia e piacere ai clienti - o meglio, ai commensali - che ancora oggi rendono la Trattoria da Morano una tappa gradita a chi visita la Tuscia.",

    "restaurant.heading": "Tre locali, tre storie, tre modi di vivere il pranzo e la cena",
    "restaurant.terrace": "La <b>terrazza</b> è la parte del ristorante più ambita durante la stagione estiva, offre uno scorcio del lago di Bolsena mozzafiato. Si tratta del primo locale costruito durante la lunga storia della trattoria Da Morano. Il tramonto visto dalla terrazza di Morano è un'esperienza da vivere. Incantevole.",
    "restaurant.veranda": "La <b>veranda</b> con le sue ampie ed eleganti vetrate consente di godere dello spettacolo del lago durante le tipiche giornate di tramontana che caratterizzano il paesaggio circostante. Ideale per le miti giornate autunnali e primaverili. Luminosa.",
    "restaurant.rooms": "Le fredde giornate invernali rendono il lago più freddo ma non meno seducente. Il ristorante non solo si affaccia sul lago, ma offre anche la possibilità di pranzare in due <b>sale interne</b> dagli stili diversi per tenere unito passato e presente. Classico e moderno.",
    "restaurant.gallerylink": "Sfoglia la nostra gallery",

    "gallery.terrace": "La terrazza",
    "gallery.veranda": "La veranda",
    "gallery.rooms": "Le sale interne",

    "menu.taste.heading": "Sapori della Tuscia",
    "menu.taste.text": "La cucina propone un menù soprattutto a base di <b>pesce</b>, con particolare attenzione al nostro amato pesce di <b>lago</b>; tra i primi di lago troviamo le <b>farfalle al coregone</b>, tra i secondi la golosa frittura di <b>lattarini</b>, il saporito <b>filetto di persico fritto/dorato</b> e, infine, <b>coregone</b> e <b>anguilla</b> alla brace. Il pesce di lago proposto è rigorosamente <b>pescato</b> e non di allevamento affinché i clienti possano gustare i veri sapori del lago di Bolsena. Ogni buon pasto merita di essere accompagnato da un buon <b>vino</b>. Proponiamo un'ampia scelta di vini bianchi e rossi riponendo grande attenzione nella scelta dei <b>vini regionali</b>, grande vanto del nostro territorio. Infine, la carta dei <b>dessert</b> propone dolci <b>fatti in casa</b> tra cui la storica <b>zuppa inglese di Morano</b>, un dolce tradizionale che merita di essere riproposto nel tempo.",

    "menu.proposal.fish": "La nostra proposta di pesce",
    "menu.proposal.meat": "La nostra proposta di carne",
    "menu.proposal.wine": "I vini del territorio",
    "menu.proposal.pizza": "...ma anche pizza!",

    "menu.section.antipasti": "Antipasti",
    "menu.section.primi": "Primi",
    "menu.section.secondi": "Secondi",
    "menu.section.contorni": "Contorni",
    "menu.section.dolci": "Dolci",

    "menu.wine.bianchi": "Bianchi",
    "menu.wine.rossi": "Rossi",
    "menu.wine.bollicine": "Bollicine",

    "menu.popup.seasonal": "Prodotto disponibile a secondo della stagione",

    "menu.fish.antipasti.misto": "Antipasto misto di pesce",
    "menu.fish.antipasti.insalata": "Insalata di mare",
    "menu.fish.antipasti.cozze": "Cozze e vongole",
    "menu.fish.antipasti.alici": "Alici marinate",

    "menu.fish.primi.farfalle": "Farfalle al coregone",
    "menu.fish.primi.zuppa": "Zuppa di pesce di lago",
    "menu.fish.primi.vongole": "Spaghetti alle vongole",
    "menu.fish.primi.pescatora": "Spaghetti alla pescatora o scoglio",
    "menu.fish.primi.risotto": "Risotto alla marinara",
    "menu.fish.primi.gnocchetti": "Gnocchetti alla crema di scampi",
    "menu.fish.primi.ravioli": "Ravioli ripieni di spigola e crostacei alla crema di scampi",

    "menu.fish.secondi.coregone": "Coregone alla brace",
    "menu.fish.secondi.anguilla": "Anguilla alla brace",
    "menu.fish.secondi.persico": "Filetti di persico fritti-dorati",
    "menu.fish.secondi.lattarini": "Lattarini fritti-dorati",
    "menu.fish.secondi.scampi": "Scampi-Gamberoni alla brace",
    "menu.fish.secondi.orata": "Orata alla brace/spigola",
    "menu.fish.secondi.sogliola": "Sogliola alla brace",
    "menu.fish.secondi.gamberoni": "Gamberoni alla brace",
    "menu.fish.secondi.grigliata": "Grigliata mista alla brace",
    "menu.fish.secondi.calamari": "Calamari e gamberi fritti",

    "menu.contorni.patatine": "Patatine fritte",
    "menu.contorni.insalata": "Insalata mista",
    "menu.contorni.grigliate": "Verdure grigliate",
    "menu.contorni.agro": "Verdure di stagione all'agro",
    "menu.contorni.saltate": "Verdure di stagione saltate in padella",

    "menu.dolci.zuppainglese": "Zuppa inglese",
    "menu.dolci.pannacotta": "Panna cotta",
    "menu.dolci.pistacchio": "Mousse al pistacchio",
    "menu.dolci.tartufobianco": "Tartufo bianco",
    "menu.dolci.tartufonero": "Tartufo nero",
    "menu.dolci.sorbetto": "Sorbetto al limone",
    "menu.dolci.frutta": "Frutta di stagione",

    "menu.meat.antipasti.italiana": "Antipasto all'italiana",
    "menu.meat.primi.fettuccine": "Fettuccine al ragù",
    "menu.meat.primi.ombrichelli": "Ombrichelli all'amatriciana",
    "menu.meat.secondi.vitella": "Bistecca di vitella alla brace",
    "menu.meat.secondi.maiale": "Bistecca di maiale alla brace",
    "menu.meat.secondi.arrosto": "Arrosto misto alla brace",
    "menu.meat.secondi.salsiccia": "Salsiccia alla brace",
    "menu.meat.secondi.pollo": "Pollo alla brace (diavola)",

    "menu.pizza.text": "Dal 2015 abbiamo deciso di offrire ai nostri clienti la possibilità di mangiare anche un'ottima e sfiziosa <b>pizza</b> sulle rive del lago di Bolsena. Disponiamo di un nuovo forno a legna gestito dal nostro capo-pizzaiolo e titolare Alessandro.<br>La nostra pizzeria è aperta a cena:<br>tutti i giorni durante la stagione estiva; venerdì, sabato e domenica durante gli altri periodi dell'anno."
  },
  en: {
    "nav.home": "Home",
    "nav.about": "About us",
    "nav.restaurant": "Restaurant",
    "nav.menu": "Menu",
    "nav.gallery": "Gallery",

    "footer.contact": "Contact us",
    "footer.phoneLabel": "Phone:",
    "footer.location": "Where we are",
    "footer.maplink": "Google Maps link",
    "footer.hours": "Opening hours",
    "footer.lunch": "Lunch: 12:30 pm - 2:30 pm",
    "footer.dinner": "Dinner: 7:30 pm - 10:00 pm",
    "footer.closedDay": "Closed on Thursdays",
    "footer.augustNote": "(Open every day in August)",

    "home.slogan": "For those who love their roots",
    "home.card1": "Five generations of trattoria keepers, five generations of passion, dedication and love for this land...<br><a href=\"chi_siamo.html\"><b>Discover more</b></a>",
    "home.card2": "A breathtaking summer setting, a place where respect for the passing of time never fades...<br><a href=\"ristorante.html\"><b>Discover more</b></a>",
    "home.card3": "Sea and lake dishes paired with regional wines, always staying true to the flavours of the past...<br><a href=\"menu.html\"><b>Discover more</b></a>",

    "about.gen1.year": "First generation",
    "about.gen1.text": "Pietro Mocini, better known as Pietro di Morano, was the first keeper of the oldest restaurant on the shores of the lake. He was originally a fisherman by trade, but gifted with a great talent in the kitchen too, he decided to open a small place tucked among the lake's reed beds. It was then, around the early 1900s, that the story of the Trattoria Da Morano began.",
    "about.gen2.year": "Second generation",
    "about.gen2.text": "Pietro was succeeded by his son Cesare. A passionate hunter, he introduced meat dishes to the restaurant as well, to tempt his fellow hunters and welcome them for a hearty meal after a long day in the field.",
    "about.gen3.year": "Third generation",
    "about.gen3.text": "His son Ubaldo took over the reins of the trattoria and decided to expand it, building a glass veranda overlooking the lake, perfect for the windy days that shape the landscape here. In him, his father Cesare's passion for hunting and his grandfather Pietro's love of fishing came together. Thanks to his renowned conviviality - as his closest friends still recall - the culinary experience always came paired with a warm, human one.",
    "about.gen4.year": "Fourth generation",
    "about.gen4.text": "His love and dedication to the job kept Ubaldo among the tables of the trattoria well into old age. But the restaurant had long since found someone else to look after it: his son Pietro. Born and raised in the family trattoria, thanks to his tireless spirit and outstanding experience he still works today with passion and dedication. None of this would be possible, though, without Claudia (our head chef) by his side, his partner both at work and in life.",
    "about.gen5.year": "Fifth generation",
    "about.gen5.text": "At the end of this journey we meet the present and future of the Trattoria da Morano: Riccardo and Alessandro. Sons of Pietro and Claudia, they work hard every day so that this important family legacy can go on bringing joy and pleasure to guests - or rather, to fellow diners - who still make the Trattoria da Morano a welcome stop for anyone visiting the Tuscia area.",

    "restaurant.heading": "Three rooms, three stories, three ways to experience lunch and dinner",
    "restaurant.terrace": "The <b>terrace</b> is the most sought-after part of the restaurant during summer, offering a breathtaking view over Lake Bolsena. It's the very first room built in the long history of the Trattoria Da Morano. Watching the sunset from Morano's terrace is an experience not to be missed. Enchanting.",
    "restaurant.veranda": "The <b>veranda</b>, with its wide and elegant windows, lets you enjoy the lake's spectacle even on the typically windy days that shape the surrounding landscape. Perfect for the mild autumn and spring days. Bright.",
    "restaurant.rooms": "Cold winter days make the lake colder, but no less captivating. The restaurant not only overlooks the lake, but also offers two <b>indoor dining rooms</b> with different styles, bringing past and present together. Classic and modern.",
    "restaurant.gallerylink": "Browse our gallery",

    "gallery.terrace": "The terrace",
    "gallery.veranda": "The veranda",
    "gallery.rooms": "The indoor rooms",

    "menu.taste.heading": "Flavours of the Tuscia",
    "menu.taste.text": "Our kitchen offers a menu built mainly around <b>fish</b>, with special attention to our beloved <b>lake</b> fish; among the lake first courses you'll find <b>butterfly pasta with whitefish</b>, among the mains the delicious fried <b>sand smelts</b>, the flavourful <b>fried/pan-seared perch fillet</b> and, finally, grilled <b>whitefish</b> and <b>eel</b>. All our lake fish is strictly <b>wild-caught</b>, never farmed, so guests can taste the true flavours of Lake Bolsena. Every good meal deserves a good <b>wine</b>. We offer a wide selection of white and red wines, paying particular attention to <b>regional wines</b>, a great pride of our land. Finally, our dessert menu features <b>homemade</b> sweets, including the historic <b>Morano-style zuppa inglese</b>, a traditional dessert well worth keeping alive.",

    "menu.proposal.fish": "Our fish menu",
    "menu.proposal.meat": "Our meat menu",
    "menu.proposal.wine": "Local wines",
    "menu.proposal.pizza": "...but also pizza!",

    "menu.section.antipasti": "Starters",
    "menu.section.primi": "First courses",
    "menu.section.secondi": "Main courses",
    "menu.section.contorni": "Side dishes",
    "menu.section.dolci": "Desserts",

    "menu.wine.bianchi": "White wines",
    "menu.wine.rossi": "Red wines",
    "menu.wine.bollicine": "Sparkling wines",

    "menu.popup.seasonal": "Available depending on the season",

    "menu.fish.antipasti.misto": "Mixed fish starter",
    "menu.fish.antipasti.insalata": "Seafood salad",
    "menu.fish.antipasti.cozze": "Mussels and clams",
    "menu.fish.antipasti.alici": "Marinated anchovies",

    "menu.fish.primi.farfalle": "Butterfly pasta with whitefish",
    "menu.fish.primi.zuppa": "Lake fish soup",
    "menu.fish.primi.vongole": "Spaghetti with clams",
    "menu.fish.primi.pescatora": "Spaghetti fisherman's style or 'scoglio'",
    "menu.fish.primi.risotto": "Seafood risotto",
    "menu.fish.primi.gnocchetti": "Small gnocchi with scampi cream",
    "menu.fish.primi.ravioli": "Ravioli filled with sea bass and shellfish in scampi cream",

    "menu.fish.secondi.coregone": "Grilled whitefish",
    "menu.fish.secondi.anguilla": "Grilled eel",
    "menu.fish.secondi.persico": "Fried/pan-seared perch fillets",
    "menu.fish.secondi.lattarini": "Fried/golden sand smelts",
    "menu.fish.secondi.scampi": "Grilled scampi and prawns",
    "menu.fish.secondi.orata": "Grilled sea bream/sea bass",
    "menu.fish.secondi.sogliola": "Grilled sole",
    "menu.fish.secondi.gamberoni": "Grilled prawns",
    "menu.fish.secondi.grigliata": "Mixed grill",
    "menu.fish.secondi.calamari": "Fried squid and shrimp",

    "menu.contorni.patatine": "French fries",
    "menu.contorni.insalata": "Mixed salad",
    "menu.contorni.grigliate": "Grilled vegetables",
    "menu.contorni.agro": "Seasonal vegetables with lemon and oil",
    "menu.contorni.saltate": "Seasonal vegetables sautéed in the pan",

    "menu.dolci.zuppainglese": "Zuppa inglese (Italian trifle)",
    "menu.dolci.pannacotta": "Panna cotta",
    "menu.dolci.pistacchio": "Pistachio mousse",
    "menu.dolci.tartufobianco": "White chocolate tartufo",
    "menu.dolci.tartufonero": "Dark chocolate tartufo",
    "menu.dolci.sorbetto": "Lemon sorbet",
    "menu.dolci.frutta": "Seasonal fruit",

    "menu.meat.antipasti.italiana": "Italian-style starter",
    "menu.meat.primi.fettuccine": "Fettuccine with ragù",
    "menu.meat.primi.ombrichelli": "Ombrichelli pasta all'amatriciana",
    "menu.meat.secondi.vitella": "Grilled veal steak",
    "menu.meat.secondi.maiale": "Grilled pork steak",
    "menu.meat.secondi.arrosto": "Mixed grilled roast",
    "menu.meat.secondi.salsiccia": "Grilled sausage",
    "menu.meat.secondi.pollo": "Grilled chicken (diavola style)",

    "menu.pizza.text": "Since 2015 we've offered our guests the chance to enjoy a delicious <b>pizza</b> right on the shores of Lake Bolsena too. We have a new wood-fired oven run by our head pizza chef and owner Alessandro.<br>Our pizzeria is open for dinner:<br>every day during the summer season; Friday, Saturday and Sunday during the rest of the year."
  },
  de: {
    "nav.home": "Startseite",
    "nav.about": "Über uns",
    "nav.restaurant": "Restaurant",
    "nav.menu": "Speisekarte",
    "nav.gallery": "Galerie",

    "footer.contact": "Kontakt",
    "footer.phoneLabel": "Tel.:",
    "footer.location": "Wo wir sind",
    "footer.maplink": "Google-Maps-Link",
    "footer.hours": "Öffnungszeiten",
    "footer.lunch": "Mittagessen: 12:30-14:30 Uhr",
    "footer.dinner": "Abendessen: 19:30-22:00 Uhr",
    "footer.closedDay": "Ruhetag: Donnerstag",
    "footer.augustNote": "(Im August täglich geöffnet)",

    "home.slogan": "Für alle, die ihre Wurzeln lieben",
    "home.card1": "Fünf Generationen von Gastwirten, fünf Generationen voller Leidenschaft, Hingabe und Liebe zu unserer Heimat...<br><a href=\"chi_siamo.html\"><b>Mehr erfahren</b></a>",
    "home.card2": "Ein atemberaubender Sommerort, an dem der Respekt vor der vergehenden Zeit nie nachlässt...<br><a href=\"ristorante.html\"><b>Mehr erfahren</b></a>",
    "home.card3": "Gerichte aus Meer und See, begleitet von regionalen Weinen, stets den Geschmäckern von einst treu...<br><a href=\"menu.html\"><b>Mehr erfahren</b></a>",

    "about.gen1.year": "Erste Generation",
    "about.gen1.text": "Pietro Mocini, besser bekannt als Pietro di Morano, war der erste Wirt des ältesten Restaurants am Ufer des Sees. Ursprünglich war er von Beruf Fischer, doch mit großem Talent auch in der Küche beschloss er, ein kleines Lokal mitten im Schilf des Sees zu eröffnen. So begann Anfang des 20. Jahrhunderts die Geschichte der Trattoria Da Morano.",
    "about.gen2.year": "Zweite Generation",
    "about.gen2.text": "Pietro folgte sein Sohn Cesare. Als leidenschaftlicher Jäger führte er auch Fleischgerichte ein, um seine Jagdkollegen zu verwöhnen und sie nach einem langen Jagdtag zu einer stärkenden Mahlzeit einzuladen.",
    "about.gen3.year": "Dritte Generation",
    "about.gen3.text": "Sein Sohn Ubaldo übernahm die Führung der Trattoria und beschloss, das Lokal zu erweitern: Er baute eine verglaste Veranda mit Seeblick, ideal für die für diese Landschaft typischen windigen Tage. In ihm vereinten sich die Jagdleidenschaft seines Vaters Cesare und die Angelleidenschaft seines Großvaters Pietro. Dank seiner bekannten Geselligkeit - so erinnern sich seine engsten Freunde - war das kulinarische Erlebnis stets von einem menschlichen begleitet.",
    "about.gen4.year": "Vierte Generation",
    "about.gen4.text": "Aus Liebe und Hingabe zu seiner Arbeit stand Ubaldo bis ins hohe Alter zwischen den Tischen der Trattoria. Doch das Restaurant hatte längst jemanden gefunden, der sich darum kümmern konnte: seinen Sohn Pietro. Geboren und aufgewachsen in der Familientrattoria, arbeitet er dank seines unermüdlichen Geistes und seiner außergewöhnlichen Erfahrung noch heute mit Leidenschaft und Ernsthaftigkeit. Das wäre jedoch nicht möglich ohne Claudia (unsere Chefköchin) an seiner Seite, seine Partnerin bei der Arbeit wie im Leben.",
    "about.gen5.year": "Fünfte Generation",
    "about.gen5.text": "Am Ende dieser Reise begegnen wir der Gegenwart und Zukunft der Trattoria da Morano: Riccardo und Alessandro. Als Söhne von Pietro und Claudia setzen sie sich jeden Tag dafür ein, dass dieses wichtige Familienerbe weiterhin Freude und Genuss für die Gäste - oder besser gesagt, die Tischgenossen - bereithält, die die Trattoria da Morano noch heute zu einem beliebten Ziel für Besucher der Tuscia machen.",

    "restaurant.heading": "Drei Räume, drei Geschichten, drei Arten, Mittag- und Abendessen zu erleben",
    "restaurant.terrace": "Die <b>Terrasse</b> ist während der Sommersaison der begehrteste Bereich des Restaurants und bietet einen atemberaubenden Blick auf den Bolsenasee. Es ist der allererste Raum, der in der langen Geschichte der Trattoria Da Morano erbaut wurde. Der Sonnenuntergang von der Terrasse aus ist ein Erlebnis, das man sich nicht entgehen lassen sollte. Bezaubernd.",
    "restaurant.veranda": "Die <b>Veranda</b> mit ihren großzügigen, eleganten Fensterfronten ermöglicht es, das Schauspiel des Sees auch an den für diese Landschaft typischen windigen Tagen zu genießen. Ideal für milde Herbst- und Frühlingstage. Lichtdurchflutet.",
    "restaurant.rooms": "Die kalten Wintertage machen den See kälter, aber nicht weniger reizvoll. Das Restaurant blickt nicht nur auf den See, sondern bietet auch zwei <b>Innenräume</b> in unterschiedlichen Stilen, die Vergangenheit und Gegenwart vereinen. Klassisch und modern.",
    "restaurant.gallerylink": "Unsere Galerie durchstöbern",

    "gallery.terrace": "Die Terrasse",
    "gallery.veranda": "Die Veranda",
    "gallery.rooms": "Die Innenräume",

    "menu.taste.heading": "Geschmäcker der Tuscia",
    "menu.taste.text": "Unsere Küche bietet eine Speisekarte, die vor allem auf <b>Fisch</b> setzt, mit besonderem Augenmerk auf unseren geliebten <b>Seefisch</b>; bei den ersten Gängen finden Sie <b>Schmetterlingsnudeln mit Felchen</b>, bei den Hauptgängen die köstlichen frittierten <b>Ährenfische</b>, das schmackhafte <b>gebratene/goldbraune Flussbarschfilet</b> und schließlich gegrillte <b>Felchen</b> und <b>Aal</b>. Der angebotene Seefisch stammt ausschließlich aus <b>Wildfang</b> und nicht aus Zucht, damit die Gäste den wahren Geschmack des Bolsenasees genießen können. Jede gute Mahlzeit verdient einen guten <b>Wein</b>. Wir bieten eine große Auswahl an Weiß- und Rotweinen mit besonderem Fokus auf <b>regionale Weine</b>, ein großer Stolz unserer Region. Schließlich bietet die Dessertkarte <b>hausgemachte</b> Süßspeisen, darunter die traditionsreiche <b>Zuppa Inglese von Morano</b>, ein traditionelles Dessert, das es verdient, immer wieder serviert zu werden.",

    "menu.proposal.fish": "Unser Fischangebot",
    "menu.proposal.meat": "Unser Fleischangebot",
    "menu.proposal.wine": "Weine der Region",
    "menu.proposal.pizza": "...aber auch Pizza!",

    "menu.section.antipasti": "Vorspeisen",
    "menu.section.primi": "Erste Gänge",
    "menu.section.secondi": "Hauptgerichte",
    "menu.section.contorni": "Beilagen",
    "menu.section.dolci": "Desserts",

    "menu.wine.bianchi": "Weißweine",
    "menu.wine.rossi": "Rotweine",
    "menu.wine.bollicine": "Schaumweine",

    "menu.popup.seasonal": "Je nach Saison verfügbar",

    "menu.fish.antipasti.misto": "Gemischte Fischvorspeise",
    "menu.fish.antipasti.insalata": "Meeresfrüchtesalat",
    "menu.fish.antipasti.cozze": "Muscheln und Venusmuscheln",
    "menu.fish.antipasti.alici": "Marinierte Sardellen",

    "menu.fish.primi.farfalle": "Schmetterlingsnudeln mit Felchen",
    "menu.fish.primi.zuppa": "Seefischsuppe",
    "menu.fish.primi.vongole": "Spaghetti mit Venusmuscheln",
    "menu.fish.primi.pescatora": "Spaghetti nach Fischerart oder 'Scoglio'",
    "menu.fish.primi.risotto": "Risotto mit Meeresfrüchten",
    "menu.fish.primi.gnocchetti": "Gnocchetti mit Scampi-Creme",
    "menu.fish.primi.ravioli": "Ravioli gefüllt mit Wolfsbarsch und Krustentieren in Scampi-Creme",

    "menu.fish.secondi.coregone": "Gegrillte Felchen",
    "menu.fish.secondi.anguilla": "Gegrillter Aal",
    "menu.fish.secondi.persico": "Gebratene/goldbraune Flussbarschfilets",
    "menu.fish.secondi.lattarini": "Frittierte/goldbraune Ährenfische",
    "menu.fish.secondi.scampi": "Gegrillte Scampi und Garnelen",
    "menu.fish.secondi.orata": "Gegrillte Dorade/Wolfsbarsch",
    "menu.fish.secondi.sogliola": "Gegrillte Seezunge",
    "menu.fish.secondi.gamberoni": "Gegrillte Garnelen",
    "menu.fish.secondi.grigliata": "Gemischter Grillteller",
    "menu.fish.secondi.calamari": "Frittierte Calamari und Garnelen",

    "menu.contorni.patatine": "Pommes frites",
    "menu.contorni.insalata": "Gemischter Salat",
    "menu.contorni.grigliate": "Gegrilltes Gemüse",
    "menu.contorni.agro": "Saisonales Gemüse mit Zitrone und Öl",
    "menu.contorni.saltate": "In der Pfanne geschwenktes Saisongemüse",

    "menu.dolci.zuppainglese": "Zuppa Inglese (italienisches Trifle)",
    "menu.dolci.pannacotta": "Panna cotta",
    "menu.dolci.pistacchio": "Pistazienmousse",
    "menu.dolci.tartufobianco": "Weißes Schokoladen-Tartufo",
    "menu.dolci.tartufonero": "Dunkles Schokoladen-Tartufo",
    "menu.dolci.sorbetto": "Zitronensorbet",
    "menu.dolci.frutta": "Saisonales Obst",

    "menu.meat.antipasti.italiana": "Vorspeise nach italienischer Art",
    "menu.meat.primi.fettuccine": "Fettuccine mit Ragù",
    "menu.meat.primi.ombrichelli": "Ombrichelli-Nudeln nach Amatriciana-Art",
    "menu.meat.secondi.vitella": "Gegrilltes Kalbssteak",
    "menu.meat.secondi.maiale": "Gegrilltes Schweinesteak",
    "menu.meat.secondi.arrosto": "Gemischter Grillbraten",
    "menu.meat.secondi.salsiccia": "Gegrillte Wurst",
    "menu.meat.secondi.pollo": "Gegrilltes Hähnchen (Diavola-Art)",

    "menu.pizza.text": "Seit 2015 bieten wir unseren Gästen auch die Möglichkeit, eine köstliche <b>Pizza</b> direkt am Ufer des Bolsenasees zu genießen. Wir verfügen über einen neuen Holzofen, der von unserem Chef-Pizzabäcker und Inhaber Alessandro betrieben wird.<br>Unsere Pizzeria ist abends geöffnet:<br>täglich während der Sommersaison; freitags, samstags und sonntags in den übrigen Monaten."
  },
  fr: {
    "nav.home": "Accueil",
    "nav.about": "Qui sommes-nous",
    "nav.restaurant": "Restaurant",
    "nav.menu": "Menu",
    "nav.gallery": "Galerie",

    "footer.contact": "Contactez-nous",
    "footer.phoneLabel": "Tél. :",
    "footer.location": "Où nous trouver",
    "footer.maplink": "Lien Google Maps",
    "footer.hours": "Horaires",
    "footer.lunch": "Déjeuner : 12h30-14h30",
    "footer.dinner": "Dîner : 19h30-22h00",
    "footer.closedDay": "Jour de fermeture : jeudi",
    "footer.augustNote": "(Ouvert tous les jours en août)",

    "home.slogan": "Pour ceux qui aiment leurs racines",
    "home.card1": "Cinq générations d'aubergistes, cinq générations de passion, de dévouement et d'amour pour notre terroir...<br><a href=\"chi_siamo.html\"><b>En savoir plus</b></a>",
    "home.card2": "Un cadre estival à couper le souffle, un lieu où le respect du temps qui passe ne faiblit jamais...<br><a href=\"ristorante.html\"><b>En savoir plus</b></a>",
    "home.card3": "Des plats de mer et de lac accompagnés de vins régionaux, fidèles aux saveurs d'autrefois...<br><a href=\"menu.html\"><b>En savoir plus</b></a>",

    "about.gen1.year": "Première génération",
    "about.gen1.text": "Pietro Mocini, plus connu sous le nom de Pietro di Morano, fut le premier tenancier du plus ancien restaurant des rives du lac. À l'origine pêcheur de métier, mais doté d'un grand talent en cuisine, il décida d'ouvrir un petit établissement niché dans les roseaux du lac. C'est ainsi, au début du XXe siècle, que commença l'histoire de la trattoria Da Morano.",
    "about.gen2.year": "Deuxième génération",
    "about.gen2.text": "À Pietro succéda son fils Cesare. Grand passionné de chasse, il introduisit aussi des plats de viande pour régaler ses compagnons chasseurs et les accueillir après une longue journée de chasse.",
    "about.gen3.year": "Troisième génération",
    "about.gen3.text": "Son fils Ubaldo prit les rênes de la trattoria et décida de l'agrandir en construisant une véranda vitrée donnant sur le lac, idéale pour les journées de tramontane qui caractérisent ce paysage lacustre. En lui se rejoignaient la passion de la chasse de son père Cesare et celle de la pêche de son grand-père Pietro. Grâce à sa convivialité légendaire - comme s'en souviennent encore ses amis les plus proches - l'expérience culinaire était toujours accompagnée d'une expérience humaine.",
    "about.gen4.year": "Quatrième génération",
    "about.gen4.text": "L'amour et le dévouement pour son travail amenèrent Ubaldo à rester parmi les tables de la trattoria jusqu'à un âge avancé. Mais le restaurant avait depuis longtemps trouvé quelqu'un pour en prendre soin : son fils Pietro. Né et élevé dans la trattoria familiale, grâce à un esprit infatigable et une expérience hors du commun, il continue aujourd'hui encore à travailler avec passion et sérieux. Mais cela ne serait pas possible sans Claudia (notre cheffe cuisinière) à ses côtés, sa compagne aussi bien dans le travail que dans la vie.",
    "about.gen5.year": "Cinquième génération",
    "about.gen5.text": "Au terme de ce voyage, nous rencontrons le présent et l'avenir de la trattoria da Morano : Riccardo et Alessandro. Fils de Pietro et Claudia, ils s'engagent chaque jour pour que ce précieux héritage familial continue d'offrir joie et plaisir aux clients - ou plutôt aux convives - qui font encore aujourd'hui de la Trattoria da Morano une étape appréciée par tous ceux qui visitent la Tuscia.",

    "restaurant.heading": "Trois salles, trois histoires, trois façons de vivre le déjeuner et le dîner",
    "restaurant.terrace": "La <b>terrasse</b> est la partie la plus prisée du restaurant durant la saison estivale, offrant une vue à couper le souffle sur le lac de Bolsena. C'est la toute première salle construite dans la longue histoire de la trattoria Da Morano. Le coucher de soleil vu depuis la terrasse de Morano est une expérience à vivre. Envoûtant.",
    "restaurant.veranda": "La <b>véranda</b>, avec ses larges et élégantes baies vitrées, permet de profiter du spectacle du lac même durant les journées de tramontane typiques de ce paysage. Idéale pour les douces journées d'automne et de printemps. Lumineuse.",
    "restaurant.rooms": "Les froides journées d'hiver rendent le lac plus froid, mais tout aussi envoûtant. Le restaurant ne donne pas seulement sur le lac, il propose aussi deux <b>salles intérieures</b> aux styles différents, unissant passé et présent. Classique et moderne.",
    "restaurant.gallerylink": "Parcourir notre galerie",

    "gallery.terrace": "La terrasse",
    "gallery.veranda": "La véranda",
    "gallery.rooms": "Les salles intérieures",

    "menu.taste.heading": "Saveurs de la Tuscia",
    "menu.taste.text": "Notre cuisine propose un menu principalement à base de <b>poisson</b>, avec une attention particulière pour notre cher poisson de <b>lac</b> ; parmi les premiers plats de lac, on trouve les <b>farfalle au corégone</b>, parmi les seconds la savoureuse friture d'<b>athérines</b>, le savoureux <b>filet de perche frit/doré</b> et enfin le <b>corégone</b> et l'<b>anguille</b> grillés. Le poisson de lac proposé est rigoureusement issu de la <b>pêche</b> et non d'élevage, afin que les clients puissent savourer les vraies saveurs du lac de Bolsena. Chaque bon repas mérite d'être accompagné d'un bon <b>vin</b>. Nous proposons un large choix de vins blancs et rouges, en accordant une grande attention aux <b>vins régionaux</b>, grande fierté de notre territoire. Enfin, la carte des <b>desserts</b> propose des douceurs <b>faites maison</b>, dont la célèbre <b>zuppa inglese de Morano</b>, un dessert traditionnel qui mérite d'être perpétué.",

    "menu.proposal.fish": "Notre proposition de poisson",
    "menu.proposal.meat": "Notre proposition de viande",
    "menu.proposal.wine": "Les vins du territoire",
    "menu.proposal.pizza": "...mais aussi de la pizza !",

    "menu.section.antipasti": "Entrées",
    "menu.section.primi": "Premiers plats",
    "menu.section.secondi": "Plats principaux",
    "menu.section.contorni": "Accompagnements",
    "menu.section.dolci": "Desserts",

    "menu.wine.bianchi": "Vins blancs",
    "menu.wine.rossi": "Vins rouges",
    "menu.wine.bollicine": "Vins effervescents",

    "menu.popup.seasonal": "Disponible selon la saison",

    "menu.fish.antipasti.misto": "Assortiment de poisson",
    "menu.fish.antipasti.insalata": "Salade de fruits de mer",
    "menu.fish.antipasti.cozze": "Moules et palourdes",
    "menu.fish.antipasti.alici": "Anchois marinés",

    "menu.fish.primi.farfalle": "Farfalle au corégone",
    "menu.fish.primi.zuppa": "Soupe de poisson de lac",
    "menu.fish.primi.vongole": "Spaghetti aux palourdes",
    "menu.fish.primi.pescatora": "Spaghetti à la pêcheur ou 'scoglio'",
    "menu.fish.primi.risotto": "Risotto aux fruits de mer",
    "menu.fish.primi.gnocchetti": "Petits gnocchis à la crème de langoustines",
    "menu.fish.primi.ravioli": "Raviolis farcis au bar et fruits de mer, crème de langoustines",

    "menu.fish.secondi.coregone": "Corégone grillé",
    "menu.fish.secondi.anguilla": "Anguille grillée",
    "menu.fish.secondi.persico": "Filets de perche frits/dorés",
    "menu.fish.secondi.lattarini": "Athérines frites/dorées",
    "menu.fish.secondi.scampi": "Langoustines et gambas grillées",
    "menu.fish.secondi.orata": "Dorade/bar grillé",
    "menu.fish.secondi.sogliola": "Sole grillée",
    "menu.fish.secondi.gamberoni": "Gambas grillées",
    "menu.fish.secondi.grigliata": "Grillade mixte",
    "menu.fish.secondi.calamari": "Calamars et crevettes frits",

    "menu.contorni.patatine": "Frites",
    "menu.contorni.insalata": "Salade mixte",
    "menu.contorni.grigliate": "Légumes grillés",
    "menu.contorni.agro": "Légumes de saison à l'huile et au citron",
    "menu.contorni.saltate": "Légumes de saison sautés à la poêle",

    "menu.dolci.zuppainglese": "Zuppa inglese (trifle italien)",
    "menu.dolci.pannacotta": "Panna cotta",
    "menu.dolci.pistacchio": "Mousse à la pistache",
    "menu.dolci.tartufobianco": "Tartufo au chocolat blanc",
    "menu.dolci.tartufonero": "Tartufo au chocolat noir",
    "menu.dolci.sorbetto": "Sorbet au citron",
    "menu.dolci.frutta": "Fruits de saison",

    "menu.meat.antipasti.italiana": "Assiette de charcuterie à l'italienne",
    "menu.meat.primi.fettuccine": "Fettuccine à la sauce bolognaise",
    "menu.meat.primi.ombrichelli": "Ombrichelli à l'amatriciana",
    "menu.meat.secondi.vitella": "Steak de veau grillé",
    "menu.meat.secondi.maiale": "Steak de porc grillé",
    "menu.meat.secondi.arrosto": "Rôti mixte grillé",
    "menu.meat.secondi.salsiccia": "Saucisse grillée",
    "menu.meat.secondi.pollo": "Poulet grillé (façon diavola)",

    "menu.pizza.text": "Depuis 2015, nous offrons à nos clients la possibilité de déguster aussi une excellente <b>pizza</b> sur les rives du lac de Bolsena. Nous disposons d'un nouveau four à bois géré par notre chef pizzaiolo et propriétaire Alessandro.<br>Notre pizzeria est ouverte le soir :<br>tous les jours pendant la saison estivale ; vendredi, samedi et dimanche le reste de l'année."
  }
};
```

- [ ] **Step 2: Creare lo script di verifica coerenza chiavi**

```javascript
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
```

- [ ] **Step 3: Eseguire lo script e verificare che passi**

Run: `node scripts/check-i18n-keys.js`
Expected: `OK: all 4 languages have matching keys (86 keys each).`
(Se il conteggio differisce ricontrolla di aver copiato lo stesso identico set di chiavi in ciascuna delle 4 lingue.)

- [ ] **Step 4: Commit**

```bash
git add jsmor/translations.js scripts/check-i18n-keys.js
git commit -m "feat(i18n): add translation dictionary and key-consistency check"
```

---

### Task 2: Motore i18n (`jsmor/i18n.js`)

**Files:**
- Create: `jsmor/i18n.js`
- Test: `jsmor/i18n.test.js`

**Interfaces:**
- Consumes: `window.translations` da `jsmor/translations.js` (Task 1).
- Produces: `window.i18n = { getStoredLang, resolveText, applyLanguage, setLanguage, SUPPORTED, DEFAULT_LANG }`, usato dal markup (Task 3+) tramite gli attributi `data-i18n` / `data-i18n-html` e i bottoni `.lang-switch button[data-lang]`.

- [ ] **Step 1: Scrivere il test che fallisce**

```javascript
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
```

- [ ] **Step 2: Eseguire il test e verificare che fallisca**

Run: `node --test jsmor/i18n.test.js`
Expected: FAIL — `Cannot find module './i18n.js'`

- [ ] **Step 3: Implementare `jsmor/i18n.js`**

```javascript
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
```

- [ ] **Step 4: Eseguire il test e verificare che passi**

Run: `node --test jsmor/i18n.test.js`
Expected: PASS (5/5 test)

- [ ] **Step 5: Commit**

```bash
git add jsmor/i18n.js jsmor/i18n.test.js
git commit -m "feat(i18n): add i18n engine with language fallback logic"
```

---

### Task 3: Selettore lingua + wiring su `index.html`

**Files:**
- Modify: `cssmor/stylemor.css` (aggiungere in coda, dopo la regola `.menu_item a:hover::after` introdotta in precedenza)
- Modify: `index.html:22, 43-49, 61, 67, 73`

**Interfaces:**
- Consumes: `window.i18n` (Task 2), `window.translations` (Task 1).
- Produces: pattern di markup `.lang-switch` + `data-i18n`/`data-i18n-html` che i Task 4-7 replicano identico sulle altre pagine.

- [ ] **Step 1: Aggiungere lo stile del selettore lingua in `cssmor/stylemor.css`**

Aggiungere, in coda al file:

```css
.lang-switch {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 8px 0;
}
.lang-switch button {
  background: none;
  border: none;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  opacity: 0.5;
  transition: opacity 200ms ease;
}
.lang-switch button:hover,
.lang-switch button.active {
  opacity: 1;
}
```

- [ ] **Step 2: Aggiungere i tag script in `index.html`**

In `index.html:22`, sostituire:

```html
			<script src="scriptmor.js" defer></script>
```

con:

```html
			<script src="scriptmor.js" defer></script>
			<script src="jsmor/translations.js"></script>
			<script src="jsmor/i18n.js" defer></script>
```

- [ ] **Step 3: Aggiungere il markup del selettore lingua e gli attributi `data-i18n` alla navbar**

In `index.html:41-49`, sostituire:

```html
								<div class="navbar-links">
									<ul>
										<li class="menu_item"> <a href="index.html" id="orienter" class="active">Homepage</a></li>
										<li class="menu_item"> <a href="chi_siamo.html">Chi siamo</a></li>
										<li class="menu_item"> <a href="ristorante.html">Ristorante</a></li>
										<li class="menu_item"> <a href="menu.html">Menù</a></li>
										<li class="menu_item"> <a href="gallery.html">Gallery</a></li>
									</ul>
								</div>
```

con:

```html
								<div class="navbar-links">
									<ul>
										<li class="menu_item"> <a href="index.html" id="orienter" class="active" data-i18n="nav.home">Homepage</a></li>
										<li class="menu_item"> <a href="chi_siamo.html" data-i18n="nav.about">Chi siamo</a></li>
										<li class="menu_item"> <a href="ristorante.html" data-i18n="nav.restaurant">Ristorante</a></li>
										<li class="menu_item"> <a href="menu.html" data-i18n="nav.menu">Menù</a></li>
										<li class="menu_item"> <a href="gallery.html" data-i18n="nav.gallery">Gallery</a></li>
									</ul>
								</div>
								<div class="lang-switch">
									<button type="button" data-lang="it" aria-label="Italiano">🇮🇹</button>
									<button type="button" data-lang="en" aria-label="English">🇬🇧</button>
									<button type="button" data-lang="de" aria-label="Deutsch">🇩🇪</button>
									<button type="button" data-lang="fr" aria-label="Français">🇫🇷</button>
								</div>
```

- [ ] **Step 4: Marcare come traducibili slogan e le tre card della homepage**

In `index.html:53`, sostituire:

```html
						<h1 class="slogan"><i>Per chi ama le proprie origini</i></h1>
```

con:

```html
						<h1 class="slogan"><i data-i18n="home.slogan">Per chi ama le proprie origini</i></h1>
```

In `index.html:61`, sostituire:

```html
											<p style="border-left: solid 3px #17284B; padding-left: 5px">Cinque generazioni di tratto-ristoratori, cinque generazioni di passione, dedizione e amore per il territorio...<br><a href="chi_siamo.html"><b>Scopri di più</b></a></p>
```

con:

```html
											<p style="border-left: solid 3px #17284B; padding-left: 5px" data-i18n-html="home.card1">Cinque generazioni di tratto-ristoratori, cinque generazioni di passione, dedizione e amore per il territorio...<br><a href="chi_siamo.html"><b>Scopri di più</b></a></p>
```

In `index.html:67`, sostituire:

```html
											<p style="border-left: solid 3px #17284B; padding-left: 5px">Una location estiva mozzafiato, un posto dove il rispetto per il tempo che passa non viene mai meno...<br><a href="ristorante.html"><b>Scopri di più</b></a></p>
```

con:

```html
											<p style="border-left: solid 3px #17284B; padding-left: 5px" data-i18n-html="home.card2">Una location estiva mozzafiato, un posto dove il rispetto per il tempo che passa non viene mai meno...<br><a href="ristorante.html"><b>Scopri di più</b></a></p>
```

In `index.html:73`, sostituire:

```html
											<p style="border-left: solid 3px #17284B; padding-left: 5px">Piatti di mare e lago accompagnati da vini regionali e la volontà di rispettare i sapori di una volta...<br><a href="menu.html"><b>Scopri di più</b></a></p>
```

con:

```html
											<p style="border-left: solid 3px #17284B; padding-left: 5px" data-i18n-html="home.card3">Piatti di mare e lago accompagnati da vini regionali e la volontà di rispettare i sapori di una volta...<br><a href="menu.html"><b>Scopri di più</b></a></p>
```

- [ ] **Step 5: Marcare il footer come traducibile**

In `index.html:80-97`, sostituire il blocco `<div class="rowfoot">...</div>` con:

```html
						<div class="rowfoot">
							<div class="colfoot-4" style="padding-bottom: 15px">
								<div class="footitle"><b data-i18n="footer.contact">Contattaci</b> <a href="tel:+0761826394"><i class="icon fa-solid fa-phone fa-shake" style="--fa-animation-duration: 2s;"></i></a></div>
							    <a href="tel:+0761826394"><span data-i18n="footer.phoneLabel">Tel.:</span> 0761826394</a><br>
							 </div> 
							<div class="colfoot-4" style="padding-bottom: 15px">
							    <div class="footitle"><b data-i18n="footer.location">Dove siamo</b> <i class=" icon fa-solid fa-location-dot"></i></div>
							    Via del lago 160 <br>Montefiascone (VT)<br>
							    <a href="https://goo.gl/maps/LNAeE7PMAn3Y1VBK8" id="link_google_map" data-i18n="footer.maplink">Link Google Maps</a>
							</div>
							<div class="colfoot-4">
								<div class="footitle"><b data-i18n="footer.hours">Orari</b><i class="icon fa-solid fa-clock"></i></div>
								<span data-i18n="footer.lunch">Pranzo: 12:30-14:30</span><br>
								<span data-i18n="footer.dinner">Cena: 19:30-22:00</span><br>
					        	<span data-i18n="footer.closedDay">Giorno di chiusura: giovedì</span><br>
					        	<span data-i18n="footer.augustNote">(Agosto aperti tutti i giorni)</span>
							</div>
						</div>
```

- [ ] **Step 6: Verifica manuale nel browser**

Apri `index.html` nel browser. Clicca ciascuna bandierina e verifica che: nav, slogan, le 3 card homepage e il footer cambino lingua istantaneamente; ricaricando la pagina la lingua scelta resta memorizzata (persistenza `localStorage`); nessun testo mostra `undefined`.

- [ ] **Step 7: Commit**

```bash
git add cssmor/stylemor.css index.html
git commit -m "feat(i18n): wire language switcher into index.html"
```

---

### Task 4: Wiring `chi_siamo.html`

**Files:**
- Modify: `chi_siamo.html:22, 42-50, 64-124, 130-152`

**Interfaces:**
- Consumes: stesso pattern markup del Task 3 (`.lang-switch`, `data-i18n`), `window.translations["about.*"]` (Task 1).

- [ ] **Step 1: Aggiungere i tag script**

In `chi_siamo.html:22`, applicare la stessa modifica del Task 3 Step 2 (aggiungere `jsmor/translations.js` e `jsmor/i18n.js` dopo `scriptmor.js`).

- [ ] **Step 2: Navbar + selettore lingua**

Applicare lo stesso pattern del Task 3 Step 3 ai link di navigazione di `chi_siamo.html:44-48` (aggiungendo i rispettivi `data-i18n`, mantenendo `id="orienter" class="active"` sulla voce "Chi siamo") e aggiungere il blocco `.lang-switch` subito dopo la chiusura di `.navbar-links`.

- [ ] **Step 3: Marcare le 5 biografie come traducibili**

Per ciascuno dei 5 blocchi `.timeline-content` (`chi_siamo.html:64-124`), aggiungere `data-i18n` sull'elemento `<span class="year">` e `data-i18n` sull'elemento `<p class="description">`, usando le chiavi `about.gen1.year`/`about.gen1.text` … `about.gen5.year`/`about.gen5.text` nell'ordine in cui compaiono nel file (Pietro, Cesare, Ubaldo, Pietro, Riccardo e Alessandro). Esempio per la prima generazione:

```html
                        <span class="year" data-i18n="about.gen1.year">Prima generazione</span>
                        <h3 class="title h4">Pietro</h3>
                        <p class="description" data-i18n="about.gen1.text">
                            <i>Pietro Mocini</i>, più noto come Pietro di Morano, è stato il primo gestore del più antico ristorante che sorge sulle rive del lago. In origine era un pescatore di professione ma, dotato di grande talento anche in cucina, decide di aprire un piccolo locale immerso nei canneti del lago. In quel momento, verso i primi del Novecento, iniziò la storia della trattoria <i>Da Morano</i>. 
                        </p>
```

Nota: il nome proprio (`<h3 class="title h4">Pietro</h3>`, `Cesare`, `Ubaldo`, `Riccardo e Alessandro`) non va marcato con `data-i18n`: è un nome proprio, resta identico in tutte le lingue.

- [ ] **Step 4: Marcare il footer come traducibile**

Applicare lo stesso pattern del Task 3 Step 5 al footer di `chi_siamo.html:130-152`.

- [ ] **Step 5: Verifica manuale nel browser**

Apri `chi_siamo.html`, cambia lingua e verifica che le 5 generazioni e il footer si traducano correttamente, senza `undefined` e senza rompere il markup (`<i>` nei nomi propri dentro il testo).

- [ ] **Step 6: Commit**

```bash
git add chi_siamo.html
git commit -m "feat(i18n): wire language switcher into chi_siamo.html"
```

---

### Task 5: Wiring `ristorante.html`

**Files:**
- Modify: `ristorante.html:23, 46-53, 58, 62, 67, 73, 77, 80-100`

**Interfaces:**
- Consumes: stesso pattern markup dei Task 3-4, `window.translations["restaurant.*"]` (Task 1).

- [ ] **Step 1: Aggiungere i tag script**

Come Task 3 Step 2, dopo `ristorante.html:23`.

- [ ] **Step 2: Navbar + selettore lingua**

Come Task 3 Step 3, sui link `ristorante.html:47-51` (voce attiva: "Ristorante").

- [ ] **Step 3: Marcare titolo e le tre descrizioni delle sale**

In `ristorante.html:58`, sostituire:

```html
                        	<h1 style="font-family: 'Montserrat, sans-serif'; font-size: 30px; text-align: center; margin-top:25px">Tre locali, tre storie, tre modi di vivere il pranzo e la cena</h1>
```

con:

```html
                        	<h1 style="font-family: 'Montserrat, sans-serif'; font-size: 30px; text-align: center; margin-top:25px" data-i18n="restaurant.heading">Tre locali, tre storie, tre modi di vivere il pranzo e la cena</h1>
```

In `ristorante.html:62`, sostituire:

```html
                        	<div class="restaurant_description"><p>La <b>terrazza</b> è la parte del ristorante più ambita durante la stagione estiva, offre uno scorcio del lago di Bolsena mozzafiato. Si tratta del primo locale costruito durante la lunga storia della trattoria Da Morano. Il tramonto visto dalla terrazza di Morano è un'esperienza da vivere. Incantevole.</p></div>
```

con:

```html
                        	<div class="restaurant_description"><p data-i18n-html="restaurant.terrace">La <b>terrazza</b> è la parte del ristorante più ambita durante la stagione estiva, offre uno scorcio del lago di Bolsena mozzafiato. Si tratta del primo locale costruito durante la lunga storia della trattoria Da Morano. Il tramonto visto dalla terrazza di Morano è un'esperienza da vivere. Incantevole.</p></div>
```

In `ristorante.html:67`, sostituire:

```html
                        	<div class="restaurant_description"><p>La <b>veranda</b> con le sue ampie ed eleganti vetrate consente di godere dello spettacolo del lago durante le tipiche giornate di tramontana che caratterizzano il paesaggio circostante. Ideale per le miti giornate autunnali e primaverili. Luminosa.</p></div>
```

con:

```html
                        	<div class="restaurant_description"><p data-i18n-html="restaurant.veranda">La <b>veranda</b> con le sue ampie ed eleganti vetrate consente di godere dello spettacolo del lago durante le tipiche giornate di tramontana che caratterizzano il paesaggio circostante. Ideale per le miti giornate autunnali e primaverili. Luminosa.</p></div>
```

In `ristorante.html:73`, sostituire:

```html
                        	<div class="restaurant_description"><p>Le fredde giornate invernali rendono il lago più freddo ma non meno seducente. Il ristorante non solo si affaccia sul lago, ma offre anche la possibilità di pranzare in due <b>sale interne</b> dagli stili diversi per tenere unito passato e presente. Classico e moderno.</p></div>
```

con:

```html
                        	<div class="restaurant_description"><p data-i18n-html="restaurant.rooms">Le fredde giornate invernali rendono il lago più freddo ma non meno seducente. Il ristorante non solo si affaccia sul lago, ma offre anche la possibilità di pranzare in due <b>sale interne</b> dagli stili diversi per tenere unito passato e presente. Classico e moderno.</p></div>
```

- [ ] **Step 4: Marcare il link alla gallery**

In `ristorante.html:77`, sostituire:

```html
						<p style="font-family: 'Montserrat, sans-serif'; font-size: 30px; text-align: center;"><a href="gallery.html" style="text-decoration: none">Sfoglia la nostra gallery <i class="fa-solid fa-camera-retro" style="padding-left: 10px"></i></a></p>
```

con:

```html
						<p style="font-family: 'Montserrat, sans-serif'; font-size: 30px; text-align: center;"><a href="gallery.html" style="text-decoration: none"><span data-i18n="restaurant.gallerylink">Sfoglia la nostra gallery</span> <i class="fa-solid fa-camera-retro" style="padding-left: 10px"></i></a></p>
```

- [ ] **Step 5: Marcare il footer come traducibile**

Come Task 3 Step 5, su `ristorante.html:80-100`.

- [ ] **Step 6: Verifica manuale nel browser**

Apri `ristorante.html`, cambia lingua e verifica titolo, le tre descrizioni (terrazza/veranda/sale interne, incluso il grassetto), il link gallery e il footer.

- [ ] **Step 7: Commit**

```bash
git add ristorante.html
git commit -m "feat(i18n): wire language switcher into ristorante.html"
```

---

### Task 6: Wiring `gallery.html`

**Files:**
- Modify: `gallery.html:22, 43-51, 55, 83, 102, 224-245`

**Interfaces:**
- Consumes: stesso pattern markup dei Task precedenti, `window.translations["gallery.*"]` (Task 1).

- [ ] **Step 1: Aggiungere i tag script**

Come Task 3 Step 2, dopo `gallery.html:22`.

- [ ] **Step 2: Navbar + selettore lingua**

Come Task 3 Step 3, sui link `gallery.html:44-48` (voce attiva: "Gallery").

- [ ] **Step 3: Marcare i tre titoli di sezione**

In `gallery.html:55`, sostituire:

```html
    <h1 style="text-align: center; font-family: 'Montserrat, sans-serif'">La terrazza</h1>
```

con:

```html
    <h1 style="text-align: center; font-family: 'Montserrat, sans-serif'" data-i18n="gallery.terrace">La terrazza</h1>
```

In `gallery.html:83`, sostituire:

```html
  <h1 style="text-align: center; font-family: 'Montserrat, sans-serif'">La veranda</h1>
```

con:

```html
  <h1 style="text-align: center; font-family: 'Montserrat, sans-serif'" data-i18n="gallery.veranda">La veranda</h1>
```

In `gallery.html:102`, sostituire:

```html
    <h1 style="text-align: center; font-family: 'Montserrat, sans-serif'">Le sale interne</h1>
```

con:

```html
    <h1 style="text-align: center; font-family: 'Montserrat, sans-serif'" data-i18n="gallery.rooms">Le sale interne</h1>
```

- [ ] **Step 4: Marcare il footer come traducibile**

Come Task 3 Step 5, su `gallery.html:224-245`.

- [ ] **Step 5: Verifica manuale nel browser**

Apri `gallery.html`, cambia lingua e verifica i tre titoli di sezione e il footer. Verifica che lightbox/carousel (`openModal`, `plusSlides`) continuino a funzionare normalmente (non toccati da questa modifica).

- [ ] **Step 6: Commit**

```bash
git add gallery.html
git commit -m "feat(i18n): wire language switcher into gallery.html"
```

---

### Task 7: Wiring `menu.html`

**Files:**
- Modify: `menu.html:22, 44-50, 54-55, 58, 61-110, 113-131, 172-173, 176-198`

**Interfaces:**
- Consumes: stesso pattern markup dei Task precedenti, `window.translations["menu.*"]` (Task 1).

- [ ] **Step 1: Aggiungere i tag script**

Come Task 3 Step 2, dopo `menu.html:22`.

- [ ] **Step 2: Navbar + selettore lingua**

Come Task 3 Step 3, sui link `menu.html:44-48` (voce attiva: "Menù").

- [ ] **Step 3: Marcare titolo e testo introduttivo**

In `menu.html:54-55`, sostituire:

```html
       	<h1>Sapori della Tuscia</h1>
       	<p>La cucina propone un menù soprattutto a base di <b>pesce</b>, con particolare attenzione al nostro amato pesce di <b>lago</b>; tra i primi di lago troviamo le <b>farfalle al coregone</b>, tra i secondi la golosa frittura di <b>lattarini</b>, il saporito <b>filetto di persico fritto/dorato</b> e, infine, <b>coregone</b> e <b>anguilla</b> alla brace. Il pesce di lago proposto è rigorosamente <b>pescato</b> e non di allevamento affinchè i clienti possano gustare i veri sapori del lago di Bolsena. Ogni buon pasto merita di essere accompagnato da un buon <b>vino</b>. Proponiamo un'ampia scelta di vini bianchi e rossi riponendo grande attenzione nella scelta dei <b>vini regionali</b>, grande vanto del nostro territorio. Infine, la carta dei <b>dessert</b> propone dolci <b>fatti in casa</b> tra cui la storica <b>zuppa inglese di Morano</b>, un dolce tradizionale che merita di essere riproposto nel tempo.</p>
```

con:

```html
       	<h1 data-i18n="menu.taste.heading">Sapori della Tuscia</h1>
       	<p data-i18n-html="menu.taste.text">La cucina propone un menù soprattutto a base di <b>pesce</b>, con particolare attenzione al nostro amato pesce di <b>lago</b>; tra i primi di lago troviamo le <b>farfalle al coregone</b>, tra i secondi la golosa frittura di <b>lattarini</b>, il saporito <b>filetto di persico fritto/dorato</b> e, infine, <b>coregone</b> e <b>anguilla</b> alla brace. Il pesce di lago proposto è rigorosamente <b>pescato</b> e non di allevamento affinchè i clienti possano gustare i veri sapori del lago di Bolsena. Ogni buon pasto merita di essere accompagnato da un buon <b>vino</b>. Proponiamo un'ampia scelta di vini bianchi e rossi riponendo grande attenzione nella scelta dei <b>vini regionali</b>, grande vanto del nostro territorio. Infine, la carta dei <b>dessert</b> propone dolci <b>fatti in casa</b> tra cui la storica <b>zuppa inglese di Morano</b>, un dolce tradizionale che merita di essere riproposto nel tempo.</p>
```

In `menu.html:58`, sostituire:

```html
       <div><h1 class="proposal"><b>La nostra proposta di pesce</b></h1></div>
```

con:

```html
       <div><h1 class="proposal"><b data-i18n="menu.proposal.fish">La nostra proposta di pesce</b></h1></div>
```

- [ ] **Step 4: Marcare le sezioni pesce (Antipasti/Primi/Secondi/Contorni/Dolci)**

In `menu.html:61-110`, aggiungere `data-i18n` a ogni intestazione `<h2>` e a ogni `<div class="list-group-item">`, mappando ordinatamente sulle chiavi definite in Task 1:

```html
	   <div class="menulist"><h2 style="font-family: 'Montserrat, sans-serif'; font-size: 25px" data-i18n="menu.section.antipasti">Antipasti</h2>
	  		<div class="list-group-item" data-i18n="menu.fish.antipasti.misto">Antipasto misto di pesce 						 </div>
	  		<div class="list-group-item" data-i18n="menu.fish.antipasti.insalata">Insalata di mare 								 </div>
	  		<div class="list-group-item" data-i18n="menu.fish.antipasti.cozze">Cozze e vongole								 </div>
	  		<div class="list-group-item" data-i18n="menu.fish.antipasti.alici">Alici marinate 								 </div>
	   </div>
	   <div class="menulist"><h2 style="font-family: 'Montserrat, sans-serif'; font-size: 25px" data-i18n="menu.section.primi">Primi</h2>
	   		<div class="list-group-item" data-i18n="menu.fish.primi.farfalle">Farfalle al coregone								         </div>
	   		<div class="list-group-item" data-i18n="menu.fish.primi.zuppa">Zuppa di pesce di lago 							         </div>
	   		<div class="list-group-item" data-i18n="menu.fish.primi.vongole">Spaghetti alle vongole							             </div>
	   		<div class="list-group-item" data-i18n="menu.fish.primi.pescatora">Spaghetti alla pescatora o scoglio                          </div>
	   		<div class="list-group-item" data-i18n="menu.fish.primi.risotto">Risotto alla marinara                                       </div>
	   		<div class="list-group-item" data-i18n="menu.fish.primi.gnocchetti">Gnocchetti alla crema di scampi					         </div>
	   		<div class="list-group-item" data-i18n="menu.fish.primi.ravioli">Ravioli ripieni di spigola e crostacei alla crema di scampi </div>
	   </div>
	   <div class="menulist"><h2 style="font-family: 'Montserrat, sans-serif'; font-size: 25px" data-i18n="menu.section.secondi">Secondi</h2>
	   		<div class="list-group-item"><span data-i18n="menu.fish.secondi.coregone">Coregone alla brace</span><div class="popup" onclick="myFunction()"><i class="fa-solid fa-circle-info"></i>
  <span class="popuptext" id="myPopup" data-i18n="menu.popup.seasonal">Prodotto disponibile a secondo della stagione</span>
</div>							     </div>
	   		<div class="list-group-item"><span data-i18n="menu.fish.secondi.anguilla">Anguilla alla brace</span><div class="popup" onclick="myFunction()"><i class="fa-solid fa-circle-info"></i>
  <span class="popuptext" id="myPopup" data-i18n="menu.popup.seasonal">Prodotto disponibile a secondo della stagione</span>
</div>							    </div>
	   		<div class="list-group-item" data-i18n="menu.fish.secondi.persico">Filetti di persico fritti-dorati				</div>
	   		<div class="list-group-item"><span data-i18n="menu.fish.secondi.lattarini">Lattarini fritti-dorati</span><div class="popup" onclick="myFunction()"><i class="fa-solid fa-circle-info"></i>
  <span class="popuptext" id="myPopup" data-i18n="menu.popup.seasonal">Prodotto disponibile a secondo della stagione</span>
</div>                          </div>
	   		<div class="list-group-item" data-i18n="menu.fish.secondi.scampi">Scampi-Gamberoni alla brace                      </div>
	   		<div class="list-group-item" data-i18n="menu.fish.secondi.orata">Orata alla brace/spigola                         </div>
	   		<div class="list-group-item" data-i18n="menu.fish.secondi.sogliola">Sogliola alla brace			                  </div>
	   		<div class="list-group-item" data-i18n="menu.fish.secondi.gamberoni">Gamberoni alla brace							  </div>
	   		<div class="list-group-item" data-i18n="menu.fish.secondi.grigliata">Grigliata mista alla brace                       </div>
	   		<div class="list-group-item" data-i18n="menu.fish.secondi.calamari">Calamari e gamberi fritti					      </div>
	   </div>
	   <div class="menulist">
	   <h2 style="font-family: 'Montserrat, sans-serif'; font-size: 25px" data-i18n="menu.section.contorni">Contorni</h2>									 
	   		<div class="list-group-item" data-i18n="menu.contorni.patatine">Patatine fritte 									 </div>
	   		<div class="list-group-item" data-i18n="menu.contorni.insalata">Insalata mista									     </div>
	   		<div class="list-group-item" data-i18n="menu.contorni.grigliate">Verdure grigliate								     </div>
	   		<div class="list-group-item" data-i18n="menu.contorni.agro">Verdure di stagione all'agro						 </div>
		   		<div class="list-group-item" data-i18n="menu.contorni.saltate">Verdure di stagione saltate in padella		         </div>
	   </div>  
	   <div class="menulist"><h2 style="font-family: 'Montserrat, sans-serif'; font-size: 25px" data-i18n="menu.section.dolci">Dolci</h2>
	   		<div class="list-group-item" data-i18n="menu.dolci.zuppainglese">Zuppa inglese									     </div>
	   		<div class="list-group-item" data-i18n="menu.dolci.pannacotta">Panna cotta 										 </div>
	   		<div class="list-group-item" data-i18n="menu.dolci.pistacchio">Mousse al pistacchio								 </div>
	   		<div class="list-group-item" data-i18n="menu.dolci.tartufobianco">Tartufo bianco									     </div>
	   		<div class="list-group-item" data-i18n="menu.dolci.tartufonero">Tartufo nero										 </div>
	   		<div class="list-group-item" data-i18n="menu.dolci.sorbetto">Sorbetto al limone								     </div>
	   		<div class="list-group-item" data-i18n="menu.dolci.frutta">Frutta di stagione           					     </div>
		</div>
```

**Nota importante:** i tre `id="myPopup"` erano già duplicati nell'HTML originale (bug preesistente, fuori scope di questo piano); non introdurne di nuovi oltre a quelli già presenti — la modifica sopra si limita ad aggiungere `data-i18n` senza cambiare id/struttura esistenti.

- [ ] **Step 5: Marcare la sezione carne**

In `menu.html:113-131`, sostituire il blocco proposta carne con:

```html
<div><h1 class="proposal"><b data-i18n="menu.proposal.meat">La nostra proposta di carne</b></h1></div>
<div class="grid-container-menu">
	<main class="meat">
	 	<div><h2 style="font-family: 'Montserrat, sans-serif'; font-size: 25px" data-i18n="menu.section.antipasti">Antipasti</h2>
	 	     <div class="list-group-item" data-i18n="menu.meat.antipasti.italiana">Antipasto all'italiana							 </div>
	 	</div>
	 	<div><h2 style="font-family: 'Montserrat, sans-serif'; font-size: 25px" data-i18n="menu.section.primi">Primi</h2>
	 		 <div class="list-group-item" data-i18n="menu.meat.primi.fettuccine">Fettuccine al ragù								 </div>
	 		 <div class="list-group-item" data-i18n="menu.meat.primi.ombrichelli">Ombrichelli all'amatriciana						 </div>			
	 	</div>
	 	<div><h2 style="font-family: 'Montserrat, sans-serif'; font-size: 25px" data-i18n="menu.section.secondi">Secondi</h2>
	 		 <div class="list-group-item" data-i18n="menu.meat.secondi.vitella">Bistecca di vitella alla brace				     </div>
	 		 <div class="list-group-item" data-i18n="menu.meat.secondi.maiale">Bistecca di maiale alla brace                      </div>
	 		 <div class="list-group-item" data-i18n="menu.meat.secondi.arrosto">Arrosto misto alla brace					         </div>
	 		 <div class="list-group-item" data-i18n="menu.meat.secondi.salsiccia">Salsiccia alla brace						         </div>
	 		 <div class="list-group-item" data-i18n="menu.meat.secondi.pollo">Pollo alla brace (diavola)                         </div>
	 	</div>
	  </main>
	</div>
```

- [ ] **Step 6: Marcare le intestazioni della sezione vini (i nomi dei vini restano non tradotti)**

In `menu.html:132, 135, 155, 162`, aggiungere `data-i18n` solo alle intestazioni:

```html
	<div><h1 class="proposal"><b data-i18n="menu.proposal.wine">I vini del territorio</b></h1></div>
```
```html
	 	<div><h2 style="font-family: 'Montserrat, sans-serif'; font-size: 25px" data-i18n="menu.wine.bianchi">Bianchi</h2>
```
```html
	 	<div><h2 style="font-family: 'Montserrat, sans-serif'; font-size: 25px" data-i18n="menu.wine.rossi">Rossi</h2>
```
```html
	 	<div><h2 style="font-family: 'Montserrat, sans-serif'; font-size: 25px" data-i18n="menu.wine.bollicine">Bollicine</h2>
```

I singoli nomi di vino e "Cantina"/"Famiglia" (righe 136-167) non vengono modificati: sono denominazioni proprie, identiche in tutte le lingue per scelta di design (vedi Global Constraints).

- [ ] **Step 7: Marcare la sezione pizza**

In `menu.html:171-174`, sostituire:

```html
	<div class="pizza">
		<div><h1 class="proposal"><b>...ma anche pizza!</b></h1></div>
		<p>Dal 2015 abbiamo deciso di offrire ai nostri clienti la possibilità di mangiare anche un'ottima e sfiziosa <b>pizza</b> sulle rive del lago di Bolsena. Disponiamo di un nuovo forno a legna gestito dal nostro capo-pizzaiolo e titolare Alessandro.<br>La nostra pizzeria è aperta a cena:<br>tutti i giorni durante la stagione estiva; venerdì, sabato e domenica durante gli altri periodi dell'anno.</p>
		<img src="photosmorano/pizza.jpg" style="width:100%; height:auto; margin-bottom: 10px"><img>
	</div>
```

con:

```html
	<div class="pizza">
		<div><h1 class="proposal"><b data-i18n="menu.proposal.pizza">...ma anche pizza!</b></h1></div>
		<p data-i18n-html="menu.pizza.text">Dal 2015 abbiamo deciso di offrire ai nostri clienti la possibilità di mangiare anche un'ottima e sfiziosa <b>pizza</b> sulle rive del lago di Bolsena. Disponiamo di un nuovo forno a legna gestito dal nostro capo-pizzaiolo e titolare Alessandro.<br>La nostra pizzeria è aperta a cena:<br>tutti i giorni durante la stagione estiva; venerdì, sabato e domenica durante gli altri periodi dell'anno.</p>
		<img src="photosmorano/pizza.jpg" style="width:100%; height:auto; margin-bottom: 10px"><img>
	</div>
```

- [ ] **Step 8: Marcare il footer come traducibile**

Come Task 3 Step 5, su `menu.html:176-198`.

- [ ] **Step 9: Verifica manuale nel browser**

Apri `menu.html`, cambia lingua e verifica: titolo/testo introduttivo, tutte le voci pesce/carne/contorni/dolci, le intestazioni vino (nomi vino invariati), sezione pizza, footer, e che i popup "disponibile in base alla stagione" (icona `fa-circle-info`) mostrino il testo tradotto al click.

- [ ] **Step 10: Commit**

```bash
git add menu.html
git commit -m "feat(i18n): wire language switcher into menu.html"
```

---

### Task 8: QA finale incrociata

**Files:** nessuna modifica — solo verifica.

- [ ] **Step 1: Eseguire i test automatici**

Run: `node scripts/check-i18n-keys.js && node --test jsmor/i18n.test.js`
Expected: entrambi PASS.

- [ ] **Step 2: Percorrere manualmente tutte le 5 pagine in tutte le 4 lingue**

Per ciascuna delle 5 pagine pubbliche, cambiare lingua tra IT/EN/DE/FR e verificare: nessun testo `undefined`/vuoto, nessun layout rotto (in particolare il popup "stagionale" nel menù e i link "Scopri di più"/"Discover more"/ecc.), la bandiera attiva evidenziata corrisponde alla lingua corrente, e navigando da una pagina all'altra la lingua scelta resta la stessa (persistenza `localStorage` cross-page).

- [ ] **Step 3: Verifica mobile**

Ridurre la finestra del browser sotto 768px, aprire il menu hamburger e verificare che le bandierine restino visibili e funzionanti sia a menu chiuso che aperto.

- [ ] **Step 4: Commit finale (se emergono fix)**

Se la QA rivela problemi, correggerli nel file interessato e:

```bash
git add <file corretti>
git commit -m "fix(i18n): <descrizione della correzione>"
```