---
"@ambre-ds/ui": minor
"@ambre-ds/commerce": patch
"@ambre-ds/ai": minor
---

Events reach the page. `change` now crosses the shadow root on checkbox, toggle, radio, select, range, text field, and text area, with the new value in `event.detail`. `amb-menu` fires `select` with the picked item. Every event bubbles, is composed, and has an exported TypeScript type.
