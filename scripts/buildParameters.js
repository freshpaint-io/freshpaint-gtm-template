import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const outputPath = 'src/parameters.json';
await fs.mkdir(path.dirname(outputPath), { recursive: true });

const srcFolder = 'src/parameters/tags';
const rootFile = path.resolve(srcFolder, 'root.ts');
const integrationFiles = await fs.readdir(path.resolve(srcFolder, 'integrations'), {
  withFileTypes: true,
});

const fileNames = [rootFile];
fileNames.push(
  ...integrationFiles.map((file) => path.resolve(srcFolder, 'integrations', file.name)),
);

const allParams = [];
async function buildParams(filePath) {
  const modUrl = pathToFileURL(filePath).href;
  const mod = await import(modUrl);
  const build = typeof mod.default === 'function' && mod.default;

  // params is always a flat array of parameter objects
  const params = await build();
  allParams.push(...params);
}

for (const fileName of fileNames) {
  const filePath = path.resolve('src/parameters/tags/', fileName);
  try {
    await buildParams(filePath);
    console.log(`built parameters from ${fileName}`);
  } catch (error) {
    console.error(`failed to build parameters from ${fileName}: ${error}`);
  }
}

const uniqParamMap = new Map();
for (const param of allParams) {
  if (uniqParamMap.has(param.name)) {
    const existingParam = uniqParamMap.get(param.name);
    if (param.enablingConditions) {
      existingParam.enablingConditions = [
        ...(existingParam.enablingConditions || []),
        ...param.enablingConditions,
      ];
    }
  } else {
    uniqParamMap.set(param.name, param);
  }
}

await fs.writeFile(
  outputPath,
  JSON.stringify(Array.from(uniqParamMap.values()), null, 2) + '\n',
  'utf8',
);
console.log(`wrote ${outputPath}`);
