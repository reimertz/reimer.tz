/**
 * RZ-Music-Player Component
 * Global audio/video player that reads tracks from child elements
 *
 * Usage:
 *   <rz-music-player>
 *     <rz-track name="Song 1" audio-src="/song1.mp3"></rz-track>
 *     <rz-track name="Song 2" video-src="/video.mp4" aspect-ratio="9/16"></rz-track>
 *   </rz-music-player>
 */

class RZMusicPlayer extends HTMLElement {
  constructor() {
    super()
    this.currentTrack = 0
    this.isPlaying = false
    this.audioElement = null
    this.videoElement = null
    this.tracks = []
  }

  connectedCallback() {
    console.log('[rz-music-player] Initializing...')

    // Read tracks from children
    this.tracks = Array.from(this.querySelectorAll('rz-track')).map((track) => ({
      name: track.getAttribute('name') || 'Untitled',
      audioSrc: track.getAttribute('audio-src'),
      videoSrc: track.getAttribute('video-src'),
      aspectRatio: track.getAttribute('aspect-ratio')
    }))

    console.log('[rz-music-player] Found', this.tracks.length, 'tracks')

    this.setupElements()
    this.loadTrack(0)

    // Expose methods globally for track links to use
    window._musicPlayer = this
  }

  setupElements() {
    // Create audio element
    this.audioElement = document.createElement('audio')
    this.audioElement.loop = true
    document.body.appendChild(this.audioElement)

    // Create video element
    this.videoElement = document.createElement('video')
    this.videoElement.loop = true
    this.videoElement.playsinline = true
    this.videoElement.setAttribute('playsinline', '')
    this.videoElement.setAttribute('webkit-playsinline', '')
    this.videoElement.muted = false
    this.videoElement.className = 'music-player-video'
    document.body.appendChild(this.videoElement)
  }

  loadTrack(index) {
    const track = this.tracks[index]
    if (!track) return

    if (track.audioSrc) {
      this.audioElement.src = track.audioSrc
    }

    if (track.videoSrc) {
      this.videoElement.src = track.videoSrc
      this.videoElement.style.aspectRatio = track.aspectRatio || ''
    }
  }

  play() {
    this.isPlaying = true
    document.body.setAttribute('data-music-playing', 'true')

    const track = this.tracks[this.currentTrack]

    if (track.audioSrc) {
      this.audioElement.play().catch((err) => console.warn('Audio playback failed:', err))
    }

    if (track.videoSrc) {
      this.videoElement.style.opacity = '0.3'
      this.videoElement.play().catch((err) => console.warn('Video playback failed:', err))
    } else {
      this.videoElement.pause()
      this.videoElement.style.opacity = '0'
    }
  }

  pause() {
    this.isPlaying = false
    document.body.setAttribute('data-music-playing', 'false')
    this.audioElement.pause()
    this.videoElement.pause()
    this.videoElement.style.opacity = '0'
  }

  toggle() {
    this.isPlaying ? this.pause() : this.play()
  }

  next() {
    this.pause()
    this.currentTrack = (this.currentTrack + 1) % this.tracks.length
    this.loadTrack(this.currentTrack)
    this.play()
  }

  previous() {
    this.pause()
    this.currentTrack = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length
    this.loadTrack(this.currentTrack)
    this.play()
  }

  disconnectedCallback() {
    if (this.audioElement) this.audioElement.remove()
    if (this.videoElement) this.videoElement.remove()
    delete window._musicPlayer
  }
}

// RZ-Track (child element - just a data holder)
class RZTrack extends HTMLElement {
  connectedCallback() {
    this.style.display = 'none' // Hide track elements
  }
}

customElements.define('rz-music-player', RZMusicPlayer)
customElements.define('rz-track', RZTrack)
