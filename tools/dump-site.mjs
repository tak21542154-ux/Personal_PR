// 사이트 데이터를 합쳐 JSON 으로 내보낸다(단일 HTML 만들기 등 다른 도구가 읽는다).
// 사용: node tools/dump-site.mjs > _s/site.json   (저장소 루트에서)
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, "assets/js/data.js"), "utf8"), ctx);
const wd = path.join(root, "assets/js/works");
fs.readdirSync(wd).filter((f) => f.endsWith(".js")).sort((a, b) => (a === "_core.js" ? -1 : b === "_core.js" ? 1 : a.localeCompare(b)))
  .forEach((f) => vm.runInContext(fs.readFileSync(path.join(wd, f), "utf8"), ctx, { filename: f }));
const S = ctx.SITE;
const parentOf = {};
Object.entries(S.groups || {}).forEach(([p, ks]) => ks.forEach((k) => (parentOf[k] = p)));
const out = {
  name: S.name, en: S.en, hero: S.hero, heroSub: S.heroSub, intro: S.intro, contact: S.contact,
  categories: S.categories, kidGroups: S.kidGroups || {}, groups: S.groups || {},
  evidence: S.evidence || {}, evidenceKinds: S.evidenceKinds || [],
  works: S.works.map((w) => ({
    id: w.id, cat: w.cat, parent: parentOf[w.id] || null, name: w.name, en: w.en, line: w.line, status: w.status, type: w.type, stack: w.stack, period: w.period,
    tags: w.tags || [], why: w.why || (w.body ? w.body.slice(0, 1) : []), how: w.how || (w.body ? w.body.slice(1) : []), parts: w.parts || [],
    features: w.features || [], timeline: w.timeline || [], links: w.links || [], url: w.url || "", img: w.img || "", shots: (w.shots || []).length
  }))
};
process.stdout.write(JSON.stringify(out));
