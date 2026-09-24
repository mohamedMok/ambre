# Styles

Sass, organised by ITCSS, named with BEM. Every custom element adopts two constructable stylesheets:
`base.scss` (shared by all elements) and `components/<id>.scss` (shared by every instance of that element).

```
styles/
  settings/      configuration                      no CSS
  tools/         token() depth() tint() rim() halo() transitions(), mixins    no CSS
  _layers.scss   @layer generic, objects, components, utilities
  generic/       resets inside a shadow root         :where(...)
  objects/       undecorated patterns                .o-control
  components/    one sheet per element               .c-button, .c-button__label, .c-button--ghost, .is-open
  utilities/     single-purpose overrides            .u-visually-hidden
  base.scss      layers + generic + objects + utilities
  adopt.ts       compiles each sheet once into a CSSStyleSheet and adopts it
```

## Writing a component sheet

```scss
@use 'tools' as *;

@layer components {
	:host {
		display: inline-block;
	}

	.c-badge {
		border-radius: token(radius-full);
		background: tint(token(color-accent-fg), 12%);
		color: token(color-accent-fg);

		&--danger {
			background: tint(token(color-status-danger-fg), 12%);
			color: token(color-status-danger-fg);
		}
	}
}
```

- Read tokens only with `token(name)` (kebab-case, no prefix). An unknown name fails the build.
- Depth: `@include depth(raised | lifted | sunken | floating | overlay | flat)`. Focus: `@include focus-visible`.
- Put every transition and movement inside `@include motion { … }`. Stop loops inside `@include reduced-motion { … }`.
- Keep BEM flat: `.c-block__element`, never `.c-block__element__child`. Modifiers come from props; `.is-*` states from boolean props.
- Nest at most three levels. No IDs, no `!important`, no raw hex, no `var(--amb-…)`.
