//Creator Pierre Reimertz MIT ETC ETC

export default class Translater {

  constructor(element, xRotation, yRotation) {
    this.xRotation = xRotation
    this.yRotation = yRotation
    this.el = element
    this.rafId = null
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    this.moveEvent = this.isMobile ? 'touchmove' : 'mousemove'

    this.handleScroll = this.handleScroll.bind(this)
    this.handleMove = this.handleMove.bind(this)
    this.handleEvent = this.handleEvent.bind(this)
  }

  handleScroll(scrollY){
    let scrolledPercentage = (scrollY / document.body.getBoundingClientRect().height) * this.xRotation,
        x = (scrolledPercentage/2) - this.xRotation,
        y = this.yRotation - scrolledPercentage

    this.el.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`
  }

  handleMove(clientX, clientY){
    let x = ((1 - (clientY / window.innerHeight)) * -1) * this.xRotation,
        y = (clientX / window.innerWidth) * this.yRotation

    this.el.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`
  }

  handleEvent(event) {
    if(this.rafId) return

    this.rafId = requestAnimationFrame(() => {
      this.rafId = null
      if(this.isMobile) this.handleScroll(window.scrollY)
      else              this.handleMove(event.clientX, event.clientY)
    })
  }

  start() {
    document.body.addEventListener(this.moveEvent, this.handleEvent, { passive: true })
  }

  stop() {
    document.body.removeEventListener(this.moveEvent, this.handleEvent)

    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  pause() {
    this.stop()
  }
}