<script lang="ts">
	import SectionNav from '$lib/SectionNav.svelte';
	import { components } from '$lib/sections';

	let { children } = $props();
</script>

<div class="doc-frame">
	<SectionNav label="Components" items={components} />
	<div>
		{@render children()}
	</div>
</div>
