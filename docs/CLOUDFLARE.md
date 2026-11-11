# Cloudflare Pages – Einrichtung und Betrieb

Anleitung für **MINAR Küche** und Vorlage für weitere statische Kundenwebsites von Bräuer.Digital.
Architektur: GitHub = Codeverwaltung · Cloudflare Pages = Hosting · Namecheap = Domainregistrar (später).
Keine Datenbank, kein Server, keine Workers, keine Pages Functions.

> **Grundregeln:** Keine Passwörter oder Zugangsdaten in Chats, Tickets oder im Repository.
> Keine DNS-Änderungen und keine Domain ohne ausdrückliche Freigabe. Erst committen und testen, dann verbinden –
> jeder Push auf `main` löst nach der Verbindung ein Deployment aus.

## 1. Projektstruktur (Voraussetzung)

```text
public/              ← wird veröffentlicht (Output-Verzeichnis)
  index.html, *.html, speisekarte/, assets/
  404.html           ← Cloudflare zeigt sie bei unbekannten Pfaden (mit Status 404)
  _headers           ← Sicherheits- und Cache-Header
  robots.txt         ← derzeit „Disallow: /“ (Vorabversion)
tools/  docs/  README.md  PRUEFLISTE.md   ← nicht öffentlich
index.html (Stamm)   ← nur Übergangsweiterleitung für GitHub Pages, wird von Cloudflare nicht ausgeliefert
```

Alle Pfade innerhalb von `public/` sind relativ (`assets/…`, `../assets/…`) und funktionieren sowohl am Domain-Stamm (`*.pages.dev`, eigene Domain) als auch in Unterordnern. Ausnahme: `404.html` nutzt absolute Pfade (`/assets/…`), weil Cloudflare sie unter beliebigen URLs ausliefert. Es gibt keine fest codierten `github.io/minar/`-Pfade.

## 2. Cloudflare-Pages-Projekt anlegen (einmalig, im Browser)

Voraussetzung: Cloudflare-Konto (kostenloser Tarif genügt) – idealerweise auf den Inhaber oder ein Agenturkonto mit späterer Übertragung; Zugriff auf das GitHub-Repository `BraeuerDigital/minar`.

1. dash.cloudflare.com → **Workers & Pages** → **Create** → Reiter **Pages** → **Connect to Git**.
2. GitHub-Konto verbinden und der Cloudflare-GitHub-App **nur** Zugriff auf `BraeuerDigital/minar` geben („Only select repositories“).
3. Repository `minar` wählen → **Begin setup**.
4. Einstellungen:

   | Feld | Wert |
   |------|------|
   | Project name | `minar-kueche` → Adresse `https://minar-kueche.pages.dev` |
   | Production branch | `main` |
   | Framework preset | `None` |
   | Build command | leer lassen (oder `exit 0`) |
   | Build output directory | `public` |
   | Root directory (advanced) | leer (= Repository-Stamm) |
   | Environment variables | keine |

5. **Save and Deploy**. Das erste Deployment dauert etwa eine Minute.
6. Unter **Settings → Builds & deployments → Preview deployments** auf „None“ oder nur bestimmte Branches stellen, damit nicht jeder Branch (z. B. `multipage`, `sicherung/…`) eine eigene öffentliche Vorschau erzeugt.
7. **Web Analytics nicht aktivieren** – die Datenschutzerklärung geht davon aus, dass keine Analyse stattfindet.

## 3. Nach dem ersten Deployment prüfen

- [ ] `https://minar-kueche.pages.dev/` lädt mit Logo-Intro, Startseite ohne Konsolenfehler.
- [ ] Alle Hauptseiten, Speisekarte und mindestens drei Kategorieseiten; Bilder und Logos laden.
- [ ] `https://minar-kueche.pages.dev/gibt-es-nicht` zeigt die MINAR-404-Seite mit Status 404.
- [ ] Antwort-Header (Browser → Entwicklertools → Netzwerk): `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Robots-Tag: noindex, nofollow`.
- [ ] `https://minar-kueche.pages.dev/PRUEFLISTE.md` und `/tools/build.mjs` liefern **404** (nicht öffentlich).
- [ ] Warenkorb → Bestellübersicht → „Per WhatsApp senden“ öffnet WhatsApp mit der Nachricht. **Nicht an das Restaurant absenden** – Testnachrichten nur mit Freigabe.
- [ ] Mobil (Smartphone) einmal komplett durchklicken.

Lokal lässt sich dieselbe Auslieferung (Stammverzeichnis `public/`, `_headers`, 404) mit jedem statischen Server nachstellen, z. B. `cd public && python3 -m http.server 8000`.

## 4. Sicherheit und Cache (`public/_headers`)

- Sicherheitsheader für alle Pfade: `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, `HSTS` (1 Jahr, ohne `preload`), strikte `Content-Security-Policy` (nur eigene Dateien; Inline-Stile erlaubt, weil das Logo-SVG sie nutzt; kein Inline-Skript).
- `X-Robots-Tag: noindex, nofollow` solange die Seite nicht freigegeben ist.
- Cache: HTML immer revalidieren; CSS/JS 1 Stunde (zusätzlich `?v=`-Versionierung durch `tools/build.mjs`); Bilder/Logos 7 Tage.
- HTTPS erzwingt Cloudflare automatisch (unter **SSL/TLS** für eigene Domains „Always Use HTTPS“ aktiv lassen).
- Weiterleitungen (`_redirects`) sind derzeit nicht nötig.

## 5. Eigene Domain (erst nach Freigabe)

Die Domain wird bei **Namecheap** registriert. Noch nicht eingerichtet – nichts davon ohne Freigabe ausführen.

1. Domain bei Namecheap registrieren (Inhaber: Restaurant).
2. Variante A (empfohlen): Domain in Cloudflare als Website hinzufügen (Free-Plan) → Cloudflare nennt zwei Nameserver → bei Namecheap unter *Domain List → Manage → Nameservers → Custom DNS* eintragen. DNS liegt dann bei Cloudflare, Namecheap bleibt nur Registrar.
   Variante B: DNS bei Namecheap lassen und einen `CNAME` für `www` auf `minar-kueche.pages.dev` setzen (Apex-Domain nur mit Variante A sauber möglich).
3. Cloudflare → Pages-Projekt → **Custom domains** → Domain(s) hinzufügen (`www.…` und Stammdomain); SSL-Zertifikat wird automatisch ausgestellt.
4. Weiterleitung Stammdomain ↔ `www` festlegen (Cloudflare Redirect Rule).
5. Danach: Datenschutzerklärung um Namecheap (Registrar) und ggf. Cloudflare-DNS ergänzen, Domain in `README.md` eintragen.
6. Erst zum Livegang: `noindex` entfernen (`tools/build.mjs`, `public/_headers`, `public/robots.txt`), Sitemap ergänzen, neu bauen, pushen.

## 6. GitHub Pages abschalten (nach erfolgreicher Migration)

GitHub Pages veröffentlicht derzeit noch `https://braeuerdigital.github.io/minar/` (Repo-Stamm → Weiterleitung auf `public/index.html`). Damit es keine zweite öffentliche Version gibt:

1. GitHub → Repository `minar` → **Settings → Pages** → Source **None** bzw. **Unpublish site**.
2. Die Weiterleitungsdatei `index.html` und `.nojekyll` im Repo-Stamm können danach gelöscht werden.
3. Das Repository selbst bleibt bestehen (Codeverwaltung, Historie, Sicherungszweige).

## 7. Arbeitsablauf für Änderungen

1. Inhalte ändern (`public/assets/js/menu-data.js`) bzw. Vorlagen (`tools/build.mjs`) → `node tools/build.mjs`.
2. Lokal testen.
3. Commit und Push auf `main` → Cloudflare veröffentlicht automatisch (Rollback bei Bedarf unter *Deployments → … → Rollback*).

## 8. Als Vorlage für weitere Kundenprojekte

Übernehmen: Ordner `public/` als Output, `_headers` (CSP an eingebundene Dienste anpassen), `404.html`, `robots.txt`, diese Anleitung. Pro Kunde anpassen: Projektname, Branch, Domain, Datenschutzerklärung (Hoster Cloudflare, Registrar, eingesetzte Dienste), Kontoinhaberschaft bei Cloudflare.
