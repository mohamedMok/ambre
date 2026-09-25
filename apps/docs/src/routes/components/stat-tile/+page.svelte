<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';
</script>

<ComponentPage
	id="stat-tile"
	heroAlign="stretch"
	heroCode={`<ul class="stats">
  <li>
    <amb-stat-tile trend="up" sentiment="positive">
      Monthly revenue
      <span slot="value">48,210 €</span>
      <span slot="delta">12% more than August</span>
      <span slot="description">September 2026</span>
    </amb-stat-tile>
  </li>
  <li>
    <amb-stat-tile trend="up" sentiment="negative">
      Refunds
      <span slot="value">1,904 €</span>
      <span slot="delta">4% more than August</span>
    </amb-stat-tile>
  </li>
</ul>`}
	usage={{
		do: [
			'Write the delta in words, such as 12% more than August. The arrow and the color repeat it, they do not replace it.',
			'Set the <code>trend</code> for the direction and the <code>sentiment</code> for the meaning. A rising cost goes up and is negative.',
			'Format the value for the reader, with its unit and the separators of their language.',
			'Put a row of stat tiles in a list, and keep the same period in every tile.'
		],
		dont: [
			'Don’t show more than four or five figures in a row. Pick the ones people act on.',
			'Don’t color a delta that is neither good nor bad. Keep it neutral.',
			'Don’t round a figure so far that the change disappears.'
		]
	}}
>
	{#snippet hero()}
		<ul class="stats">
			<li>
				<amb-stat-tile trend="up" sentiment="positive">
					Monthly revenue
					<span slot="value">48,210 €</span>
					<span slot="delta">12% more than August</span>
					<span slot="description">September 2026</span>
				</amb-stat-tile>
			</li>
			<li>
				<amb-stat-tile trend="up" sentiment="negative">
					Refunds
					<span slot="value">1,904 €</span>
					<span slot="delta">4% more than August</span>
					<span slot="description">September 2026</span>
				</amb-stat-tile>
			</li>
			<li>
				<amb-stat-tile trend="down" sentiment="positive">
					Support wait
					<span slot="value">3 min</span>
					<span slot="delta">40 seconds faster</span>
					<span slot="description">Median, last 7 days</span>
				</amb-stat-tile>
			</li>
		</ul>
	{/snippet}

	<h2 id="neutral">Without a change</h2>
	<p>A figure with no comparison keeps only its label, its value, and a line of context.</p>
	<Stage
		align="stretch"
		code={`<amb-stat-tile>
  Orders
  <span slot="value">1,284</span>
  <span slot="description">This month</span>
</amb-stat-tile>`}
	>
		<ul class="stats">
			<li>
				<amb-stat-tile>Orders <span slot="value">1,284</span> <span slot="description">This month</span></amb-stat-tile>
			</li>
			<li>
				<amb-stat-tile>Active members <span slot="value">86</span> <span slot="description">Of 100 seats</span></amb-stat-tile>
			</li>
		</ul>
	</Stage>
</ComponentPage>

<style>
	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
		align-content: start;
		gap: var(--amb-space-300);
		margin: 0;
		padding: 0;
		list-style: none;
	}
</style>
