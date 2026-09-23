<script lang="ts">
	import { componentGroups } from '$lib/sections';
</script>

<svelte:head>
	<title>Components — Ambre</title>
	<meta
		name="description"
		content="Ambre components. Actions, forms, status, and navigation."
	/>
</svelte:head>

<p class="eyebrow">Components</p>
<h1>Actions, forms, status, and a way through.</h1>
<p class="lede">The label is the slotted text. Headings stay native HTML.</p>

{#each componentGroups as group}
	<h2>{group.title}</h2>
	<p class="lede">{group.summary}</p>
	<ul class="paths">
		{#each group.items as item}
			<li class="path">
				<a href={item.href}>
					<strong>{item.label}</strong>
					<small>{item.summary}</small>
				</a>
			</li>
		{/each}
	</ul>
{/each}
