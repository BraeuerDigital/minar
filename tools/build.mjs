#!/usr/bin/env node
/* =====================================================================
   MINAR Küche – Seitengenerator
   ---------------------------------------------------------------------
   Erzeugt alle statischen HTML-Seiten mit einheitlichem Header, Footer
   und Navigation aus EINER Quelle (dieser Datei + assets/js/menu-data.js).

   Ausführen (Node.js ≥ 16, keine Pakete nötig):
       node tools/build.mjs

   Nötig nur, wenn sich Header, Footer, Seitentexte oder die LISTE der
   Kategorien ändern. Preise und Gerichte werden zur Laufzeit aus
   assets/js/menu-data.js gelesen – dafür ist KEIN Build nötig.
   ===================================================================== */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "assets/js/menu-data.js"), "utf8"), ctx);
const D = ctx.window.MINAR_DATA;
const R = D.restaurant;
const CATS = D.categories;

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const MAPS = "https://www.google.com/maps/search/?api=1&amp;query=" + encodeURIComponent(`${R.name}, ${R.street}, ${R.zip} ${R.city}`);
const TEL = `tel:${R.phoneLink}`;
const WA = `https://wa.me/${R.whatsappNumber}`;
const CSS_VERSION = Date.now().toString(36);

/* ---------- Icons ---------- */
const I = {
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5 9 3l1.6 4.2-2 1.4a11 11 0 0 0 6.8 6.8l1.4-2L21 15l-.5 2.4a2 2 0 0 1-2 1.6A15.5 15.5 0 0 1 5 5.5a2 2 0 0 1 1.6-2Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19l-4 1Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 9.2c.3 2.5 2.3 4.6 4.8 5l1.2-1.2 1.6.8c-.2 1-1 1.7-2 1.7-3.4 0-6.1-2.8-6.1-6.1 0-1 .7-1.8 1.7-2l.8 1.6L9 9.2Z" fill="currentColor"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="9.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
  bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 7Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 9.5V6a3 3 0 0 1 6 0v3.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  bike: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="17" r="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="18" cy="17" r="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8.5 17h7M3 12h9l2-5h3l3 7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/></svg>',
  house: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V10l8-6 8 6v11M9 21v-6h6v6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m20 20-4.2-4.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

/* Geschwungenes Flyer-Band (Grün/Rot → Gelb), wie im unteren Logo-/Flyerbereich */
const swoosh = (cls = "") => `<div class="swoosh ${cls}" aria-hidden="true"><svg viewBox="0 0 1440 120" preserveAspectRatio="none">
  <path class="sw-yellow" d="M0 40 Q720 150 1440 40 V120 H0Z"/>
  <path class="sw-red" d="M0 30 Q720 140 1440 30 V44 Q720 154 0 44Z"/>
  <path class="sw-green" d="M0 6 Q720 112 1440 6 V20 Q720 126 0 20Z"/>
</svg></div>`;

/* ---------- Navigation ---------- */
const NAV = [
  ["start", "index.html", "Startseite"],
  ["speisekarte", "speisekarte/index.html", "Speisekarte"],
  ["lieferservice", "lieferservice.html", "Lieferservice"],
  ["ueber-uns", "ueber-uns.html", "Über uns"],
  ["kontakt", "kontakt.html", "Kontakt"]
];

function header(root, active) {
  const links = NAV.map(([k, href, label]) =>
    `<li><a href="${root}${href}"${k === active ? ' aria-current="page" class="is-active"' : ""}>${label}</a></li>`).join("\n          ");
  return `<a class="skip-link" href="#inhalt">Zum Inhalt springen</a>
  <header class="site-header">
    <div class="topbar">
      <div class="container topbar-inner">
        <span class="topbar-claim">Restaurant · Lieferservice · Abholung</span>
        <span class="topbar-status"><span class="status-dot" data-open-dot></span><span data-open-status-long>Öffnungszeiten: täglich ${D.hours.open}–${D.hours.close} Uhr, Dienstag Ruhetag</span></span>
        <a class="topbar-tel" href="${TEL}">${I.phone}<span>${esc(R.phoneDisplay)}</span></a>
      </div>
    </div>
    <div class="container header-inner">
      <a class="brand" href="${root}index.html" aria-label="MINAR Küche – zur Startseite">
        <img src="${root}assets/logo/minar-logo-horizontal.svg" alt="MINAR Küche" width="236" height="56">
      </a>
      <nav class="main-nav" id="main-nav" aria-label="Hauptnavigation">
        <ul>
          ${links}
        </ul>
        <div class="mobile-nav-extra">
          <a class="btn btn-primary btn-block" href="${root}bestellen.html">Jetzt bestellen</a>
          <a class="btn btn-ghost btn-block" href="${TEL}">${I.phone}Anrufen · ${esc(R.phoneDisplay)}</a>
        </div>
      </nav>
      <div class="header-actions">
        <img class="header-halal" src="${root}assets/logo/halal-siegel.svg" alt="Halal" title="Halal" width="40" height="38">
        <a class="icon-btn cart-link${active === "bestellen" ? " is-active" : ""}" href="${root}bestellen.html" aria-label="Warenkorb">${I.bag}<span class="cart-count" data-cart-count hidden>0</span></a>
        <a class="btn btn-primary header-order${active === "bestellen" ? " is-current" : ""}" href="${root}bestellen.html"${active === "bestellen" ? ' aria-current="page"' : ""}>Jetzt bestellen</a>
        <button class="icon-btn nav-toggle" type="button" aria-controls="main-nav" aria-expanded="false" aria-label="Menü öffnen"><span></span><span></span><span></span></button>
      </div>
    </div>
  </header>`;
}

function footer(root) {
  return `${swoosh("swoosh-footer")}
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <img src="${root}assets/logo/minar-logo.svg" alt="MINAR Küche – Logo" width="200" height="154" loading="lazy">
      </div>
      <div>
        <h2 class="footer-h">Adresse</h2>
        <p>${esc(R.name)}<br>${esc(R.street)}<br>${esc(R.zip)} ${esc(R.city)}</p>
        <p><a class="footer-link" href="${MAPS}" target="_blank" rel="noopener">${I.pin}Route planen</a></p>
      </div>
      <div>
        <h2 class="footer-h">Kontakt</h2>
        <p><a class="footer-link" href="${TEL}">${I.phone}${esc(R.phoneDisplay)}</a><br>
        <a class="footer-link" href="${WA}" target="_blank" rel="noopener">${I.wa}${esc(R.whatsappDisplay)}</a><br>
        <a class="footer-link" href="mailto:${esc(R.email)}">${I.mail}${esc(R.email)}</a></p>
        <h2 class="footer-h">Öffnungszeiten</h2>
        <p>Täglich ${D.hours.open}–${D.hours.close} Uhr<br>Dienstag Ruhetag<br>Bestellannahme bis ${D.hours.orderUntil} Uhr</p>
      </div>
      <nav aria-label="Footer-Navigation">
        <h2 class="footer-h">Navigation</h2>
        <ul class="footer-nav">
          ${NAV.map(([, href, label]) => `<li><a href="${root}${href}">${label}</a></li>`).join("")}
          <li><a href="${root}bestellen.html">Bestellen</a></li>
        </ul>
      </nav>
    </div>
    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <p>© <span data-year>2026</span> ${esc(R.name)} · ${esc(R.city)}</p>
        <p><a href="${root}impressum.html">Impressum</a> · <a href="${root}datenschutz.html">Datenschutz</a></p>
        <p class="footer-credit"><span>Webauftritt von</span> <a class="credit-link" href="https://braeuer.digital" target="_blank" rel="noopener">Bräuer.Digital</a></p>
      </div>
    </div>
  </footer>
  <a class="cart-fab" href="${root}bestellen.html" data-cart-fab hidden>
    ${I.bag}<span>Warenkorb</span><span class="cart-fab-count" data-cart-count>0</span><span class="cart-fab-total" data-cart-total></span>
  </a>
  <div class="toast" role="status" aria-live="polite" data-toast></div>`;
}

const itemDialog = `
  <dialog class="sheet" id="item-dialog" aria-labelledby="item-dialog-title">
    <form class="sheet-inner" method="dialog" data-item-form>
      <div class="sheet-head">
        <div>
          <p class="item-dialog-nr" data-item-nr></p>
          <h2 id="item-dialog-title" data-item-title></h2>
        </div>
        <button class="icon-btn sheet-close" type="button" data-close aria-label="Schließen">×</button>
      </div>
      <p class="item-dialog-desc" data-item-desc></p>
      <fieldset class="opt-group" data-item-variants hidden>
        <legend>Größe / Variante</legend>
        <div class="opt-list" data-variant-list></div>
      </fieldset>
      <div data-item-opts></div>
      <label class="field">
        <span>Hinweis zu diesem Gericht <small>(optional)</small></span>
        <input type="text" maxlength="120" placeholder="z. B. ohne Zwiebeln" data-item-note>
      </label>
      <div class="sheet-foot">
        <div class="qty" aria-label="Menge">
          <button type="button" data-qty-minus aria-label="Weniger">−</button>
          <output data-qty>1</output>
          <button type="button" data-qty-plus aria-label="Mehr">+</button>
        </div>
        <button class="btn btn-primary btn-grow" type="submit" data-item-add>Hinzufügen</button>
      </div>
    </form>
  </dialog>`;

function page({ file, title, desc, active, body, dialog = false, bodyClass = "" }) {
  const depth = file.split("/").length - 1;
  const root = depth ? "../".repeat(depth) : "";
  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="robots" content="noindex, nofollow">
  <meta name="theme-color" content="#151A0E">
  <link rel="icon" href="${root}assets/logo/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="${root}assets/logo/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="${root}assets/logo/apple-touch-icon.png">
  <link rel="stylesheet" href="${root}assets/css/styles.css?v=${CSS_VERSION}">
</head>
<body class="${bodyClass}" data-page="${active}">
  ${header(root, active)}
  <main id="inhalt">
${body(root)}
  </main>
  ${footer(root)}${dialog ? itemDialog : ""}
  <script src="${root}assets/js/menu-data.js?v=${CSS_VERSION}"></script>
  <script src="${root}assets/js/app.js?v=${CSS_VERSION}"></script>
  <script src="${root}assets/js/fx.js?v=${CSS_VERSION}"></script>
</body>
</html>
`;
  const out = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  return file;
}

/* ---------- Bausteine ---------- */
const halalBadge = (root, cls = "") => `<p class="halal-badge ${cls}"><img src="${root}assets/logo/halal-siegel.svg" alt="" width="44" height="42"><span>${esc(D.halalNote)}</span></p>`;
const noscript = `<noscript><p class="notice">Die Speisekarte benötigt JavaScript. Gerne nehmen wir Ihre Bestellung auch telefonisch unter <a href="${TEL}">${esc(R.phoneDisplay)}</a> entgegen.</p></noscript>`;
const pageHead = (eyebrow, h1, lead = "", extra = "") => `
    <section class="page-head">
      <div class="container">
        <p class="eyebrow">${eyebrow}</p>
        <h1>${h1}</h1>
        ${lead ? `<p class="lead">${lead}</p>` : ""}
        ${extra}
      </div>
    </section>`;
const contactCards = () => `
        <div class="contact-cards">
          <a class="contact-card" href="${TEL}"><span class="contact-ico">${I.phone}</span><span><small>Telefon</small>${esc(R.phoneDisplay)}</span></a>
          <a class="contact-card" href="${WA}" target="_blank" rel="noopener"><span class="contact-ico">${I.wa}</span><span><small>WhatsApp</small>${esc(R.whatsappDisplay)}</span></a>
          <a class="contact-card" href="${MAPS}" target="_blank" rel="noopener"><span class="contact-ico">${I.pin}</span><span><small>Route planen</small>In Google Maps öffnen</span></a>
        </div>
        <p class="fine">Der Kartenlink öffnet Google Maps in einem neuen Fenster; erst dann werden Daten an Google übermittelt.</p>`;
const hoursCard = () => `
        <div class="hours-card">
          <h2 class="hours-title">${I.clock}Öffnungszeiten</h2>
          <ul class="hours-list" data-hours-list></ul>
          <p class="hours-note">Bestellannahme bis ${D.hours.orderUntil} Uhr · Dienstag Ruhetag</p>
          <p class="hours-live"><span class="status-dot" data-open-dot></span><span data-open-status-long></span></p>
        </div>`;
const ctaBand = (root) => `
    <section class="cta-band">
      <div class="container cta-inner">
        <div>
          <h2>Hunger bekommen?</h2>
          <p>Gerichte online auswählen und als WhatsApp-Nachricht senden – oder einfach anrufen.</p>
        </div>
        <div class="cta-actions">
          <a class="btn btn-accent btn-lg" href="${root}speisekarte/index.html">Speisekarte entdecken</a>
          <a class="btn btn-light btn-lg" href="${TEL}">${I.phone}Anrufen</a>
        </div>
      </div>
    </section>`;

const tape = (words, n) => { const one = Array(n).fill(words).flat().map((w) => `<span>${esc(w)}</span><i>✦</i>`).join(""); return one + one; };

const built = [];

/* ===================== Startseite ===================== */
const GALLERY = [
  ["burger-pommes", "Burger mit Pommes", "burger"],
  ["doenerteller", "Dönerteller mit Wedges, Salat und Soße", "doener"],
  ["curry-reis", "Curry mit Reis", "indisch"],
  ["salat", "Bunter Salat mit Tomaten, Karotten, Gurke und Rotkohl", "salate"],
  ["schnitzel-kaesespaetzle", "Paniertes Schnitzel mit Käsespätzle und Salat", "schnitzel"]
];
const TEASER = ["pizza", "doener", "burger", "indisch", "salate", "nudeln", "fingerfood", "partyplatten"];
built.push(page({
  file: "index.html", active: "start", bodyClass: "page-home",
  title: "MINAR Küche · Bad Buchau – Restaurant, Lieferservice & Abholung",
  desc: "MINAR Küche in Bad Buchau: Pizza, Döner, Burger, Salate, Nudeln sowie indische und pakistanische Gerichte – im Restaurant, zur Abholung oder per Lieferservice.",
  body: (root) => `
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-logo">
          ${fs.readFileSync(path.join(ROOT, "assets/logo/minar-logo-anim.svg"), "utf8").trim()}
          <script src="${root}assets/js/logo-anim.js?v=${CSS_VERSION}"></script>
        </div>
        <div class="hero-copy reveal">
          <p class="eyebrow"><span class="status-dot" data-open-dot></span><span data-open-status>Bad Buchau · ${esc(R.street)}</span></p>
          <h1>Von Pizza bis Curry&nbsp;–<br><span>alles aus einer Küche.</span></h1>
          <p class="lead">Pizza, Döner, Burger, Salate, Nudeln sowie indische und pakistanische Gerichte: Bei MINAR Küche in Bad Buchau essen Sie im Restaurant, holen ab oder lassen sich beliefern.</p>
          <div class="hero-actions">
            <a class="btn btn-primary btn-lg" href="${root}speisekarte/index.html">Speisekarte entdecken</a>
            <a class="btn btn-accent btn-lg" href="${root}bestellen.html">Jetzt bestellen</a>
          </div>
          ${halalBadge(root)}
        </div>
      </div>
      <div class="tapes" aria-hidden="true">
        <div class="tape tape-red"><div class="tape-track">${tape(["Restaurant", "Lieferservice", "Abholung", "Bad Buchau"], 6)}</div></div>
        <div class="tape tape-green"><div class="tape-track">${tape(CATS.map((c) => c.name), 2)}</div></div>
      </div>
      <p class="visually-hidden">Restaurant · Lieferservice · Abholung</p>
    </section>

    <section class="section intro">
      <div class="container intro-grid">
        <div class="reveal">
          <p class="eyebrow">Willkommen bei MINAR Küche</p>
          <h2 class="h-red">Eine Karte, viele Lieblingsgerichte</h2>
          <p>Unsere Speisekarte umfasst ${D.items.length} Positionen in ${CATS.length} Kategorien – von Salaten, Pizza und Pasta über Döner, Burger und Fingerfood bis zu Currys und Masala-Gerichten der indischen und pakistanischen Küche.</p>
          <p>Laut unserer Karte bereiten wir alle Speisen frisch für Sie zu.</p>
          <a class="text-link" href="${root}ueber-uns.html">Mehr über uns ${I.arrow}</a>
        </div>
        <ul class="service-list reveal">
          <li><span class="service-ico">${I.house}</span><div><h3>Im Restaurant</h3><p>Täglich ${D.hours.open}–${D.hours.close} Uhr, dienstags Ruhetag.</p></div></li>
          <li><span class="service-ico">${I.bag}</span><div><h3>Zur Abholung</h3><p>Telefonisch, per WhatsApp oder über den Online-Warenkorb bestellen.</p></div></li>
          <li><span class="service-ico">${I.bike}</span><div><h3>Lieferservice</h3><p>Bad Buchau und ${D.delivery.zones.reduce((n, z) => n + z.places.length, 0) - 1} weitere Orte in der Umgebung.</p></div></li>
        </ul>
      </div>
    </section>

    <section class="section gallery-section">
      <div class="container">
        <div class="section-head-row">
          <div>
            <p class="eyebrow">Aus unserer Küche</p>
            <h2 class="h-red">Frisch auf den Teller</h2>
          </div>
          <p class="fine gallery-note">Alle Fotos sind Beispiele.</p>
        </div>
        <div class="gallery">
          ${GALLERY.map(([img, alt, cat], i) => { const c = CATS.find((x) => x.id === cat); return `<a class="gallery-item${i === 0 ? " gallery-item-lg" : ""} reveal" href="${root}speisekarte/${c.slug}.html"><img src="${root}assets/images/${img}${i === 0 ? "" : "-sm"}.jpg" alt="${esc(alt)}" loading="lazy" decoding="async"><span class="gallery-cap">${esc(c.name)}${I.arrow}</span></a>`; }).join("\n          ")}
        </div>
      </div>
    </section>

    <section class="section teaser">
      <div class="container">
        <div class="section-head-row">
          <div>
            <p class="eyebrow">Aus unserer Speisekarte</p>
            <h2 class="h-red">Beliebte Kategorien</h2>
          </div>
          <a class="btn btn-outline" href="${root}speisekarte/index.html">Alle ${CATS.length} Kategorien</a>
        </div>
        <div class="cat-grid">
          ${TEASER.map((id) => { const c = CATS.find((x) => x.id === id); return `<a class="cat-card reveal" href="${root}speisekarte/${c.slug}.html" data-cat-card="${c.id}"><span class="cat-card-name">${esc(c.name)}</span><span class="cat-card-meta" data-cat-meta></span><span class="cat-card-go">${I.arrow}</span></a>`; }).join("\n          ")}
        </div>
      </div>
    </section>

    <section class="section delivery-teaser">
      <div class="container delivery-teaser-grid">
        <div class="reveal">
          <p class="eyebrow eyebrow-light">Lieferservice &amp; Abholung</p>
          <h2>Wir liefern in Bad Buchau und Umgebung</h2>
          <p>Lieferzeit je nach Entfernung 20–90 Minuten. Mindestbestellwert und Lieferkosten richten sich nach Ihrem Ort.</p>
          <a class="btn btn-accent" href="${root}lieferservice.html">Liefergebiete ansehen</a>
        </div>
        <ul class="zone-pills reveal" data-zone-pills></ul>
      </div>
    </section>

    <section class="section visit">
      <div class="container visit-grid">
        <div class="reveal">
          <p class="eyebrow">Öffnungszeiten &amp; Standort</p>
          <h2 class="h-red">Besuchen Sie uns</h2>
          <address class="address">${esc(R.name)}<br>${esc(R.street)}<br>${esc(R.zip)} ${esc(R.city)}</address>
          ${contactCards()}
        </div>
        <div class="reveal">${hoursCard()}</div>
      </div>
    </section>
${ctaBand(root)}`
}));

/* ===================== Speisekarte (komplett) ===================== */
built.push(page({
  file: "speisekarte/index.html", active: "speisekarte", dialog: true, bodyClass: "page-menu page-fullmenu",
  title: "Speisekarte · MINAR Küche Bad Buchau",
  desc: "Die komplette Speisekarte von MINAR Küche: Salate, Burger, Pizza, Döner, Nudeln, indische und pakistanische Gerichte, Desserts und Getränke.",
  body: (root) => `
    <section class="page-head page-head-cat">
      <div class="container">
        <h1 class="h-red">Speisekarte</h1>
        ${halalBadge(root, "halal-badge-sm")}
        <form class="search" role="search" data-search-form>
          <label class="visually-hidden" for="q">Speisekarte durchsuchen</label>
          ${I.search}
          <input id="q" name="q" type="search" placeholder="z. B. Margherita, Lachs oder 96a" autocomplete="off" data-menu-search>
          <button type="button" class="search-clear" data-search-clear aria-label="Suche leeren" hidden>×</button>
        </form>
      </div>
    </section>
    <nav class="cat-nav" aria-label="Kategorien">
        <div class="container"><ul class="chips" data-scrollspy>
          ${CATS.map((x) => `<li><a class="chip" href="#${x.slug}">${esc(x.name)}</a></li>`).join("")}
        </ul></div>
      </nav>
    <section class="section section-tight">
      <div class="container">
        ${noscript}
        <div class="search-results" data-search-results aria-live="polite" hidden></div>
        <div class="full-menu" data-cat-overview>
          ${CATS.map((c, i) => `<section class="menu-cat" id="${c.slug}" aria-labelledby="h-${c.slug}">
            <header class="menu-cat-head">
              <div><h2 class="h-red" id="h-${c.slug}">${esc(c.name)}</h2>${c.desc ? `<p class="fine">${esc(c.desc)}</p>` : ""}</div>
              ${c.img ? `<img class="menu-cat-img" src="../assets/images/${c.img}-sm.jpg" alt="${esc(c.imgAlt || c.name)}" loading="lazy" decoding="async">` : ""}
            </header>
            <div class="menu-items" data-menu-list="${c.id}"></div>
          </section>`).join("\n          ")}
        </div>
        <div data-legend-slot></div>
      </div>
    </section>`
}));

/* ===================== Kategorieseiten ===================== */
CATS.forEach((c, i) => {
  const prev = CATS[(i - 1 + CATS.length) % CATS.length], next = CATS[(i + 1) % CATS.length];
  built.push(page({
    file: `speisekarte/${c.slug}.html`, active: "speisekarte", dialog: true, bodyClass: "page-menu page-category",
    title: `${c.name} · Speisekarte · MINAR Küche Bad Buchau`,
    desc: `${c.name} bei MINAR Küche in Bad Buchau – alle Gerichte mit Preisen, Größen und Allergenkennzeichnung.`,
    body: () => `
    <section class="page-head page-head-cat">
      <div class="container">
        <nav class="breadcrumb" aria-label="Brotkrümelnavigation"><a href="index.html">${I.back}Speisekarte</a><span aria-hidden="true">/</span><span aria-current="page">${esc(c.name)}</span></nav>
        <div class="cat-head${c.img ? " has-img" : ""}">
          <div>
            <h1 class="h-red">${esc(c.name)}</h1>
            ${c.desc ? `<p class="lead">${esc(c.desc)}</p>` : ""}
            <form class="search search-sm" role="search" action="index.html" method="get">
          <label class="visually-hidden" for="q">Ganze Speisekarte durchsuchen</label>
          ${I.search}<input id="q" name="q" type="search" placeholder="Ganze Speisekarte durchsuchen …" autocomplete="off">
            </form>
          </div>
          ${c.img ? `<figure class="cat-head-img"><img src="../assets/images/${c.img}-sm.jpg" alt="${esc(c.imgAlt || c.name)}" width="720" height="540" decoding="async"><figcaption>Foto ist ein Beispiel.</figcaption></figure>` : ""}
        </div>
      </div>
    </section>
    <nav class="cat-nav" aria-label="Kategorien">
        <div class="container"><ul class="chips">
          ${CATS.map((x) => `<li><a class="chip" href="${x.slug}.html"${x.id === c.id ? ' aria-current="page"' : ""}>${esc(x.name)}</a></li>`).join("")}
        </ul></div>
      </nav>
    <section class="section section-tight">
      <div class="container">
        ${noscript}
        <div class="menu-items" data-menu-list="${c.id}"></div>
        <nav class="cat-pager" aria-label="Weitere Kategorien">
          <a href="${prev.slug}.html" class="cat-pager-prev">${I.back}<span><small>Vorherige</small>${esc(prev.name)}</span></a>
          <a href="index.html" class="cat-pager-all">Alle Kategorien</a>
          <a href="${next.slug}.html" class="cat-pager-next"><span><small>Nächste</small>${esc(next.name)}</span>${I.arrow}</a>
        </nav>
        <div data-legend-slot></div>
      </div>
    </section>`
  }));
});

/* ===================== Bestellen ===================== */
built.push(page({
  file: "bestellen.html", active: "bestellen", dialog: true, bodyClass: "page-order",
  title: "Bestellen · MINAR Küche Bad Buchau",
  desc: "Warenkorb und Bestellvorbereitung per WhatsApp – MINAR Küche Bad Buchau.",
  body: (root) => `${pageHead("Bestellen", "Ihre Bestellung", "Stellen Sie Ihre Bestellung zusammen und senden Sie sie als WhatsApp-Nachricht an uns.")}
    <section class="section section-tight">
      <div class="container order-grid">
        <div class="order-main">
          <div class="order-note" role="note"><strong>Wichtig:</strong> Die Bestellung wird erst nach Bestätigung durch das Restaurant angenommen. Es erfolgt keine Onlinezahlung und keine automatische Bestellannahme.</div>

          <div class="cart-empty" data-cart-empty>
            <h2>Ihr Warenkorb ist noch leer.</h2>
            <p>Wählen Sie Ihre Gerichte in der Speisekarte aus – oder bestellen Sie direkt telefonisch bzw. per WhatsApp.</p>
            <a class="btn btn-primary btn-lg" href="${root}speisekarte/index.html">Zur Speisekarte</a>
          </div>

          <div class="cart-body" data-cart-body hidden>
            <h2 class="h-red h-sm">Warenkorb</h2>
            <ul class="cart-lines" data-cart-lines></ul>
            <div class="cart-sum"><span>Zwischensumme</span><strong data-cart-subtotal></strong></div>
            <p class="fine">Alle Preise laut Speisekarte (Stand 04/2023), ohne Gewähr.</p>
            <p><a class="text-link" href="${root}speisekarte/index.html">${I.back} Weitere Gerichte hinzufügen</a></p>

            <h2 class="h-red h-sm">Abholung oder Lieferung</h2>
            <div class="seg" role="radiogroup" aria-label="Abholung oder Lieferung">
              <label><input type="radio" name="mode" value="Abholung" checked data-mode><span>Abholung</span></label>
              <label><input type="radio" name="mode" value="Lieferung" data-mode><span>Lieferung</span></label>
            </div>
            <p class="cart-min" data-delivery-off hidden></p>
            <label class="field" data-place-field hidden><span>Lieferort</span><select data-f-place></select></label>
            <p class="cart-min" data-cart-min hidden></p>
            <div class="cart-total" data-cart-total-row hidden>
              <div><span>Lieferkosten laut Karte</span><span data-cart-fee></span></div>
              <div class="cart-total-sum"><span>Gesamt</span><strong data-cart-grand></strong></div>
            </div>

            <h2 class="h-red h-sm">Ihre Angaben</h2>
            <div class="field-grid">
              <label class="field"><span>Name <b class="req" aria-hidden="true">*</b></span><input type="text" autocomplete="name" required aria-required="true" data-f-name></label>
              <label class="field"><span>Telefon <b class="req" aria-hidden="true">*</b> <small>(für Rückfragen)</small></span><input type="tel" autocomplete="tel" required aria-required="true" data-f-phone></label>
              <label class="field field-wide" data-address-field hidden><span>Lieferadresse <b class="req" aria-hidden="true">*</b></span><input type="text" autocomplete="street-address" placeholder="Straße, Hausnummer" aria-required="true" data-f-address></label>
              <label class="field"><span>Wunschzeit</span><select data-f-time></select></label>
              <label class="field field-wide"><span>Anmerkungen <small>(optional)</small></span><textarea rows="3" maxlength="300" data-f-note></textarea></label>
            </div>
            <p class="fine req-note"><b class="req">*</b> Pflichtfeld</p>
            <p class="cart-closed" data-cart-closed hidden></p>
            <div class="cart-actions">
              <a class="btn btn-whatsapp btn-lg btn-block" href="#" target="_blank" rel="noopener" data-wa-send>${I.wa}Bestellung per WhatsApp vorbereiten</a>
              <p class="fine">WhatsApp öffnet sich mit einer vorbereiteten Nachricht. Sie wird erst gesendet, wenn Sie sie dort selbst abschicken. Die Bestellung wird erst nach Bestätigung durch das Restaurant angenommen.</p>
              <button class="btn btn-link" type="button" data-cart-clear>Warenkorb leeren</button>
            </div>
          </div>
        </div>
        <aside class="order-side">
          <div class="side-card">
            <h2 class="h-sm">Lieber direkt bestellen?</h2>
            <a class="contact-card" href="${TEL}"><span class="contact-ico">${I.phone}</span><span><small>Anrufen</small>${esc(R.phoneDisplay)}</span></a>
            <a class="contact-card" href="${WA}" target="_blank" rel="noopener"><span class="contact-ico">${I.wa}</span><span><small>WhatsApp</small>${esc(R.whatsappDisplay)}</span></a>
            <p class="sheet-status"><span class="status-dot" data-open-dot></span><span data-open-status-long></span></p>
          </div>
          <div class="side-card side-card-yellow">
            <h2 class="h-sm">Lieferkonditionen</h2>
            <p>Mindestbestellwert ab 15 € (Bad Buchau), Lieferkosten ab 1 €. Alle Orte auf der Seite <a href="${root}lieferservice.html">Lieferservice</a>.</p>
          </div>
        </aside>
      </div>
    </section>`
}));

/* ===================== Lieferservice ===================== */
built.push(page({
  file: "lieferservice.html", active: "lieferservice", bodyClass: "page-delivery",
  title: "Lieferservice & Abholung · MINAR Küche Bad Buchau",
  desc: "Liefergebiete, Mindestbestellwerte und Lieferkosten von MINAR Küche Bad Buchau sowie Informationen zur Abholung.",
  body: (root) => `${pageHead("Lieferservice &amp; Abholung", "So kommt Ihr Essen zu Ihnen", "Wir liefern nach Bad Buchau und in viele Orte der Umgebung – oder Sie holen Ihre Bestellung direkt bei uns ab.")}
    <section class="section section-tight">
      <div class="container">
        <div class="steps">
          <article class="step reveal"><span class="step-num">1</span><h2>Bestellen</h2><p>Telefonisch unter <a href="${TEL}">${esc(R.phoneDisplay)}</a>, per <a href="${WA}" target="_blank" rel="noopener">WhatsApp</a> oder über den <a href="${root}bestellen.html">Online-Warenkorb</a>.</p></article>
          <article class="step reveal"><span class="step-num">2</span><h2>Bestätigung abwarten</h2><p>Ihre Bestellung gilt erst als angenommen, wenn wir sie bestätigt haben.</p></article>
          <article class="step reveal"><span class="step-num">3</span><h2>Abholen oder liefern lassen</h2><p>Abholung in der ${esc(R.street)} oder Lieferung zu Ihnen nach Hause.</p></article>
        </div>
      </div>
    </section>
    <section class="section zones-section">
      <div class="container">
        <h2 class="h-red">Liefergebiete &amp; Konditionen</h2>
        <div class="table-card reveal" data-delivery-table></div>
        <ul class="delivery-notes" data-delivery-notes></ul>
      </div>
    </section>
    <section class="section">
      <div class="container visit-grid">
        <div>
          <h2 class="h-red">Bestell- und Abholzeiten</h2>
          <p>Bestellungen nehmen wir täglich außer dienstags von ${D.hours.open} bis ${D.hours.orderUntil} Uhr entgegen. Die Lieferzeit beträgt je nach Entfernung 20–90 Minuten.</p>
          <p>Die Lieferung erfolgt ohne Teller, Besteck und Dekoration.</p>
          ${contactCards()}
        </div>
        <div>${hoursCard()}</div>
      </div>
    </section>
${ctaBand(root)}`
}));

/* ===================== Über uns ===================== */
built.push(page({
  file: "ueber-uns.html", active: "ueber-uns", bodyClass: "page-about",
  title: "Über uns · MINAR Küche Bad Buchau",
  desc: "MINAR Küche in Bad Buchau – Restaurant, Lieferservice und Abholung mit einer vielseitigen Speisekarte.",
  body: (root) => `${pageHead("Über uns", "Willkommen bei MINAR Küche", "Restaurant, Lieferservice und Abholung in der " + esc(R.street) + " in Bad Buchau.")}
    <section class="section section-tight">
      <div class="container about-grid">
        <div class="prose reveal">
          <p>MINAR Küche verbindet auf einer Karte, was viele gern essen: Salate, Burger und Fingerfood, Döner und überbackene Teller, Pizza und Party Pizza, Nudelgerichte und Gnocchi, Schnitzel sowie Currys und Masala-Gerichte der indischen und pakistanischen Küche – dazu vegetarische Gerichte, Desserts und Getränke.</p>
          <p>Sie können bei uns im Restaurant essen, Ihre Bestellung abholen oder sich beliefern lassen. Unsere Karte sagt dazu: <em>„Bitte bedenken Sie, wir bereiten alle Speisen frisch für Sie zu.“</em></p>
          ${halalBadge(root)}
        </div>
        <div class="about-photos reveal">
          <figure><img src="${root}assets/images/gastraum-sm.jpg" alt="Gastraum von MINAR Küche mit Holztischen und Stühlen" loading="lazy" decoding="async"><figcaption>Unser Gastraum</figcaption></figure>
          <figure><img src="${root}assets/images/theke-sm.jpg" alt="Theke von MINAR Küche mit Getränkekühlschrank und Speisekartentafel" loading="lazy" decoding="async"><figcaption>Theke &amp; Abholung</figcaption></figure>
        </div>
      </div>
    </section>
    <section class="section offer">
      <div class="container">
        <h2 class="h-red">Unser Angebot im Überblick</h2>
        <div class="cat-grid cat-grid-all">
          ${CATS.map((c) => `<a class="cat-card" href="${root}speisekarte/${c.slug}.html" data-cat-card="${c.id}"><span class="cat-card-name">${esc(c.name)}</span><span class="cat-card-meta" data-cat-meta></span><span class="cat-card-go">${I.arrow}</span></a>`).join("\n          ")}
        </div>
      </div>
    </section>
${ctaBand(root)}`
}));

/* ===================== Kontakt ===================== */
built.push(page({
  file: "kontakt.html", active: "kontakt", bodyClass: "page-contact",
  title: "Kontakt & Anfahrt · MINAR Küche Bad Buchau",
  desc: "Adresse, Telefon, WhatsApp und Öffnungszeiten von MINAR Küche in Bad Buchau.",
  body: (root) => `${pageHead("Kontakt &amp; Anfahrt", "So erreichen Sie uns")}
    <section class="section section-tight">
      <div class="container visit-grid">
        <div>
          <address class="address address-lg"><strong>${esc(R.name)}</strong><br>${esc(R.street)}<br>${esc(R.zip)} ${esc(R.city)}</address>
          ${contactCards()}
          <p>E-Mail: <a href="mailto:${esc(R.email)}">${esc(R.email)}</a> · Fax: ${esc(R.fax)}</p>
          <p>Bestellungen nehmen wir bis ${D.hours.orderUntil} Uhr an – telefonisch, per WhatsApp oder über unseren <a href="${root}bestellen.html">Online-Warenkorb</a>.</p>
        </div>
        <div>${hoursCard()}</div>
      </div>
    </section>
${ctaBand(root)}`
}));

/* ===================== Rechtliches ===================== */
const ph = (t) => `<span class="placeholder">[${t}]</span>`;
built.push(page({
  file: "impressum.html", active: "impressum", bodyClass: "page-legal",
  title: "Impressum · MINAR Küche Bad Buchau", desc: "Impressum von MINAR Küche Bad Buchau.",
  body: () => `${pageHead("Rechtliches", "Impressum")}
    <section class="section section-tight"><div class="container prose legal">
      <p class="legal-warning"><strong>Bitte noch ergänzen bzw. prüfen:</strong> Die markierten Stellen müssen vom Betreiber vervollständigt und das Impressum rechtlich geprüft werden.</p>
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>${esc(R.name)}<br>${esc(R.street)}<br>${esc(R.zip)} ${esc(R.city)}</p>
      <h2>Vertretungsberechtigt</h2><p>${esc(R.owner)}</p>
      <h2>Kontakt</h2><p>Telefon: ${esc(R.phoneDisplay)}<br>Fax: ${esc(R.fax)}<br>WhatsApp: ${esc(R.whatsappDisplay)}<br>E-Mail: <a href="mailto:${esc(R.email)}">${esc(R.email)}</a></p>
      <h2>Umsatzsteuer-ID</h2><p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a UStG:<br>${esc(R.vatId)}</p>
      <h2>Registereintrag</h2><p>${ph("Registergericht und Registernummer – nur falls vorhanden, sonst Abschnitt entfernen")}</p>
      <h2>Zuständige Aufsichtsbehörde</h2><p>${ph("falls erforderlich – sonst Abschnitt entfernen")}</p>
      <h2>Verbraucherstreitbeilegung</h2><p>${ph("Hinweis zur (Nicht-)Teilnahme an Streitbeilegungsverfahren – vom Betreiber festzulegen")}</p>
      <h2>Webdesign</h2><p>BRÄUER.DIGITAL</p>
    </div></section>`
}));
built.push(page({
  file: "datenschutz.html", active: "datenschutz", bodyClass: "page-legal",
  title: "Datenschutz · MINAR Küche Bad Buchau", desc: "Datenschutzerklärung von MINAR Küche Bad Buchau.",
  body: () => `${pageHead("Rechtliches", "Datenschutzerklärung")}
    <section class="section section-tight"><div class="container prose legal">
      <p class="legal-warning"><strong>Entwurf – vor Veröffentlichung ergänzen.</strong> Diese Gliederung beschreibt die technischen Gegebenheiten der Website. Sie ersetzt keine Rechtsberatung.</p>
      <h2>1. Verantwortlicher</h2><p>${esc(R.name)}, vertreten durch ${esc(R.owner)}<br>${esc(R.street)}, ${esc(R.zip)} ${esc(R.city)}<br>Telefon: ${esc(R.phoneDisplay)}<br>E-Mail: <a href="mailto:${esc(R.email)}">${esc(R.email)}</a></p>
      <h2>2. Hosting</h2><p>Diese Website wird als statische Website über GitHub Pages (GitHub Inc., USA) bereitgestellt. Beim Aufruf verarbeitet der Hoster technisch notwendige Daten wie IP-Adresse, Datum und Uhrzeit sowie die aufgerufene Seite. ${ph("Rechtsgrundlage, Drittlandübermittlung und Speicherdauer ergänzen und prüfen")}</p>
      <h2>3. Keine Cookies, kein Tracking, keine externen Schriften</h2><p>Die Website setzt keine Cookies, verwendet keine Analyse- oder Trackingdienste und lädt weder Schriften noch Karten von externen Servern.</p>
      <h2>4. Lokale Speicherung im Browser (Warenkorb)</h2><p>Damit der Warenkorb beim Seitenwechsel erhalten bleibt, werden die ausgewählten Gerichte sowie – falls eingegeben – Name, Telefonnummer, Lieferort, Lieferadresse und Bestellart ausschließlich lokal im Browser gespeichert (localStorage). Diese Daten werden nicht an den Betreiber oder Dritte übertragen und können über „Warenkorb leeren“ bzw. die Browsereinstellungen gelöscht werden. ${ph("rechtliche Bewertung ergänzen")}</p>
      <h2>5. Bestellung über WhatsApp</h2><p>Über „Bestellung per WhatsApp vorbereiten“ wird WhatsApp (WhatsApp Ireland Limited / Meta) mit einer vorformulierten Nachricht geöffnet. Erst wenn Sie die Nachricht in WhatsApp selbst absenden, werden die Daten an das Restaurant übermittelt. Es gelten die Datenschutzbestimmungen von WhatsApp. ${ph("Hinweise zu Rechtsgrundlage und Verarbeitung durch das Restaurant ergänzen")}</p>
      <h2>6. Telefonische Kontaktaufnahme</h2><p>${ph("Verarbeitung von Daten bei telefonischen Bestellungen ergänzen")}</p>
      <h2>7. Externer Link zu Google Maps</h2><p>Die Website bindet keine Karte ein. Erst beim Klick auf „In Google Maps öffnen“ wird Google Maps (Google Ireland Limited) in einem neuen Fenster aufgerufen.</p>
      <h2>8. Rechte der betroffenen Personen</h2><p>${ph("Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch, Beschwerderecht – vom Betreiber zu ergänzen")}</p>
      <p class="fine">Stand: ${ph("Datum")}</p>
    </div></section>`
}));

console.log(`${built.length} Seiten erzeugt:\n  ` + built.join("\n  "));
