---
name: ambre-inclusion
description: Decides whether an Ambre part belongs in core, a later domain pack, or stays in a product. Use when adding a component, pattern, token tier, or domain pack for commerce, B2B, or SaaS.
---

# Inclusion

A part enters `@ambre/ui` when it is a primitive, or when a second product needs it. A finished design is not a reason.

## Decide

1. Primitive used by every product (button, field, disclosure): core.
2. Needed by one product: leave it in that product.
3. Needed by two products in the same domain: a domain pack, after core exists. Commerce, B2B, and SaaS are compositions of core. They are not flows and not a product shell.
4. Say which case applies before writing a component.

## Refuse

- A component token on first use. That is `ambre-tokens`.
- A Svelte implementation. That is `ambre-component`.
- A checkout, settings app, or dashboard.
