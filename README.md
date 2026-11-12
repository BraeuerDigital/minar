# MINAR Küche – Website

Statische Multi-Page-Website für **MINAR Küche**, Schussenrieder Straße 21, 88422 Bad Buchau.
Restaurant · Lieferservice · Abholung.

HTML, CSS und Vanilla JavaScript – keine Frameworks, keine Datenbank, kein Backend, keine externen Dienste oder Schriften.
Hosting: **Cloudflare Pages** (Projekt `minar-kueche`, Output-Ordner `public/`) – Einrichtung siehe [`docs/CLOUDFLARE.md`](docs/CLOUDFLARE.md).
Alle Seiten sind bis zur Freigabe mit `noindex` gekennzeichnet. Stand der Umsetzung: [`docs/ABSCHLUSSBERICHT.md`](docs/ABSCHLUSSBERICHT.md).

## Seiten

| URL | Inhalt |
|-----|--------|
| `index.html` | Startseite (Hero mit Logo, Vorstellung, Kategorien, Lieferservice, Öffnungszeiten, CTA) |
| `speisekarte/index.html` | komplette Speisekarte mit allen Gerichten, Kategorie-Sprungleiste und Suche (`?q=` möglich) |
| `speisekarte/<kategorie>.html` | 18 Kategorieseiten, z. B. `pizza.html`, `burger.html`, `doener.html` |
| `bestellen.html` | Warenkorb „Deine Bestellung“, Angaben, Bestellübersicht im Bon-Stil, Versand der Anfrage per WhatsApp |
| `lieferservice.html` | Liefergebiete, Mindestbestellwerte, Lieferkosten, Zeiten |
| `ueber-uns.html` | Restaurantvorstellung |
| `kontakt.html` | Adresse, Telefon, WhatsApp, Öffnungszeiten, Google-Maps-Link, Google-Bewertung (sobald Link hinterlegt) |
| `impressum.html`, `datenschutz.html` | Impressum und Datenschutzerklärung (Cloudflare Pages) |
| `404.html` | Fehlerseite für Cloudflare Pages |

## Struktur

```text
├── public/                       ← wird veröffentlicht (Cloudflare-Output)
│   ├── *.html, speisekarte/*.html  erzeugte Seiten (nicht von Hand bearbeiten)
│   ├── 404.html, _headers, robots.txt
│   └── assets/
│       ├── css/styles.css        Designsystem (Farbvariablen, Komponenten)
│       ├── js/menu-data.js       ALLE Inhalte: Stammdaten, Zeiten, Lieferzonen, Kategorien, Gerichte, Pfand, Google-Link
│       ├── js/app.js             Navigation, Öffnungsstatus, Speisekarte, Suche, Warenkorb, Bon, WhatsApp
│       ├── js/fx.js              Interaktions-Effekte (Hover, Tilt, Magnet, Scroll-Fortschritt)
│       ├── js/logo-anim.js       Logo-Intro der Startseite
│       ├── logo/                 Logo als SVG/PNG, Favicons
│       └── images/               Fotos des Restaurants
├── tools/
│   ├── build.mjs                 Seitengenerator (Header, Footer, Navigation, Rechtstexte zentral)
│   ├── trace.py, compose.py      Logo-Vektorisierung aus tools/logo-referenz.png (nicht öffentlich)
│   └── logo_anim.py              erzeugt public/assets/logo/minar-logo-anim.svg
├── docs/
│   ├── CLOUDFLARE.md             Hosting-Einrichtung (Vorlage für weitere Kundenprojekte)
│   ├── ABSCHLUSSBERICHT.md       Listen A (technisch erledigt) und B (vom Inhaber zu bestätigen)
│   └── logo-intro/               Logo-Intro als Kopiervorlage
├── PRUEFLISTE.md                 Prüfprotokoll
└── index.html, .nojekyll         Übergangsweiterleitung nur für GitHub Pages (nach Migration löschen)
```

## Inhalte pflegen

**Preise und Gerichte:** nur `public/assets/js/menu-data.js` bearbeiten – die Seiten lesen die Daten beim Aufruf. Kein Build nötig.

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
// Getränke zusätzlich: pfand: 0.25 (je Stück, separat ausgewiesen; 0 = kein Pfand, z. B. Ayran)
```

**Google-Bewertungslink:** `restaurant.googleReviewUrl` in `menu-data.js` eintragen (Link aus dem Google-Unternehmensprofil über „Um Rezensionen bitten“, z. B. `https://g.page/r/…/review`) und `node tools/build.mjs` ausführen. Ist das Feld leer, bleiben Button (Kontakt), Footer-Link und der zugehörige Datenschutzabschnitt ausgeblendet.

## Bestellablauf (WhatsApp, Barzahlung)

1. Gerichte in der Speisekarte wählen und konfigurieren (Größe, Soßen, Dips, Extras, Hinweis).
2. Warenkorb „Deine Bestellung“: Menge (− / +, bei 1 entfernt „−“ die Position), „Ändern“ öffnet die Auswahl mit allen bisherigen Werten, „Entfernen“.
3. Abholung oder Lieferung, Angaben, Wunschzeit („so schnell wie möglich“ oder heute in 15-Min.-Schritten, mind. 30 Min. Vorlauf).
4. „Weiter zur Übersicht“ (ggf. vorher Getränke-Abfrage) → Bestellübersicht im Bon-Stil.
5. „Per WhatsApp senden“ öffnet WhatsApp mit der Nachricht an 0163 359 01 88; der Kunde sendet selbst. Keine Bestellnummer, keine Erfolgsmeldung – das Restaurant bestätigt individuell.

Berechnung zentral in `app.js` (`lineCalc`, `totals`): Warenwert, Getränkepfand (0,25 €/Getränk, Ayran 0 €), Lieferkosten je Ort; Mindestbestellwert zählt nur den Warenwert. Bestellannahme Europe/Berlin: Lieferung 11:30–21:15, Abholung 11:30–21:30, Dienstag Ruhetag; außerhalb ist alles gesperrt. Vor „Per WhatsApp senden“ wird mit aktueller Uhrzeit erneut geprüft (auch bei lange offenem Tab).

Anfragenummer `MIN-A-YYYYMM-XXXXXXXX` (Abholung) bzw. `MIN-L-…` (Lieferung): 8 Zeichen aus `23456789ABCDEFGHJKLMNPQRSTUVWXYZ` via `crypto.getRandomValues()`, Jahr/Monat Europe/Berlin bei Erstellung. Sie gehört zum Warenkorb-Entwurf und bleibt bis „Neue Bestellung beginnen“ / „Warenkorb und Angaben löschen“, leerem Warenkorb oder Ablauf gleich; der Wechsel Abholung/Lieferung ändert nur A/L. Keine garantiert einmalige Bestell-ID (keine Datenbank). Ohne sichere Zufallserzeugung wird keine Nummer erzeugt und die Bestellung gesperrt. Mindestbestellwert sperrt bei Lieferung, bis er erreicht ist.

Datensparsamkeit: localStorage `minar-cart-v4` enthält nur die Gerichtsauswahl (Ablauf 12 h), sessionStorage `minar-form-v4` Name/Telefon/Adresse/Anmerkung (endet mit dem Tab). „Warenkorb und Angaben löschen“ entfernt beides.

`codesCheck: true` blendet unsichere Kennzeichnungen aus („auf Anfrage“).

## Designgrundlage (Orange/Grün-Edition)

Die Oberfläche nutzt ausschließlich **Logo-Orange** und **Grün** plus Neutraltöne. Das Logo bleibt im Original (Halal-Siegel auf Kundenwunsch am 12.11.2026 entfernt).

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

```bash
cd public && python3 -m http.server 8000   # → http://localhost:8000 (wie Cloudflare: public/ als Stamm)
```

## Veröffentlichen

**Cloudflare Pages** (Ziel-Hosting): Repository `BraeuerDigital/minar`, Branch `main`, Preset *None*, kein Build-Befehl, Output `public`. Schritt-für-Schritt inkl. Domain (Namecheap) und Abschalten von GitHub Pages: [`docs/CLOUDFLARE.md`](docs/CLOUDFLARE.md).

Es ist bewusst **keine eigene Domain** hinterlegt (keine `CNAME`-Datei, keine DNS-Änderung). Vor dem Livegang: `noindex` entfernen (`tools/build.mjs`, `public/_headers`, `public/robots.txt`), Seiten neu erzeugen und `docs/ABSCHLUSSBERICHT.md` Liste B abarbeiten.

## Logo-Intro (Startseite)

Ablauf: Logo-Aufbau (Sonne → Linien → Siegel → Halbmond → MINAR → Küche → Unterzeile) · ruhiger Stand · Aufbäumen mit dreimaligem, abwechselndem Strampeln beider Vorderläufe · Sammeln und Absprung in die Original-Pose · danach völlig still. Gesamt ca. 5,5 s, keine Schleife.

- **Technik:** Vanilla JS + SVG (ein `requestAnimationFrame`-Loop, keine Bibliothek). Die Tierfigur ist die Original-Silhouette, zerlegt in ein Gelenk-Rig (Huf → Hüfte → Schulter → Ellbogen; der entfernte Vorderlauf nutzt dieselben Originalformen, leicht versetzt hinter dem Körper); Winkel 0 = Original-Pose. Am Ende wird auf die unzerlegte Silhouette umgeschaltet – Endbild pixelgleich zum statischen Logo (geprüft).
- **Abspielen:** bei jedem Aufruf und Neuladen von vorne. `prefers-reduced-motion` oder ohne JavaScript → sofort statisches Logo.
- **Dateien:** `public/assets/logo/minar-logo-anim.svg` (wird von `tools/build.mjs` inline eingesetzt), `public/assets/js/logo-anim.js` (direkt hinter dem SVG laden).
- **Einbau in andere Seiten:** `docs/logo-intro/index.html` enthält SVG, CSS und JS zusammenhängend zum Kopieren.
- **Anpassen:** Zeiten und Posen stehen kommentiert oben in `public/assets/js/logo-anim.js` (Phasen A–E). Nach Änderungen am Rig: `python3 tools/logo_anim.py && node tools/build.mjs`.
