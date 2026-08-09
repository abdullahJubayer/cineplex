---
name: figma-design-to-code
description: >-
  Workflow and guidelines for fetching Figma design tokens, node layouts, Auto Layout parameters,
  and components via the Figma Dev Mode MCP Server, and accurately translating them into production Next.js & Tailwind CSS code.
---

# Figma Design-to-Code Skill (`figma-design-to-code`)

This skill provides step-by-step instructions for AI coding agents to fetch design context from Figma via the `figma-dev-mode-mcp-server` MCP tools and accurately convert Figma visual layouts into high-quality Next.js + Tailwind CSS code.

---

## 🛠️ MCP Server Tools Overview

When connected to `figma-dev-mode-mcp-server`, use the following lazy MCP tools:

- `get_design_context`: Fetch layout parameters, colors, typography, paddings, and Auto Layout structures for specific Figma node IDs.
- `get_variable_defs`: Extract design tokens, color palettes (HSL/HEX), spacing tokens, and typography variables.
- `get_screenshot`: Retrieve visual reference screenshots of Figma frames for pixel-perfect UI verification.
- `get_metadata`: Get node hierarchies and top-level frame identifiers.

---

## 📐 Step-by-Step Design-to-Code Workflow

### Step 1: Discover Figma Node Context
1. Identify the target frame or component node ID (e.g. `4235:25744`).
2. Call `get_design_context` or `get_metadata` to read the layout structure:
   - **Auto Layout Direction**: `VERTICAL` -> Tailwind `flex flex-col`, `HORIZONTAL` -> Tailwind `flex flex-row`.
   - **Spacing & Gaps**: `itemSpacing` -> Tailwind `gap-*.`
   - **Paddings**: `paddingLeft`, `paddingRight`, `paddingTop`, `paddingBottom` -> Tailwind `px-* py-*`.
   - **Corner Radius**: `cornerRadius` -> Tailwind `rounded-*`.

### Step 2: Extract & Apply Color Tokens
1. Read colors from `get_variable_defs` or node styles:
   - Backgrounds: Use dark void canvas colors (`#05070B`, `#0D121F`).
   - Accents: Use primary brand yellow/amber accents (`#FACC15`, `bg-amber-400`).
   - Text Colors: `text-white`, `text-slate-300`, `text-slate-400`.
   - Borders: Subtle translucent borders (`border border-white/10`).

### Step 3: Translate Layout to Next.js + Tailwind CSS
1. **Component Structure**: Keep components modular, accessible, and responsive.
2. **Typography**: Map Figma font weights and sizes to Tailwind classes:
   - `font-black` / `font-extrabold` for headings.
   - `uppercase tracking-wider` or `tracking-tight` where specified in design.
3. **Interactive Elements**: Add hover effects, smooth transitions, and focus rings.

### Step 4: Validate Visual Fidelity
1. Call `get_screenshot` for the target node ID to compare rendered code with the visual layout.
2. Verify spacing, alignment, and responsiveness.

---

## 💡 Best Practices

- **Strict UI Fidelity**: Do not introduce ad-hoc styles that diverge from Figma definitions.
- **No Hardcoded Magic Numbers**: Prefer standard Tailwind spacing/color scale tokens.
- **Client & Server Separation**: Keep Next.js App Router route handlers thin and extract UI components into `src/components/` or `src/features/`.
