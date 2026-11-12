# MINAR Küche – Abschlussbericht Finalisierung V3.0

Stand: 13.11.2026 · Repository `BraeuerDigital/minar`, Branch `main` · Sicherung des Ausgangszustands: Branch `sicherung/vor-finalisierung-2026-11-11`

## A – Technisch abgeschlossen

| Aufgabe | Status |
|---------|--------|
| Ausgangszustand gesichert | erledigt – Branch `sicherung/vor-finalisierung-2026-11-11` |
| Warenkorb modernisiert („Deine Bestellung“, dunkle Karte, Artikelzähler, Nr., Einzel- und Positionspreis, Konfiguration unter dem Titel, runde Mengensteuerung, „Ändern“, „Entfernen“, Summenbereich, Schaltfläche „Weiter zur Übersicht“) | erledigt, getestet 320–1440 px |
| Bestellübersicht im Bon-Stil (MINAR KÜCHE, Adresse, „Ihre Bestellübersicht“, Bestellart, Name, Telefon, Lieferadresse, Wunschzeit, alle Positionen mit Varianten/Soßen/Extras/Hinweisen, Warenwert, Lieferkosten, Pfand, „Insgesamt bar zu zahlen“, Barzahlungshinweis, „Per WhatsApp senden“) | erledigt – ohne Bestellnummer, ohne Erfolgsmeldung |
| Pfandberechnung (0,25 € je Getränk, Ayran 0 €) zentral in den Produktdaten; separat in Karte, Warenkorb, Bon und Nachricht; nicht im Mindestbestellwert | erledigt, getestet |
| WhatsApp-Nachricht im vorgegebenen Format an 0163 359 01 88, korrekt kodiert, Versand nur durch den Kunden | erledigt – keine Testnachricht an das Restaurant gesendet |
| Bestellsperre nach Öffnungszeiten (Europe/Berlin): Lieferung bis 21:15, Abholung bis 21:30, Dienstag Ruhetag, Hinweis auf nächste Öffnung; erneute Prüfung beim Senden (lange offener Tab) | erledigt, getestet inkl. Sommerzeit |
| Wunschzeit: so schnell wie möglich oder heute in 15-Min.-Schritten mit 30 Min. Vorlauf | erledigt; ungültig gewordene Zeit wird gemeldet |
| Zahlungs- und Verbraucherinformationen (bar, inkl. USt., Pfand/Lieferkosten separat, Ablauf „So läuft Ihre Bestellung ab“) | erledigt – rechtliche Prüfung siehe B |
| Datensparsamkeit (Formulardaten nur sessionStorage, Warenkorb-Ablauf 12 h, Löschfunktion für alles) | erledigt |
| Google-Bewertungsfunktion („Jetzt auf Google bewerten“ auf Kontakt, dezent im Footer, neues Fenster, `noopener noreferrer`, kein Skript) | vorbereitet – erscheint, sobald `googleReviewUrl` gesetzt ist (Link war nicht eindeutig verifizierbar) |
| Impressum bereinigt (ohne Platzhalter, mit „Webdesign: Bräuer.Digital“, kein OS-Plattform-Link) | erledigt |
| Datenschutzerklärung auf Cloudflare Pages angepasst (ohne GitHub, Namecheap, Lexware) | erledigt – fachliche Prüfung offen |
| Hinweis „Stand 04/2023, ohne Gewähr“ entfernt | erledigt |
| Cloudflare-Vorbereitung: Output-Ordner `public/`, relative Pfade, `_headers` (Sicherheit, CSP, Cache), `404.html`, `robots.txt`, keine Workers/Functions | erledigt, lokal mit Cloudflare-ähnlichem Server getestet |
| Cloudflare-Pages-Projekt `minar-kueche` verbinden und erstes Deployment | **nicht erfolgt** – erfordert Anmeldung im Cloudflare-Konto; Schritte in `docs/CLOUDFLARE.md` |
| GitHub Pages abschalten | ausstehend – erst nach erfolgreichem Cloudflare-Deployment (Anleitung in `docs/CLOUDFLARE.md`, Abschnitt 6) |
| Mobile Darstellung 320/375/390/768/1024/1440 px | geprüft, kein horizontales Scrollen |
| Funktionstests (Seiten, Links, Warenkorb, Pfand, Bestellung, Zeiten) | durchgeführt, Ergebnisse in `PRUEFLISTE.md`, Abschnitt J |
| Anfragenummer `MIN-A/L-YYYYMM-XXXXXXXX` (kryptografisch sicher, stabil pro Bestellentwurf, in Warenkorb, Bon und WhatsApp identisch, Kopieren-Button, „Neue Bestellung beginnen“) | erledigt, 16 Testfälle + Belastungstest 100.000 (0 Kollisionen in diesem Lauf) |
| Mindestbestellwert sperrt die Bestellung bis zum Erreichen (Lieferung) | erledigt |
| Halal-Zeichen überall entfernt (inkl. Siegel im Logo und Logo-Intro) | erledigt – Animation sonst unverändert |
| Buttons auf dem Handy mit einem Tippen bedienbar (Hover nur bei Maus) | erledigt |
| Logo-Animation | unverändert bis auf das entfernte Halal-Siegel |
| Dokumentation (README, PRUEFLISTE, Cloudflare-Anleitung) | aktualisiert |

## B – Noch vom Inhaber zu bestätigen

Erledigt am 12.11.2026: Verbraucherstreitbeilegung (nicht benötigt), Ayran ohne Pfand, Halal-Angaben (entfernt).

1. **Rechtliche Unternehmensdaten:** Rehan Naveed Raja, Einzelunternehmer, handelnd unter MINAR Küche, Anschrift wie im Impressum.
2. **Handelsregisterstatus:** keine Eintragung angegeben – bitte bestätigen (sonst Registergericht und -nummer nachreichen).
3. **USt-ID und geschäftliche Kontaktangaben:** DE 364887498, Telefon 07582 934 69 44, E-Mail minarbuchau@gmail.com.
4. **WhatsApp-Bestellannahme:** Wer nimmt Bestellungen an (WhatsApp Messenger oder Business, welches Gerät), Reaktionszeit, Bestätigung der Uhrzeit; Anfragenummer bei Rückfragen nutzen, gleiche Nummer zweimal = mögliche Doppelanfrage.
5. **Interner Umgang mit Kundendaten:** Löschfristen für WhatsApp-Chats, Telefon- und E-Mail-Bestellungen; Zugriff durch Mitarbeitende.
6. **Allergenangaben:** Vollständigkeit, insbesondere Nr. 99, 116 und 131–134a.
7. **Sieben Soßen:** Verfügbarkeit von Dönersoße, Cocktail, Hot Cocktail, Sour Cream, Minar Spezial, BBQ, Sweet Chili.
8. **Medien- und Logonutzungsrechte:** Fotos und Logo (Originaldatei).
9. **Google-Bewertungslink:** im Google-Unternehmensprofil „Um Rezensionen bitten“ → Link kopieren → in `menu-data.js` (`googleReviewUrl`) eintragen.
10. **Finaler Domainname** (Registrierung bei Namecheap) – danach Datenschutz um Registrar/DNS ergänzen.
11. **Rechtliche Freigabe für den Kundenbetrieb:** Impressum, Datenschutzerklärung, Bestellstrecke (§§ 312i, 312j BGB, vorvertragliche Informationen, Angaben zum Widerrufsrecht bzw. dessen gesetzlichen Ausnahmen); außerdem Inhaberschaft des Cloudflare-Kontos und Auftragsverarbeitung mit Cloudflare.
