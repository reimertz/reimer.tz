/**
 * RZ-3D Component (Shadow Maker)
 * Wraps content with 3D transforms and automatic shadow cloning
 * Handles mouse/scroll-based rotation
 *
 * Usage:
 *   <rz-3d shadow-layers="3" shadow-z-step="50">
 *     <h1>Your content here</h1>
 *     <p>More content...</p>
 *   </rz-3d>
 *
 * Attributes:
 *   x-rotation: X-axis rotation amount (default: 10)
 *   y-rotation: Y-axis rotation amount (default: 10)
 *   base-x: Initial X rotation (default: -10)
 *   base-y: Initial Y rotation (default: 10)
 *   shadow-layers: Number of shadow layers (default: 1)
 *   shadow-z-step: Z-offset step per layer in rem (default: 80)
 */

class RZ3D extends HTMLElement {
  constructor() {
    super()
    this.rafId = null
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    this.moveEvent = this.isMobile ? 'touchmove' : 'mousemove'
  }

  connectedCallback() {
    console.log('[rz-3d] Initializing 3D container...')

    // Get rotation parameters
    const xRotation = parseFloat(this.getAttribute('x-rotation')) || 10
    const yRotation = parseFloat(this.getAttribute('y-rotation')) || 10
    const baseX = parseFloat(this.getAttribute('base-x')) || -10
    const baseY = parseFloat(this.getAttribute('base-y')) || 10

    // Get shadow layer parameters
    const shadowLayers = parseInt(this.getAttribute('shadow-layers')) || 1
    const shadowZStep = parseFloat(this.getAttribute('shadow-z-step')) || 80

    console.log('[rz-3d] Creating', shadowLayers, 'shadow layers with z-step:', shadowZStep)

    // Create multiple shadow layers
    for (let layerIndex = 0; layerIndex < shadowLayers; layerIndex++) {
      const shadow = document.createElement('div')
      shadow.className = `rz-3d-shadow rz-3d-shadow-layer-${layerIndex}`

      // Optimize: make shadow completely inert
      shadow.setAttribute('aria-hidden', 'true')
      shadow.setAttribute('inert', '') // Prevents all interactions
      shadow.style.pointerEvents = 'none' // No mouse events
      shadow.style.userSelect = 'none' // Not selectable
      shadow.style.contentVisibility = 'auto' // Render optimization

      // Clone all children into shadow
      Array.from(this.childNodes).forEach((node) => {
        const clone = node.cloneNode(true)
        shadow.appendChild(clone)
      })

      // Remove elements that shouldn't be in shadow
      shadow.querySelectorAll('.inline-video').forEach(video => video.remove())

      // Remove all event listeners from cloned elements
      shadow.querySelectorAll('*').forEach(el => {
        // Clone without events by replacing with fresh element
        if (el.tagName === 'A' || el.onclick || el.hasAttribute('data-track-index') || el.hasAttribute('data-video-index')) {
          const cleanEl = el.cloneNode(true)
          el.replaceWith(cleanEl)
        }
      })

      // Calculate depth and opacity for this layer
      const zOffset = (layerIndex + 1) * shadowZStep
      const baseOpacity = 0.3
      const opacityStep = baseOpacity / shadowLayers
      const layerOpacity = baseOpacity - (layerIndex * opacityStep)

      // Apply layer-specific styles
      shadow.style.transform = `translateZ(-${zOffset}rem)`
      shadow.style.setProperty('--final-opacity', layerOpacity)

      // Fade in from front to back: nearest layer (lowest index) appears first
      const delayMs = layerIndex * 750
      shadow.style.animationDelay = `${delayMs}ms`

      // Insert shadow before content
      this.insertBefore(shadow, this.firstChild)

      console.log(`[rz-3d] Layer ${layerIndex + 1}: z=-${zOffset}rem, opacity=${layerOpacity.toFixed(2)}`)
    }

    console.log('[rz-3d] All shadow layers created')

    // Set up translation handlers
    const handleScroll = (scrollY) => {
      const scrolledPercentage =
        (scrollY / document.body.getBoundingClientRect().height) * xRotation
      const xOffset = -scrolledPercentage / 2
      const yOffset = -scrolledPercentage
      const x = baseX + xOffset
      const y = baseY + yOffset

      this.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`
    }

    const handleMove = (clientX, clientY) => {
      const xPercent = clientY / window.innerHeight - 0.5
      const yPercent = clientX / window.innerWidth - 0.5
      const xOffset = -xPercent * xRotation * 2
      const yOffset = yPercent * yRotation * 2
      const x = baseX + xOffset
      const y = baseY + yOffset

      this.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`
    }

    const handleEvent = (event) => {
      if (this.rafId) return

      this.rafId = requestAnimationFrame(() => {
        this.rafId = null
        if (this.isMobile) handleScroll(window.scrollY)
        else handleMove(event.clientX, event.clientY)
      })
    }

    // Set initial rotation
    this.style.transform = `rotateX(${baseX}deg) rotateY(${baseY}deg)`

    // Start listening
    if (this.isMobile) {
      window.addEventListener('scroll', handleEvent, { passive: true })
    } else {
      document.body.addEventListener(this.moveEvent, handleEvent, { passive: true })
    }

    // Store cleanup function
    this._cleanup = () => {
      if (this.isMobile) {
        window.removeEventListener('scroll', handleEvent)
      } else {
        document.body.removeEventListener(this.moveEvent, handleEvent)
      }

      if (this.rafId) {
        cancelAnimationFrame(this.rafId)
        this.rafId = null
      }
    }

    console.log('[rz-3d] Translation activated')
  }

  disconnectedCallback() {
    if (this._cleanup) {
      this._cleanup()
    }
  }
}

customElements.define('rz-3d', RZ3D)
