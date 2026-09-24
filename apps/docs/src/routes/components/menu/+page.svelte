<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	let fileName = $state('Q3-report.pdf');
	let status = $state('No action yet.');

	function act(action: 'rename' | 'duplicate' | 'download') {
		if (action === 'rename') {
			fileName = fileName === 'Q3-report.pdf' ? 'Q3-report-final.pdf' : 'Q3-report.pdf';
			status = `Renamed to ${fileName}.`;
		} else if (action === 'duplicate') {
			status = `Made a copy of ${fileName}.`;
		} else {
			status = `Started the download of ${fileName}.`;
		}
	}
</script>

<ComponentPage
	id="menu"
	heroAlign="start"
	heroMinHeight={320}
	heroCode={`<amb-menu>
  Share
  <button slot="panel" type="button">Copy link</button>
  <button slot="panel" type="button">Email</button>
  <button slot="panel" type="button">Embed</button>
</amb-menu>`}
	usage={{
		do: [
			'Name the button after what the list holds, such as <strong>Share</strong> or <strong>Actions</strong>. The chevron shows that it opens.',
			'Write each action as a verb: <strong>Rename</strong>, <strong>Duplicate</strong>, <strong>Download</strong>. Keep the list under about seven actions.',
			'Put the most common action first and a destructive one last.'
		],
		dont: [
			'Don’t put links in the list. A menu holds actions. Go somewhere from a navigation or a link.',
			'Don’t hide the only way to do an important task in a menu. Keep it as a visible button.',
			'Don’t use a menu to pick a value for a form. Use a select or radios.'
		]
	}}
>
	{#snippet hero()}
		<div class="hero">
			<amb-menu>
				Share
				<button slot="panel" type="button">Copy link</button>
				<button slot="panel" type="button">Email</button>
				<button slot="panel" type="button">Embed</button>
			</amb-menu>
		</div>
	{/snippet}

	<h2 id="on-a-row">On a row</h2>
	<p>
		A menu keeps the secondary actions of an object together, so the row stays calm. Open it with a click or
		with ArrowDown, and choose an action. The list closes and focus returns to the button.
	</p>
	<Stage
		align="start"
		minHeight={320}
		code={`<div class="file">
  <div>
    <p class="file-name">Q3-report.pdf</p>
    <p class="file-meta">2.4 MB · Edited today</p>
  </div>
  <amb-menu>
    Actions
    <button slot="panel" type="button">Rename</button>
    <button slot="panel" type="button">Duplicate</button>
    <button slot="panel" type="button">Download</button>
  </amb-menu>
</div>`}
	>
		<div class="hero">
			<div class="file-demo">
				<div class="file">
					<div class="file-icon" aria-hidden="true">PDF</div>
					<div class="file-text">
						<p class="file-name">{fileName}</p>
						<p class="file-meta">2.4 MB · Edited today</p>
					</div>
					<amb-menu>
						Actions
						<button slot="panel" type="button" onclick={() => act('rename')}>Rename</button>
						<button slot="panel" type="button" onclick={() => act('duplicate')}>Duplicate</button>
						<button slot="panel" type="button" onclick={() => act('download')}>Download</button>
					</amb-menu>
				</div>
				<p class="status" aria-live="polite">{status}</p>
			</div>
		</div>
	</Stage>

	<h2 id="disabled">Disabled</h2>
	<p>
		A disabled menu leaves the tab order and does not open. Use it when every action in the list is unavailable,
		and say why next to it.
	</p>
	<Stage
		code={`<amb-menu disabled>
  Actions
  <button slot="panel" type="button">Rename</button>
  <button slot="panel" type="button">Delete</button>
</amb-menu>
<p>The file is locked while it syncs.</p>`}
	>
		<amb-menu disabled>
			Actions
			<button slot="panel" type="button">Rename</button>
			<button slot="panel" type="button">Delete</button>
		</amb-menu>
		<p class="status">The file is locked while it syncs.</p>
	</Stage>
</ComponentPage>

<style>
	.hero {
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.file-demo {
		display: grid;
		gap: var(--amb-space-300);
		width: min(100%, 26rem);
	}

	.file {
		display: flex;
		align-items: center;
		gap: var(--amb-space-400);
		padding: var(--amb-space-400);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-md);
		background: var(--amb-color-bg-surface);
	}

	.file-icon {
		display: grid;
		place-items: center;
		flex: none;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: var(--amb-radius-sm);
		background: var(--amb-color-bg-muted);
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-100);
		font-weight: var(--amb-font-weight-semibold);
	}

	.file-text {
		flex: 1;
		min-width: 0;
	}

	.file-name {
		margin: 0;
		overflow: hidden;
		color: var(--amb-color-fg-default);
		font-weight: var(--amb-font-weight-semibold);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.file-meta {
		margin: 0;
		color: var(--amb-color-fg-subtle);
		font-size: var(--amb-font-size-200);
	}

	.status {
		margin: 0;
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
	}
</style>
