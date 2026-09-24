# @ambre-ds/commerce

Shop compositions for the [Ambre](https://mohamedmok-ambre.surge.sh) design system, built from the core components and the same tokens. The first is `amb-quantity`. A cart and a checkout stay in your product.

```bash
npm install @ambre-ds/commerce @ambre-ds/tokens
```

```js
import '@ambre-ds/tokens/css';
import '@ambre-ds/commerce';
```

```html
<amb-quantity name="linen" value="1" min="1" max="8">Linen sheet</amb-quantity>
```

The value joins the nearest form. `change` fires with `detail.value` after each step. The − and + buttons are named Decrease and Increase for assistive technology.

Documentation: [mohamedmok-ambre.surge.sh/components/quantity](https://mohamedmok-ambre.surge.sh/components/quantity) · MIT license.
