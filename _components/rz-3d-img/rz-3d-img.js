/**
 * RZ-3D-IMG Component
 * Simple image wrapper - shadow is handled by parent <rz-3d>
 *
 * Usage:
 *   <rz-3d-img src="/image.jpg" alt="Description"></rz-3d-img>
 */

class RZ3DImg extends HTMLElement {
  static get observedAttributes() {
    return ['src', 'alt']
  }

  connectedCallback() {
    this.render()
  }

  attributeChangedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = ''

    const src = this.getAttribute('src')
    const alt = this.getAttribute('alt') || ''

    if (!src) return

    // Just create a simple img element
    const img = document.createElement('img')
    img.src = src
    img.alt = alt

    this.appendChild(img)
  }
}

customElements.define('rz-3d-img', RZ3DImg)
