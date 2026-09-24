<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import CodeBlock from '$lib/CodeBlock.svelte';
	import Stage from '$lib/Stage.svelte';

	const views = ['Overview', 'Activity', 'Settings'];
	let selected = $state(0);

	function onChange(event: Event) {
		if (!(event instanceof CustomEvent)) return;
		const index = Number((event.detail as { index?: number } | null)?.index);
		if (Number.isInteger(index)) selected = index;
	}
</script>

<ComponentPage
	id="tabs"
	heroAlign="stretch"
	heroCode={`<amb-tabs>
  <button slot="tab" type="button">Profile</button>
  <button slot="tab" type="button">Notifications</button>
  <button slot="tab" type="button">Billing</button>
  <div slot="panel">…</div>
  <div slot="panel">…</div>
  <div slot="panel">…</div>
</amb-tabs>`}
	usage={{
		do: [
			'Use tabs for peer views of one object, such as the <strong>Profile</strong>, <strong>Notifications</strong>, and <strong>Billing</strong> of an account.',
			'Name each tab with one or two nouns, and write one panel per tab in the same order.',
			'Disable a tab that has no content for this person, and explain why inside another panel or on the page.'
		],
		dont: [
			'Don’t use tabs for the steps of a flow. A person has to finish step one before step two. Use a button that continues.',
			'Don’t use tabs to go to another page. Use links in a navigation.',
			'Don’t hide information someone needs to compare side by side. Show it on one panel.'
		]
	}}
>
	{#snippet hero()}
		<amb-tabs>
			<button slot="tab" type="button">Profile</button>
			<button slot="tab" type="button">Notifications</button>
			<button slot="tab" type="button">Billing</button>
			<div slot="panel" class="panel">
				<dl class="facts">
					<div><dt>Name</dt><dd>Lena Ortiz</dd></div>
					<div><dt>Email</dt><dd>lena@example.com</dd></div>
					<div><dt>Time zone</dt><dd>Europe/Paris</dd></div>
				</dl>
			</div>
			<div slot="panel" class="panel">
				<p class="panel-text">Email me when someone mentions me or assigns me a task. Weekly digest on Mondays.</p>
			</div>
			<div slot="panel" class="panel">
				<dl class="facts">
					<div><dt>Plan</dt><dd>Team, 12 seats</dd></div>
					<div><dt>Next invoice</dt><dd>1 October, €240.00</dd></div>
				</dl>
			</div>
		</amb-tabs>
	{/snippet}

	<h2 id="disabled-tab">Disabled tab</h2>
	<p>
		A disabled tab stays visible so the structure is predictable, and it is skipped by the arrow keys. Say on the
		page why it is unavailable.
	</p>
	<Stage
		align="stretch"
		code={`<amb-tabs>
  <button slot="tab" type="button">Description</button>
  <button slot="tab" type="button">Specifications</button>
  <button slot="tab" type="button" disabled>Reviews</button>
  <div slot="panel">…</div>
  <div slot="panel">…</div>
  <div slot="panel">…</div>
</amb-tabs>
<p>Reviews open 14 days after the first delivery.</p>`}
	>
		<amb-tabs>
			<button slot="tab" type="button">Description</button>
			<button slot="tab" type="button">Specifications</button>
			<button slot="tab" type="button" disabled>Reviews</button>
			<div slot="panel" class="panel">
				<p class="panel-text">
					Stonewashed linen, pre-shrunk and softened. It gets softer with each wash and keeps its shape.
				</p>
			</div>
			<div slot="panel" class="panel">
				<dl class="facts">
					<div><dt>Material</dt><dd>100% linen</dd></div>
					<div><dt>Size</dt><dd>220 × 240 cm</dd></div>
					<div><dt>Care</dt><dd>Machine wash at 40 °C</dd></div>
				</dl>
			</div>
			<div slot="panel" class="panel">
				<p class="panel-text">No reviews yet.</p>
			</div>
		</amb-tabs>
		<p class="note-text">Reviews open 14 days after the first delivery.</p>
	</Stage>

	<h2 id="change-event">Listening for changes</h2>
	<p>
		The element fires <code>change</code> with <code>detail.index</code> when the selection moves. Use it to load
		the panel content or to keep the selection in the address.
	</p>
	<Stage
		align="stretch"
		code={`<amb-tabs>
  <button slot="tab" type="button">Overview</button>
  <button slot="tab" type="button">Activity</button>
  <button slot="tab" type="button">Settings</button>
  <div slot="panel">…</div>
  <div slot="panel">…</div>
  <div slot="panel">…</div>
</amb-tabs>`}
	>
		<div class="listen" onchange={onChange}>
			<amb-tabs>
				{#each views as view}
					<button slot="tab" type="button">{view}</button>
				{/each}
				{#each views as view}
					<div slot="panel" class="panel">
						<p class="panel-text">The {view.toLowerCase()} panel of the project.</p>
					</div>
				{/each}
			</amb-tabs>
		</div>
		<p class="note-text" aria-live="polite">Selected index: <strong>{selected}</strong> ({views[selected]})</p>
	</Stage>
	<CodeBlock
		lang="js"
		title="Listen for the change"
		code={`const tabs = document.querySelector('amb-tabs');
tabs.addEventListener('change', (event) => {
  console.log(event.detail.index); // 0, 1, or 2
});`}
	/>
</ComponentPage>

<style>
	.panel {
		padding: var(--amb-space-500) 0 0;
	}

	.panel-text {
		margin: 0;
		color: var(--amb-color-fg-default);
	}

	.facts {
		display: grid;
		gap: var(--amb-space-300);
		max-width: 28rem;
		margin: 0;
	}

	.facts div {
		display: grid;
		grid-template-columns: 9rem minmax(0, 1fr);
		gap: var(--amb-space-300);
	}

	.facts dt {
		color: var(--amb-color-fg-muted);
	}

	.facts dd {
		margin: 0;
		color: var(--amb-color-fg-default);
		font-weight: var(--amb-font-weight-semibold);
	}

	.note-text {
		margin: 0;
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
	}
</style>
