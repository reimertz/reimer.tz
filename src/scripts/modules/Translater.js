//Creator Pierre Reimertz MIT ETC ETC

export default class Translater {

  constructor(element, x = 10, y = 10) {
    this.element = element
    this.x = x
    this.y = y
    this.rotateX = 0
    this.rotateY = 0
    this._listener = false

    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
  }

  onMouseEnter() {
    this.element.classList.add('isTranslataring')
  }

  onMouseMove(event) {
    let rect = this.element.getBoundingClientRect()
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top

    this.rotateY = (-1/5) * x + 20
    this.rotateX = (4/30) * y - 20

    this.element.style.WebkitTransform = `perspective(300px) rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)`
    this.element.style.transform = `perspective(300px) rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)`
  }

  onMouseLeave() {
    this.element.classList.remove('isTranslataring')
    this.element.style.WebkitTransform = 'perspective(300px) rotateX(0deg) rotateY(0deg)'
    this.element.style.transform = 'perspective(300px) rotateX(0deg) rotateY(0deg)'
  }

  start() {
    if (!!this._listener) return

    this.element.addEventListener('mouseenter', this.onMouseEnter, false)
    this.element.addEventListener('mousemove', this.onMouseMove, false)
    this.element.addEventListener('mouseleave', this.onMouseLeave, false)

    this._listener = true
  }

  stop() {
    this.element.removeEventListener('mouseenter', this.onMouseEnter, false)
    this.element.removeEventListener('mousemove', this.onMouseMove, false)
    this.element.removeEventListener('mouseleave', this.onMouseLeave, false)

    this._listener = false
  }
}