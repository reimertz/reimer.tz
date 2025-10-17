//Creator Pierre Reimertz MIT ETC ETC

export default class LinkColorizer {

  constructor({ mode = 'multi', monoColor = '#1BFF90', colorTarget = 'text' } = {}) {
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    this.rafId = null
    this.lastMouseX = window.innerWidth / 2
    this.lastMouseY = window.innerHeight / 2
    this.mode = mode // 'multi' or 'mono'
    this.monoColor = monoColor
    this.colorTarget = colorTarget // 'text' or 'background'

    // Color palette from the 3D boxes - strongest colors against black
    this.colors = [
      // Rainbow spectrum + some bonus modern shimmers
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
      '#ffffff',
      '#FFD9EC',
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
    ]

    this.links = []
    this.linkPositions = []

    this.handleMouseEvent = this.handleMouseEvent.bind(this)
    this.handleScrollEvent = this.handleScrollEvent.bind(this)
    this.cachePositions = this.cachePositions.bind(this)
  }

  refreshLinks() {
    this.links = Array.from(document.querySelectorAll('a'))
    this.cachePositions()
  }

  cachePositions() {
    // Cache link positions to avoid expensive getBoundingClientRect calls on every frame
    this.linkPositions = this.links.map(link => {
      const rect = link.getBoundingClientRect()
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2 + window.pageYOffset
      }
    })
  }

  getColorFromPosition(x, y) {
    // Create a hash from position to pick a color
    const hash = (x + y) % this.colors.length
    return this.colors[hash]
  }

  updateLinkColors(x, y) {
    // In mono mode, pick one random color for all links
    let monoRandomColor
    if (this.mode === 'mono') {
      const colorIndex = Math.floor((x + y) / 100) % this.colors.length
      monoRandomColor = this.colors[colorIndex]
    }

    // Adjust y for scroll offset
    const adjustedY = y + window.pageYOffset

    this.links.forEach((link, index) => {
      const position = this.linkPositions[index]
      if (!position) return

      // Calculate distance from cursor/scroll position to link (using cached positions)
      const distance = Math.sqrt(Math.pow(position.x - x, 2) + Math.pow(position.y - adjustedY, 2))

      // Pick color based on mode
      let color
      if (this.mode === 'mono') {
        // Mono mode: all links get the same random color (based on cursor/scroll position)
        color = monoRandomColor
      } else {
        // Multi mode: each link gets a different color based on position and distance
        const colorIndex = Math.floor((position.x + position.y + distance) / 100) % this.colors.length
        color = this.colors[colorIndex]
      }

      // Set base styles once (check if already set to avoid redundant updates)
      if (!link.dataset.colorizerInit) {
        link.style.transition = 'none'
        link.style.padding = '2px 20px'
        link.style.borderRadius = '20px'
        link.style.willChange = 'color, background-color'
        link.dataset.colorizerInit = 'true'
      }

      if (this.colorTarget === 'text') {
        // Colorize text, keep background black
        link.style.color = color
        link.style.backgroundColor = '#000'
      } else {
        // Colorize background, keep text black
        link.style.backgroundColor = color
        link.style.color = '#000'
      }
    })
  }

  handleMouseMove(event) {
    this.lastMouseX = event.clientX
    this.lastMouseY = event.clientY
    this.updateLinkColors(event.clientX, event.clientY)
  }

  handleScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop
    const scrollProgress = scrollY / (document.body.scrollHeight - window.innerHeight)

    if (this.isMobile) {
      // On mobile, use scroll position for both x and y
      const x = window.innerWidth / 2
      const y = scrollProgress * window.innerHeight
      this.updateLinkColors(x, y)
    } else {
      // On desktop, use last mouse position but update based on scroll
      this.updateLinkColors(this.lastMouseX, this.lastMouseY)
    }
  }

  handleMouseEvent(event) {
    if (this.rafId) return

    this.rafId = requestAnimationFrame(() => {
      this.rafId = null
      this.handleMouseMove(event)
    })
  }

  handleScrollEvent() {
    if (this.rafId) return

    this.rafId = requestAnimationFrame(() => {
      this.rafId = null
      this.handleScroll()
    })
  }

  start() {
    this.refreshLinks()

    // Only listen to scroll (both desktop and mobile)
    window.addEventListener('scroll', this.handleScrollEvent, { passive: true })

    // Recache positions on resize
    window.addEventListener('resize', this.cachePositions, { passive: true })

    // Initial color on load
    this.handleScroll()
  }

  stop() {
    window.removeEventListener('scroll', this.handleScrollEvent)
    window.removeEventListener('resize', this.cachePositions)

    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }
}
