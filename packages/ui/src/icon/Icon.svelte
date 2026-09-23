<svelte:options
	customElement={{
		tag: 'amb-icon',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			name: { reflect: true, type: 'String', attribute: 'name' },
			size: { reflect: true, type: 'String', attribute: 'size' },
			label: { reflect: true, type: 'String', attribute: 'label' }
		}
	}}
/>

<script lang="ts">
	interface Props {
		name?: string;
		size?: 'sm' | 'md' | 'lg';
		label?: string;
	}

	let { name = '', size = 'md', label = '' }: Props = $props();
</script>

<span
	part="graphic"
	data-size={size}
	role={label ? 'img' : undefined}
	aria-label={label || undefined}
	aria-hidden={label ? undefined : 'true'}
>
	{#if name}
		<span class="symbol" aria-hidden="true">{name}</span>
	{:else}
		<slot />
	{/if}
</span>

<style>
	:host {
		display: inline-block;
		vertical-align: middle;
		color: var(--amb-color-fg-default);
		line-height: 0;
	}

	span {
		display: inline-flex;
		width: var(--amb-size-icon-md);
		height: var(--amb-size-icon-md);
	}

	:host([size='sm']) span {
		width: var(--amb-size-icon-sm);
		height: var(--amb-size-icon-sm);
	}

	:host([size='lg']) span {
		width: var(--amb-size-icon-lg);
		height: var(--amb-size-icon-lg);
	}

	::slotted(svg) {
		width: 100%;
		height: 100%;
		display: block;
		fill: currentColor;
	}

	.symbol {
		font-family: var(--amb-font-family-icon);
		font-weight: normal;
		font-style: normal;
		font-size: var(--amb-size-icon-md);
		line-height: 1;
		letter-spacing: normal;
		text-transform: none;
		white-space: nowrap;
		word-wrap: normal;
		direction: ltr;
		font-feature-settings: 'liga';
		-webkit-font-smoothing: antialiased;
	}

	:host([size='sm']) .symbol {
		font-size: var(--amb-size-icon-sm);
	}

	:host([size='lg']) .symbol {
		font-size: var(--amb-size-icon-lg);
	}
</style>
