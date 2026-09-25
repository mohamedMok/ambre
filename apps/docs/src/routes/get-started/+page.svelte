<script lang="ts">
	import CodeBlock from '$lib/CodeBlock.svelte';
	import Stage from '$lib/Stage.svelte';
	import { repoUrl, storybookUrl } from '$lib/site';

	let status = $state('Not submitted.');

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		status = 'Submitted. The form read both fields and the checkbox.';
	}

	const installCode = `npm install @ambre-ds/tokens @ambre-ds/ui
npm install @fontsource/source-sans-3 @fontsource/source-code-pro

# Shop and AI compositions, only if the product needs them
npm install @ambre-ds/commerce
npm install @ambre-ds/ai`;

	const cloneCode = `git clone ${repoUrl}.git
cd ambre
pnpm install
pnpm build`;

	const loadCode = `// 1. Fonts: the faces the theme names
import '@fontsource/source-sans-3/400.css';
import '@fontsource/source-sans-3/500.css';
import '@fontsource/source-sans-3/600.css';
import '@fontsource/source-code-pro/400.css';

// 2. Tokens: every --amb- variable, light and dark
import '@ambre-ds/tokens/css';

// 3. Presets: only when the product uses data-brand
import '@ambre-ds/tokens/css/presets';

// 4. The library: registers the amb- elements
import '@ambre-ds/ui';
import '@ambre-ds/commerce';
import '@ambre-ds/ai';`;

	const exampleCode = `<form action="/sign-in" method="post">
  <amb-text-field name="email" type="email" autocomplete="email" required>Email</amb-text-field>
  <amb-text-field name="password" type="password" autocomplete="current-password" required>Password</amb-text-field>
  <amb-checkbox name="remember">Keep me signed in on this device</amb-checkbox>
  <amb-button type="submit">Sign in</amb-button>
  <amb-link href="/reset">Reset your password</amb-link>
</form>`;

	const svelteCode = `<script>
  import { onMount } from 'svelte';
  import '@ambre-ds/tokens/css';

  onMount(async () => {
    await import('@ambre-ds/ui');
  });
<\/script>

<amb-button type="submit">Save changes</amb-button>`;

	const themeCode = `/* Load after @ambre-ds/tokens/css. Same selectors, so the later rule wins. */
:root {
  --amb-color-accent-bg: #0b5cad;
  --amb-color-accent-bg-hover: #094a8c;
  --amb-color-accent-bg-active: #073a6e;
  --amb-color-accent-fg: #0b5cad;
  --amb-color-focus-ring: #0b5cad;
}

[data-theme="dark"] {
  --amb-color-accent-bg: #8cbcf0;
  --amb-color-accent-bg-hover: #b0d2f5;
  --amb-color-accent-bg-active: #6aa4e6;
  --amb-color-accent-fg: #a6cbf3;
  --amb-color-focus-ring: #a6cbf3;
}`;

	const darkCode = `<html data-theme="dark">`;

	const brandCode = `<!-- The whole product in one brand -->
<html data-brand="atlas" data-theme="light">

<!-- One region in another brand and theme -->
<section data-brand="press" data-theme="dark">
  <amb-button>Subscribe</amb-button>
</section>`;

	const reactCode = `import '@ambre-ds/ui';

export function Checkout() {
  return (
    <form method="post">
      <amb-text-field name="email" type="email">Email</amb-text-field>
      <amb-button type="submit">Place order</amb-button>
    </form>
  );
}`;

	const vueCode = `import vue from '@vitejs/plugin-vue';

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: { isCustomElement: (tag) => tag.startsWith('amb-') }
      }
    })
  ]
};`;

	const angularCode = `import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@ambre-ds/ui';

@Component({
  selector: 'app-checkout',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './checkout.html'
})
export class CheckoutComponent {}`;
</script>

<svelte:head>
	<title>Install — Ambre</title>
	<meta
		name="description"
		content="Build Ambre from source, load the fonts, tokens, presets, and library in order, and use the web components in any framework."
	/>
</svelte:head>

<header class="doc-header">
	<p class="eyebrow">Get started</p>
	<h1>Install</h1>
	<p class="lede">
		Ambre is a set of web components and the tokens that theme them. Install the packages from npm, load the theme,
		and write the tags.
	</p>
</header>

<h2 id="packages">Packages</h2>
<p class="section-lede">Four packages. Most products need the first two.</p>
<div class="table-wrap">
	<table class="api">
		<thead>
			<tr>
				<th scope="col">Package</th>
				<th scope="col">Carries</th>
				<th scope="col">Entry points</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<th scope="row"><code>@ambre-ds/tokens</code></th>
				<td>Every <code>--amb-</code> variable for light and dark, and the brand presets.</td>
				<td>
					<span class="values"><code>@ambre-ds/tokens/css</code><code>@ambre-ds/tokens/css/presets</code></span>
				</td>
			</tr>
			<tr>
				<th scope="row"><code>@ambre-ds/ui</code></th>
				<td>The core elements: actions, forms, content, layout, feedback, and navigation.</td>
				<td><code>@ambre-ds/ui</code></td>
			</tr>
			<tr>
				<th scope="row"><code>@ambre-ds/commerce</code></th>
				<td>Shop compositions such as quantity. Checkout logic stays in the product.</td>
				<td><code>@ambre-ds/commerce</code></td>
			</tr>
			<tr>
				<th scope="row"><code>@ambre-ds/ai</code></th>
				<td>Conversation compositions: prompt, message, thinking, and suggestion. The model stays in the product.</td>
				<td><code>@ambre-ds/ai</code></td>
			</tr>
		</tbody>
	</table>
</div>

<h2 id="prerequisites">Prerequisites</h2>
<ul>
	<li>Any package manager: npm, pnpm, or Yarn.</li>
	<li>A bundler that resolves package <code>exports</code> and imports CSS, such as Vite or webpack.</li>
	<li>
		Current Chrome, Edge, Firefox, or Safari. The elements use custom elements, open shadow roots, and
		<code>ElementInternals</code>.
	</li>
</ul>

<h2 id="install">Install from npm</h2>
<p>
	Add the tokens and the library, with the fonts the default brand names. The packages share one version, and
	each release is published from CI with npm provenance.
</p>
<CodeBlock code={installCode} lang="bash" title="Terminal" />

<h3>Build from source</h3>
<p>
	To contribute, or to try an unreleased change, clone the repository and build every package. The output lands in
	each package's <code>dist</code> folder. You need Node 22 and pnpm 12.
</p>
<CodeBlock code={cloneCode} lang="bash" title="Terminal" />

<h2 id="load-order">Load order</h2>
<p>
	Load four things, in this order: <strong>fonts</strong>, <strong>tokens</strong>, <strong>presets</strong>, then the
	<strong>library</strong>. The theme is in place before the first element upgrades, so nothing restyles on load.
</p>
<CodeBlock code={loadCode} lang="html" title="main.js" />
<ul>
	<li>Load the faces the active brand names. Ambre uses Source Sans 3 and Source Code Pro.</li>
	<li>
		Load <code>@fontsource/material-symbols-outlined</code> where <code>amb-icon</code> takes a <code>name</code>. An icon
		with a slotted SVG needs no font.
	</li>
	<li>Skip the presets file when the product uses only the default brand.</li>
</ul>

<h2 id="first-example">A first example</h2>
<p>
	Write the tags in plain HTML. The slotted text is the label. The form controls are form-associated, so the form
	submits their values like native fields.
</p>
<Stage code={exampleCode} label="Sign in">
	<form class="example-form" onsubmit={onSubmit}>
		<amb-text-field name="email" type="email" autocomplete="email" required>Email</amb-text-field>
		<amb-text-field name="password" type="password" autocomplete="current-password" required>Password</amb-text-field>
		<amb-checkbox name="remember">Keep me signed in on this device</amb-checkbox>
		<amb-button type="submit">Sign in</amb-button>
		<amb-link href="/get-started#first-example">Reset your password</amb-link>
		<p class="example-status" aria-live="polite">{status}</p>
	</form>
</Stage>

<h2 id="sveltekit">SvelteKit and server rendering</h2>
<p>
	Import <code>@ambre-ds/ui</code> in <code>onMount</code>. <code>customElements</code> does not exist on the server. Keep the
	tags and their text in the markup, so the server HTML already carries every label.
</p>
<CodeBlock code={svelteCode} lang="svelte" title="+layout.svelte" />
<p>
	The same rule holds in Next.js, Nuxt, and Astro: render the tags on the server, register the elements on the
	client.
</p>

<h2 id="theming">Theme it</h2>
<p>
	Override semantic variables, such as <code>--amb-color-accent-bg</code>. Leave the reference palette in the token
	files. Components read only semantic variables, so every element follows.
</p>
<CodeBlock code={themeCode} lang="html" title="theme.css" />
<p>Set <code>data-theme="dark"</code> on an ancestor for the dark decisions.</p>
<CodeBlock code={darkCode} lang="html" />
<p>
	Check every pair you change against the <a href="/foundations/accessibility">contrast pairs</a>. Overrides on
	<code>:root</code> lose to a brand preset. To change a brand, edit its preset.
</p>

<h2 id="brands">Use a brand</h2>
<p>
	A brand is one preset file. The build compiles each one onto the same variables, under <code>data-brand</code>. Ambre
	is the default when the attribute is absent. The ids are <code>atlas</code>, <code>verdant</code>, <code>noir</code>,
	and <code>press</code>.
</p>
<CodeBlock code={brandCode} lang="html" />
<p>
	Put <code>data-brand</code> and <code>data-theme</code> on the same ancestor. The dark rules of a preset match only when
	both attributes sit on one element. The product loads the face the preset names. No preset ships a font file.
	<a href="/brands">Compare the brands</a>.
</p>

<h2 id="frameworks">Framework notes</h2>
<p>
	The elements are standard web components. They work in any framework, and in plain HTML. Use the tags directly.
	No wrapper package is needed.
</p>

<h3>React 19</h3>
<p>
	React 19 passes props to custom elements as properties, so strings and booleans work as written. For TypeScript,
	declare the tags in <code>JSX.IntrinsicElements</code>. Import the library once, on the client, in the entry module.
</p>
<CodeBlock code={reactCode} lang="js" title="Checkout.jsx" />

<h3>Vue</h3>
<p>Tell the compiler that <code>amb-</code> tags are custom elements, so it does not try to resolve them as components.</p>
<CodeBlock code={vueCode} lang="js" title="vite.config.js" />

<h3>Angular</h3>
<p>Add <code>CUSTOM_ELEMENTS_SCHEMA</code> to each component that uses the tags.</p>
<CodeBlock code={angularCode} lang="js" title="checkout.component.ts" />

<h2 id="rules">Rules of use</h2>
<div class="guidance">
	<section class="guidance-card" data-kind="do">
		<h3>Do</h3>
		<ul>
			<li>Load the token CSS before the components.</li>
			<li>Put the visible label in the slot.</li>
			<li>Use a link to go somewhere and a button to start an action.</li>
			<li>Keep headings as native HTML. Type is a token.</li>
			<li>Change a brand in its preset file, then set <code>data-brand</code>.</li>
		</ul>
	</section>
	<section class="guidance-card" data-kind="dont">
		<h3>Don’t</h3>
		<ul>
			<li>Don’t paint a component with a raw color. Override the semantic variable.</li>
			<li>Don’t restyle a component to imitate a brand. Write a preset.</li>
			<li>Don’t import the library during server rendering.</li>
			<li>Don’t look for a heading component. There is none.</li>
		</ul>
	</section>
</div>

<h2 id="next-steps">Next steps</h2>
<ul class="card-grid">
	<li>
		<a class="card-link" href="/foundations">
			<strong>Foundations</strong>
			<span>Color, type, space, motion, and the contrast floor.</span>
		</a>
	</li>
	<li>
		<a class="card-link" href="/components">
			<strong>Components</strong>
			<span>Every element, with usage, API, and accessibility notes.</span>
		</a>
	</li>
	<li>
		<a class="card-link" href="/brands">
			<strong>Brands</strong>
			<span>Five presets on the same tokens, and how to write your own.</span>
		</a>
	</li>
	<li>
		<a class="card-link" href={storybookUrl} target="_blank" rel="external noreferrer">
			<strong>Storybook</strong>
			<span>Every variant and state, in both themes.</span>
		</a>
	</li>
</ul>

<style>
	.example-form {
		display: grid;
		gap: var(--amb-space-400);
		width: 100%;
		max-width: 24rem;
		justify-items: start;
	}

	.example-form amb-text-field {
		justify-self: stretch;
	}

	.example-status {
		margin: 0;
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
	}
</style>
