import json
p=json.load(open("paths.json"))
cx,cy,r=p['cx'],p['cy'],p['rad']
GREEN="#476a0b"; RED="#a50d14"; INK="#17120a"
defs=f'''<defs>
  <linearGradient id="mk-sun" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#f86a0a"/><stop offset=".45" stop-color="#f7a24a"/><stop offset=".8" stop-color="#fbdcaa"/><stop offset="1" stop-color="#fcefd8"/>
  </linearGradient>
  <clipPath id="mk-cut"><rect x="0" y="0" width="1600" height="463"/></clipPath>
  <filter id="mk-shadow" x="-5%" y="-5%" width="110%" height="120%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#1c2a00" flood-opacity=".35"/></filter>
</defs>'''
emblem=f'''<g class="mk-emblem">
  <g clip-path="url(#mk-cut)"><circle cx="{cx}" cy="{cy}" r="{r-2}" fill="url(#mk-sun)" stroke="#3d5413" stroke-width="5"/></g>
  <path fill="{INK}" d="{p['goat']}"/>
  <path fill="{RED}" d="{p['lines']}"/>
</g>'''
word=f'''<g class="mk-word" filter="url(#mk-shadow)"><path fill="{GREEN}" stroke="#fff" stroke-width="7" stroke-linejoin="round" paint-order="stroke" fill-rule="evenodd" d="{p['word']}"/></g>'''
seal=f'''<path class="mk-seal" fill="{RED}" fill-rule="evenodd" d="{p['seal']}"/>'''
moon=f'''<path class="mk-moon" fill="{GREEN}" fill-rule="evenodd" d="{p['moon']}"/>'''
def svg(vb,body,title):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="{title}"><title>{title}</title>{defs}{body}</svg>\n'
open('../public/assets/logo/minar-logo.svg','w').write(svg("160 10 1170 900", emblem+word+seal+moon, "MINAR Küche – Logo mit Halal-Siegel"))
open('../public/assets/logo/minar-emblem.svg','w').write(svg(f"{cx-r-6} {cy-r-6} {2*r+12} {463-(cy-r-6)+60}", emblem, "MINAR Küche – Emblem"))
open('../public/assets/logo/minar-wordmark.svg','w').write(svg("200 515 1130 385", word, "MINAR Küche"))
open('../public/assets/logo/halal-siegel.svg','w').write(svg("163 78 298 282", seal, "Halal"))
open('../public/assets/logo/halbmond-stern.svg','w').write(svg("1010 55 200 200", moon, "Halbmond und Stern"))

# Horizontale Kompaktvariante für den Header: Emblem links, Schriftzug rechts
ex, ey = cx - r - 6, cy - r - 6
eh = 523 - ey                     # Emblem inkl. Zierlinien
s = 385 / eh                      # auf Höhe des Schriftzugs skalieren
ew = (2 * r + 12) * s
body = (f'<g transform="translate(0 0) scale({s:.4f}) translate({-ex:.1f} {-ey:.1f})">{emblem}</g>'
        f'<g transform="translate({ew + 40:.1f} 0) translate(-200 -515)">{word}</g>')
open('../public/assets/logo/minar-logo-horizontal.svg', 'w').write(svg(f"0 0 {ew + 40 + 1130:.0f} 385", body, "MINAR Küche"))
