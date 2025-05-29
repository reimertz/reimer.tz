//Creator Pierre Reimertz MIT ETC ETC

export default class LazyLoader {
  constructor({lines, throttle, checkOnStart, fakeSlowness}) {
    this.lines = lines
    this.throttle = throttle
    this.checkOnStart = checkOnStart
    this.fakeSlowness = fakeSlowness
    this.pageOffsetTop = 0
    this.windowHeight = 0
    this.images = document.querySelectorAll('[data-lazy]')
    this.isRunning = false
    this.update()
  }

  isInViewPort (element) {
    if (element.offsetTop < (this.pageOffsetTop + this.windowHeight + (this.lines * this.fakeSlowness))) {
      return true
    }
    return false
  }

  isElementLoaded (element) {
    return element.getAttribute('src') || element.style.backgroundImage
  }

  loadElement (element) {
    if (this.fakeSlowness) {
      this.fakeLoad(element)
    }
    else {
      this.fastLoad(element)
    }
  }

  fastLoad(element) {
    let lazyImg = element.getAttribute('data-lazy')
    element.setAttribute('src', lazyImg)
    element.removeAttribute('data-lazy')
  }

  shouldBeFakeSlowed(element) {
    return Math.random() <= (this.fakeSlowness.percentageOfImages || 0)
  }

  fakeLoad(element) {
    if (!this.shouldBeFakeSlowed(element)) return this.fastLoad(element)

    setTimeout(() => this.fastLoad(element), this.fakeSlowness.delayBeforeFetch())
  }

  update() {
    this.windowHeight = window.innerHeight
    this.pageOffsetTop = window.pageYOffset || document.documentElement.scrollTop
  }

  check() {
    this.update()

    this.images.forEach((image, index) => {
      if (!this.isElementLoaded(image) && this.isInViewPort(image)) {
        this.loadElement(image)
      }
    })
  }

  listen() {
    this._listener = event => {this.check()}
    window.addEventListener('scroll', this._listener)
  }

  unlisten() {
    window.removeEventListener('scroll', this._listener)
  }

  start() {
    this.isRunning = true
    this.listen()

    if (this.checkOnStart) {
      this.check()
    }
  }

  stop() {
    this.isRunning = false
    this.unlisten()
  }
}