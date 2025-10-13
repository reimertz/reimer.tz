//Creator Pierre Reimertz MIT ETC ETC

export default class CursorFriend {

  constructor({selector, friend}) {
    this.friend = friend
    this.selector = selector
    this.elements = [].slice.call(document.querySelectorAll(this.selector))
    this.throttler = false
    this._active = false

    this.createFriend()
    this.bindEvents()
  }

  createFriend() {
    if (this.friend) return

    this.friend = document.createElement('aside')
    this.friend.className = 'cursor-friend'
    document.body.appendChild(this.friend)
  }

  onEnter(event) {
    clearTimeout(this.throttler)
    this.friend.style.opacity = 1
  }

  onMove(event) {
    if (this.throttler) return

    this.throttler = setTimeout(() => {
      this.throttler = false

      this.friend.style.left = event.clientX + 'px'
      this.friend.style.top = event.clientY + 'px'
    }, 25)
  }

  onLeave(event) {
    this.throttler = setTimeout(() => {
      this.throttler = false
      this.friend.style.opacity = 0
    }, 100)
  }

  bindEvents() {
    this.elements.map((element, index) => {
      element.addEventListener('mouseenter', this.onEnter.bind(this), false)
      element.addEventListener('mousemove', this.onMove.bind(this), false)
      element.addEventListener('mouseleave', this.onLeave.bind(this), false)
    })
  }

  start() {
    if (this._active) return
    this._active = true
  }

  stop() {
    this._active = false
  }
}