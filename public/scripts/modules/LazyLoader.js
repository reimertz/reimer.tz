//Creator Pierre Reimertz MIT ETC ETC

export default class LazyLoader {

  constructor({
    attribute = 'data-lazy',
    offset = (document.body.getBoundingClientRect().height/2),
    lines = 3,
    throttle = 350,
    autoStart = true,
    checkOnStart = true,
    fakeSlowness = false,
    placeholderImages = [
    /* wide   */  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAvYAAAQAAQMAAACwNI9dAAAAA1BMVEUb/5DUIh99AAAAdUlEQVR42u3BAQ0AAADCoPdP7ewBFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN4APAAGN6DpwAAAAAElFTkSuQmCC',
    /* tall   */  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWAQMAAAAGz+OhAAAAA1BMVEUb/5DUIh99AAAAGklEQVR4Ae3BAQEAAAQDMP1TiwHfVgAAwHoNC7gAASist30AAAAASUVORK5CYII=',
    /* square */  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWAQMAAABelSeRAAAAA1BMVEUb/5DUIh99AAAAHElEQVR4Xu3AAQkAAADCMPunNsdhWwoAAAAAABwW2gABlO2L2AAAAABJRU5ErkJggg=='
  ]})
  {
    this.attribute = attribute
    this.autoStart = autoStart
    this.checkOnStart = checkOnStart
    this.offset = offset
    this.lines = lines
    this.throttle = throttle
    this.fakeSlowness = fakeSlowness
    this.placeholderImages = placeholderImages

    this._elements          = [].slice.call(document.querySelectorAll(`[${ this.attribute }]`))
    this._queue             = []
    this._listener          = false
    this._throttler         = false

    this.onLoad = this.onLoad.bind(this)

    if (this.autoStart) {
      this.start()
    }
  }

  start() {
    if (!!this._listener) return
    if (this.checkOnStart) this.check()

    this._elements.map(element => {
      if (!element.src || element.src === '') {
        element.src = this.placeholderImages[Math.floor(Math.random()*(this.placeholderImages.length-1) + 0.5)]
      }
    })

    this._listener = event => {this.check()}

    document.addEventListener('scroll', this._listener, false)
  }

  stop() {
    document.removeEventListener('scroll', this._listener)
    this._listener = false
    this._throttler = false
  }

  check() {
    if (this._throttler) return
    if (this._elements.length === 0) return this.stop()

    this._throttler = setTimeout(() => {
      this._throttler = false

      this._elements = this._elements.map(element => {
        if (element === false) return false
        if (element.nodeName !== "IMG") return false

        if ((element.getBoundingClientRect().top - this.offset)  < document.body.scrollTop) {
          this.queue(element)
          return false
        }

        else {
          return element
        }
      })

      this._elements = this._elements.filter(element => {
        if (element) return element
      })

    }, this.throttle)
  }

  queue(element) {
    this._queue.push(element)

    if (this._queue.length <= this.lines) {
      this.load(element)
    }
  }

  load(element) {
    this.setStatus(element, 'loading')

    element.addEventListener('load', this.onLoad, false)

    if (!!this.fakeSlowness && (Math.random() <= (this.fakeSlowness.percentageOfImages))) {
      setTimeout(() => {
        element.src = element.getAttribute(this.attribute)
      }, this.fakeSlowness.delayBeforeFetch())
    }
    else {
      element.src = element.getAttribute(this.attribute)
    }
  }

  onLoad(event) {
    let nextElement
    let loadedElement = event.target

    loadedElement.removeEventListener('load', this.onLoad, false)
    this.setStatus(loadedElement, 'loaded')

    this._queue = this._queue.filter(queuedElement => {
      if (queuedElement !== loadedElement) return queuedElement
    })

    nextElement = this._queue.shift()

    if (!!nextElement) this.load(nextElement)
  }

  setStatus(element, status) {
    element.setAttribute(this.attribute + '-status', status)
  }
}