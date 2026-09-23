<script lang="ts">
	import { storybookUrl } from '$lib/site';
</script>

<svelte:head>
	<title>Ambre</title>
	<meta
		name="description"
		content="Ambre is an open-source design system. One library of web components. A brand is one preset file."
	/>
</svelte:head>

<div class="mast">
	<p class="eyebrow enter">Open source</p>
	<h1 class="enter enter-2">One library. Any brand.</h1>
	<p class="lede enter enter-3">
		The components stay still. A brand is one preset of the same tokens: type, shape, borders,
		space, motion, and color. Ambre is the default. Switch it in the header.
	</p>
	<div class="actions enter enter-4">
		<a class="action" href="/get-started">Install and use</a>
		<a class="action action-quiet" href={storybookUrl} target="_blank" rel="external noreferrer">Open Storybook</a>
	</div>
</div>

<section class="stage enter enter-5" aria-label="Components in the active brand">
	<div class="stage-copy">
		<p class="stage-label">Same markup</p>
		<p>Buttons, fields, and links read the active preset. Nothing else changes.</p>
	</div>
	<div class="stage-board">
		<div class="row">
			<amb-button>Save changes</amb-button>
			<amb-button variant="secondary">Cancel</amb-button>
			<amb-button variant="ghost">Learn more</amb-button>
		</div>
		<amb-text-field name="email" type="email" autocomplete="email" placeholder="ada@example.com">
			Email
		</amb-text-field>
		<p class="stage-note">
			Read the <amb-link href="/foundations/color">color decisions</amb-link>
			or the <amb-link href="/get-started" variant="quiet">install guide</amb-link>.
		</p>
	</div>
</section>

<h2>Start here</h2>
<ul class="atlas enter enter-6">
	<li>
		<a href="/foundations/color">
			<span class="atlas-swatch" aria-hidden="true">
				<i></i><i></i><i></i><i></i>
			</span>
			<strong>Color</strong>
			<small>Semantic decisions. The palette stays in the token files.</small>
		</a>
	</li>
	<li>
		<a href="/foundations/typography">
			<span class="atlas-type" aria-hidden="true">Aa</span>
			<strong>Type</strong>
			<small>The face, the scale, and the weight follow the preset.</small>
		</a>
	</li>
	<li>
		<a href="/foundations/space">
			<span class="atlas-bars" aria-hidden="true"><i></i><i></i><i></i></span>
			<strong>Space</strong>
			<small>Rhythm, corners, and the height of a control.</small>
		</a>
	</li>
	<li>
		<a href="/foundations/motion">
			<span class="atlas-bars" aria-hidden="true"><i></i><i></i><i></i></span>
			<strong>Motion</strong>
			<small>Arrival, exit, and the cycle of a spinner.</small>
		</a>
	</li>
	<li>
		<a href="/components">
			<span class="atlas-mark" aria-hidden="true"></span>
			<strong>Components</strong>
			<small>Actions, forms, status, and a way through.</small>
		</a>
	</li>
</ul>

<section class="invite">
	<h2>Every state lives in Storybook.</h2>
	<p>Variants, sizes, both themes, every brand, and the accessibility panel.</p>
	<a class="action" href={storybookUrl} target="_blank" rel="external noreferrer">Open Storybook</a>
</section>
