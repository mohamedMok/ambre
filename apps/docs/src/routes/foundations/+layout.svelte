<script lang="ts">
	import SectionNav from '$lib/SectionNav.svelte';
	import { foundations } from '$lib/sections';

	let { children } = $props();
</script>

<div class="doc-frame">
	<SectionNav label="Foundations" items={foundations} />
	<div>
		{@render children()}
	</div>
</div>
