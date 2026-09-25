<svelte:options
	customElement={{
		tag: 'amb-tool-call',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			status: { reflect: true, type: 'String', attribute: 'status' },
			open: { reflect: true, type: 'Boolean', attribute: 'open' }
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
	import { adopt } from '../../../ui/src/styles/adopt';
	import { emit } from '../../../ui/src/internal/events';
	import { slotted } from '../../../ui/src/internal/slots';
	import styles from '../styles/components/tool-call.scss?inline';

	const words = { running: 'Running', complete: 'Done', error: 'Failed' } as const;
</script>

<script lang="ts">
	interface Props {
		status?: 'running' | 'complete' | 'error';
		open?: boolean;
	}

	let { status = 'complete', open = false }: Props = $props();
	const host = $host();
	const has = { input: slotted(host, 'input'), output: slotted(host, 'output'), meta: slotted(host, 'meta') };
	// Without details there is nothing to open, so the header is a plain row.
	const expandable = has.input || has.output;
	const word = $derived(words[status] ?? words.complete);

	function toggle() {
		const next = !open;
		host.open = next;
		emit(host, 'toggle', { open: next });
	}
</script>

{#snippet header()}
	<span class="c-tool-call__status" aria-hidden="true">
		{#if status === 'running'}
			<span class="c-tool-call__spinner"></span>
		{:else if status === 'error'}
			<svg class="c-tool-call__glyph" viewBox="0 0 24 24" focusable="false"><path d="M12 7v6M12 16.5v.01" /></svg>
		{:else}
			<svg class="c-tool-call__glyph" viewBox="0 0 24 24" focusable="false"><path d="M6 12.5l4 4 8-9" /></svg>
		{/if}
	</span>
	<span part="title" class="c-tool-call__title"><slot /></span>
	<span class="u-visually-hidden">, {word}</span>
	{#if has.meta}
		<span part="meta" class="c-tool-call__meta"><slot name="meta" /></span>
	{/if}
{/snippet}

<div class={['c-tool-call', `c-tool-call--${status}`, open && 'is-open']}>
	{#if expandable}
		<button
			part="control"
			type="button"
			class="c-tool-call__header c-tool-call__header--button"
			aria-expanded={open}
			aria-controls="panel"
			onclick={toggle}
		>
			{@render header()}
			<span class="c-tool-call__chevron" aria-hidden="true"></span>
		</button>
		<div id="panel" part="panel" class="c-tool-call__panel" hidden={!open} aria-busy={status === 'running'}>
			{#if has.input}
				<section class="c-tool-call__section">
					<p class="c-tool-call__heading">Input</p>
					<div part="input" class="c-tool-call__body"><slot name="input" /></div>
				</section>
			{/if}
			{#if has.output}
				<section class="c-tool-call__section">
					<p class="c-tool-call__heading">{status === 'error' ? 'Error' : 'Output'}</p>
					<div part="output" class="c-tool-call__body"><slot name="output" /></div>
				</section>
			{/if}
		</div>
	{:else}
		<div part="control" class="c-tool-call__header">{@render header()}</div>
	{/if}
	<!-- Announces a change of state, such as Running to Done, without moving focus. -->
	<span class="u-visually-hidden" role="status">{status === 'running' ? '' : word}</span>
</div>
