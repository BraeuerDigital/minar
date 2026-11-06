/* =====================================================================
   MINAR Küche – Logo-Animation (Startseite)
   Die Tierfigur steht, geht in die Hocke und richtet sich zum Sprung auf –
   bis exakt in die Original-Pose des Logos. Einmalig, ca. 2,8 s, ohne Schleife.
   Rig-Aufbau: tools/logo_anim.py · Gelenk-Kette: Huf → Hüfte → Schulter → Ellbogen
   Winkel 0 = Original-Pose. Danach Umschalten auf die unzerlegte Original-Silhouette.
   ===================================================================== */
(function () {
  "use strict";
  var svg = document.querySelector(".minar-logo-anim");
  if (!svg) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;   // direkt fertiges Logo
  var rig = svg.querySelector(".mg-rig"), stat = svg.querySelector(".mg-static");
  if (!rig || !stat || !window.requestAnimationFrame) return;

  var J = {};
  Array.prototype.forEach.call(rig.querySelectorAll("[data-joint]"), function (g) {
    J[g.getAttribute("data-joint")] = { el: g, x: g.getAttribute("data-cx"), y: g.getAttribute("data-cy") };
  });

  /* Posen (Grad): stehen → hocken → Original (0) */
  var STAND  = { hind: 16, body: -22, arm: -80, fore: 104 };
  var CROUCH = { hind: 17, body: -28, arm: -47, fore: 57 };
  var DUR = 2800;

  /* Zeitleiste je Gelenk in ms – leicht versetzt für natürlichen Bewegungsfluss
     (Vorderbein löst sich zuerst, Körper folgt, Hinterbein streckt sich zuletzt). */
  var ease = {
    inOut: function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    out:   function (t) { return 1 - Math.pow(1 - t, 4); },            // kräftiger Abstoß, ruhiges Ankommen, kein Überschwingen
    sine:  function (t) { return -(Math.cos(Math.PI * t) - 1) / 2; }
  };
  function track(name, launchStart, launchEnd) {
    return [
      { t: 0,    v: STAND[name] },
      { t: 380,  v: STAND[name],  e: "sine" },                          // ruhig stehen
      { t: 1080, v: CROUCH[name], e: "inOut" },                         // Oberkörper senken, Beine beugen
      { t: launchStart, v: CROUCH[name], e: "sine" },                   // kurzer Moment der Spannung
      { t: launchEnd, v: 0, e: "out" }                                  // Absprung bis in die Original-Pose
    ];
  }
  var TL = {
    fore: track("fore", 1180, 2450),
    arm:  track("arm",  1200, 2550),
    body: track("body", 1240, 2700),
    hind: track("hind", 1280, DUR)
  };
  function valueAt(tr, t) {
    if (t <= tr[0].t) return tr[0].v;
    for (var i = 1; i < tr.length; i++) {
      var a = tr[i - 1], b = tr[i];
      if (t <= b.t) { var p = (t - a.t) / Math.max(1, b.t - a.t); return a.v + (b.v - a.v) * ease[b.e](p); }
    }
    return tr[tr.length - 1].v;
  }
  function apply(t) {
    for (var k in TL) { var j = J[k]; if (j) j.el.setAttribute("transform", "rotate(" + valueAt(TL[k], t).toFixed(3) + " " + j.x + " " + j.y + ")"); }
  }

  // Startpose sofort setzen (vor dem ersten Zeichnen) – kein sichtbarer Sprung
  apply(0);
  rig.style.display = "";
  stat.style.display = "none";

  var t0 = null;
  function frame(now) {
    if (t0 === null) t0 = now;
    var t = now - t0;
    if (t >= DUR) {
      apply(DUR);
      stat.style.display = "";                 // pixelgenaue Original-Silhouette
      rig.style.display = "none";
      svg.classList.add("is-done");
      return;
    }
    apply(t);
    requestAnimationFrame(frame);
  }
  // Start nach dem ersten Rendern, blockiert nichts
  requestAnimationFrame(function () { requestAnimationFrame(frame); });
})();
