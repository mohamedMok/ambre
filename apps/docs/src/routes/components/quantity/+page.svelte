<svelte:head>
	<title>Quantity — Ambre</title>
	<meta name="description" content="amb-quantity sets how many of a product. The slotted text names it." />
</svelte:head>

<p class="eyebrow">Commerce</p>
<h1>Quantity</h1>
<div class="stage-card">
	<p class="stage-label">amb-quantity</p>
	<amb-quantity name="linen" value={1} min={1} max={8}>Linen sheet</amb-quantity>
	<amb-quantity name="sample" value={0} min={0} max={3}>Sample</amb-quantity>
</div>
<p class="lede">
	Use a quantity control to count a product. Decrease stops at the minimum and Increase stops at the maximum.
	It lives in <code>@ambre/commerce</code>.
</p>
<pre><code>&lt;amb-quantity name="linen" value="1" min="1" max="8"&gt;Linen sheet&lt;/amb-quantity&gt;</code></pre>
<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Name the product in the slot.</li>
			<li>Set the minimum and maximum the shop will accept.</li>
		</ul>
	</section>
	<section class="note">
		<h2>Don't</h2>
		<ul>
			<li>Don't build a cart or a checkout from this control. Those stay in the product.</li>
			<li>Don't use it to show a price. Price is text.</li>
		</ul>
	</section>
</div>
