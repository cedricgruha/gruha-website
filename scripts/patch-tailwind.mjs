import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const websiteDir = path.resolve(__dirname, "..");

const filesToPatch = [
  path.join(websiteDir, "node_modules/@tailwindcss/postcss/dist/index.mjs"),
  path.join(websiteDir, "node_modules/@tailwindcss/postcss/dist/index.js"),
];

for (const filePath of filesToPatch) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[patch-tailwind] File not found: ${filePath}`);
    continue;
  }

  let content = fs.readFileSync(filePath, "utf-8");

  // In index.mjs:
  // let f=D.dirname(D.resolve(u));
  if (content.includes("let f=D.dirname(D.resolve(u));")) {
    content = content.replace(
      "let f=D.dirname(D.resolve(u));",
      "let f=(u&&D.isAbsolute(u)&&u.startsWith(r))?D.dirname(u):r;"
    );
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`[patch-tailwind] Patched ${path.basename(filePath)}`);
  } else if (content.includes("let f=(u&&D.isAbsolute(u)&&u.startsWith(r))?D.dirname(u):r;")) {
    console.log(`[patch-tailwind] Already patched: ${path.basename(filePath)}`);
  }

  // In index.js:
  // let f=V.default.dirname(V.default.resolve(u));
  if (content.includes("let f=V.default.dirname(V.default.resolve(u));")) {
    content = content.replace(
      "let f=V.default.dirname(V.default.resolve(u));",
      "let f=(u&&V.default.isAbsolute(u)&&u.startsWith(r))?V.default.dirname(u):r;"
    );
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`[patch-tailwind] Patched ${path.basename(filePath)}`);
  } else if (content.includes("let f=(u&&V.default.isAbsolute(u)&&u.startsWith(r))?V.default.dirname(u):r;")) {
    console.log(`[patch-tailwind] Already patched: ${path.basename(filePath)}`);
  }
}
