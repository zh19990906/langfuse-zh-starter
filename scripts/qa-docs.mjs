#!/usr/bin/env node
/**
 * Local VitePress docs structural audit; read-only, never deploys.
 * Run: npm run qa:docs
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve("docs");
const failures = [];
const warnings = [];
const visited = [];
const all = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (![".vitepress", "node_modules", "dist"].includes(e.name)) walk(p);
    } else if (/\.md$/.test(e.name)) all.push(p);
  }
}
walk(root);
const existsRoute = (route) => {
  let val = decodeURIComponent(route.split(/[?#]/)[0]).replace(/\/$/, "");
  if (val === "") val = "/";
  const relative = val === "/" ? "index" : val.replace(/^\//, "");
  return [path.join(root, relative + ".md"), path.join(root, relative, "index.md")].some(fs.existsSync);
};
const normalizeRoute = (href, file) => {
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  if (href.startsWith("#") || /^(?:https?:|mailto:|tel:|data:|\/\/)/i.test(href)) return null;
  const rel = path.relative(root, path.resolve(path.dirname(file), href.split(/[?#]/)[0]));
  return "/" + rel.replace(/\.md$/, "").replace(/\\/g, "/");
};
function linksFrom(text) {
  return [...text.matchAll(/!?\[[^\]]*\]\((<?[^)\s>]+>?)(?:\s+["'][^"']+["'])?\)/g)].map(m => m[1].replace(/^<|>$/g, ""));
}
const sourceTexts = new Map();
for (const file of all) {
  const raw = fs.readFileSync(file, "utf8");
  sourceTexts.set(file, raw);
  const rel = path.relative(root, file);
  if (rel.startsWith("official" + path.sep)) visited.push(rel);
  const fences = raw.split("\n").filter(x => /^\s*```/.test(x));
  if (fences.length % 2 !== 0) failures.push(`${rel}: unbalanced code fences (${fences.length})`);
  const withoutCode = raw.replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, "");
  for (const href of linksFrom(withoutCode)) {
    const route = normalizeRoute(href, file);
    if (!route) continue;
    if (route.startsWith("/public/") || route.startsWith("/images/")) continue;
    if (!existsRoute(route)) {
      failures.push(`${rel}: missing page for ${href}`);
    } else if (href.includes("#")) {
      // Explicit IDs and heading-slug rules may differ across VitePress versions:
      // flag for manual review, don't wrongly fail a build.
      const [target, frag] = route.split("#");
      const slug = frag?.split("?")[0];
      if (slug) {
        const dest = target === "/" ? "index" : target.replace(/^\//, "");
        const destFile = [path.join(root, dest + ".md"), path.join(root, dest, "index.md")].find(fs.existsSync);
        if (destFile) {
          const targetText = sourceTexts.get(destFile) ?? fs.readFileSync(destFile, "utf8");
          const slugs = [...targetText.matchAll(/^#{1,6}\s+(.+)$/gm)].map(m =>
            m[1].replace(/\s*\[#([^\]]+)\]\s*$/, "").replace(/\s*#+\s*$/, "")
              .toLowerCase().replace(/[^\p{L}\p{N} _-]/gu, "").trim().replace(/\s+/g, "-")
          );
          const explicit = targetText.includes(`id="${slug}"`) || targetText.includes(`id='${slug}'`);
          if (!slugs.includes(decodeURIComponent(slug)) && !explicit) {
            warnings.push(`${rel}: anchor needs review ${href}`);
          }
        }
      }
    }
  }
}
const config = fs.readFileSync(path.join(root, ".vitepress/config.mts"), "utf8");
for (const m of config.matchAll(/link:\s*['"]([^'"]+)['"]/g)) {
  if (m[1].startsWith("/") && !existsRoute(m[1])) failures.push(`config.mts: missing nav/sidebar page ${m[1]}`);
}
console.log(`Audited ${visited.length} official pages (${all.length} Markdown pages total).`);
console.log(`Errors: ${failures.length}; manual anchor warnings: ${warnings.length}`);
for (const x of failures.slice(0, 200)) console.error("ERROR", x);
for (const x of warnings.slice(0, 30)) console.warn("WARN", x);
if (failures.length) process.exitCode = 1;
