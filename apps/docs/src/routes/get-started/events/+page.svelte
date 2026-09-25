<script lang="ts">
	import CodeBlock from '$lib/CodeBlock.svelte';
	import Stage from '$lib/Stage.svelte';
	import { contract } from '$lib/contracts';
	import { components } from '$lib/sections';

	type Entry = { id: number; tag: string; name: string; data: string };

	// The catalogue: every event every contract declares.
	const catalogue = components
		.map((item) => contract(item.href.split('/').pop() ?? ''))
		.filter((c) => c.events.length)
		.flatMap((c) => c.events.map((event) => ({ tag: c.tag, id: c.id, ...event })));

	let log = $state<Entry[]>([]);
	let next = 0;

	// One listener per event name on the container: every Ambre event bubbles up to it.
	function record(event: Event) {
		const target = event.target;
		if (!(target instanceof HTMLElement) || !target.localName.startsWith('amb-')) return;
		const data =
			event instanceof CustomEvent
				? JSON.stringify(event.detail, (key, value) => (value instanceof HTMLElement ? `<${value.localName}>` : value))
				: `value: ${JSON.stringify((target as HTMLInputElement).value)}`;
		log = [{ id: next++, tag: target.localName, name: event.type, data }, ...log].slice(0, 8);
	}

	function listen(node: HTMLElement) {
		const names = ['change', 'input', 'toggle', 'select', 'send'];
		for (const name of names) node.addEventListener(name, record);
		return {
			destroy() {
				for (const name of names) node.removeEventListener(name, record);
			}
		};
	}

	const htmlCode = `<amb-checkbox name="news">Send product updates</amb-checkbox>

<script type="module">
  const checkbox = document.querySelector('amb-checkbox');
  checkbox.addEventListener('change', (event) => {
    console.log(event.detail.checked, event.detail.value);
  });
<\/script>`;

	const delegateCode = `// One listener for a whole form: every event bubbles.
form.addEventListener('change', (event) => {
  const field = event.target;          // the amb- element, not its inner input
  console.log(field.name, event.detail);
});`;

	const typesCode = `import type { AmbCheckedChangeEvent, AmbToggleEvent } from '@ambre-ds/ui';
import type { AmbPromptSendEvent } from '@ambre-ds/ai';

checkbox.addEventListener('change', (event) => {
  const { checked } = (event as AmbCheckedChangeEvent).detail;
});`;

	const cancelCode = `prompt.addEventListener('send', (event) => {
  if (!signedIn) {
    event.preventDefault();   // the text stays in the field
    showSignIn();
  }
});`;

	const reactCode = `import { useEffect, useRef } from 'react';
import '@ambre-ds/ui';

export function Newsletter({ onSubscribe }) {
  const ref = useRef(null);

  useEffect(() => {
    const checkbox = ref.current;
    const handle = (event) => onSubscribe(event.detail.checked);
    checkbox.addEventListener('change', handle);
    return () => checkbox.removeEventListener('change', handle);
  }, [onSubscribe]);

  return <amb-checkbox ref={ref} name="news">Send product updates</amb-checkbox>;
}`;

	const vueCode = `<template>
  <amb-checkbox name="news" @change="onChange">Send product updates</amb-checkbox>
  <amb-tabs @change="(event) => (tab = event.detail.index)">…</amb-tabs>
</template>

<script setup>
function onChange(event) {
  console.log(event.detail.checked);
}
<\/script>`;

	const svelteCode = `<amb-checkbox name="news" onchange={(event) => (subscribed = event.detail.checked)}>
  Send product updates
</amb-checkbox>

<amb-prompt onsend={(event) => ask(event.detail.value)} onstop={abort}>Message</amb-prompt>`;

	const angularCode = `<amb-checkbox name="news" (change)="onChange($event)">Send product updates</amb-checkbox>

// component.ts
onChange(event: Event) {
  const { checked } = (event as CustomEvent<{ checked: boolean }>).detail;
}`;
</script>

<svelte:head>
	<title>Events — Ambre</title>
	<meta
		name="description"
		content="How Ambre elements report what people do: event names, the detail each one carries, and how to listen in plain JavaScript, React, Vue, Svelte, and Angular."
	/>
</svelte:head>

<header class="doc-header">
	<p class="eyebrow">Get started</p>
	<h1>Events</h1>
	<p class="lede">
		Every Ambre element reports what people do with a DOM event. Listen with <code>addEventListener</code>, or with
		your framework's event syntax. The data is in <code>event.detail</code>.
	</p>
</header>

<h2 id="try">Try it</h2>
<p>Use the controls. Each event appears in the log with the element that fired it and its detail.</p>
<Stage align="stretch" label="Event log">
	<div class="playground">
		<div class="controls" use:listen>
			<amb-text-field name="name" placeholder="Ada">Name</amb-text-field>
			<amb-checkbox name="news" value="yes">Send product updates</amb-checkbox>
			<amb-toggle name="alerts">Email alerts</amb-toggle>
			<fieldset class="group">
				<legend>Plan</legend>
				<amb-radio name="plan" value="monthly" checked>Monthly</amb-radio>
				<amb-radio name="plan" value="annual">Annual</amb-radio>
			</fieldset>
			<amb-range name="volume" value={40} min={0} max={100}>Volume</amb-range>
			<amb-disclosure>
				Shipping details
				<p slot="panel" class="panel-text">Arrives in two days.</p>
			</amb-disclosure>
			<amb-menu>
				Share
				<button slot="panel" type="button" value="link">Copy link</button>
				<button slot="panel" type="button" value="email">Email</button>
			</amb-menu>
		</div>
		<div class="log" aria-live="polite" aria-label="Event log">
			{#if log.length === 0}
				<p class="empty">No events yet.</p>
			{/if}
			<ol>
				{#each log as entry (entry.id)}
					<li>
						<code class="who">&lt;{entry.tag}&gt;</code>
						<code class="what">{entry.name}</code>
						<code class="data">{entry.data}</code>
					</li>
				{/each}
			</ol>
		</div>
	</div>
</Stage>

<h2 id="rules">How events work</h2>
<ul>
	<li>
		<strong>Every event bubbles and is composed.</strong> It leaves the shadow root and reaches any ancestor, so one
		listener on a form or a fieldset hears every field inside.
	</li>
	<li>
		<strong><code>event.target</code> is the <code>amb-</code> element</strong>, never its inner input. Read its
		<code>name</code>, <code>value</code>, or <code>checked</code> like a native field.
	</li>
	<li>
		<strong>The data is in <code>event.detail</code>.</strong> A <code>change</code> carries the new value, so there is
		nothing to look up.
	</li>
	<li>
		<strong>Names follow the platform.</strong> <code>change</code> when a value is committed, <code>input</code> while
		it is typed, <code>toggle</code> when something opens or closes. The rare new names say what happened:
		<code>select</code>, <code>send</code>, <code>stop</code>, <code>close</code>.
	</li>
	<li>
		<strong>Events report people, not code.</strong> Setting <code>checked</code> or <code>open</code> from
		JavaScript does not fire an event, as with native elements. This keeps two-way bindings from looping.
	</li>
	<li>
		<strong><code>input</code> and <code>click</code> are the browser's own.</strong> They come from the inner control
		and are retargeted to the element. The contract marks them <em>native</em>.
	</li>
</ul>

<h2 id="javascript">Plain JavaScript</h2>
<CodeBlock code={htmlCode} lang="html" title="index.html" />
<CodeBlock code={delegateCode} lang="js" title="One listener for a form" />

<h3 id="cancel">Cancel an outcome</h3>
<p>
	A cancelable event has a default outcome that <code>preventDefault()</code> stops. <code>send</code> on
	<code>amb-prompt</code> empties the field unless a listener cancels it.
</p>
<CodeBlock code={cancelCode} lang="js" />

<h3 id="typescript">TypeScript</h3>
<p>Each package exports a type for every event it fires.</p>
<CodeBlock code={typesCode} lang="js" title="checkout.ts" />

<h2 id="frameworks">Frameworks</h2>

<h3 id="react">React</h3>
<p>
	Attach the listener to a ref. This works in React 18 and 19, for native and custom events alike, and keeps the
	handler in step with its props.
</p>
<CodeBlock code={reactCode} lang="js" title="Newsletter.jsx" />

<h3 id="vue">Vue</h3>
<p>Vue listens to DOM events on custom elements with <code>@name</code>. The event object is <code>$event</code>.</p>
<CodeBlock code={vueCode} lang="html" title="Newsletter.vue" />

<h3 id="svelte">Svelte</h3>
<p>Svelte 5 treats an <code>on</code> attribute on a custom element as a listener for the event of that name.</p>
<CodeBlock code={svelteCode} lang="svelte" title="Newsletter.svelte" />

<h3 id="angular">Angular</h3>
<p>Bind with parentheses. Add <code>CUSTOM_ELEMENTS_SCHEMA</code> to the component, as for any <code>amb-</code> tag.</p>
<CodeBlock code={angularCode} lang="html" title="newsletter.component.html" />

<h2 id="catalogue">Every event</h2>
<p class="section-lede">Generated from the contracts. Each component page lists its own.</p>
<div class="table-wrap">
	<table class="api">
		<thead>
			<tr>
				<th scope="col">Element</th>
				<th scope="col">Event</th>
				<th scope="col"><code>event.detail</code></th>
				<th scope="col">When</th>
			</tr>
		</thead>
		<tbody>
			{#each catalogue as row}
				<tr>
					<th scope="row"><a href={`/components/${row.id}`}><code>&lt;{row.tag}&gt;</code></a></th>
					<td>
						<code>{row.name}</code>
						{#if row.native}<span class="note">native</span>{/if}
						{#if row.cancelable}<span class="note">cancelable</span>{/if}
					</td>
					<td>{#if row.detail}<code>{row.detail}</code>{:else}<span class="muted">—</span>{/if}</td>
					<td>{row.description}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.playground {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: var(--amb-space-500);
		width: 100%;
	}

	.controls {
		display: grid;
		align-content: start;
		gap: var(--amb-space-300);
	}

	.group {
		display: grid;
		gap: var(--amb-space-100);
		margin: 0;
		padding: 0;
		border: 0;
	}

	.group legend {
		margin-bottom: var(--amb-space-100);
		padding: 0;
		font-weight: var(--amb-font-weight-semibold);
	}

	.panel-text {
		margin: 0;
	}

	.log {
		align-self: start;
		min-height: 16rem;
		padding: var(--amb-space-400);
		border: var(--amb-border-width-default) solid color-mix(in oklab, var(--amb-color-border-default) 40%, transparent);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-surface);
		box-shadow: inset 0 1px 0 var(--amb-color-highlight), var(--amb-elevation-1);
	}

	.log ol {
		display: grid;
		gap: var(--amb-space-200);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.log li {
		display: flex;
		flex-wrap: wrap;
		gap: var(--amb-space-200);
		align-items: baseline;
		font-size: var(--amb-font-size-200);
	}

	.who {
		color: var(--amb-color-fg-muted);
	}

	.what {
		color: var(--amb-color-accent-fg);
		font-weight: var(--amb-font-weight-semibold);
	}

	.data {
		overflow-wrap: anywhere;
	}

	.empty {
		margin: 0;
		color: var(--amb-color-fg-muted);
	}
</style>
