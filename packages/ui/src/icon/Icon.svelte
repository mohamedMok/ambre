<svelte:options
	customElement={{
		tag: 'amb-icon',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			size: { reflect: true, type: 'String', attribute: 'size' },
			label: { reflect: true, type: 'String', attribute: 'label' }
		}
	}}
/>

<script lang="ts">
	interface Props {
		size?: 'sm' | 'md' | 'lg';
		label?: string;
	}

	let { size = 'md', label = '' }: Props = $props();
</script>

<span
	part="graphic"
	data-size={size}
	role={label ? 'img' : undefined}
	aria-label={label || undefined}
	aria-hidden={label ? undefined : 'true'}
>
	<slot />
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
</style>
