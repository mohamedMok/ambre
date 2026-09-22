<script lang="ts">
	import { storybookUrl } from '$lib/site';
</script>

<svelte:head>
	<title>Install — Ambre</title>
	<meta
		name="description"
		content="Install Ambre from the repository, load the theme, and use the web components."
	/>
</svelte:head>

<p class="eyebrow">Get started</p>
<h1>Install</h1>

<div class="stage-card">
	<p class="stage-label">The basics</p>
	<div class="row">
		<amb-button>Save changes</amb-button>
		<amb-link href="/components/link">Read the guide</amb-link>
		<amb-icon label="Add">
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z" />
			</svg>
		</amb-icon>
	</div>
	<amb-disclosure open>
		Shipping
		<p slot="panel">Arrives in two days. The panel is the named slot.</p>
	</amb-disclosure>
</div>

<p class="lede">
	Two packages. <code>@ambre/tokens</code> carries the theme. <code>@ambre/ui</code> carries the components.
	The packages are not on npm yet. Build them from this repository.
</p>

<h2>Get the source</h2>
<div class="snippets">
	<pre><code>git clone https://github.com/mohamedMok/ambre.git
cd ambre
pnpm install
pnpm build</code></pre>
	<pre><code>Node 22
pnpm 12</code></pre>
</div>

<h2>Point a product at the build</h2>
<p class="lede">From the product, add the built packages. Then load the fonts, the theme, and the library, in that order.</p>
<pre><code>pnpm add ../ambre/packages/tokens ../ambre/packages/ui
pnpm add @fontsource/source-sans-3 @fontsource/source-code-pro</code></pre>
<pre><code>import '@fontsource/source-sans-3/400.css';
import '@fontsource/source-sans-3/600.css';
import '@fontsource/source-code-pro/400.css';
import '@ambre/tokens/css';
import '@ambre/ui';</code></pre>
<pre><code>&lt;amb-button type="submit"&gt;Save changes&lt;/amb-button&gt;
&lt;amb-link href="/account"&gt;Account&lt;/amb-link&gt;</code></pre>

<h2>In SvelteKit</h2>
<p class="lede">
	Import <code>@ambre/ui</code> in <code>onMount</code>. <code>customElements</code> does not exist while the page is rendered on the server. Keep the tags and their text in the markup so the HTML is already there.
</p>

<h2>Theme it</h2>
<p class="lede">
	Override a semantic variable. Leave the reference palette in the token files. Set <code>data-theme="dark"</code> on an ancestor for the dark decisions.
</p>
<pre><code>:root &#123;
  --amb-color-accent-bg: var(--amb-color-accent-bg-hover);
&#125;

&lt;html data-theme="dark"&gt;</code></pre>

<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Load the token CSS before the components.</li>
			<li>Put the visible label in the slot.</li>
			<li>Use a link to go somewhere and a button to start an action.</li>
			<li>Keep headings as native HTML.</li>
		</ul>
	</section>
	<section class="note">
		<h2>Don't</h2>
		<ul>
			<li>Don't paint a component with a raw hex color.</li>
			<li>Don't import the library during server rendering.</li>
			<li>Don't look for a heading component. Type is a token.</li>
		</ul>
	</section>
</div>

<p class="lede">
	<a href={storybookUrl} target="_blank" rel="noreferrer">Open Storybook</a> to inspect every variant and both themes.
</p>
