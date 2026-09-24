<script lang="ts">
	import CodeBlock from '$lib/CodeBlock.svelte';
	import { brands, scope } from '$lib/brands';
	import { preview, setPreviewBrand } from '$lib/preview.svelte';

	const themes = ['light', 'dark'] as const;

	const compiledCode = `/* dist/css/presets.css, generated from packages/tokens/src/preset/atlas.json */
[data-brand="atlas"]:not([data-theme="dark"]) {
  color-scheme: light;
  --amb-color-accent-bg: #1f4fd1;
  --amb-radius-md: 6px;
  --amb-size-control-md: 36px;
  /* … */
}

[data-brand="atlas"][data-theme="dark"] {
  color-scheme: dark;
  --amb-color-accent-bg: #7aa2ff;
  /* … */
}`;

	const useCode = `<html data-brand="atlas" data-theme="light">`;

	const copyCode = `cp packages/tokens/src/preset/atlas.json packages/tokens/src/preset/harbor.json`;

	const presetCode = `{
  "name": "Harbor",
  "description": "Logistics. IBM Plex Sans, 40px controls, 8px corners, teal actions.",
  "shared": {
    "font": {
      "family": {
        "sans": {
          "$type": "fontFamily",
          "$value": ["IBM Plex Sans", "system-ui", "sans-serif"],
          "$description": "UI text. Load IBM Plex Sans in the product."
        }
      }
    },
    "radius": {
      "md": { "$type": "dimension", "$value": { "value": 8, "unit": "px" }, "$description": "Default control corner." },
      "action": { "$type": "dimension", "$value": { "value": 8, "unit": "px" }, "$description": "Action corner." }
    },
    "size": {
      "control": {
        "md": { "$type": "dimension", "$value": { "value": 40, "unit": "px" }, "$description": "Default control height." }
      }
    }
  },
  "light": {
    "color": {
      "accent": {
        "bg": { "$type": "color", "$value": "#0f5c7a", "$description": "Primary action fill." },
        "bg-hover": { "$type": "color", "$value": "#0b4a63", "$description": "Primary action hover fill." },
        "bg-active": { "$type": "color", "$value": "#08394d", "$description": "Primary action pressed fill." },
        "fg": { "$type": "color", "$value": "#0f5c7a", "$description": "Accent text, including links." }
      }
    }
  },
  "dark": {
    "color": {
      "accent": {
        "bg": { "$type": "color", "$value": "#7cc8e4", "$description": "Primary action fill." },
        "bg-hover": { "$type": "color", "$value": "#a3d9ed", "$description": "Primary action hover fill." },
        "bg-active": { "$type": "color", "$value": "#5bb6d8", "$description": "Primary action pressed fill." },
        "fg": { "$type": "color", "$value": "#8fd0e8", "$description": "Accent text, including links." }
      }
    }
  }
}`;

	const buildCode = `pnpm --filter @ambre-ds/tokens test`;

	const applyCode = `<html data-brand="harbor" data-theme="light">`;

	const attributeOf = (id: string) => (id === 'ambre' ? 'None. The default.' : `data-brand="${id}"`);
</script>

<svelte:head>
	<title>Brands — Ambre</title>
	<meta
		name="description"
		content="Five brands on the same tokens. A brand is one preset file compiled onto the same variables. Compare them in light and dark, and write your own."
	/>
</svelte:head>

{#snippet composition(id: string, theme: string, name: string)}
	<div class="pane" {...scope(id, theme)} role="group" aria-label={`${name}, ${theme} theme`}>
		<p class="pane-label">{theme === 'light' ? 'Light' : 'Dark'}</p>
		<div class="checkout">
			<div class="checkout-head">
				<p class="checkout-title">Order summary</p>
				<amb-badge variant="success">In stock</amb-badge>
			</div>
			<p class="checkout-meta">Linen sheet, queen. 1 item.</p>
			<amb-text-field name={`${id}-${theme}-email`} type="email" autocomplete="email">Email</amb-text-field>
			<amb-select name={`${id}-${theme}-delivery`}>
				Delivery
				<option value="standard" selected>Standard, 3 days</option>
				<option value="express">Express, next day</option>
			</amb-select>
			<amb-toggle name={`${id}-${theme}-save`} checked>Save my details</amb-toggle>
			<div class="checkout-actions">
				<amb-button variant="secondary">Back</amb-button>
				<amb-button>Place order</amb-button>
			</div>
		</div>
	</div>
{/snippet}

<header class="doc-header">
	<p class="eyebrow">Get started</p>
	<h1>Brands</h1>
	<p class="lede">
		A brand is one preset file. The build compiles it onto the same variables every component already reads. The
		markup does not change. Only the values do.
	</p>
</header>

<h2 id="how-it-works">How a brand works</h2>
<p>
	Each file in <code>packages/tokens/src/preset/&lt;id&gt;.json</code> is a brand. The file name is the id. The build
	turns each file into two rule sets in <code>@ambre-ds/tokens/css/presets</code>, one per theme, under
	<code>data-brand</code>.
</p>
<CodeBlock code={compiledCode} lang="html" title="presets.css" />
<p>
	Set the attribute on an ancestor, with <code>data-theme</code> on the same element. Ambre is the default, so it has no
	preset and needs no attribute.
</p>
<CodeBlock code={useCode} lang="html" />
<p>
	A preset lists only what it changes. Every token it leaves out keeps the Ambre value. No preset ships a font file or a
	proprietary face. Each one names an open-license face or the system face, and the product loads it.
</p>

<h2 id="gallery">Brand gallery</h2>
<p class="section-lede">
	The same composition in every brand: a text field, a select, a toggle, a primary and a secondary button, and a badge.
	Each renders in light and in dark. The elements are live.
</p>

<ul class="brand-list">
	{#each brands as brand (brand.id)}
		<li class="brand-card">
			<div class="brand-head">
				<div>
					<h3>{brand.name}</h3>
					<p class="brand-summary">{brand.summary}</p>
				</div>
				<button
					class="btn btn-secondary brand-use"
					type="button"
					aria-pressed={preview.brand === brand.id}
					onclick={() => setPreviewBrand(brand.id)}
				>
					{preview.brand === brand.id ? 'Used in previews' : 'Use in previews'}
				</button>
			</div>
			<dl class="brand-meta">
				<div>
					<dt>Sector</dt>
					<dd>{brand.sector}</dd>
				</div>
				<div>
					<dt>Face</dt>
					<dd>{brand.face}</dd>
				</div>
				<div>
					<dt>Attribute</dt>
					<dd>
						{#if brand.id === 'ambre'}
							{attributeOf(brand.id)}
						{:else}
							<code>{attributeOf(brand.id)}</code>
						{/if}
					</dd>
				</div>
			</dl>
			<div class="panes">
				{#each themes as theme}
					{@render composition(brand.id, theme, brand.name)}
				{/each}
			</div>
			{#if brand.id === 'press'}
				<p class="brand-note">
					Press flattens the tactile layers. The top-edge highlight, the sunken well, and the focus halo go to zero.
					Shadows become hard offsets, and every easing is linear.
				</p>
			{/if}
		</li>
	{/each}
</ul>

<h2 id="what-a-preset-changes">What a preset can change</h2>
<p class="section-lede">
	Nine groups of tokens. Put a group in <code>shared</code> when both themes use it, and in <code>light</code> and
	<code>dark</code> when the value differs by theme.
</p>
<div class="table-wrap">
	<table class="api">
		<thead>
			<tr>
				<th scope="col">Group</th>
				<th scope="col">Tokens</th>
				<th scope="col">Set in</th>
				<th scope="col">For example</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<th scope="row">Color</th>
				<td>
					<span class="values"
						><code>color.bg.*</code><code>color.fg.*</code><code>color.border.*</code><code>color.accent.*</code><code
							>color.status.*</code
						><code>color.highlight</code></span
					>
				</td>
				<td>light, dark</td>
				<td>Atlas uses ink-blue actions on cool slate. Press uses ink buttons and red links.</td>
			</tr>
			<tr>
				<th scope="row">Type</th>
				<td>
					<span class="values"
						><code>font.family.*</code><code>font.weight.*</code><code>font.lineHeight.*</code><code
							>font.size.100–900</code
						></span
					>
				</td>
				<td>shared</td>
				<td>Atlas sets 14px body text in the system face. Verdant sets 18px.</td>
			</tr>
			<tr>
				<th scope="row">Radius</th>
				<td><span class="values"><code>radius.sm</code><code>radius.md</code><code>radius.lg</code><code>radius.action</code></span></td>
				<td>shared</td>
				<td>Press is square everywhere. Noir keeps fields square and makes actions pills.</td>
			</tr>
			<tr>
				<th scope="row">Border width</th>
				<td><span class="values"><code>border.width.default</code><code>border.width.strong</code></span></td>
				<td>shared</td>
				<td>Verdant and Press draw 2px borders.</td>
			</tr>
			<tr>
				<th scope="row">Space</th>
				<td><code>space.0–900</code></td>
				<td>shared</td>
				<td>Atlas tightens the steps for density. Press reaches 128px at step 900.</td>
			</tr>
			<tr>
				<th scope="row">Control size</th>
				<td><span class="values"><code>size.control.*</code><code>size.icon.*</code></span></td>
				<td>shared</td>
				<td>Atlas controls are 36px. Verdant controls are 52px.</td>
			</tr>
			<tr>
				<th scope="row">Focus</th>
				<td>
					<span class="values"
						><code>focus.ring.width</code><code>focus.ring.offset</code><code>focus.halo.width</code><code
							>color.focus.*</code
						></span
					>
				</td>
				<td>shared, colors in light and dark</td>
				<td>Verdant adds a yellow halo. Press keeps the ring and drops the halo.</td>
			</tr>
			<tr>
				<th scope="row">Motion</th>
				<td><span class="values"><code>duration.*</code><code>easing.*</code></span></td>
				<td>shared</td>
				<td>Noir moves slowly. Press is linear and never overshoots.</td>
			</tr>
			<tr>
				<th scope="row">Elevation</th>
				<td><span class="values"><code>elevation.inset</code><code>elevation.1–3</code></span></td>
				<td>light, dark</td>
				<td>Press replaces soft shadows with hard 2, 4, and 8px offsets.</td>
			</tr>
		</tbody>
	</table>
</div>

<h2 id="create">Create your own</h2>
<p>A new brand is a new file. No component changes.</p>
<p>
	The fastest way is the <a href="/builder">preset builder</a>: start from any brand, roll one at random or edit every
	token, watch the foundations and every component change live, and export the file. The steps below do the same by
	hand.
</p>
<p><a class="btn btn-primary" href="/builder">Open the preset builder</a></p>

<h3>1. Copy a preset</h3>
<p>
	Start from the preset closest to the brand. The file name becomes the id: lowercase letters, digits, and hyphens,
	starting with a letter.
</p>
<CodeBlock code={copyCode} lang="bash" title="Terminal" />

<h3>2. Change the values</h3>
<p>
	Set <code>name</code> and <code>description</code>. Keep the tokens you change and delete the rest. Colors are 6-digit
	hex. A group in <code>light</code> or <code>dark</code> replaces the same top-level group in <code>shared</code>, so
	keep each group in one place.
</p>
<CodeBlock code={presetCode} lang="html" title="harbor.json" />

<h3>3. Build and check contrast</h3>
<p>The test script builds the tokens and runs the contrast check. Fix every failing pair before you ship.</p>
<CodeBlock code={buildCode} lang="bash" title="Terminal" />

<h3>4. Load the face and set the attribute</h3>
<p>
	Load the face the preset names in the product, then set the attribute. To describe the brand on this site, add its
	sector, face, and summary to <code>apps/docs/src/lib/brands.ts</code>.
</p>
<CodeBlock code={applyCode} lang="html" />

<div class="guidance">
	<section class="guidance-card" data-kind="do">
		<h3>Do</h3>
		<ul>
			<li>Change semantic tokens only. The reference palette stays in the token files.</li>
			<li>Set every color for both light and dark.</li>
			<li>Name an open-license face or the system face, and load it in the product.</li>
		</ul>
	</section>
	<section class="guidance-card" data-kind="dont">
		<h3>Don’t</h3>
		<ul>
			<li>Don’t restyle a component to match a brand. Change the preset.</li>
			<li>Don’t ship a proprietary face in a preset.</li>
			<li>Don’t set <code>data-theme</code> on a different element from <code>data-brand</code>.</li>
		</ul>
	</section>
</div>

<style>
	.brand-list {
		display: grid;
		gap: 24px;
		margin: 24px 0 8px;
		padding: 0;
		list-style: none;
	}

	.brand-card {
		padding: 24px;
		border: 1px solid var(--rule-strong);
		border-radius: 16px;
		background: var(--amb-color-bg-surface);
		box-shadow: var(--amb-elevation-1);
	}

	.brand-head {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px 24px;
	}

	.brand-head h3 {
		margin: 0;
		font-size: 22px;
	}

	.brand-card .brand-summary {
		max-width: 52ch;
		margin: 6px 0 0;
	}

	.brand-use {
		height: 36px;
		padding-inline: 14px;
		font-size: 14px;
	}

	.brand-use[aria-pressed='true'] {
		background: var(--amb-color-bg-subtle);
	}

	.brand-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 32px;
		margin: 16px 0 20px;
	}

	.brand-meta dt {
		color: var(--amb-color-fg-subtle);
		font-size: 12px;
		font-weight: var(--amb-font-weight-semibold);
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.brand-meta dd {
		margin: 2px 0 0;
		color: var(--amb-color-fg-default);
		font-size: 15px;
	}

	.panes {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}

	/* A pane renders in one brand and one theme. Everything inside uses that brand's tokens. */
	.pane {
		display: grid;
		gap: var(--amb-space-300);
		align-content: start;
		padding: var(--amb-space-500);
		border-radius: 12px;
		background: var(--amb-color-bg-canvas);
		color: var(--amb-color-fg-default);
		font-family: var(--amb-font-family-sans);
		font-size: var(--amb-font-size-300);
		line-height: var(--amb-font-line-height-body);
		box-shadow: inset 0 0 0 1px var(--rule);
	}

	.pane p {
		margin: 0;
	}

	.pane .pane-label {
		color: var(--amb-color-fg-subtle);
		font-size: var(--amb-font-size-100);
		font-weight: var(--amb-font-weight-semibold);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.checkout {
		display: grid;
		gap: var(--amb-space-400);
		padding: var(--amb-space-500);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-surface);
		box-shadow: var(--amb-elevation-1);
	}

	.checkout-head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--amb-space-200);
	}

	.pane .checkout-title {
		color: var(--amb-color-fg-default);
		font-size: var(--amb-font-size-400);
		font-weight: var(--amb-font-weight-semibold);
		line-height: var(--amb-font-line-height-tight);
	}

	.pane .checkout-meta {
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
	}

	.checkout-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: var(--amb-space-200);
	}

	.brand-card .brand-note {
		margin: 16px 0 0;
		font-size: 15px;
	}

	@media (max-width: 720px) {
		.panes {
			grid-template-columns: minmax(0, 1fr);
		}

		.brand-card {
			padding: 16px;
		}
	}
</style>
