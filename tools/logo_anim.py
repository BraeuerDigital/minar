#!/usr/bin/env python3
"""
MINAR Küche – animierbares Logo erzeugen
=========================================
Ausgabe: assets/logo/minar-logo-anim.svg  (wird von tools/build.mjs inline in die Startseite gesetzt)

Aufbau (jede Ebene einzeln animierbar, IDs/Klassen mit Präfix „lg-“):
  lg-sun      Sonnen-Emblem (Kreis mit Verlauf und grünem Rand)
  lg-goat     Tierfigur: .mg-static (Original-Silhouette) + .mg-rig (Gelenk-Rig)
  lg-lines    rote Zierlinien
  lg-seal     Halal-Siegel
  lg-moon     Halbmond mit Stern
  lg-minar    Schriftzug „MINAR“, je Buchstabe ein <g class="lg-letter">
  lg-kueche   Schriftzug „Küche“
  lg-tagline  Unterzeile „RESTAURANT • LIEFERSERVICE • ABHOLUNG“

Alle Formen stammen aus der Logovorlage assets/logo/logo-referenz.png (vektorisiert,
siehe tools/trace.py → tools/paths.json). Nichts ist neu gezeichnet.

Gelenk-Rig der Tierfigur (zwei Vorderläufe):
  Die Original-Silhouette wird per Clip-Bereich in Hinterbein, Körper, Oberarm und
  Unterarm geteilt. Kette: Huf (H) → Hüfte (HIP) → Schulter (SH) → Ellbogen (EL).
  Winkel 0 an allen Gelenken = exakte Original-Pose. Gelenkfüllungen (Kreise) schließen
  Fugen während der Bewegung und liegen in der Endpose vollständig in der Silhouette.
  Nach der Animation schaltet assets/js/logo-anim.js auf die unzerlegte Silhouette um.

Ausführen:  python3 tools/logo_anim.py
"""
import json, re, os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
P = json.load(open(os.path.join(HERE, "paths.json")))

subs = re.findall(r"M[^Z]*Z", P["goat"])
GOAT = subs[3]                 # Tierfigur
GROUND = "".join(subs[:3])     # dunkle Reste am Kreisrand (gehören zum Emblem, bleiben fest)

J = {"H": (906, 452), "HIP": (820, 344), "SH": (660, 288), "EL": (588, 288)}
FILL = {"HIP": ((820, 345), 31), "SH": ((661, 286), 27), "EL": ((588, 288), 13)}
CLIP = {
    "hind": [(735, 356), (790, 330), (842, 336), (872, 352), (965, 352), (965, 470), (735, 470)],
    "body": [(540, 40), (965, 40), (965, 362), (700, 362), (700, 405), (656, 405), (656, 290), (632, 262), (540, 262)],
    "arm":  [(540, 257), (628, 257), (664, 280), (664, 348), (626, 348), (600, 300), (540, 304)],
    "fore": [(540, 286), (606, 286), (656, 406), (540, 406)],
}
INK, GREEN, RED = "#17120a", "#476a0b", "#a50d14"
FAR_INK = "#3a3024"        # entfernter Vorderlauf: minimal heller für räumliche Tiefe
FAR_OFFSET = (16, 6)       # Versatz des entfernten Laufs (nach hinten/unten)


def poly(pts):
    return " ".join(f"{x},{y}" for x, y in pts)


def build():
    cx, cy, r = P["cx"], P["cy"], P["rad"]
    clips = "".join(f'<clipPath id="mg-c-{k}" clipPathUnits="userSpaceOnUse"><polygon points="{poly(v)}"/></clipPath>'
                    for k, v in CLIP.items())
    part = lambda k: f'<use href="#mg-goat" clip-path="url(#mg-c-{k})"/>'
    fill = lambda k: f'<circle cx="{FILL[k][0][0]}" cy="{FILL[k][0][1]}" r="{FILL[k][1]}"/>'
    joint = lambda name, j: f'<g data-joint="{name}" data-cx="{J[j][0]}" data-cy="{J[j][1]}">'

    # Hinterer (entfernter) Vorderlauf: gleiche Originalformen wie der vordere Lauf,
    # leicht nach hinten versetzt und HINTER dem Körper gezeichnet. In der Endpose
    # liegt er hinter dem vorderen Lauf und wird ausgeblendet.
    far = (f'<g class="mg-far" fill="{FAR_INK}" transform="translate({FAR_OFFSET[0]} {FAR_OFFSET[1]})">'
           f'{joint("armB", "SH")}{part("arm")}{fill("EL")}'
           f'{joint("foreB", "EL")}{part("fore")}</g></g></g>')
    rig = (f'<g class="mg-rig" style="display:none">'
           f'{joint("hind", "H")}{part("hind")}{fill("HIP")}'
           f'{joint("body", "HIP")}{far}{part("body")}'
           f'{joint("arm", "SH")}{part("arm")}{fill("EL")}'
           f'{joint("fore", "EL")}{part("fore")}</g>'
           f'</g>{fill("SH")}'
           f'</g></g></g>')

    letters = "".join(f'<g class="lg-letter" data-letter="{n}"><path d="{d}"/></g>' for n, d in P["word_letters"])
    word_style = f'fill="{GREEN}" stroke="#fff" stroke-width="7" stroke-linejoin="round" paint-order="stroke" fill-rule="evenodd"'

    svg = f'''<svg class="minar-logo-anim" xmlns="http://www.w3.org/2000/svg" viewBox="80 10 1380 1000" role="img" aria-label="MINAR Küche – Logo mit Halal-Siegel, Halbmond und Stern">
<defs>
  <linearGradient id="mk-sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f86a0a"/><stop offset=".45" stop-color="#f7a24a"/><stop offset=".8" stop-color="#fbdcaa"/><stop offset="1" stop-color="#fcefd8"/></linearGradient>
  <clipPath id="mk-cut"><rect x="0" y="0" width="1600" height="463"/></clipPath>
  <filter id="mk-shadow" x="-5%" y="-5%" width="110%" height="120%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#1c2a00" flood-opacity=".35"/></filter>
  <path id="mg-goat" d="{GOAT}"/>
  {clips}
</defs>
<g class="lg-sun"><g clip-path="url(#mk-cut)"><circle cx="{cx}" cy="{cy}" r="{r - 2}" fill="url(#mk-sun)" stroke="#3d5413" stroke-width="5"/></g><path fill="{INK}" d="{GROUND}"/></g>
<g class="lg-goat" fill="{INK}"><use class="mg-static" href="#mg-goat"/>{rig}</g>
<g class="lg-lines"><path fill="{RED}" d="{P["lines"]}"/></g>
<g class="lg-seal"><path fill="{RED}" fill-rule="evenodd" d="{P["seal"]}"/></g>
<g class="lg-moon"><path fill="{GREEN}" fill-rule="evenodd" d="{P["moon"]}"/></g>
<g class="lg-minar" filter="url(#mk-shadow)" {word_style}>{letters}</g>
<g class="lg-kueche" filter="url(#mk-shadow)" {word_style}><path d="{P["word_kueche"]}"/></g>
<g class="lg-tagline"><path fill="{RED}" d="{P["tagline"]}"/></g>
</svg>
'''
    out = os.path.join(ROOT, "assets", "logo", "minar-logo-anim.svg")
    open(out, "w").write(svg)
    print("geschrieben:", os.path.relpath(out, ROOT), f"({len(svg) // 1024} KB)")


if __name__ == "__main__":
    build()
