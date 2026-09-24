<script lang="ts">
	import { onMount } from 'svelte';
	import data from '@ambre-ds/tokens/json';
	import CodeBlock from '$lib/CodeBlock.svelte';
	import Stage from '$lib/Stage.svelte';
	import { brands } from '$lib/brands';
	import { preview } from '$lib/preview.svelte';
	import { byPrefix, tokens, type TokenRecord } from '$lib/tokens';

	type Entry = { path: string; value: string | number };
	const presets = (data as unknown as { presets?: Record<string, { light: Entry[] }> }).presets ?? {};

	/** The value a token has in the preview brand, falling back to Ambre's. */
	function valueOf(token: TokenRecord, brand: string) {
		return presets[brand]?.light.find((entry) => entry.path === token.path)?.value ?? token.value;
	}

	const brandName = $derived(brands.find((brand) => brand.id === preview.brand)?.name ?? 'Ambre');
	const name = (token: TokenRecord) => token.path.split('.').at(-1) ?? token.path;

	const durationOrder = ['fast', 'moderate', 'slow', 'loop'];
	const durations = [...byPrefix(tokens.system, 'duration.')].sort(
		(a, b) => durationOrder.indexOf(name(a)) - durationOrder.indexOf(name(b))
	);
	const timed = durations.filter((token) => name(token) !== 'loop');
	const easingOrder = ['standard', 'enter', 'exit', 'spring'];
	const easings = [...byPrefix(tokens.system, 'easing.')].sort(
		(a, b) => easingOrder.indexOf(name(a)) - easingOrder.indexOf(name(b))
	);

	let durationRun = $state(0);
	let easingRun = $state(0);
	let springRun = $state(0);
	let reduced = $state(false);

	onMount(() => {
		const query = matchMedia('(prefers-reduced-motion: reduce)');
		const read = () => (reduced = query.matches);
		read();
		query.addEventListener('change', read);
		return () => query.removeEventListener('change', read);
	});

	const loop = durations.find((token) => name(token) === 'loop');

	const keyframes = `@keyframes run {
  from { translate: 0 0; }
  to { translate: 100% 0; }
}`;

	const durationCode = `${keyframes}

${timed
	.map((token) => `.dot-${name(token)} { animation: run var(${token.css}) var(--amb-easing-standard) both; }`)
	.join('\n')}

<amb-spinner label="Loading orders"></amb-spinner>`;

	const easingCode = `${keyframes}

${easings
	.map((token) => `.dot-${name(token)} { animation: run calc(var(--amb-duration-slow) * 3) var(${token.css}) both; }`)
	.join('\n')}`;

	const springCode = `<div style="animation: settle calc(var(--amb-duration-slow) * 2) var(--amb-easing-standard) both">standard</div>
<div style="animation: settle calc(var(--amb-duration-slow) * 2) var(--amb-easing-spring) both">spring</div>

<amb-toggle checked>Email updates</amb-toggle>
<amb-checkbox checked>Save my address</amb-checkbox>`;

	const reducedCode = `@media (prefers-reduced-motion: reduce) {
  .panel {
    transition: none;
    animation: none;
  }
}`;

	const easingUse: Record<string, string> = {
		standard: 'Changes in place: hover, press, and color.',
		enter: 'Something arriving. It decelerates into place.',
		exit: 'Something leaving. It accelerates away.',
		spring: 'A small overshoot for a transform that settles. Never color or opacity.'
	};
</script>

<svelte:head>
	<title>Motion — Ambre</title>
	<meta
		name="description"
		content="Ambre durations and easing curves, with replayable demos. A brand preset replaces the timing."
	/>
</svelte:head>

<header class="doc-header">
	<p class="eyebrow"><a href="/foundations">Foundations</a></p>
	<h1>Motion</h1>
	<p class="lede">
		Motion explains a change: where something came from, where it went, and that an action landed. Four durations
		and four curves cover it. A brand replaces the numbers.
	</p>
</header>

{#if reduced}
	<p class="reduced-note">
		Your system asks for reduced motion. The demos jump to their end state, as components do.
	</p>
{/if}

<h2 id="duration">Duration</h2>
<p class="section-lede">
	Short for small changes, longer for large surfaces. Each bar below runs at its real speed with
	<code>easing.standard</code>. Values are {brandName}’s.
</p>
<Stage label="Duration" align="stretch" padding="md" code={durationCode} lang="css">
	<div class="demo-bar">
		<button class="replay" type="button" onclick={() => durationRun++}>Replay</button>
	</div>
	{#key durationRun}
		<ul class="lanes">
			{#each timed as token}
				<li class="lane">
					<span class="lane-meta">
						<code class="token-name">{name(token)}</code>
						<span class="token-value">{valueOf(token, preview.brand)}</span>
					</span>
					<span class="track">
						<span
							class="runner"
							style:--run-duration="var({token.css})"
							style:--run-easing="var(--amb-easing-standard)"
						></span>
					</span>
				</li>
			{/each}
		</ul>
	{/key}
	<div class="loop-row">
		<amb-spinner label="Loading orders"></amb-spinner>
		<span class="lane-meta">
			<code class="token-name">loop</code>
			{#if loop}
				<span class="token-value">{valueOf(loop, preview.brand)} per cycle</span>
			{/if}
		</span>
	</div>
</Stage>

<div class="table-wrap">
	<table class="api">
		<thead>
			<tr>
				<th scope="col">Token</th>
				<th scope="col">{brandName}</th>
				<th scope="col">Use</th>
			</tr>
		</thead>
		<tbody>
			{#each durations as token}
				<tr>
					<th scope="row"><code>{token.css}</code></th>
					<td>{valueOf(token, preview.brand)}</td>
					<td>{token.description}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<h2 id="easing">Easing</h2>
<p class="section-lede">
	The curve says what kind of change it is. The demo runs each curve over three times
	<code>duration.slow</code> so the shape is visible.
</p>
<Stage label="Easing" align="stretch" padding="md" code={easingCode} lang="css">
	<div class="demo-bar">
		<button class="replay" type="button" onclick={() => easingRun++}>Replay</button>
	</div>
	{#key easingRun}
		<ul class="lanes">
			{#each easings as token}
				<li class="lane">
					<span class="lane-meta">
						<code class="token-name">{name(token)}</code>
					</span>
					<span class="track">
						<span
							class="runner"
							style:--run-duration="calc(var(--amb-duration-slow) * 3)"
							style:--run-easing="var({token.css})"
						></span>
					</span>
				</li>
			{/each}
		</ul>
	{/key}
</Stage>

<div class="table-wrap">
	<table class="api">
		<thead>
			<tr>
				<th scope="col">Token</th>
				<th scope="col">{brandName}</th>
				<th scope="col">Use</th>
			</tr>
		</thead>
		<tbody>
			{#each easings as token}
				<tr>
					<th scope="row"><code>{token.css}</code></th>
					<td><code>{valueOf(token, preview.brand)}</code></td>
					<td>{easingUse[name(token)] ?? token.description}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<h2 id="spring">Spring</h2>
<p class="section-lede">
	<code>easing.spring</code> overshoots by a few percent and settles. Use it for a transform that confirms an
	action: a toggle thumb, a checkmark, a card released after a press. It runs on <code>translate</code>,
	<code>scale</code>, and <code>rotate</code> only. On color or opacity an overshoot reads as a flicker.
</p>
<Stage label="Spring" code={springCode}>
	<div class="demo-bar">
		<button class="replay" type="button" onclick={() => springRun++}>Replay</button>
	</div>
	{#key springRun}
		<div class="spring-row">
			<span class="settle settle-standard">
				<span class="settle-name">standard</span>
			</span>
			<span class="settle settle-spring">
				<span class="settle-name">spring</span>
			</span>
		</div>
	{/key}
	<div class="spring-controls">
		<amb-toggle checked>Email updates</amb-toggle>
		<amb-checkbox checked>Save my address</amb-checkbox>
	</div>
</Stage>

<h2 id="reduced-motion">Reduced motion</h2>
<p>
	When the system asks for reduced motion, Ambre components drop their transitions and entrance animations.
	Content appears in its final place. A spinner keeps its label, so the wait is still announced.
</p>
<p>Honor the same setting in product code:</p>
<CodeBlock code={reducedCode} lang="css" />

<h2 id="guidance">Guidance</h2>
<div class="guidance">
	<section class="guidance-card" data-kind="do">
		<h3>Do</h3>
		<ul>
			<li>Enter with <code>easing.enter</code> and leave with <code>easing.exit</code>. Leaving is faster than arriving.</li>
			<li>Use <code>duration.fast</code> for hover and press, <code>moderate</code> for menus, <code>slow</code> for dialogs and sheets.</li>
			<li>Keep <code>easing.spring</code> on transforms. Pair it with a standard curve for color on the same element.</li>
			<li>Test every flow with reduced motion on. Nothing should depend on seeing the animation.</li>
		</ul>
	</section>
	<section class="guidance-card" data-kind="dont">
		<h3>Don’t</h3>
		<ul>
			<li>Don’t spring a color, a border, or opacity. The overshoot shows as a flash.</li>
			<li>Don’t animate layout properties such as <code>width</code> or <code>top</code>. Animate <code>translate</code> and <code>scale</code>.</li>
			<li>Don’t loop anything except a progress indicator. Use <code>duration.loop</code> for it.</li>
			<li>Don’t hard-code milliseconds. A brand such as Noir slows every duration.</li>
		</ul>
	</section>
</div>

<style>
	.reduced-note {
		padding: 12px 16px;
		border: 1px solid var(--rule-strong);
		border-radius: 12px;
		background: var(--amb-color-bg-subtle);
		color: var(--amb-color-fg-default) !important;
		font-size: 15px;
	}

	.demo-bar {
		display: flex;
		justify-content: flex-end;
		width: 100%;
	}

	.replay {
		display: inline-flex;
		align-items: center;
		height: var(--amb-size-control-sm);
		padding-inline: var(--amb-space-400);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-action);
		background: var(--amb-color-bg-surface);
		box-shadow: var(--amb-elevation-1);
		color: var(--amb-color-fg-default);
		font: inherit;
		font-size: var(--amb-font-size-200);
		font-weight: var(--amb-font-weight-semibold);
		cursor: pointer;
		transition: background-color var(--amb-duration-fast) var(--amb-easing-standard);
	}

	.replay:hover {
		background: var(--amb-color-bg-subtle);
	}

	.replay:focus-visible {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
	}

	.lanes {
		display: grid;
		gap: var(--amb-space-300);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.lane {
		display: grid;
		grid-template-columns: 9rem minmax(0, 1fr);
		align-items: center;
		gap: var(--amb-space-400);
	}

	.lane-meta {
		display: inline-flex;
		gap: var(--amb-space-200);
		align-items: baseline;
	}

	.token-name {
		color: var(--amb-color-fg-default);
		font-family: var(--amb-font-family-mono);
		font-size: var(--amb-font-size-200);
	}

	.token-value {
		color: var(--amb-color-fg-subtle);
		font-size: var(--amb-font-size-200);
	}

	/* The runner spans the track minus one dot, so translating it by 100% of itself lands the dot at the end. */
	.track {
		--dot: var(--amb-space-500);
		display: block;
		height: var(--dot);
		border-radius: var(--amb-radius-full);
		background: var(--amb-color-bg-subtle);
		box-shadow: var(--amb-elevation-inset);
	}

	.runner {
		display: block;
		width: calc(100% - var(--dot));
		height: 100%;
		animation-name: run;
		animation-duration: var(--run-duration);
		animation-timing-function: var(--run-easing);
		animation-fill-mode: both;
	}

	.runner::before {
		content: '';
		display: block;
		width: var(--dot);
		height: var(--dot);
		border-radius: var(--amb-radius-full);
		background: var(--amb-color-accent-bg);
		box-shadow:
			inset 0 1px 0 var(--amb-color-highlight),
			var(--amb-elevation-1);
	}

	@keyframes run {
		from {
			translate: 0 0;
		}
		to {
			translate: 100% 0;
		}
	}

	.loop-row {
		display: flex;
		align-items: center;
		gap: var(--amb-space-400);
		padding-top: var(--amb-space-200);
	}

	.spring-row,
	.spring-controls {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--amb-space-600);
		width: 100%;
	}

	.settle {
		display: grid;
		place-items: center;
		width: 7rem;
		height: 7rem;
		border: var(--amb-border-width-default) solid var(--amb-color-border-disabled);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-surface);
		box-shadow: var(--amb-elevation-2);
		animation-name: settle;
		animation-duration: calc(var(--amb-duration-slow) * 2);
		animation-fill-mode: both;
	}

	.settle-standard {
		animation-timing-function: var(--amb-easing-standard);
	}

	.settle-spring {
		animation-timing-function: var(--amb-easing-spring);
	}

	.settle-name {
		color: var(--amb-color-fg-muted);
		font-family: var(--amb-font-family-mono);
		font-size: var(--amb-font-size-200);
	}

	@keyframes settle {
		from {
			scale: 0.6;
		}
		to {
			scale: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.runner,
		.settle {
			animation: none;
		}

		.runner {
			translate: 100% 0;
		}
	}

	@media (max-width: 560px) {
		.lane {
			grid-template-columns: minmax(0, 1fr);
			gap: var(--amb-space-100);
		}
	}
</style>
