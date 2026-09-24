# Original brand presets

The `apple` and `airbnb` presets are removed. They were named after, and styled to resemble, other companies' products. A design system adopted by large organisations cannot ship presets that imitate third-party brands. It is a trademark risk, and it is not what those organisations need.

Three original presets replace them. Each is built for a kind of organisation, not for a company:

- `atlas`: enterprise and data. The system face at 14px, 36px controls, 6px corners, ink-blue actions on cool slate, a restrained spring.
- `verdant`: public services and health, with accessibility first. Nunito Sans at 18px, 52px controls, 2px borders, pill actions, AAA body text, an ink focus ring with a yellow halo, and teal success so status never depends on telling red from green.
- `noir`: luxury and retail. Monochrome ink, square fields with pill actions, hairlines, generous space, and slow motion without overshoot.

`press` stays.

Every preset uses open-license faces or the system face, and passes every pair in `contrast-pairs.json` in both themes.

This is a breaking change for products that set `data-brand="apple"` or `data-brand="airbnb"`. Move them to the closest preset: `atlas` for dense product surfaces, `verdant` for rounded and friendly ones.
