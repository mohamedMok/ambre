import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contract = parse(fs.readFileSync(path.join(root, 'contracts/button.yaml'), 'utf8'));
const source = fs.readFileSync(
  path.join(root, 'packages/ui/src/button/Button.svelte'),
  'utf8',
);
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, 'packages/ui/custom-elements.json'), 'utf8'),
);

const failures = [];
if (!source.includes(`tag: '${contract.tag}'`)) failures.push(`missing tag ${contract.tag}`);
for (const prop of contract.props) {
  if (!source.includes(`${prop.name}:`)) failures.push(`missing prop ${prop.name}`);
}
if (/#[0-9a-fA-F]{3,8}\b/.test(source)) failures.push('raw hex color in Button.svelte');

const declared = manifest.modules?.[0]?.declarations?.[0];
if (declared?.tagName !== contract.tag) failures.push('manifest tag does not match the contract');
const manifestProps = new Set((declared?.attributes ?? []).map((attribute) => attribute.fieldName));
for (const prop of contract.props) {
  if (!manifestProps.has(prop.name)) failures.push(`manifest missing prop ${prop.name}`);
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('button contract matches source and manifest');
