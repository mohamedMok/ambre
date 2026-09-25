# @ambre-ds/ai

AI compositions for the [Ambre](https://mohamedmok-ambre.surge.sh) design system, built from the core components and the same tokens. The model, the streaming, and the conversation stay in your product.

```bash
npm install @ambre-ds/ai @ambre-ds/tokens
```

```js
import '@ambre-ds/tokens/css';
import '@ambre-ds/ai';
```

```html
<div role="log" aria-label="Conversation">
  <amb-message from="user">Summarise the last three invoices.</amb-message>
  <amb-message from="assistant" status="streaming">
    <span slot="author">Assistant</span>
    Three invoices, 4,210 euros in total…
  </amb-message>
</div>
<amb-thinking label="Reading the invoices"></amb-thinking>
<amb-suggestion>Draft a reminder email</amb-suggestion>
<amb-prompt placeholder="Ask anything">Message</amb-prompt>
```

| Element | What it is |
| --- | --- |
| `amb-prompt` | The composer. Enter sends, Shift+Enter adds a line. Fires `send` with `detail.value`, and `stop` while `busy`. |
| `amb-message` | One turn of the conversation, from the user or the assistant, complete, streaming, or failed. |
| `amb-thinking` | A status while the model works. The label is announced politely. |
| `amb-suggestion` | A prompt people can send in one press. |
| `amb-tool-call` | A step the agent took: running, done, or failed, with its input and output. Fires `toggle`. |
| `amb-code-block` | Code with its language and a copy button. Follows a streamed answer. Fires `copied`. |

Documentation: [mohamedmok-ambre.surge.sh/components/prompt](https://mohamedmok-ambre.surge.sh/components/prompt) · MIT license.
