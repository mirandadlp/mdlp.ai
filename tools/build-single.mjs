// Builds mdlp-portfolio.html: index.html with styles.css and script.js inlined,
// so the whole site can be deployed or opened as one self-contained file.
// Run with: node tools/build-single.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const html = readFileSync(join(root, "index.html"), "utf8");
const css = readFileSync(join(root, "styles.css"), "utf8");
const js = readFileSync(join(root, "script.js"), "utf8");

const LINK = '<link rel="stylesheet" href="styles.css" />';
const SCRIPT = '<script src="script.js"></script>';

for (const [needle, label] of [[LINK, "stylesheet link"], [SCRIPT, "script tag"]]) {
  if (!html.includes(needle)) throw new Error(`index.html is missing the ${label}`);
}

const out = html
  .replace(LINK, `<style>\n${css}\n</style>`)
  .replace(SCRIPT, `<script>\n${js}\n</script>`);

writeFileSync(join(root, "mdlp-portfolio.html"), out);
console.log(`wrote mdlp-portfolio.html (${out.length} bytes)`);
