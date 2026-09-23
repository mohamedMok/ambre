<svelte:head>
	<title>Menu — Ambre</title>
	<meta name="description" content="amb-menu is a button that opens a list of actions." />
</svelte:head>

<p class="eyebrow">Components</p>
<h1>Menu</h1>
<div class="stage-card">
	<p class="stage-label">amb-menu</p>
	<amb-menu>
		Share
		<button slot="panel" type="button">Copy link</button>
		<button slot="panel" type="button">Email</button>
	</amb-menu>
</div>
<p class="lede">
	The trigger is a button. Each action is a menu item. ArrowDown opens the list. Escape closes it and
	returns focus to the trigger.
</p>
<pre><code>&lt;amb-menu&gt;
  Share
  &lt;button slot="panel" type="button"&gt;Copy link&lt;/button&gt;
&lt;/amb-menu&gt;</code></pre>
<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Name the button with the action that opens the list.</li>
		</ul>
	</section>
	<section class="note">
		<h2>Don't</h2>
		<ul>
			<li>Don't put a link in the list. Go somewhere from a link outside it.</li>
		</ul>
	</section>
</div>
