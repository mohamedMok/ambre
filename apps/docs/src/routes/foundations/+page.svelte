<script lang="ts">
	import { foundations } from '$lib/sections';
</script>

<svelte:head>
	<title>Foundations — Ambre</title>
	<meta
		name="description"
		content="Color, typography, space, motion, and accessibility. The decisions every Ambre component reads, and the ones a brand overrides."
	/>
</svelte:head>

<header class="doc-header">
	<p class="eyebrow">Design language</p>
	<h1>Foundations</h1>
	<p class="lede">
		Every component reads the same set of decisions: color, type, space, motion, and the accessibility floor under
		them. A brand changes the decisions. The components stay the same.
	</p>
</header>

<h2 id="topics">Topics</h2>
<ul class="card-grid">
	{#each foundations as item}
		<li>
			<a class="card-link" href={item.href}>
				<strong>{item.label}</strong>
				<span>{item.summary}</span>
			</a>
		</li>
	{/each}
</ul>

<h2 id="tiers">Three tiers</h2>
<p class="section-lede">
	Tokens come in three tiers. Each tier reads only from the one before it, so a value changes in one place.
</p>

<ol class="tiers" aria-label="Token tiers, from raw value to component">
	<li class="tier">
		<p class="tier-name">Reference</p>
		<p class="tier-role">The raw palette and scale. It has no meaning yet.</p>
		<p class="tier-example">
			<span class="tier-swatch" aria-hidden="true"></span>
			<code>color.amber.600</code>
			<span class="tier-value">#a65e0a</span>
		</p>
		<p class="tier-rule">Private. Not emitted as a CSS variable.</p>
	</li>
	<li class="tier-arrow" aria-hidden="true"></li>
	<li class="tier tier-api">
		<p class="tier-name">System</p>
		<p class="tier-role">A decision with a name: what the value is for.</p>
		<p class="tier-example">
			<span class="tier-swatch" aria-hidden="true"></span>
			<code>--amb-color-accent-bg</code>
		</p>
		<p class="tier-rule">Public. This is the theme API a brand overrides.</p>
	</li>
	<li class="tier-arrow" aria-hidden="true"></li>
	<li class="tier">
		<p class="tier-name">Component</p>
		<p class="tier-role">A part of an element that reads a system token.</p>
		<p class="tier-example">
			<code>amb-button</code>
			<span class="tier-value">primary fill</span>
		</p>
		<p class="tier-rule">A component token exists only when a second component needs the same decision.</p>
	</li>
</ol>

<p>
	Theme a product at the system tier. Override <code>--amb-color-accent-bg</code>, not the amber ramp, and not
	the button. The <a href="/brands">brand presets</a> are system-tier overrides and nothing else.
</p>

<style>
	.tiers {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 28px minmax(0, 1fr) 28px minmax(0, 1fr);
		align-items: stretch;
		margin: 24px 0;
		padding: 0;
		list-style: none;
	}

	.tier {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 18px 18px 16px;
		border: 1px solid var(--rule-strong);
		border-radius: 14px;
		background: var(--amb-color-bg-surface);
	}

	.tier-api {
		border-color: color-mix(in oklab, var(--amb-color-accent-fg) 55%, transparent);
		box-shadow: var(--amb-elevation-1);
	}

	.tier p {
		margin: 0;
	}

	.tier-name {
		color: var(--amb-color-fg-default);
		font-size: 16px;
		font-weight: var(--amb-font-weight-semibold);
	}

	.tier-api .tier-name {
		color: var(--amb-color-accent-fg);
	}

	.tier-role {
		font-size: 14px;
		line-height: 1.5;
	}

	.tier-example {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		margin-top: auto !important;
		padding-top: 8px;
	}

	.tier-swatch {
		width: 18px;
		height: 18px;
		border-radius: 6px;
		background: #a65e0a;
		box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--amb-color-fg-default) 16%, transparent);
	}

	.tier-api .tier-swatch {
		background: var(--amb-color-accent-bg);
	}

	.tier-value {
		color: var(--amb-color-fg-subtle);
		font-family: var(--amb-font-family-mono);
		font-size: 13px;
	}

	.tier-rule {
		padding-top: 10px;
		border-top: 1px solid var(--rule);
		color: var(--amb-color-fg-subtle) !important;
		font-size: 13px;
		line-height: 1.45;
	}

	.tier-arrow {
		position: relative;
		align-self: center;
		height: 2px;
		margin-inline: 4px;
		background: var(--rule-strong);
	}

	.tier-arrow::after {
		content: '';
		position: absolute;
		right: -1px;
		top: 50%;
		width: 8px;
		height: 8px;
		border-top: 2px solid var(--rule-strong);
		border-right: 2px solid var(--rule-strong);
		translate: 0 -50%;
		rotate: 45deg;
	}

	@media (max-width: 720px) {
		.tiers {
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: auto;
		}

		.tier-arrow {
			justify-self: center;
			width: 2px;
			height: 24px;
			margin: 4px 0;
		}

		.tier-arrow::after {
			right: auto;
			top: auto;
			bottom: -1px;
			left: 50%;
			translate: -50% 0;
			rotate: 135deg;
		}
	}

	@media (forced-colors: active) {
		.tier {
			border: 1px solid CanvasText;
		}

		.tier-arrow {
			background: CanvasText;
		}

		.tier-arrow::after {
			border-color: CanvasText;
		}
	}
</style>
