/* =====================================================================
   MINAR Küche – zentrale Daten
   ---------------------------------------------------------------------
   Diese Datei enthält ALLE Inhalte, die sich regelmäßig ändern können:
   Restaurantdaten, Öffnungszeiten, Lieferkonditionen, Kategorien und
   Gerichte. Das Layout (index.html / styles.css / script.js) muss für
   Preis- oder Gerichtsänderungen nicht angefasst werden.

   WICHTIG: Nur Angaben eintragen, die auf der gedruckten Speisekarte
   eindeutig lesbar sind. Unsichere Angaben NICHT hier eintragen,
   sondern in PRUEFLISTE.md vermerken.

   ---------------------------------------------------------------------
   Aufbau eines Gerichts (Beispiel – bitte erst mit echten Daten füllen):

   {
     nr: "12",                         // Artikelnummer laut Speisekarte (Text)
     category: "pizza",                // id aus "categories"
     name: "Name des Gerichts",
     description: "Zutaten / Beschreibung laut Karte",
     prices: [                         // eine oder mehrere Größen
       { label: "Ø 26 cm", price: 0.00 },
       { label: "Ø 32 cm", price: 0.00 }
     ],                                // bei nur einem Preis: label: ""
     extras: "pizza-belag",            // optional: id aus "extraGroups"
     allergens: ["A", "G"],            // Kürzel exakt wie auf der Karte
     additives: ["1", "3"],            // Zusatzstoff-Kennzeichnung wie auf der Karte
     tags: ["vegetarisch", "scharf"]   // optional: "vegetarisch", "vegan", "scharf"
   }
   ===================================================================== */

window.MINAR_DATA = {
  /* --- Restaurant (laut Flyer, vor Livegang auf Aktualität prüfen) --- */
  restaurant: {
    name: "MINAR Küche",
    street: "Schussenrieder Straße 21",
    zip: "88422",
    city: "Bad Buchau",
    phoneDisplay: "07582 934 69 44",
    phoneLink: "+4975829346944",
    whatsappDisplay: "0163 359 01 88",
    whatsappNumber: "491633590188", // internationales Format ohne + und ohne führende 0
    offer: ["Restaurant", "Abholung", "Lieferservice"]
  },

  /* --- Öffnungszeiten (laut Flyer) ---
     Wochentage: 0 = Sonntag, 1 = Montag, 2 = Dienstag … 6 = Samstag  */
  hours: {
    open: "11:30",
    close: "21:30",
    orderUntil: "21:15",
    closedDays: [2], // Dienstag Ruhetag
    timezone: "Europe/Berlin"
  },

  /* --- Lieferung & Abholung ---
     Liefergebiete, Mindestbestellwerte und Lieferkosten waren in den
     vorliegenden Unterlagen nicht lesbar → PRÜFEN. Erst eintragen, wenn
     sie eindeutig von der Speisekarte übernommen wurden.

     Beispiel eines Eintrags:
     { area: "Ortsname", minOrder: 0.00, fee: 0.00, note: "" }        */
  delivery: {
    pickup: true,
    delivery: true,
    zones: [],
    note: ""
  },

  /* --- Legenden für Allergene und Zusatzstoffe ---
     Kürzel und Bedeutung exakt wie auf der Speisekarte übernehmen.
     Beispiel: allergens: { "A": "Glutenhaltiges Getreide" }           */
  legend: {
    allergens: {},
    additives: {}
  },

  /* --- Zusatzoptionen / Aufpreise ---
     Beispiel:
     "pizza-belag": {
        label: "Extra Belag",
        multiple: true,
        options: [ { name: "Käse", price: 0.00 } ]
     }                                                                  */
  extraGroups: {},

  /* --- Kategorien (Reihenfolge = Reihenfolge auf der Website) --- */
  categories: [
    { id: "salate",          name: "Salate" },
    { id: "burger",          name: "Burger" },
    { id: "kartoffel",       name: "Kartoffelgerichte" },
    { id: "fingerfood",      name: "Fingerfood" },
    { id: "partyplatten",    name: "Partyplatten" },
    { id: "dips",            name: "Dips" },
    { id: "doener",          name: "Dönergerichte" },
    { id: "ueberbacken",     name: "Überbackene Gerichte" },
    { id: "pizza",           name: "Pizza" },
    { id: "partypizza",      name: "Partypizza" },
    { id: "nudeln",          name: "Nudelgerichte" },
    { id: "chinesische-nudeln", name: "Chinesische Nudeln" },
    { id: "gnocchi",         name: "Gnocchi" },
    { id: "indisch",         name: "Indische & pakistanische Gerichte" },
    { id: "vegetarisch",     name: "Vegetarische Gerichte" },
    { id: "schnitzel-steak", name: "Schnitzel & Steak" },
    { id: "desserts",        name: "Desserts" },
    { id: "getraenke",       name: "Getränke" }
  ],

  /* --- Gerichte ---
     Noch leer: Die Fotos der Speisekarte lagen bei der Erstellung nicht
     vor. Gerichte werden erst nach Abgleich mit der Originalkarte
     eingetragen (siehe PRUEFLISTE.md).                                 */
  items: []
};
