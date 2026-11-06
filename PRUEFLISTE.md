# Interne Prüfliste – MINAR Küche

Stand: 06.11.2026 · Nicht öffentlich verlinkt.

Alles, was hier mit **PRÜFEN** markiert ist, ist auf der Website **nicht** als gesicherte Information veröffentlicht.

## A. Fehlende Quelle

| # | Punkt | Status |
|---|-------|--------|
| A1 | **Fotos der gedruckten Speisekarte lagen bei der Erstellung nicht vor.** Es wurden daher keine Gerichte, Artikelnummern, Preise, Beschreibungen, Größen, Zusatzoptionen, Allergene oder Zusatzstoffe übernommen. `items` in `menu-data.js` ist leer. | PRÜFEN |
| A2 | Kategorien wurden aus der Projektbeschreibung übernommen (18 Kategorien). Abgleich mit der Originalkarte: Reihenfolge, genaue Schreibweise, ggf. fehlende Kategorien. | PRÜFEN |

## B. Speisekarte (nach Eingang der Fotos)

| # | Punkt | Status |
|---|-------|--------|
| B1 | Alle Gerichte mit Artikelnummer, Name, Beschreibung, Preis(en) eintragen | offen |
| B2 | Größenvarianten (z. B. Pizza, Partypizza) | offen |
| B3 | Zusatzoptionen & Aufpreise (`extraGroups`) | offen |
| B4 | Allergen-Legende (`legend.allergens`) – Kürzel exakt wie auf der Karte | offen |
| B5 | Zusatzstoff-Legende (`legend.additives`) | offen |
| B6 | Kennzeichnung vegetarisch / scharf nur, wenn auf der Karte angegeben | offen |
| B7 | Jeden schwer lesbaren Preis / jedes Allergen einzeln hier aufführen, **nicht schätzen** | offen |

## C. Lieferservice

| # | Punkt | Status |
|---|-------|--------|
| C1 | Liefergebiete | PRÜFEN |
| C2 | Mindestbestellwerte je Gebiet | PRÜFEN |
| C3 | Lieferkosten je Gebiet | PRÜFEN |
| C4 | Ob Bestellannahme bis 21:15 Uhr für Lieferung **und** Abholung gilt | PRÜFEN |

Bis zur Klärung zeigt die Website: „Liefergebiete, Mindestbestellwerte und Lieferkosten nennen wir Ihnen gerne bei Ihrer Bestellung.“

## D. Stammdaten (laut Flyer – Aktualität bestätigen)

| # | Angabe | Status |
|---|--------|--------|
| D1 | Schussenrieder Straße 21, 88422 Bad Buchau | PRÜFEN (Aktualität) |
| D2 | Telefon 07582 934 69 44 | PRÜFEN (Aktualität) |
| D3 | WhatsApp 0163 359 01 88 – ist die Nummer für WhatsApp-Bestellungen freigegeben? | PRÜFEN |
| D4 | Öffnungszeiten 11:30–21:30 Uhr, Dienstag Ruhetag, an allen anderen Tagen gleich? | PRÜFEN |
| D5 | Feiertags- und Urlaubsregelung | PRÜFEN |
| D6 | Website laut Flyer `www.minar-buchau.de` – **bewusst nicht verknüpft** (kein CNAME, keine Domain in GitHub Pages) | offen |

## E. Rechtliches

| # | Punkt | Status |
|---|-------|--------|
| E1 | Impressum: Inhaber/Firma, Rechtsform, Vertretungsberechtigte, E-Mail, ggf. Register, USt-IdNr., Verbraucherstreitbeilegung | Platzhalter |
| E2 | Datenschutzerklärung: Verantwortlicher, Rechtsgrundlagen, Hosting (GitHub Pages/USA), WhatsApp, Betroffenenrechte | Platzhalter |
| E3 | Rechtliche Prüfung beider Texte vor Livegang | offen |

## F. WhatsApp-Warenkorb

| # | Punkt | Status |
|---|-------|--------|
| F1 | Konzeptdemo – produktive Nutzung mit dem Restaurant abstimmen | offen |
| F2 | Klarstellung „keine verbindliche Bestellung bis zur Bestätigung“ ist im Warenkorb sichtbar | erledigt |
| F3 | Keine Onlinezahlung, keine automatische Annahme | erledigt |

## G. Bilder & Marke

| # | Punkt | Status |
|---|-------|--------|
| G1 | Es wurden keine Fotos und kein Originallogo verwendet; Wortmarke und Bogen-Grafik sind neu gestaltet. Freigabe durch das Restaurant einholen. | offen |
| G2 | Optional: eigene Fotos (Gerichte, Gastraum) in `assets/images/` | offen |
