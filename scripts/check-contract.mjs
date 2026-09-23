import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contractsDir = path.join(root, 'contracts');
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, 'packages/ui/custom-elements.json'), 'utf8'),
);
const failures = [];

for (const file of fs.readdirSync(contractsDir).filter((entry) => entry.endsWith('.yaml'))) {
  const contract = parse(fs.readFileSync(path.join(contractsDir, file), 'utf8'));
  const sourceDir = ['ui', 'commerce']
    .map((pkg) => path.join(root, 'packages', pkg, 'src', contract.id))
    .find((dir) => fs.existsSync(dir));
  if (!sourceDir) {
    failures.push(`${contract.id}: missing source`);
    continue;
  }
  const svelteFile = fs.readdirSync(sourceDir).find((entry) => entry.endsWith('.svelte'));
  const source = fs.readFileSync(path.join(sourceDir, svelteFile), 'utf8');

  if (!source.includes(`tag: '${contract.tag}'`)) failures.push(`${contract.id}: missing tag ${contract.tag}`);
  for (const prop of contract.props) {
    if (!source.includes(`${prop.name}:`)) failures.push(`${contract.id}: missing prop ${prop.name}`);
  }
  if (/#[0-9a-fA-F]{3,8}\b/.test(source)) failures.push(`${contract.id}: raw hex color`);

  const declared = manifest.modules
    ?.flatMap((module) => module.declarations ?? [])
    .find((declaration) => declaration.tagName === contract.tag);
  if (!declared) {
    failures.push(`${contract.id}: manifest missing tag ${contract.tag}`);
    continue;
  }
  const manifestProps = new Set((declared.attributes ?? []).map((attribute) => attribute.fieldName));
  for (const prop of contract.props) {
    if (!manifestProps.has(prop.name)) failures.push(`${contract.id}: manifest missing prop ${prop.name}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('contracts match source and manifest');
