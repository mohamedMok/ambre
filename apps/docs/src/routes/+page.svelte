<svelte:head>
	<title>Ambre</title>
</svelte:head>

<h1>Ambre</h1>
<p class="lede">
	An open-source design system. Tokens are the decisions. <code>amb-button</code> is the first
	component in one library of Svelte web components.
</p>

<h2>Use it</h2>
<pre><code>import '@ambre/tokens/css';
import '@ambre/ui';</code></pre>
<pre><code>&lt;amb-button type="submit"&gt;Save changes&lt;/amb-button&gt;</code></pre>

<h2>Three layers</h2>
<p>
	Reference tokens are the palette and the dimension scale. System tokens are the public theme
	API, exposed as <code>--amb-*</code> variables. A component token waits until a second component
	needs the same decision.
</p>
<div class="row">
	<amb-button>Save changes</amb-button>
	<amb-button variant="secondary">Cancel</amb-button>
	<amb-button variant="ghost">Learn more</amb-button>
</div>
