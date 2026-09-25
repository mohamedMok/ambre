<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	let status = $state('Pick two dates, then submit.');

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!(event.currentTarget instanceof HTMLFormElement)) return;
		const data = new FormData(event.currentTarget);
		status = `Submitted check-in=${data.get('check-in') || '—'}, check-out=${data.get('check-out') || '—'}.`;
	}
</script>

<ComponentPage
	id="date-picker"
	heroMinHeight={440}
	heroAlign="start"
	heroCode={`<amb-date-picker name="delivery" min="2026-09-28" max="2026-10-31">
  Delivery date
</amb-date-picker>`}
	usage={{
		do: [
			'Use a date picker when the date is close and people think in days of the week, such as a delivery or a booking.',
			'Set <code>min</code> and <code>max</code> to the dates that can actually be booked. The calendar strikes out the others.',
			'Let people type. The field takes the date in the order of their language, and the calendar is a second way in.',
			'Read the value as <code>YYYY-MM-DD</code>. Format it for display with <code>Intl.DateTimeFormat</code>.'
		],
		dont: [
			'Don’t use a calendar for a date of birth. Three fields, or typing, are faster than paging back through decades.',
			'Don’t use the placeholder as the label. The slotted text is the name, and it stays visible.',
			'Don’t hide which days are unavailable. Explain the rule next to the field, such as closed on Sundays.'
		]
	}}
>
	{#snippet hero()}
		<div class="narrow">
			<amb-date-picker name="delivery" min="2026-09-28" max="2026-10-31">Delivery date</amb-date-picker>
		</div>
	{/snippet}

	<h2 id="keyboard">Keyboard</h2>
	<p>
		The calendar follows the date picker dialog pattern. The button opens it and moves focus to the selected day, or
		to today. Arrow keys move by day and week, Page Up and Page Down by month, and with Shift by year. Enter picks the
		day and returns focus to the button, and Escape closes without a change.
	</p>

	<h2 id="range">A range of two dates</h2>
	<p>
		For a stay or a period, use two pickers side by side. Both join the form, and the second can start where the
		first ends.
	</p>
	<Stage
		align="stretch"
		minHeight={460}
		code={`<form>
  <amb-date-picker name="check-in" min="2026-10-01" required>Check-in</amb-date-picker>
  <amb-date-picker name="check-out" min="2026-10-02" required>Check-out</amb-date-picker>
  <amb-button type="submit">Search rooms</amb-button>
</form>`}
	>
		<form class="range" onsubmit={onSubmit}>
			<amb-date-picker name="check-in" min="2026-10-01" required>Check-in</amb-date-picker>
			<amb-date-picker name="check-out" min="2026-10-02" required>Check-out</amb-date-picker>
			<div class="actions"><amb-button type="submit">Search rooms</amb-button></div>
			<p class="status" aria-live="polite">{status}</p>
		</form>
	</Stage>

	<h2 id="states">States</h2>
	<Stage
		code={`<amb-date-picker value="2026-10-14">Start date</amb-date-picker>
<amb-date-picker value="2026-10-14" disabled>Start date</amb-date-picker>`}
	>
		<div class="row">
			<amb-date-picker value="2026-10-14">Start date</amb-date-picker>
			<amb-date-picker value="2026-10-14" disabled>Start date, locked</amb-date-picker>
		</div>
	</Stage>
</ComponentPage>

<style>
	.narrow {
		width: min(100%, 20rem);
	}

	.range {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		align-items: end;
		gap: var(--amb-space-400);
	}

	.actions,
	.status {
		grid-column: 1 / -1;
	}

	.status {
		margin: 0;
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
	}

	.row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: var(--amb-space-400);
		width: 100%;
	}
</style>
