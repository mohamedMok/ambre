<svelte:options
	customElement={{
		tag: 'amb-message',
		shadow: { mode: 'open' },
		props: {
			from: { reflect: true, type: 'String', attribute: 'from' },
			status: { reflect: true, type: 'String', attribute: 'status' }
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
	import { slotted } from '../../../ui/src/internal/slots';
	import styles from '../styles/components/message.scss?inline';
</script>

<script lang="ts">
	interface Props {
		from?: 'user' | 'assistant';
		status?: 'complete' | 'streaming' | 'error';
	}

	let { from = 'assistant', status = 'complete' }: Props = $props();
	const host = $host();
	const id = `amb-message-${Math.random().toString(36).slice(2, 8)}`;
	const has = {
		avatar: slotted(host, 'avatar'),
		author: slotted(host, 'author'),
		actions: slotted(host, 'actions'),
		error: slotted(host, 'error')
	};
</script>

<article
	part="message"
	class={['c-message', `c-message--${from}`, `is-${status}`]}
	aria-labelledby={has.author ? `${id}-author` : undefined}
	aria-busy={status === 'streaming'}
>
	{#if has.avatar}
		<span part="avatar" class="c-message__avatar" aria-hidden="true"><slot name="avatar" /></span>
	{/if}
	<div class="c-message__main">
		{#if has.author}
			<span id={`${id}-author`} part="author" class="c-message__author"><slot name="author" /></span>
		{/if}
		<div part="bubble" class="c-message__bubble">
			<slot />{#if status === 'streaming'}<span class="c-message__caret" aria-hidden="true"></span>{/if}
		</div>
		{#if status === 'error'}
			<p part="error" class="c-message__error">
				<svg class="c-message__glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
					<circle cx="12" cy="12" r="9" />
					<path d="M12 7.5v5.5M12 16.5v.01" />
				</svg>
				{#if has.error}<slot name="error" />{:else}The answer stopped. Try again.{/if}
			</p>
		{/if}
		{#if has.actions}
			<div part="actions" class="c-message__actions"><slot name="actions" /></div>
		{/if}
	</div>
</article>
