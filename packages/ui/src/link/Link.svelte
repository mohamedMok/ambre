<svelte:options
	customElement={{
		tag: 'amb-link',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			href: { reflect: true, type: 'String', attribute: 'href' },
			variant: { reflect: true, type: 'String', attribute: 'variant' },
			external: { reflect: true, type: 'Boolean', attribute: 'external' }
		}
	}}
/>

<script lang="ts">
	interface Props {
		href?: string;
		variant?: 'text' | 'quiet';
		external?: boolean;
	}

	let { href = '', variant = 'text', external = false }: Props = $props();
</script>

<a
	part="control"
	href={href || undefined}
	target={external ? '_blank' : undefined}
	rel={external ? 'noreferrer' : undefined}
	data-variant={variant}
>
	<slot />
</a>

<style>
	:host {
		display: inline;
		font-family: var(--amb-font-family-sans);
		font-weight: var(--amb-font-weight-semibold);
		line-height: var(--amb-font-line-height-body);
	}

	a {
		color: var(--amb-color-accent-fg);
		text-decoration-line: underline;
		text-decoration-thickness: var(--amb-border-width-default);
		transition: color var(--amb-duration-fast) var(--amb-easing-standard);
	}

	:host([variant='quiet']) a {
		color: var(--amb-color-fg-muted);
		text-decoration-line: none;
	}

	:host([variant='quiet']) a:hover {
		text-decoration-line: underline;
	}

	a:focus {
		outline: none;
	}

	a:focus-visible {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
	}

	@media (prefers-reduced-motion: reduce) {
		a {
			transition: none;
		}
	}

	@media (forced-colors: active) {
		a {
			color: LinkText;
			text-decoration: underline;
		}
	}
</style>
