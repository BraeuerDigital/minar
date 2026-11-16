# MINAR Küche – Checkout, WhatsApp-Bestellung und rechtliche Transparenz

Stand: 16.11.2026 · Grundlage: Quellcode `BraeuerDigital/minar` (`main`), `docs/COMPLIANCE-CHECK.md`, Masterprompt „Checkout, WhatsApp-Bestellung, Vertragsannahme“.

> **Kein produktionsreifer, verbindlicher Checkout.** Die Absendehandlung über WhatsApp ist rechtlich nicht abschließend geklärt (Abschnitt H). Vor dieser Klärung darf die Bestellstrecke nicht als rechtlich freigegeben gelten. Dieser Bericht ist eine technische Prüfung, keine Rechtsberatung.

## A. Statischer Checkout – Stand

Die Architektur bleibt unverändert und rein statisch: keine Datenbank, kein Backend, keine Cloudflare Workers, keine WhatsApp-API, keine Onlinezahlung. Die Website erzeugt einen `https://wa.me/491633590188?text=…`-Link. Senden muss der Kunde selbst in WhatsApp. Eine Erfolgs- oder Eingangsmeldung zeigt die Website nicht an.

| Schritt | Umsetzung |
|---|---|
| 1 Gerichte wählen | Speisekarte mit Varianten, Soßen (2 inklusive + weitere gegen Aufpreis), Extras, Beläge (Partypizza: genau 4), Hinweis je Gericht |
| 2 Warenkorb | Seite „Bestellen“ und Drawer von unten. Je Position: Name, Nr., Menge, Variante, Optionen mit Aufpreis, Hinweis, Einzelpreis, Positionssumme, Pfand. Menge, Ändern und Entfernen jederzeit möglich |
| 3 Angaben | Abholung: Name, Telefon, Wunschzeit. Lieferung zusätzlich Lieferort (nur bestätigte Orte), Straße und Hausnummer (Pflicht) sowie **neu** Adresszusatz (optional) |
| 4 Übersicht | Bon mit Bestellreferenz, allen Angaben und Positionen, Warenwert, Liefergebühr, Getränkepfand, Gesamtbetrag, Barzahlung, Vertragsschluss-Hinweis, Frische-/Lieferzeit-Hinweis, WhatsApp-Datenhinweis, Links zu Impressum und Datenschutz, **neu** „Übersicht drucken / als PDF speichern“ |
| 5 „Weiter zu WhatsApp“ | unmittelbar davor deutlicher Hinweis auf die Absendehandlung und das verbindliche Kundenangebot (über `aria-describedby` mit dem Button verknüpft). Direkt vor dem Öffnen werden Öffnungszeiten, Wunschzeit und Pflichtangaben erneut geprüft |
| 6–7 Senden | nur durch den Kunden in WhatsApp |
| 8–11 Annahme | individuell durch MINAR per WhatsApp (Schnellantworten, siehe `docs/WHATSAPP-SCHNELLANTWORTEN.md`) |
| 12 Zahlung | ausschließlich bar – Hinweis am Anfang (Kasten „Vor dem Bestellen“), im Warenkorb, im Bon und in der Nachricht |

### Umgesetzte Änderungen (16.11.2026)

- **Website-Button:** „Per WhatsApp senden“ heißt jetzt „Weiter zu WhatsApp“. Bewusst **nicht** „zahlungspflichtig bestellen“, weil der Button nur WhatsApp öffnet (siehe H).
- **Hinweis vor dem Button:** „Weiter zu WhatsApp“ öffnet nur die vorbereitete Bestellnachricht. Erst das eigene Absenden in WhatsApp übermittelt die Bestellung und ist nach dem vorgesehenen Modell ein verbindliches, zahlungspflichtiges Angebot. Ein Vertrag kommt erst durch die ausdrückliche Annahme zustande.
- **Box „So funktioniert Ihre Bestellung“** (standardmäßig geöffnet): Text nach Vorgabe, an die auf der Website durchgängig verwendete Sie-Form angepasst. Ergänzt um Korrekturmöglichkeit, Vertragssprache (Deutsch), Speicherung (Website speichert keine Bestellungen, die Nachricht bleibt im WhatsApp-Chat, der Bon lässt sich drucken oder als PDF speichern) und Links zu den Rechtstexten.
- **Kasten „Vor dem Bestellen“** am Anfang des Warenkorbs: nur Barzahlung, Liefergebiete (Link) mit Mindestbestellwert und Liefergebühr, Bestellzeiten, Vertragsschluss erst durch Annahme.
- **„Frische Zubereitung & Lieferzeit“** bei der Zeitauswahl und im Bon (sinngemäß nach Flyer): 20–90 Minuten je nach Entfernung und Bestellaufkommen, gerechnet ab Annahme der Bestellung, keine garantierte Zeit. Die gewählte Uhrzeit ist eine Wunschzeit, die bestätigte Zeit kommt per WhatsApp. Im Bon steht zusätzlich „(unverbindlich)“ hinter der Wunschzeit.
- **Liefergebiet:** Die Option „Anderer Ort (auf Anfrage)“ ist entfernt. Nur bestätigte Orte sind wählbar, dazu kommt der Hinweis „Ihr Ort ist nicht aufgeführt? … gerne zur Abholung oder telefonisch nachfragen“.
- **WhatsApp-Nachricht:** neues Format „MINAR KÜCHE – BESTELLUNG“ mit Bestellreferenz, Bestellart, Name, Telefon, Lieferadresse, Wunschzeit, allen Positionen, Warenwert, Liefergebühr, Pfand, GESAMTBETRAG, Zahlungsart und der vorgegebenen Abschlusserklärung. Die Werte stammen aus derselben Berechnung wie Warenkorb und Bon und werden mit `encodeURIComponent` übertragen.
- **Bezeichnung:** „Anfragenummer“ heißt jetzt „Bestellreferenz“ (Warenkorb, Bon, Nachricht, Datenschutz). Format und Logik sind unverändert.
- **Google-Bewertungslink** des Auftraggebers ist eingetragen. „Jetzt auf Google bewerten“ steht auf der Kontaktseite und im Footer, öffnet in neuem Tab mit `noopener noreferrer`. Der Datenschutzabschnitt dazu ist jetzt aktiv.
- **Datenschutzerklärung:** Abschnitt heißt „Bestellung über WhatsApp“. Button-Bezeichnung, Bestellreferenz und Adresszusatz wurden ergänzt.

## B. Digitaler Bon

Reihenfolge: MINAR Küche mit Adresse → Bestellreferenz → Bestellart, Name, Telefon, Lieferadresse, Wunschzeit (unverbindlich), Anmerkung → Positionen mit allen Optionen, Einzel- und Pfandangabe → Warenwert, Liefergebühr, Getränkepfand, Gesamtbetrag → Barzahlung → Frische-/Lieferzeit → „weder Rechnung noch Bestellbestätigung, Vertrag erst durch ausdrückliche Annahme“ → Zeitstempel. Darunter: Hinweis zur verbindlichen Bestellung, Button „Weiter zu WhatsApp“, Datenschutzhinweis, Drucken/PDF, Impressum, Datenschutz, „Zurück und ändern“. Die Druckansicht zeigt nur den Bon (getestet: 1 Seite PDF).

## C. WhatsApp-Nachricht (Beispiel aus dem Test, Abholung)

```
MINAR KÜCHE – BESTELLUNG

Bestellreferenz: MIN-A-202611-DLV55EH8
Bestellart: Abholung
Name: Max
Telefon: 0170 1234567
Wunschzeit: so schnell wie möglich

BESTELLUNG

1 × Nr. 93 Dürüm – 9,70 €
- Soßen: Dönersoße
- Weitere Soßen: BBQ Soße (+1,20 €)
- Schärfe: scharf
- Hinweis: ohne Zwiebeln

1 × Nr. 136 Partypizza – 34,00 €
- Beläge: Salami, Champignons, Paprika, Oliven

Warenwert: 50,70 €
Liefergebühr: entfällt (Abholung)
Pfand: 0,00 €
GESAMTBETRAG: 50,70 €

Zahlungsart: Barzahlung bei Abholung

Ich möchte die aufgeführten Artikel zu den angegebenen Konditionen verbindlich bestellen. Mir ist bekannt, dass der Vertrag erst durch die ausdrückliche Annahme von MINAR Küche zustande kommt und die Bezahlung bar bei Abholung erfolgt.
```

## D./E. Schnellantworten

Texte und Einrichtungsanleitung: `docs/WHATSAPP-SCHNELLANTWORTEN.md`.

## F. Pflichtinformationen – technische Überprüfung

| Information | Wo auf der Website | Status |
|---|---|---|
| Identität, Anschrift, Kontakt | Impressum (jede Seite), Bon-Kopf | vorhanden |
| Wesentliche Eigenschaften der Waren | Speisekarte, Warenkorb, Bon (alle Optionen) | vorhanden |
| Gesamtpreis inkl. USt., Liefergebühr, Pfand | Warenkorb, Bon, Nachricht | vorhanden |
| Zahlungsmittel (nur bar) | Kasten „Vor dem Bestellen“, Warenkorb, Bon, Nachricht | vorhanden (zu Beginn des Ablaufs) |
| Lieferbeschränkungen (Orte, Mindestwert) | Kasten „Vor dem Bestellen“, Lieferservice-Seite, Ortsauswahl | vorhanden (zu Beginn des Ablaufs) |
| Liefer-/Leistungszeit | Frische-/Lieferzeit-Hinweis, Wunschzeit | vorhanden, Bezugspunkt vom Inhaber zu bestätigen |
| Technische Schritte zum Vertragsschluss | „So funktioniert Ihre Bestellung“ | vorhanden |
| Korrekturmöglichkeit | Warenkorb, „Ändern“, „Zurück und ändern“ | vorhanden |
| Vertragssprache | „So funktioniert Ihre Bestellung“ | vorhanden (Deutsch) |
| Speicherung des Vertragstexts / Abruf | Hinweis: keine Speicherung durch die Website, Nachricht im WhatsApp-Chat, Bon druckbar/PDF | vorhanden – rechtlich zu prüfen (H 3) |
| Zugangsbestätigung (§ 312i Abs. 1 Nr. 3 BGB) | keine automatische – nur persönliche WhatsApp-Antwort | **offen** (H 3) |
| Widerrufsrecht / Ausnahmen | **nicht** auf der Website | **offen** (H 5) |
| Button-Beschriftung (§ 312j Abs. 3 BGB) | „Weiter zu WhatsApp“ + Hinweis | **offen / Schwachstelle** (H 1) |
| Datenschutz vor WhatsApp | Hinweis im Bon mit Link | vorhanden |
| Streitbeilegung | keine Angabe (Entscheidung Inhaber) | rechtlich zu bestätigen |

## G. Preise und Umsatzsteuer

**Technisch:** Alle Verkaufspreise sind Bruttopreise und bleiben unverändert. Es wird **keine** Umsatzsteuer aufgeschlagen. Berechnet wird centgenau: Positionen = (Grundpreis + Optionen) × Menge, gerundet auf Cent. Warenwert = Summe der Positionen. Pfand = 0,25 € × Anzahl pfandpflichtiger Getränke. Liefergebühr je Ort. Gesamt = Warenwert + Pfand + Liefergebühr. Der Mindestbestellwert prüft nur den Warenwert. Die Website weist **keine Steuerbeträge** aus, sondern nur „inkl. gesetzlicher Umsatzsteuer“. Der Bon ist ausdrücklich keine Rechnung.

**Steuerliche Einordnung (zur Prüfung durch die Steuerberatung, keine Steuerberatung):**

- Speisen (Abholung und Lieferung): seit 1. Januar 2026 gilt für Speisen in der Gastronomie dauerhaft der ermäßigte Satz von 7 %, egal ob vor Ort, zum Mitnehmen oder geliefert. Getränke unterliegen grundsätzlich weiter 19 %. Quellen: IHK, fuer-gruender.de.
- Softdrinks (Cola, Fanta, Wasser, Eistee, Red Bull …): 19 %.
- **Ayran:** Nicht alle Getränke unterliegen 19 %; bestimmte Milchmischgetränke sind ausgenommen (Quelle: sevdesk). Ob Ayran darunter fällt, hängt vom Milchanteil des konkreten Produkts ab und ist zu prüfen.
- **Pfand:** steuerlich in der Regel wie das Getränk zu behandeln (Nebenleistung), zu prüfen.
- **Liefergebühr und Kombiangebote** (z. B. Menüs mit Getränk, gemischte Bestellungen): Aufteilung auf die Steuersätze nach anerkannter Methode – mit der Steuerberatung klären.
- **Steuerstatus:** Regelbesteuerung oder Kleinunternehmer (§ 19 UStG)? Eine USt-IdNr. ist vorhanden, das spricht für Regelbesteuerung, ist aber zu bestätigen. Bei Kleinunternehmerregelung wäre „inkl. gesetzlicher Umsatzsteuer“ falsch und müsste ersetzt werden.

Weil der Steuerstatus nicht bestätigt ist, zeigt die Website bewusst keine Netto- und Steuerbeträge an.

## H. Rechtliche Bewertung der WhatsApp-Absendehandlung (offen)

**Vertragsmodell:** Die WhatsApp-Nachricht des Kunden soll ein verbindlicher Antrag sein (§ 145 BGB), den MINAR durch die persönliche Antwort annimmt (§§ 147 ff. BGB). Eine Annahme mit Änderungen (andere Zeit, fehlender Artikel, anderer Preis) gilt nach § 150 Abs. 2 BGB als Ablehnung mit neuem Antrag. Dann muss der Kunde zustimmen. Die Schnellantworten sind deshalb **nur** für unveränderte Bestellungen gedacht. Ein automatischer Gegenangebotsprozess wurde bewusst nicht programmiert.

**Konkrete Schwachstelle:**

1. **§ 312j Abs. 3 und 4 BGB – Button-Lösung.** Bei Verbraucherverträgen im elektronischen Geschäftsverkehr muss die Bestellsituation so gestaltet sein, dass der Verbraucher ausdrücklich bestätigt, sich zu einer Zahlung zu verpflichten. Bei einer Schaltfläche geschieht das typischerweise mit „zahlungspflichtig bestellen“. Die abschließende Handlung ist hier aber der **Senden-Pfeil in WhatsApp**, den MINAR nicht beschriften kann. Der Website-Button „Weiter zu WhatsApp“ ist nicht die Bestellhandlung, und die Abschlusserklärung im Nachrichtentext ersetzt die vorgeschriebene Beschriftung womöglich nicht. Die Verbindlichkeit des Kundenangebots ist damit **nicht gesichert**.
2. **BGH, Urteil vom 09.10.2025 – I ZR 159/24:** Der BGH hat entschieden, dass ohne gesetzeskonforme Beschriftung nach § 312j Abs. 4 BGB keine vertragliche Bindung entsteht (Quelle: anwaltonline). Eine Heilung durch bloßes Vertragsverhalten gibt es nicht, nur durch eine ausdrückliche spätere Bestätigung nach § 141 Abs. 1 BGB, die selbst den Anforderungen des § 312j Abs. 3 BGB genügen muss (Quelle: anwaltonline). Eine nachträgliche Genehmigung nach § 184 Abs. 1 BGB scheidet aus (Quelle: otto-schmidt). Ein zusätzliches Häkchen ändert daran nichts: Entscheidend bleibt allein die eindeutige Beschriftung der Schaltfläche (Quelle: anwaltonline).
   **Bedeutung für MINAR:** Sollte § 312j Abs. 3 BGB anwendbar und nicht erfüllt sein, käme durch Kundennachricht und Annahme kein wirksamer Vertrag zustande. Abholung oder Bezahlung würden das nicht heilen. Bei Barzahlung bei Übergabe ist das wirtschaftliche Risiko vor allem bei Nichtabholung und Annahmeverweigerung relevant.
3. **§ 312j Abs. 5 BGB – Ausnahme für ausschließlich individuelle Kommunikation:** Die Nachricht wird von der Website standardisiert vorformuliert und nur vom Kunden abgeschickt. Ob das noch „ausschließlich individuelle Kommunikation“ ist, ist **zweifelhaft**. Die Ausnahme wurde **nicht** unterstellt.
4. **§ 312i BGB:** Pflicht zur unverzüglichen elektronischen Zugangsbestätigung (Abs. 1 Nr. 3) und Abrufbarkeit der Vertragsbestimmungen (Abs. 1 Nr. 4). Klären, ob die persönliche Antwort per WhatsApp als Zugangsbestätigung genügt und ob die Ausnahme für individuelle Kommunikation (§ 312i Abs. 2 BGB) greift.
5. **§ 312g BGB / Art. 246a EGBGB – Widerrufsrecht:** In Betracht kommen Ausnahmen für schnell verderbliche Waren und für Speisenlieferung zu einem bestimmten Termin. Ob und wie über das Nichtbestehen des Widerrufsrechts zu informieren ist, ist **offen**. Auf der Website steht bewusst nichts dazu.
6. **§ 312f BGB:** Vertragsbestätigung auf dauerhaftem Datenträger. Prüfen, ob die WhatsApp-Nachrichten genügen.
7. **Art. 246c EGBGB:** Informationen im elektronischen Geschäftsverkehr (technische Schritte, Speicherung, Korrektur, Sprachen). Auf der Website umgesetzt, Vollständigkeit prüfen.
8. **Anwendungsbereich:** Prüfen, ob und welche Ausnahmen des § 312 BGB für Speisenlieferungen greifen.

**Was für die Freigabe geklärt werden muss:** Eine Fachperson muss bewerten, ob der Ablauf in der jetzigen Form genügt. Mögliche Lösungsrichtungen, die vorher fachlich geprüft werden müssen und hier **nicht** umgesetzt sind:

- **a)** Die Website-Nachricht ist nur eine unverbindliche Anfrage. MINAR macht das verbindliche Angebot individuell per WhatsApp mit Preis und Zeit, und der Kunde nimmt es an. Das widerspricht dem gewünschten Modell eines verbindlichen Kundenangebots.
- **b)** Eine echte Bestellschaltfläche auf der Website, was ein Backend bzw. einen Bestellempfang erfordert, ausdrücklich nicht gewünscht.
- **c)** Bestätigung im Chat mit Formulierung nach § 312j Abs. 3 BGB.

## I. Vor dem öffentlichen Launch freizugeben

1. **Rechtliche Freigabe der Bestellstrecke** (H 1–8), insbesondere Button-Lösung und BGH I ZR 159/24.
2. Widerrufsinformation bzw. Hinweis auf gesetzliche Ausnahmen (H 5).
3. Zugangsbestätigung und Vertragstextspeicherung (H 3, 4, 6).
4. Steuerstatus (Regelbesteuerung oder § 19 UStG) und Steuersätze für Ayran, Pfand, Liefergebühr und Kombiangebote (G).
5. **Ayran-Pfand:** Owner-Angabe „ohne Pfand“ vom 12.11.2026. Die Verpackung (Einweg-Kunststoff oder Dose wäre grundsätzlich pfandpflichtig) muss nachweislich geprüft werden, bis dahin bleibt es ein offener Prüffall.
6. Bezugspunkt der Lieferzeit „ab Annahme der Bestellung“ bestätigen.
7. Aufpreis weitere Döner-Soßen (1,20 €) und Belagliste der Partypizza bestätigen.
8. Schnellantworten im Restaurant einrichten und Ablauf bei Änderungen schulen (§ 150 Abs. 2 BGB).
9. Impressum (keine Register- und Streitbeilegungsangaben) und Datenschutzerklärung fachlich freigeben.
10. Cloudflare-Migration kurz vor Launch (keine DNS-, Domain- oder Hostingänderung bis dahin). Danach GitHub Pages abschalten, die Datenschutzerklärung trifft erst dann zu.
11. Google-Bewertungslink und Maps-Link einmal auf dem Handy prüfen.

## Tests (16.11.2026, Headless Chrome, lokaler Server mit `public/` als Stamm)

- Abholung (Döner mit Extra-Soße, Partypizza, Burger) und Lieferung (Pizza + Cola, Kanzach, Adresszusatz): Positionen, Optionen, Pfand, Liefergebühr, Mindestwert und Gesamt korrekt; Nachricht vollständig, Ziel `wa.me/491633590188`
- Kein „anderer Ort“ wählbar; Mindestbestellwert sperrt
- Öffnungszeiten-Szenarien (vor Öffnung, Öffnung, 18:00, 21:10, 21:20, 21:31, Montagnacht, Dienstag, Sommerzeit, UTC-Rechner)
- Bestellreferenz: 25 Prüfungen bestanden, inkl. mehrfach geöffnetem WhatsApp (keine neue Referenz). Belastungstest mit 100.000 Kennungen ohne Formatfehler und Doppelung in diesem Lauf
- Keine Erfolgsmeldung nach dem Öffnen (nur neutraler Hinweis)
- Druckansicht/PDF: nur der Bon, 1 Seite
- Drawer und Wischgeste, Navigation, alle Links und Ressourcen, 6 Breiten ohne seitliches Scrollen, 0 JavaScript-Fehler, 0 externe Anfragen beim Seitenaufruf
- Nicht getestet: echtes Absenden in WhatsApp (keine echten Bestellungen), echte Mobilgeräte, Google-Links im Internet (keine Netzverbindung aus der Testumgebung)
