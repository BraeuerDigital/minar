# MINAR Küche – Lieferando-Abgleich, Extras, Allergene, Zusatzstoffe, Umsatzsteuer

Stand: 16.11.2026 · Matrizen: `docs/SPEISEKARTE-MATRIZEN.md` (erzeugt mit `node tools/pruefung.mjs`)

## A. Quellen und Zugriff

- **Gedruckte Speisekarte**: maßgebliche Quelle für Preise, Beschreibungen und Kennzeichnungen. Die Bruttopreise wurden nicht verändert.
- **Lieferando**: Die Lieferando-Seite war von hier aus nicht abrufbar. Erreichbar war nur der Lieferando-Shop `minarkuechebadbuchau.de`, und zwar ausschließlich die Kategorie- und Artikellisten.
- **Was dort fehlt**: Die Produkt-Konfiguratoren (Extras, Pflichtauswahlen) ließen sich ohne Interaktion bzw. Anmeldung nicht öffnen. Es wurden keine Zugangsbeschränkungen umgangen.
- **Betreiber-Notizen (handschriftlich, 16.11.2026)** und **Screenshot „Menü für 1 Person“** (Stückzahlen gestrichen) liegen vor und sind umgesetzt (siehe D).

## B. Lieferando-Abgleich – Ergebnisse

| Thema | Lieferando | Website | Status |
|---|---|---|---|
| Partyplatten | 34,90 € (2 P.) | 34,90 / 48,90 € | übereinstimmend (2 P.) |
| Menü für 1 Person | 18,50 €; Burger 20/21/23, je 2 Wings, Onion Rings, Frühlingsrollen, Mozzarella Sticks, Nuggets, Pommes | 18,50 €, Text laut Vorgabe ohne Stückzahlen | übereinstimmend; Wedges-Option und Getränk laut Betreiber, auf Lieferando nicht sichtbar |
| Dips 1,20 € | Dönersoße, Sweet Chili, Minar-Spezial, BBQ, Cocktail, Hot-Cocktail | gleich | übereinstimmend |
| Dips 0,50 € | Mayo, Remoulade, Ketchup | gleich | übereinstimmend |
| Sour Cream | nicht gelistet | 1,20 € (Karte) | **Betreiber bestätigen** |
| Partypizza | 4 Zutaten 34,00 €, Margherita 28,00 € | gleich | übereinstimmend |
| Platten-Beschreibung | ohne Frühlingsrollen, Rösti, Kroketten | mit (laut Karte) | **Betreiber bestätigen** |
| Pfand 1,0 l | 0,15 € (Coca-Cola, Cola Zero, Sprite als „EW PET“, Mezzo Mix/Fanta Mehrweg) | 0,25 € | **Abweichung – Betreiber klären** |
| Red Bull 250 ml | Pfand 0,00 € | 0,25 € | **Abweichung – DPG-Dose: 0,25 € ist gesetzlich üblich, Lieferando prüfen** |
| Ayran | Pfand 0,00 € | 0,00 € | übereinstimmend |
| Uludağ 1,0 l | nicht gelistet | gelistet | Betreiber bestätigen |
| Desserts, Burger, Fingerfood | Preise und Texte | gleich | übereinstimmend |

Lieferando zeigt **keine** Artikelnummern, Allergene, Zusatzstoffe oder Steuersätze. Ein Abgleich dieser Punkte war deshalb nicht möglich.

## C. Umgesetzte Betreiberentscheidungen

### Menü für 1 Person (Nr. 73)
- Der Text entspricht exakt der Vorgabe; nur die Stückzahlen wurden aus der Beschreibung entfernt.
- Die festen Bestandteile lassen sich nicht abwählen.
- Pflichtauswahl: Burger (Nr. 20/21/23), Pommes oder Wedges, 1 Getränk inklusive (ohne Aufpreis).
- **Offen:** Getränkegröße und Pfand für das inklusive Getränk.

### Burger-Platte (Nr. 71)
- Exakt 2 Burger (2 Personen) bzw. 4 Burger (4 Personen), Hamburgerle und Chickenburgerle frei mischbar.
- Auswahl über einen Mengen-Stepper (−/+). „Hinzufügen“ ist gesperrt, bis die Zahl stimmt.
- Beim Wechsel der Variante wird die Auswahl gekürzt.
- Die Auswahl bleibt beim „Ändern“ im Warenkorb erhalten.

### Alle Platten (Nr. 70–72)
- 2 Personen: exakt 2 Soßen inklusive; 4 Personen: exakt 4. Wiederholungen sind erlaubt.
- Zusätzliche Dips nur mit den bestätigten Preisen (1,20 € / 0,50 €).
- Bon und WhatsApp zeigen Sorte und Anzahl, z. B. „Soßen inklusive: 2 × BBQ Soße“.

### Minar-Spezial-Platte (Nr. 72)
- Varianten „2 Personen · 2 kleine Salate“ und „4 Personen · 2 große Salate“.

### Fingerfood-Platte (Nr. 70)
- Inhalt laut Karte, keine erfundenen Abwahloptionen.

### Döner (Nr. 90–96a)
- „Soße im Döner“: bis zu 2, inklusive.
- „SEPARAT IM BECHER“: kostenpflichtige Mengenauswahl, z. B. „SEPARAT IM BECHER: 1 × BBQ Soße (+1,20 €)“.
- Getrennte Gruppen sorgen dafür, dass eine separate Soße nie in den Döner gerät.

### Bestellzeiten
- Bestellannahme für **Lieferung und Abholung bis 21:15 Uhr**. Restaurant Mo und Mi–So 11:30–21:30, Dienstag Ruhetag, Europe/Berlin.
- Keine Vorbestellungen.
- Zwischen 21:15 und 21:30 lautet der Status „Bestellannahme beendet“.
- Alle Texte wurden angepasst.

### Partypizza
- Genau 4 Beläge, strukturierte Auswahl (unverändert, geprüft).

### Burger
- Produktangaben laut Karte (z. B. Hamburgerle 100 g) unverändert.

## D. Allergene

- Die Matrix steht in `SPEISEKARTE-MATRIZEN.md`, Abschnitt 1.
- **Neu:** Artikel ohne Kennzeichnung zeigen jetzt „Allergene & Zusatzstoffe auf Anfrage“. Vorher erschien dort nichts, was als „allergenfrei“ hätte verstanden werden können.
- **Laut Betreiber-Notizen ergänzt (16.11.2026):**

| Nr. | Gericht | Kennzeichnung |
|---|---|---|
| 99 | Istanbul überbacken | A, C, G, F, 6 |
| 116 | Hackfleisch | A, G, F, J, 6, 7, 8 |
| 131 | Sardellen | A, D, G, F, J, 6, 7, 8 |
| 132, 133, 134, 134a | Artischocke, Paprika, Caprese, Oliven | A, G, F, J, 6, 7, 8 |
| 205, 206 | Chicken Vegetables Nudel, Vegetables Nudel | A, G, F |

  Die Angaben sind aus der Handschrift übernommen; der Betreiber sollte die Lesung einmal gegenprüfen (v. a. die letzte Ziffer bei 132–134a).
- **Noch 19 Artikel ohne Kennzeichnung** (zeigen „auf Anfrage“): Salate 01–04 und 10, Nr. 39, Beilagen 40–43 und 45, Nr. 66, Nr. 73 (setzt sich aus gekennzeichneten Einzelartikeln zusammen), Nr. 99a sowie Mineralwasser, Multivitamin, Sprite, Eistee und Red Bull.

## E. Zusatzstoffe

- Die Matrix steht in `SPEISEKARTE-MATRIZEN.md`, Abschnitt 2. Es gelten dieselben 28 offenen Artikel.
- Hinweise zu Käse und Hackfleisch stehen weiterhin in der Legende.

## F. Umsatzsteuer

### Zentrale Konfiguration
- Sie steht in `menu-data.js → tax`.
- `regime: null` – ungeklärt, ob Regelbesteuerung oder § 19 UStG gilt. Die vorhandene USt-IdNr. ist kein Nachweis.
- `confirmed: false` und `showBreakdown: false`.

### Klassen (alle „ungeklärt“)
| Klasse | Satz |
|---|---|
| Speisen | 7 % |
| Getränke | 19 % |
| Ayran | offen – Milchmischgetränk prüfen |
| Kombi-Menü Nr. 73 | offen – keine pauschale 30-%-Vereinfachung |
| Pfand | offen |
| Liefergebühr | offen |

### Logik
- Die Steuer wird aus den Bruttopreisen in ganzen Cent herausgerechnet und nie aufgeschlagen.
- Ausweis auf Bon/WhatsApp nur, wenn die Konfiguration bestätigt ist, Regelbesteuerung gilt **und** jede Position eine bestätigte Klasse hat.
- Getestet mit simulierter Freigabe: 5,00 € Speise → „enth. USt. 7 %: 0,33 € (netto 4,67 €)“.
- Live bleibt der bisherige Satz „inkl. gesetzlicher Umsatzsteuer“.

### Separat zu prüfen
Liefergebühr, Pfand, Ayran, Kombi-Menüs und kostenpflichtige Extras (folgen dem Hauptartikel).

## G. Technische Umsetzung

- Neuer Gruppentyp `count`: Mengen-Stepper, `totalByVariant`, `maxEach`, Mehrfachauswahl.
- Wirkt in Gerichtsdialog, Warenkorb/Drawer, Bestellseite, Bon, Druck/PDF und WhatsApp.
- Bon und WhatsApp fassen Mengen zusammen, z. B. „2 × …“.
- Neues Werkzeug `tools/pruefung.mjs` erzeugt die Matrizen.

## H. Tests

| Test | Ergebnis |
|---|---|
| t150 Burger-Platte | Sperre ohne Auswahl, Stepper-Grenze, 2P/4P-Kürzung ok |
| t150 Preise | Platte mit Extra-Dip 36,10 € (34,90 + 1,20) korrekt |
| t150 Menü | Text exakt; Burger, Beilage und Getränk in Bon und WhatsApp |
| t150 Döner | „Soße im Döner: Cocktailsoße“ und „SEPARAT IM BECHER: 1 × BBQ Soße (+1,20 €)“ |
| t151 Bestellzeiten | Mi 21:10 beide Modi frei · 21:20 beide gesperrt · Di Ruhetag gesperrt |
| t151 Ändern | Mengenauswahl bleibt erhalten |
| t151 Steuer | unbestätigt kein Ausweis, simuliert bestätigt korrekter Ausweis |
| Regression | t54 (29 Seiten, keine Fehler), t60 Bestellreferenz, t95 Drawer, t100 Datenschutz, t110 Lieferung/Druck, t130 Rechtslinks, t140 Klappbereiche – alle ok |

## I. Offene Punkte / Freigaben durch Betreiber

1. Steuerstatus: Regelbesteuerung oder § 19 UStG? Anschließend Bestätigung der Sätze für Ayran, Kombi-Menü, Pfand und Liefergebühr durch den Steuerberater.
2. Pfand für 1,0-l-Flaschen (0,15 € laut Lieferando vs. 0,25 €) und Red Bull.
3. Getränk im Menü für 1 Person: Größe, Auswahl, Pfand.
4. Sour Cream als Dip; Uludağ 1,0 l.
5. Platten-Beschreibungen (Frühlingsrollen, Rösti, Kroketten) – Karte oder Lieferando?
6. Allergene und Zusatzstoffe für die 19 noch offenen Artikel; Lesung der handschriftlich ergänzten Codes gegenprüfen.
7. Pizza-Zusatzbeläge (Upsell) und Partypizza-Belag über 4 hinaus: Laut Notiz Preise von Lieferando – dort im öffentlich erreichbaren Shop nicht sichtbar. Preisliste vom Betreiber nötig, vorher keine Umsetzung.
8. Burger-Belag laut Notiz „100 g Patty, grüner Salat, Tomate, Gurke, Zwiebel“ – Beschreibungen wurden nicht ungefragt umgeschrieben; Freigabe zur Ergänzung offen.
9. In den Notizen steht einmal „Abholung bis 21:15“ und einmal „Abholung 21:30“ – umgesetzt ist 21:15 laut Masterprompt; bitte bestätigen.
10. § 312j-Frage bleibt offen (siehe `CHECKOUT-PRUEFUNG.md`).

## J. Unverändert

Logo/Animation, CI, Design, Struktur, WhatsApp-Kanal, Bestellreferenz, persönliche Annahme, Barzahlung, Liefergebiete, Mindestbestellwerte, Gebühren, Datenschutz, Rechtstexte, Google-Links, Bruttopreise. Statische Seite ohne Backend; keine DNS-Änderungen.
