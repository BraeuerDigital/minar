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
│   ├── js/fx.js                 Interaktions-Effekte (Hover, Tilt, Magnet, Scroll-Fortschritt)
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

## Designgrundlage („Future Edition“)

Farbvariablen in `assets/css/styles.css` – Flyer-Farbwelt, leicht geschärft:

| Variable | Wert | Einsatz |
|----------|------|---------|
| `--minar-green` | `#5F7A1F` | Buttons, Navigation, Markenakzente |
| `--lime` | `#9BC13A` | helles Markengrün: Leuchtakzente, Hover-Glow, aktive Zustände |
| `--minar-yellow-light` | `#E3C33A` | Flyer-Band, Footer, Aktionsbuttons |
| `--minar-red` | `#A23B2A` | Kategorieüberschriften, Artikelnummern |
| `--minar-orange` | `#F07A1A` | Sonnen-Emblem, Verläufe |
| `--minar-cream` | `#EADFCB` | Flächen |
| `--night` | `#151A0E` | dunkle Bühnen (Topbar, Liefer-Bereich, Öffnungszeiten) |

Gestaltungselemente: Blattform-Ecken (`--r-leaf`), die beim Hover umklappen · Licht-Spot, Lichtstreif und Roll-Label auf Buttons · magnetische Buttons · 3D-Tilt und rotierender Verlaufsrand auf Kategorie-Karten · Spotlight auf Gerichten · gleitender Navigations-Indikator · Aurora-Hintergrund und Sonnen-Halo im Hero · Perspektiv-Raster im Liefer-Bereich · Scroll-Fortschritt in Flyer-Farben · geschwungenes Grün-Rot-Gelb-Band aus dem Flyer.

Effekte stecken in `assets/js/fx.js` und werden bei „Bewegung reduzieren“ sowie auf Touch-Geräten automatisch reduziert.

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
