//Creator Pierre Reimertz MIT ETC ETC
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export default class ProjectListener {

  constructor({selector = 'data-cursor-friend'}) {
    this.selector = selector
    this.element = document.querySelector(selector)

    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)
  }

  start() {
    if (isMobile) return
    this.element.addEventListener('mouseover', this.onEnter, false)
    this.element.addEventListener('mouseout', this.onLeave)
  }

  onEnter(event) {
    if (event.target.nodeName !== 'IMG') return

    document.body.setAttribute('data-project-is-hovered', 'true');
  }


  onLeave(event) {
    document.body.setAttribute('data-project-is-hovered', 'false');
  }

  stop() {
    this.element.removeEventListener('mouseenter', this.onEnter)
    this.element.removeEventListener('mouseleave', this.onLeave)
  }

  pause() {
    this.stop()
  }
}