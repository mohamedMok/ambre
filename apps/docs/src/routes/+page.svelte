<script lang="ts">
	import { onMount } from 'svelte';
	import pairs from '../../../../packages/tokens/src/contrast-pairs.json';
	import CodeBlock from '$lib/CodeBlock.svelte';
	import Glyph from '$lib/Glyph.svelte';
	import { brands, scope } from '$lib/brands';
	import { preview, setPreviewBrand } from '$lib/preview.svelte';
	import { componentGroups, components } from '$lib/sections';
	import { storybookUrl } from '$lib/site';

	let siteTheme = $state<string | null>(null);
	const active = $derived(brands.find((brand) => brand.id === preview.brand) ?? brands[0]);
	const attrs = $derived(scope(preview.brand, siteTheme));
	const checks = pairs.length * brands.length;

	onMount(() => {
		const root = document.documentElement;
		const read = () => (siteTheme = root.dataset.theme === 'dark' ? 'dark' : 'light');
		read();
		const observer = new MutationObserver(read);
		observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
		return () => observer.disconnect();
	});

	const pillars = [
		{
			icon: 'shield',
			title: 'Accessible by construction',
			body: 'WCAG 2.2 AA is the floor. Native elements carry the roles, every control has a visible focus ring, and every text pair is checked in every brand on every build.'
		},
		{
			icon: 'blocks',
			title: 'One library, any framework',
			body: 'Standard custom elements with open shadow roots and form association. Use the same tags in React, Vue, Angular, Svelte, or plain HTML.'
		},
		{
			icon: 'layers',
			title: 'A brand is data',
			body: 'Type, shape, borders, space, control size, focus, motion, and color live in one preset file. Components never change to fit a brand.'
		},
		{
			icon: 'scale',
			title: 'Governed like an API',
			body: 'Every component has a contract. Decisions are recorded as ADRs. CI fails on drift between contract, code, and manifest, or on a raw color.'
		}
	];

	const usage = `<html data-brand="atlas" data-theme="dark">
  <amb-text-field name="email" type="email">Work email</amb-text-field>
  <amb-button type="submit">Request access</amb-button>
</html>`;
</script>

<svelte:head>
	<title>Ambre — One library. Any brand.</title>
	<meta
		name="description"
		content="Ambre is an open-source design system: accessible web components on one set of semantic tokens. A brand is one preset file."
	/>
</svelte:head>

<section class="hero">
	<div class="hero-copy">
		<p class="eyebrow">Open-source design system</p>
		<h1>One library.<br />Any brand.</h1>
		<p class="hero-lede">
			Accessible web components on one set of semantic tokens. A brand is a single preset file: type,
			shape, space, motion, and color change. The markup stays still.
		</p>
		<div class="hero-actions">
			<a class="btn btn-primary" href="/get-started">Get started <Glyph name="arrow" size={18} /></a>
			<a class="btn btn-secondary" href="/components">Browse components</a>
		</div>
		<ul class="hero-facts" aria-label="At a glance">
			<li>MIT license</li>
			<li>WCAG 2.2 AA</li>
			<li>Any framework</li>
		</ul>
	</div>

	<div class="theater">
		<div class="theater-bar">
			<span class="theater-label" id="brand-picker-label">Preview as</span>
			<div class="brand-picker" role="radiogroup" aria-labelledby="brand-picker-label">
				{#each brands as brand}
					<button
						type="button"
						role="radio"
						aria-checked={preview.brand === brand.id}
						onclick={() => setPreviewBrand(brand.id)}
					>
						{brand.name}
					</button>
				{/each}
			</div>
		</div>

		<div class="theater-canvas" {...attrs}>
			<div class="app-card">
				<div class="app-head">
					<div>
						<p class="app-kicker">Workspace</p>
						<h2 class="app-title">Northwind settings</h2>
					</div>
					<amb-badge variant="accent">Business</amb-badge>
				</div>
				<div class="app-grid">
					<amb-text-field name="workspace" value="Northwind">Workspace name</amb-text-field>
					<amb-select name="region">
						Data region
						<option value="eu">Europe (Frankfurt)</option>
						<option value="us">United States (Virginia)</option>
					</amb-select>
				</div>
				<amb-toggle name="sso" checked>Require single sign-on</amb-toggle>
				<amb-progress value="72" max="100" label="Seats used: 72 of 100"></amb-progress>
				<div class="app-actions">
					<amb-button variant="ghost">View audit log</amb-button>
					<span class="spacer"></span>
					<amb-button variant="secondary">Cancel</amb-button>
					<amb-button>Save changes</amb-button>
				</div>
			</div>
			<div class="app-toast">
				<amb-banner variant="success">Single sign-on is on for 72 members.</amb-banner>
			</div>
		</div>

		<p class="theater-caption" aria-live="polite">
			<strong>{active.name}</strong> · {active.sector}. {active.summary}
		</p>
	</div>
</section>

<section class="proof" aria-label="By the numbers">
	<div class="proof-item"><strong>{components.length}</strong><span>components with contracts</span></div>
	<div class="proof-item"><strong>{brands.length}</strong><span>brand presets on one token set</span></div>
	<div class="proof-item"><strong>{checks}</strong><span>contrast checks on every build</span></div>
	<div class="proof-item"><strong>2</strong><span>themes per brand, light and dark</span></div>
</section>

<section class="band">
	<div class="band-head">
		<p class="eyebrow">Why Ambre</p>
		<h2>Built for teams that ship many products.</h2>
	</div>
	<ul class="pillars">
		{#each pillars as pillar}
			<li class="pillar">
				<span class="pillar-icon"><Glyph name={pillar.icon} size={22} /></span>
				<h3>{pillar.title}</h3>
				<p>{pillar.body}</p>
			</li>
		{/each}
	</ul>
</section>

<section class="band tiers-band">
	<div class="split">
		<div>
			<p class="eyebrow">How theming works</p>
			<h2>Three tiers. One is public.</h2>
			<p class="band-lede">
				Reference tokens hold the raw palette and scale. System tokens are the decisions a product may
				override. Components read only system tokens, so a brand changes everything without touching a
				single element.
			</p>
			<a class="text-link" href="/foundations">Read the foundations <Glyph name="arrow" size={16} /></a>
		</div>
		<ol class="tiers" aria-label="Token tiers">
			<li class="tier">
				<span class="tier-step">1</span>
				<div>
					<strong>Reference</strong>
					<span>Palette and dimension scale. Never emitted as CSS.</span>
					<code>color.amber.600</code>
				</div>
			</li>
			<li class="tier tier-public">
				<span class="tier-step">2</span>
				<div>
					<strong>System <em>public API</em></strong>
					<span>Decisions for two themes. A preset replaces them.</span>
					<code>--amb-color-accent-bg</code>
				</div>
			</li>
			<li class="tier">
				<span class="tier-step">3</span>
				<div>
					<strong>Component</strong>
					<span>Custom elements that read system tokens only.</span>
					<code>&lt;amb-button&gt;</code>
				</div>
			</li>
		</ol>
	</div>
</section>

<section class="band">
	<div class="split split-code">
		<div>
			<p class="eyebrow">Same markup</p>
			<h2>Switch a brand with one attribute.</h2>
			<p class="band-lede">
				Load the tokens and presets once. Set <code>data-brand</code> and <code>data-theme</code> on any ancestor,
				from the whole page down to a single panel.
			</p>
		</div>
		<CodeBlock code={usage} lang="html" />
	</div>
</section>

<section class="band">
	<div class="band-head">
		<p class="eyebrow">Components</p>
		<h2>Actions, forms, feedback, and a way through.</h2>
	</div>
	<ul class="card-grid families">
		{#each componentGroups as group}
			<li>
				<a class="card-link" href={`/components#${group.title.toLowerCase()}`}>
					<strong>{group.title}</strong>
					<span>{group.summary}</span>
					<span class="family-count">{group.items.length} components</span>
				</a>
			</li>
		{/each}
	</ul>
</section>

<section class="cta">
	<h2>Start with the tokens. Keep your brand.</h2>
	<p>Build the packages, load the theme, and put the first element on the page in minutes.</p>
	<div class="hero-actions">
		<a class="btn btn-primary" href="/get-started">Get started <Glyph name="arrow" size={18} /></a>
		<a class="btn btn-secondary" href={storybookUrl} target="_blank" rel="external noreferrer">Open Storybook</a>
	</div>
</section>

<style>
	.hero,
	.proof,
	.band,
	.cta {
		width: min(1200px, calc(100% - 2 * var(--gutter)));
		margin-inline: auto;
	}

	.hero {
		display: grid;
		grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
		align-items: center;
		gap: clamp(32px, 5vw, 72px);
		padding-block: clamp(48px, 8vw, 104px) 56px;
	}

	h1 {
		margin: 0;
		font-size: clamp(44px, 6.4vw, 76px);
		font-weight: 700;
		line-height: 0.98;
		letter-spacing: -0.04em;
	}

	.hero-lede {
		max-width: 34rem;
		margin: 24px 0 0;
		color: var(--amb-color-fg-muted);
		font-size: clamp(18px, 1.6vw, 20px);
		line-height: 1.55;
		text-wrap: pretty;
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 32px;
	}

	.hero-facts {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 20px;
		margin: 28px 0 0;
		padding: 0;
		list-style: none;
		color: var(--amb-color-fg-subtle);
		font-size: 14px;
	}

	.hero-facts li {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	.hero-facts li::before {
		content: '';
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--amb-color-accent-bg);
	}

	/* ---- The brand theater ---- */

	.theater {
		min-width: 0;
		overflow: hidden;
		border: 1px solid var(--rule-strong);
		border-radius: 22px;
		background: var(--amb-color-bg-surface);
		box-shadow:
			inset 0 1px 0 var(--amb-color-highlight),
			var(--amb-elevation-3);
	}

	.theater-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
		padding: 12px 12px 12px 18px;
		border-bottom: 1px solid var(--rule);
	}

	.theater-label {
		color: var(--amb-color-fg-subtle);
		font-size: 13px;
		font-weight: var(--amb-font-weight-semibold);
	}

	.brand-picker {
		display: flex;
		flex-wrap: wrap;
		gap: 2px;
		padding: 3px;
		border-radius: 999px;
		background: var(--amb-color-bg-subtle);
		box-shadow: var(--amb-elevation-inset);
	}

	.brand-picker button {
		height: 30px;
		padding-inline: 14px;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--amb-color-fg-muted);
		font: inherit;
		font-size: 14px;
		font-weight: var(--amb-font-weight-medium);
		cursor: pointer;
		transition:
			background-color var(--amb-duration-fast) var(--amb-easing-standard),
			color var(--amb-duration-fast) var(--amb-easing-standard);
	}

	.brand-picker button:hover {
		color: var(--amb-color-fg-default);
	}

	.brand-picker button[aria-checked='true'] {
		background: var(--amb-color-bg-surface);
		box-shadow:
			inset 0 1px 0 var(--amb-color-highlight),
			var(--amb-elevation-1);
		color: var(--amb-color-fg-default);
		font-weight: var(--amb-font-weight-semibold);
	}

	.theater-canvas {
		position: relative;
		padding: clamp(24px, 4vw, 44px) clamp(20px, 4vw, 44px) 76px;
		background-color: var(--amb-color-bg-canvas);
		background-image: radial-gradient(
			color-mix(in oklab, var(--amb-color-border-default) 26%, transparent) 1px,
			transparent 1px
		);
		background-size: 20px 20px;
		color: var(--amb-color-fg-default);
		font-family: var(--amb-font-family-sans);
		font-size: var(--amb-font-size-300);
		line-height: var(--amb-font-line-height-body);
		transition: background-color var(--amb-duration-moderate) var(--amb-easing-standard);
	}

	.app-card {
		display: grid;
		gap: var(--amb-space-500);
		padding: var(--amb-space-600);
		border: var(--amb-border-width-default) solid
			color-mix(in oklab, var(--amb-color-border-default) 45%, transparent);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-surface);
		box-shadow:
			inset 0 1px 0 var(--amb-color-highlight),
			var(--amb-elevation-2);
	}

	.app-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--amb-space-400);
	}

	.app-kicker {
		margin: 0 0 var(--amb-space-100);
		color: var(--amb-color-fg-subtle);
		font-size: var(--amb-font-size-100);
		font-weight: var(--amb-font-weight-semibold);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.app-title {
		margin: 0;
		color: var(--amb-color-fg-default);
		font-size: var(--amb-font-size-600);
		font-weight: var(--amb-font-weight-semibold);
		line-height: var(--amb-font-line-height-tight);
	}

	.app-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--amb-space-400);
	}

	.app-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--amb-space-300);
		padding-top: var(--amb-space-400);
		border-top: var(--amb-border-width-default) solid
			color-mix(in oklab, var(--amb-color-border-default) 30%, transparent);
	}

	.spacer {
		flex: 1;
	}

	.app-toast {
		position: absolute;
		left: clamp(12px, 3vw, 28px);
		bottom: 18px;
		width: min(360px, calc(100% - 24px));
		filter: drop-shadow(0 10px 18px color-mix(in oklab, var(--amb-color-bg-inverse) 18%, transparent));
	}

	.theater-caption {
		margin: 0;
		padding: 14px 18px;
		border-top: 1px solid var(--rule);
		color: var(--amb-color-fg-muted);
		font-size: 14px;
	}

	.theater-caption strong {
		color: var(--amb-color-fg-default);
	}

	/* ---- Proof strip ---- */

	.proof {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		margin-block: 24px 16px;
		border-block: 1px solid var(--rule);
	}

	.proof-item {
		display: grid;
		gap: 4px;
		padding: 28px 24px;
	}

	.proof-item + .proof-item {
		border-left: 1px solid var(--rule);
	}

	.proof-item strong {
		font-size: clamp(32px, 3.4vw, 44px);
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.03em;
		font-variant-numeric: tabular-nums;
	}

	.proof-item span {
		color: var(--amb-color-fg-muted);
		font-size: 15px;
	}

	/* ---- Bands ---- */

	.band {
		padding-block: clamp(56px, 8vw, 96px) 0;
	}

	.band h2,
	.cta h2 {
		max-width: 22ch;
		margin: 0;
		font-size: clamp(30px, 3.6vw, 44px);
		font-weight: 700;
		line-height: 1.08;
		letter-spacing: -0.03em;
		text-wrap: balance;
	}

	.band-head {
		margin-bottom: 32px;
	}

	.band-lede {
		max-width: 36rem;
		margin: 18px 0 0;
		color: var(--amb-color-fg-muted);
		font-size: 18px;
		line-height: 1.6;
	}

	.pillars {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 16px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.pillar {
		padding: 24px;
		border: 1px solid var(--rule-strong);
		border-radius: 18px;
		background: var(--amb-color-bg-surface);
	}

	.pillar-icon {
		display: inline-grid;
		place-items: center;
		width: 44px;
		height: 44px;
		margin-bottom: 18px;
		border-radius: 12px;
		background: color-mix(in oklab, var(--amb-color-accent-fg) 12%, var(--amb-color-bg-surface));
		color: var(--amb-color-accent-fg);
	}

	.pillar h3 {
		margin: 0 0 8px;
		font-size: 18px;
		line-height: 1.3;
	}

	.pillar p {
		margin: 0;
		color: var(--amb-color-fg-muted);
		font-size: 15px;
		line-height: 1.6;
	}

	.split {
		display: grid;
		grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
		align-items: center;
		gap: clamp(32px, 5vw, 72px);
	}

	.split-code :global(.code) {
		margin: 0;
		box-shadow: var(--amb-elevation-2);
	}

	.text-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-top: 22px;
		font-weight: var(--amb-font-weight-semibold);
		text-decoration: none;
	}

	.tiers {
		display: grid;
		gap: 12px;
		margin: 0;
		padding: 0;
		list-style: none;
		counter-reset: tier;
	}

	.tier {
		position: relative;
		display: flex;
		gap: 18px;
		padding: 20px 22px;
		border: 1px solid var(--rule-strong);
		border-radius: 16px;
		background: var(--amb-color-bg-surface);
	}

	.tier + .tier::before {
		content: '';
		position: absolute;
		left: 39px;
		top: -13px;
		width: 2px;
		height: 12px;
		background: var(--rule-strong);
	}

	.tier-public {
		border-color: color-mix(in oklab, var(--amb-color-accent-fg) 45%, transparent);
		background: color-mix(in oklab, var(--amb-color-accent-fg) 6%, var(--amb-color-bg-surface));
		box-shadow: var(--amb-elevation-2);
	}

	.tier-step {
		display: grid;
		flex: none;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--amb-color-bg-subtle);
		color: var(--amb-color-fg-muted);
		font-weight: 700;
	}

	.tier-public .tier-step {
		background: var(--amb-color-accent-bg);
		color: var(--amb-color-fg-on-accent);
	}

	.tier div {
		display: grid;
		gap: 4px;
	}

	.tier strong {
		font-size: 17px;
	}

	.tier em {
		margin-left: 8px;
		color: var(--amb-color-accent-fg);
		font-size: 12px;
		font-style: normal;
		font-weight: var(--amb-font-weight-semibold);
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.tier span {
		color: var(--amb-color-fg-muted);
		font-size: 15px;
	}

	.tier code {
		justify-self: start;
		margin-top: 4px;
	}

	.families .family-count {
		margin-top: auto;
		padding-top: 10px;
		color: var(--amb-color-accent-fg);
		font-size: 13px;
		font-weight: var(--amb-font-weight-semibold);
	}

	.cta {
		margin-block: clamp(72px, 10vw, 120px);
		padding: clamp(40px, 6vw, 72px);
		border: 1px solid var(--rule-strong);
		border-radius: 28px;
		background-color: var(--amb-color-bg-surface);
		background-image: radial-gradient(
			color-mix(in oklab, var(--amb-color-border-default) 24%, transparent) 1px,
			transparent 1px
		);
		background-size: 22px 22px;
		box-shadow: inset 0 1px 0 var(--amb-color-highlight);
		text-align: center;
	}

	.cta h2 {
		margin-inline: auto;
	}

	.cta p {
		max-width: 34rem;
		margin: 16px auto 0;
		color: var(--amb-color-fg-muted);
		font-size: 18px;
	}

	.cta .hero-actions {
		justify-content: center;
	}

	@media (max-width: 1080px) {
		.hero,
		.split {
			grid-template-columns: 1fr;
		}

		.pillars {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 720px) {
		.proof {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.proof-item:nth-child(3) {
			border-left: 0;
		}

		.proof-item:nth-child(n + 3) {
			border-top: 1px solid var(--rule);
		}

		.pillars {
			grid-template-columns: 1fr;
		}

		.app-toast {
			position: static;
			width: auto;
			margin-top: var(--amb-space-400);
		}

		.theater-canvas {
			padding-bottom: clamp(24px, 4vw, 44px);
		}
	}
</style>
