/**
 * RZ-Video-Embed Component
 * Automatically handles inline video toggles (YouTube embeds)
 * Finds all .video-link elements and wires up toggle behavior
 *
 * Usage:
 *   <rz-video-embed>
 *     <!-- Your content with video-link elements -->
 *   </rz-video-embed>
 */

class RZVideoEmbed extends HTMLElement {
  connectedCallback() {
    console.log('[rz-video-embed] Initializing video toggles...')

    const videoLinks = this.querySelectorAll('.video-link')

    videoLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        const videoIndex = link.getAttribute('data-video-index')
        if (!videoIndex) return

        const toggle = link.querySelector('.video-toggle')
        if (!toggle) return

        const videoContainer = this.querySelector(
          `.inline-video[data-video-index="${videoIndex}"]`
        )
        if (!videoContainer) return

        // Toggle video
        if (videoContainer.style.display === 'none' || !videoContainer.style.display) {
          // Close other videos first
          this.querySelectorAll('.inline-video').forEach((v) => {
            if (v !== videoContainer) {
              v.style.display = 'none'
              const oldIframe = v.querySelector('iframe')
              if (oldIframe) {
                const oldSrc = oldIframe.src
                oldIframe.src = ''
                oldIframe.src = oldSrc.replace('?autoplay=1', '?autoplay=0')
              }
            }
          })
          this.querySelectorAll('.video-toggle').forEach((t) => {
            if (t !== toggle) t.textContent = '▶'
          })

          // Open this video
          videoContainer.style.display = 'block'
          toggle.textContent = '×'
          const iframe = videoContainer.querySelector('iframe')
          if (iframe) {
            const originalSrc = iframe.getAttribute('src')
            if (originalSrc) {
              iframe.src = originalSrc.replace('?autoplay=0', '?autoplay=1')
            }
          }
          videoContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          })
        } else {
          // Close this video and stop playback
          const iframe = videoContainer.querySelector('iframe')
          if (iframe) {
            iframe.src = ''
          }
          videoContainer.style.display = 'none'
          toggle.textContent = '▶'
        }
      })
    })

    console.log('[rz-video-embed] Wired up', videoLinks.length, 'video toggles')
  }
}

customElements.define('rz-video-embed', RZVideoEmbed)
