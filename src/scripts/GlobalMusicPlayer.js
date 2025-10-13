//Creator Pierre Reimertz MIT ETC ETC

export default class GlobalMusicPlayer {
  constructor(tracks) {
    this.tracks = tracks
    this.currentTrack = 0
    this.isPlaying = false
    this.audioElement = null
    this.videoElement = null

    this.setupElements()
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
    this.videoElement.muted = false
    this.videoElement.style.position = 'fixed'
    this.videoElement.style.top = '50%'
    this.videoElement.style.left = '50%'
    this.videoElement.style.minWidth = '100vw'
    this.videoElement.style.minHeight = '100vh'
    this.videoElement.style.width = 'auto'
    this.videoElement.style.height = 'auto'
    this.videoElement.style.transform = 'translate(-50%, -50%)'
    this.videoElement.style.objectFit = 'contain'
    this.videoElement.style.opacity = '0'
    this.videoElement.style.transition = 'opacity 2s'
    this.videoElement.style.zIndex = '-1'
    this.videoElement.style.pointerEvents = 'none'
    document.body.appendChild(this.videoElement)
  }

  loadTrack(index) {
    const track = this.tracks[index]
    if (!track) return

    // Load audio if available
    if (track.audioSrc) {
      this.audioElement.src = track.audioSrc
    }

    // Load video if available
    if (track.videoSrc) {
      this.videoElement.src = track.videoSrc

      // Set aspect ratio if specified
      if (track.aspectRatio) {
        this.videoElement.style.aspectRatio = track.aspectRatio
        this.videoElement.style.width = 'auto'
        this.videoElement.style.height = '100vh'
        this.videoElement.style.maxWidth = '100vw'
      } else {
        // Default to cover for landscape videos
        this.videoElement.style.aspectRatio = ''
        this.videoElement.style.width = 'auto'
        this.videoElement.style.height = 'auto'
      }
    }
  }

  play() {
    this.isPlaying = true
    document.body.setAttribute('data-music-playing', 'true')

    const track = this.tracks[this.currentTrack]

    if (track.audioSrc) {
      this.audioElement.play()
    }

    if (track.videoSrc) {
      this.videoElement.style.opacity = '0.3'
      this.videoElement.play()
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
    if (this.isPlaying) {
      this.pause()
    } else {
      this.play()
    }
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

  start() {
    // Load first track
    this.loadTrack(0)
  }
}
