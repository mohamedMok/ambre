import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv/dist/2020.js';
import { parse } from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contractsDir = path.join(root, 'contracts');
const schema = JSON.parse(fs.readFileSync(path.join(contractsDir, 'component.schema.json'), 'utf8'));
const tokens = JSON.parse(
  fs.readFileSync(path.join(root, 'packages/tokens/dist/json/tokens.json'), 'utf8'),
);
const tokenCss = new Map(
  [...tokens.system, ...tokens.dark, ...tokens.reference]
    .filter((token) => token.css)
    .map((token) => [token.path, token.css]),
);

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);
const files = fs.readdirSync(contractsDir).filter((file) => file.endsWith('.yaml'));
const modules = [];

for (const file of files) {
  const contract = parse(fs.readFileSync(path.join(contractsDir, file), 'utf8'));
  if (!validate(contract)) {
    console.error(`${file} does not match the component schema`);
    console.error(validate.errors);
    process.exit(1);
  }

  const located = ['ui', 'commerce', 'ai']
    .map((pkg) => {
      const dir = path.join(root, 'packages', pkg, 'src', contract.id);
      if (!fs.existsSync(dir)) return null;
      const svelteFile = fs.readdirSync(dir).find((entry) => entry.endsWith('.svelte'));
      if (!svelteFile) return null;
      const modulePath =
        pkg === 'ui'
          ? `src/${contract.id}/${svelteFile}`
          : `../${pkg}/src/${contract.id}/${svelteFile}`;
      return { svelteFile, modulePath };
    })
    .find(Boolean);
  if (!located) {
    console.error(`No Svelte component for contract ${contract.id}`);
    process.exit(1);
  }
  const { svelteFile, modulePath } = located;

  const className = svelteFile.replace(/\.svelte$/, '');
  modules.push({
    kind: 'javascript-module',
    path: modulePath,
    declarations: [
      {
        kind: 'class',
        name: className,
        description: contract.summary,
        tagName: contract.tag,
        attributes: contract.props.map((prop) => ({
          name: prop.attribute ?? prop.name,
          type: prop.type === 'enum' ? prop.values.join(' | ') : prop.type,
          default: prop.default === undefined ? undefined : String(prop.default),
          description: prop.description,
          fieldName: prop.name,
        })),
        slots: contract.slots.map((slot) => ({
          name: slot.name === 'default' ? '' : slot.name,
          description: slot.description,
        })),
        events: contract.events.map((event) => ({
          name: event.name,
          description: event.description,
        })),
        cssParts: contract.anatomy
          .filter((part) => part.part)
          .map((part) => ({ name: part.part, description: part.id })),
        cssProperties: contract.tokens.map((tokenPath) => ({
          name: tokenCss.get(tokenPath) ?? `--amb-${tokenPath.replaceAll('.', '-')}`,
          description: tokenPath,
        })),
      },
    ],
    exports: [
      {
        kind: 'custom-element-definition',
        name: contract.tag,
        declaration: { name: className, module: modulePath },
      },
    ],
  });
}

const manifest = { schemaVersion: '1.0.0', readme: '', modules };
const destination = path.join(root, 'packages/ui/custom-elements.json');
fs.writeFileSync(destination, JSON.stringify(manifest, null, 2) + '\n');
console.log(`manifest: ${modules.length} component${modules.length === 1 ? '' : 's'}`);
