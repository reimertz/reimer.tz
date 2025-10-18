/**
 * RZ-Music-Dialog Component
 * Opens a native <dialog> for music playback
 * Works with rz-music-player component
 *
 * Usage:
 *   Add data-track-link attribute to links that should open the dialog
 *   <a href="#" data-track-link data-track-index="0">Play Song</a>
 */

class RZMusicDialog extends HTMLElement {
  connectedCallback() {
    console.log('[rz-music-dialog] Initializing...')

    // Create native dialog
    const dialog = document.createElement('dialog')
    dialog.className = 'music-dialog'

    dialog.innerHTML = `
      <div class="dialog-content">
        <button class="dialog-close" aria-label="Close">×</button>
        <div class="now-playing">
          <h2>Now Playing</h2>
          <p class="track-name">-</p>
        </div>
        <div class="controls">
          <button class="btn-prev">⏮</button>
          <button class="btn-play-pause">▶</button>
          <button class="btn-next">⏭</button>
        </div>
      </div>
    `

    document.body.appendChild(dialog)

    // Get player reference
    const getPlayer = () => window._musicPlayer

    // Wire up dialog controls
    const closeBtn = dialog.querySelector('.dialog-close')
    const playPauseBtn = dialog.querySelector('.btn-play-pause')
    const prevBtn = dialog.querySelector('.btn-prev')
    const nextBtn = dialog.querySelector('.btn-next')
    const trackName = dialog.querySelector('.track-name')

    const updateUI = () => {
      const player = getPlayer()
      if (!player) return

      const track = player.tracks[player.currentTrack]
      trackName.textContent = track?.name || '-'
      playPauseBtn.textContent = player.isPlaying ? '⏸' : '▶'
    }

    closeBtn.addEventListener('click', () => dialog.close())

    playPauseBtn.addEventListener('click', () => {
      const player = getPlayer()
      if (!player) return
      player.toggle()
      updateUI()
    })

    prevBtn.addEventListener('click', () => {
      const player = getPlayer()
      if (!player) return
      player.previous()
      updateUI()
    })

    nextBtn.addEventListener('click', () => {
      const player = getPlayer()
      if (!player) return
      player.next()
      updateUI()
    })

    // Close on Escape key
    dialog.addEventListener('cancel', () => {
      console.log('[rz-music-dialog] Closed via Escape')
    })

    // Wire up track links to open dialog
    document.addEventListener('click', (e) => {
      const trackLink = e.target.closest('[data-track-link]')
      if (!trackLink) return

      e.preventDefault()
      const player = getPlayer()
      if (!player) {
        console.log('[rz-music-dialog] No player found')
        return
      }

      const trackIndex = parseInt(trackLink.getAttribute('data-track-index'))
      console.log('[rz-music-dialog] Opening for track', trackIndex)

      player.currentTrack = trackIndex
      player.loadTrack(trackIndex)
      player.play()

      updateUI()
      dialog.showModal()
    })

    console.log('[rz-music-dialog] Ready')
  }
}

customElements.define('rz-music-dialog', RZMusicDialog)
