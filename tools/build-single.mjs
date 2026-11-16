// Builds the self-contained, deployable pages: each source page with
// styles.css and script.js inlined, so it can be uploaded or opened alone.
//   index.html        -> mdlp-portfolio.html  (deploy as index.html)
//   case-studies.html -> mdlp-case-studies.html (deploy as case-studies.html)
// Run with: node tools/build-single.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const css = readFileSync(join(root, "styles.css"), "utf8");
const js = readFileSync(join(root, "script.js"), "utf8");

const LINK = '<link rel="stylesheet" href="styles.css" />';
const SCRIPT = '<script src="script.js"></script>';

const PAGES = [
  ["index.html", "mdlp-portfolio.html"],
  ["case-studies.html", "mdlp-case-studies.html"],
];

for (const [src, dest] of PAGES) {
  const html = readFileSync(join(root, src), "utf8");
  for (const [needle, label] of [[LINK, "stylesheet link"], [SCRIPT, "script tag"]]) {
    if (!html.includes(needle)) throw new Error(`${src} is missing the ${label}`);
  }
  // Function replacers, so "$" sequences in the CSS/JS are inserted literally.
  const out = html
    .replace(LINK, () => `<style>\n${css}\n</style>`)
    .replace(SCRIPT, () => `<script>\n${js}\n</script>`);
  writeFileSync(join(root, dest), out);
  console.log(`wrote ${dest} (${out.length} bytes)`);
}
