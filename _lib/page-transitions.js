/**
 * Native View Transitions API
 * Provides smooth page transitions for navigation
 * Progressive enhancement - gracefully degrades if not supported
 */

export function initPageTransitions() {
  // Check if View Transitions API is supported
  if (!document.startViewTransition) {
    console.log('[PageTransitions] View Transitions API not supported')
    return
  }

  console.log('[PageTransitions] Initializing...')

  // Intercept link clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a')

    // Only intercept same-origin navigation links
    if (!link || link.origin !== location.origin || link.target) return

    // Don't intercept if modifier keys are pressed
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

    // Don't intercept hash links
    if (link.href.includes('#')) return

    e.preventDefault()

    console.log('[PageTransitions] Transitioning to:', link.href)

    // Use View Transition API
    document.startViewTransition(async () => {
      try {
        // Fetch the new page
        const response = await fetch(link.href)
        const html = await response.text()

        // Parse the new document
        const parser = new DOMParser()
        const newDoc = parser.parseFromString(html, 'text/html')

        // Update the page
        document.title = newDoc.title
        document.body.innerHTML = newDoc.body.innerHTML

        // Immediately show new content (no fade on transition)
        document.body.classList.add('loaded')

        // Update URL
        window.history.pushState({}, '', link.href)

        // Re-run scripts from the new page
        const scripts = document.querySelectorAll('script[type="module"]')
        scripts.forEach((script) => {
          const newScript = document.createElement('script')
          newScript.type = 'module'
          if (script.src) {
            newScript.src = script.src
          } else {
            newScript.textContent = script.textContent
          }
          script.parentNode.replaceChild(newScript, script)
        })

        console.log('[PageTransitions] Transition complete')
      } catch (err) {
        console.error('[PageTransitions] Transition failed:', err)
        // Fallback to regular navigation
        window.location.href = link.href
      }
    })
  })

  // Handle back/forward buttons
  window.addEventListener('popstate', () => {
    console.log('[PageTransitions] Popstate - reloading page')
    window.location.reload()
  })
}

export default initPageTransitions
