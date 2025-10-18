/**
 * RZ-Colorize Component
 * Automatically colorizes links with rainbow colors based on scroll
 *
 * Usage:
 *   <rz-colorize mode="multi" target="background">
 *     <!-- Your content with links -->
 *   </rz-colorize>
 *
 * Attributes:
 *   mode: 'multi' (each link different) or 'mono' (all same) - default: 'multi'
 *   target: 'background' or 'text' - default: 'background'
 */

class RZColorize extends HTMLElement {
  constructor() {
    super()
    this.rafId = null
    this.frameSkipCount = 0
  }

  connectedCallback() {
    const mode = this.getAttribute('mode') || 'multi'
    const colorTarget = this.getAttribute('target') || 'background'
    const frameSkipInterval = 3

    const colors = [
      '#FF3F3F',
      '#FF8426',
      '#FFD600',
      '#73FF00',
      '#1BFF90',
      '#00FFD9',
      '#20ffc0',
      '#00A6FF',
      '#916CFF',
      '#D901D0',
      '#F940A7',
      '#FFB6B9',
      '#FFDE59',
      '#71FFD6',
      '#B8FFDB',
      '#19e983',
      '#F9FF1B',
      '#00ffaa',
      '#e0e0e0',
      '#FFB347',
      '#FA9153',
      '#B683F6',
      '#FFE761',
      '#94E2FF',
      '#6DFFB6',
      '#FF85CA',
      '#FFD9EC'
    ]

    let links = []
    let linkPositions = []

    const refreshLinks = () => {
      // Find all links, excluding those in shadows
      links = Array.from(this.querySelectorAll('a')).filter((link) => {
        return !link.closest('.rz-3d-shadow')
      })
      console.log('[rz-colorize] Found', links.length, 'links')
      cachePositions()
    }

    const cachePositions = () => {
      linkPositions = links.map((link) => {
        const rect = link.getBoundingClientRect()
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2 + window.pageYOffset
        }
      })
    }

    const updateLinkColors = (x, y) => {
      let monoColor
      if (mode === 'mono') {
        const colorIndex = Math.floor((x + y) / 50) % colors.length
        monoColor = colors[colorIndex]
      }

      const adjustedY = y + window.pageYOffset

      links.forEach((link, index) => {
        const position = linkPositions[index]
        if (!position) return

        const distance = Math.sqrt(
          Math.pow(position.x - x, 2) + Math.pow(position.y - adjustedY, 2)
        )

        let color
        if (mode === 'mono') {
          color = monoColor
        } else {
          const colorIndex =
            Math.floor((position.x + position.y + distance) / 100) % colors.length
          color = colors[colorIndex]
        }

        if (!link.dataset.colorizerInit) {
          link.dataset.colorizerInit = 'true'
        }

        const currentColor = link.dataset.currentColor
        if (currentColor === color) return

        link.dataset.currentColor = color

        if (colorTarget === 'text') {
          link.style.color = color
          link.style.backgroundColor = '#000'
        } else {
          link.style.backgroundColor = color
          link.style.color = '#000'
        }
      })
    }

    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop
      const x = window.innerWidth / 2
      const y = scrollY

      updateLinkColors(x, y)
    }

    const handleScrollEvent = () => {
      if (this.rafId) return

      this.rafId = requestAnimationFrame(() => {
        this.rafId = null

        this.frameSkipCount++
        if (this.frameSkipCount < frameSkipInterval) {
          return
        }
        this.frameSkipCount = 0

        handleScroll()
      })
    }

    // Initialize
    console.log('[rz-colorize] Starting - mode:', mode, 'target:', colorTarget)
    refreshLinks()

    window.addEventListener('scroll', handleScrollEvent, { passive: true })
    window.addEventListener('resize', cachePositions, { passive: true })

    handleScroll()

    // Cleanup
    this._cleanup = () => {
      window.removeEventListener('scroll', handleScrollEvent)
      window.removeEventListener('resize', cachePositions)
      if (this.rafId) {
        cancelAnimationFrame(this.rafId)
        this.rafId = null
      }
    }

    console.log('[rz-colorize] Activated')
  }

  disconnectedCallback() {
    if (this._cleanup) {
      this._cleanup()
    }
  }
}

customElements.define('rz-colorize', RZColorize)
