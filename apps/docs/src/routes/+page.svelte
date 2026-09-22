<script lang="ts">
	import { storybookUrl } from '$lib/site';
</script>

<svelte:head>
	<title>Ambre</title>
	<meta
		name="description"
		content="Ambre is an open-source design system. A warm theme, semantic tokens, and one library of Svelte web components."
	/>
</svelte:head>

<div class="hero">
	<div>
		<p class="eyebrow">Open source</p>
		<h1>Warm by default.</h1>
		<p class="lede">
			One library of Svelte web components. Theme a product by overriding semantic variables.
			The components stay still.
		</p>
		<div class="actions">
			<a class="action" href={storybookUrl} target="_blank" rel="noreferrer">Open Storybook</a>
			<a class="action action-quiet" href="/components/button">See the button</a>
		</div>
	</div>
	<div class="stage-card">
		<p class="stage-label">amb-button</p>
		<div class="row">
			<amb-button>Save changes</amb-button>
			<amb-button variant="secondary">Cancel</amb-button>
			<amb-button variant="ghost">Learn more</amb-button>
		</div>
	</div>
</div>

<ul class="film" aria-label="Theme colors">
	<li class="film-canvas">--amb-color-bg-canvas</li>
	<li>--amb-color-bg-surface</li>
	<li class="film-accent">--amb-color-accent-bg</li>
	<li class="film-inverse">--amb-color-bg-inverse</li>
</ul>

<h2>Use it</h2>
<div class="snippets">
	<pre><code>import '@ambre/tokens/css';
import '@ambre/ui';</code></pre>
	<pre><code>&lt;amb-button type="submit"&gt;Save changes&lt;/amb-button&gt;</code></pre>
</div>

<h2>Start here</h2>
<ul class="paths">
	<li class="path">
		<a href="/foundations/color">
			<strong>Color</strong>
			<small>Override the theme. Leave the palette alone.</small>
		</a>
	</li>
	<li class="path">
		<a href="/foundations/typography">
			<strong>Type</strong>
			<small>Source Sans 3 for the interface. Source Code Pro for the names.</small>
		</a>
	</li>
	<li class="path">
		<a href="/foundations/space">
			<strong>Space</strong>
			<small>One scale for rhythm, radius, and the height of a control.</small>
		</a>
	</li>
	<li class="path">
		<a href="/components/button">
			<strong>Button</strong>
			<small>An action. A link is for going somewhere.</small>
		</a>
	</li>
</ul>

<section class="invite">
	<h2>Every state lives in Storybook.</h2>
	<p>Variants, sizes, both themes, and the accessibility panel. The workshop sits next to these pages.</p>
	<a class="action" href={storybookUrl} target="_blank" rel="noreferrer">Open Storybook</a>
</section>
