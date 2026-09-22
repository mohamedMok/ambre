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
			One library of Svelte web components. A brand is a preset of the same tokens.
			The components stay still.
		</p>
		<div class="actions">
			<a class="action" href={storybookUrl} target="_blank" rel="external noreferrer">Open Storybook</a>
			<a class="action action-quiet" href="/get-started">Install and use</a>
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
import '@ambre/tokens/css/presets';
import '@ambre/ui';</code></pre>
	<pre><code>&lt;amb-button type="submit"&gt;Save changes&lt;/amb-button&gt;</code></pre>
</div>

<h2>Start here</h2>
<ul class="paths">
	<li class="path">
		<a href="/get-started">
			<strong>Install</strong>
			<small>Load the theme, then the library, then write the elements.</small>
		</a>
	</li>
	<li class="path">
		<a href="/foundations">
			<strong>Foundations</strong>
			<small>Color, type, and space. Override the decision, not the palette.</small>
		</a>
	</li>
	<li class="path">
		<a href="/components">
			<strong>Components</strong>
			<small>Basics for acting and navigating. Forms for collecting a choice.</small>
		</a>
	</li>
</ul>

<section class="invite">
	<h2>Every state lives in Storybook.</h2>
	<p>Variants, sizes, both themes, and the accessibility panel. The workshop sits next to these pages.</p>
	<a class="action" href={storybookUrl} target="_blank" rel="external noreferrer">Open Storybook</a>
</section>
