<script lang="ts">
	/* Site chrome icons as inline SVG, so nothing flashes while a font loads. 24px grid, 1.75 stroke. */
	const paths: Record<string, string> = {
		search: 'M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm5.3-2.2L21 21',
		sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-13v2m0 14v2M4.6 4.6 6 6m12 12 1.4 1.4M3 12h2m14 0h2M4.6 19.4 6 18M18 6l1.4-1.4',
		moon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z',
		menu: 'M4 7h16M4 12h16M4 17h16',
		close: 'M6 6l12 12M18 6 6 18',
		arrow: 'M5 12h14m-6-6 6 6-6 6',
		external: 'M14 5h5v5m0-5-8 8M19 14v5H5V5h5',
		copy: 'M9 9h10v10H9zM5 15V5h10',
		check: 'M5 12.5 10 17 19 7',
		code: 'm9 8-4 4 4 4m6-8 4 4-4 4',
		github:
			'M12 3a9 9 0 0 0-2.8 17.5c.5.1.6-.2.6-.4v-1.6c-2.5.5-3-1.1-3-1.1-.4-1-1-1.3-1-1.3-.8-.6.1-.6.1-.6.9.1 1.4.9 1.4.9.8 1.4 2.1 1 2.6.8.1-.6.3-1 .6-1.2-2-.2-4.1-1-4.1-4.4 0-1 .3-1.8.9-2.4-.1-.2-.4-1.1.1-2.4 0 0 .8-.2 2.5.9a8.6 8.6 0 0 1 4.5 0c1.7-1.1 2.5-.9 2.5-.9.5 1.3.2 2.2.1 2.4.6.6.9 1.4.9 2.4 0 3.4-2.1 4.2-4.1 4.4.3.3.6.8.6 1.6v2.4c0 .2.1.5.6.4A9 9 0 0 0 12 3Z',
		layers: 'M12 3 3 8l9 5 9-5-9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5',
		shield: 'M12 3 5 6v5c0 4.4 3 8.3 7 9.5 4-1.2 7-5.1 7-9.5V6l-7-3Zm-3 9 2 2 4-4',
		blocks: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
		scale: 'M12 4v16M6 8h12M6 8l-3 6h6L6 8Zm12 0-3 6h6l-3-6ZM8 20h8'
	};

	let { name, size = 20, label = '' }: { name: string; size?: number; label?: string } = $props();
</script>

<svg
	class="glyph"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={name === 'github' ? 0 : 1.75}
	stroke-linecap="round"
	stroke-linejoin="round"
	role={label ? 'img' : undefined}
	aria-label={label || undefined}
	aria-hidden={label ? undefined : 'true'}
>
	<path d={paths[name]} fill={name === 'github' ? 'currentColor' : 'none'} />
</svg>

<style>
	.glyph {
		flex: none;
		display: block;
	}
</style>
