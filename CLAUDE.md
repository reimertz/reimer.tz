# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Pierre Reimertz built with Astro. The site features a creative 3D interface with interactive elements, night mode, lazy loading, and a typewriter-style intro animation.

## Development Commands

### Starting Development
```bash
npm run dev
```
Compiles SCSS stylesheets and starts the Astro dev server.

### Building for Production
```bash
npm run build
```
Compiles CSS, runs Astro type checking, and builds the static site.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing.

### CSS Compilation Only
```bash
npm run compile:css
```
Compiles SCSS from `public/stylesheets/builder.scss` to `public/stylesheets/styles.css`.

## Architecture

### Framework
- **Astro 5**: Static site generator with component-based architecture
- **TypeScript**: Configured with strict mode (`astro/tsconfigs/strict`)
- **Sass**: For CSS preprocessing

### Key Directories

- `src/pages/` - Astro pages (routes)
  - `index.astro` - Main portfolio page
  - Individual project pages (`when-i-go.astro`, `the-night-is-young.astro`, `where-is-pieter-levels.astro`)
- `src/layouts/` - Shared layouts
  - `Layout.astro` - Base layout with meta tags, analytics, and all interactive JavaScript classes
- `src/components/` - Reusable components
  - `Box.astro` - 3D box component with six faces
- `src/data/` - Static data files
  - `projects.json` - Portfolio projects list with metadata
- `public/stylesheets/` - SCSS architecture
  - `builder.scss` - Main entry point that imports all partials
  - `_variables.scss` - Design tokens (colors, fonts, sizing)
  - `components/` - Component-specific styles (3D effects, night mode, lazy loader)
  - `helpers/` - Mixins and modifier utilities
  - `common/` - Base element and heading styles
  - `views/` - Page-specific styles

### JavaScript Architecture

All interactive JavaScript is embedded in `Layout.astro` as inline ES modules. The codebase uses a class-based architecture with the following main classes:

1. **Writer** - Typewriter animation for intro text with special control characters:
   - `#` = backspace
   - `@` = pause
   - `*` = line break
   - `$` = link wrapper (start/end)

2. **LazyLoader** - Lazy loads images based on viewport position with optional fake slowness for effect

3. **Translater** - 3D rotation effects based on mouse movement (desktop) or scroll (mobile)

4. **CursorFriend** - Manages hover states on project items

5. **NightMode** - Toggles dark/light theme with localStorage persistence

All classes are instantiated and started in a `DOMContentLoaded` event listener at the bottom of `Layout.astro`.

### 3D Effects

The site uses custom HTML elements and CSS transforms to create 3D effects:
- `<a-box>` with directional children (`<north>`, `<east>`, etc.)
- `<p-3d>`, `<p-3d-medium>` for 3D text elements
- `<img-3d>` for 3D image containers
- CSS uses `transform: rotateX() rotateY()` controlled by JavaScript

### Projects Data

Projects are stored in `src/data/projects.json` with the following schema:
```json
{
  "title": "Project name",
  "description": "Description text",
  "url": "Link URL",
  "image": "Path to image in /images/projects/",
  "target": "_blank",
  "color": "red|green|etc",
  "style": "Optional inline CSS"
}
```

## Styling System

- **Monospace font** is the primary typeface
- **Color variables** defined in `_variables.scss`: red (#ee324b), green (#1BFF90), pink (#DA28CB), yellow (#ffe066), blue (#247ba0), weird (#70c1b3)
- **Night mode** uses class toggles on `<html>`: `.night-mode-on` / `.night-mode-off`
- **3D components** use CSS transforms managed by JavaScript
- **SCSS must be compiled** before running Astro dev server (handled by `npm run dev`)

## Important Notes

- The SCSS compilation step is required before running Astro since the compiled CSS is referenced in the HTML
- All interactive JavaScript lives in `Layout.astro` - there are no separate `.js` files in the src directory
- TypeScript excludes legacy directories: `gulpfile.js`, `src-jade/`, `public/scripts/`, `public/where-is-pieter-levels/`
- The site uses Google Analytics (UA-61798566-1)
