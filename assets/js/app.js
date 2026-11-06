/* =====================================================================
   MINAR Küche – Interaktion (alle Seiten)
   Navigation · Öffnungsstatus · Speisekarte · Suche · Warenkorb · WhatsApp
   Keine externen Abhängigkeiten. Daten: assets/js/menu-data.js
   ===================================================================== */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var D = window.MINAR_DATA;
  if (!D) { console.error("menu-data.js fehlt"); return; }

  /* ---------------- Helfer ---------------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var eur = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
  var money = function (n) { return eur.format(n || 0); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* privat/gesperrt */ } }
  };
  var norm = function (s) { return String(s || "").toLowerCase().replace(/ß/g, "ss").normalize("NFD").replace(/[̀-ͯ]/g, ""); };

  var R = D.restaurant;
  var GROUPS = D.optionGroups || {};
  var LEG = D.legend || { allergens: {}, additives: {} };
  var PAGE = document.body.getAttribute("data-page");

  /* ---------------- Daten normalisieren ---------------- */
  var items = (D.items || []).map(function (src, i) {
    var it = {
      _id: "i" + i, nr: src.nr || "", name: src.name, category: src.cat,
      description: src.desc || "", tags: src.tags || [], codesCheck: !!src.codesCheck,
      allergens: [], additives: [],
      opts: (src.opts || []).filter(function (g) { return GROUPS[g]; })
    };
    it.prices = (src.prices && src.prices.length ? src.prices : [0]).map(function (p) {
      return Array.isArray(p) ? { label: p[0], price: p[1] } : (typeof p === "number" ? { label: "", price: p } : p);
    });
    if (src.codes && !it.codesCheck) {
      src.codes.split(",").map(function (c) { return c.trim(); }).filter(Boolean).forEach(function (c) {
        (/^\d+$/.test(c) ? it.additives : it.allergens).push(c);
      });
    }
    return it;
  });
  var itemById = {}; items.forEach(function (it) { itemById[it._id] = it; });
  var catById = {}; D.categories.forEach(function (c) { catById[c.id] = c; });
  var zones = (D.delivery && D.delivery.zones) || [];
  var places = [];
  zones.forEach(function (z, zi) { (z.places || []).forEach(function (p) { places.push({ name: p, zone: zi }); }); });
  var minPrice = function (it) { return Math.min.apply(null, it.prices.map(function (p) { return p.price; })); };

  /* ---------------- Header / Navigation ---------------- */
  var header = $(".site-header");
  var navToggle = $(".nav-toggle");
  var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 10); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  function setNav(open) {
    document.body.classList.toggle("nav-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
  }
  navToggle.addEventListener("click", function () { setNav(!document.body.classList.contains("nav-open")); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setNav(false); });
  window.addEventListener("resize", function () { if (window.innerWidth > 960) setNav(false); });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -6% 0px" });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else { $$(".reveal").forEach(function (el) { el.classList.add("is-in"); }); }

  /* ---------------- Öffnungszeiten ---------------- */
  var DAYS = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  var H = D.hours;
  var toMin = function (t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; };
  function berlinNow() {
    try {
      var o = {};
      new Intl.DateTimeFormat("en-GB", { timeZone: H.timezone, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false })
        .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
      return { day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(o.weekday), min: (+o.hour % 24) * 60 + +o.minute };
    } catch (e) { var d = new Date(); return { day: d.getDay(), min: d.getHours() * 60 + d.getMinutes() }; }
  }
  function status() {
    var n = berlinNow(), closedToday = H.closedDays.indexOf(n.day) > -1;
    var o = toMin(H.open), c = toMin(H.close), ou = toMin(H.orderUntil);
    var open = !closedToday && n.min >= o && n.min < c, ordering = !closedToday && n.min >= o && n.min < ou, text;
    if (open) text = ordering ? "Jetzt geöffnet · Bestellannahme bis " + H.orderUntil + " Uhr" : "Geöffnet bis " + H.close + " Uhr · Bestellannahme beendet";
    else {
      var d = n.day, add = 0;
      if (closedToday || n.min >= o) { do { d = (d + 1) % 7; add++; } while (H.closedDays.indexOf(d) > -1); }
      text = (closedToday ? "Heute Ruhetag" : "Geschlossen") + " · öffnet " + (add === 0 ? "heute" : add === 1 ? "morgen" : DAYS[d]) + " um " + H.open + " Uhr";
    }
    return { open: open, ordering: ordering, day: n.day, text: text, short: open ? "Jetzt geöffnet" : (closedToday ? "Heute Ruhetag" : "Derzeit geschlossen") };
  }
  function renderStatus() {
    var s = status();
    $$("[data-open-dot]").forEach(function (el) { el.classList.toggle("is-open", s.open); el.classList.toggle("is-closed", !s.open); });
    $$("[data-open-status]").forEach(function (el) { el.textContent = s.short + " · Bad Buchau"; });
    $$("[data-open-status-long]").forEach(function (el) { el.textContent = s.text; });
    $$("[data-hours-list]").forEach(function (list) {
      list.innerHTML = [1, 2, 3, 4, 5, 6, 0].map(function (d) {
        var closed = H.closedDays.indexOf(d) > -1;
        return '<li class="' + (d === s.day ? "is-today " : "") + (closed ? "is-closed" : "") + '"><span>' + DAYS[d] + "</span><span>" +
          (closed ? "Ruhetag" : H.open + "–" + H.close + " Uhr") + "</span></li>";
      }).join("");
    });
  }
  renderStatus(); setInterval(renderStatus, 60000);

  /* ---------------- Kategorie-Karten (Anzahl, ab-Preis) ---------------- */
  $$("[data-cat-card]").forEach(function (card) {
    var list = items.filter(function (i) { return i.category === card.getAttribute("data-cat-card"); });
    var meta = $("[data-cat-meta]", card);
    if (meta && list.length) {
      var min = Math.min.apply(null, list.map(minPrice));
      meta.textContent = list.length + (list.length === 1 ? " Gericht" : " Gerichte") + " · ab " + money(min);
    }
  });

  /* ---------------- Gericht-Darstellung ---------------- */
  function codeList(codes, legend) {
    return codes.map(function (c) { var t = legend[c]; return t ? '<abbr title="' + esc(t) + '">' + esc(c) + "</abbr>" : esc(c); }).join(", ");
  }
  function allergenHtml(it) {
    if (it.codesCheck) return '<span class="allergens allergens-check">Allergene &amp; Zusatzstoffe auf Anfrage</span>';
    var p = [];
    if (it.allergens.length) p.push("Allergene: " + codeList(it.allergens, LEG.allergens || {}));
    if (it.additives.length) p.push("Zusatzstoffe: " + codeList(it.additives, LEG.additives || {}));
    return p.length ? '<span class="allergens">' + p.join(" · ") + "</span>" : "";
  }
  function priceHtml(it) {
    if (it.prices.length === 1) return money(it.prices[0].price) + (it.prices[0].label ? "<small>" + esc(it.prices[0].label) + "</small>" : "");
    return "<small>ab</small>" + money(minPrice(it));
  }
  function dishHtml(it, withCat) {
    var tags = it.tags.map(function (t) {
      return '<span class="tag ' + (/veg/.test(t) ? "tag-veg" : /scharf/.test(t) ? "tag-hot" : "") + '">' + esc(t) + "</span>";
    }).join("");
    if (withCat) tags = '<span class="tag">' + esc(catById[it.category].name) + "</span>" + tags;
    var al = allergenHtml(it);
    var variants = it.prices.length > 1
      ? '<span class="variants-line">' + it.prices.map(function (p) { return esc(p.label) + " " + money(p.price); }).join(" · ") + "</span>" : "<span></span>";
    return '<article class="dish">' +
      '<h3 class="dish-title">' + (it.nr ? '<span class="dish-nr" aria-label="Nummer ' + esc(it.nr) + '">' + esc(it.nr) + "</span>" : "") + esc(it.name) + "</h3>" +
      '<div class="dish-price">' + priceHtml(it) + "</div>" +
      (it.description ? '<p class="dish-desc">' + esc(it.description) + "</p>" : "") +
      ((tags || al) ? '<div class="dish-meta">' + tags + al + "</div>" : "") +
      '<div class="dish-foot">' + variants + '<button type="button" class="add-btn" data-add="' + it._id + '" aria-label="' + esc(it.name) + ' hinzufügen">Hinzufügen</button></div>' +
      "</article>";
  }
  function onAddClick(e) {
    var b = e.target.closest("[data-add]"); if (!b) return;
    var it = itemById[b.getAttribute("data-add")];
    if (it.prices.length === 1 && !it.opts.length) addToCart(it, 0, {}, 1, "");
    else openItem(it);
  }

  // Kategorieseite
  $$("[data-menu-list]").forEach(function (el) {
    var cat = el.getAttribute("data-menu-list");
    el.innerHTML = items.filter(function (i) { return i.category === cat; }).map(function (i) { return dishHtml(i); }).join("");
    el.addEventListener("click", onAddClick);
    var cur = $('.chips [aria-current="page"]');
    if (cur && cur.scrollIntoView) { var chips = cur.closest(".chips"); chips.scrollLeft = cur.offsetLeft - chips.clientWidth / 2 + cur.clientWidth / 2; }
  });

  // Scrollspy: aktive Kategorie in der Chip-Leiste der Gesamtkarte
  var spy = $("[data-scrollspy]");
  if (spy && "IntersectionObserver" in window) {
    var chipFor = {};
    $$("a", spy).forEach(function (a) { chipFor[a.getAttribute("href").slice(1)] = a; });
    var setActive = function (id) {
      $$("a", spy).forEach(function (a) { a.removeAttribute("aria-current"); });
      var a = chipFor[id]; if (!a) return;
      a.setAttribute("aria-current", "true");
      spy.scrollTo({ left: a.offsetLeft - spy.clientWidth / 2 + a.clientWidth / 2, behavior: "smooth" });
    };
    var spyIo = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-35% 0px -60% 0px" });
    $$(".menu-cat[id]").forEach(function (sec) { spyIo.observe(sec); });
  }

  // Suche (Übersichtsseite)
  var searchEl = $("[data-menu-search]");
  if (searchEl) {
    var results = $("[data-search-results]"), overview = $("[data-cat-overview]"), clearEl = $("[data-search-clear]");
    var matches = function (it, q) {
      if (/^\d+[a-z]?$/.test(q) && norm(it.nr) === q) return 2;
      var hay = norm([it.nr, it.name, it.description, it.tags.join(" "), catById[it.category].name].join(" "));
      return q.split(/\s+/).every(function (w) { return hay.indexOf(w) > -1; }) ? 1 : 0;
    };
    var run = function () {
      var q = norm(searchEl.value).trim();
      clearEl.hidden = !q;
      if (!q) { results.hidden = true; overview.hidden = false; return; }
      var exact = items.filter(function (i) { return matches(i, q) === 2; });
      var found = exact.length ? exact : items.filter(function (i) { return matches(i, q); });
      results.hidden = false; overview.hidden = !!found.length;
      results.innerHTML = found.length
        ? "<h2>" + found.length + (found.length === 1 ? " Treffer" : " Treffer") + " für „" + esc(searchEl.value.trim()) + "“</h2><div class=\"menu-items\">" + found.map(function (i) { return dishHtml(i, true); }).join("") + "</div>"
        : "<h2>Keine Treffer für „" + esc(searchEl.value.trim()) + "“ – wählen Sie eine Kategorie:</h2>";
      try { history.replaceState(null, "", q ? "?q=" + encodeURIComponent(searchEl.value.trim()) : location.pathname); } catch (e) { /* file:// */ }
    };
    var t;
    searchEl.addEventListener("input", function () { clearTimeout(t); t = setTimeout(run, 120); });
    $("[data-search-form]").addEventListener("submit", function (e) { e.preventDefault(); run(); });
    clearEl.addEventListener("click", function () { searchEl.value = ""; run(); searchEl.focus(); });
    results.addEventListener("click", onAddClick);
    var q0 = new URLSearchParams(location.search).get("q");
    if (q0) { searchEl.value = q0; run(); }
  }

  // Legende
  $$("[data-legend-slot]").forEach(function (slot) {
    var a = LEG.allergens || {}, z = LEG.additives || {};
    var html = "<h3>Allergene</h3>" + Object.keys(a).map(function (k) { return "<div><strong>" + esc(k) + "</strong> – " + esc(a[k]) + "</div>"; }).join("") +
      "<h3>Zusatzstoffe</h3>" + Object.keys(z).map(function (k) { return "<div><strong>" + esc(k) + "</strong> – " + esc(z[k]) + "</div>"; }).join("");
    var notes = (LEG.notes || []).concat(["Fehlt bei einem Gericht eine Kennzeichnung, bedeutet das nicht, dass es frei von Allergenen ist. Bitte fragen Sie bei Unverträglichkeiten nach."]);
    slot.innerHTML = '<details class="legend"><summary>Allergene &amp; Zusatzstoffe – Legende</summary><div class="legend-grid">' + html +
      '<div class="legend-notes">' + notes.map(function (n) { return "<p>" + esc(n) + "</p>"; }).join("") + "</div></div></details>" +
      (D.menuSource ? '<p class="menu-source">' + esc(D.menuSource) + "</p>" : "");
  });

  /* ---------------- Lieferkonditionen ---------------- */
  var placesOf = function (z) { return (z.places || []).join(", "); };
  $$("[data-zone-pills]").forEach(function (ul) {
    ul.innerHTML = zones.map(function (z) {
      return "<li><span>" + esc(placesOf(z)) + "</span><strong>ab " + money(z.minOrder) + "</strong></li>";
    }).join("");
  });
  $$("[data-delivery-table]").forEach(function (box) {
    box.innerHTML = '<table class="delivery-table"><caption class="visually-hidden">Liefergebiete mit Mindestbestellwert und Lieferkosten</caption><thead><tr><th scope="col">Liefergebiet</th><th scope="col">Mindestbestellwert</th><th scope="col">Lieferkosten</th></tr></thead><tbody>' +
      zones.map(function (z) {
        return "<tr><td>" + esc(placesOf(z)) + '</td><td data-label="Mindestbestellwert"><strong>ab ' + money(z.minOrder) + '</strong></td><td data-label="Lieferkosten">' + money(z.fee) + "</td></tr>";
      }).join("") + "</tbody></table>";
  });
  $$("[data-delivery-notes]").forEach(function (ul) {
    ul.innerHTML = (D.delivery.notes || []).map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("");
  });

  /* ---------------- Dialoge ---------------- */
  function openDialog(d) { if (typeof d.showModal === "function") { if (!d.open) d.showModal(); } else d.setAttribute("open", ""); document.body.style.overflow = "hidden"; }
  function closeDialog(d) { if (typeof d.close === "function") d.close(); else d.removeAttribute("open"); }
  $$("dialog").forEach(function (d) {
    d.addEventListener("close", function () { if (!$("dialog[open]")) document.body.style.overflow = ""; });
    d.addEventListener("click", function (e) { if (e.target === d || e.target.closest("[data-close]")) closeDialog(d); });
  });

  /* ---------------- Gericht-Dialog ---------------- */
  var itemDialog = $("#item-dialog"), itemForm = $("[data-item-form]"), cur = null, curQty = 1;
  function optPrice(o, v) { return Array.isArray(o.prices) ? (o.prices[v] != null ? o.prices[v] : o.prices[o.prices.length - 1]) : (o.price || 0); }
  function selectionExtra(it, sel, v) {
    var sum = 0, names = [];
    it.opts.forEach(function (gid) {
      (sel[gid] || []).forEach(function (i) { var o = GROUPS[gid].options[i]; if (o) { sum += optPrice(o, v); names.push(o.name); } });
    });
    return { sum: sum, names: names };
  }
  function readSelection() {
    var sel = {};
    cur.opts.forEach(function (gid) { sel[gid] = $$('input[data-g="' + gid + '"]:checked', itemForm).map(function (x) { return +x.value; }); });
    return sel;
  }
  function variantIdx() { return +((itemForm.querySelector("input[name=variant]:checked") || {}).value || 0); }
  function updateItemPrice() {
    var v = variantIdx(), sum = cur.prices[v].price + selectionExtra(cur, readSelection(), v).sum;
    $$("[data-opt-price]", itemForm).forEach(function (el) {
      var p = el.getAttribute("data-opt-price").split(":"), pr = optPrice(GROUPS[p[0]].options[+p[1]], v);
      el.textContent = pr ? "+ " + money(pr) : "";
    });
    $("[data-qty]", itemForm).textContent = curQty;
    $("[data-item-add]", itemForm).textContent = "Hinzufügen · " + money(sum * curQty);
  }
  function openItem(it) {
    if (!itemDialog) return;
    cur = it; curQty = 1;
    $("[data-item-nr]", itemForm).textContent = it.nr ? "Nr. " + it.nr : "";
    $("[data-item-title]", itemForm).textContent = it.name;
    $("[data-item-desc]", itemForm).textContent = it.description;
    $("[data-item-note]", itemForm).value = "";
    $("[data-item-variants]", itemForm).hidden = it.prices.length < 2;
    $("[data-variant-list]", itemForm).innerHTML = it.prices.map(function (p, i) {
      return '<label class="opt"><input type="radio" name="variant" value="' + i + '"' + (i === 0 ? " checked" : "") + "><span>" + esc(p.label || "Standard") + '</span><span class="opt-price">' + money(p.price) + "</span></label>";
    }).join("");
    $("[data-item-opts]", itemForm).innerHTML = it.opts.map(function (gid) {
      var g = GROUPS[gid], one = g.type === "one";
      return '<fieldset class="opt-group"><legend>' + esc(g.label) + (one ? "" : " (optional)") + '</legend><div class="opt-list">' +
        g.options.map(function (o, i) {
          return '<label class="opt"><input type="' + (one ? "radio" : "checkbox") + '" name="g-' + gid + '" data-g="' + gid + '" value="' + i + '"' + (one && i === 0 ? " checked" : "") +
            "><span>" + esc(o.name) + '</span><span class="opt-price" data-opt-price="' + gid + ":" + i + '"></span></label>';
        }).join("") + "</div></fieldset>";
    }).join("");
    updateItemPrice();
    openDialog(itemDialog);
  }
  if (itemForm) {
    itemForm.addEventListener("change", updateItemPrice);
    $("[data-qty-minus]", itemForm).addEventListener("click", function () { curQty = Math.max(1, curQty - 1); updateItemPrice(); });
    $("[data-qty-plus]", itemForm).addEventListener("click", function () { curQty = Math.min(50, curQty + 1); updateItemPrice(); });
    itemForm.addEventListener("submit", function (e) {
      e.preventDefault();
      addToCart(cur, variantIdx(), readSelection(), curQty, $("[data-item-note]", itemForm).value.trim());
      closeDialog(itemDialog);
    });
  }

  /* ---------------- Warenkorb (alle Seiten) ---------------- */
  var CART_KEY = "minar-cart-v3", FORM_KEY = "minar-form-v3";
  var cart = (store.get(CART_KEY) || []).filter(function (l) {
    var it = items.filter(function (i) { return i.nr === l.nr && i.name === l.name; })[0];
    if (!it || !it.prices[l.v]) return false;
    l._id = it._id; l.sel = l.sel || {}; return true;
  });
  function lineCalc(l) {
    var it = itemById[l._id], ex = selectionExtra(it, l.sel, l.v), unit = it.prices[l.v].price + ex.sum;
    return { it: it, unit: unit, total: unit * l.qty, variant: it.prices[l.v].label || "", extras: ex.names };
  }
  var subtotal = function () { return cart.reduce(function (s, l) { return s + lineCalc(l).total; }, 0); };
  var count = function () { return cart.reduce(function (s, l) { return s + l.qty; }, 0); };
  function saveCart() { store.set(CART_KEY, cart.map(function (l) { return { key: l.key, nr: l.nr, name: l.name, v: l.v, sel: l.sel, qty: l.qty, note: l.note }; })); }
  function addToCart(it, v, sel, qty, note) {
    var key = it._id + "|" + v + "|" + JSON.stringify(sel) + "|" + note;
    var ex = cart.filter(function (l) { return l.key === key; })[0];
    if (ex) ex.qty = Math.min(50, ex.qty + qty);
    else cart.push({ key: key, _id: it._id, nr: it.nr, name: it.name, v: v, sel: sel, qty: qty, note: note });
    saveCart(); renderBadge(); renderCartPage();
    toast(qty + "× " + it.name + " im Warenkorb");
    $$(".cart-count").forEach(function (el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); });
  }
  function renderBadge() {
    var n = count();
    $$("[data-cart-count]").forEach(function (el) { el.textContent = n; if (el.classList.contains("cart-count")) el.hidden = !n; });
    $$("[data-cart-total]").forEach(function (el) { el.textContent = money(subtotal()); });
    $$("[data-cart-fab]").forEach(function (el) { el.hidden = !n; });
  }
  // Synchronisierung zwischen Tabs
  window.addEventListener("storage", function (e) { if (e.key === CART_KEY) location.reload(); });

  /* ---------------- Bestellseite ---------------- */
  var linesEl = $("[data-cart-lines]");
  var F = {};
  function mode() { return ($("[data-mode]:checked") || {}).value || "Abholung"; }
  function currentZone() { var p = places.filter(function (x) { return x.name === F.place.value; })[0]; return p ? zones[p.zone] : null; }
  function saveForm() { store.set(FORM_KEY, { name: F.name.value, phone: F.phone.value, address: F.address.value, place: F.place.value, mode: mode() }); }

  function renderCartPage() {
    if (!linesEl) return;
    $("[data-cart-empty]").hidden = !!cart.length;
    $("[data-cart-body]").hidden = !cart.length;
    $("[data-cart-subtotal]").textContent = money(subtotal());
    linesEl.innerHTML = cart.map(function (l, idx) {
      var c = lineCalc(l), sub = [c.variant, c.extras.join(", ")].filter(Boolean).join(" · ");
      return '<li class="cart-line" data-line="' + idx + '"><div class="cart-line-name">' + (l.nr ? "Nr. " + esc(l.nr) + " · " : "") + esc(c.it.name) +
        (sub ? "<small>" + esc(sub) + "</small>" : "") + "<small>" + money(c.unit) + ' pro Stück</small></div><div class="cart-line-price">' + money(c.total) + "</div>" +
        '<div class="cart-line-ctrl"><div class="qty qty-sm"><button type="button" data-l-minus aria-label="Weniger">−</button><output>' + l.qty +
        '</output><button type="button" data-l-plus aria-label="Mehr">+</button></div>' +
        '<input class="cart-line-note" type="text" maxlength="120" placeholder="Hinweis (optional)" value="' + esc(l.note) + '" data-l-note aria-label="Hinweis zu ' + esc(c.it.name) + '">' +
        '<button type="button" class="cart-line-remove" data-l-remove>Entfernen</button></div></li>';
    }).join("");
    updateCheckout();
  }

  function updateCheckout() {
    var delivery = mode() === "Lieferung", sum = subtotal(), z = delivery ? currentZone() : null;
    $("[data-address-field]").hidden = !delivery;
    $("[data-place-field]").hidden = !delivery;
    var minEl = $("[data-cart-min]"), totalRow = $("[data-cart-total-row]");
    minEl.classList.remove("is-ok"); minEl.hidden = true; totalRow.hidden = true;
    if (delivery && F.place.value === "__other") { minEl.hidden = false; minEl.textContent = "Weitere Orte auf Anfrage – die Konditionen bestätigt Ihnen das Restaurant."; }
    else if (z) {
      totalRow.hidden = false; minEl.hidden = false;
      $("[data-cart-fee]").textContent = money(z.fee);
      $("[data-cart-grand]").textContent = money(sum + z.fee);
      if (sum < z.minOrder) minEl.textContent = "Mindestbestellwert für " + F.place.value + ": " + money(z.minOrder) + " (noch " + money(z.minOrder - sum) + "). Wird er nicht erreicht, sprechen Sie uns gerne per Telefon oder WhatsApp an.";
      else { minEl.classList.add("is-ok"); minEl.textContent = "Mindestbestellwert für " + F.place.value + " (" + money(z.minOrder) + ") erreicht."; }
    }
    var s = status(), closedEl = $("[data-cart-closed]");
    closedEl.hidden = s.ordering;
    if (!s.ordering) closedEl.textContent = "Derzeit ist laut Öffnungszeiten keine Bestellannahme (" + s.text + "). Ihre Nachricht wird möglicherweise erst später gelesen.";
    var send = $("[data-wa-send]");
    var missing = delivery && !F.place.value ? "Bitte Lieferort wählen" : delivery && !F.address.value.trim() ? "Bitte Lieferadresse angeben" : "";
    var ok = cart.length && !missing;
    send.setAttribute("aria-disabled", ok ? "false" : "true");
    send.href = ok ? "https://wa.me/" + R.whatsappNumber + "?text=" + encodeURIComponent(buildMessage()) : "#";
    send.lastChild.textContent = missing || "Bestellung per WhatsApp vorbereiten";
  }

  function buildMessage() {
    var m = mode(), L = [], sum = subtotal(), z = m === "Lieferung" ? currentZone() : null;
    L.push("Hallo " + R.name + ",", "ich möchte folgende Bestellung anfragen (" + m + "):", "");
    cart.forEach(function (l) {
      var c = lineCalc(l);
      L.push("• " + l.qty + "× " + (l.nr ? "Nr. " + l.nr + " " : "") + c.it.name + (c.variant ? " (" + c.variant + ")" : "") + " – " + money(c.total));
      if (c.extras.length) L.push("   " + c.extras.join(", "));
      if (l.note && l.note.trim()) L.push("   Hinweis: " + l.note.trim());
    });
    L.push("", "Zwischensumme laut Website: " + money(sum));
    if (z) L.push("Lieferkosten laut Karte: " + money(z.fee), "Gesamt: " + money(sum + z.fee));
    L.push("");
    if (F.name.value.trim()) L.push("Name: " + F.name.value.trim());
    if (F.phone.value.trim()) L.push("Telefon: " + F.phone.value.trim());
    if (m === "Lieferung") {
      if (F.place.value) L.push("Lieferort: " + (F.place.value === "__other" ? "anderer Ort (auf Anfrage)" : F.place.value));
      if (F.address.value.trim()) L.push("Lieferadresse: " + F.address.value.trim());
    }
    if (F.time.value.trim()) L.push("Wunschzeit: " + F.time.value.trim());
    if (F.note.value.trim()) L.push("Anmerkung: " + F.note.value.trim());
    L.push("", "Bitte bestätigen Sie mir die Bestellung. Vielen Dank!");
    return L.join("\n");
  }

  if (linesEl) {
    F = { name: $("[data-f-name]"), phone: $("[data-f-phone]"), address: $("[data-f-address]"), time: $("[data-f-time]"), note: $("[data-f-note]"), place: $("[data-f-place]") };
    F.place.innerHTML = '<option value="">Bitte wählen …</option>' + places.slice().sort(function (a, b) { return a.name.localeCompare(b.name, "de"); }).map(function (p) {
      var z = zones[p.zone];
      return '<option value="' + esc(p.name) + '">' + esc(p.name) + " (ab " + money(z.minOrder) + ", Lieferkosten " + money(z.fee) + ")</option>";
    }).join("") + '<option value="__other">Anderer Ort (auf Anfrage)</option>';
    var saved = store.get(FORM_KEY) || {};
    ["name", "phone", "address", "place"].forEach(function (k) { if (saved[k]) F[k].value = saved[k]; });
    if (saved.mode) $$("[data-mode]").forEach(function (r) { r.checked = r.value === saved.mode; });

    linesEl.addEventListener("click", function (e) {
      var li = e.target.closest("[data-line]"); if (!li) return;
      var l = cart[+li.getAttribute("data-line")];
      if (e.target.closest("[data-l-minus]")) { l.qty -= 1; if (l.qty < 1) cart.splice(cart.indexOf(l), 1); }
      else if (e.target.closest("[data-l-plus]")) l.qty = Math.min(50, l.qty + 1);
      else if (e.target.closest("[data-l-remove]")) cart.splice(cart.indexOf(l), 1);
      else return;
      saveCart(); renderBadge(); renderCartPage();
    });
    linesEl.addEventListener("input", function (e) {
      if (!e.target.matches("[data-l-note]")) return;
      cart[+e.target.closest("[data-line]").getAttribute("data-line")].note = e.target.value;
      saveCart(); updateCheckout();
    });
    ["input", "change"].forEach(function (ev) {
      $("[data-cart-body]").addEventListener(ev, function (e) {
        if (e.target.matches("[data-f-name],[data-f-phone],[data-f-address],[data-f-time],[data-f-note],[data-f-place],[data-mode]")) { saveForm(); updateCheckout(); }
      });
    });
    $("[data-cart-clear]").addEventListener("click", function () { cart = []; saveCart(); renderBadge(); renderCartPage(); toast("Warenkorb geleert"); });
    $("[data-wa-send]").addEventListener("click", function (e) {
      if (this.getAttribute("aria-disabled") === "true") { e.preventDefault(); (mode() === "Lieferung" && !F.place.value ? F.place : F.address).focus(); return; }
      toast("WhatsApp wird geöffnet – bitte Nachricht dort absenden");
    });
  }

  renderBadge();
  renderCartPage();

  /* ---------------- Toast & Jahr ---------------- */
  var toastEl = $("[data-toast]"), toastT;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg; toastEl.classList.add("is-visible");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("is-visible"); }, 2400);
  }
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
