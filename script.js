/* =====================================================================
   MINAR Küche – Interaktion
   Speisekarte (Filter, Suche), Warenkorb, WhatsApp-Nachricht, Öffnungsstatus
   Keine externen Abhängigkeiten. Daten kommen aus menu-data.js.
   ===================================================================== */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var D = window.MINAR_DATA;
  if (!D) { console.error("menu-data.js fehlt"); return; }

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
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignorieren */ } }
  };

  var R = D.restaurant;
  var GROUPS = D.optionGroups || D.extraGroups || {};
  var LEG = D.legend || { allergens: {}, additives: {} };

  /* ---------------- Daten normalisieren ---------------- */
  var items = (D.items || []).map(function (src, i) {
    var it = {
      _id: "i" + i,
      nr: src.nr || "",
      name: src.name,
      category: src.cat || src.category,
      description: src.desc || src.description || "",
      tags: src.tags || [],
      codesCheck: !!src.codesCheck,
      allergens: [], additives: [],
      opts: (src.opts || (src.extras ? [src.extras] : [])).filter(function (g) { return GROUPS[g]; })
    };
    var pr = src.prices && src.prices.length ? src.prices : [0];
    it.prices = pr.map(function (p) {
      if (Array.isArray(p)) return { label: p[0], price: p[1] };
      if (typeof p === "number") return { label: "", price: p };
      return p;
    });
    if (src.codes && !it.codesCheck) {
      src.codes.split(",").map(function (c) { return c.trim(); }).filter(Boolean).forEach(function (c) {
        (/^\d+$/.test(c) ? it.additives : it.allergens).push(c);
      });
    }
    if (src.allergens) it.allergens = it.allergens.concat(src.allergens);
    if (src.additives) it.additives = it.additives.concat(src.additives);
    return it;
  });
  var itemById = {};
  items.forEach(function (it) { itemById[it._id] = it; });
  var catById = {};
  D.categories.forEach(function (c) { catById[c.id] = c; });
  var hasItems = items.length > 0;

  var zones = (D.delivery && D.delivery.zones) || [];
  var places = [];
  zones.forEach(function (z, zi) {
    (z.places || (z.area ? [z.area] : [])).forEach(function (p) { places.push({ name: p, zone: zi }); });
  });

  /* ---------------- Header / Navigation ---------------- */
  var header = $(".site-header");
  var navToggle = $(".nav-toggle");
  var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setNav(open) {
    document.body.classList.toggle("nav-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
  }
  navToggle.addEventListener("click", function () { setNav(!document.body.classList.contains("nav-open")); });
  $$(".main-nav a").forEach(function (a) { a.addEventListener("click", function () { setNav(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setNav(false); });

  var navLinks = $$(".main-nav ul a");
  if ("IntersectionObserver" in window) {
    var sectionIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id === "ueber-uns" ? "start" : en.target.id;
        navLinks.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["start", "ueber-uns", "speisekarte", "lieferservice", "kontakt"].forEach(function (id) {
      var el = document.getElementById(id); if (el) sectionIo.observe(el);
    });
    var revealIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); revealIo.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    $$(".reveal").forEach(function (el) { revealIo.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------------- Öffnungszeiten & Status ---------------- */
  var DAY_NAMES = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  var H = D.hours;
  var toMin = function (t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; };

  function berlinNow() {
    try {
      var parts = new Intl.DateTimeFormat("en-GB", { timeZone: H.timezone, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
      var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
      var wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(o.weekday);
      return { day: wd, min: (+o.hour % 24) * 60 + +o.minute };
    } catch (e) {
      var d = new Date(); return { day: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function status() {
    var n = berlinNow();
    var closedToday = H.closedDays.indexOf(n.day) > -1;
    var o = toMin(H.open), c = toMin(H.close), ou = toMin(H.orderUntil);
    var open = !closedToday && n.min >= o && n.min < c;
    var ordering = !closedToday && n.min >= o && n.min < ou;
    var text;
    if (open) {
      text = ordering ? "Jetzt geöffnet · Bestellannahme bis " + H.orderUntil + " Uhr" : "Geöffnet bis " + H.close + " Uhr · Bestellannahme beendet";
    } else {
      var d = n.day, add = 0;
      if (closedToday || n.min >= o) { do { d = (d + 1) % 7; add++; } while (H.closedDays.indexOf(d) > -1); }
      var when = add === 0 ? "heute" : add === 1 ? "morgen" : DAY_NAMES[d];
      text = (closedToday ? "Heute Ruhetag" : "Geschlossen") + " · öffnet " + when + " um " + H.open + " Uhr";
    }
    return { open: open, ordering: ordering, day: n.day, text: text, short: open ? "Jetzt geöffnet" : (closedToday ? "Heute Ruhetag" : "Derzeit geschlossen") };
  }

  function renderStatus() {
    var s = status();
    $$("[data-open-dot]").forEach(function (el) { el.classList.toggle("is-open", s.open); el.classList.toggle("is-closed", !s.open); });
    $$("[data-open-status]").forEach(function (el) { el.textContent = s.short + " · Bad Buchau"; });
    $$("[data-open-status-long]").forEach(function (el) { el.textContent = s.text; });
    var list = $("[data-hours-list]");
    if (list) {
      list.innerHTML = [1, 2, 3, 4, 5, 6, 0].map(function (d) {
        var closed = H.closedDays.indexOf(d) > -1;
        return '<li class="' + (d === s.day ? "is-today " : "") + (closed ? "is-closed" : "") + '"><span>' + DAY_NAMES[d] + "</span><span>" +
          (closed ? "Ruhetag" : H.open + "–" + H.close + " Uhr") + "</span></li>";
      }).join("");
    }
    return s;
  }
  renderStatus();
  setInterval(renderStatus, 60000);

  /* ---------------- Kategorien-Kacheln ---------------- */
  var countFor = function (catId) { return items.filter(function (i) { return i.category === catId; }).length; };
  var tiles = $("[data-category-tiles]");
  tiles.innerHTML = D.categories.map(function (c, i) {
    return '<a class="cat-tile" href="#speisekarte" data-goto-cat="' + esc(c.id) + '"><span class="cat-tile-num">' +
      String(i + 1).padStart(2, "0") + '</span><span class="cat-tile-name">' + esc(c.name) + "</span></a>";
  }).join("");

  /* ---------------- Speisekarte ---------------- */
  var chipsEl = $("[data-menu-chips]");
  var listEl = $("[data-menu-list]");
  var searchEl = $("[data-menu-search]");
  var clearEl = $("[data-search-clear]");
  var activeCat = "all";
  var query = "";

  function renderChips() {
    var all = [{ id: "all", name: "Alle" }].concat(D.categories);
    chipsEl.innerHTML = all.map(function (c) {
      var n = c.id === "all" ? items.length : countFor(c.id);
      return '<button type="button" class="chip" role="tab" data-cat="' + esc(c.id) + '" aria-selected="' + (c.id === activeCat) + '">' +
        esc(c.name) + (hasItems ? "<small>" + n + "</small>" : "") + "</button>";
    }).join("");
  }

  var norm = function (s) { return String(s || "").toLowerCase().replace(/ß/g, "ss").normalize("NFD").replace(/[̀-ͯ]/g, ""); };

  function matches(it) {
    if (!query) return true;
    var q = norm(query).trim();
    if (/^\d+[a-z]?$/.test(q) && norm(it.nr) === q) return true;
    var hay = norm([it.nr, it.name, it.description, it.tags.join(" "), (catById[it.category] || {}).name].join(" "));
    return q.split(/\s+/).every(function (w) { return hay.indexOf(w) > -1; });
  }

  function priceHtml(it) {
    if (it.prices.length === 1) return money(it.prices[0].price) + (it.prices[0].label ? "<small>" + esc(it.prices[0].label) + "</small>" : "");
    var min = Math.min.apply(null, it.prices.map(function (p) { return p.price; }));
    return "<small>ab</small>" + money(min);
  }

  function codeList(codes, legend) {
    return codes.map(function (c) { var t = legend[c]; return t ? '<abbr title="' + esc(t) + '">' + esc(c) + "</abbr>" : esc(c); }).join(", ");
  }
  function allergenHtml(it) {
    if (it.codesCheck) return '<span class="allergens allergens-check">Allergene &amp; Zusatzstoffe auf Anfrage</span>';
    var parts = [];
    if (it.allergens.length) parts.push("Allergene: " + codeList(it.allergens, LEG.allergens || {}));
    if (it.additives.length) parts.push("Zusatzstoffe: " + codeList(it.additives, LEG.additives || {}));
    return parts.length ? '<span class="allergens">' + parts.join(" · ") + "</span>" : "";
  }

  function dishHtml(it) {
    var tags = it.tags.map(function (t) {
      var cls = /veg/.test(t) ? "tag tag-veg" : /scharf/.test(t) ? "tag tag-hot" : "tag";
      return '<span class="' + cls + '">' + esc(t) + "</span>";
    }).join("");
    var al = allergenHtml(it);
    var variants = it.prices.length > 1
      ? '<span class="variants-line">' + it.prices.map(function (p) { return esc(p.label) + " " + money(p.price); }).join(" · ") + "</span>"
      : "<span></span>";
    return '<article class="dish">' +
      '<h4 class="dish-title">' + (it.nr ? '<span class="dish-nr">' + esc(it.nr) + "</span>" : "") + esc(it.name) + "</h4>" +
      '<div class="dish-price">' + priceHtml(it) + "</div>" +
      (it.description ? '<p class="dish-desc">' + esc(it.description) + "</p>" : "") +
      ((tags || al) ? '<div class="dish-meta">' + tags + al + "</div>" : "") +
      '<div class="dish-foot">' + variants + '<button type="button" class="add-btn" data-add="' + it._id + '" aria-label="' + esc(it.name) + ' hinzufügen">Hinzufügen</button></div>' +
      "</article>";
  }

  function renderMenu() {
    var cats = activeCat === "all" ? D.categories : D.categories.filter(function (c) { return c.id === activeCat; });
    var html = "", total = 0;
    cats.forEach(function (c) {
      var list = items.filter(function (it) { return it.category === c.id && matches(it); });
      total += list.length;
      if (query && !list.length) return;
      html += '<section class="menu-cat" id="kat-' + esc(c.id) + '"><div class="menu-cat-head"><h3>' + esc(c.name) + "</h3>" +
        (list.length ? "<span>" + list.length + (list.length === 1 ? " Gericht" : " Gerichte") + "</span>" : "") +
        ((c.desc || c.description) ? '<p class="fine">' + esc(c.desc || c.description) + "</p>" : "") + "</div>" +
        (list.length ? '<div class="menu-items">' + list.map(dishHtml).join("") + "</div>"
          : '<div class="menu-empty-cat">Für diese Kategorie sind online noch keine Gerichte hinterlegt – fragen Sie gerne telefonisch nach: <a href="tel:' + R.phoneLink + '">' + esc(R.phoneDisplay) + "</a>.</div>") +
        "</section>";
    });
    if (query && !total) {
      html = '<div class="menu-noresult"><p>Keine Treffer für „' + esc(query) + '“.</p><button type="button" class="btn btn-primary" data-reset-search>Suche zurücksetzen</button></div>';
    }
    listEl.innerHTML = html;
  }

  function scrollToMenuTop() {
    var t = $("[data-menu-toolbar]");
    if (!t) return;
    var y = listEl.getBoundingClientRect().top + window.scrollY - header.offsetHeight - t.offsetHeight - 8;
    if (window.scrollY > y + 4) window.scrollTo({ top: y, behavior: "smooth" });
  }

  chipsEl.addEventListener("click", function (e) {
    var b = e.target.closest("[data-cat]"); if (!b) return;
    activeCat = b.getAttribute("data-cat");
    renderChips(); renderMenu(); scrollToMenuTop();
    b = chipsEl.querySelector('[data-cat="' + activeCat + '"]');
    if (b && b.scrollIntoView) b.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  });

  var searchTimer;
  searchEl.addEventListener("input", function () {
    clearTimeout(searchTimer);
    clearEl.hidden = !searchEl.value;
    searchTimer = setTimeout(function () {
      query = searchEl.value.trim();
      if (query && activeCat !== "all") { activeCat = "all"; renderChips(); }
      renderMenu();
    }, 120);
  });
  function resetSearch() { searchEl.value = ""; query = ""; clearEl.hidden = true; renderMenu(); searchEl.focus(); }
  clearEl.addEventListener("click", resetSearch);
  listEl.addEventListener("click", function (e) {
    if (e.target.closest("[data-reset-search]")) resetSearch();
    var add = e.target.closest("[data-add]");
    if (add) {
      var it = itemById[add.getAttribute("data-add")];
      // einfache Artikel direkt hinzufügen, sonst Auswahl-Dialog
      if (it.prices.length === 1 && !it.opts.length) addToCart(it, 0, {}, 1, "");
      else openItem(it);
    }
  });

  tiles.addEventListener("click", function (e) {
    var t = e.target.closest("[data-goto-cat]"); if (!t || !hasItems) return;
    activeCat = t.getAttribute("data-goto-cat");
    searchEl.value = ""; query = ""; clearEl.hidden = true;
    renderChips(); renderMenu();
  });

  // Hinweis, solange noch keine Gerichte gepflegt sind
  var notice = $("[data-menu-notice]");
  if (!hasItems) {
    notice.hidden = false;
    notice.innerHTML = '<div><p><strong>Unsere Online-Speisekarte wird gerade eingepflegt.</strong><br>Bis dahin nehmen wir Ihre Bestellung gerne telefonisch oder per WhatsApp entgegen.</p>' +
      '<div class="notice-actions"><a class="btn btn-primary" href="tel:' + R.phoneLink + '">Anrufen</a>' +
      '<a class="btn btn-whatsapp" href="https://wa.me/' + R.whatsappNumber + '" target="_blank" rel="noopener">WhatsApp</a></div></div>';
    $("[data-menu-toolbar]").hidden = true;
    listEl.hidden = true;
    var ov = $("[data-menu-overview]");
    ov.hidden = false;
    tiles.classList.remove("reveal");
    tiles.innerHTML = tiles.innerHTML.replace(/<a class="cat-tile" href="#speisekarte"/g, '<span class="cat-tile"').replace(/<\/a>/g, "</span>");
    ov.appendChild(tiles);
    $("[data-tiles-home]").hidden = true;
    var lead = $("#speisekarte .section-lead");
    if (lead) lead.textContent = "Ein Überblick über alle Kategorien unserer Speisekarte.";
  }

  // Legende
  (function () {
    var a = LEG.allergens || {}, z = LEG.additives || {};
    var ka = Object.keys(a), kz = Object.keys(z);
    var srcNote = $("[data-legend-note]");
    if (hasItems && D.menuSource) { srcNote.hidden = false; srcNote.className = "menu-source"; srcNote.textContent = D.menuSource; }
    if (!ka.length && !kz.length) return;
    var html = "";
    if (ka.length) html += "<h4>Allergene</h4>" + ka.map(function (k) { return "<div><strong>" + esc(k) + "</strong> – " + esc(a[k]) + "</div>"; }).join("");
    if (kz.length) html += "<h4>Zusatzstoffe</h4>" + kz.map(function (k) { return "<div><strong>" + esc(k) + "</strong> – " + esc(z[k]) + "</div>"; }).join("");
    var notes = (LEG.notes || []).concat(["Fehlt bei einem Gericht eine Kennzeichnung, bedeutet das nicht, dass es frei von Allergenen ist. Bitte fragen Sie bei Unverträglichkeiten nach."]);
    html += '<div class="legend-notes">' + notes.map(function (n) { return "<p>" + esc(n) + "</p>"; }).join("") + "</div>";
    $("[data-legend-content]").innerHTML = html;
    $("[data-legend]").hidden = false;
  })();

  renderChips();
  renderMenu();

  /* ---------------- Lieferkonditionen ---------------- */
  (function () {
    var box = $("[data-delivery-content]");
    if (!zones.length) {
      box.innerHTML = '<div class="delivery-pending"><p>Liefergebiete, Mindestbestellwerte und Lieferkosten nennen wir Ihnen gerne bei Ihrer Bestellung – telefonisch unter <a href="tel:' +
        R.phoneLink + '">' + esc(R.phoneDisplay) + '</a> oder per <a href="https://wa.me/' + R.whatsappNumber + '" target="_blank" rel="noopener">WhatsApp</a>.</p></div>';
      return;
    }
    var notes = D.delivery.notes || (D.delivery.note ? [D.delivery.note] : []);
    box.innerHTML = '<table class="delivery-table"><thead><tr><th scope="col">Liefergebiet</th><th scope="col">Mindestbestellwert</th><th scope="col">Lieferkosten</th></tr></thead><tbody>' +
      zones.map(function (z) {
        var area = (z.places || [z.area]).join(", ");
        return "<tr><td>" + esc(area) + '</td><td data-label="Mindestbestellwert">ab ' + money(z.minOrder) +
          '</td><td data-label="Lieferkosten">' + (z.fee === 0 ? "kostenlos" : money(z.fee)) + "</td></tr>";
      }).join("") + "</tbody></table>" +
      (notes.length ? '<ul class="delivery-notes">' + notes.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul>" : "");
  })();

  /* ---------------- Dialoge ---------------- */
  function openDialog(d) {
    if (typeof d.showModal === "function") { if (!d.open) d.showModal(); }
    else d.setAttribute("open", "");
    document.body.style.overflow = "hidden";
  }
  function closeDialog(d) {
    if (typeof d.close === "function") d.close(); else d.removeAttribute("open");
  }
  $$("dialog").forEach(function (d) {
    d.addEventListener("close", function () { if (!$("dialog[open]")) document.body.style.overflow = ""; });
    d.addEventListener("click", function (e) {
      if (e.target === d) closeDialog(d);
      if (e.target.closest("[data-close]")) closeDialog(d);
    });
  });

  var orderDialog = $("#order-dialog");
  $("[data-order-menu]").hidden = !hasItems;
  $$("[data-open-order]").forEach(function (b) {
    b.addEventListener("click", function () {
      setNav(false);
      if (cart.length) { openCart(); return; }
      renderStatus(); openDialog(orderDialog);
    });
  });

  /* ---------------- Gericht-Dialog ---------------- */
  var itemDialog = $("#item-dialog");
  var itemForm = $("[data-item-form]");
  var optsBox = $("[data-item-opts]", itemForm);
  var cur = null, curQty = 1;

  function optPrice(o, v) {
    if (Array.isArray(o.prices)) return o.prices[v] != null ? o.prices[v] : o.prices[o.prices.length - 1];
    return o.price || 0;
  }
  function readSelection() {
    var sel = {};
    cur.opts.forEach(function (gid) {
      sel[gid] = $$('input[data-g="' + gid + '"]:checked', itemForm).map(function (x) { return +x.value; });
    });
    return sel;
  }
  function selectionExtra(it, sel, v) {
    var sum = 0, names = [];
    it.opts.forEach(function (gid) {
      var g = GROUPS[gid];
      (sel[gid] || []).forEach(function (i) {
        var o = g.options[i]; if (!o) return;
        sum += optPrice(o, v); names.push(o.name);
      });
    });
    return { sum: sum, names: names };
  }

  function updateItemPrice() {
    if (!cur) return;
    var v = +((itemForm.querySelector("input[name=variant]:checked") || {}).value || 0);
    var sum = cur.prices[v].price + selectionExtra(cur, readSelection(), v).sum;
    $$("[data-opt-price]", itemForm).forEach(function (el) {
      var p = el.getAttribute("data-opt-price").split(":");
      var pr = optPrice(GROUPS[p[0]].options[+p[1]], v);
      el.textContent = pr ? "+ " + money(pr) : "";
    });
    $("[data-qty]", itemForm).textContent = curQty;
    $("[data-item-add]", itemForm).textContent = "Hinzufügen · " + money(sum * curQty);
  }

  function openItem(it) {
    if (!it) return;
    cur = it; curQty = 1;
    $("[data-item-nr]", itemForm).textContent = it.nr ? "Nr. " + it.nr : (catById[it.category] || {}).name || "";
    $("[data-item-title]", itemForm).textContent = it.name;
    $("[data-item-desc]", itemForm).textContent = it.description || "";
    $("[data-item-note]", itemForm).value = "";
    $("[data-item-variants]", itemForm).hidden = it.prices.length < 2;
    $("[data-variant-list]", itemForm).innerHTML = it.prices.map(function (p, i) {
      return '<label class="opt"><input type="radio" name="variant" value="' + i + '"' + (i === 0 ? " checked" : "") + "><span>" + esc(p.label || "Standard") + '</span><span class="opt-price">' + money(p.price) + "</span></label>";
    }).join("");
    optsBox.innerHTML = it.opts.map(function (gid) {
      var g = GROUPS[gid], one = g.type === "one";
      return '<fieldset class="opt-group"><legend>' + esc(g.label || "Auswahl") + (one ? "" : ' <small class="fine">(optional)</small>') + '</legend><div class="opt-list">' +
        g.options.map(function (o, i) {
          return '<label class="opt"><input type="' + (one ? "radio" : "checkbox") + '" name="g-' + gid + '" data-g="' + gid + '" value="' + i + '"' + (one && i === 0 ? " checked" : "") +
            "><span>" + esc(o.name) + '</span><span class="opt-price" data-opt-price="' + gid + ":" + i + '"></span></label>';
        }).join("") + "</div></fieldset>";
    }).join("");
    updateItemPrice();
    openDialog(itemDialog);
  }

  itemForm.addEventListener("change", updateItemPrice);
  $("[data-qty-minus]", itemForm).addEventListener("click", function () { curQty = Math.max(1, curQty - 1); updateItemPrice(); });
  $("[data-qty-plus]", itemForm).addEventListener("click", function () { curQty = Math.min(50, curQty + 1); updateItemPrice(); });
  itemForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!cur) return;
    var v = +((itemForm.querySelector("input[name=variant]:checked") || {}).value || 0);
    addToCart(cur, v, readSelection(), curQty, $("[data-item-note]", itemForm).value.trim());
    closeDialog(itemDialog);
  });

  /* ---------------- Warenkorb ---------------- */
  var CART_KEY = "minar-cart-v2", FORM_KEY = "minar-form-v2";
  var cart = (store.get(CART_KEY) || []).filter(function (l) {
    var it = items.filter(function (i) { return i.nr === l.nr && i.name === l.name; })[0];
    if (!it || !it.prices[l.v]) return false;
    l._id = it._id; l.sel = l.sel || {}; return true;
  });
  var cartDialog = $("#cart-dialog");

  function lineCalc(l) {
    var it = itemById[l._id];
    var ex = selectionExtra(it, l.sel, l.v);
    var unit = it.prices[l.v].price + ex.sum;
    return { it: it, unit: unit, total: unit * l.qty, variant: it.prices.length > 1 || it.prices[0].label ? it.prices[l.v].label : "", extras: ex.names };
  }
  function subtotal() { return cart.reduce(function (s, l) { return s + lineCalc(l).total; }, 0); }
  function count() { return cart.reduce(function (s, l) { return s + l.qty; }, 0); }

  function addToCart(it, v, sel, qty, note) {
    var key = it._id + "|" + v + "|" + JSON.stringify(sel) + "|" + note;
    var ex0 = cart.filter(function (l) { return l.key === key; })[0];
    if (ex0) ex0.qty = Math.min(50, ex0.qty + qty);
    else cart.push({ key: key, _id: it._id, nr: it.nr, name: it.name, v: v, sel: sel, qty: qty, note: note });
    saveCart(); renderCart();
    toast(qty + "× " + it.name + " im Warenkorb");
    $$(".cart-count").forEach(function (el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); });
  }
  function saveCart() {
    store.set(CART_KEY, cart.map(function (l) { return { key: l.key, nr: l.nr, name: l.name, v: l.v, sel: l.sel, qty: l.qty, note: l.note }; }));
  }

  function renderCart() {
    var n = count(), sum = subtotal();
    $$("[data-cart-count]").forEach(function (el) { el.textContent = n; if (el.classList.contains("cart-count")) el.hidden = !n; });
    $$("[data-cart-total]").forEach(function (el) { el.textContent = money(sum); });
    $(".cart-fab").hidden = !n;
    $("[data-cart-empty]").hidden = !!cart.length;
    $("[data-cart-body]").hidden = !cart.length;
    $("[data-cart-subtotal]").textContent = money(sum);
    $("[data-cart-lines]").innerHTML = cart.map(function (l, idx) {
      var c = lineCalc(l);
      var sub = [c.variant, c.extras.join(", ")].filter(Boolean).join(" · ");
      return '<li class="cart-line" data-line="' + idx + '"><div class="cart-line-name">' + (l.nr ? "Nr. " + esc(l.nr) + " · " : "") + esc(c.it.name) +
        (sub ? "<small>" + esc(sub) + "</small>" : "") + "<small>" + money(c.unit) + ' pro Stück</small></div><div class="cart-line-price">' + money(c.total) + "</div>" +
        '<div class="cart-line-ctrl"><div class="qty qty-sm"><button type="button" data-l-minus aria-label="Weniger">−</button><output>' + l.qty +
        '</output><button type="button" data-l-plus aria-label="Mehr">+</button></div>' +
        '<input class="cart-line-note" type="text" maxlength="120" placeholder="Hinweis (optional)" value="' + esc(l.note) + '" data-l-note aria-label="Hinweis zu ' + esc(c.it.name) + '">' +
        '<button type="button" class="cart-line-remove" data-l-remove>Entfernen</button></div></li>';
    }).join("");
    updateCheckout();
  }

  $("[data-cart-lines]").addEventListener("click", function (e) {
    var li = e.target.closest("[data-line]"); if (!li) return;
    var l = cart[+li.getAttribute("data-line")];
    if (e.target.closest("[data-l-minus]")) { l.qty -= 1; if (l.qty < 1) cart.splice(cart.indexOf(l), 1); }
    else if (e.target.closest("[data-l-plus]")) { l.qty = Math.min(50, l.qty + 1); }
    else if (e.target.closest("[data-l-remove]")) { cart.splice(cart.indexOf(l), 1); }
    else return;
    saveCart(); renderCart();
  });
  $("[data-cart-lines]").addEventListener("input", function (e) {
    if (!e.target.matches("[data-l-note]")) return;
    var l = cart[+e.target.closest("[data-line]").getAttribute("data-line")];
    l.note = e.target.value; saveCart(); updateCheckout();
  });
  $("[data-cart-clear]").addEventListener("click", function () {
    if (!cart.length) return;
    cart = []; saveCart(); renderCart(); toast("Warenkorb geleert");
  });

  // Formularfelder
  var F = {
    name: $("[data-f-name]"), phone: $("[data-f-phone]"), address: $("[data-f-address]"),
    time: $("[data-f-time]"), note: $("[data-f-note]"), place: $("[data-f-place]")
  };
  if (places.length) {
    var sorted = places.slice().sort(function (a, b) { return a.name.localeCompare(b.name, "de"); });
    F.place.innerHTML = '<option value="">Bitte wählen …</option>' + sorted.map(function (p) {
      var z = zones[p.zone];
      return '<option value="' + esc(p.name) + '">' + esc(p.name) + " (ab " + money(z.minOrder) + ")</option>";
    }).join("") + '<option value="__other">Anderer Ort (auf Anfrage)</option>';
  }
  var savedForm = store.get(FORM_KEY) || {};
  ["name", "phone", "address", "place"].forEach(function (k) { if (savedForm[k]) F[k].value = savedForm[k]; });
  if (savedForm.mode) $$("[data-mode]").forEach(function (r) { r.checked = r.value === savedForm.mode; });
  function mode() { return ($("[data-mode]:checked") || {}).value || "Abholung"; }
  function currentZone() {
    var p = places.filter(function (x) { return x.name === F.place.value; })[0];
    return p ? zones[p.zone] : null;
  }
  function saveForm() {
    store.set(FORM_KEY, { name: F.name.value, phone: F.phone.value, address: F.address.value, place: F.place.value, mode: mode() });
  }

  function updateCheckout() {
    var m = mode(), delivery = m === "Lieferung", sum = subtotal();
    $("[data-address-field]").hidden = !delivery;
    $("[data-place-field]").hidden = !delivery || !places.length;

    var z = delivery ? currentZone() : null;
    var minEl = $("[data-cart-min]"), totalRow = $("[data-cart-total-row]");
    minEl.classList.remove("is-ok");
    if (!delivery) { minEl.hidden = true; totalRow.hidden = true; }
    else if (!places.length) {
      minEl.hidden = false; totalRow.hidden = true;
      minEl.textContent = "Liefergebiet, Mindestbestellwert und Lieferkosten bestätigt Ihnen das Restaurant bei der Rückmeldung.";
    } else if (F.place.value === "__other") {
      minEl.hidden = false; totalRow.hidden = true;
      minEl.textContent = "Lieferung in weitere Orte auf Anfrage – Konditionen bestätigt Ihnen das Restaurant.";
    } else if (!z) {
      minEl.hidden = true; totalRow.hidden = true;
    } else {
      totalRow.hidden = false;
      $("[data-cart-fee]").textContent = money(z.fee);
      $("[data-cart-grand]").textContent = money(sum + z.fee);
      minEl.hidden = false;
      if (sum < z.minOrder) {
        minEl.textContent = "Mindestbestellwert für " + F.place.value + ": " + money(z.minOrder) + " (noch " + money(z.minOrder - sum) +
          "). Wird er nicht erreicht, sprechen Sie uns gerne per Telefon oder WhatsApp an.";
      } else {
        minEl.classList.add("is-ok");
        minEl.textContent = "Mindestbestellwert für " + F.place.value + " (" + money(z.minOrder) + ") erreicht.";
      }
    }

    var s = status(), closedEl = $("[data-cart-closed]");
    closedEl.hidden = s.ordering;
    if (!s.ordering) closedEl.textContent = "Derzeit ist laut Öffnungszeiten keine Bestellannahme (" + s.text + "). Ihre Nachricht wird möglicherweise erst später gelesen.";

    var send = $("[data-wa-send]");
    var missing = !cart.length ? "" : delivery && places.length && !F.place.value ? "Bitte Lieferort wählen"
      : delivery && !F.address.value.trim() ? "Bitte Lieferadresse angeben" : "";
    var ok = cart.length && !missing;
    send.setAttribute("aria-disabled", ok ? "false" : "true");
    send.href = ok ? "https://wa.me/" + R.whatsappNumber + "?text=" + encodeURIComponent(buildMessage()) : "#";
    send.textContent = missing || "Bestellung per WhatsApp vorbereiten";
  }

  function buildMessage() {
    var m = mode(), L = [], sum = subtotal(), z = m === "Lieferung" ? currentZone() : null;
    L.push("Hallo " + R.name + ",");
    L.push("ich möchte folgende Bestellung anfragen (" + m + "):");
    L.push("");
    cart.forEach(function (l) {
      var c = lineCalc(l);
      var title = l.qty + "× " + (l.nr ? "Nr. " + l.nr + " " : "") + c.it.name + (c.variant ? " (" + c.variant + ")" : "");
      L.push("• " + title + " – " + money(c.total));
      if (c.extras.length) L.push("   " + c.extras.join(", "));
      if (l.note && l.note.trim()) L.push("   Hinweis: " + l.note.trim());
    });
    L.push("");
    L.push("Zwischensumme laut Website: " + money(sum));
    if (z) { L.push("Lieferkosten laut Karte: " + money(z.fee)); L.push("Gesamt: " + money(sum + z.fee)); }
    L.push("");
    if (F.name.value.trim()) L.push("Name: " + F.name.value.trim());
    if (F.phone.value.trim()) L.push("Telefon: " + F.phone.value.trim());
    if (m === "Lieferung") {
      if (F.place.value) L.push("Lieferort: " + (F.place.value === "__other" ? "anderer Ort (auf Anfrage)" : F.place.value));
      if (F.address.value.trim()) L.push("Lieferadresse: " + F.address.value.trim());
    }
    if (F.time.value.trim()) L.push("Wunschzeit: " + F.time.value.trim());
    if (F.note.value.trim()) L.push("Anmerkung: " + F.note.value.trim());
    L.push("");
    L.push("Bitte bestätigen Sie mir die Bestellung. Vielen Dank!");
    return L.join("\n");
  }

  ["input", "change"].forEach(function (ev) {
    cartDialog.addEventListener(ev, function (e) {
      if (e.target.matches("[data-f-name],[data-f-phone],[data-f-address],[data-f-time],[data-f-note],[data-f-place],[data-mode]")) {
        saveForm(); updateCheckout();
      }
    });
  });
  $("[data-wa-send]").addEventListener("click", function (e) {
    if (this.getAttribute("aria-disabled") === "true") {
      e.preventDefault();
      if (mode() === "Lieferung") (places.length && !F.place.value ? F.place : F.address).focus();
      return;
    }
    toast("WhatsApp wird geöffnet – bitte Nachricht dort absenden");
  });

  function openCart() { setNav(false); renderCart(); openDialog(cartDialog); }
  $$("[data-open-cart]").forEach(function (b) { b.addEventListener("click", openCart); });

  renderCart();

  /* ---------------- Toast & Sonstiges ---------------- */
  var toastEl = $("[data-toast]"), toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add("is-visible");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("is-visible"); }, 2400);
  }
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
