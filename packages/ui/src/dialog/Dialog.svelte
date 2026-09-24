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

	let announcing = false;

	function finish() {
		if (announcing) return;
		const wasOpen = Boolean(host.open || dialog?.open);
		if (!wasOpen) return;
		announcing = true;
		if (host.open) host.open = false;
		host.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
		queueMicrotask(() => {
			announcing = false;
		});
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
		const onCancel = () => finish();
		dialog.onclose = sync;
		dialog.addEventListener('cancel', onCancel);
		const observer = new MutationObserver(sync);
		observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
		if (open === true) {
			if (!dialog.open) dialog.showModal();
		} else if (dialog.open) {
			dialog.close();
		}
		return () => {
			dialog.onclose = null;
			dialog.removeEventListener('cancel', onCancel);
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
		/* FLOATING SURFACE at the highest level: top-edge highlight over elevation-3. */
		box-shadow:
			inset 0 1px 0 var(--amb-color-highlight),
			var(--amb-elevation-3);
		/* Closed values double as the exit target; overlay + display keep it in the top layer
		   until the fade finishes. */
		opacity: 0;
		translate: 0 var(--amb-space-200);
		scale: 0.96;
		transition:
			opacity var(--amb-duration-fast) var(--amb-easing-exit),
			translate var(--amb-duration-fast) var(--amb-easing-exit),
			scale var(--amb-duration-fast) var(--amb-easing-exit),
			overlay var(--amb-duration-fast) allow-discrete,
			display var(--amb-duration-fast) allow-discrete;
	}

	dialog[open] {
		opacity: 1;
		translate: 0 0;
		scale: 1;
		transition:
			opacity var(--amb-duration-moderate) var(--amb-easing-enter),
			translate var(--amb-duration-moderate) var(--amb-easing-spring),
			scale var(--amb-duration-moderate) var(--amb-easing-spring),
			overlay var(--amb-duration-moderate) allow-discrete,
			display var(--amb-duration-moderate) allow-discrete;
	}

	/* The scrim dims with the system scrim opacity; where supported it also softens the page. */
	dialog::backdrop {
		background: var(--amb-color-fg-default);
		opacity: 0;
		transition:
			opacity var(--amb-duration-fast) var(--amb-easing-exit),
			overlay var(--amb-duration-fast) allow-discrete,
			display var(--amb-duration-fast) allow-discrete;
	}

	dialog[open]::backdrop {
		opacity: var(--amb-opacity-scrim);
		transition:
			opacity var(--amb-duration-moderate) var(--amb-easing-enter),
			overlay var(--amb-duration-moderate) allow-discrete,
			display var(--amb-duration-moderate) allow-discrete;
	}

	@supports (backdrop-filter: blur(1px)) {
		dialog::backdrop {
			backdrop-filter: blur(var(--amb-space-100));
		}
	}

	@starting-style {
		dialog[open] {
			opacity: 0;
			translate: 0 var(--amb-space-200);
			scale: 0.96;
		}

		dialog[open]::backdrop {
			opacity: 0;
		}
	}

	div {
		margin-bottom: var(--amb-space-400);
	}

	/* The close control uses the RAISED primary recipe from amb-button. */
	button {
		--_depth: inset 0 1px 0 var(--amb-color-highlight), var(--amb-elevation-1);
		--_halo: 0 0 0
			calc(var(--amb-focus-ring-offset) + var(--amb-focus-ring-width) + var(--amb-focus-halo-width))
			var(--amb-color-focus-halo);

		box-sizing: border-box;
		min-height: var(--amb-size-control-md);
		padding-inline: var(--amb-space-400);
		border: var(--amb-border-width-default) solid
			color-mix(in oklab, var(--amb-color-accent-bg-active) 55%, var(--amb-color-accent-bg));
		border-radius: var(--amb-radius-action);
		background: var(--amb-color-accent-bg);
		box-shadow: var(--_depth);
		color: var(--amb-color-fg-on-accent);
		font: inherit;
		font-weight: var(--amb-font-weight-semibold);
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		transition:
			background-color var(--amb-duration-fast) var(--amb-easing-standard),
			box-shadow var(--amb-duration-fast) var(--amb-easing-standard),
			translate var(--amb-duration-moderate) var(--amb-easing-spring),
			scale var(--amb-duration-moderate) var(--amb-easing-spring);
	}

	@media (hover: hover) {
		button:hover {
			--_depth: inset 0 1px 0 var(--amb-color-highlight), var(--amb-elevation-2);
			background: var(--amb-color-accent-bg-hover);
			translate: 0 -1px;
		}
	}

	button:active {
		--_depth: var(--amb-elevation-inset);
		background: var(--amb-color-accent-bg-active);
		translate: 0 0;
		scale: 0.98;
	}

	button:focus {
		outline: none;
	}

	button:focus-visible {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
		box-shadow: var(--_depth), var(--_halo);
	}

	@media (prefers-reduced-motion: reduce) {
		dialog,
		dialog[open],
		dialog::backdrop,
		dialog[open]::backdrop,
		button {
			transition: none;
		}

		dialog,
		dialog[open],
		button:hover,
		button:active {
			translate: 0 0;
			scale: 1;
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
			box-shadow: none;
		}
	}
</style>
