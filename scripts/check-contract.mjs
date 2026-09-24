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

  // Styles live outside the component, in the package's ITCSS components layer.
  if (/<style[\s>]/.test(source)) failures.push(`${contract.id}: <style> block in the component; move it to styles/components/${contract.id}.scss`);
  const sheetPath = path.join(sourceDir, '..', 'styles', 'components', `${contract.id}.scss`);
  if (!fs.existsSync(sheetPath)) {
    failures.push(`${contract.id}: missing styles/components/${contract.id}.scss`);
  } else {
    const sheet = fs.readFileSync(sheetPath, 'utf8');
    if (/#[0-9a-fA-F]{3,8}\b/.test(sheet)) failures.push(`${contract.id}: raw hex color in ${contract.id}.scss`);
    if (/var\(--amb-/.test(sheet)) failures.push(`${contract.id}: raw var(--amb-…) in ${contract.id}.scss; use token()`);
    if (/!important/.test(sheet)) failures.push(`${contract.id}: !important in ${contract.id}.scss`);
    if (!source.includes(`styles/components/${contract.id}.scss?inline`)) {
      failures.push(`${contract.id}: the component does not adopt styles/components/${contract.id}.scss`);
    }
    const block = `.c-${contract.id}`;
    if (!sheet.includes(block)) failures.push(`${contract.id}: ${contract.id}.scss has no BEM block ${block}`);
  }

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
