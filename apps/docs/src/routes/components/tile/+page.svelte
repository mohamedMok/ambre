<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';
</script>

<ComponentPage
	id="tile"
	heroAlign="stretch"
	heroCode={`<ul class="tiles">
  <li>
    <amb-tile href="/start" tone="accent">
      <amb-icon slot="icon" name="rocket_launch"></amb-icon>
      Get started
      <span slot="description">Install the packages in five minutes.</span>
    </amb-tile>
  </li>
  <li>
    <amb-tile href="/members">
      <amb-icon slot="icon" name="group"></amb-icon>
      <amb-badge slot="meta">12</amb-badge>
      Members
      <span slot="description">Invite people and set roles.</span>
    </amb-tile>
  </li>
</ul>`}
	usage={{
		do: [
			'Use tiles for a small set of destinations of equal weight, such as the sections of a settings area or a dashboard home.',
			'Write the title as the destination, in one to three words. It is the link text.',
			'Mark the one place to start with <code>tone="accent"</code>, and keep the others neutral.',
			'Put a count or a status in the <code>meta</code> slot, such as the number of members.'
		],
		dont: [
			'Don’t use a tile for a subject with an image or long text. Use <code>&lt;amb-card&gt;</code>.',
			'Don’t label the icon. It repeats the title, so it stays decorative.',
			'Don’t mix tiles with and without an href in one grid.'
		]
	}}
>
	{#snippet hero()}
		<ul class="tiles">
			<li>
				<amb-tile href="#stats" tone="accent">
					<amb-icon slot="icon" name="rocket_launch"></amb-icon>
					Get started
					<span slot="description">Install the packages in five minutes.</span>
				</amb-tile>
			</li>
			<li>
				<amb-tile href="#stats">
					<amb-icon slot="icon" name="group"></amb-icon>
					<amb-badge slot="meta">12</amb-badge>
					Members
					<span slot="description">Invite people and set roles.</span>
				</amb-tile>
			</li>
			<li>
				<amb-tile href="#stats">
					<amb-icon slot="icon" name="receipt_long"></amb-icon>
					Billing
					<span slot="description">Plans, invoices, and tax details.</span>
				</amb-tile>
			</li>
			<li>
				<amb-tile href="#stats">
					<amb-icon slot="icon" name="shield"></amb-icon>
					Security
					<span slot="description">Sign-in, keys, and the audit log.</span>
				</amb-tile>
			</li>
		</ul>
	{/snippet}

	<h2 id="stats">Next to stat tiles</h2>
	<p>
		A dashboard home often pairs figures with destinations. <a href="/components/stat-tile">Stat tiles</a> share the
		tile surface, so a row of each lines up.
	</p>
	<Stage
		align="stretch"
		code={`<amb-stat-tile trend="up" sentiment="positive">
  Revenue <span slot="value">48,210 €</span> <span slot="delta">12% up</span>
</amb-stat-tile>
<amb-tile href="/invoices">…</amb-tile>`}
	>
		<ul class="tiles">
			<li>
				<amb-stat-tile trend="up" sentiment="positive">
					Revenue <span slot="value">48,210 €</span> <span slot="delta">12% up on August</span>
				</amb-stat-tile>
			</li>
			<li>
				<amb-stat-tile>Open invoices <span slot="value">14</span> <span slot="description">3 overdue</span></amb-stat-tile>
			</li>
			<li>
				<amb-tile href="#stats">
					<amb-icon slot="icon" name="receipt_long"></amb-icon>
					Invoices
					<span slot="description">Send, chase, and export.</span>
				</amb-tile>
			</li>
		</ul>
	</Stage>
</ComponentPage>

<style>
	.tiles {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
		align-content: start;
		gap: var(--amb-space-300);
		margin: 0;
		padding: 0;
		list-style: none;
	}
</style>
