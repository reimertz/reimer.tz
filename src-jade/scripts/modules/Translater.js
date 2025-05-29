//Creator Pierre Reimertz MIT ETC ETC

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)


export default class Translater {

  constructor(element, xRotation, yRotation) {
    this.xRotation = xRotation
    this.yRotation = yRotation
    this.el = element
    this.throttler = false
    this.moveEvent = isMobile ? 'touchmove' : 'mousemove'

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
    if(this.throttler) return

    this.throttler = setTimeout(() => {

      this.throttler = false
      requestAnimationFrame(() => {
        if(isMobile) this.handleScroll(window.scrollY)
        else         this.handleMove(event.clientX, event.clientY)
      })
    }, 50)

  }

  start() {
    document.body.addEventListener(this.moveEvent, this.handleEvent)
  }

  stop() {
    document.body.removeEventListener(this.moveEvent, this.handleEvent)
  }

  pause() {
    this.stop()
  }
}