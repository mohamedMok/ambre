<svelte:options
	customElement={{
		tag: 'amb-dialog',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			open: { reflect: true, type: 'Boolean', attribute: 'open' },
			label: { reflect: true, type: 'String', attribute: 'label' }
		},
		extend: (Base) => {
			return class extends Base {
				constructor() {
					super();
					adopt(this.shadowRoot, styles);
				}
			};
		}
	}}
/>

<script module lang="ts">
	import { adopt } from '../styles/adopt';
	import styles from '../styles/components/dialog.scss?inline';
</script>

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

<dialog bind:this={dialog} part="surface" class="c-dialog" aria-label={label} onclick={onClick}>
	<div part="body" class="c-dialog__body"><slot /></div>
	<button part="close" type="button" class="c-dialog__close" onclick={dismiss}>
		<slot name="close">Close</slot>
	</button>
</dialog>
