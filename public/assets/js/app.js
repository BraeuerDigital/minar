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
      allergens: [], additives: [], pfand: +src.pfand || 0,
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
    if (open) text = ordering ? "Jetzt geöffnet · Lieferung bis " + H.orderUntil + ", Abholung bis " + H.close + " Uhr" : "Geöffnet bis " + H.close + " Uhr · nur noch Abholung";
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
    if (it.pfand) al = '<span class="pfand-note">zzgl. ' + money(it.pfand) + " Pfand</span>" + al;
    else if (it.category === "getraenke") al = '<span class="pfand-note">ohne Pfand</span>' + al;
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

  /* Herunterziehen schließt Drawer/Sheets (Touch). Gezogen wird am Kopf oder – wenn der Inhalt
     ganz oben steht – auch im Inhalt. Kurzer Zug oder langsames Loslassen: Drawer springt zurück. */
  function swipeToClose(d, scrollerSel, enabled) {
    if (!d || d._swipe) return; d._swipe = true;
    var startY = 0, dy = 0, t0 = 0, dragging = false, armed = false, fromHead = false;
    var scroller = function () { return $(scrollerSel, d) || d; };
    d.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1 || (enabled && !enabled())) { armed = false; return; }
      armed = true; dragging = false; dy = 0; t0 = Date.now(); startY = e.touches[0].clientY;
      fromHead = !!e.target.closest(".drawer-grip, .drawer-head, .sheet-head");
    }, { passive: true });
    d.addEventListener("touchmove", function (e) {
      if (!armed) return;
      var y = e.touches[0].clientY - startY;
      if (!dragging) {
        if (y > 8 && (fromHead || scroller().scrollTop <= 0) && !e.target.closest("select, textarea, input[type=range]")) {
          dragging = true; d.style.transition = "none"; d.style.animation = "none";
        } else { if (Math.abs(y) > 8) armed = false; return; }
      }
      if (e.cancelable) e.preventDefault();
      dy = Math.max(0, y - 8); d.style.transform = "translateY(" + dy + "px)";
    }, { passive: false });
    var end = function () {
      if (!dragging) { armed = false; return; }
      dragging = armed = false;
      var fast = dy / Math.max(1, Date.now() - t0) > 0.5;
      d.style.transition = "transform .24s cubic-bezier(.2,.8,.2,1)";
      if (dy > Math.min(140, d.offsetHeight * 0.25) || (fast && dy > 40)) {
        d.style.transform = "translateY(100%)";
        setTimeout(function () { closeDialog(d); d.style.transform = d.style.transition = d.style.animation = ""; }, 240);
      } else {
        d.style.transform = "";
        setTimeout(function () { d.style.transition = d.style.animation = ""; }, 260);
      }
    };
    d.addEventListener("touchend", end); d.addEventListener("touchcancel", end);
  }
  var isSheetMobile = function () { return window.matchMedia("(max-width: 640px)").matches; };   // Sheets sind nur dort Drawer von unten

  /* ---------------- Gericht-Dialog ---------------- */
  var itemDialog = $("#item-dialog"), itemForm = $("[data-item-form]"), cur = null, curQty = 1;
  swipeToClose(itemDialog, ".sheet-inner", isSheetMobile);
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
    var miss = minMissing(), addBtn = $("[data-item-add]", itemForm);
    addBtn.textContent = miss ? "Noch " + miss.n + " " + unitOf(miss) + " wählen" : (editLine ? "Übernehmen · " : "Hinzufügen · ") + money(sum * curQty);
    addBtn.setAttribute("aria-disabled", miss ? "true" : "false");
  }
  function unitOf(m) { var g = GROUPS[m.gid]; return m.n === 1 ? (g.unitOne || g.unit || "Option") : (g.unit || "Optionen"); }
  // Pflichtauswahl (min), z. B. 4 Beläge bei der Partypizza
  function minMissing() {
    for (var i = 0; i < cur.opts.length; i++) {
      var gid = cur.opts[i], g = GROUPS[gid]; if (!g.min) continue;
      var n = $$('input[data-g="' + gid + '"]:checked', itemForm).length;
      if (n < g.min) return { gid: gid, n: g.min - n };
    }
    return null;
  }
  var editLine = null;                                   // Warenkorb-Zeile, die gerade angepasst wird
  function openItem(it, line) {
    if (!itemDialog) return;
    cur = it; editLine = line || null; curQty = line ? line.qty : 1;
    $("[data-item-nr]", itemForm).textContent = it.nr ? "Nr. " + it.nr : "";
    $("[data-item-title]", itemForm).textContent = it.name;
    $("[data-item-desc]", itemForm).textContent = it.description + (it.pfand ? (it.description ? " · " : "") + "zzgl. " + money(it.pfand) + " Pfand je Stück" : "");
    $("[data-item-note]", itemForm).value = line ? (line.note || "") : "";
    $("[data-item-variants]", itemForm).hidden = it.prices.length < 2;
    $("[data-variant-list]", itemForm).innerHTML = it.prices.map(function (p, i) {
      return '<label class="opt"><input type="radio" name="variant" value="' + i + '"' + (i === 0 ? " checked" : "") + "><span>" + esc(p.label || "Standard") + '</span><span class="opt-price">' + money(p.price) + "</span></label>";
    }).join("");
    $("[data-item-opts]", itemForm).innerHTML = it.opts.map(function (gid) {
      var g = GROUPS[gid], one = g.type === "one";
      // Zusatz-Kategorie als aufklappbarer Bereich; die Kopfzeile zeigt die aktuelle Auswahl
      return '<details class="opt-group" data-group="' + gid + '"' + (g.min && !line ? " open" : "") + '><summary><span class="opt-sum-head"><span class="opt-sum-title">' + esc(g.label) + (one || g.min ? "" : " (optional)") + "</span>" +
        (g.max ? ' <span class="opt-max" data-max-hint="' + gid + '">0 von ' + g.max + " gewählt</span>" : "") +
        '</span><span class="opt-sum-sel" data-sel-hint="' + gid + '"></span></summary><div class="opt-list" role="group" aria-label="' + esc(g.label) + '">' +
        g.options.map(function (o, i) {
          return '<label class="opt"><input type="' + (one ? "radio" : "checkbox") + '" name="g-' + gid + '" data-g="' + gid + '" value="' + i + '"' + (one && i === 0 ? " checked" : "") +
            "><span>" + esc(o.name) + '</span><span class="opt-price" data-opt-price="' + gid + ":" + i + '"></span></label>';
        }).join("") + "</div></details>";
    }).join("");
    if (line) {                                          // bisherige Auswahl vorbelegen
      var vr = itemForm.querySelector('input[name=variant][value="' + line.v + '"]'); if (vr) vr.checked = true;
      it.opts.forEach(function (gid) {
        var chosen = (line.sel && line.sel[gid]) || [];
        $$('input[data-g="' + gid + '"]', itemForm).forEach(function (x) { x.checked = chosen.indexOf(+x.value) > -1; });
        if (GROUPS[gid].type === "one" && !chosen.length) { var f = $('input[data-g="' + gid + '"]', itemForm); if (f) f.checked = true; }
      });
    }
    enforceMax();
    updateItemPrice();
    openDialog(itemDialog);
  }
  function enforceMax() {
    if (!cur) return;
    cur.opts.forEach(function (gid) {
      var max = GROUPS[gid].max; if (!max) return;
      var boxes = $$('input[data-g="' + gid + '"]', itemForm);
      var n = boxes.filter(function (b) { return b.checked; }).length;
      boxes.forEach(function (b) { b.disabled = !b.checked && n >= max; b.closest(".opt").classList.toggle("is-disabled", b.disabled); });
      var hint = $('[data-max-hint="' + gid + '"]', itemForm);
      if (hint) hint.textContent = n + " von " + max + " gewählt";
    });
    cur.opts.forEach(function (gid) {                    // Auswahl in der zugeklappten Kopfzeile anzeigen
      var names = $$('input[data-g="' + gid + '"]:checked', itemForm).map(function (b) { return GROUPS[gid].options[+b.value].name; });
      var el = $('[data-sel-hint="' + gid + '"]', itemForm);
      if (el) { el.textContent = names.length ? names.join(", ") : "keine Auswahl"; el.classList.toggle("is-empty", !names.length); }
    });
  }
  if (itemForm) {
    itemForm.addEventListener("change", function () { enforceMax(); updateItemPrice(); });
    $("[data-qty-minus]", itemForm).addEventListener("click", function () { curQty = Math.max(1, curQty - 1); updateItemPrice(); });
    $("[data-qty-plus]", itemForm).addEventListener("click", function () { curQty = Math.min(50, curQty + 1); updateItemPrice(); });
    itemForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var miss = minMissing();
      if (miss) {                                        // Pflichtauswahl noch unvollständig
        var grp = $('[data-group="' + miss.gid + '"]', itemForm); grp.open = true;
        grp.scrollIntoView({ block: "nearest", behavior: "smooth" });
        toast("Bitte noch " + miss.n + " " + unitOf(miss) + " wählen");
        return;
      }
      var note = $("[data-item-note]", itemForm).value.trim();
      if (editLine && cart.indexOf(editLine) > -1) {      // Zeile im Warenkorb ersetzen
        replaceLine(editLine, variantIdx(), readSelection(), curQty, note); toast("Änderung übernommen");
      } else addToCart(cur, variantIdx(), readSelection(), curQty, note);
      editLine = null;
      closeDialog(itemDialog);
    });
  }

  /* ---------------- Warenkorb (alle Seiten) ----------------
     Datensparsam: Im localStorage liegt nur die Gerichtsauswahl (läuft nach 12 Stunden ab).
     Name, Telefon, Adresse und Anmerkung bleiben nur im sessionStorage dieses Tabs
     und werden beim Schließen des Tabs bzw. über „Warenkorb leeren“ gelöscht. */
  var CART_KEY = "minar-cart-v4", FORM_KEY = "minar-form-v4", CART_TTL = 12 * 3600 * 1000;
  var sess = {
    get: function (k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* gesperrt */ } },
    del: function (k) { try { sessionStorage.removeItem(k); } catch (e) { /* gesperrt */ } }
  };
  var lsDel = function (k) { try { localStorage.removeItem(k); } catch (e) { /* gesperrt */ } };
  lsDel("minar-form-v3");                                  // alte, dauerhaft gespeicherte Formulardaten entfernen
  var cents = function (n) { return Math.round(n * 100) / 100; };
  /* ---------- Anfragenummer: MIN-A-YYYYMM-XXXXXXXX (Abholung) / MIN-L-… (Lieferung) ----------
     Gehört zum aktiven Bestellentwurf (= Warenkorb) und wird mit ihm im localStorage gehalten:
     bleibt bei Neuladen, Seitenwechsel, Mengen-/Extra-/Zeitänderung, Bon und erneutem WhatsApp-Öffnen gleich;
     auch ein duplizierter Tab zeigt denselben Entwurf. Neu erzeugt wird sie erst für einen neuen Entwurf:
     nach „Neue Bestellung beginnen“ bzw. „Warenkorb und Angaben löschen“, wenn der Warenkorb leer war
     oder nach Ablauf (12 h ohne Änderung). Jahr/Monat werden bei der Erstellung festgelegt (Europe/Berlin),
     das Kürzel A/L folgt der aktuellen Bestellart. Ohne zentrale Datenbank ist die Nummer sehr
     wahrscheinlich, aber nicht garantiert einmalig – sie ist keine Bestellnummer des Restaurants. */
  var REF_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";       // 32 Zeichen, ohne 0/O/1/I
  var REF_RE = /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$/;
  function secureRefId() {
    var c = window.crypto;
    if (!c || typeof c.getRandomValues !== "function") throw new Error("Sichere Zufallserzeugung nicht verfügbar");
    var b = c.getRandomValues(new Uint8Array(8)), out = "";
    for (var i = 0; i < 8; i++) out += REF_CHARS.charAt(b[i] & 31);   // 256 = 8 × 32 → exakt gleichverteilt
    return out;
  }
  function berlinYM(date) {
    var p = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit" }).formatToParts(date || new Date());
    var get = function (t) { return p.filter(function (x) { return x.type === t; })[0].value; };
    return get("year") + get("month");
  }
  var ref = null, refError = false;
  function newRef() {
    try { ref = { id: secureRefId(), ym: berlinYM() }; refError = false; }
    catch (e) { ref = null; refError = true; }                // keine unsichere Ersatznummer
  }
  function refFor(m) { return ref ? "MIN-" + (m === "Lieferung" ? "L" : "A") + "-" + ref.ym + "-" + ref.id : ""; }
  window.MINAR_REF = { generate: secureRefId, ym: berlinYM, chars: REF_CHARS };   // für automatisierte Tests

  function loadCart() {
    var raw = store.get(CART_KEY), lines = [];
    if (raw && raw.t && Date.now() - raw.t < CART_TTL) {
      lines = raw.lines || [];
      if (raw.ref && REF_RE.test(raw.ref.id) && /^\d{6}$/.test(raw.ref.ym)) ref = { id: raw.ref.id, ym: raw.ref.ym };
    }
    else if (raw) lsDel(CART_KEY);
    else { var old = store.get("minar-cart-v3"); if (Array.isArray(old)) lines = old; }
    lsDel("minar-cart-v3");
    return lines.filter(function (l) {
      var it = items.filter(function (i) { return i.nr === l.nr && i.name === l.name; })[0];
      if (!it || !it.prices[l.v] || !(l.qty > 0)) return false;
      l._id = it._id; l.sel = l.sel || {}; l.note = l.note || ""; l.qty = Math.min(50, Math.floor(l.qty));
      l.key = lineKey(it, l.v, l.sel, l.note); return true;
    });
  }
  function lineKey(it, v, sel, note) { return it._id + "|" + v + "|" + JSON.stringify(sel) + "|" + String(note || "").trim(); }
  var cart = loadCart();
  if (!cart.length) ref = null;
  else if (!ref) { newRef(); if (ref) store.set(CART_KEY, { t: Date.now(), lines: store.get(CART_KEY).lines, ref: ref }); }

  /* Zentrale Berechnung – gilt für Warenkorb, Bon und WhatsApp-Nachricht */
  function lineCalc(l) {
    var it = itemById[l._id], v = l.v, unit = it.prices[v].price, details = [];
    if (it.prices[v].label) details.push({ k: "Variante", t: it.prices[v].label });
    it.opts.forEach(function (gid) {
      var g = GROUPS[gid], chosen = (l.sel[gid] || []).map(function (i) { return g.options[i]; }).filter(Boolean);
      if (!chosen.length) return;
      details.push({ k: g.short || g.label, t: chosen.map(function (o) {
        var p = optPrice(o, v); unit += p; return o.name + (p ? " (+" + money(p) + ")" : "");
      }).join(", ") });
    });
    if (l.note && l.note.trim()) details.push({ k: "Hinweis", t: l.note.trim() });
    unit = cents(unit);
    return { it: it, qty: l.qty, unit: unit, total: cents(unit * l.qty), pfandUnit: it.pfand, pfand: cents(it.pfand * l.qty), details: details };
  }
  function totals() {
    var t = { goods: 0, pfand: 0, count: 0 };
    cart.forEach(function (l) { var c = lineCalc(l); t.goods += c.total; t.pfand += c.pfand; t.count += l.qty; });
    t.goods = cents(t.goods); t.pfand = cents(t.pfand);
    t.delivery = !!linesEl && mode() === "Lieferung";
    t.zone = t.delivery ? currentZone() : null;
    t.fee = t.zone ? t.zone.fee : 0;
    t.feeOpen = t.delivery && !t.zone;                     // Ort noch nicht gewählt oder „anderer Ort“
    t.grand = cents(t.goods + t.pfand + t.fee);
    return t;
  }
  function feeText(t) { return !t.delivery ? "entfällt (Abholung)" : t.zone ? money(t.fee) : (F.place && F.place.value === "__other" ? "auf Anfrage" : "nach Wahl des Lieferorts"); }
  function grandText(t) { return money(t.grand) + (t.feeOpen ? " zzgl. Lieferkosten" : ""); }
  function grandHtml(t) { return money(t.grand) + (t.feeOpen ? '<small class="sum-note">zzgl. Lieferkosten</small>' : ""); }

  function saveCart() {
    if (!cart.length) { lsDel(CART_KEY); ref = null; return; }   // leerer Warenkorb beendet den Entwurf
    if (!ref) newRef();
    store.set(CART_KEY, { t: Date.now(), ref: ref, lines: cart.map(function (l) { return { nr: l.nr, name: l.name, v: l.v, sel: l.sel, qty: l.qty, note: l.note }; }) });
  }
  function addToCart(it, v, sel, qty, note) {
    var key = lineKey(it, v, sel, note);
    var ex = cart.filter(function (l) { return l.key === key; })[0];
    if (ex) ex.qty = Math.min(50, ex.qty + qty);
    else cart.push({ key: key, _id: it._id, nr: it.nr, name: it.name, v: v, sel: sel, qty: qty, note: String(note || "").trim() });
    saveCart(); renderBadge(); renderCartPage();
    var added = cart.filter(function (l) { return l.key === key; })[0];   // Auswahl auch in der Bestätigung zeigen
    var info = added ? lineCalc(added).details.map(function (d) { return d.t; }).join(" · ") : "";
    toast(qty + " × " + it.name + (info ? " (" + (info.length > 90 ? info.slice(0, 88) + " …" : info) + ")" : "") + " im Warenkorb");
    $$(".cart-count").forEach(function (el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); });
  }
  function replaceLine(line, v, sel, qty, note) {
    var it = itemById[line._id], key = lineKey(it, v, sel, note);
    var twin = cart.filter(function (l) { return l !== line && l.key === key; })[0];
    if (twin) { twin.qty = Math.min(50, twin.qty + qty); cart.splice(cart.indexOf(line), 1); }   // keine doppelten Positionen
    else { line.v = v; line.sel = sel; line.qty = qty; line.note = String(note || "").trim(); line.key = key; }
    saveCart(); renderBadge(); renderCartPage();
  }
  function renderBadge() {
    var t = totals();
    $$("[data-cart-count]").forEach(function (el) { el.textContent = t.count; if (el.classList.contains("cart-count")) el.hidden = !t.count; });
    $$("[data-cart-total]").forEach(function (el) { el.textContent = money(cents(t.goods + t.pfand)); });
    $$("[data-cart-fab]").forEach(function (el) { el.hidden = !t.count; });
  }
  // Synchronisierung zwischen Tabs
  window.addEventListener("storage", function (e) { if (e.key === CART_KEY) location.reload(); });

  /* ---------------- Bestellseite ---------------- */
  var linesEl = $("[data-cart-lines]");
  var F = {};
  function mode() { return ($("[data-mode]:checked") || {}).value || "Abholung"; }
  function currentZone() { if (!F.place) return null; var p = places.filter(function (x) { return x.name === F.place.value; })[0]; return p ? zones[p.zone] : null; }
  function saveForm() { sess.set(FORM_KEY, { name: F.name.value, phone: F.phone.value, address: F.address.value, place: F.place.value, note: F.note.value, mode: mode() }); }
  var TRASH = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-3 6h12l-1 12H7L6 9Zm4 2v8h1.5v-8H10Zm3.5 0v8H15v-8h-1.5Z"/></svg>';
  var sumRow = function (k, v, cls) { return '<div class="' + (cls || "") + '"><dt>' + k + "</dt><dd>" + v + "</dd></div>"; };

  function renderCartPage() {
    if (!linesEl) return;
    var t = totals();
    $("[data-cart-empty]").hidden = !!cart.length;
    $("[data-cart-body]").hidden = !cart.length;
    $$("[data-cart-count-label]").forEach(function (el) { el.textContent = t.count + (t.count === 1 ? " Artikel" : " Artikel"); });
    linesEl.innerHTML = cart.map(function (l, idx) {
      var c = lineCalc(l);
      return '<li class="cl" data-line="' + idx + '">' +
        '<div class="cl-main"><p class="cl-title"><span class="cl-qty">' + l.qty + " ×</span>" +
        (l.nr ? '<span class="cl-nr">Nr. ' + esc(l.nr) + "</span>" : "") + '<span class="cl-name">' + esc(c.it.name) + "</span></p>" +
        (c.details.length ? '<ul class="cl-config">' + c.details.map(function (d) {
          return "<li" + (d.k === "Hinweis" ? ' class="cl-note"' : "") + ">" + (d.k === "Variante" ? "" : "<span>" + esc(d.k) + ":</span> ") + esc(d.t) + "</li>";
        }).join("") + "</ul>" : "") +
        '<p class="cl-unit">' + money(c.unit) + " / Stück" + (c.pfandUnit ? " · zzgl. " + money(c.pfandUnit) + " Pfand" : "") + "</p></div>" +
        '<strong class="cl-price">' + money(c.total) + "</strong>" +
        '<div class="cl-ctrl"><div class="pill-qty" role="group" aria-label="Menge ' + esc(c.it.name) + '">' +
        '<button type="button" data-l-minus aria-label="' + (l.qty > 1 ? "Eins weniger" : esc(c.it.name) + " entfernen") + '">' + (l.qty > 1 ? "−" : TRASH) + "</button>" +
        '<output aria-live="polite">' + l.qty + '</output><button type="button" data-l-plus aria-label="Eins mehr"' + (l.qty >= 50 ? " disabled" : "") + ">+</button></div>" +
        '<button type="button" class="cl-btn" data-l-edit>Ändern</button>' +
        '<button type="button" class="cl-btn cl-btn-remove" data-l-remove>Entfernen</button></div></li>';
    }).join("");
    updateCheckout();
  }

  /* Bestellarten nach Uhrzeit (Europe/Berlin):
     Lieferung 11:30–21:15 · Abholung 11:30–21:30. Vor Öffnung, nach Schluss und am Ruhetag beides aus –
     ausgegraut und durchgestrichen. Keine Vorbestellungen außerhalb der Zeiten. */
  var TEST = !!R.testMode;                                 // Testmodus (menu-data.js)
  var ORDER_WA = TEST && R.testWhatsappNumber ? R.testWhatsappNumber : R.whatsappNumber;
  function modeAvailable(m) {
    if (TEST) return true;
    var n = berlinNow(); if (H.closedDays.indexOf(n.day) > -1) return false;
    if (n.min < toMin(H.open)) return false;
    return n.min < toMin(m === "Lieferung" ? H.orderUntil : H.close);
  }
  function anyModeAvailable() { return modeAvailable("Abholung") || modeAvailable("Lieferung"); }
  function closedText() { return "Wir haben gerade geschlossen – " + status().text.replace(/^(Geschlossen|Heute Ruhetag) · /, "").replace(/^öffnet/, "wir öffnen") + ". Dann können Sie wieder bestellen."; }
  function applyDeliveryCutoff() {
    var info = $("[data-delivery-off]"), radios = $$("[data-mode]"); if (!radios.length) return;
    var avail = {};
    radios.forEach(function (r) {
      var on = modeAvailable(r.value); avail[r.value] = on;
      r.disabled = !on; r.closest("label").classList.toggle("is-off", !on);
    });
    var checked = $("[data-mode]:checked");
    if (checked && !avail[checked.value]) {
      checked.checked = false;
      var alt = radios.filter(function (r) { return avail[r.value]; })[0]; if (alt) alt.checked = true;
    }
    if (!info) return;
    var msg = "";
    if (!avail.Abholung && !avail.Lieferung) msg = closedText();
    else if (!avail.Lieferung) msg = "Lieferungen nehmen wir bis " + H.orderUntil + " Uhr an (Dienstag Ruhetag). Jetzt ist nur noch Abholung bis " + H.close + " Uhr möglich.";
    info.hidden = !msg; info.textContent = msg;
  }

  /* Prüfung vor Übersicht und vor WhatsApp – immer mit aktueller Uhrzeit */
  var triedSend = false;
  var phoneOk = function (v) { var d = v.replace(/\D/g, ""); return !/[^0-9+\s\/().\-]/.test(v) && d.length >= 7 && d.length <= 15; };
  function requiredMissing() {
    if (!F.name) return [];
    var del = mode() === "Lieferung", out = [];
    if (!F.name.value.trim()) out.push({ el: F.name, msg: "Bitte Namen angeben" });
    if (!phoneOk(F.phone.value.trim())) out.push({ el: F.phone, msg: F.phone.value.trim() ? "Bitte gültige Telefonnummer angeben" : "Bitte Telefonnummer angeben" });
    if (del && !F.place.value) out.push({ el: F.place, msg: "Bitte Lieferort wählen" });
    if (del && !F.address.value.trim()) out.push({ el: F.address, msg: "Bitte Lieferadresse angeben" });
    return out;
  }
  function problems() {
    var out = [];
    if (!cart.length) out.push({ msg: "Der Warenkorb ist leer" });
    if (!anyModeAvailable()) { out.push({ msg: "Derzeit geschlossen", long: closedText() }); return out; }
    if (!modeAvailable(mode())) out.push({ msg: mode() + " ist gerade nicht möglich" });
    if (refError) out.push({ msg: "Anfragenummer nicht verfügbar", long: "Ihr Browser kann keine sichere Anfragenummer erzeugen. Bitte nutzen Sie einen aktuellen Browser oder bestellen Sie telefonisch unter " + R.phoneDisplay + "." });
    var t = totals();                                        // Mindestbestellwert sperrt die Bestellung (nur Warenwert)
    if (t.zone && t.goods < t.zone.minOrder) out.push({ el: F.place, msg: "Mindestbestellwert " + money(t.zone.minOrder) + " – noch " + money(cents(t.zone.minOrder - t.goods)) });
    return out.concat(requiredMissing());
  }
  function markInvalid() {
    var bad = requiredMissing().map(function (m) { return m.el; });
    [F.name, F.phone, F.place, F.address].forEach(function (el) {
      if (!el) return;
      var invalid = triedSend && bad.indexOf(el) > -1;
      el.setAttribute("aria-invalid", invalid ? "true" : "false");
      el.closest(".field").classList.toggle("is-invalid", invalid);
    });
  }

  function updateCheckout() {
    if (!linesEl) return;
    applyDeliveryCutoff();
    var t = totals(), delivery = t.delivery;
    $("[data-address-field]").hidden = !delivery;
    $("[data-place-field]").hidden = !delivery;
    F.address.placeholder = F.place.value === "__other" ? "Straße, Hausnummer, PLZ und Ort" : "Straße, Hausnummer";
    $("[data-cart-sums]").innerHTML = sumRow("Warenwert", money(t.goods)) +
      (t.pfand ? sumRow("Getränkepfand", money(t.pfand)) : "") +
      (delivery ? sumRow("Lieferkosten", feeText(t)) : "") +
      sumRow("Insgesamt bar", grandHtml(t), "is-grand");
    $$("[data-grand]").forEach(function (el) { el.innerHTML = grandHtml(t); });
    var minEl = $("[data-cart-min]");
    minEl.classList.remove("is-ok"); minEl.hidden = true;
    if (delivery && F.place.value === "__other") { minEl.hidden = false; minEl.textContent = "Weitere Orte auf Anfrage – Mindestbestellwert und Lieferkosten bestätigt Ihnen das Restaurant."; }
    else if (t.zone) {
      minEl.hidden = false;
      if (t.goods < t.zone.minOrder) minEl.textContent = "Mindestbestellwert für " + F.place.value + ": " + money(t.zone.minOrder) + " Warenwert (noch " + money(cents(t.zone.minOrder - t.goods)) + "). Pfand und Lieferkosten zählen nicht dazu. Die Bestellung ist möglich, sobald er erreicht ist.";
      else { minEl.classList.add("is-ok"); minEl.textContent = "Mindestbestellwert für " + F.place.value + " (" + money(t.zone.minOrder) + ") erreicht."; }
    }
    renderRef();
    var closedEl = $("[data-cart-closed]"), open = anyModeAvailable();
    closedEl.hidden = open; if (!open) closedEl.textContent = closedText();
    var p = problems(), go = $("[data-to-summary]"), hint = $("[data-checkout-hint]");
    go.setAttribute("aria-disabled", p.length ? "true" : "false");
    go.classList.toggle("is-closed", !open);
    hint.textContent = p.length ? (p[0].long || p[0].msg) : "Noch wird nichts gesendet – im nächsten Schritt prüfen Sie Ihre Bestellübersicht.";
    hint.classList.toggle("is-warn", !!p.length && (triedSend || !open));
  }

  function renderRef() {
    var nr = refFor(mode());
    $$("[data-ref-nr]").forEach(function (el) { el.textContent = nr; });
    var box = $("[data-ref-box]"); if (box) box.classList.toggle("is-error", refError);
    var err = $("[data-ref-error]"); if (err) err.hidden = !refError;
    var cp = $("[data-ref-copy]"); if (cp) cp.hidden = !nr;
  }

  /* Wunschzeit: „so schnell wie möglich“ oder heute in 15-Minuten-Schritten, mind. 30 Minuten Vorlauf,
     innerhalb des Annahmefensters der gewählten Bestellart */
  var LEAD = 30, timeLost = "";
  function fillTimes() {
    var sel = F.time; if (!sel) return;
    var keep = sel.value, n = berlinNow(), closedToday = H.closedDays.indexOf(n.day) > -1;
    if (TEST) { closedToday = false; n = { day: n.day, min: toMin(H.open) }; }   // Test: alle Zeiten des Tages wählbar
    var open = toMin(H.open), end = mode() === "Lieferung" ? toMin(H.orderUntil) : toMin(H.close);
    var start = Math.max(open, Math.ceil((n.min + LEAD) / 15) * 15);
    var opts = ['<option value="asap">So schnell wie möglich</option>'], grp = [];
    if (!closedToday && n.min >= open && n.min < end) {
      for (var m = start; m <= end; m += 15) {
        var hh = String(Math.floor(m / 60)).padStart(2, "0"), mm = String(m % 60).padStart(2, "0");
        grp.push('<option value="' + hh + ":" + mm + '">Heute, ' + hh + ":" + mm + " Uhr</option>");
      }
    }
    if (grp.length) opts.push('<optgroup label="Heute zu einer bestimmten Uhrzeit">' + grp.join("") + "</optgroup>");
    else opts.push('<option value="" disabled>Heute keine späteren Zeiten mehr</option>');
    sel.innerHTML = opts.join("");
    if (keep && keep !== "asap" && !sel.querySelector('option[value="' + keep + '"]:not([disabled])')) timeLost = keep;
    sel.value = keep && sel.querySelector('option[value="' + keep + '"]:not([disabled])') ? keep : "asap";
    var lost = $("[data-time-lost]");
    if (lost) { lost.hidden = !timeLost; lost.textContent = timeLost ? "Die gewählte Uhrzeit " + timeLost + " Uhr ist nicht mehr möglich – bitte neu wählen." : ""; }
  }
  function refresh() { fillTimes(); updateCheckout(); markInvalid(); }

  /* Bestellübersicht (Bon) und WhatsApp-Nachricht – aus denselben Daten */
  function orderData() {
    var t = totals(), m = mode(), del = m === "Lieferung";
    var place = del ? (F.place.value === "__other" ? "" : F.place.value) : "";
    return {
      t: t, mode: m, delivery: del, name: F.name.value.trim(), phone: F.phone.value.trim(),
      address: del ? [F.address.value.trim(), place].filter(Boolean).join(", ") : "",
      otherPlace: del && F.place.value === "__other",
      when: F.time.value && F.time.value !== "asap" ? "heute, " + F.time.value + " Uhr" : "so schnell wie möglich",
      note: F.note.value.trim(), lines: cart.map(lineCalc), ref: refFor(m)
    };
  }
  var plain = function (s) { return String(s).replace(/[  ]/g, " "); };
  function buildMessage() {
    var o = orderData(), t = o.t, L = [];
    if (TEST) L.push("*** TESTBESTELLUNG – bitte nicht zubereiten ***", "");
    L.push("MINAR KÜCHE – BESTELLANFRAGE", "", "Anfrage-Nr.: " + o.ref, "", "Bestellart: " + o.mode, "Name: " + o.name, "Telefon: " + o.phone);
    if (o.delivery) L.push("Lieferadresse: " + o.address + (o.otherPlace ? " (anderer Ort, Konditionen auf Anfrage)" : ""));
    L.push("Wunschzeit: " + o.when, "", "BESTELLUNG", "");
    o.lines.forEach(function (c) {
      L.push(c.qty + " × " + (c.it.nr ? "Nr. " + c.it.nr + " " : "") + c.it.name + " – " + money(c.total) + (c.qty > 1 ? " (je " + money(c.unit) + ")" : ""));
      c.details.forEach(function (d) { L.push("- " + d.k + ": " + d.t); });
      if (c.pfandUnit) L.push("- Pfand: " + c.qty + " × " + money(c.pfandUnit));
      L.push("");
    });
    if (o.note) L.push("Anmerkung: " + o.note, "");
    L.push("Warenwert: " + money(t.goods), "Lieferkosten: " + feeText(t), "Getränkepfand: " + money(t.pfand), "INSGESAMT BAR: " + grandText(t), "");
    L.push("Zahlung bar bei " + (o.delivery ? "Lieferung" : "Abholung") + ".", "Bitte bestätigen Sie meine Bestellung sowie die gewünschte Uhrzeit.");
    return plain(L.join("\n"));
  }
  var waUrl = function (msg) { return "https://wa.me/" + ORDER_WA + "?text=" + encodeURIComponent(msg); };
  var bonDialog = $("#bon-dialog"), bonMsg = "";
  function renderBon(alertMsg) {
    var o = orderData(), t = o.t, now = new Date();
    var meta = [["Bestellart", o.mode], ["Name", o.name], ["Telefon", o.phone]];
    if (o.delivery) meta.push(["Lieferadresse", o.address + (o.otherPlace ? " (anderer Ort – Konditionen auf Anfrage)" : "")]);
    meta.push(["Wunschzeit", o.when]);
    if (o.note) meta.push(["Anmerkung", o.note]);
    $("[data-bon-ref]", bonDialog).textContent = o.ref;
    $("[data-bon-meta]", bonDialog).innerHTML = meta.map(function (r) { return sumRow(esc(r[0]), esc(r[1])); }).join("");
    $("[data-bon-lines]", bonDialog).innerHTML = o.lines.map(function (c) {
      return '<li><div class="bon-line"><span class="bon-q">' + c.qty + ' ×</span><span class="bon-n">' + (c.it.nr ? "<small>Nr. " + esc(c.it.nr) + "</small> " : "") + esc(c.it.name) + '</span><span class="bon-p">' + money(c.total) + "</span></div>" +
        '<ul class="bon-sub">' + c.details.map(function (d) { return "<li>" + esc(d.k) + ": " + esc(d.t) + "</li>"; }).join("") +
        "<li>je " + money(c.unit) + (c.pfandUnit ? " · Pfand " + c.qty + " × " + money(c.pfandUnit) : "") + "</li></ul></li>";
    }).join("");
    $("[data-bon-sums]", bonDialog).innerHTML = sumRow("Warenwert", money(t.goods)) + sumRow("Lieferkosten", feeText(t)) +
      sumRow("Getränkepfand", money(t.pfand)) + sumRow("Insgesamt bar zu zahlen", grandHtml(t), "is-grand");
    $("[data-bon-stamp]", bonDialog).textContent = "Übersicht erstellt am " + now.toLocaleDateString("de-DE", { timeZone: H.timezone }) + " um " +
      now.toLocaleTimeString("de-DE", { timeZone: H.timezone, hour: "2-digit", minute: "2-digit" }) + " Uhr · Übersicht, keine Bestätigung";
    bonMsg = buildMessage();
    var send = $("[data-bon-send]", bonDialog);
    send.href = waUrl(bonMsg); send.setAttribute("aria-disabled", "false");
    var al = $("[data-bon-alert]", bonDialog); al.hidden = !alertMsg; al.textContent = alertMsg || "";
    $("[data-bon-opened]", bonDialog).hidden = true;
    $("[data-new-order]", bonDialog).hidden = true;
  }
  function toSummary() {
    triedSend = true; refresh();
    var p = problems();
    if (p.length) { var f = p.filter(function (x) { return x.el; })[0]; if (f) f.el.focus(); return; }
    if (!drinksAsked && !hasDrink()) { openDrinks(); return; }
    renderBon(); openDialog(bonDialog);
  }

  if (linesEl && TEST) {
    var testNr = "+" + ORDER_WA.replace(/^49/, "49 ");
    var tb = document.createElement("p"); tb.className = "test-banner"; tb.setAttribute("role", "note");
    tb.innerHTML = "<strong>Testmodus aktiv:</strong> Bestellanfragen gehen an " + esc(testNr) + " (nicht an das Restaurant) und sind unabhängig von den Öffnungszeiten möglich.";
    $(".order-main").insertBefore(tb, $(".order-main").firstChild);
    var tb2 = tb.cloneNode(true); $(".bon-actions", bonDialog).insertBefore(tb2, $(".bon-actions", bonDialog).firstChild);
  }
  if (linesEl) {
    F = { name: $("[data-f-name]"), phone: $("[data-f-phone]"), address: $("[data-f-address]"), time: $("[data-f-time]"), note: $("[data-f-note]"), place: $("[data-f-place]") };
    F.place.innerHTML = '<option value="">Bitte wählen …</option>' + places.slice().sort(function (a, b) { return a.name.localeCompare(b.name, "de"); }).map(function (p) {
      var z = zones[p.zone];
      return '<option value="' + esc(p.name) + '">' + esc(p.name) + " (ab " + money(z.minOrder) + ", Lieferkosten " + money(z.fee) + ")</option>";
    }).join("") + '<option value="__other">Anderer Ort (auf Anfrage)</option>';
    var saved = sess.get(FORM_KEY) || {};
    ["name", "phone", "address", "place", "note"].forEach(function (k) { if (saved[k]) F[k].value = saved[k]; });
    if (saved.mode) $$("[data-mode]").forEach(function (r) { r.checked = r.value === saved.mode; });
    applyDeliveryCutoff(); fillTimes();
    setInterval(refresh, 30000);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) refresh(); });
    window.addEventListener("focus", refresh);

    linesEl.addEventListener("click", function (e) {
      var li = e.target.closest("[data-line]"); if (!li) return;
      var l = cart[+li.getAttribute("data-line")]; if (!l) return;
      if (e.target.closest("[data-l-minus]")) { l.qty -= 1; if (l.qty < 1) { cart.splice(cart.indexOf(l), 1); toast(l.name + " entfernt"); } }
      else if (e.target.closest("[data-l-plus]")) l.qty = Math.min(50, l.qty + 1);
      else if (e.target.closest("[data-l-remove]")) { cart.splice(cart.indexOf(l), 1); toast(l.name + " entfernt"); }
      else if (e.target.closest("[data-l-edit]")) { openItem(itemById[l._id], l); return; }
      else return;
      saveCart(); renderBadge(); renderCartPage();
    });
    ["input", "change"].forEach(function (ev) {
      $("[data-cart-body]").addEventListener(ev, function (e) {
        if (!e.target.matches("[data-f-name],[data-f-phone],[data-f-address],[data-f-time],[data-f-note],[data-f-place],[data-mode]")) return;
        if (e.target.matches("[data-mode]")) fillTimes();
        if (e.target.matches("[data-f-time]")) { timeLost = ""; fillTimes(); }
        saveForm(); updateCheckout(); markInvalid();
      });
    });
    function newOrder() {
      cart = []; saveCart(); sess.del(FORM_KEY);
      ["name", "phone", "address", "note"].forEach(function (k) { F[k].value = ""; }); F.place.value = "";
      triedSend = false; drinksAsked = false; renderBadge(); renderCartPage(); markInvalid();
    }
    $("[data-cart-clear]").addEventListener("click", function () { newOrder(); toast("Warenkorb und Angaben gelöscht"); });
    $("[data-new-order]", bonDialog).addEventListener("click", function () {
      closeDialog(bonDialog); newOrder(); toast("Neue Bestellung – die nächste Anfrage erhält eine neue Anfragenummer");
      location.href = "speisekarte/index.html";
    });
    $("[data-ref-copy]").addEventListener("click", function () {
      var nr = refFor(mode()); if (!nr) return;
      var done = function () { toast("Anfragenummer " + nr + " kopiert"); };
      var fallback = function () {
        var r = document.createRange(), el = $("[data-ref-nr]"); r.selectNodeContents(el);
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
        try { document.execCommand("copy"); done(); } catch (e) { toast("Bitte Nummer markieren und kopieren"); }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(nr).then(done, fallback); else fallback();
    });
    $("[data-to-summary]").addEventListener("click", toSummary);

    /* „Per WhatsApp senden“: unmittelbar vorher erneut prüfen (Uhrzeit, Öffnungsstatus, Angaben).
       Hat sich etwas geändert, wird die Übersicht aktualisiert statt eine veraltete Nachricht zu öffnen. */
    $("[data-bon-send]", bonDialog).addEventListener("click", function (e) {
      var before = bonMsg; refresh();
      var p = problems();
      if (p.length) {
        e.preventDefault(); this.setAttribute("aria-disabled", "true");
        var al = $("[data-bon-alert]", bonDialog); al.hidden = false;
        al.textContent = (p[0].long || p[0].msg) + (p[0].long ? "" : " – bitte im Warenkorb korrigieren.");
        return;
      }
      var now = buildMessage();
      if (now !== before) { e.preventDefault(); renderBon("Ihre Übersicht wurde aktualisiert (z. B. Uhrzeit oder Verfügbarkeit). Bitte prüfen und erneut auf „Per WhatsApp senden“ tippen."); return; }
      this.href = waUrl(now);
      $("[data-bon-alert]", bonDialog).hidden = true;
      $("[data-bon-opened]", bonDialog).hidden = false;     // neutraler Hinweis – keine Erfolgsmeldung
      $("[data-new-order]", bonDialog).hidden = false;
    });
  }

  /* ---------------- Warenkorb als Drawer von unten (Test, cartDrawer in menu-data.js) ---------------- */
  var drawer = $("#cart-drawer");
  if (drawer && R.cartDrawer) {
    swipeToClose(drawer, ".drawer-inner");
    var openDrawer = function (e) {
      if (e) e.preventDefault();
      refresh(); openDialog(drawer);
      var t = $(".drawer-inner", drawer); if (t) t.scrollTop = 0;
    };
    $$(".cart-link, [data-cart-fab]").forEach(function (a) {
      a.addEventListener("click", openDrawer);
      a.setAttribute("aria-haspopup", "dialog");
    });
    if (location.hash === "#warenkorb") openDrawer();
  }

  /* ---------------- Getränke-Abfrage vor der Übersicht ---------------- */
  var drinksAsked = false, drinkDialog = null;
  var DRINK_CAT = "getraenke";
  function hasDrink() { return cart.some(function (l) { return itemById[l._id].category === DRINK_CAT; }); }
  function openDrinks() {
    var drinks = items.filter(function (i) { return i.category === DRINK_CAT; });
    if (!drinks.length) { drinksAsked = true; toSummary(); return; }
    if (!drinkDialog) {
      drinkDialog = document.createElement("dialog");
      drinkDialog.className = "sheet sheet-drinks"; drinkDialog.setAttribute("aria-labelledby", "drinks-title");
      drinkDialog.innerHTML = '<div class="sheet-inner"><div class="sheet-head"><div><p class="eyebrow">Fast geschafft</p><h2 id="drinks-title">Noch etwas zu trinken?</h2></div>' +
        '<button class="icon-btn sheet-close" type="button" data-close aria-label="Schließen">×</button></div>' +
        '<ul class="drink-list">' + drinks.map(function (d) {
          return '<li class="drink" data-drink="' + d._id + '"><div class="drink-name">' + esc(d.name) +
            '<small class="drink-pfand">' + (d.pfand ? "zzgl. " + money(d.pfand) + " Pfand" : "ohne Pfand") + "</small>" +
            '<span class="drink-added" data-added hidden></span></div>' +
            '<div class="drink-sizes">' + d.prices.map(function (p, i) {
              return '<button type="button" class="drink-size" data-v="' + i + '">' + (p.label ? esc(p.label) + " · " : "") + money(p.price) + "</button>";
            }).join("") + "</div></li>";
        }).join("") + "</ul>" +
        '<div class="sheet-foot drink-foot"><button type="button" class="btn btn-link" data-drinks-skip>Ohne Getränk weiter</button>' +
        '<button type="button" class="btn btn-primary btn-grow" data-drinks-go>Weiter zur Übersicht</button></div></div>';
      document.body.appendChild(drinkDialog);
      swipeToClose(drinkDialog, ".sheet-inner", isSheetMobile);
      drinkDialog.addEventListener("click", function (e) {
        if (e.target === drinkDialog || e.target.closest("[data-close]")) { closeDialog(drinkDialog); return; }
        var b = e.target.closest(".drink-size");
        if (b) {
          var li = b.closest("[data-drink]"), it = itemById[li.getAttribute("data-drink")];
          addToCart(it, +b.getAttribute("data-v"), {}, 1, "");
          var tag = $("[data-added]", li), n = (+tag.getAttribute("data-n") || 0) + 1;
          tag.setAttribute("data-n", n); tag.textContent = n + " × hinzugefügt"; tag.hidden = false;
          b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
          return;
        }
        if (e.target.closest("[data-drinks-skip]") || e.target.closest("[data-drinks-go]")) {
          drinksAsked = true; closeDialog(drinkDialog); toSummary();
        }
      });
      drinkDialog.addEventListener("close", function () { if (!$("dialog[open]")) document.body.style.overflow = ""; });
    }
    $$("[data-added]", drinkDialog).forEach(function (t) { t.hidden = true; t.setAttribute("data-n", 0); });
    openDialog(drinkDialog);
  }

  /* ---------------- Fixierte Buttons über der Footer-Leiste halten ---------------- */
  (function () {
    var bar = $(".footer-bottom"); if (!bar) return;
    var root = document.documentElement, raf = 0;
    var lift = function () {
      raf = 0;
      var visible = Math.max(0, window.innerHeight - bar.getBoundingClientRect().top);
      root.style.setProperty("--fab-lift", Math.round(visible) + "px");
    };
    var req = function () { if (!raf) raf = requestAnimationFrame(lift); };
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    lift();
  })();

  /* ---------------- Seiten-CTA (rechts fixiert) ---------------- */
  var cta = $("[data-side-cta]");
  if (cta) {
    var tab = $(".side-cta-tab", cta);
    var setCta = function (open) { cta.classList.toggle("is-open", open); tab.setAttribute("aria-expanded", String(open)); };
    tab.addEventListener("click", function (e) { e.stopPropagation(); setCta(!cta.classList.contains("is-open")); });
    document.addEventListener("click", function (e) { if (!cta.contains(e.target)) setCta(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setCta(false); });
    // erst nach kurzem Scrollen bzw. 1,2 s einblenden – stört den ersten Eindruck nicht
    var showCta = function () { cta.classList.add("is-visible"); };
    setTimeout(showCta, 1200);
    window.addEventListener("scroll", function () { if (window.scrollY > 120) showCta(); }, { passive: true });
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
