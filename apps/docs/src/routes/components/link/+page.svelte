<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';
</script>

<ComponentPage
	id="link"
	heroCode={`<p>
  Read the <amb-link href="/foundations/color">color decisions</amb-link>
  before you change a brand.
</p>
<amb-link href="/get-started" variant="quiet">Back to Get started</amb-link>
<amb-link href="https://github.com/mohamedMok/ambre" external>Source on GitHub</amb-link>`}
	usage={{
		do: [
			'Write the destination as the label, such as <strong>Shipping policy</strong>. The slot is the accessible name.',
			'Set <code>href</code> on every link. Without it, the element does not go anywhere.',
			'Set <code>external</code> when the destination leaves the product. It opens a new browsing context with <code>rel="noreferrer"</code>.',
			'Use <code>variant="quiet"</code> for secondary destinations that repeat, such as footer and card links.'
		],
		dont: [
			'Don’t use a link to submit a form, save, or delete. Use <code>&lt;amb-button&gt;</code>.',
			'Don’t write <strong>Click here</strong> or <strong>Read more</strong> alone. The label has to make sense out of context.',
			'Don’t stretch an inline link to button height or wrap it around a whole card.',
			'Don’t put the only name in a tooltip or an icon. Keep the text visible.'
		]
	}}
>
	{#snippet hero()}
		<div class="hero">
			<p class="copy">
				Read the <amb-link href="/foundations/color">color decisions</amb-link> before you change a brand.
			</p>
			<div class="hero-links">
				<amb-link href="/get-started" variant="quiet">Back to Get started</amb-link>
				<amb-link href="https://github.com/mohamedMok/ambre" external>Source on GitHub</amb-link>
			</div>
		</div>
	{/snippet}

	<h2 id="variants">Variants</h2>
	<p>
		<strong>Text</strong> is the accent link. Use it in running copy and wherever the destination is the next step.
		<strong>Quiet</strong> uses the muted text color. Use it for secondary destinations that sit next to other
		content, such as a card footer.
	</p>
	<Stage
		code={`<amb-link href="/account">Account settings</amb-link>
<amb-link href="/help" variant="quiet">Help center</amb-link>`}
	>
		<amb-link href="#variants">Account settings</amb-link>
		<amb-link href="#variants" variant="quiet">Help center</amb-link>
	</Stage>

	<h2 id="external">External destinations</h2>
	<p>
		<code>external</code> opens the destination in a new browsing context and sets <code>rel="noreferrer"</code>.
		Use it only when the destination leaves the product, so people keep their place in a task.
	</p>
	<Stage
		code={`<amb-link href="https://www.w3.org/WAI/standards-guidelines/wcag/" external>
  WCAG 2.2 overview
</amb-link>`}
	>
		<amb-link href="https://www.w3.org/WAI/standards-guidelines/wcag/" external>WCAG 2.2 overview</amb-link>
	</Stage>

	<h2 id="in-context">In context</h2>
	<p>
		Links carry the destination in their words. In the order summary below, each link names where it goes, and the
		action that changes the order is a button.
	</p>
	<Stage
		align="stretch"
		code={`<section>
  <h3>Order 4821</h3>
  <p>
    Arrives Thursday. Returns are free for 30 days under the
    <amb-link href="/help/returns">returns policy</amb-link>.
  </p>
  <div>
    <amb-button variant="secondary">Change address</amb-button>
    <amb-link href="/orders/4821/invoice" variant="quiet">Download invoice</amb-link>
    <amb-link href="/orders" variant="quiet">All orders</amb-link>
  </div>
</section>`}
	>
		<section class="card">
			<h3 class="card-title">Order 4821</h3>
			<p class="copy">
				Arrives Thursday. Returns are free for 30 days under the
				<amb-link href="#in-context">returns policy</amb-link>.
			</p>
			<div class="card-footer">
				<amb-button variant="secondary">Change address</amb-button>
				<amb-link href="#in-context" variant="quiet">Download invoice</amb-link>
				<amb-link href="#in-context" variant="quiet">All orders</amb-link>
			</div>
		</section>
	</Stage>

	<h2 id="link-or-button">Link or button</h2>
	<p>
		A link goes somewhere and changes the URL. A button does something on the current page. Screen reader users
		hear the difference, so pick the element by what happens, not by how it looks.
	</p>
	<div class="table-wrap">
		<table class="api">
			<thead>
				<tr><th scope="col">What happens</th><th scope="col">Use</th></tr>
			</thead>
			<tbody>
				<tr><td>Opens another page, section, or site</td><td><code>&lt;amb-link&gt;</code></td></tr>
				<tr><td>Downloads a file from a URL</td><td><code>&lt;amb-link&gt;</code></td></tr>
				<tr><td>Submits, saves, deletes, or opens a dialog</td><td><code>&lt;amb-button&gt;</code></td></tr>
				<tr><td>Shows or hides content on the page</td><td><code>&lt;amb-disclosure&gt;</code></td></tr>
			</tbody>
		</table>
	</div>
</ComponentPage>

<style>
	.hero {
		display: grid;
		justify-items: center;
		gap: var(--amb-space-400);
		text-align: center;
	}

	.hero-links {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--amb-space-500);
	}

	.copy {
		margin: 0;
		color: var(--amb-color-fg-default);
		font-size: var(--amb-font-size-300);
	}

	.card {
		display: grid;
		gap: var(--amb-space-300);
		width: min(100%, 30rem);
		margin-inline: auto;
		padding: var(--amb-space-500);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-surface);
		box-shadow: var(--amb-elevation-1);
	}

	.card-title {
		margin: 0;
		color: var(--amb-color-fg-default);
		font-size: var(--amb-font-size-300);
		font-weight: var(--amb-font-weight-semibold);
	}

	.card-footer {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--amb-space-400);
		padding-top: var(--amb-space-300);
		border-top: var(--amb-border-width-default) solid var(--amb-color-border-default);
	}
</style>
