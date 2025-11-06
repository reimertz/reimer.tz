# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A buildless portfolio website using native Web APIs, ES modules, and Web Components. No frameworks, no build step, just modern web standards.

## Development Commands

### Local Development Server
```bash
./serve.sh [port]
```
- Defaults to port 8000
- Auto-detects available server (python3, python, php, or npx http-server)
- Access at http://localhost:8000

### Code Formatting
Uses Prettier with the following configuration:
- Single quotes
- No semicolons
- 2-space tabs
- 90 character line width
- Strict HTML whitespace sensitivity

Run: `npx prettier --write .`

## Architecture

### Component System
Custom Web Components with vanilla JavaScript (no framework). All components follow a consistent pattern:

**Component Structure:**
- `_components/[component-name]/[component-name].js` - Component logic
- `_components/[component-name]/[component-name].css` - Component styles
- Each component is a self-contained Custom Element

**Existing Components:**
- `rz-3d` - 3D transforms with mouse/scroll tracking and automatic shadow cloning
- `rz-3d-img` - 3D image component
- `rz-colorize` - Rainbow link colorization based on scroll position
- `rz-video-embed` - Video embedding with inline playback
- `rz-music-player` - Audio playback component
- `rz-music-dialog` - Music dialog interface

**Component Guidelines:**
- Use ES6 classes extending `HTMLElement`
- Register with `customElements.define()`
- Implement `connectedCallback()` for initialization
- Implement `disconnectedCallback()` for cleanup (remove event listeners, cancel RAF)
- Store cleanup function as `this._cleanup` for proper teardown
- Use `requestAnimationFrame` for smooth animations
- Make mobile-responsive (check `navigator.userAgent` for mobile detection)
- Use `passive: true` for scroll/touch event listeners

### Page Structure
- `index.html` - Main portfolio page
- `_lib/` - Shared utilities and libraries
- `_styles/` - Global CSS
- `demos/` - Demo files and assets

### Module System
Uses native ES modules (`type="module"` scripts):
- Import components directly: `import '/_components/rz-3d/rz-3d.js'`
- Import utilities: `import initPageTransitions from '/_lib/page-transitions.js'`
- No bundler required - browsers handle module resolution

### Page Transitions
Native View Transitions API implementation in `_lib/page-transitions.js`:
- Intercepts same-origin link clicks
- Uses `document.startViewTransition()` for smooth page transitions
- Fetches new page content, updates DOM, and re-initializes scripts
- Progressive enhancement - gracefully degrades if API not supported
- Handles browser back/forward navigation

### Component Composition Pattern
Components are designed to be nested and composed:
```html
<rz-video-embed>
  <rz-colorize mode="multi" target="background">
    <rz-3d shadow-layers="3" shadow-z-step="60">
      <!-- content -->
    </rz-3d>
  </rz-colorize>
</rz-video-embed>
```

### Shadow Layer System
The `rz-3d` component creates shadow layers by:
1. Cloning all child nodes
2. Removing interactive elements (videos, event listeners)
3. Setting `inert` attribute and `pointer-events: none` for performance
4. Applying progressive z-offset (`translateZ`) and opacity
5. Staggered fade-in animation (750ms delay between layers)

### Performance Optimizations
- Frame skipping in scroll handlers (e.g., `frameSkipInterval = 3`)
- `contentVisibility: auto` on shadow layers
- Position caching to avoid repeated `getBoundingClientRect()` calls
- `requestAnimationFrame` throttling for smooth 60fps animations
- Passive event listeners for scroll/touch events

## Key Implementation Details

### Custom Element Lifecycle
When creating new components:
1. Initialize properties in `constructor()`
2. Set up DOM and event listeners in `connectedCallback()`
3. Always implement cleanup in `disconnectedCallback()`
4. Use `this._cleanup` pattern to store cleanup function

### Avoiding Shadow DOM Interactions
The `rz-3d` shadow layers should not receive events. Always:
- Check `!link.closest('.rz-3d-shadow')` when querying interactive elements
- Use `aria-hidden="true"` and `inert` attributes
- Strip event listeners from cloned elements

### Console Logging Convention
Use prefixed console logs for debugging:
```javascript
console.log('[component-name] Message here')
```

## File Organization
- Root HTML files are entry points (e.g., `index.html`, `tiny-tiger.html`)
- Components are prefixed with `rz-` namespace
- Shared utilities live in `_lib/`
- Global styles in `_styles/`
- Static assets and demos in `demos/`

## Browser Support
Requires modern browsers with support for:
- ES6 modules
- Custom Elements (Web Components)
- View Transitions API (progressive enhancement)
- CSS transforms and 3D transforms
