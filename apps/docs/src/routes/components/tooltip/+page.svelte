<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';
</script>

<ComponentPage
	id="tooltip"
	heroMinHeight={240}
	heroCode={`<amb-tooltip text="Saves a copy only you can see">
  <amb-button variant="secondary">Save draft</amb-button>
</amb-tooltip>
<amb-tooltip text="Sends the post to everyone in the workspace">
  <amb-button>Publish</amb-button>
</amb-tooltip>`}
	usage={{
		do: [
			'Add detail the label cannot hold: what happens, or what it affects. <strong>Publish</strong> gets <strong>Sends the post to everyone in the workspace</strong>.',
			'Keep the text to one short sentence, under about 80 characters.',
			'Wrap exactly one focusable control, so keyboard users reach the tip with Tab.'
		],
		dont: [
			'Don’t repeat the visible label in the tip. It is announced twice.',
			'Don’t put essential instructions or errors only in a tip. Touch screens have no hover. Write them on the page.',
			'Don’t put a link or a button inside the tip. It closes when the pointer leaves. Use a dialog.'
		]
	}}
>
	{#snippet hero()}
		<amb-tooltip text="Saves a copy only you can see">
			<amb-button variant="secondary">Save draft</amb-button>
		</amb-tooltip>
		<amb-tooltip text="Sends the post to everyone in the workspace">
			<amb-button>Publish</amb-button>
		</amb-tooltip>
	{/snippet}

	<h2 id="in-a-toolbar">In a toolbar</h2>
	<p>
		Compact controls in a toolbar keep short visible labels. The tip explains the consequence for someone who
		is unsure. Hover a control, or move to it with Tab.
	</p>
	<Stage
		minHeight={220}
		code={`<div role="toolbar" aria-label="Table actions">
  <amb-tooltip text="Downloads the 240 rows in this view as CSV">
    <amb-button variant="ghost" size="sm">Export</amb-button>
  </amb-tooltip>
  <amb-tooltip text="Keeps the rows but hides them from the list">
    <amb-button variant="ghost" size="sm">Archive</amb-button>
  </amb-tooltip>
  <amb-tooltip text="Copies the rows with the same column order">
    <amb-button variant="ghost" size="sm">Duplicate</amb-button>
  </amb-tooltip>
</div>`}
	>
		<div class="toolbar" role="toolbar" aria-label="Table actions">
			<amb-tooltip text="Downloads the 240 rows in this view as CSV">
				<amb-button variant="ghost" size="sm">Export</amb-button>
			</amb-tooltip>
			<amb-tooltip text="Keeps the rows but hides them from the list">
				<amb-button variant="ghost" size="sm">Archive</amb-button>
			</amb-tooltip>
			<amb-tooltip text="Copies the rows with the same column order">
				<amb-button variant="ghost" size="sm">Duplicate</amb-button>
			</amb-tooltip>
		</div>
	</Stage>

	<h2 id="tip-or-help-text">Tip or help text</h2>
	<p>
		A tip is optional reading. Anything a person needs to finish the task, such as a format or a limit, belongs
		in visible help text next to the field.
	</p>
	<Stage
		minHeight={240}
		code={`<!-- Needed to finish: visible help text -->
<amb-text-field name="vat">VAT number</amb-text-field>
<p>Two letters for the country, then up to 12 digits.</p>

<!-- Optional detail: a tip on the action -->
<amb-tooltip text="Checks the number with the EU VIES service">
  <amb-button variant="secondary">Verify</amb-button>
</amb-tooltip>`}
	>
		<div class="field-demo">
			<div class="field">
				<amb-text-field name="vat">VAT number</amb-text-field>
				<p class="help">Two letters for the country, then up to 12 digits.</p>
			</div>
			<amb-tooltip text="Checks the number with the EU VIES service">
				<amb-button variant="secondary">Verify</amb-button>
			</amb-tooltip>
		</div>
	</Stage>
</ComponentPage>

<style>
	.toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: var(--amb-space-100);
		padding: var(--amb-space-100);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-md);
		background: var(--amb-color-bg-surface);
	}

	.field-demo {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: var(--amb-space-300);
	}

	.field {
		display: grid;
		gap: var(--amb-space-100);
		width: min(100%, 18rem);
	}

	.help {
		margin: 0;
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
	}
</style>
