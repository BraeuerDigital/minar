# MINAR Küche – Website

Statische One-Page-Website für **MINAR Küche**, Schussenrieder Straße 21, 88422 Bad Buchau.
Restaurant · Abholung · Lieferservice.

Reines HTML, CSS und Vanilla JavaScript – keine Frameworks, kein Build-Schritt, keine Datenbank, kein Backend.
Lauffähig auf GitHub Pages.

## Struktur

```text
├── index.html        Startseite (Header, Hero, Vorstellung, Speisekarte, Lieferservice, Kontakt, Footer)
├── styles.css        Gestaltung (mobile first)
├── script.js         Speisekarte, Suche, Filter, Warenkorb, WhatsApp-Nachricht, Öffnungsstatus
├── menu-data.js      ALLE Inhalte: Stammdaten, Zeiten, Lieferkonditionen, Kategorien, Gerichte
├── impressum.html    Impressum (Platzhalter!)
├── datenschutz.html  Datenschutzerklärung (Platzhalter!)
├── PRUEFLISTE.md     Interne Liste offener / unsicherer Angaben
├── assets/
│   ├── favicon.svg
│   └── images/       Platz für spätere Originalfotos
└── .nojekyll
```

## Gerichte und Preise pflegen

Nur `menu-data.js` bearbeiten. Der Aufbau eines Gerichts ist oben in der Datei dokumentiert:

```js
{
  nr: "12",
  category: "pizza",
  name: "…",
  description: "…",
  prices: [{ label: "Ø 26 cm", price: 8.5 }, { label: "Ø 32 cm", price: 10.5 }],
  extras: "pizza-belag",          // optional, verweist auf extraGroups
  allergens: ["A", "G"],
  additives: ["1"],
  tags: ["vegetarisch"]
}
```

- Sobald `items` Einträge enthält, erscheinen automatisch Suche, Zähler, „Hinzufügen“-Buttons und der Online-Bestellweg.
- Sobald `delivery.zones` Einträge enthält, erscheint die Tabelle mit Liefergebieten, Mindestbestellwerten und Lieferkosten.
- Sobald `legend` gefüllt ist, erscheint die Allergen-/Zusatzstoff-Legende.

## Warenkorb & WhatsApp

Der Warenkorb läuft komplett im Browser (localStorage). Über „Bestellung per WhatsApp vorbereiten“ öffnet sich
`wa.me` mit einer vorformulierten Nachricht. **Das ist keine verbindliche Bestellung** – sie gilt erst nach
Bestätigung durch das Restaurant. Keine Onlinezahlung. Konzeptdemo; produktive Nutzung mit dem Restaurant abstimmen.

## Lokal ansehen

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Veröffentlichen (GitHub Pages)

Repository → *Settings* → *Pages* → *Deploy from a branch* → `main` / `(root)`.

**Hinweis:** Es ist bewusst **keine eigene Domain** hinterlegt (keine `CNAME`-Datei). Die Seite läuft unter der
GitHub-Pages-Adresse, bis die Domain separat verknüpft wird.

## Datenschutz-Technik

Keine Cookies, kein Tracking, keine externen Schriften, keine eingebettete Karte (nur externer Google-Maps-Link).

## Vor dem Livegang

Siehe `PRUEFLISTE.md` – insbesondere Speisekarte, Lieferkonditionen, Impressum und Datenschutz.
