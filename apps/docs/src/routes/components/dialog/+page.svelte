<script lang="ts">
	import CodeBlock from '$lib/CodeBlock.svelte';
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	type DialogElement = HTMLElement & { open: boolean };

	let heroDialog = $state<DialogElement>();
	let heroButton = $state<HTMLElement>();
	let termsDialog = $state<DialogElement>();
	let termsButton = $state<HTMLElement>();
	let sessionDialog = $state<DialogElement>();
	let sessionButton = $state<HTMLElement>();
	let closes = $state(0);

	/** Opens the dialog from its button. The dialog never opens on page load. */
	function wire(button: HTMLElement | undefined, dialog: DialogElement | undefined, onClose?: () => void) {
		if (!button || !dialog) return;
		const show = () => {
			dialog.open = true;
		};
		const closed = () => onClose?.();
		button.addEventListener('click', show);
		dialog.addEventListener('close', closed);
		return () => {
			button.removeEventListener('click', show);
			dialog.removeEventListener('close', closed);
		};
	}

	$effect(() => wire(heroButton, heroDialog));
	$effect(() => wire(termsButton, termsDialog));
	$effect(() => wire(sessionButton, sessionDialog, () => (closes += 1)));
</script>

<ComponentPage
	id="dialog"
	heroCode={`<amb-button id="shortcuts-button">Show keyboard shortcuts</amb-button>

<amb-dialog id="shortcuts" label="Keyboard shortcuts">
  <h2>Keyboard shortcuts</h2>
  <dl>
    <dt><kbd>⌘</kbd> <kbd>K</kbd></dt><dd>Search</dd>
    <dt><kbd>⌘</kbd> <kbd>S</kbd></dt><dd>Save the draft</dd>
    <dt><kbd>?</kbd></dt><dd>Show this list</dd>
  </dl>
  <span slot="close">Done</span>
</amb-dialog>`}
	usage={{
		do: [
			'Open a dialog only from a person’s action, such as a button press. Set <code>open</code> in the click handler.',
			'Name it with <code>label</code>, and repeat the name as a native heading at the top of the content.',
			'Write the close slot as the outcome, such as <strong>Done</strong> or <strong>Stay signed in</strong>, not a bare <strong>OK</strong>.'
		],
		dont: [
			'Don’t open a dialog on page load. It blocks the page before anyone asked for it.',
			'Don’t put a long form or a second dialog inside. Move a long task to its own page.',
			'Don’t use a dialog for a success message. Use a banner, which does not take focus.'
		]
	}}
>
	{#snippet hero()}
		<amb-button bind:this={heroButton}>Show keyboard shortcuts</amb-button>
		<amb-dialog label="Keyboard shortcuts" bind:this={heroDialog}>
			<h2 class="dialog-title">Keyboard shortcuts</h2>
			<dl class="shortcuts">
				<div><dt><kbd>⌘</kbd> <kbd>K</kbd></dt><dd>Search</dd></div>
				<div><dt><kbd>⌘</kbd> <kbd>S</kbd></dt><dd>Save the draft</dd></div>
				<div><dt><kbd>?</kbd></dt><dd>Show this list</dd></div>
			</dl>
			<span slot="close">Done</span>
		</amb-dialog>
	{/snippet}

	<h2 id="opening">Opening</h2>
	<p>
		The dialog starts closed. Set its <code>open</code> property from the button that asks for it. It opens as a
		modal, moves focus inside, and keeps Tab there until it closes.
	</p>
	<CodeBlock
		lang="js"
		title="Open from a button"
		code={`const button = document.querySelector('#shortcuts-button');
const dialog = document.querySelector('#shortcuts');

button.addEventListener('click', () => {
  dialog.open = true;
});`}
	/>

	<h2 id="content">Content</h2>
	<p>
		The content is yours: a native heading, a few short paragraphs, and at most a small list. The close control
		comes last, and its slot says what closing means.
	</p>
	<Stage
		code={`<amb-button variant="secondary">Review the new terms</amb-button>

<amb-dialog label="Updated terms of service">
  <h2>Updated terms of service</h2>
  <p>From 1 November, invoices are due in 30 days instead of 45.</p>
  <p>Nothing changes for invoices sent before that date.</p>
  <span slot="close">I understand</span>
</amb-dialog>`}
	>
		<amb-button variant="secondary" bind:this={termsButton}>Review the new terms</amb-button>
		<amb-dialog label="Updated terms of service" bind:this={termsDialog}>
			<h2 class="dialog-title">Updated terms of service</h2>
			<p class="dialog-text">From 1 November, invoices are due in 30 days instead of 45.</p>
			<p class="dialog-text">Nothing changes for invoices sent before that date.</p>
			<span slot="close">I understand</span>
		</amb-dialog>
	</Stage>

	<h2 id="closing">Closing</h2>
	<p>
		Escape, a click on the backdrop, and the close control all close the dialog. Each fires one
		<code>close</code> event, <code>open</code> returns to false, and focus goes back to the control that opened
		it. Open the dialog below and close it each way.
	</p>
	<Stage
		code={`<amb-button variant="secondary">Preview the timeout warning</amb-button>

<amb-dialog label="Session ending">
  <h2>Your session ends in 5 minutes</h2>
  <p>You have been inactive for 25 minutes. Unsaved changes stay in this tab.</p>
  <span slot="close">Stay signed in</span>
</amb-dialog>`}
	>
		<div class="closing">
			<amb-button variant="secondary" bind:this={sessionButton}>Preview the timeout warning</amb-button>
			<p class="dialog-status" aria-live="polite">
				{closes === 0 ? 'Not closed yet.' : `Closed ${closes} ${closes === 1 ? 'time' : 'times'}. Focus is back on the button.`}
			</p>
		</div>
		<amb-dialog label="Session ending" bind:this={sessionDialog}>
			<h2 class="dialog-title">Your session ends in 5 minutes</h2>
			<p class="dialog-text">You have been inactive for 25 minutes. Unsaved changes stay in this tab.</p>
			<span slot="close">Stay signed in</span>
		</amb-dialog>
	</Stage>
	<CodeBlock
		lang="js"
		title="Listen for the close"
		code={`dialog.addEventListener('close', () => {
  // Record the dismissal, or restore what the dialog changed.
});`}
	/>
</ComponentPage>

<style>
	.dialog-title {
		margin: 0 0 var(--amb-space-400);
		padding: 0;
		color: var(--amb-color-fg-default);
		font-size: var(--amb-font-size-500);
		font-weight: var(--amb-font-weight-semibold);
		line-height: var(--amb-font-line-height-tight);
	}

	.dialog-text {
		margin: 0 0 var(--amb-space-300);
		color: var(--amb-color-fg-default);
	}

	.shortcuts {
		display: grid;
		gap: var(--amb-space-300);
		margin: 0;
	}

	.shortcuts div {
		display: grid;
		grid-template-columns: 6rem minmax(0, 1fr);
		align-items: center;
		gap: var(--amb-space-300);
	}

	.shortcuts dt {
		display: flex;
		gap: var(--amb-space-100);
	}

	.shortcuts dd {
		margin: 0;
		color: var(--amb-color-fg-default);
	}

	.closing {
		display: grid;
		justify-items: center;
		gap: var(--amb-space-300);
	}

	.dialog-status {
		margin: 0;
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
	}
</style>
