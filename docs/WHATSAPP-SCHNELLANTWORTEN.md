# MINAR Küche – WhatsApp-Schnellantworten zur Bestellannahme

Für das Restaurant-Handy mit der Nummer 0163 359 01 88.

## So wird geantwortet

1. Eine Bestellung kommt als WhatsApp-Nachricht mit „MINAR KÜCHE – BESTELLUNG“ und einer Bestellreferenz (z. B. `MIN-L-202611-K7P4X8T2`).
2. Bestellung prüfen: Sind Artikel, Adresse und Liefergebiet in Ordnung, und ist die Zeit machbar?
3. **Nur wenn alles unverändert angenommen wird:** Die Nachricht des Kunden gedrückt halten → **Antworten**, damit die Annahme eindeutig zu dieser Bestellung gehört. Dann Schnellantwort einfügen.
4. Die Beispielzeit in eckigen Klammern **vor dem Absenden ersetzen**, z. B. `[30]` → `25`, und die eckigen Klammern löschen.
5. **Wenn sich etwas ändert** (Artikel fehlt, deutlich andere Zeit, anderer Preis): **keine** Schnellantwort schicken. Stattdessen die Änderung erklären und den Kunden ausdrücklich zustimmen lassen. Eine Annahme mit Änderungen gilt rechtlich als neues Angebot (§ 150 Abs. 2 BGB).
6. Bei Doppelanfragen mit derselben Bestellreferenz nur eine Bestellung annehmen und kurz nachfragen.

## Schnellantwort A – Abholung (Kürzel `/abholung`)

```
✅ Deine Bestellung wurde von MINAR Küche angenommen!

🥙 Deine Bestellung ist in ca. [30] Minuten zur Abholung bereit.

💵 Bezahlung bar bei Abholung.

Vielen Dank für deine Bestellung! 😊
Dein MINAR-Team
```

## Schnellantwort B – Lieferung (Kürzel `/lieferung`)

```
✅ Deine Bestellung wurde von MINAR Küche angenommen!

🚗 Deine Bestellung wird voraussichtlich in ca. [45] Minuten geliefert.

💵 Bezahlung bar bei Lieferung.

Vielen Dank für deine Bestellung! 😊
Dein MINAR-Team
```

> Hinweis: Diese kurzen Antworten sind als persönliche Annahme gedacht. Ob sie zusammen mit der Bestellnachricht alle rechtlich nötigen Bestätigungs- und Vertragsinformationen erfüllen, ist Teil der offenen rechtlichen Prüfung (`docs/CHECKOUT-PRUEFUNG.md`, Abschnitt H).

## Einrichtung

Die Menübezeichnungen können je nach App-Version leicht abweichen.

### 1. WhatsApp Business auf Android

1. WhatsApp Business öffnen → oben rechts **⋮** (drei Punkte) → **Unternehmenstools** bzw. **Tools** → **Schnellantworten**.
2. Auf **+** tippen.
3. Bei **Nachricht** den Text A einfügen, bei **Kürzel** `abholung` eintragen → **Speichern**.
4. Das Gleiche für Text B mit dem Kürzel `lieferung` wiederholen.
5. Im Chat `/` tippen und die Antwort auswählen, oder `/abholung` eingeben. Die Antwort wird eingefügt, aber noch nicht gesendet: Zeit ersetzen und dann senden.

### 2. WhatsApp Business auf iPhone

1. WhatsApp Business öffnen → unten **Einstellungen** → **Unternehmenstools** bzw. **Tools** → **Schnellantworten**.
2. Auf **+** tippen, Text A einfügen, Kürzel `abholung` → **Sichern**.
3. Text B mit dem Kürzel `lieferung` anlegen.
4. Im Chat `/` eingeben und die Antwort wählen, Zeit anpassen, dann senden.

Gut zu wissen: Ein Kürzel darf höchstens 25 Zeichen haben, der Text höchstens 500 Zeichen, und Schnellantworten funktionieren nur auf dem Gerät, auf dem sie angelegt wurden (Quelle: chatarmin.com).

### 3. Normales WhatsApp auf iPhone – Textersetzung

Normales WhatsApp hat keine Schnellantworten. Stattdessen hilft die Textersetzung des iPhones:

1. **Einstellungen** → **Allgemein** → **Tastatur** → **Textersetzung** → **+**.
2. **Text**: Antwort A einfügen. **Kurzbefehl**: z. B. `mabh` (ein Kürzel, das sonst nie als Wort vorkommt).
3. Für Antwort B z. B. `mlief`.
4. Im Chat `mabh` tippen und Leertaste drücken: Der Text erscheint. Zeit ersetzen, senden.

Achtung: Die Textersetzung übernimmt Zeilenumbrüche je nach iOS-Version nicht zuverlässig. Dann erscheint die Antwort in einer Zeile. Inhaltlich ist das in Ordnung, sonst lohnt sich WhatsApp Business.

### 4. Normales WhatsApp auf Android – Tastatur-Kürzel

Das hängt von der Tastatur ab:

- **Gboard (Google-Tastatur):** Gboard-Einstellungen → **Wörterbuch** → **Mein Wörterbuch** → Sprache wählen → **+** → Antwort einfügen und Kürzel z. B. `mabh` eintragen. Beim Tippen des Kürzels erscheint der Text oben in der Vorschlagsleiste und wird per Antippen eingefügt.
- **Samsung-Tastatur:** Tastatur-Einstellungen → **Intelligente Eingabe** bzw. **Weitere Eingabeoptionen** → **Textkürzel** → **Hinzufügen** → Kürzel und Text eintragen.

Achtung: Lange Texte mit Zeilenumbrüchen und Emojis werden nicht von jeder Tastatur vollständig übernommen. Einmal testen, indem du an dich selbst schickst. Wenn es hakt, ist WhatsApp Business die zuverlässigere Lösung.

## Grenzen

- Keine WhatsApp-API, keine Automatisierung, keine kostenpflichtige Plattform. Jede Annahme ist eine persönliche Antwort.
- Die Website erfährt nicht, ob eine Bestellung angekommen oder angenommen wurde.
