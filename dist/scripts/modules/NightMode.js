import fetch from 'isomorphic-fetch'
import * as SunCalc from 'suncalc'

const html = document.querySelector('html')
const button = document.querySelector('[data-night-mode-toggle]')
let isNightMode = false


function toggleNightMode() {
  const buttonReplaceArgs = isNightMode ?  ['✓', 'x'] : ['x', '✓']
  const list = html.getAttribute('class')
  let newList = isNightMode ? list.replace('night-mode-on', '') : `${list} night-mode-on`

  html.setAttribute('class', newList)

  button.innerHTML = button.innerHTML.replace(buttonReplaceArgs[0], buttonReplaceArgs[1])

  isNightMode = !isNightMode
}

fetch('https://geo-location.code.reimertz.co')
  .then((response) => {
    return response.json()
  })
  .then((json) => {
    const now = +new Date()
    const sunset = +new Date(SunCalc.getTimes(+new Date(), json.lat, json.lon).sunset)

    if (now > sunset) toggleNightMode()
  })


button.addEventListener('click', (e) => {
  toggleNightMode(e.target)
})
