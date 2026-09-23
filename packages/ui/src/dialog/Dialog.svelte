<svelte:options
	customElement={{
		tag: 'amb-dialog',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			open: { reflect: true, type: 'Boolean', attribute: 'open' },
			label: { reflect: true, type: 'String', attribute: 'label' }
		}
	}}
/>

<script lang="ts">
	interface Props {
		open?: boolean;
		label?: string;
	}

	let { open = false, label = 'Dialog' }: Props = $props();
	let dialog = $state<HTMLDialogElement>();
	const host = $host();

	function finish() {
		if (host.open) host.open = false;
		host.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
	}

	function dismiss() {
		finish();
		dialog?.close();
	}

	function onClick(event: MouseEvent) {
		if (event.target === dialog) dismiss();
	}

	$effect(() => {
		if (!dialog) return;
		const sync = () => {
			if (!dialog?.open) finish();
		};
		dialog.addEventListener('close', sync);
		dialog.addEventListener('cancel', sync);
		const observer = new MutationObserver(sync);
		observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
		if (open === true) {
			if (!dialog.open) dialog.showModal();
		} else if (dialog.open) {
			dialog.close();
		}
		return () => {
			dialog.removeEventListener('close', sync);
			dialog.removeEventListener('cancel', sync);
			observer.disconnect();
		};
	});
</script>

<dialog bind:this={dialog} part="surface" aria-label={label} onclick={onClick}>
	<div part="body"><slot /></div>
	<button part="close" type="button" onclick={dismiss}>
		<slot name="close">Close</slot>
	</button>
</dialog>

<style>
	:host {
		display: contents;
		font-family: var(--amb-font-family-sans);
		font-size: var(--amb-font-size-300);
		line-height: var(--amb-font-line-height-body);
		color: var(--amb-color-fg-default);
	}

	dialog {
		box-sizing: border-box;
		width: min(32rem, calc(100% - var(--amb-space-600)));
		margin: auto;
		padding: var(--amb-space-500);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-surface);
		color: inherit;
		box-shadow: var(--amb-elevation-3);
	}

	dialog[open] {
		animation: amb-arrive var(--amb-duration-moderate) var(--amb-easing-enter) both;
	}

	dialog::backdrop {
		background: var(--amb-color-fg-default);
		opacity: 0.4;
	}

	div {
		margin-bottom: var(--amb-space-400);
	}

	button {
		box-sizing: border-box;
		min-height: var(--amb-size-control-md);
		padding-inline: var(--amb-space-400);
		border: 0;
		border-radius: var(--amb-radius-md);
		background: var(--amb-color-accent-bg);
		color: var(--amb-color-fg-on-accent);
		font: inherit;
		font-weight: var(--amb-font-weight-semibold);
		cursor: pointer;
	}

	button:focus {
		outline: none;
	}

	button:focus-visible {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
	}

	@keyframes amb-arrive {
		from {
			opacity: 0;
			translate: 0 var(--amb-space-200);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		dialog[open] {
			animation: none;
		}
	}

	@media (forced-colors: active) {
		dialog {
			border: var(--amb-border-width-default) solid CanvasText;
			background: Canvas;
			color: CanvasText;
		}

		button {
			border: var(--amb-border-width-default) solid ButtonText;
			background: ButtonFace;
			color: ButtonText;
		}
	}
</style>
