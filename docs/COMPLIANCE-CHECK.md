# MINAR Küche – Datenschutz-, Cookie- und Website-Compliance-Check

Stand: 15.11.2026 · Grundlage: Quellcode im Repository `BraeuerDigital/minar` (Branch `main`) und automatisierte Browsertests.

> Das ist eine **technische Prüfung**, keine Rechtsberatung. Rechtlich offene Punkte stehen in Abschnitt D und müssen vor dem produktiven Einsatz fachlich freigegeben werden.

## Technische Einschätzung

**Cookie-Banner nach festgestellter technischer Implementierung erforderlich: Nein.**

Begründung aus den gefundenen Technologien:

- Die Website setzt **keine Cookies**. Geprüft wurden alle 27 Seiten und der komplette Bestellablauf bei 390 und 1440 px: Browser-Cookie-Speicher leer, `document.cookie` leer.
- Es gibt keine Analyse-, Tracking-, Werbe- oder Social-Media-Dienste. Ebenso keine eingebetteten Karten, Videos oder Widgets, keine externen Schriften und keine externen Skripte, Stylesheets oder Bilder.
- Beim Laden aller Seiten und im Bestellablauf bis zur Bestellübersicht gab es **keine einzige Anfrage an einen fremden Server**.
- Die Website nutzt genau zwei Speicherungen im Browser (localStorage `minar-cart-v4`, sessionStorage `minar-form-v4`). Beide dienen ausschließlich dem vom Nutzer ausdrücklich gewünschten Warenkorb. Sie fallen technisch unter § 25 Abs. 2 Nr. 2 TDDDG (unbedingt erforderlich), eine Einwilligung ist dafür nach technischer Bewertung nicht nötig.
- Externe Dienste (WhatsApp, Google Maps, später Google-Bewertung) werden nur über normale Links aufgerufen, also erst nach einem bewussten Klick.

**Voraussetzung:** Diese Einschätzung gilt nur, solange im Cloudflare-Dashboard keine optionalen Dienste aktiviert werden, insbesondere **kein Cloudflare Web Analytics**. Cloudflare kann sonst automatisch ein Messskript einfügen. Auch neue Einbindungen wie Karten-iframes, Schriften von fremden Servern oder Widgets würden die Bewertung ändern.

## Gefundene Speicher- und Tracking-Technologien

| Name / Schlüssel | Zweck | Aktivierung | Gespeicherte Informationen | Speicherdauer | Drittanbieter | Technisch notwendig | Einwilligung zu prüfen |
|---|---|---|---|---|---|---|---|
| localStorage `minar-cart-v4` | Warenkorb über Seitenwechsel/Neuladen erhalten, Anfragenummer stabil halten | beim ersten „Hinzufügen“ | Gerichte (Nr., Name), Variante, Optionen, Menge, Hinweis zum Gericht, Zeitstempel, Anfragenummer (Jahr, Monat, 8 Zufallszeichen) – **keine** Namen, Telefonnummern oder Adressen | bis Warenkorb geleert / „Neue Bestellung beginnen“; nach 12 h ohne Änderung beim nächsten Aufruf gelöscht | keine | ja (vom Nutzer gewünschter Warenkorb) | nein (§ 25 Abs. 2 Nr. 2 TDDDG) |
| sessionStorage `minar-form-v4` | eingegebene Bestellangaben beim Seitenwechsel im selben Tab behalten | bei Eingabe im Bestellformular | Name, Telefon, Bestellart, Lieferort, Lieferadresse, Anmerkung | bis Tab/Browser geschlossen oder „Warenkorb und Angaben löschen“ / „Neue Bestellung beginnen“ | keine | ja | nein |
| localStorage `minar-cart-v3`, `minar-form-v3` | Altlasten früherer Versionen | – | – | werden beim Aufruf **aktiv gelöscht** | – | – | – |
| Cookies | – | – | keine gefunden | – | – | – | – |
| IndexedDB, Cache Storage, Service Worker | – | – | keine gefunden | – | – | – | – |
| Tracking-Pixel, Analyse, Werbung, Fingerprinting | – | – | nichts gefunden (kein Zugriff auf Canvas, Geräteeigenschaften, `sendBeacon`, `fetch` oder XHR) | – | – | – | – |
| Externe Schriften, Skripte, CSS, Bilder, Videos, Social Plugins, iframes | – | – | keine; alle Dateien kommen von der eigenen Domain, Schriften sind Systemschriften | – | – | – | – |

Externe **Links** (Aufruf nur per Klick): `wa.me` (WhatsApp-Bestellung und -Kontakt), `www.google.com/maps` (Route), `braeuer.digital` (Webdesign-Hinweis) sowie in der Datenschutzerklärung Cloudflare, WhatsApp, Google und LfDI BW.

## A. Erfolgreich geprüft

| Bereich | Ergebnis |
|---|---|
| 1. Google Maps | Nur ein normaler Link auf der Kontaktseite (`https://www.google.com/maps/search/?api=1&query=MINAR Küche, Schussenrieder Straße 21, 88422 Bad Buchau`), öffnet in neuem Tab. Kein iframe, kein Kartenskript, beim Laden keine Anfrage an Google. Ein Klick öffnet einen neuen Tab (getestet). Das Suchformat ist Googles offizielles Format; ob es exakt auf den Unternehmenseintrag führt, hängt vom Google-Profil ab (C 1). |
| 2. Google-Bewertungen | Button auf der Kontaktseite und Footer-Link vorbereitet, reiner externer Link mit `noopener noreferrer`. Keine Widgets, keine Sterne, keine Bewertungszahlen. Bleibt **ausgeblendet**, bis `googleReviewUrl` gesetzt ist, und erscheint erst dann auch in der Datenschutzerklärung. **Echter Link fehlt noch (C 2).** |
| 3./4. Cookies & Browserspeicher | siehe Tabelle – nur zwei notwendige Speicherungen |
| 5. Warenkorb | Personendaten nie im localStorage (getestet). Formularangaben nur für die Dauer des Tabs. Keine Übertragung an Dritte vor dem Klick auf „Per WhatsApp senden“. |
| 6. Anfragenummer | `crypto.getRandomValues()`, 8 Zeichen aus `23456789ABCDEFGHJKLMNPQRSTUVWXYZ`, Monat nach Europe/Berlin, keine Personendaten, stabil pro Entwurf, neue Nummer bei neuer Bestellung, identisch in Warenkorb, Bon und WhatsApp. Ohne sichere Zufallsfunktion keine Ersatznummer. Erneuter Testlauf am 15.11.2026: alle Fälle bestanden. Belastungstest mit 100.000 Kennungen: 0 Formatfehler, 0 Doppelungen in diesem Lauf, χ² = 31,69 bei 31 Freiheitsgraden, also unauffällig. Ein einzelner Lauf ohne Doppelung beweist keine Eindeutigkeit. |
| 7. WhatsApp | Technischer Ablauf: Die Website erzeugt einen `https://wa.me/491633590188?text=…`-Link mit allen Bestellangaben. Beim Öffnen gehen diese Angaben an WhatsApp, gesendet wird erst durch den Kunden. Kein eigener Server, keine Erfolgsmeldung. |
| 8. Cloudflare / Pfade | Keine festen `/minar/`-Pfade in `public/`, alle Pfade relativ. Die 404-Seite nutzt absolute Pfade für den Domain-Stamm. `_headers` mit strikter CSP (nur eigene Domain) verhindert auch versehentliche Drittanbieter-Ressourcen. Keine Workers/Functions. |
| 9. Drittanbieter | keine externen Ressourcen (statisch per Quelltextsuche und dynamisch per Netzwerkmitschnitt geprüft) |
| 10. Datenschutzerklärung | Deckt ab: Verantwortlicher, Kontakt, Hosting (Cloudflare Pages, geplant), Zugriffsdaten, keine Cookies/kein Tracking, Browserspeicher mit Schlüsseln und Löschung, Anfragenummer, WhatsApp, Telefon, E-Mail (Gmail), Maps-Link, Bewertungslink (nur bei aktivem Link), Empfänger, Drittland (DPF), Rechtsgrundlagen, Speicherdauer, Rechte, Widerspruch, Beschwerderecht (LfDI BW). Kein Namecheap, kein Lexware, kein GitHub. |
| 11. Impressum | Von allen 27 Seiten verlinkt (Footer, getestet). Enthält Inhaber, Einzelunternehmer, Firma „MINAR Küche“, ladungsfähige Anschrift, Telefon, E-Mail, USt-IdNr., Webdesign. Kein veralteter Link zur EU-Streitschlichtungsplattform. Verbraucherstreitbeilegung laut Inhaber nicht benötigt. |
| 12. Checkout | Preise inkl. USt., Getränkepfand separat, Lieferkosten je Ort, Mindestbestellwert sperrt bis zum Erreichen, Barzahlung als einzige Zahlungsart (Warenkorb, Bon, Nachricht), Öffnungszeiten-Sperre inkl. erneuter Prüfung beim Senden. Korrektur jederzeit vor dem Senden möglich („Ändern“, „Zurück und ändern“). Hinweis auf individuelle Bestätigung und Box „So läuft Ihre Bestellung ab“. |
| 13. Mobil | 320, 375, 390, 768, 1024 und 1440 px: kein seitliches Scrollen. Warenkorb, Bon, Anfragenummer und „Per WhatsApp senden“ sichtbar und bedienbar. Impressum, Datenschutz und Maps öffnen ohne JavaScript-Fehler. |
| 14. Ressourcen & Links | alle internen Links und Ressourcen erreichbar, 0 JavaScript- oder CSP-Fehler |

## B. Änderungen umgesetzt (15.11.2026)

| Datei | Änderung |
|---|---|
| `tools/build.mjs` → Bestellübersicht (Bon) auf `bestellen.html` und im Warenkorb-Drawer aller Seiten | Datenschutzhinweis vor der WhatsApp-Weiterleitung, passend zur tatsächlichen Übertragung: „Mit dem Öffnen von WhatsApp verlassen Sie unsere Website. Ihre vorbereiteten Bestellangaben (einschließlich Name, Telefonnummer und ggf. Lieferadresse) werden dabei im Link an WhatsApp übergeben. An uns gesendet wird die Nachricht erst, wenn Sie sie in WhatsApp selbst absenden. Weitere Informationen finden Sie in unserer Datenschutzerklärung.“ Mit Link zur Datenschutzerklärung (neuer Tab, damit die Übersicht offen bleibt). Bewusst **ohne** Pflicht-Checkbox. Statt „können übermittelt werden“ steht „werden … übergeben“, weil die Angaben tatsächlich im Link stehen. |
| `tools/build.mjs` → `kontakt.html` | Google-Maps-Link zusätzlich mit `noreferrer`, damit Google beim Klick keine Herkunftsseite erhält |
| `tools/build.mjs` → `datenschutz.html` | WhatsApp-Abschnitt nennt die Anfragenummer als übermittelte Angabe. Löschung der Formularangaben auch über „Neue Bestellung beginnen“. |
| `docs/COMPLIANCE-CHECK.md` | dieser Bericht |
| Testskripte (lokal) | an aufklappbare Zusatz-Kategorien angepasst |

Nicht geändert, weil bereits korrekt: Maps-URL, Bewertungsfunktion, Speicherlogik, Anfragenummer, Impressum, Design, Logo und Bestelllogik.

## Aktueller und geplanter Hosting-Zustand

| | Aktuell (15.11.2026) | Geplant |
|---|---|---|
| Hosting | **GitHub Pages** (`braeuerdigital.github.io/minar/`, Repo-Stamm → Weiterleitung auf `public/`), Entwicklungsstand, `noindex` | **Cloudflare Pages**, Projekt `minar-kueche`, Output `public/` |
| Zugriffsdaten | verarbeitet GitHub, Inc. (USA) | verarbeitet Cloudflare, Inc. (USA, DPF) |
| Datenschutzerklärung | beschreibt bereits den **geplanten** Zustand (Cloudflare), passt also **nicht** zur Entwicklungsseite auf GitHub Pages | passt |
| Analyse | keine (GitHub Pages bietet keine Website-Analyse für Besucher) | keine – Cloudflare Web Analytics **nicht aktivieren** |
| Sicherheitsheader (`_headers`) | wirken auf GitHub Pages **nicht** | wirken auf Cloudflare |

Folgerung: Die GitHub-Pages-Adresse ist **nicht** für den öffentlichen Betrieb freigegeben. Erst nach der Cloudflare-Migration ist die Datenschutzerklärung zutreffend. Danach GitHub Pages abschalten (`docs/CLOUDFLARE.md`, Abschnitt 6). DNS, Domain und Hosting habe ich nicht verändert.

## C. Offene Betreiberentscheidungen

1. **Google-Maps-Ziel:** Bitte einmal auf dem Handy prüfen, ob der Link direkt beim MINAR-Eintrag landet. Optional kann der „Teilen“-Link aus dem eigenen Google-Unternehmensprofil eingesetzt werden.
2. **Google-Bewertungslink:** Den Link aus dem Google-Unternehmensprofil („Um Rezensionen bitten“) liefern. Bis dahin bleibt die Funktion ausgeblendet. Es wurde keine Place-ID erfunden.
3. **Unternehmensdaten bestätigen:** Inhaber, Rechtsform (Einzelunternehmer), Anschrift, Telefon, E-Mail, USt-IdNr. DE 364887498, keine Handelsregistereintragung.
4. **E-Mail über Gmail:** Die Datenschutzerklärung nennt Google als E-Mail-Anbieter (aus der Adresse abgeleitet). Bitte bestätigen.
5. **Interne Abläufe:** Wer nimmt WhatsApp-Bestellungen an (Messenger oder Business), wie lange werden Chats und Bestelldaten aufbewahrt, wer hat Zugriff?
6. **Cloudflare-Konto:** Wem gehört es (Inhaber oder Agentur), wer schließt den Vertrag zur Auftragsverarbeitung ab?
7. **Domain:** finalen Namen festlegen. Danach Namecheap als Registrar und ggf. Cloudflare-DNS in der Datenschutzerklärung ergänzen.

## D. Offene rechtliche Freigaben (fachliche Prüfung vor Livegang)

1. **§ 312j Abs. 3 BGB (Button-Lösung):** Der Absende-Button heißt „Per WhatsApp senden“, nicht „zahlungspflichtig bestellen“. Ob die Pflicht greift, hängt davon ab, ob die WhatsApp-Nachricht bereits ein bindendes Angebot des Kunden ist oder nur eine Anfrage, die das Restaurant individuell annimmt. Die Website stellt sie als unverbindliche Anfrage dar. **Eine Ausnahme für WhatsApp wird nicht unterstellt.** Fachlich klären, ob der Button umbenannt oder der Ablauf angepasst werden muss.
2. **§ 312j Abs. 1 und 2 BGB:** Angaben zu Lieferbeschränkungen und Zahlungsmitteln spätestens zu Beginn des Bestellvorgangs, wesentliche Merkmale unmittelbar vor dem Absenden. Liefergebiete, Mindestwerte und „nur bar“ sind vorhanden. Prüfen, ob Platzierung und Umfang genügen.
3. **§ 312i BGB:** technische Schritte, Korrekturmöglichkeit, Vertragssprache, Speicherung des Vertragstexts, unverzügliche elektronische Zugangsbestätigung. Derzeit bestätigt das Restaurant individuell per WhatsApp. Prüfen, ob das als Zugangsbestätigung genügt und ob weitere Pflichtinformationen (z. B. zur Speicherung des Vertragstexts) ergänzt werden müssen.
4. **Widerrufsrecht:** Für Speisen kommen gesetzliche Ausnahmen in Betracht (z. B. § 312g Abs. 2 BGB für schnell verderbliche Waren oder Speisenlieferung zu einem bestimmten Termin). Auf der Website steht dazu bewusst **nichts**. Es wurde keine Ausnahme behauptet. Fachlich klären, ob und wie darüber informiert werden muss.
5. **Preisangaben:** Prüfen, ob die Darstellung „inkl. USt., zzgl. Pfand und Lieferkosten“ an allen Stellen den Vorgaben der PAngV genügt (u. a. Pfand als eigene Angabe neben dem Preis).
6. **Datenschutzerklärung:** abschließende Prüfung durch eine Fachperson, insbesondere Auftragsverarbeitung mit Cloudflare, Rolle von WhatsApp (gemeinsame oder getrennte Verantwortlichkeit) und Speicherfristen.
7. **Impressum:** Bestätigung, dass keine Registerangaben und keine Angabe zur Verbraucherstreitbeilegung erforderlich sind (Entscheidung Inhaber 12.11.2026).
8. **Entwicklungsseite auf GitHub Pages:** bis zur Abschaltung nicht öffentlich bewerben, weil die Datenschutzerklärung dort nicht zutrifft.

## Tests (tatsächlich durchgeführt, 15.11.2026)

Headless Chrome (Playwright) gegen einen lokalen Server, der `public/` wie Cloudflare als Stamm ausliefert (inkl. `_headers`/CSP und 404-Verhalten):

- 27 Seiten bei 390 und 1440 px: Impressum- und Datenschutz-Link auf jeder Seite, 0 externe Anfragen, 0 JavaScript-Fehler
- Bestellablauf (Gericht → Warenkorb → Lieferung → Angaben → Mindestwert → Bon): 0 externe Anfragen. Danach geprüft: Cookies, localStorage, sessionStorage, IndexedDB, Cache Storage und Service Worker; nur die zwei dokumentierten Schlüssel, keine Personendaten im localStorage.
- Maps: Kontaktseite lädt ohne Google-Anfrage, Link öffnet neuen Tab nur nach Klick
- Anfragenummer: alle Testfälle aus dem Nummernsystem plus Belastungstest mit 100.000 Kennungen
- Mobil: 320 bis 1440 px ohne seitliches Scrollen, Bon und Senden-Button sichtbar
- Alle internen Links und Ressourcen bei 6 Breiten ohne HTTP-Fehler

**Nicht getestet:** die Live-Adresse auf GitHub Pages (kein Internetzugriff aus der Testumgebung), echte Mobilgeräte (iOS Safari, Android), das Cloudflare-Deployment selbst (noch nicht verbunden) und das tatsächliche Ziel des Maps-Links bei Google.
