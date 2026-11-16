# MINAR Küche – Ergänzung der rechtlichen Verbraucherinformationen

Stand: 16.11.2026 · Grundlage: `docs/CHECKOUT-PRUEFUNG.md`, `docs/COMPLIANCE-CHECK.md`, tatsächlicher Quellcode.

> **Keine Freigabe als rechtskonformer Bestellprozess.** Die neuen Seiten verbessern Transparenz und Information. Sie **ersetzen keine** möglicherweise fehlende gesetzeskonforme Bestellschaltfläche nach § 312j Abs. 3 BGB. Die Einordnung der WhatsApp-Absendehandlung bleibt offen und braucht eine fachliche Freigabe (siehe `CHECKOUT-PRUEFUNG.md`, Abschnitt H). Technische und redaktionelle Umsetzung, keine Rechtsberatung.

## 1. Umgesetzte Ergänzungen

| Bereich | Umsetzung |
|---|---|
| **Neue Seite „Bestellinformationen“** (`bestellinformationen.html`) | Vertragspartner, Ablauf in 8 Schritten (Auswahl bis Absenden in WhatsApp und Übergabe), Vertragsschluss (Website-Darstellung kein Angebot, Absenden = beabsichtigte verbindliche Bestellung, Vertrag erst durch ausdrückliche Annahme, Schweigen ist keine Annahme, Ablehnung möglich), Eingangs- und Vertragsbestätigung (keine automatische, Zustellstatus in WhatsApp, persönliche Antwort = Annahme mit bestätigter Zeit), Korrekturen, Vertragssprache und Vertragstext, Preise mit Pfand und Liefergebühr, Tabelle der Liefergebiete (aus den Daten erzeugt), Barzahlung, Bestellzeiten, frische Zubereitung und Lieferzeit, Wunschzeit vs. bestätigte Zeit, wesentliche Änderungen und Verzögerungen, Allergene, Verweis auf Widerruf |
| **Neue Seite „Widerruf & Verbraucherrechte“** (`widerruf.html`) | Überblick je Artikelart, Ausnahmen § 312g Abs. 2 Nr. 1 und 2 BGB für frisch nach Auswahl zubereitete Speisen, **Widerrufsbelehrung nach gesetzlichem Muster** (Anlage 1 zu Art. 246a § 1 Abs. 2 EGBGB) für Getränke in verschlossenen Flaschen und Dosen, **Muster-Widerrufsformular** (Anlage 2), Hinweis auf gesetzliche Mängelhaftung. **Keine** pauschale Aussage, dass bei allen Bestellungen kein Widerrufsrecht besteht. |
| **Checkout (Bestellübersicht/Bon)** | Neuer Block **„Bestellbedingungen auf einen Blick“** direkt vor dem Hinweis zur Absendehandlung und vor „Weiter zu WhatsApp“: Gesamtpreis inkl. USt. mit separatem Pfand und Liefergebühr, nur Barzahlung, Liefergebiete und Mindestwert, Wunschzeit/Lieferzeit, Vertragsschluss und Änderungen, Widerruf (Speisen nein, verschlossene Getränke ja). Die wesentlichen Informationen stehen dort **unmittelbar sichtbar**; die Links zu Bestellinformationen und Widerruf ergänzen, ersetzen sie aber nicht. |
| **Warenkorb (Box „So funktioniert Ihre Bestellung“)** | Widerrufshinweis und Links zu Bestellinformationen, Widerruf, Impressum, Datenschutz |
| **Footer (alle 29 Seiten)** | Impressum · Datenschutz · Bestellinformationen · Widerruf & Verbraucherrechte |
| **Datenschutzerklärung** | Geprüft: WhatsApp, Kundendaten, Browserspeicherung, Hosting, Google-Links, Betroffenenrechte sind abgedeckt und passen zur Technik. Entfernt: der vertragsrechtliche Satz zur Barzahlung, ersetzt durch „Auf der Website werden keine Zahlungsdaten verarbeitet“. Keine Vertragsbedingungen und keine Widerrufsinformationen in der Datenschutzerklärung. |

## 2. Angepasste Dateien

- `tools/build.mjs`: neue Seiten, Footer-Links, Bedingungen im Bon, Box im Warenkorb, Datenschutz-Satz, Bewertungsbereich nicht auf Rechtsseiten
- `public/assets/css/styles.css`: Stile für Rechtsseiten (Tabelle, Kästen, Formularzeilen) und Bedingungen-Block
- `public/bestellinformationen.html`, `public/widerruf.html` (neu, erzeugt) sowie alle übrigen erzeugten Seiten (Footer)
- `docs/VERBRAUCHERINFORMATIONEN.md` (dieser Bericht); `README.md`, `PRUEFLISTE.md`, `ABSCHLUSSBERICHT.md` (Verweise)

Architektur unverändert: statisch, kein Backend, keine Datenbank, keine automatische Annahme, WhatsApp als Bestellkanal. Cloudflare ist noch nicht verbunden. Design und Logo-Animation sind unverändert.

## 3. Vollständigkeit der Verbraucherinformationen (technische Sicht)

| Pflichtinformation (u. a. Art. 246a § 1, Art. 246c EGBGB, § 312j Abs. 1 und 2 BGB) | Ort | Stand |
|---|---|---|
| Wesentliche Eigenschaften | Speisekarte, Warenkorb, Bon | ✓ |
| Identität und Kontakt | Impressum, Bestellinformationen Nr. 1, Widerrufsbelehrung | ✓ |
| Gesamtpreis inkl. Steuern, Liefer- und Zusatzkosten | Warenkorb, Bon, Bedingungen-Block, Bestellinformationen | ✓ |
| Zahlungs-, Liefer- und Leistungsbedingungen, Termin | Kasten „Vor dem Bestellen“, Bedingungen-Block, Bestellinformationen | ✓ |
| Lieferbeschränkungen und Zahlungsmittel spätestens zu Beginn des Bestellvorgangs | Kasten „Vor dem Bestellen“ (oben im Warenkorb und Drawer) | ✓ |
| Widerrufsrecht bzw. Nichtbestehen und Bedingungen | Bedingungen-Block, Widerrufsseite mit Belehrung und Formular | ✓ (Inhalt zu prüfen, siehe 5) |
| Gesetzliches Mängelhaftungsrecht | Widerrufsseite Nr. 5 | ✓ |
| Technische Schritte, Korrektur, Sprache, Speicherung des Vertragstexts | Bestellinformationen Nr. 2, 5, 6; Box im Warenkorb | ✓ |
| Zugangsbestätigung (§ 312i Abs. 1 Nr. 3 BGB) | nur persönliche Antwort | offen (5) |
| Bestätigung auf dauerhaftem Datenträger (§ 312f BGB) | WhatsApp-Chat | offen (5) |
| Bestellschaltfläche (§ 312j Abs. 3 BGB) | „Weiter zu WhatsApp“ + Senden in WhatsApp | **offen – Schwachstelle** (5) |

## 4. Noch erforderliche Betreiberbestätigungen

1. **Rücksendung von Getränken:** Wer trägt die Kosten? Die Belehrung sagt derzeit „Sie tragen die unmittelbaren Kosten der Rücksendung“ und bietet die persönliche Abgabe im Restaurant an. Wie werden bar gezahlte Beträge erstattet?
2. **Verzögerungen:** Die Zusage „Wir informieren Sie per WhatsApp oder telefonisch“ muss im Betrieb eingehalten werden.
3. **Änderungen vor der Annahme:** Die Regel „keine Schnellantwort, Änderung erklären, Zustimmung abwarten“ muss im Team bekannt sein (`WHATSAPP-SCHNELLANTWORTEN.md`).
4. **Lieferzeit-Bezugspunkt** „ab Annahme der Bestellung“.
5. **Bestellungen in andere Orte** nur telefonisch: so bestätigen. Die Lieferservice-Seite nennt „Weitere Orte auf Anfrage“.
6. **Artikel:** Werden außer Getränken weitere abgepackte, nicht verderbliche Artikel angeboten? Derzeit sind keine solchen bekannt.
7. **Ayran:** Verpackung (Pfand) und ob er als verschlossenes Getränk unter die Widerrufsbelehrung fällt.
8. Bekannt aus früheren Listen: Unternehmensdaten, Steuerstatus, Soßenpreis und Partypizza-Beläge, Cloudflare-Konto.

## 5. Noch offene rechtliche Fragen

1. **§ 312j Abs. 3 und 4 BGB:** Die abschließende Bestellhandlung ist der Senden-Pfeil in WhatsApp, der nicht beschriftet werden kann. Nach BGH, Urteil vom 09.10.2025 – I ZR 159/24, entsteht ohne gesetzeskonforme Beschriftung keine Bindung, und eine Heilung durch Verhalten scheidet aus. Die neuen Rechtstexte ändern daran **nichts**.
2. **§ 312j Abs. 5 BGB** (ausschließlich individuelle Kommunikation): wegen der standardisiert vorbereiteten Nachricht **nicht** unterstellt.
3. **Widerruf:**
   - Ist die Einordnung „Speisen: Ausnahme Nr. 1 und 2“ richtig?
   - Greift zusätzlich § 312g Abs. 2 Nr. 9 BGB (Lieferung von Speisen und Getränken zu einem spezifischen Termin)?
   - Fallen verschlossene Getränke wirklich nicht unter eine Ausnahme? Bei gemischten Bestellungen: Welche Lieferkosten werden erstattet?
   - Ist die Belehrung für Abholungen passend formuliert?
4. **§ 312 Abs. 2 BGB:** Greift eine Bereichsausnahme für Lieferungen von Lebensmitteln und Getränken des täglichen Bedarfs „bei häufigen und regelmäßigen Fahrten“? Wenn ja, wären einige Pflichten nicht anwendbar.
5. **§ 312i Abs. 1 Nr. 3 BGB und § 312f BGB:** Genügen die persönliche WhatsApp-Antwort und der Chat als Zugangsbestätigung und als dauerhafter Datenträger?
6. **Streitbeilegung:** Der Verzicht auf eine Angabe ist eine Inhaberentscheidung und muss bestätigt werden.
7. **Endfreigabe** von Impressum, Datenschutzerklärung, Bestellinformationen und Widerrufsseite durch eine Fachperson.

## 6. Tests (16.11.2026, Headless Chrome, lokaler Server wie Cloudflare)

| Test | Ergebnis |
|---|---|
| 29 Seiten bei 320, 390 und 1440 px: alle vier Rechtslinks im Footer | auf allen Seiten vorhanden, 0 JavaScript-Fehler |
| 29 Seiten bei 320–1440 px (6 Breiten): Links, Ressourcen, seitliches Scrollen | 0 HTTP-Fehler, 0 Konsolenfehler, kein Überlauf |
| Neue Seiten mobil (320, 390) und Desktop (1440) | lesbar, Tabelle ohne Überlauf, kein seitliches Scrollen |
| Bon im Drawer (390 px) | Block „Bestellbedingungen auf einen Blick“ sichtbar und **vor** „Weiter zu WhatsApp“; Links zu Bestellinformationen, Widerruf, Impressum und Datenschutz vorhanden |
| Bestellablauf Abholung/Lieferung, Nachricht, Druckansicht | unverändert korrekt |
| Bestellreferenz (25 Prüfungen), Drawer, keine Drittanbieter-Anfragen, keine Cookies | bestanden |

Nicht getestet: echte Mobilgeräte, echtes Absenden in WhatsApp, Screenreader.
