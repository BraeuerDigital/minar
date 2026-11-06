# MINAR Küche – Website (Multi-Page-Demo)

Statische Multi-Page-Website für **MINAR Küche**, Schussenrieder Straße 21, 88422 Bad Buchau.
Restaurant · Lieferservice · Abholung.

HTML, CSS und Vanilla JavaScript – keine Frameworks, keine Datenbank, kein Backend, keine externen Dienste oder Schriften.
Alle Seiten sind mit `noindex` gekennzeichnet (unveröffentlichte Demo).

## Seiten

| URL | Inhalt |
|-----|--------|
| `index.html` | Startseite (Hero mit Logo, Vorstellung, Kategorien, Lieferservice, Öffnungszeiten, CTA) |
| `speisekarte/index.html` | komplette Speisekarte mit allen Gerichten, Kategorie-Sprungleiste und Suche (`?q=` möglich) |
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
│   ├── js/logo-anim.js          Logo-Intro der Startseite (Aufbau, Stand, Scharren, Sprung – ca. 5,3 s)
│   ├── logo/                    Logo als SVG/PNG, Header-Variante, Halal-Siegel, Favicons, Referenz
│   └── images/                  Platz für spätere Originalfotos
├── tools/
│   ├── build.mjs                Seitengenerator (Header, Footer, Navigation zentral)
│   ├── trace.py, compose.py     Logo-Vektorisierung aus assets/logo/logo-referenz.png
│   ├── logo_anim.py             erzeugt assets/logo/minar-logo-anim.svg (zerlegtes Logo + Gelenk-Rig)
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

## Designgrundlage (Orange/Grün-Edition)

Die Oberfläche nutzt ausschließlich **Logo-Orange** und **Grün** plus Neutraltöne. Das Logo (inkl. Halal-Siegel) bleibt im Original.

| Variable | Wert | Einsatz |
|----------|------|---------|
| `--minar-green` | `#4E7A16` | Buttons, Navigation, Markenakzente |
| `--lime` | `#A6D23A` | helles Markengrün: Leuchtakzente, Hover, Versatz-Schatten |
| `--green-deep` / `--night` | `#2F4A0C` / `#10160A` | dunkle Bühnen, Footer |
| `--minar-red` (= Logo-Orange) | `#F87012` | Überschriften, Laufband, Akzente |
| `--red-hot` / `--orange-deep` | `#FF9A3D` / `#B5500A` | Verläufe, Hover / kleine Schrift, Artikelnummern |

Gestaltungselemente: Blattform-Ecken, die beim Hover umklappen · Buttons mit Farbwechsel Grün ↔ Rot, Licht-Spot, Lichtstreif, Roll-Label und Magnet · sich kreuzende Laufbänder im Hero · Outline-Schriftzug „MINAR“ im Hintergrund · Kategorie-Karten mit 3D-Tilt und Farb-Flip · Gerichte mit rotierendem Rot-Grün-Rand · Blob-Bilder · gleitender Navigations-Indikator · Scroll-Fortschritt · Scrollspy in der Speisekarte.

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

## Logo-Intro (Startseite)

Ablauf: Logo-Aufbau (Sonne → Linien → Siegel → Halbmond → MINAR → Küche → Unterzeile) · ruhiger Stand · Aufbäumen mit dreimaligem, abwechselndem Strampeln beider Vorderläufe · Sammeln und Absprung in die Original-Pose · danach völlig still. Gesamt ca. 5,5 s, keine Schleife.

- **Technik:** Vanilla JS + SVG (ein `requestAnimationFrame`-Loop, keine Bibliothek). Die Tierfigur ist die Original-Silhouette, zerlegt in ein Gelenk-Rig (Huf → Hüfte → Schulter → Ellbogen; der entfernte Vorderlauf nutzt dieselben Originalformen, leicht versetzt hinter dem Körper); Winkel 0 = Original-Pose. Am Ende wird auf die unzerlegte Silhouette umgeschaltet – Endbild pixelgleich zum statischen Logo (geprüft).
- **Abspielen:** bei jedem Aufruf und Neuladen von vorne. `prefers-reduced-motion` oder ohne JavaScript → sofort statisches Logo.
- **Dateien:** `assets/logo/minar-logo-anim.svg` (wird von `tools/build.mjs` inline eingesetzt), `assets/js/logo-anim.js` (direkt hinter dem SVG laden).
- **Einbau in andere Seiten:** `logo-intro/index.html` enthält SVG, CSS und JS zusammenhängend zum Kopieren.
- **Anpassen:** Zeiten und Posen stehen kommentiert oben in `assets/js/logo-anim.js` (Phasen A–E). Nach Änderungen am Rig: `python3 tools/logo_anim.py && node tools/build.mjs`.
