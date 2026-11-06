#!/usr/bin/env python3
"""
MINAR Küche – animierbares Logo erzeugen
-----------------------------------------
Erzeugt assets/logo/minar-logo-anim.svg (zum Inline-Einbetten auf der Startseite).

Prinzip: Die ORIGINAL-Silhouette der Tierfigur (aus tools/paths.json, vektorisiert aus
assets/logo/logo-referenz.png) wird über Clip-Bereiche in Hinterbein, Körper, Oberarm
und Unterarm zerlegt. Jedes Teil dreht sich um seinen Gelenkpunkt (Kette:
Huf → Hüfte → Schulter → Ellbogen). Bei Winkel 0 ergibt sich exakt die Original-Pose.
Nach der Animation blendet assets/js/logo-anim.js auf die unzerlegte Original-Silhouette
um, damit das Endbild pixelgenau dem statischen Logo entspricht.

Ausführen:  python3 tools/logo_anim.py
"""
import json, re, os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
P = json.load(open(os.path.join(HERE, "paths.json")))

subs = re.findall(r"M[^Z]*Z", P["goat"])
GOAT = subs[3]                 # Tierfigur
GROUND = "".join(subs[:3])     # Bodenreste der Vorlage (bleiben fest)

# Gelenkpunkte (Logo-Koordinaten)
J = {"H": (906, 452), "HIP": (820, 344), "SH": (660, 288), "EL": (588, 288)}
# Gelenkfüllungen – liegen in der Endpose vollständig innerhalb der Silhouette
FILL = {"HIP": ((820, 345), 31), "SH": ((661, 286), 27), "EL": ((588, 288), 13)}
# Clip-Bereiche der Körperteile (mit kleiner Überlappung)
CLIP = {
    "hind": [(735, 356), (790, 330), (842, 336), (872, 352), (965, 352), (965, 470), (735, 470)],
    "body": [(540, 40), (965, 40), (965, 362), (700, 362), (700, 405), (656, 405), (656, 290), (632, 262), (540, 262)],
    "arm":  [(540, 257), (628, 257), (664, 280), (664, 348), (626, 348), (600, 300), (540, 304)],
    "fore": [(540, 286), (606, 286), (656, 406), (540, 406)],
}
INK = "#17120a"
GREEN, RED = "#476a0b", "#a50d14"


def poly(pts):
    return " ".join(f"{x},{y}" for x, y in pts)


def build():
    cx, cy, r = P["cx"], P["cy"], P["rad"]
    clips = "".join(
        f'<clipPath id="mg-c-{k}" clipPathUnits="userSpaceOnUse"><polygon points="{poly(v)}"/></clipPath>'
        for k, v in CLIP.items())
    part = lambda k: f'<use href="#mg-goat" clip-path="url(#mg-c-{k})"/>'
    fill = lambda k: f'<circle class="mg-fill" cx="{FILL[k][0][0]}" cy="{FILL[k][0][1]}" r="{FILL[k][1]}"/>'
    joint = lambda name, j: f'<g data-joint="{name}" data-cx="{J[j][0]}" data-cy="{J[j][1]}">'

    rig = (f'<g class="mg-rig" fill="{INK}" style="display:none">'
           f'{joint("hind", "H")}{part("hind")}{fill("HIP")}'
           f'{joint("body", "HIP")}{part("body")}'
           f'{joint("arm", "SH")}{part("arm")}{fill("EL")}'
           f'{joint("fore", "EL")}{part("fore")}</g>'
           f'</g>{fill("SH")}'
           f'</g></g></g>')

    svg = f'''<svg class="minar-logo-anim" xmlns="http://www.w3.org/2000/svg" viewBox="160 10 1170 900" role="img" aria-label="MINAR Küche – Logo mit Halal-Siegel sowie Halbmond und Stern">
<defs>
  <linearGradient id="mk-sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f86a0a"/><stop offset=".45" stop-color="#f7a24a"/><stop offset=".8" stop-color="#fbdcaa"/><stop offset="1" stop-color="#fcefd8"/></linearGradient>
  <clipPath id="mk-cut"><rect x="0" y="0" width="1600" height="463"/></clipPath>
  <filter id="mk-shadow" x="-5%" y="-5%" width="110%" height="120%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#1c2a00" flood-opacity=".35"/></filter>
  <path id="mg-goat" d="{GOAT}"/>
  {clips}
</defs>
<g clip-path="url(#mk-cut)"><circle cx="{cx}" cy="{cy}" r="{r - 2}" fill="url(#mk-sun)" stroke="#3d5413" stroke-width="5"/></g>
<path fill="{INK}" d="{GROUND}"/>
<use class="mg-static" href="#mg-goat" fill="{INK}"/>
{rig}
<path fill="{RED}" d="{P["lines"]}"/>
<g filter="url(#mk-shadow)"><path fill="{GREEN}" stroke="#fff" stroke-width="7" stroke-linejoin="round" paint-order="stroke" fill-rule="evenodd" d="{P["word"]}"/></g>
<path fill="{RED}" fill-rule="evenodd" d="{P["seal"]}"/>
<path fill="{GREEN}" fill-rule="evenodd" d="{P["moon"]}"/>
</svg>
'''
    out = os.path.join(ROOT, "assets", "logo", "minar-logo-anim.svg")
    open(out, "w").write(svg)
    print("geschrieben:", os.path.relpath(out, ROOT), f"({len(svg) // 1024} KB)")


if __name__ == "__main__":
    build()
