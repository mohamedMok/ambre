---
name: ambre-storybook
description: Writes Ambre Storybook stories for web components. Use when adding stories, controls, themes, or files in apps/storybook.
---

# Storybook

Stories live in `apps/storybook/src`. Import `@ambre-ds/ui` so the element registers. Import `@ambre-ds/tokens/css` from preview, which already does.

## Each component

- One story file. Title `Basics/Button` or the matching group.
- Args and argTypes match the contract props, plus the slot label when the label is content.
- A story for every variant and for disabled.
- The theme toolbar switches `data-theme` on `documentElement`.

A story shows the state. It does not prove accessibility or replace the docs page.

## Refuse

- Controls that set a prop the contract does not have.
- A story that invents a visual the component CSS does not implement.
