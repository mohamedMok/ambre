<script lang="ts">
	import Glyph from './Glyph.svelte';

	let { code, lang = 'html', title = '' }: { code: string; lang?: string; title?: string } = $props();
	let copied = $state(false);

	const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

	/* A small, safe highlighter: every character is escaped first, and only whole tags get spans. */
	function highlightHtml(source: string) {
		let out = '';
		let last = 0;
		for (const match of source.matchAll(/<(\/?)([a-zA-Z][\w-]*)([^>]*)>/g)) {
			out += `<span class="t-text">${escape(source.slice(last, match.index))}</span>`;
			const [, slash, name, rest] = match;
			const attrs = rest.replace(
				/([^\s=]+)(?:=("[^"]*"|'[^']*'|[^\s>]+))?/g,
				(_all, attr: string, value?: string) =>
					`<span class="t-attr">${escape(attr)}</span>` +
					(value ? `=<span class="t-str">${escape(value)}</span>` : '')
			);
			out += `<span class="t-punc">&lt;${slash}</span><span class="t-tag">${name}</span>${attrs}<span class="t-punc">&gt;</span>`;
			last = (match.index ?? 0) + match[0].length;
		}
		return out + `<span class="t-text">${escape(source.slice(last))}</span>`;
	}

	/* One pass over the raw source: each token is escaped on its own, so no span can be matched twice.
	   A # starts a comment only at the start of a line (shell), never inside a value such as a hex color. */
	function highlightScript(source: string) {
		const token =
			/(\/\*[\s\S]*?\*\/|\/\/[^\n]*|^[ \t]*#[^\n]*)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`[^`]*`)|\b(import|from|export|const|let|await|function|return|new)\b/gm;
		let out = '';
		let last = 0;
		for (const match of source.matchAll(token)) {
			out += escape(source.slice(last, match.index));
			const [text, comment, string] = match;
			const cls = comment ? 't-comment' : string ? 't-str' : 't-key';
			out += `<span class="${cls}">${escape(text)}</span>`;
			last = (match.index ?? 0) + text.length;
		}
		return out + escape(source.slice(last));
	}

	const html = $derived(lang === 'html' || lang === 'svelte' ? highlightHtml(code) : highlightScript(code));

	async function copy() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => (copied = false), 1600);
		} catch {
			copied = false;
		}
	}
</script>

<div class="code">
	<div class="code-bar">
		<span class="code-lang">{title || lang}</span>
		<button class="code-copy" type="button" onclick={copy} aria-live="polite">
			<Glyph name={copied ? 'check' : 'copy'} size={16} />
			<span>{copied ? 'Copied' : 'Copy'}</span>
		</button>
	</div>
	<!-- The highlighter escapes all source text before adding spans. -->
	<pre><code>{@html html}</code></pre>
</div>
