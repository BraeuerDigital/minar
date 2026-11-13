/* =====================================================================
   MINAR Küche – zentrale Daten
   ---------------------------------------------------------------------
   Diese Datei enthält ALLE Inhalte, die sich regelmäßig ändern können:
   Restaurantdaten, Öffnungszeiten, Lieferkonditionen, Kategorien und
   Gerichte. Das Layout (index.html / styles.css / script.js) muss für
   Preis- oder Gerichtsänderungen nicht angefasst werden.

   Quelle: gedruckte Speisekarte „MINAR Küche“, Preise vom Inhaber bestätigt.
   Unsichere Angaben stehen in PRUEFLISTE.md.

   ---------------------------------------------------------------------
   Aufbau eines Gerichts:

   {
     nr: "12",                    // Artikelnummer laut Karte (Text)
     cat: "pizza",                // id aus "categories"
     name: "Name des Gerichts",
     desc: "Beschreibung laut Karte",
     prices: [8.9]                // ein Preis …
     prices: [["klein", 4.9], ["groß", 6.9]],   // … oder Größen/Varianten
     codes: "A,C,G,6,7",          // Kennzeichnung exakt wie auf der Karte:
                                  //   Buchstaben = Allergene, Zahlen = Zusatzstoffe
     codesCheck: true,            // Kennzeichnung nicht sicher lesbar → wird
                                  //   NICHT angezeigt („auf Anfrage“)
     opts: ["dressing"],          // optional: ids aus "optionGroups"
     tags: ["vegetarisch"],       // nur, wenn die Karte es so benennt
     pfand: 0.25                  // Getränkepfand je Stück in € (separat ausgewiesen, 0 = kein Pfand)
   }
   ===================================================================== */

window.MINAR_DATA = {
  /* --- Restaurant (laut Speisekarte) --- */
  restaurant: {
    name: "MINAR Küche",
    street: "Schussenrieder Straße 21",
    zip: "88422",
    city: "Bad Buchau",
    phoneDisplay: "07582 934 69 44",
    phoneLink: "+4975829346944",
    whatsappDisplay: "0163 359 01 88",
    whatsappNumber: "491633590188", // internationales Format ohne + und ohne führende 0

    fax: "0800 202 07 702",
    email: "minarbuchau@gmail.com",
    owner: "Rehan Naveed Raja",
    vatId: "DE 364887498",

    /* Google-Bewertungslink: im Google-Unternehmensprofil über „Um Rezensionen bitten“
       kopieren (Format z. B. https://g.page/r/…/review). Leer = Bewertungs-Buttons bleiben
       ausgeblendet. Nur einen geprüften Link des MINAR-Profils eintragen. */
    googleReviewUrl: "",
    offer: ["Restaurant", "Abholung", "Lieferservice"]
  },


  menuSource: "Alle Preise in Euro inkl. gesetzlicher Umsatzsteuer. Getränke zzgl. 0,25 € Pfand (Ayran ohne Pfand). Zahlung ausschließlich bar.",

  /* --- Öffnungszeiten (laut Karte) ---
     Wochentage: 0 = Sonntag, 1 = Montag, 2 = Dienstag … 6 = Samstag  */
  hours: {
    open: "11:30",
    close: "21:30",
    orderUntil: "21:15",
    closedDays: [2], // Dienstag Ruhetag
    timezone: "Europe/Berlin"
  },

  /* --- Lieferung (laut Karte) --- */
  delivery: {
    pickup: true,
    delivery: true,
    zones: [
      { minOrder: 15, fee: 1, places: ["Bad Buchau"] },
      { minOrder: 20, fee: 2, places: ["Oggelshausen", "Tiefenbach", "Moosburg"] },
      { minOrder: 25, fee: 2, places: ["Allmannsweiler", "Kanzach", "Dürnau", "Seekirch", "Betzenweiler", "Bad Schussenried"] },
      { minOrder: 30, fee: 2, places: ["Kürnbach", "Mittelbiberach", "Stafflangen", "Dürmentingen", "Steinhausen"] },
      { minOrder: 40, fee: 3, places: ["Ingoldingen", "Attenweiler", "Uttenweiler", "Otterswang"] }
    ],
    notes: [
      "Weitere Orte auf Anfrage.",
      "Sollten Sie den Mindestbestellwert nicht erreichen, kontaktieren Sie uns bitte per Telefon oder WhatsApp.",
      "Alle Speisen werden frisch für Sie zubereitet. Die Lieferzeit beträgt je nach Entfernung 20–90 Minuten.",
      "Die Lieferung erfolgt ohne Teller, Besteck und Dekoration."
    ]
  },

  /* --- Legende (laut Karte) --- */
  legend: {
    allergens: {
      A: "Glutenhaltiges Getreide/-erzeugnisse",
      B: "Krebstiere/-erzeugnisse",
      C: "Eier und daraus hergestellte Produkte",
      D: "Fisch/-erzeugnisse",
      E: "Erdnüsse/-erzeugnisse",
      F: "Soja/-erzeugnisse",
      G: "Milch/-erzeugnisse (laktosehaltig)",
      H: "Schalenfrüchte/Nüsse",
      J: "Senf/-erzeugnisse",
      K: "Sesamsamen/-erzeugnisse",
      L: "Schwefeldioxid/Sulfite",
      N: "Weichtiere",
      O: "Koffein"
    },
    additives: {
      "1": "Verdickungsmittel",
      "2": "Farbstoffe",
      "3": "Konservierungsstoffe",
      "4": "Säuerungsmittel",
      "5": "Antioxidationsmittel",
      "6": "Geschmacksverstärker",
      "7": "Phosphat",
      "8": "Emulgator",
      "9": "Geschwärzt"
    },
    notes: [
      "Käse: Konservierungsstoffe, Farbstoffe, Nitrat, Natamycin.",
      "Hackfleisch: reines Rinderhack. Schinken: Putenschinken."
    ]
  },

  /* --- Auswahl- und Zusatzoptionen ---
     type "one"  = genau eine Auswahl (z. B. Sorte, Beilage)
     type "many" = beliebig viele (Extras mit Aufpreis); max: n begrenzt die Anzahl; min: n = Pflichtanzahl, unit = Bezeichnung im Hinweis */
  optionGroups: {
    "dressing":       { label: "Dressing", type: "one", options: [{ name: "Essig & Öl" }, { name: "Joghurtsoße" }] },
    "burger-extra":   { label: "Extra Zusatz", type: "many", options: [
                        { name: "mit Pommes", price: 3.5 }, { name: "mit Wedges", price: 3.5 },
                        { name: "Jalapeños", price: 0.5 }, { name: "Röstzwiebeln", price: 0.5 },
                        { name: "Spiegelei", price: 1 }, { name: "Käse", price: 1 },
                        { name: "Fleisch-Patty", price: 5 }, { name: "Käsespätzle", price: 7 } ] },
    "beilage-pw":     { label: "Beilage", type: "one", options: [{ name: "Pommes" }, { name: "Wedges" }] },
    "beilage-pwr":    { label: "Beilage", type: "one", options: [{ name: "Pommes" }, { name: "Wedges" }, { name: "Reis" }] },
    "platte-burger":  { label: "Burger", type: "one", options: [{ name: "Hamburgerle" }, { name: "Chicken Burger" }] },
    "menu-burger":    { label: "Burger", type: "one", options: [{ name: "Nr. 20 Hamburgerle" }, { name: "Nr. 21 Cheeseburgerle" }, { name: "Nr. 23 Chickenburgerle" }] },
    "dip-sorte":      { label: "Sorte", type: "one", options: [{ name: "Ketchup" }, { name: "Mayo" }, { name: "Remoulade" }] },
    "ueberb-extra":   { label: "Extra", type: "many", options: [{ name: "Extra Weichkäse", price: 1 }] },
    "nudel-sorte":    { label: "Nudeln", type: "one", options: [{ name: "Spaghetti" }, { name: "Penne" }] },
    "nudel-ueberb":   { label: "Extra", type: "many", options: [{ name: "überbacken", price: 2.5 }] },
    "doener-sosse":   { label: "Soßen – bis zu 2 inklusive", short: "Soßen", type: "many", max: 2, options: [
                        { name: "Dönersoße" }, { name: "Cocktailsoße" }, { name: "Hot Cocktailsoße" },
                        { name: "Sour Cream" }, { name: "Minar Spezial Soße" }, { name: "BBQ Soße" }, { name: "Sweet Chili Soße" } ] },
    "doener-sosse-extra": { label: "Weitere Soßen gegen Aufpreis", short: "Weitere Soßen", type: "many", options: [
                        { name: "Dönersoße", price: 1.2 }, { name: "Cocktailsoße", price: 1.2 }, { name: "Hot Cocktailsoße", price: 1.2 },
                        { name: "Sour Cream", price: 1.2 }, { name: "Minar Spezial Soße", price: 1.2 }, { name: "BBQ Soße", price: 1.2 },
                        { name: "Sweet Chili Soße", price: 1.2 } ] },
    "schaerfe":       { label: "Schärfe", type: "many", options: [{ name: "scharf" }] },
    /* Partypizza: genau 4 Beläge (min = max = 4) – Auswahl aus den Belägen der Pizzakarte, ohne Fisch/Meeresfrüchte
       (Allergenkennzeichnung der Nr. 136 enthält kein D) */
    "partypizza-belag": { label: "Beläge – 4 nach Wahl", short: "Beläge", unit: "Beläge", unitOne: "Belag", type: "many", min: 4, max: 4, options: [
                        { name: "Salami" }, { name: "Schinken" }, { name: "Sucuk" }, { name: "Hackfleischdrehspieß" }, { name: "Chicken" },
                        { name: "Champignons" }, { name: "Paprika" }, { name: "Peperoni" }, { name: "Jalapeños" }, { name: "Zwiebeln" },
                        { name: "Mais" }, { name: "Brokkoli" }, { name: "Spinat" }, { name: "Artischocken" }, { name: "Oliven" },
                        { name: "Ananas" }, { name: "Tomaten" }, { name: "Ei" }, { name: "Weichkäse" }, { name: "Mozzarella" },
                        { name: "Knoblauch" } ] },
    "dips":           { label: "Dips & Soßen dazu", short: "Dips", type: "many", options: [
                        { name: "Cocktail Dip", price: 1.2 }, { name: "Hot Cocktail Dip", price: 1.2 },
                        { name: "Sour Cream", price: 1.2 }, { name: "Minar Spezial Dip", price: 1.2 },
                        { name: "BBQ Soße", price: 1.2 }, { name: "Sweet Chili Soße", price: 1.2 },
                        { name: "Dönersoße", price: 1.2 }, { name: "Ketchup", price: 0.5 },
                        { name: "Mayo", price: 0.5 }, { name: "Remoulade", price: 0.5 } ] },
    "eis-sorte":      { label: "Sorte", type: "one", options: [{ name: "Cookie" }, { name: "Schoko" }] }
  },

  /* --- Kategorien (Reihenfolge wie auf der Karte) ---
     slug = Dateiname der Unterseite: speisekarte/<slug>.html
     img  = optionales Foto aus assets/images/<img>.jpg (+ <img>-sm.jpg)
     Neue Kategorie → danach `node tools/build.mjs` ausführen.        */
  categories: [
    { id: "salate", slug: "salate",      name: "Salate", desc: "Wahlweise mit Essig und Öl oder Joghurtsoße (C, G).", img: "salat", imgAlt: "Bunter Salat mit Tomaten, Karotten, Gurke und Rotkohl" },
    { id: "burger", slug: "burger",      name: "Burger", desc: "Alle mit grünem Salat, Tomaten, Gurken und Zwiebeln.", img: "burger", imgAlt: "Burger mit Rindfleisch-Patty, Cheddar, Salat, Tomate und Zwiebeln" },
    { id: "potatoes", slug: "potatoes",    name: "Potatoes" },
    { id: "fingerfood", slug: "fingerfood",  name: "Fingerfood" },
    { id: "partyplatten", slug: "partyplatten",name: "Partyplatten" },
    { id: "dips", slug: "dips",        name: "Dips" },
    { id: "doener", slug: "doener",      name: "Döner", img: "doenerteller", imgAlt: "Dönerteller mit Wedges, Salat und Soße" },
    { id: "ueberbacken", slug: "ueberbacken", name: "Überbacken" },
    { id: "pizza", slug: "pizza",       name: "Pizza", desc: "30 cm. Alle Pizzas mit Tomatensoße und Käse." },
    { id: "partypizza", slug: "party-pizza",  name: "Partypizza", desc: "40 × 60 cm." },
    { id: "nudeln", slug: "nudelgerichte",      name: "Nudelgerichte", desc: "Spaghetti oder Penne. Alle Gerichte gibt es auch überbacken (+2,50 €)." },
    { id: "chinanudeln", slug: "chinesische-nudeln", name: "Chinesische Nudeln" },
    { id: "gnocchi", slug: "gnocchi",     name: "Gnocchi", desc: "Alle Gnocchi-Gerichte gibt es auch überbacken (+2,50 €)." },
    { id: "indisch", slug: "indisch-pakistanisch",     name: "Indisch & Pakistanisch", desc: "Alle Gerichte mit Reis.", img: "curry-reis", imgAlt: "Curry mit Reis" },
    { id: "vegetarisch", slug: "vegetarische-gerichte", name: "Vegetarische Gerichte" },
    { id: "schnitzel", slug: "schnitzel-steak",   name: "Schnitzel und Steak", desc: "Alle Schnitzel vom Putenfleisch mit Pommes.", img: "schnitzel-kaesespaetzle", imgAlt: "Paniertes Schnitzel mit Käsespätzle und Salat" },
    { id: "dessert", slug: "desserts",     name: "Dessert" },
    { id: "getraenke", slug: "getraenke",   name: "Getränke" }
  ],

  /* --- Gerichte --- */
  items: [
    /* SALATE */
    { nr: "01", cat: "salate", name: "Grüner Salat", prices: [4.9], opts: ["dressing"] },
    { nr: "02", cat: "salate", name: "Gurkensalat", prices: [5.9], opts: ["dressing"] },
    { nr: "03", cat: "salate", name: "Tomatensalat", desc: "frische Tomaten und Zwiebeln", prices: [5.9], opts: ["dressing"] },
    { nr: "04", cat: "salate", name: "Gemischter Salat", desc: "grüner Salat, Kraut, Tomaten, Gurken und Karotten", prices: [8.5], opts: ["dressing"] },
    { nr: "05", cat: "salate", name: "Thunfischsalat", desc: "grüner Salat, Tomaten, Gurken, Thunfisch und Zwiebeln", prices: [9.5], codes: "D,F", opts: ["dressing"] },
    { nr: "06", cat: "salate", name: "Casa Nova", desc: "grüner Salat, Tomaten, Gurken, Mozzarella, Oliven, Paprika", prices: [10.5], codes: "9", opts: ["dressing"] },
    { nr: "07", cat: "salate", name: "Griechischer", desc: "grüner Salat, Tomaten, Gurken, Peperoni, Paprika, Oliven, Zwiebeln und Weichkäse", prices: [10.9], codes: "G,9", opts: ["dressing"] },
    { nr: "08", cat: "salate", name: "Nizza Salat", desc: "grüner Salat, Tomaten, Gurken, Oliven, Thunfisch", prices: [10.5], codes: "D,G,9", opts: ["dressing"] },
    { nr: "09", cat: "salate", name: "Schwäbischer Teller", desc: "Salat, Tomaten, Gurken, Kraut, Karotten, Ei, Schinken, Käse", prices: [10.9], codes: "F,J,6,7,8,2", opts: ["dressing"] },
    { nr: "10", cat: "salate", name: "Chicken Salat", desc: "grüner Salat, Tomaten, Gurken, Karotten, Paprika, Mais und gegrillte Hähnchenbrust", prices: [11.9], opts: ["dressing"] },
    { nr: "11", cat: "salate", name: "Minar Spezial Salat", desc: "grüner Salat, Tomaten, Gurken, Karotten, Paprika, Mais, Hähnchenbrust mit Cornflakes-Panade", prices: [12.9], codes: "A,C,G", opts: ["dressing"] },
    { nr: "14", cat: "salate", name: "Salmone", desc: "grüner Salat, Tomaten, Gurken, Paprika, Mais, Karotten, gegrillter Lachs (200 g)", prices: [18.9], codes: "D", opts: ["dressing"] },

    /* BURGER */
    { nr: "20", cat: "burger", name: "Hamburgerle", desc: "100 g Rindfleisch-Patty und Smoky Cocktailsoße", prices: [6.5], codes: "A,C,G,F,J,6,7,8", opts: ["burger-extra", "dips"] },
    { nr: "21", cat: "burger", name: "Cheeseburgerle", desc: "100 g Rindfleisch-Patty, Cheddarkäse und Smoky Cocktailsoße", prices: [6.9], codes: "A,C,G,F,J,6,7,8,2", opts: ["burger-extra", "dips"] },
    { nr: "22", cat: "burger", name: "Fischburgerle", desc: "panierte Fischstäbchen, Remoulade, Cocktailsoße", prices: [6.9], codes: "A,C,D,G,F", opts: ["burger-extra", "dips"] },
    { nr: "23", cat: "burger", name: "Chickenburgerle", desc: "Hähnchenbrust mit Cornflakes-Panade, Cheddarkäse und Smoky Cocktailsoße", prices: [6.9], codes: "A,C,G,F,J,6,7,8", opts: ["burger-extra", "dips"] },
    { nr: "24", cat: "burger", name: "Hamburger XXL", desc: "200 g Rindfleisch-Patty und Smoky Cocktailsoße", prices: [10.5], codes: "A,C,G,F,J,6,7,8", opts: ["burger-extra", "dips"] },
    { nr: "25", cat: "burger", name: "Cheeseburger XXL", desc: "200 g Rindfleisch-Patty, Cheddarkäse und Smoky Cocktailsoße", prices: [10.9], codes: "A,C,G,F,J,6,7,8,2", opts: ["burger-extra", "dips"] },
    { nr: "26", cat: "burger", name: "Chickenburger XXL", desc: "Hähnchenbrust mit Cornflakes-Panade, Cheddarkäse, Smoky Cocktailsoße", prices: [10.9], codes: "A,C,G,F,J,6,7,8", opts: ["burger-extra", "dips"] },
    { nr: "27", cat: "burger", name: "Hot Chili Cheeseburger XXL", desc: "200 g Rindfleisch-Patty, Cheddarkäse, Jalapeños und scharfe Smoky Cocktailsoße", prices: [12.9], codes: "A,C,G,F,J,6,7,8,2", opts: ["burger-extra", "dips"], tags: ["scharf"] },
    { nr: "28", cat: "burger", name: "Minar Spezial Burger XXL", desc: "200 g Rindfleisch-Patty, Cheddarkäse, Rösti und Smoky Cocktailsoße", prices: [13.5], codes: "A,C,G,F,J,6,7,8,2", opts: ["burger-extra", "dips"] },
    { nr: "29", cat: "burger", name: "Scharf Lady", desc: "Hähnchenbrust mit Cornflakes-Panade, Cheddarkäse, Jalapeños, Spiegelei, Hot-Cocktailsoße", prices: [13.5], codes: "A,C,G,F,J,6,7,8,2", opts: ["burger-extra", "dips"] },
    { nr: "30", cat: "burger", name: "Minar BBQ Burger", desc: "Patty, Cheddarkäse, Spiegelei, Röstzwiebeln, BBQ-Soße", prices: [13.9], codes: "A,C,G", opts: ["burger-extra", "dips"] },
    { nr: "34", cat: "burger", name: "Schwaben Burger XXL", desc: "200 g Rindfleisch-Patty, Käsespätzle, grüner Salat, Tomaten, Gurken, Röstzwiebeln und Smoky Cocktailsoße", prices: [18.9], codes: "A,C,G,F,J,6,7,8", opts: ["burger-extra", "dips"] },
    { nr: "36", cat: "burger", name: "Minar Burger", desc: "mit Rind, Chicken Patty, grüner Salat, Tomaten, Gurken, Röstzwiebeln, Smoky Cocktailsoße, Cheddarkäse", prices: [13.9], codes: "A,C,G,F,J,2,6,7,8", opts: ["burger-extra", "dips"] },
    { nr: "37", cat: "burger", name: "Vegetarischer Burger", desc: "vegetarisches Schnitzel, Cheddarkäse, Smoky Cocktailsoße", prices: [10.5], codes: "A,C,G", opts: ["burger-extra", "dips"], tags: ["vegetarisch"] },
    { nr: "38", cat: "burger", name: "Chicken und Garnelen Burger", desc: "mit Tomaten, Gurken, Röstzwiebeln, Cocktailsoße, Cheddarkäse", prices: [12.9], codes: "A,C,G,F,J,2,6,7,8", opts: ["burger-extra", "dips"] },
    { nr: "39", cat: "burger", name: "Cheese-Garnelen Burger", desc: "mit Tomaten, Cheddarkäse, Gurken, Röstzwiebeln und Cocktailsoße", prices: [12.9], opts: ["burger-extra", "dips"] },

    /* POTATOES */
    { nr: "40", cat: "potatoes", name: "Pommes", prices: [["klein", 4.9], ["groß", 6.9]], opts: ["dips"] },
    { nr: "41", cat: "potatoes", name: "Wedges", prices: [["klein", 4.9], ["groß", 6.9]], opts: ["dips"] },
    { nr: "42", cat: "potatoes", name: "Süßkartoffeln", prices: [["klein", 5.5], ["groß", 7.9]], opts: ["dips"] },
    { nr: "43", cat: "potatoes", name: "Curly Fries", prices: [["klein", 5.5], ["groß", 7.9]], opts: ["dips"] },
    { nr: "44", cat: "potatoes", name: "Kroketten", prices: [["klein", 5.5], ["groß", 7.9]], codes: "A,G", opts: ["dips"] },
    { nr: "45", cat: "potatoes", name: "Bratkartoffeln", prices: [["klein", 5.5], ["groß", 7.9]], opts: ["dips"] },
    { nr: "46", cat: "potatoes", name: "Rösti", prices: [["klein", 5.5], ["groß", 7.9]], codes: "A,C,G", opts: ["dips"] },

    /* FINGERFOOD */
    { nr: "50", cat: "fingerfood", name: "Onion Rings", desc: "10 Stück", prices: [7.9], codes: "A,C", opts: ["dips"] },
    { nr: "51", cat: "fingerfood", name: "Frühlingsrollen", desc: "10 Stück", prices: [7.9], codes: "A,C", opts: ["dips"] },
    { nr: "52", cat: "fingerfood", name: "Mozzarella Sticks", desc: "10 Stück", prices: [7.9], codes: "A,C,G", opts: ["dips"] },
    { nr: "53", cat: "fingerfood", name: "Fischstäbchen", desc: "10 Stück", prices: [7.9], codes: "A,C,D,G,F", opts: ["dips"] },
    { nr: "54", cat: "fingerfood", name: "Chicken Nuggets", desc: "10 Stück", prices: [7.9], codes: "A,7", opts: ["dips"] },
    { nr: "56", cat: "fingerfood", name: "Chili Cheese Nuggets", desc: "10 Stück", prices: [8.9], codes: "A,C", opts: ["dips"] },
    { nr: "57", cat: "fingerfood", name: "Chicken Finger", desc: "6 Stück", prices: [8.9], codes: "A,C", opts: ["dips"] },
    { nr: "59", cat: "fingerfood", name: "Camembert", desc: "2 Stück mit Pommes", prices: [8.9], codes: "A,C,G", opts: ["dips"] },
    { nr: "60", cat: "fingerfood", name: "Schnitzel Crunchy", desc: "Pute mit Pommes", prices: [8.9], codes: "A,C,G", opts: ["dips"] },
    { nr: "62", cat: "fingerfood", name: "Veggie Schnitzel", desc: "mit Pommes", prices: [8.9], codes: "A,C,G", opts: ["dips"] },
    { nr: "63", cat: "fingerfood", name: "Calamari Fritti", desc: "10 Stück", prices: [8.9], codes: "A,C,G,D", opts: ["dips"] },
    { nr: "64", cat: "fingerfood", name: "Chicken Wings", desc: "8 Stück", prices: [9.9], codes: "A,C,G", opts: ["dips"] },
    { nr: "66", cat: "fingerfood", name: "Filo Pastry Shrimps", desc: "8 Stück", prices: [9.9], opts: ["dips"] },

    /* PARTY PLATTEN */
    { nr: "70", cat: "partyplatten", name: "Fingerfood Platte", desc: "Putenschnitzel paniert, Onion Rings, Mozzarella Sticks, Chicken Wings, Pommes oder Wedges, Frühlingsrollen, Rösti, Kroketten, verschiedene Dips", prices: [["2 Personen", 34.9], ["4 Personen", 48.9]], codes: "A,C,G", opts: ["beilage-pw", "dips"] },
    { nr: "71", cat: "partyplatten", name: "Burger Platte", desc: "Hamburgerle oder Chicken Burger, Mozzarella Sticks, Chicken Wings, Pommes oder Wedges, Frühlingsrollen, Rösti, Kroketten und verschiedene Dips", prices: [["2 Personen", 34.9], ["4 Personen", 48.9]], codes: "A,C,G,F,J,6,7,8", opts: ["platte-burger", "beilage-pw", "dips"] },
    { nr: "72", cat: "partyplatten", name: "Minar Spezial Platte", desc: "Hackfleischdrehspieß, Beilage Salat, Mozzarella Sticks, Chicken Wings, Pommes oder Wedges, Frühlingsrollen, Rösti, Kroketten, verschiedene Dips", prices: [["2 Personen", 34.9], ["4 Personen", 48.9]], codes: "A,C,G,F,J,6,7,8", opts: ["beilage-pw", "dips"] },
    { nr: "73", cat: "partyplatten", name: "Menü für 1 Person", desc: "Burger 20 oder 21 oder 23, 2 Chicken Wings, 2 Onion Rings, 2 Frühlingsrollen, 2 Mozzarella Sticks, 2 Chicken Nuggets und Pommes", prices: [18.5], opts: ["menu-burger", "dips"] },

    /* DIPS */
    { nr: "80", cat: "dips", name: "Cocktail Dip", prices: [1.2], codes: "A,C,G" },
    { nr: "81", cat: "dips", name: "Hot Cocktail Dip", prices: [1.2], codes: "A,C,G" },
    { nr: "82", cat: "dips", name: "Sour Cream", prices: [1.2], codes: "A,G" },
    { nr: "83", cat: "dips", name: "Minar Spezial Dip", prices: [1.2], codes: "A,C,G" },
    { nr: "84", cat: "dips", name: "BBQ Soße", prices: [1.2], codes: "A,C,G" },
    { nr: "85", cat: "dips", name: "Sweet Chili Soße", prices: [1.2], codes: "A,C,G" },
    { nr: "87", cat: "dips", name: "Dönersoße", prices: [1.2], codes: "A,C,G" },
    { nr: "88", cat: "dips", name: "Ketchup / Mayo / Remoulade", prices: [0.5], codes: "A,C,G", opts: ["dip-sorte"] },

    /* DÖNER */
    { nr: "90", cat: "doener", name: "Hackfleischdrehspieß", desc: "mit Salat und Soße im Fladenbrot", prices: [7.0], codes: "A,C,G,F,J,6,7,8", opts: ["doener-sosse", "doener-sosse-extra", "schaerfe"] },
    { nr: "91", cat: "doener", name: "Hackfleischdrehspieß Minar", desc: "mit Salat, Spiegelei und Soße im Fladenbrot", prices: [7.9], codes: "A,C,G,F,J,6,7,8", opts: ["doener-sosse", "doener-sosse-extra", "schaerfe"] },
    { nr: "92", cat: "doener", name: "Vegetarisch", desc: "mit Weichkäse, Salat und Soße im Fladenbrot", prices: [7.0], codes: "A,C,G,6,7,8", tags: ["vegetarisch"], opts: ["doener-sosse", "doener-sosse-extra", "schaerfe"] },
    { nr: "93", cat: "doener", name: "Dürüm", desc: "mit Hackfleischdrehspieß, Salat und Soße im Rollteig", prices: [8.5], codes: "A,C,G,F,J,6,7,8", opts: ["doener-sosse", "doener-sosse-extra", "schaerfe"] },
    { nr: "94", cat: "doener", name: "Dürüm vegetarisch", desc: "mit Weichkäse, Salat und Soße im Rollteig", prices: [8.0], codes: "A,C,G,6,7,8", tags: ["vegetarisch"], opts: ["doener-sosse", "doener-sosse-extra", "schaerfe"] },
    { nr: "95", cat: "doener", name: "Falafel Teller", desc: "mit Falafel, Salat, Soße und Pommes", prices: [10.9], codes: "A,C,G,6,7,8", opts: ["doener-sosse", "schaerfe", "dips"] },
    { nr: "96", cat: "doener", name: "Dönerteller", desc: "mit Hackfleischdrehspieß, Salat und Soße", prices: [10.9], codes: "A,C,G,F,J,6,7,8", opts: ["doener-sosse", "doener-sosse-extra", "schaerfe"] },
    { nr: "96a", cat: "doener", name: "Dönerteller mit Beilage", desc: "mit Hackfleischdrehspieß, Salat, Soße und wahlweise Pommes, Wedges oder Reis", prices: [11.9], codes: "A,C,G,F,J,6,7,8", opts: ["doener-sosse", "schaerfe", "beilage-pwr", "dips"] },

    /* ÜBERBACKEN */
    { nr: "97", cat: "ueberbacken", name: "Dönerteller überbacken", desc: "mit Hackfleischdrehspieß, Tomaten, Tomatensoße, Pommes", prices: [13.5], codes: "A,C,G,F,J,6,7,8", opts: ["ueberb-extra", "dips"] },
    { nr: "98", cat: "ueberbacken", name: "Dönerteller Minar überbacken", desc: "Hackfleischdrehspieß, Pommes, Hot Cocktail, Edamer, Cheddarkäse, Dip", prices: [13.5], codes: "A,C,G,6,7,8", opts: ["ueberb-extra", "dips"] },
    { nr: "98a", cat: "ueberbacken", name: "BBQ Teller überbacken", desc: "Hackfleischdrehspieß, Pommes, hausgemachte BBQ-Soße, Emmentaler, Cheddarkäse, Dip", prices: [13.5], codes: "A,C,G,6,7,8", opts: ["ueberb-extra", "dips"] },
    { nr: "98b", cat: "ueberbacken", name: "Lachs Teller überbacken", desc: "gegrillter Lachs, Pommes, Remoulade, Cocktail, Edamer, Dip", prices: [18.9], codes: "A,C,D,G,6,7,8", opts: ["ueberb-extra", "dips"] },
    { nr: "99", cat: "ueberbacken", name: "Istanbul überbacken", desc: "Hackfleischdrehspieß, Tomatensahnesoße, Penne", prices: [13.5], opts: ["ueberb-extra"] },
    { nr: "99a", cat: "ueberbacken", name: "Schwäbische überbacken", desc: "Kartoffelscheiben, Sahnesoße, Edamer", prices: [11.9], opts: ["ueberb-extra"] },

    /* PIZZA (30 cm) */
    { nr: "100", cat: "pizza", name: "Pizzabrot", prices: [5.0], codes: "A" },
    { nr: "101", cat: "pizza", name: "Margherita", prices: [7.9], codes: "A,G" },
    { nr: "102", cat: "pizza", name: "Zwiebel", prices: [8.9], codes: "A,G" },
    { nr: "103", cat: "pizza", name: "Mais", prices: [8.9], codes: "A,G" },
    { nr: "104", cat: "pizza", name: "Brokkoli", prices: [8.9], codes: "A,G" },
    { nr: "105", cat: "pizza", name: "Funghi", desc: "mit Champignons", prices: [8.9], codes: "A,G" },
    { nr: "106", cat: "pizza", name: "Salami", prices: [9.4], codes: "A,G,F,J,6,7,8" },
    { nr: "107", cat: "pizza", name: "Schinken", prices: [9.4], codes: "A,G,F,J,6,7,8" },
    { nr: "108", cat: "pizza", name: "Sucuk mit Ei", desc: "türkische Knoblauchwurst", prices: [9.9], codes: "A,C,G,F,J,6,7,8" },
    { nr: "109", cat: "pizza", name: "Spinat", desc: "mit Weichkäse", prices: [9.9], codes: "A,G" },
    { nr: "110", cat: "pizza", name: "Thunfisch", desc: "mit Zwiebeln", prices: [9.9], codes: "A,D,F,G" },
    { nr: "111", cat: "pizza", name: "Hawaii", desc: "mit Schinken und Ananas", prices: [9.9], codes: "A,G,F,J,6,7,8" },
    { nr: "112", cat: "pizza", name: "Salami-Peperoni", prices: [9.9], codes: "A,G,F,J,6,7,8" },
    { nr: "113", cat: "pizza", name: "Diavolo", desc: "Salami, Jalapeños", prices: [9.9], codes: "A,G,F,J,6,7,8" },
    { nr: "114", cat: "pizza", name: "Salami-Schinken", prices: [10.9], codes: "A,G,F,J,6,7,8" },
    { nr: "115", cat: "pizza", name: "Roma", desc: "mit Schinken und Champignons", prices: [10.9], codes: "A,G,F,J,6,7,8" },
    { nr: "116", cat: "pizza", name: "Hackfleisch", desc: "mit Zwiebel", prices: [10.9] },
    { nr: "117", cat: "pizza", name: "Vegetarisch", desc: "mit Champignons, Paprika, Oliven und Zwiebeln", prices: [10.4], codes: "A,G,9", tags: ["vegetarisch"] },
    { nr: "118", cat: "pizza", name: "Pindi Express", desc: "mit Chicken, Ananas, Curry", prices: [10.4], codes: "A,G,F" },
    { nr: "119", cat: "pizza", name: "Salmone", desc: "gegrilltes Lachsfilet und Knoblauch", prices: [10.9], codes: "A,G,D" },
    { nr: "120", cat: "pizza", name: "Gamberetti", desc: "mit Krabben und Knoblauch", prices: [10.9], codes: "A,G,D" },
    { nr: "121", cat: "pizza", name: "Frutti di Mare", desc: "Meeresfrüchte, Knoblauch", prices: [10.9], codes: "A,G,D" },
    { nr: "122", cat: "pizza", name: "Speziale", desc: "mit Salami, Schinken, Champignons, Peperoni", prices: [10.9], codes: "A,G,F,J,6,7,8" },
    { nr: "123", cat: "pizza", name: "Venezia", desc: "mit Salami, Schinken, Champignons und Oliven", prices: [10.9], codes: "A,G,F,J,6,7,8,9" },
    { nr: "124", cat: "pizza", name: "Vera", desc: "mit Salami, Schinken, Champignons und Ei", prices: [10.9], codes: "A,G,F,J,6,7,8" },
    { nr: "125", cat: "pizza", name: "Quattro Formaggi", desc: "mit vier verschiedenen Käsesorten", prices: [10.9], codes: "A,G,2" },
    { nr: "126", cat: "pizza", name: "Minar Spezial", desc: "mit Hackfleischdrehspieß, Sucuk, Peperoni und Zwiebeln", prices: [11.9], codes: "A,G,F,J,6,7,8" },
    { nr: "128", cat: "pizza", name: "Calzone Spezial", desc: "mit Salami, Schinken, Peperoni und Champignons", prices: [10.9], codes: "A,G,F,J,6,7,8" },
    { nr: "129", cat: "pizza", name: "Calzone Kebap", desc: "mit Hackfleischdrehspieß und Zwiebeln", prices: [10.9], codes: "A,G,F,J,6,7,8" },
    { nr: "131", cat: "pizza", name: "Sardellen", desc: "mit Oliven und Kapern", prices: [10.9] },
    { nr: "132", cat: "pizza", name: "Artischocke", prices: [9.9] },
    { nr: "133", cat: "pizza", name: "Paprika", prices: [9.9] },
    { nr: "134", cat: "pizza", name: "Caprese", desc: "mit Mozzarella und Tomaten", prices: [10.9] },
    { nr: "134a", cat: "pizza", name: "Oliven", prices: [8.9] },

    /* PARTY PIZZA (40 × 60 cm) */
    { nr: "135", cat: "partypizza", name: "Partypizza Margherita", prices: [28.0], codes: "A,G" },
    { nr: "136", cat: "partypizza", name: "Partypizza", desc: "mit vier Belägen nach Wahl", prices: [34.0], codes: "A,C,G,F,J,6,7,8", opts: ["partypizza-belag"] },

    /* NUDELGERICHTE */
    { nr: "139", cat: "nudeln", name: "Aglio Spaghetti", desc: "mit Knoblauch, Oliven, Peperoni", prices: [8.9], codes: "A,C,F,6,9", opts: ["nudel-sorte", "nudel-ueberb"] },
    { nr: "140", cat: "nudeln", name: "Napoli", desc: "mit Tomatensoße", prices: [9.0], codes: "A,C,F,6", opts: ["nudel-sorte", "nudel-ueberb"] },
    { nr: "141", cat: "nudeln", name: "Arrabbiata", desc: "Tomatensoße, Peperoni, scharf", prices: [9.9], codes: "A,C,F,6", opts: ["nudel-sorte", "nudel-ueberb"], tags: ["scharf"] },
    { nr: "142", cat: "nudeln", name: "Bolognese", desc: "mit Tomaten-Hackfleischsoße", prices: [10.9], codes: "A,C,G,F,J,6,7,8", opts: ["nudel-sorte", "nudel-ueberb"] },
    { nr: "143", cat: "nudeln", name: "Brokkoli", desc: "Pilze und Sahnesoße", prices: [10.9], codes: "A,C,F,6", opts: ["nudel-sorte", "nudel-ueberb"] },
    { nr: "144", cat: "nudeln", name: "Carbonara", desc: "mit Schinken, Erbsen, Ei und Sahnesoße", prices: [10.9], codes: "A,C,G,F,J,6,7,8", opts: ["nudel-sorte", "nudel-ueberb"] },
    { nr: "145", cat: "nudeln", name: "Vegetarisch", desc: "Pilze, Erbsen, Brokkoli, Tomatensahnesoße", prices: [10.9], codes: "A,C", opts: ["nudel-sorte", "nudel-ueberb"], tags: ["vegetarisch"] },
    { nr: "146", cat: "nudeln", name: "Emiliani", desc: "mit Schinken, Champignons, Erbsen und Tomatensahnesoße", prices: [10.9], codes: "A,C,G,F,J,6,7,8", opts: ["nudel-sorte", "nudel-ueberb"] },
    { nr: "147", cat: "nudeln", name: "Quattro Formaggi", desc: "vier Käsesorten, Sahnesoße", prices: [10.9], codes: "A,C,G", opts: ["nudel-sorte", "nudel-ueberb"] },
    { nr: "149", cat: "nudeln", name: "Spinaci", desc: "mit Gorgonzola, Sahnesoße", prices: [10.9], codes: "A,C,G", opts: ["nudel-sorte", "nudel-ueberb"] },
    { nr: "150", cat: "nudeln", name: "Con Pollo", desc: "mit Hähnchenbrust, Champignons und Tomaten-Sahnesoße", prices: [11.9], codes: "A,C,G,6", opts: ["nudel-sorte", "nudel-ueberb"] },
    { nr: "151", cat: "nudeln", name: "Salmone", desc: "Lachsfilet, Champignons, Sahnesoße", prices: [13.9], codes: "A,C,D,G", opts: ["nudel-sorte", "nudel-ueberb"] },
    { nr: "152", cat: "nudeln", name: "Gamberoni", desc: "Krabben, Knoblauch und Tomatensahnesoße", prices: [12.9], codes: "A,C,D,G", opts: ["nudel-sorte", "nudel-ueberb"] },
    { nr: "153", cat: "nudeln", name: "Frutti di Mare", desc: "Meeresfrüchte, Knoblauch, Tomatensoße", prices: [12.9], codes: "A,C,D,G", opts: ["nudel-sorte", "nudel-ueberb"] },

    /* CHINESISCHE NUDELN */
    { nr: "205", cat: "chinanudeln", name: "Chicken Vegetables Nudel", prices: [9.9] },
    { nr: "206", cat: "chinanudeln", name: "Vegetables Nudel", prices: [8.9] },

    /* GNOCCHI */
    { nr: "210", cat: "gnocchi", name: "Napoli", desc: "mit Tomatensoße", prices: [8.9], codes: "A,C,F,6", opts: ["nudel-ueberb"] },
    { nr: "211", cat: "gnocchi", name: "Bolognese", desc: "mit Tomaten-Hackfleischsoße", prices: [10.9], codes: "A,C,F,6", opts: ["nudel-ueberb"] },
    { nr: "212", cat: "gnocchi", name: "Vegetarisch", desc: "Pilze, Erbsen, Brokkoli, Tomatensoße", prices: [10.9], codes: "A,C", tags: ["vegetarisch"], opts: ["nudel-ueberb"] },
    { nr: "213", cat: "gnocchi", name: "Quattro Formaggi", desc: "vier Käsesorten, Sahnesoße", prices: [10.9], codes: "A,C,G", opts: ["nudel-ueberb"] },

    /* INDISCH, PAKISTANISCH */
    { nr: "155", cat: "indisch", name: "Naan", prices: [4.0], codes: "A,C,G" },
    { nr: "156", cat: "indisch", name: "Garlic Naan", desc: "Knoblauch, Koriander", prices: [4.5], codes: "A,C,G" },
    { nr: "157", cat: "indisch", name: "Mix Chicken Vegetable Masala", desc: "Hähnchenbrust, verschiedenes Gemüse in Currysoße", prices: [14.9], codes: "F,G,2,6" },
    { nr: "158", cat: "indisch", name: "Minar Chicken Cheese Masala", desc: "Hähnchenbrust, Zwiebeln und Minar Gewürzmischung, Cheddar- und Edamerkäse in Cheesecurry-Joghurtsoße", prices: [16.9], codes: "F,G,2,6" },
    { nr: "160", cat: "indisch", name: "Chicken Curry", desc: "Hähnchenbrust in Currysoße", prices: [14.9], codes: "F,G,2,6" },
    { nr: "161", cat: "indisch", name: "Chicken Korma", desc: "Hähnchenbrust in Curry-Joghurtsoße", prices: [14.9], codes: "F,G,2,6" },
    { nr: "162", cat: "indisch", name: "Chili Chicken", desc: "Hähnchenbrust in pikanter Soße nach indischer Art", prices: [14.9], codes: "F,G,2,6" },
    { nr: "163", cat: "indisch", name: "Chicken Palak", desc: "Hähnchenbrust und Spinat in Currysoße", prices: [14.9], codes: "F,G,2,6" },
    { nr: "166", cat: "indisch", name: "Butter Chicken", desc: "mit Tomaten, Kurkuma, Garam Masala, Joghurt", prices: [14.9], codes: "F,G,2,6" },
    { nr: "167", cat: "indisch", name: "Chicken Tikka Masala", desc: "Hähnchenstücke in Joghurt, Tomatensoße, Zwiebel und Ingwer", prices: [14.9], codes: "F,G,2,6" },

    /* VEGETARISCHE GERICHTE */
    { nr: "170", cat: "vegetarisch", name: "Alu Palak", desc: "Kartoffeln, Spinat in Currysoße", prices: [12.9], codes: "F,G,2,6", tags: ["vegetarisch"] },
    { nr: "172", cat: "vegetarisch", name: "Mixed Vegetables", desc: "verschiedenes Gemüse in Currysoße", prices: [13.9], codes: "F,G,2,6", tags: ["vegetarisch"] },

    /* SCHNITZEL UND STEAK */
    { nr: "180", cat: "schnitzel", name: "Wiener Art", prices: [10.9], codes: "A,C", opts: ["dips"] },
    { nr: "181", cat: "schnitzel", name: "Allgäuer Art", desc: "überbacken mit Schinken, Käse", prices: [14.5], codes: "A,C,G", opts: ["dips"] },
    { nr: "182", cat: "schnitzel", name: "Hawaii", desc: "überbacken mit Schinken, Ananas und Käse", prices: [14.5], codes: "A,C", opts: ["dips"] },
    { nr: "183", cat: "schnitzel", name: "Diabolo", desc: "mit Chili, Salami, Jalapeños, Edamer und Cheddarkäse, überbacken", prices: [15.5], codes: "A,C", opts: ["dips"] },
    { nr: "184", cat: "schnitzel", name: "Los Angeles", desc: "mit Jalapeños, Ananas, Edamer und Cheddarkäse, überbacken", prices: [15.5], codes: "A,C,G", opts: ["dips"] },

    /* DESSERT */
    { nr: "190", cat: "dessert", name: "Brownie", prices: [3.9], codes: "C,G" },
    { nr: "192", cat: "dessert", name: "Donut", prices: [2.9], codes: "A,C,G" },
    { nr: "193", cat: "dessert", name: "Ben & Jerry’s", desc: "100 ml", prices: [3.9], codes: "A,C,G", opts: ["eis-sorte"] },
    { nr: "195", cat: "dessert", name: "Tiramisu", prices: [3.9], codes: "A,C,G" },

    /* GETRÄNKE */
    { cat: "getraenke", name: "Ayran", prices: [["0,25 l", 1.5]], codes: "G", pfand: 0 },
    { cat: "getraenke", name: "Mineralwasser", prices: [["0,5 l", 2.0]], pfand: 0.25 },
    { cat: "getraenke", name: "Multivitamin", prices: [["0,5 l", 2.5]], pfand: 0.25 },
    { cat: "getraenke", name: "Coca-Cola", prices: [["0,33 l", 2.25], ["0,5 l", 2.5], ["1,0 l", 3.5]], codes: "O,2", pfand: 0.25 },
    { cat: "getraenke", name: "Cola Zero", prices: [["0,33 l", 2.25], ["0,5 l", 2.5], ["1,0 l", 3.5]], codes: "O,2", pfand: 0.25 },
    { cat: "getraenke", name: "Fanta", prices: [["0,33 l", 2.25], ["0,5 l", 2.5], ["1,0 l", 3.5]], codes: "2,5,7", pfand: 0.25 },
    { cat: "getraenke", name: "Mezzo Mix", prices: [["0,33 l", 2.25], ["0,5 l", 2.5], ["1,0 l", 3.5]], codes: "O,2,7", pfand: 0.25 },
    { cat: "getraenke", name: "Uludağ", prices: [["0,33 l", 2.25], ["0,5 l", 2.5], ["1,0 l", 3.5]], codes: "3,4", pfand: 0.25 },
    { cat: "getraenke", name: "Sprite", prices: [["0,33 l", 2.25], ["0,5 l", 2.5], ["1,0 l", 3.5]], pfand: 0.25 },
    { cat: "getraenke", name: "Eistee", prices: [["1,0 l", 4.5]], pfand: 0.25 },
    { cat: "getraenke", name: "Red Bull", prices: [3.5], pfand: 0.25 }
  ]
};
