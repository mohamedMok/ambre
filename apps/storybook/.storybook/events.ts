import type { Decorator } from '@storybook/web-components-vite';
import manifest from '@ambre-ds/ui/custom-elements.json';
import { render } from 'lit';
import { action } from 'storybook/actions';

type Manifest = {
  modules: { declarations?: { tagName?: string; events?: { name: string }[] }[] }[];
};

/** Every event each element declares in its contract, from the generated manifest. */
const eventsByTag = new Map<string, Set<string>>();
for (const module of (manifest as Manifest).modules) {
  for (const declaration of module.declarations ?? []) {
    if (!declaration.tagName) continue;
    eventsByTag.set(declaration.tagName, new Set((declaration.events ?? []).map((event) => event.name)));
  }
}
const eventNames = new Set([...eventsByTag.values()].flatMap((names) => [...names]));

/** What the Actions panel shows: the detail of a custom event, or the value of a native one. */
function payload(event: Event) {
  if (event instanceof CustomEvent) return event.detail;
  const target = event.target as HTMLElement & { value?: unknown; checked?: unknown };
  return { value: target.value, ...(typeof target.checked === 'boolean' ? { checked: target.checked } : {}) };
}

/**
 * Logs every Ambre event of the story in the Actions panel, named `<tag> <event>`, such as
 * `amb-radio change`. Only the events a contract declares are logged, and only from the element
 * that declares them, so a click on a plain button inside a story stays out of the panel.
 */
export const withAmbreEvents: Decorator = (story) => {
  const root = document.createElement('div');
  root.style.display = 'contents';
  for (const name of eventNames) {
    root.addEventListener(name, (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!eventsByTag.get(target.localName)?.has(name)) return;
      action(`${target.localName} ${name}`)(payload(event));
    });
  }
  render(story(), root);
  return root;
};
