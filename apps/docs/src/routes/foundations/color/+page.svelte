<script lang="ts">
	import { families, tokens } from '$lib/tokens';

	const palette = families(tokens.reference.filter((token) => token.type === 'color'));
	const semantic = families(tokens.system.filter((token) => token.type === 'color'));
	let copied = $state('');

	async function copy(value: string) {
		copied = value;
		try {
			await navigator.clipboard.writeText(value);
		} catch {
			// Clipboard can be denied. The announcement already shows the value.
		}
	}
</script>

<svelte:head>
	<title>Color — Ambre</title>
	<meta name="description" content="Ambre color tokens. Reference palette and semantic theme API." />
</svelte:head>

<p class="eyebrow">Foundations</p>
<h1>Color</h1>
<ul class="film" aria-label="Theme colors">
	<li class="film-canvas">--amb-color-bg-canvas</li>
	<li>--amb-color-bg-surface</li>
	<li class="film-accent">--amb-color-accent-bg</li>
	<li class="film-inverse">--amb-color-bg-inverse</li>
</ul>
<p class="lede">
	Theme a product by overriding semantic variables. Leave the reference palette in the token files.
</p>
<p class="copy-note" aria-live="polite">{copied ? `Copied ${copied}` : 'Select a swatch to copy its value.'}</p>

{#each semantic as [family, group]}
	<h2>{family}</h2>
	<div class="swatches">
		{#each group as token}
			<button class="swatch" type="button" onclick={() => copy(token.css ?? String(token.value))}>
				<span class="swatch-chip" style:background={String(token.value)}></span>
				<span>
					{token.path}
					<small>{token.css}</small>
				</span>
			</button>
		{/each}
	</div>
{/each}

<h2>Reference palette</h2>
{#each palette as [family, group]}
	<h3>{family}</h3>
	<div class="swatches">
		{#each group as token}
			<button class="swatch" type="button" onclick={() => copy(String(token.value))}>
				<span class="swatch-chip" style:background={String(token.value)}></span>
				<span>
					{token.path}
					<small>{token.value}</small>
				</span>
			</button>
		{/each}
	</div>
{/each}
