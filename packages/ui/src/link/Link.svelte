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

	/* A refined underline: a thin, softened line that sits a little below the text,
	   then tightens, thickens and takes full colour when the pointer arrives. */
	a {
		border-radius: var(--amb-radius-sm);
		color: var(--amb-color-accent-fg);
		text-decoration-line: underline;
		text-decoration-thickness: var(--amb-border-width-default);
		text-decoration-color: color-mix(in oklab, currentColor 45%, transparent);
		text-underline-offset: var(--amb-space-100);
		text-decoration-skip-ink: auto;
		-webkit-box-decoration-break: clone;
		box-decoration-break: clone;
		-webkit-tap-highlight-color: transparent;
		transition:
			color var(--amb-duration-fast) var(--amb-easing-standard),
			text-decoration-color var(--amb-duration-fast) var(--amb-easing-standard),
			text-decoration-thickness var(--amb-duration-fast) var(--amb-easing-standard),
			text-underline-offset var(--amb-duration-fast) var(--amb-easing-standard),
			box-shadow var(--amb-duration-fast) var(--amb-easing-standard);
	}

	/* Quiet keeps the underline line so it can fade in instead of popping. */
	:host([variant='quiet']) a {
		color: var(--amb-color-fg-muted);
		text-decoration-color: transparent;
	}

	a:hover {
		text-decoration-color: currentColor;
		text-decoration-thickness: var(--amb-border-width-strong);
		text-underline-offset: calc(var(--amb-space-100) / 2);
	}

	:host([variant='quiet']) a:hover {
		color: var(--amb-color-fg-default);
		text-decoration-color: currentColor;
	}

	a:focus {
		outline: none;
	}

	a:focus-visible {
		outline: var(--amb-focus-ring-width) solid var(--amb-color-focus-ring);
		outline-offset: var(--amb-focus-ring-offset);
		box-shadow: 0 0 0
			calc(var(--amb-focus-ring-offset) + var(--amb-focus-ring-width) + var(--amb-focus-halo-width))
			var(--amb-color-focus-halo);
	}

	@media (prefers-reduced-motion: reduce) {
		a {
			transition: none;
		}
	}

	@media (forced-colors: active) {
		a,
		:host([variant='quiet']) a {
			color: LinkText;
			text-decoration: underline;
			text-decoration-color: LinkText;
		}
	}
</style>
