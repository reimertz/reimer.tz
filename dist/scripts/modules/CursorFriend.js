//Creator Pierre Reimertz MIT ETC ETC
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
export default class CursorFriend {

  constructor({selector = 'data-cursor-friend', spanSelector = 'span'}) {
    this.selector = selector
    this.spanSelector = spanSelector

    this._elements = [].slice.call(document.querySelectorAll(`${ this.selector }`))

    this.onEnter = this.onEnter.bind(this)
    this.onMove = this.onMove.bind(this)
    this.onLeave = this.onLeave.bind(this)
  }

  start() {
    if(isMobile) return
    this._elements.map(element => {
      element.addEventListener('mouseenter', this.onEnter)
      element.addEventListener('mouseleave', this.onLeave)
    })
  }

  onEnter(event) {
    document.body.setAttribute('data-project-is-hovered', 'true');
    //event.currentTarget.addEventListener('mousemove', this.onMove)
  }

  onMove(event) {
    let span = event.currentTarget.querySelector(this.spanSelector)

    let x = event.screenX
    let y = event.screenY

    span.style.top = (y/10 - 50) + 'px'
    span.style.left = (x/10 - 50) + 'px'
  }

  onLeave(event) {
    document.body.setAttribute('data-project-is-hovered', 'false');
    //event.currentTarget.removeEventListener('mousemove', this.onMove)
  }

  stop() {
    this._elements.map(element => {
      element.removeEventListener('mouseenter', this.onEnter)
      element.removeEventListener('mouseleave', this.onLeave)
    })
  }

  pause() {
    this.stop()
  }
}