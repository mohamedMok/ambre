<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';
</script>

<ComponentPage
	id="disclosure"
	heroAlign="stretch"
	heroCode={`<amb-disclosure open>
  Shipping
  <p slot="panel">Orders ship within one business day and arrive in two to four days.</p>
</amb-disclosure>`}
	usage={{
		do: [
			'Name the button with the subject of the panel, such as <strong>Shipping</strong> or <strong>Advanced settings</strong>.',
			'Put the hidden content in the <code>panel</code> slot. Keep the label slot to plain text.',
			'Start closed, unless the panel holds what most people came for. Then set <code>open</code>.',
			'Stack several disclosures for a list of independent questions, such as an FAQ.'
		],
		dont: [
			'Don’t hide required fields or the only copy of an instruction in a closed panel.',
			'Don’t use a disclosure to go somewhere. Use <code>&lt;amb-link&gt;</code>.',
			'Don’t put a link, a button, or a heading inside the label slot. The label is already a button.',
			'Don’t nest disclosures more than one level. Split the content instead.'
		]
	}}
>
	{#snippet hero()}
		<div class="narrow">
			<amb-disclosure open>
				Shipping
				<p slot="panel" class="panel-text">Orders ship within one business day and arrive in two to four days.</p>
			</amb-disclosure>
		</div>
	{/snippet}

	<h2 id="states">States</h2>
	<p>
		A disclosure starts closed. Set <code>open</code> to show the panel on load. A disabled disclosure leaves the tab
		order and cannot toggle. The button reports its state with <code>aria-expanded</code>.
	</p>
	<Stage
		align="stretch"
		code={`<amb-disclosure>
  Returns
  <p slot="panel">Send any item back within 30 days for a full refund.</p>
</amb-disclosure>
<amb-disclosure open>
  Warranty
  <p slot="panel">Every product carries a two-year warranty against defects.</p>
</amb-disclosure>
<amb-disclosure disabled>
  Gift wrapping
  <p slot="panel">Gift wrapping is not offered for this item.</p>
</amb-disclosure>`}
	>
		<div class="narrow stack">
			<amb-disclosure>
				Returns
				<p slot="panel" class="panel-text">Send any item back within 30 days for a full refund.</p>
			</amb-disclosure>
			<amb-disclosure open>
				Warranty
				<p slot="panel" class="panel-text">Every product carries a two-year warranty against defects.</p>
			</amb-disclosure>
			<amb-disclosure disabled>
				Gift wrapping
				<p slot="panel" class="panel-text">Gift wrapping is not offered for this item.</p>
			</amb-disclosure>
		</div>
	</Stage>

	<h2 id="faq">Frequently asked questions</h2>
	<p>
		Stack disclosures for a list of questions that people scan and open one at a time. Each one toggles on its own.
		Write the question as the label, so the list reads well when every panel is closed.
	</p>
	<Stage
		align="stretch"
		code={`<amb-disclosure>
  Can I change my order after I place it?
  <p slot="panel">Yes, until it ships. Open the order and choose Change order.</p>
</amb-disclosure>
<amb-disclosure>
  Which countries do you ship to?
  <p slot="panel">We ship to the European Union, the United Kingdom, and Japan.</p>
</amb-disclosure>
<amb-disclosure>
  How do I track a parcel?
  <p slot="panel">The shipping email holds a tracking link. It is also on the order page.</p>
</amb-disclosure>`}
	>
		<div class="narrow stack">
			<amb-disclosure>
				Can I change my order after I place it?
				<p slot="panel" class="panel-text">Yes, until it ships. Open the order and choose Change order.</p>
			</amb-disclosure>
			<amb-disclosure>
				Which countries do you ship to?
				<p slot="panel" class="panel-text">We ship to the European Union, the United Kingdom, and Japan.</p>
			</amb-disclosure>
			<amb-disclosure>
				How do I track a parcel?
				<p slot="panel" class="panel-text">The shipping email holds a tracking link. It is also on the order page.</p>
			</amb-disclosure>
		</div>
	</Stage>

	<h2 id="rich-panel">Rich panel content</h2>
	<p>
		The panel slot takes any markup: lists, links, and form controls. Here optional settings stay out of the way
		until someone needs them. Nothing inside is required, so the form still works while the panel is closed.
	</p>
	<Stage
		align="stretch"
		code={`<form>
  <amb-text-field name="project">Project name</amb-text-field>
  <amb-disclosure>
    Advanced settings
    <div slot="panel">
      <amb-text-field name="slug" placeholder="my-project">URL slug</amb-text-field>
      <amb-checkbox name="private">Make the project private</amb-checkbox>
    </div>
  </amb-disclosure>
  <amb-button type="submit">Create project</amb-button>
</form>`}
	>
		<form class="narrow stack" onsubmit={(event) => event.preventDefault()}>
			<amb-text-field name="project">Project name</amb-text-field>
			<amb-disclosure>
				Advanced settings
				<div slot="panel" class="panel-stack">
					<amb-text-field name="slug" placeholder="my-project">URL slug</amb-text-field>
					<amb-checkbox name="private">Make the project private</amb-checkbox>
				</div>
			</amb-disclosure>
			<div>
				<amb-button type="submit">Create project</amb-button>
			</div>
		</form>
	</Stage>
</ComponentPage>

<style>
	.narrow {
		width: min(100%, 32rem);
		margin-inline: auto;
	}

	.stack {
		display: grid;
		gap: var(--amb-space-300);
	}

	.panel-stack {
		display: grid;
		gap: var(--amb-space-400);
	}

	.panel-text {
		margin: 0;
		color: var(--amb-color-fg-muted);
	}
</style>
