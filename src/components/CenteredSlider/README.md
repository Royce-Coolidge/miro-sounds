# CenteredSlider

A reusable, centered, looping, draggable slider adapted from Osmo Supply's "Centered
Looping Slider". Uses the project's global typography (Rader / Messina Sans / Messina
Sans Mono) and colour tokens (`--fgrory`, `--fg`, `--bg200`).

## Usage

```jsx
import CenteredSlider from "../../components/CenteredSlider/CenteredSlider";

// Zero-config — defaults to the reviews data in src/data/reviews.js
<CenteredSlider heading="What people say" />

// Custom slides + options
<CenteredSlider
  slides={testimonials}     // [{ id, quote|copy, author, image }]
  autoplay
  autoplayDuration={5}      // seconds
  showBullets
  showArrows
  initialIndex={0}
/>
```

### Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `slides` | `Array` | `reviews` data | `{ id, quote\|copy, author, image }` |
| `autoplay` | `boolean` | `true` | auto-advance while in viewport |
| `autoplayDuration` | `number` | `4` | seconds between advances |
| `showBullets` | `boolean` | `true` | avatar bullet navigation |
| `showArrows` | `boolean` | `true` | prev/next arrows |
| `initialIndex` | `number` | `0` | slide centered on mount |
| `heading` | `string` | – | optional `<h3>` above the slider |
| `ariaLabel` | `string` | `"Testimonial slider"` | region label |
| `className` | `string` | `""` | extra classes on the wrapper |

### Re-theming

Colours resolve through local `--cs-*` custom properties. Override them on any wrapping
selector without touching the component:

```css
.my-section .centered-slider-group {
  --cs-accent: var(--fg);            /* corners, bullets, author, arrow hover */
  --cs-surface: var(--bg200);        /* slide + button fill */
}
```

## Dependencies

Uses only plugins in the **public** `gsap` package (already installed): `Draggable`,
`ScrollTrigger`, `CustomEase`. No extra install needed — the component works out of the box.

### Optional: momentum dragging (Club GSAP)

Flick-to-throw momentum on drag uses **InertiaPlugin**, a Club GSAP (members) plugin not
in the public package. Without it, dragging still works and snaps to the nearest slide —
it just stops when you release instead of coasting. Click, bullets, arrows, and autoplay
are unaffected.

If you later get a Club membership and want momentum, install the members build of `gsap`
and add InertiaPlugin to the registration in `horizontalLoop.js`:

```js
import { InertiaPlugin } from "gsap/InertiaPlugin";
gsap.registerPlugin(Draggable, InertiaPlugin);
```

> Note: the helper logs a one-time `console.warn` about the missing InertiaPlugin. It is
> harmless. To silence it, pass `draggable` a `type: "x"` config with `inertia: false`, or
> just ignore it.
