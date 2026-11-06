/* =====================================================================
   MINAR Küche – Logo-Intro (Startseite)
   ---------------------------------------------------------------------
   Phase A  Logo-Aufbau       0,0 – 2,2 s  Sonne → Linien → Siegel → Halbmond
                                           → MINAR (Buchstaben gestaffelt) → Küche
                                           → Unterzeile; Tier erscheint im Stand
   Phase B  Ruhiger Stand     2,2 – 2,8 s  auf allen vier Beinen, minimale Atmung
   Phase C  Aufbäumen         2,8 – 4,35 s Gewicht auf die Hinterhand, Oberkörper hebt sich,
                                           beide Vorderläufe strampeln abwechselnd (3×, gegenphasig)
   Phase D  Sprung            4,35 – 5,5 s kurz sammeln, kraftvoller Abdruck, Aufrichten in die Logo-Pose
   Phase E  Endpose           ab 5,5 s     exakt Original-Logo, danach völlig still

   Technik: Vanilla JS + SVG, ein requestAnimationFrame-Loop, keine Bibliothek.
   Rig: tools/logo_anim.py (Original-Silhouette, Gelenkkette Huf → Hüfte → Schulter → Ellbogen, zwei Vorderläufe,
   Winkel 0 = Original-Pose). Am Ende Umschalten auf die unzerlegte Original-Silhouette.
   Läuft bei jedem Aufruf/Neuladen von vorne. Fallback: prefers-reduced-motion → sofort statisch.
   ===================================================================== */
(function () {
  "use strict";
  var svg = document.querySelector(".minar-logo-anim");
  if (!svg || !window.requestAnimationFrame) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;                                           // statisches Logo bleibt stehen

  var $ = function (s) { return svg.querySelector(s); };
  var rig = $(".mg-rig"), stat = $(".mg-static");
  if (!rig || !stat) return;

  /* ---------------- Easing ---------------- */
  var E = {
    lin:   function (t) { return t; },
    sine:  function (t) { return -(Math.cos(Math.PI * t) - 1) / 2; },
    inOut: function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    out:   function (t) { return 1 - Math.pow(1 - t, 3); },
    out4:  function (t) { return 1 - Math.pow(1 - t, 4); },       // kraftvoller Start, weiches Ankommen, kein Überschwingen
    in2:   function (t) { return t * t; }
  };
  // Spur: [[t, wert, easing-zum-wert], …] – Wert zwischen Stützpunkten interpoliert
  function at(track, t) {
    if (t <= track[0][0]) return track[0][1];
    for (var i = 1; i < track.length; i++) {
      var a = track[i - 1], b = track[i];
      if (t <= b[0]) return a[1] + (b[1] - a[1]) * E[b[2] || "inOut"]((t - a[0]) / Math.max(1, b[0] - a[0]));
    }
    return track[track.length - 1][1];
  }
  var clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };

  /* ---------------- Phase A: Logo-Aufbau ---------------- */
  // Jedes Element: Start, Dauer, Art des Auftritts
  function box(el) { var b = el.getBBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }
  var build = [];
  function reveal(el, start, dur, kind) { if (el) build.push({ el: el, s: start, d: dur, k: kind, c: box(el) }); }
  reveal($(".lg-sun"), 0, 800, "grow");
  reveal($(".lg-lines"), 450, 650, "draw");
  reveal($(".lg-seal"), 800, 600, "rise");
  reveal($(".lg-moon"), 950, 600, "rise");
  Array.prototype.forEach.call(svg.querySelectorAll(".lg-letter"), function (el, i) { reveal(el, 1150 + i * 75, 560, "lift"); });
  reveal($(".lg-kueche"), 1650, 560, "lift");
  reveal($(".lg-tagline"), 1900, 520, "rise");
  var goatG = $(".lg-goat");
  var GOAT_IN = [1250, 650];                                     // Tier erscheint (bereits im Stand)

  function applyBuild(t) {
    for (var i = 0; i < build.length; i++) {
      var b = build[i], p = clamp01((t - b.s) / b.d), e = E.out(p), tr = "";
      if (b.k === "grow") tr = "translate(" + b.c.x + " " + b.c.y + ") scale(" + (0.9 + 0.1 * e) + ") translate(" + -b.c.x + " " + -b.c.y + ")";
      else if (b.k === "draw") tr = "translate(" + b.c.x + " 0) scale(" + Math.max(0.001, e) + " 1) translate(" + -b.c.x + " 0)";
      else if (b.k === "rise") tr = "translate(0 " + (10 * (1 - e)) + ")";
      else if (b.k === "lift") tr = "translate(0 " + (26 * (1 - e)) + ")";
      b.el.setAttribute("opacity", b.k === "draw" ? Math.min(1, p * 3) : e);
      if (p >= 1) b.el.removeAttribute("transform"); else b.el.setAttribute("transform", tr);
    }
    goatG.setAttribute("opacity", E.out(clamp01((t - GOAT_IN[0]) / GOAT_IN[1])));
  }

  /* ---------------- Tier: Posen & Spuren (Grad) ---------------- */
  var J = {};
  Array.prototype.forEach.call(rig.querySelectorAll("[data-joint]"), function (g) {
    J[g.getAttribute("data-joint")] = { el: g, x: g.getAttribute("data-cx"), y: g.getAttribute("data-cy") };
  });
  /* Posen (Grad, relativ zum übergeordneten Gelenk; 0 = Original-Logo)
     vorne = sichtbarer Vorderlauf (arm/fore), hinten = entfernter Vorderlauf (armB/foreB) */
  var S  = { hind: 16, body: -22, arm: -80, fore: 104, armB: -74, foreB: 98 };   // Stand auf allen vier Beinen
  var RE = { hind: 13, body: -9 };                                                // aufgebäumt: Gewicht auf der Hinterhand
  var UP = { arm: -36, fore: 42 },  DN = { arm: -68, fore: 114 };                 // vorne: Knie hoch / Lauf vorgestreckt
  var UPb = { armB: -32, foreB: 40 }, DNb = { armB: -66, foreB: 110 };            // hinten: gleiche Bewegung, gegenphasig
  var G  = { hind: 17, body: -13, arm: -30, fore: 40, armB: -20, foreB: 45 };    // sammeln vor dem Abdruck
  var FAR_END = { armB: 10, foreB: 10 };                                          // entfernter Lauf hinter dem vorderen eingeklappt

  var T = {
    // Hinterhand: Gewicht übernehmen, beim Sammeln laden, kraftvoll strecken
    hind: [[0, S.hind], [2800, S.hind], [3350, RE.hind, "inOut"], [4350, RE.hind, "lin"],
           [4600, G.hind, "inOut"], [5500, 0, "out4"]],
    // Rumpf: atmen, aufrichten, beim Strampeln ruhig halten (kein Galopp), kurz absenken, Sprung
    body: [[0, S.body], [2250, S.body], [2550, S.body + 0.8, "sine"], [2800, S.body, "sine"],
           [3350, RE.body, "inOut"], [3850, RE.body - 0.8, "sine"], [4350, RE.body, "sine"],
           [4600, G.body, "inOut"], [5400, 0, "out4"]],
    // Vorderer Lauf: abheben, drei Strampler (Knie hoch → vorstrecken), einziehen, Endpose
    arm:  [[0, S.arm], [2800, S.arm], [3350, UP.arm, "inOut"],
           [3600, DN.arm], [3850, UP.arm], [4100, DN.arm], [4350, UP.arm],
           [4600, G.arm, "inOut"], [5250, 0, "out4"]],
    fore: [[0, S.fore], [2800, S.fore], [3350, UP.fore, "inOut"],
           [3600, DN.fore], [3850, UP.fore], [4100, DN.fore], [4350, UP.fore],
           [4600, G.fore, "inOut"], [5180, 0, "out4"]],
    // Hinterer Lauf: hebt etwas später ab und strampelt gegenphasig
    armB: [[0, S.armB], [2880, S.armB], [3420, DNb.armB, "inOut"],
           [3725, UPb.armB], [3975, DNb.armB], [4225, UPb.armB], [4400, DNb.armB + 10],
           [4600, G.armB, "inOut"], [5200, FAR_END.armB, "out4"]],
    foreB: [[0, S.foreB], [2880, S.foreB], [3420, DNb.foreB, "inOut"],
           [3725, UPb.foreB], [3975, DNb.foreB], [4225, UPb.foreB], [4400, DNb.foreB - 20],
           [4600, G.foreB, "inOut"], [5200, FAR_END.foreB, "out4"]]
  };
  var END = 5500;
  var farEl = svg.querySelector(".mg-far");
  var FAR_FADE = [5050, 5450];                                                    // entfernten Lauf ausblenden, sobald verdeckt

  function applyRig(t) {
    for (var k in T) {
      var j = J[k]; if (!j) continue;
      j.el.setAttribute("transform", "rotate(" + at(T[k], t).toFixed(3) + " " + j.x + " " + j.y + ")");
    }
    if (farEl) farEl.setAttribute("opacity", (1 - E.sine(clamp01((t - FAR_FADE[0]) / (FAR_FADE[1] - FAR_FADE[0])))).toFixed(3));
  }

  /* ---------------- Start ---------------- */
  // Ausgangszustand sofort setzen (Skript steht direkt hinter dem SVG → vor dem ersten Zeichnen)
  rig.style.display = ""; stat.style.display = "none";
  applyBuild(0); applyRig(0);
  svg.classList.add("is-intro");

  var t0 = null;
  function frame(now) {
    if (t0 === null) t0 = now;
    var t = now - t0;
    applyBuild(t);
    applyRig(Math.min(t, END));
    if (t < END) { requestAnimationFrame(frame); return; }
    // Phase E: Original-Silhouette, alle Hilfstransformationen entfernen → völlig still
    stat.style.display = ""; rig.style.display = "none";
    build.forEach(function (b) { b.el.removeAttribute("transform"); b.el.removeAttribute("opacity"); });
    goatG.removeAttribute("opacity");
    svg.classList.remove("is-intro"); svg.classList.add("is-done");
  }
  function go() { requestAnimationFrame(function () { requestAnimationFrame(frame); }); }
  // erst starten, wenn die Seite sichtbar ist („erster sichtbarer Aufruf“)
  if (document.visibilityState === "hidden") {
    document.addEventListener("visibilitychange", function onVis() {
      if (document.visibilityState !== "hidden") { document.removeEventListener("visibilitychange", onVis); go(); }
    });
  } else go();
})();
