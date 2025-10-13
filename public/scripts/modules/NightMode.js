//Creator Pierre Reimertz MIT ETC ETC

export default class NightMode {
  constructor() {
    this.isNightMode = false
    this.toggle = document.querySelector('[data-night-mode-toggle]')
    this.htmlElement = document.documentElement

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(event) {
    event.preventDefault()
    this.isNightMode = !this.isNightMode

    if (this.isNightMode) {
      this.htmlElement.classList.remove('night-mode-off')
      this.htmlElement.classList.add('night-mode-on')
      this.toggle.innerHTML = 'night-mode [✓]'
      this.toggle.setAttribute('three-d-text', 'night-mode [✓]')
    } else {
      this.htmlElement.classList.remove('night-mode-on')
      this.htmlElement.classList.add('night-mode-off')
      this.toggle.innerHTML = 'night-mode [x]'
      this.toggle.setAttribute('three-d-text', 'night-mode [x]')
    }

    console.log('Night mode:', this.isNightMode ? 'ON' : 'OFF')
  }

  start() {
    if (this.toggle) {
      this.toggle.addEventListener('click', this.handleClick)
      console.log('Night mode toggle initialized')
    } else {
      console.warn('Night mode toggle element not found')
    }
  }

  stop() {
    if (this.toggle) {
      this.toggle.removeEventListener('click', this.handleClick)
    }
  }
}
