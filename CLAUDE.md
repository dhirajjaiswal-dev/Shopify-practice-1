# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev          # Watch mode: compile Tailwind CSS on file changes
npm run build        # One-time Tailwind CSS build
npm run build:prod   # Minified production build
npm run shopify      # Start Shopify theme dev server (store: dhiraj-jaiswal.myshopify.com)
```

Run both `npm run dev` and `npm run shopify` simultaneously during development — Tailwind watches for CSS changes while Shopify CLI serves the theme locally.

## Architecture Overview

This is a Shopify theme ("themex") built for a pet supply store. It uses JSON-based templates (Shopify 2.0 architecture) with Tailwind CSS and vanilla JavaScript.

### CSS

- `src/input.css` — Tailwind directives source (edit this, not the output)
- `assets/tailwind.css` — Compiled output (auto-generated, do not edit)
- `assets/base.css` — Hand-authored component styles and custom utilities

Breakpoints are customized in `tailwind.config.js`: `xs: 375px`, `sm: 475px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`. The font family is theme-setting-driven via CSS variable `--font-primary--family`.

### JavaScript

Seven vanilla JS modules in `assets/`, each loaded via `<script>` tags. No bundler — files are served directly by Shopify CDN.

Key patterns:
- **Data attributes** drive DOM targeting (e.g., `[data-cart-drawer]`, `[data-menu-toggle]`, `[data-cart-items]`)
- **Custom events** coordinate between modules — `cart:item-added` fires after add-to-cart AJAX, triggers cart drawer open and count update
- **Shopify AJAX API** used for cart operations (`/cart/add.js`, `/cart.js`)
- Variant selection state is managed in `quantity-logic.js` via JSON embedded in the page; URL is updated with `history.replaceState()`

### Sections and Snippets

- `sections/` — 37 merchant-customizable components with `{% schema %}` blocks
- `snippets/` — 35 reusable Liquid fragments (icons, product card, cart items, etc.)
- `blocks/` — Nestable blocks (`group.liquid`, `text.liquid`, `container.liquid`)
- `layout/theme.liquid` — Master layout: loads CSS/JS, renders header group, cart drawer, and main content

### Templates

All templates in `templates/` are JSON files (Shopify 2.0) that define which sections appear on each page type. Modify these to add/remove/reorder sections on a page.

### Theme Settings

Global merchant-facing settings are defined in `config/settings_schema.json` (font picker, logo, favicon). Current saved values live in `config/settings_data.json` (auto-managed by Shopify).

### Linting

Theme Check is configured via `.theme-check.yml` (extends `theme-check:recommended`). Run via Shopify CLI:
```bash
shopify theme check
```
