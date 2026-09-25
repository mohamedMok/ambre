<svelte:options
	customElement={{
		tag: 'amb-code-block',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			language: { reflect: true, type: 'String', attribute: 'language' },
			wrap: { reflect: true, type: 'Boolean', attribute: 'wrap' }
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
	import styles from '../styles/components/code-block.scss?inline';

	/** Drops the blank lines around the code and the indent every line shares, so markup can be indented. */
	export function tidy(source: string) {
		const lines = source.replace(/\t/g, '  ').split('\n');
		while (lines.length && !lines[0].trim()) lines.shift();
		while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
		const indent = Math.min(
			...lines.filter((line) => line.trim()).map((line) => line.length - line.trimStart().length)
		);
		return lines.map((line) => line.slice(Number.isFinite(indent) ? indent : 0)).join('\n');
	}
</script>

<script lang="ts">
	interface Props {
		language?: string;
		wrap?: boolean;
	}

	let { language = '', wrap = false }: Props = $props();
	const host = $host();
	const label = $derived(language ? `${language} code` : 'Code');
	let text = $state(tidy(host.textContent ?? ''));
	let state = $state<'idle' | 'copied' | 'failed'>('idle');
	let reset: ReturnType<typeof setTimeout> | undefined;

	async function copy() {
		try {
			await navigator.clipboard.writeText(text);
			state = 'copied';
			// Not `copy`: the browser fires its own copy event when people copy a selection.
			emit(host, 'copied', { value: text });
		} catch {
			state = 'failed';
		}
		clearTimeout(reset);
		reset = setTimeout(() => (state = 'idle'), 2000);
	}

	// The light DOM is the source. It is read again when it changes, so a streamed answer stays in step.
	$effect(() => {
		const observer = new MutationObserver(() => (text = tidy(host.textContent ?? '')));
		observer.observe(host, { childList: true, characterData: true, subtree: true });
		return () => {
			observer.disconnect();
			clearTimeout(reset);
		};
	});
</script>

<figure part="surface" class={['c-code-block', wrap && 'is-wrapped']} aria-label={label}>
	<div class="c-code-block__bar">
		<span part="language" class="c-code-block__language">{language || 'Code'}</span>
		<button part="copy" type="button" class={['c-code-block__copy', state !== 'idle' && `is-${state}`]} onclick={copy}>
			<svg class="c-code-block__glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
				{#if state === 'copied'}
					<path d="M6 12.5l4 4 8-9" />
				{:else}
					<rect x="8.5" y="8.5" width="11" height="11" rx="2.5" />
					<path d="M15.5 5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2" />
				{/if}
			</svg>
			{state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy'}
		</button>
	</div>
	<!-- Focusable, so a keyboard can scroll a long line into view (WCAG 2.1.1, axe scrollable-region-focusable). -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<pre
		part="code"
		class="c-code-block__code"
		tabindex="0"
		aria-label={label}><code>{text}</code></pre>
	<span class="u-visually-hidden" role="status">{state === 'copied' ? 'Copied to the clipboard' : ''}</span>
	<div class="c-code-block__source" hidden><slot /></div>
</figure>
