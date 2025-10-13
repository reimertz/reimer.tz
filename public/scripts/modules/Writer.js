//Creator Pierre Reimertz MIT ETC ETC

const timeoutMap = new Map()
      timeoutMap.set('#', 50/2) //delete
      timeoutMap.set('@', 250/2) //pause
      timeoutMap.set(',', 350/2)
      timeoutMap.set('-', 350/2)
      timeoutMap.set('.', 500/2)
      timeoutMap.set('?', 750/2)

export default class Writer {
  constructor(elements, string) {
    this.el = elements
    this.s = string
    this.isWritingLink = false
    this.isWritingMarquee = false
    this.isWritingImage = false
    this.marqueeWords = []
  }

  updateWriters(character) {

   [].forEach.call(this.el, (element) => {
      let oldElement = element
      element = (this.isWritingLink) ? element.querySelector('a:last-child') : element

      if (character === '@') return

      else if (character === '#') {
        element.innerHTML = element.innerHTML.slice(0, -1)
        if(oldElement.getAttribute('three-d-text').length > 0){
          oldElement.setAttribute('three-d-text', oldElement.getAttribute('three-d-text').slice(0,-1))
        }
      }

      else if (character === '*') {
        element.innerHTML += '<br>'
        oldElement.setAttribute('three-d-text', oldElement.getAttribute('three-d-text') + '\a')
      }

      else if (character === '$') {
        if (!this.isWritingLink) {
          let link = document.createElement("a")

          link.href = this.s.split('$')[0]
          link.target = '_blank'


          element.appendChild(link)

          this.isWritingLink = true
          this.s = this.s.substring(this.s.split('$')[0].length+1, this.s.length)
        }
        else {
          this.isWritingLink = false
        }
      }

      else if (character === '%') {
        if (!this.isWritingMarquee) {
          // Extract marquee content
          const marqueeContent = this.s.split('%')[0]

          let marquee = document.createElement("marquee")
          marquee.direction = 'up'
          marquee.scrollamount = '2'
          marquee.scrolldelay = '100'
          marquee.textContent = marqueeContent

          element.appendChild(marquee)

          this.isWritingMarquee = true
          this.s = this.s.substring(marqueeContent.length + 1, this.s.length)
        }
        else {
          this.isWritingMarquee = false
        }
      }

      else if (character === '^') {
        if (!this.isWritingImage) {
          // Extract image data: ^src^alt^
          const imageData = this.s.split('^')[0]
          const parts = imageData.split('|')
          const src = parts[0]
          const alt = parts[1] || ''

          let img = document.createElement("img")
          img.src = src
          img.alt = alt
          img.style.display = 'inline-block'
          img.style.maxHeight = '1.2em'
          img.style.verticalAlign = 'middle'
          img.style.margin = '0 4px'

          element.appendChild(img)

          this.isWritingImage = true
          this.s = this.s.substring(imageData.length + 1, this.s.length)
        }
        else {
          this.isWritingImage = false
        }
      }
      else {
        element.innerHTML += character
        oldElement.setAttribute('three-d-text', oldElement.getAttribute('three-d-text') + character)
      }
    })
  }

  writer(beQuick) {
    let text, msDelay

    if (this.s.length === 0) return this.isDone()

    text = this.s.substring(0,1)
    this.s =  this.s.substring(1,this.s.length)
    this.updateWriters(text)

    if (beQuick)          return this.writer(true)

    msDelay = timeoutMap.get(text) || Math.random() * 150

    return requestAnimationFrame(() => {
      setTimeout(() => {this.writer()}, msDelay)
    })

  }

  updateLastRead() {
    localStorage.setItem('read-everything-at', Date.now())
  }

  get getLastRead() {
    return parseInt(localStorage.getItem('read-everything-at'))
  }

  isDone() {
    document.body.classList.add('intro-is-done')
    this.updateLastRead()
  }

  start() {
    if (true || (this.getLastRead + 5000) < Date.now()) {
      this.updateLastRead()
      this.writer(true)
      this.isDone()
    }
    else {
      this.writer()
    }
  }
}