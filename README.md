# MINAR Küche – Website (Multi-Page-Demo)

Statische Multi-Page-Website für **MINAR Küche**, Schussenrieder Straße 21, 88422 Bad Buchau.
Restaurant · Lieferservice · Abholung.

HTML, CSS und Vanilla JavaScript – keine Frameworks, keine Datenbank, kein Backend, keine externen Dienste oder Schriften.
Alle Seiten sind mit `noindex` gekennzeichnet (unveröffentlichte Demo).

## Seiten

| URL | Inhalt |
|-----|--------|
| `index.html` | Startseite (Hero mit Logo, Vorstellung, Kategorien, Lieferservice, Öffnungszeiten, CTA) |
| `speisekarte/index.html` | Übersicht aller 18 Kategorien + Gerichtesuche (`?q=` möglich) |
| `speisekarte/<kategorie>.html` | 18 Kategorieseiten, z. B. `pizza.html`, `burger.html`, `doener.html` |
| `bestellen.html` | Warenkorb & Bestellvorbereitung per WhatsApp |
| `lieferservice.html` | Liefergebiete, Mindestbestellwerte, Lieferkosten, Zeiten |
| `ueber-uns.html` | Restaurantvorstellung |
| `kontakt.html` | Adresse, Telefon, WhatsApp, Öffnungszeiten, Google-Maps-Link |
| `impressum.html`, `datenschutz.html` | Entwürfe mit markierten Platzhaltern |

## Struktur

```text
├── *.html, speisekarte/*.html   erzeugte Seiten (nicht von Hand bearbeiten)
├── assets/
│   ├── css/styles.css           Designsystem (Farbvariablen, Komponenten)
│   ├── js/menu-data.js          ALLE Inhalte: Stammdaten, Zeiten, Lieferzonen, Kategorien, Gerichte
│   ├── js/app.js                Navigation, Öffnungsstatus, Speisekarte, Suche, Warenkorb, WhatsApp
│   ├── logo/                    Logo als SVG/PNG, Header-Variante, Halal-Siegel, Favicons, Referenz
│   └── images/                  Platz für spätere Originalfotos
├── tools/
│   ├── build.mjs                Seitengenerator (Header, Footer, Navigation zentral)
│   ├── trace.py, compose.py     Logo-Vektorisierung aus assets/logo/logo-referenz.png
├── PRUEFLISTE.md                Prüfprotokoll: unsichere und zu bestätigende Angaben
└── .nojekyll
```

## Inhalte pflegen

**Preise und Gerichte:** nur `assets/js/menu-data.js` bearbeiten – die Seiten lesen die Daten beim Aufruf. Kein Build nötig.

**Header, Footer, Seitentexte oder neue Kategorie:** `tools/build.mjs` bzw. `menu-data.js` anpassen und neu erzeugen:

```bash
node tools/build.mjs
```

(Node.js ≥ 16, keine Pakete nötig.)

Aufbau eines Gerichts:

```js
{ nr: "28", cat: "burger", name: "Minar Spezial Burger XXL",
  desc: "200 g Rindfleisch-Pattie, Cheddar Käse, Rösti und Smoky Cocktailsoße",
  prices: [13.5],                 // oder [["klein", 4.9], ["groß", 6.9]]
  codes: "A,C,G,F,J,6,7,8,2",     // Buchstaben = Allergene, Zahlen = Zusatzstoffe
  opts: ["burger-extra"] }        // Auswahl/Extras aus optionGroups
```

`codesCheck: true` blendet unsichere Kennzeichnungen aus („auf Anfrage“).

## Designgrundlage

Farbvariablen in `assets/css/styles.css` (aus den Flyerfotos abgeleitet):

| Variable | Wert | Einsatz |
|----------|------|---------|
| `--minar-green` | `#646C3E` | Header-Leiste, Navigation, Buttons, Akzente |
| `--minar-yellow-light` | `#D2B52A` | Flyer-Band, Footer, Aktionsbuttons |
| `--minar-yellow` | `#B39901` | Hinweis-Akzente |
| `--minar-red` | `#8A4839` | Kategorieüberschriften, Artikelnummern, Trennlinien |
| `--minar-orange` | `#C59771` | Sonnen-Akzente |
| `--minar-cream` | `#E8DCC7` | Flächen, Abschnitte |
| `--minar-dark` | `#2F2A23` | Fließtext |

Wiederkehrende Elemente: rot gesetzte Kategorietitel in Versalien, das geschwungene Grün-Rot-Gelb-Band aus dem Flyer (vor dem Footer und unter dem Hero), Sonnen-Emblem, Halal-Siegel.

## Lokal ansehen

Doppelklick auf `index.html` genügt. Oder mit lokalem Server:

```bash
python3 -m http.server 8000   # → http://localhost:8000
```

## Veröffentlichen (GitHub Pages) – erst nach Freigabe

1. Branch `multipage` nach `main` mergen (oder in *Settings → Pages* den Branch `multipage` wählen).
2. *Settings → Pages → Deploy from a branch → (Branch) / (root)*.
3. Die Seite läuft dann unter `https://<konto>.github.io/minar/`. Alle Links sind relativ und funktionieren unter diesem Projektpfad.

Es ist bewusst **keine eigene Domain** hinterlegt (keine `CNAME`-Datei).
Vor dem Livegang: `noindex` in `tools/build.mjs` entfernen, Seiten neu erzeugen und `PRUEFLISTE.md` abarbeiten.
