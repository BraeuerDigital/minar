# Prüfprotokoll – MINAR Küche (Multi-Page-Demo)

Stand: 06.11.2026 · Quellen: zwei Fotos der gedruckten Speisekarte (Kartenstand **04/2023**), freigestellter Logobereich, Farbpalette.

Punkte mit **PRÜFEN** sind auf der Website nicht als gesichert dargestellt oder sollten vor dem Livegang vom Restaurant bestätigt werden.

## A. Wichtigster Punkt

| # | Punkt | Status |
|---|-------|--------|
| A1 | Die Karte trägt den Vermerk **„(04/2023) – Karte ist gültig bis zur Neuerscheinung“**. Alle Preise vom Restaurant auf Aktualität bestätigen lassen. Die Website zeigt den Hinweis „Preise laut gedruckter Speisekarte, Stand 04/2023“. | **bestätigt 06.11.2026** – Preise aktuell |

## B. Übernommene Daten

- 162 Positionen in 18 Kategorien, alle Artikelnummern wie auf der Karte.
- Preise wurden je Abschnitt über die Anzahl zugeordnet (Fotos leicht schräg/gewölbt). In allen Abschnitten stimmt die Zahl der Preise exakt mit der Zahl der Gerichte überein (z. B. Pizza 34/34, Burger 16/16, Salate 12/12).
- Allergen- und Zusatzstoff-Legende vollständig übernommen (A–H, J, K, L, N, O; 1–9) inkl. Hinweisen zu Käse, Hackfleisch und Schinken.
- Liefergebiete, Mindestbestellwerte und Lieferkosten (5 Zonen) vollständig übernommen.

## C. Nicht sicher lesbare Kennzeichnungen

Bei diesen Gerichten zeigt die Website **„Allergene & Zusatzstoffe auf Anfrage“** (`codesCheck: true`):

| Nr. | Gericht | Gelesen (unsicher) | Status |
|-----|---------|--------------------|--------|
| 05 | Thunfischsalat | „D, 9“? | PRÜFEN |
| 06 | Casa Nova | „9“? | PRÜFEN |
| 51 | Frühlingsrollen | „A, 6“ / „A, G“ / „A, B“? | PRÜFEN |
| 139 | Aglio Spaghetti | „A, C, F, 8, 9“? | PRÜFEN |
| 143 | Brokkoli (Nudeln) | „A, C, F, 8“? | PRÜFEN |

Nach Bestätigung in `menu-data.js` `codes: "…"` eintragen und `codesCheck` entfernen.

Ebenfalls kurz bestätigen: **54 Chicken Nuggets** gelesen als „A, 7“.

## D. Interpretationen (bitte bestätigen)

| # | Punkt | Umsetzung auf der Website | Status |
|---|-------|---------------------------|--------|
| D1 | Burger „Extra Zusatz“ | mit Pommes **oder** Wedges +3,50 · Jalapeños / Röstzwiebeln je +0,50 · Spiegelei / Käse je +1,00 · Fleisch-Pattie +5,00 · Kässpätzle +7,00 – gilt für alle Burger | PRÜFEN |
| D2 | „Extra Weichkäse 1,00“ im Abschnitt Überbacken | als Extra für alle überbackenen Gerichte | PRÜFEN |
| D3 | Nudeln „überbacken +2,50 €“ | als Extra für alle Nudelgerichte (139–153), nicht für Gnocchi | PRÜFEN |
| D4 | Softdrinks | Coca-Cola, Cola Zero, Fanta, Mezzo Mix, Uludağ, Sprite jeweils 0,33 l 2,25 · 0,5 l 2,50 · 1,0 l 3,50 | PRÜFEN |
| D5 | Red Bull 3,50 | ohne Größenangabe (Karte nennt keine) | PRÜFEN |
| D6 | Salat-Dressing | Auswahl Essig & Öl / Joghurtsoße bei allen Salaten, ohne Aufpreis | PRÜFEN |
| D7 | 24 / 25 Hamburger XXL, Cheeseburger XXL | Karte zeigt ein Sternchen „*“ ohne Erklärung – nicht übernommen | PRÜFEN |
| D8 | Party Pizza 136 „vier Beläge nach Wahl“ | Beläge über das Hinweisfeld | offen |
| D9 | 96a | heißt auf der Karte ebenfalls „Dönerteller“; zur Unterscheidung „Dönerteller mit Beilage“ | PRÜFEN |
| D10 | Kategorie „Schnitzel und Steak“ | Karte enthält nur Schnitzel (180–184), kein Steak | PRÜFEN |
| D11 | 99, 99a, 116, 131–134a, 39, 66, 205, 206 u. a. | Karte zeigt keine Kennzeichnung → keine angezeigt. Legende weist darauf hin, dass fehlende Kennzeichnung nicht „allergenfrei“ bedeutet | PRÜFEN |
| D12 | Napoli (140) 9,00 € | so gedruckt (andere Preise enden auf ,90) | PRÜFEN |

## E. Korrigierte Schreibweisen

Coctail → Cocktail · Quattro Formaggie → Quattro Formaggi · Chesse-Garnelen → Cheese-Garnelen · Vegetarische Burger → Vegetarischer Burger · Hähnschenbrust → Hähnchenbrust · Hotcoctailsoße → Hot-Cocktailsoße · Rost Zwiebel → Röstzwiebeln · Rosti → Rösti · Hawai (Schnitzel) → Hawaii · Coockie → Cookie · Ben & Jerry → Ben & Jerry’s · Schwäbische Teller → Schwäbischer Teller · Uludag → Uludağ · Schwefeloxide/Sulfide → Schwefeldioxid/Sulfite. Gerichtsnamen wie „Arrabiata“, „Diabolo“ und „Kebap“ wurden wie gedruckt belassen.

## F. Stammdaten

| # | Angabe | Status |
|---|--------|--------|
| F1 | Schussenrieder Straße 21, 88422 Bad Buchau · Tel. 07582 934 69 44 · WhatsApp 0163 359 01 88 | laut Karte, Aktualität PRÜFEN |
| F2 | Täglich 11:30–21:30 Uhr, Dienstag Ruhetag, Bestellannahme bis 21:15 Uhr | laut Karte, PRÜFEN (Feiertage/Urlaub) |
| F3 | Ist die WhatsApp-Nummer für Bestellungen freigegeben? | PRÜFEN |
| F4 | Domain `www.minar-buchau.de` – **bewusst nicht verknüpft** (kein CNAME) | offen |
| F5 | Halal-Kennzeichnung: auf Wunsch aus dem Flyer übernommen (Logo, Header, Startseite, Speisekarte, Über uns). Formulierung: „Halal – wie auf unserer gedruckten Speisekarte gekennzeichnet.“ Keine Zertifizierung oder Zertifizierungsstelle genannt. Vom Kunden bestätigt (06.11.2026). | erledigt |

## G. Rechtliches

| # | Punkt | Status |
|---|-------|--------|
| G1 | Impressum: Inhaber/Firma, Rechtsform, Vertretungsberechtigte, E-Mail, ggf. Register, USt-IdNr., Verbraucherstreitbeilegung | Platzhalter |
| G2 | Datenschutzerklärung: Verantwortlicher, Rechtsgrundlagen, Hosting (GitHub Pages/USA), WhatsApp, Betroffenenrechte | Platzhalter |
| G3 | Rechtliche Prüfung beider Texte vor Livegang | offen |
| G4 | LMIV: Allergeninformation online – Vollständigkeit vom Restaurant bestätigen lassen | PRÜFEN |

## H. WhatsApp-Warenkorb

| # | Punkt | Status |
|---|-------|--------|
| H1 | Konzeptdemo – produktive Nutzung mit dem Restaurant abstimmen | offen |
| H2 | Hinweis „keine verbindliche Bestellung bis zur Bestätigung“ sichtbar | erledigt |
| H3 | Keine Onlinezahlung, keine automatische Annahme | erledigt |
| H4 | Mindestbestellwert wird angezeigt, blockiert aber nicht (Karte: „kontaktieren Sie uns …“) | erledigt |

## I. Logo, Marke & Bilder

| # | Punkt | Status |
|---|-------|--------|
| I1 | Logo wurde aus dem gelieferten, freigestellten Logobereich (`assets/logo/logo-referenz.png`) **vektorisiert** (Konturverfolgung, keine Neuinterpretation): Sonnen-Emblem, springende Ziege, rote Zierlinien, Schriftzug „MINAR Küche“, Halal-Siegel, Halbmond mit Stern. Die Referenz wirkt bereits digital aufbereitet – bitte bestätigen, dass sie dem Originallogo entspricht. | **bestätigt 06.11.2026** |
| I2 | Für eine exakte Wiedergabe (Druckqualität, Originalschrift) die **Original-Logodatei** (AI/EPS/PDF/SVG) beim Restaurant oder der Druckerei anfragen. Feine Details (Hornspitzen, Schriftkonturen, Schattenwirkung) sind aus der Bildvorlage nachgezogen. | offen |
| I3 | Logo-Grün aus der Vorlage (`#476A0B`) weicht von der Palette (`#646C3E`) ab. Logo bleibt originalgetreu, die Oberfläche nutzt die Palette. | bestätigen |
| I4 | Palettenwerte sind aus Fotos abgeleitet – ohne Druckdaten nicht farbverbindlich. | offen |
| I5 | Arabischer Schriftzug im Siegel wurde als Grafik übernommen, nicht neu gesetzt. | erledigt |
| I6 | Keine Food- oder Restaurantfotos verwendet (keine Nutzungsrechte). Platzhalter auf „Über uns“ (`data-image-slot`), Fotos später in `assets/images/`. | offen |
| I7 | Schriften: Systemschriften (Bookman/Georgia für Überschriften), keine externen Font-Server. | erledigt |

## J. Durchgeführte Tests (06.11.2026, Chrome headless)

| Test | Ergebnis |
|------|----------|
| Alle 26 Seiten über lokalen Server unter Projektpfad `/minar/` (wie GitHub Pages) geladen | keine JS-Fehler, keine 404 |
| Alle internen Links und Dateipfade | 0 defekte Links |
| Seitliches Scrollen bei 390 px Breite | auf keiner Seite |
| Aktive Navigation | korrekt auf allen Hauptseiten |
| Gerichte je Kategorieseite | Summe 162 = Datenbestand |
| Warenkorb über mehrere Seiten (Burger mit Extra, Dönerteller mit Beilage, Getränk) | Summen korrekt (z. B. 2 × (18,90 + 7,00) = 51,80 €) |
| Lieferort-Auswahl mit Mindestbestellwert und Lieferkosten | korrekt |
| WhatsApp-Link | `wa.me/491633590188` mit vollständiger Nachricht |
| Suche (Name, Zutat, Nummer `96a`) | funktioniert |
| Mobile Navigation | öffnet/schließt, echte Seitenwechsel |

Nicht getestet: echte Mobilgeräte (iOS Safari/Android), Screenreader, Veröffentlichung auf GitHub Pages selbst.
