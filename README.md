# reimer.tz - Native Web Portfolio

A buildless portfolio website using native Web APIs, ES modules, and Web Components. No frameworks, no build step, just modern web standards.

## What's Inside

- **No bundler** - Just native ES modules
- **Factory Functions** - No classes, no `this` keyword confusion
- **Web Components** - Self-contained `<x-3d>` with automatic shadows and translation
- **Modern CSS** - Layers, custom properties, 3D transforms
- **Interactive Effects** - 3D rotation, rainbow link colors, video embeds
- **Music Player** - Native audio/video playback with background video

## Getting Started

### 1. Start a local server

```bash
# Using npm script
npm run dev

# Or use the shell script (auto-detects available server)
./serve.sh

# Custom port
./serve.sh 3000
```

### 2. Open in browser

Navigate to `http://localhost:8000`

## Project Structure

```
/
├── index.html           # Main portfolio page
├── tiny-tiger.html      # Music demo page
├── package.json         # Dev scripts (no dependencies!)
├── serve.sh             # Auto-detecting server launcher
├── _styles/
│   └── portfolio.css    # Portfolio styles
├── _components/
│   ├── x-3d/            # 3D container with translation + shadows
│   │   └── x-3d.js
│   └── x-3d-img/        # Profile image component
│       └── x-3d-img.js
└── _lib/
    ├── LinkColorizer.js       # Rainbow link colors (factory function)
    ├── GlobalMusicPlayer.js   # Audio/video player (factory function)
    └── page-transitions.js    # View Transitions API
```

## Components

### `<x-3d>` - The Shadow Maker

Wraps content with 3D transforms and automatic shadow creation. Handles mouse/scroll-based rotation.

```html
<x-3d>
  <h1>Your content here</h1>
  <p>Links and text with automatic shadows!</p>
</x-3d>
```

**Attributes:**
- `x-rotation` - X-axis rotation amount (default: 10)
- `y-rotation` - Y-axis rotation amount (default: 10)
- `base-x` - Initial X rotation (default: -10)
- `base-y` - Initial Y rotation (default: 10)

**What it does:**
- ✅ Clones all children to create 3D shadow
- ✅ Applies 3D transforms to element
- ✅ Handles mouse movement (desktop) or scroll (mobile)
- ✅ Shadow moves opposite to cursor for depth effect

### `<x-3d-img>` - Profile Image

Displays an image with automatic shadow cloning.

```html
<x-3d-img src="/image.jpg" alt="Description"></x-3d-img>
```

## Factory Functions (No `this` keyword!)

All JavaScript modules use factory functions instead of classes - easier for beginners:

```javascript
// LinkColorizer
const linkColorizer = createLinkColorizer({
  mode: 'multi',        // 'multi' or 'mono'
  colorTarget: 'background'  // 'background' or 'text'
})
linkColorizer.start()

// Music Player
const player = createMusicPlayer([
  { name: "Track 1", audioSrc: "/audio.mp3" },
  { name: "Track 2", videoSrc: "/video.mp4", aspectRatio: "9 / 16" }
])
player.start()
player.play()
```

## Features

### 3D Effects

Content automatically gets:
- Mouse-controlled rotation (desktop)
- Scroll-controlled rotation (mobile)
- Blurred, grayscale shadow at depth
- Smooth transitions

### Rainbow Link Colors

Links change color based on scroll position. Each link gets a different color from a 27-color palette:

```javascript
const linkColorizer = createLinkColorizer({
  mode: 'multi',
  colorTarget: 'background'
})
```

### Page Transitions

Uses the native View Transitions API for smooth page navigation:

```javascript
import initPageTransitions from '/_lib/page-transitions.js'
initPageTransitions()
```

### Music Player

Global audio/video player with background video support:

```javascript
const player = createMusicPlayer(tracks)
player.start()
player.play()
player.next()
```

## Why Factory Functions?

**Before (Classes with `this`):**
```javascript
class MusicPlayer {
  constructor(tracks) {
    this.tracks = tracks
    this.isPlaying = false
    this.play = this.play.bind(this)  // Confusing!
  }

  play() {
    this.isPlaying = true  // What is 'this'?
  }
}
```

**After (Factory Functions):**
```javascript
function createMusicPlayer(tracks) {
  let isPlaying = false  // Just a variable!

  const play = () => {
    isPlaying = true  // Crystal clear!
  }

  return { play }
}
```

**Benefits:**
- ✅ No `this` keyword confusion
- ✅ No `.bind()` needed
- ✅ Easier for juniors to understand
- ✅ Private by default (only return what's public)
- ✅ Same usage pattern as classes

## Browser Support

- ES Modules: All modern browsers
- Web Components: All modern browsers
- CSS 3D Transforms: All modern browsers
- View Transitions API: Chrome 111+, Edge 111+, Safari 18+ (gracefully degrades)

## Deployment

Deploy to any static host - no build step required:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## Credits

Original design and JavaScript modules by Pierre Reimertz.
Converted to native Web Components and factory functions.
