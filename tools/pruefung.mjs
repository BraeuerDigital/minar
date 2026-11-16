// Erzeugt docs/SPEISEKARTE-MATRIZEN.md (Allergen-, Zusatzstoff- und USt-Matrix) aus menu-data.js
import fs from "node:fs"; import vm from "node:vm";
const src = fs.readFileSync(new URL("../public/assets/js/menu-data.js", import.meta.url), "utf8");
const ctx = { window: {} }; vm.runInNewContext(src, ctx); const D = ctx.window.MINAR_DATA;
const cat = Object.fromEntries(D.categories.map(c => [c.id, c.name]));
const eur = n => n.toFixed(2).replace(".", ",") + " €";
const price = it => Array.isArray(it.prices[0]) ? it.prices.map(p => `${p[0]} ${eur(p[1])}`).join("; ") : eur(it.prices[0]);
const T = D.tax, cls = it => it.tax || T.byName[it.name] || T.byCategory[it.cat] || "speise";
const A = Object.keys(D.legend.allergens), Z = Object.keys(D.legend.additives);
const esc = s => String(s).replace(/\|/g, "\\|");
let out = `# MINAR Küche – Allergen-, Zusatzstoff- und Umsatzsteuer-Matrix\n\nAutomatisch erzeugt aus \`public/assets/js/menu-data.js\` mit \`node tools/pruefung.mjs\`. Nicht von Hand bearbeiten.\n\nLegende: **x** = laut gedruckter Karte gekennzeichnet · **?** = Kennzeichnung fehlt oder unsicher → auf der Website „auf Anfrage“, **nicht** als allergenfrei zu werten.\n\n`;
out += `## 1. Allergene\n\n| Nr. | Gericht | Kategorie | ${A.join(" | ")} | Status |\n|---|---|---|${A.map(() => "---").join("|")}|---|\n`;
const rows = [];
for (const it of D.items) {
  const codes = (it.codes || "").split(",").map(s => s.trim()).filter(Boolean);
  const unk = !codes.length || it.codesCheck;
  out += `| ${it.nr || "–"} | ${esc(it.name)} | ${cat[it.cat]} | ${A.map(a => unk ? "?" : codes.includes(a) ? "x" : "").join(" | ")} | ${it.codesCheck ? "unsicher lesbar – prüfen" : !codes.length ? "keine Angabe – prüfen" : "laut Karte"} |\n`;
  rows.push({ it, codes, unk });
}
out += `\n## 2. Zusatzstoffe\n\n| Nr. | Gericht | ${Z.map(z => z + " " + D.legend.additives[z]).join(" | ")} |\n|---|---|${Z.map(() => "---").join("|")}|\n`;
for (const { it, codes, unk } of rows) out += `| ${it.nr || "–"} | ${esc(it.name)} | ${Z.map(z => unk ? "?" : codes.includes(z) ? "x" : "").join(" | ")} |\n`;
const miss = rows.filter(r => r.unk);
out += `\n**Ohne gesicherte Kennzeichnung (${miss.length}):** ${miss.map(r => (r.it.nr ? "Nr. " + r.it.nr + " " : "") + r.it.name).join(", ")}.\n`;
out += `\n## 3. Umsatzsteuer-Matrix (Stand: UNBESTÄTIGT – nicht live)\n\nRegime: **${T.regime ?? "ungeklärt (Regelbesteuerung oder § 19 UStG)"}** · bestätigt: **${T.confirmed ? "ja" : "nein"}** · Steuerausweis auf Bon/WhatsApp: **${T.confirmed && T.showBreakdown ? "an" : "aus"}**\n\n| Art.-Nr. | Name | Kategorie | Brutto | Lieferando-Steuerinfo | gesetzlich zu prüfender Satz | MINAR-Satz | Quelle | Status | Bestätigung nötig |\n|---|---|---|---|---|---|---|---|---|---|\n`;
const legal = { speise: "7 % (Speisen, seit 01.01.2026 auch vor Ort)", getraenk: "19 %", ayran: "7 % oder 19 % – Milchanteil prüfen", kombi: "Aufteilung Speise 7 % / Getränk 19 %", pfand: "folgt Getränk (19 %)", liefer: "Nebenleistung – Satz prüfen" };
for (const it of D.items) {
  const k = cls(it), c = T.classes[k];
  out += `| ${it.nr || "–"} | ${esc(it.name)} | ${cat[it.cat]} | ${price(it)} | nicht angezeigt | ${legal[k]} | ${c.rate == null ? "offen" : c.rate + " %"} | Annahme Website | ${c.status === "bestaetigt" ? "bestätigt" : "ungeklärt"} | Steuerberater/Inhaber |\n`;
}
out += `| – | Getränkepfand | Nebenposition | 0,25 € je Gebinde | nicht angezeigt | ${legal.pfand} | offen | Annahme Website | ungeklärt | Steuerberater |\n| – | Liefergebühr | Nebenposition | je Ort | nicht angezeigt | ${legal.liefer} | offen | Annahme Website | ungeklärt | Steuerberater |\n`;
fs.writeFileSync(new URL("../docs/SPEISEKARTE-MATRIZEN.md", import.meta.url), out);
console.log("Artikel:", D.items.length, "| ohne Kennzeichnung:", miss.length);
