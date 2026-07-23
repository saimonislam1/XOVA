# XOVA — Premium Dark Luxury eCommerce Site

A fully static, dependency-free storefront: HTML + CSS + vanilla JS.
No build step, no framework, no backend. Orders are placed by
sending a pre-filled message to WhatsApp — there is no payment
gateway.

## Folder structure

```
/index.html      Main site (all sections)
/404.html         Custom not-found page
/css/style.css    All styling, design tokens as CSS variables at the top
/js/script.js     Product data, cart, filters, animations, WhatsApp checkout
/images/          Product & section photos (currently placeholders)
```

## Adding / editing products

Open `js/script.js` and edit the `PRODUCTS` array near the top. Each
product is one object:

```js
{
  id: 9,
  name: "Your Product Name",
  price: 2990,
  oldPrice: null,        // set a number to show a strikethrough sale price
  category: "Jackets",   // must match a filter chip in index.html, or add a new chip
  sizes: ["S", "M", "L"],
  colors: ["#0c0c0f", "#8b5cf6"],
  desc: "Short one-line description.",
  image: "images/product9.jpg",
  tag: "new",            // "new" | "sale" | "best" | ""
  isNew: true,
  bestseller: false,
  rating: 4.7
}
```

Then drop a real photo at `images/product9.jpg` (any name you like,
just match the `image` path). No base64, no code changes needed
beyond the array entry.

## Replacing placeholder images

Every image referenced in the site is a plain file under `/images`:
`hero.jpg`, `about.jpg`, `product1.jpg`–`product8.jpg`,
`collection1.jpg`–`collection3.jpg`, `og-image.jpg`. They are
currently AI-generated placeholder gradients so the layout previews
correctly — swap in real photography using the **same filenames**
(or update the `src`/`image` paths) and everything else keeps
working.

Recommended photo ratios:
- Hero: portrait, ~4:5
- Product cards: portrait, ~3:4
- Collection tiles: landscape, ~3:2 or taller
- About image: portrait, ~4:5

## WhatsApp checkout

In `js/script.js`, `CONFIG.whatsappNumber` holds the order number
(digits only, country code first, no `+` or spaces). Clicking
**Order Now** opens a modal for name / address / phone, then builds
a message and opens:

```
https://wa.me/<number>?text=<encoded order details>
```

The floating WhatsApp bubble (bottom-right) opens a general inquiry
chat using the same number.

## Cart persistence

The cart is saved to `localStorage` under the key `xova_cart_v1` so
it survives page reloads. Wishlist (heart icon on product cards)
is saved under `xova_wishlist_v1`.

## Design tokens

All colors, spacing, radii, and shadows are CSS custom properties
at the top of `css/style.css` (`:root { ... }`). Change a value once
there to re-theme the whole site — for example swap
`--c-accent-purple` / `--c-accent-blue` for a different accent pair.

## Deploying

This is a static site — upload the folder as-is to any static host
(Netlify, Vercel, GitHub Pages, cPanel, etc.) or open `index.html`
directly in a browser to preview locally.
