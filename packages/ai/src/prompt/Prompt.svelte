<svelte:options
	customElement={{
		tag: 'amb-prompt',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			name: { reflect: true, type: 'String', attribute: 'name' },
			value: { type: 'String' },
			placeholder: { reflect: true, type: 'String', attribute: 'placeholder' },
			disabled: { reflect: true, type: 'Boolean', attribute: 'disabled' },
			busy: { reflect: true, type: 'Boolean', attribute: 'busy' }
		},
		extend: (Base) => {
			return class extends Base {
				static formAssociated = true;

				constructor() {
					super();
					this.attachedInternals = this.attachInternals();
					adopt(this.shadowRoot, styles);
				}
			};
		}
	}}
/>

<script module lang="ts">
	import { adopt } from '../../../ui/src/styles/adopt';
	import { emit } from '../../../ui/src/internal/events';
	import { slotted } from '../../../ui/src/internal/slots';
	import styles from '../styles/components/prompt.scss?inline';
</script>

<script lang="ts">
	interface Props {
		name?: string;
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		busy?: boolean;
		attachedInternals?: ElementInternals;
	}

	let {
		name = '',
		value = '',
		placeholder = '',
		disabled = false,
		busy = false,
		attachedInternals
	}: Props = $props();

	let field = $state<HTMLTextAreaElement>();
	const host = $host();
	const id = `amb-prompt-${Math.random().toString(36).slice(2, 8)}`;
	const hasActions = slotted(host, 'actions');
	const empty = $derived(!String(value ?? '').trim());

	// The field grows with its text, up to the height the sheet allows, then scrolls.
	function fit() {
		if (!field) return;
		field.style.height = 'auto';
		field.style.height = `${field.scrollHeight}px`;
	}

	function onInput() {
		if (!field) return;
		host.value = field.value;
		attachedInternals?.setFormValue(field.value);
		fit();
	}

	function send() {
		if (disabled || busy || empty) return;
		const text = String(value).trim();
		// A cancelled send keeps the text, for example when the product has to validate it first.
		if (!emit(host, 'send', { value: text }, { cancelable: true })) return;
		host.value = '';
		if (field) field.value = '';
		attachedInternals?.setFormValue('');
		fit();
		field?.focus();
	}

	function stop() {
		emit(host, 'stop', {});
	}

	function onKeydown(event: KeyboardEvent) {
		// Enter sends; Shift+Enter adds a line; a composing input method keeps its Enter.
		if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
		event.preventDefault();
		send();
	}

	$effect(() => {
		if (!field) return;
		if (field.value !== value) field.value = value ?? '';
		attachedInternals?.setFormValue(field.value);
		fit();
	});
</script>

<div part="field" class={['c-prompt', disabled && 'is-disabled', busy && 'is-busy']}>
	<label for={`${id}-field`} class="c-prompt__label u-visually-hidden"><slot /></label>
	<textarea
		bind:this={field}
		id={`${id}-field`}
		part="control"
		class="c-prompt__control"
		rows="1"
		{name}
		{disabled}
		placeholder={placeholder || undefined}
		aria-describedby={`${id}-hint`}
		oninput={onInput}
		onkeydown={onKeydown}
	></textarea>
	<span id={`${id}-hint`} class="u-visually-hidden">Enter to send, Shift and Enter for a new line.</span>
	<div class="c-prompt__bar">
		{#if hasActions}
			<div part="actions" class="c-prompt__actions"><slot name="actions" /></div>
		{/if}
		{#if busy}
			<button part="stop" type="button" class="c-prompt__send c-prompt__send--stop" aria-label="Stop" onclick={stop}>
				<svg class="c-prompt__glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
					<rect x="7" y="7" width="10" height="10" rx="2" />
				</svg>
			</button>
		{:else}
			<button
				part="send"
				type="button"
				class="c-prompt__send"
				aria-label="Send"
				disabled={disabled || empty}
				onclick={send}
			>
				<svg class="c-prompt__glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
					<path d="M12 19V5M6 11l6-6 6 6" />
				</svg>
			</button>
		{/if}
	</div>
</div>
