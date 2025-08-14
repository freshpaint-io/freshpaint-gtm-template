import fs from "node:fs/promises";
import path from "node:path";

// Sections to include in order in the final .tpl file
const SECTIONS = [
  ["___TERMS_OF_SERVICE___",              "terms.txt"],
  ["___INFO___",                          "metadata.json"],
  ["___TEMPLATE_PARAMETERS___",           "parameters.json"],
  ["___SANDBOXED_JS_FOR_WEB_TEMPLATE___", "web.js"],
  ["___WEB_PERMISSIONS___",               "permissions.json"],
];

let out = "";
for (const [header, filename] of SECTIONS) {
  const filePath = path.resolve('src/', filename);
  const buf = await fs.readFile(filePath);
  const content = buf.toString("utf8").trim();
  out += header + "\n\n" + content + "\n\n\n";
}

await fs.writeFile('template_built.tpl', out, "utf8");
console.log(`wrote 'template_built.tpl'`);
