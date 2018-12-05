import { highlightCode } from './hljs'
import { getSvg } from './svg'

const onModalClose = function (modal) {
  return function () {
    document.body.removeChild(modal)
    document.body.removeAttribute('data-modal')
  }
}

const addModalCloseEvent = function (selector) {
  const elem = document.querySelector(selector)
  elem.addEventListener('click', onModalClose(elem.parentNode))
}

const toggleCopyMessage = function (elem) {
  elem.setAttribute('data-copied', '')
  return setTimeout(() => elem.removeAttribute('data-copied'), 1600)
}

const onCopy = function (code, clipboard) {
  let timeout
  return function () {
    clipboard.textContent = code.textContent.trim()
    clipboard.select()
    document.execCommand('copy')
    clearTimeout(timeout)
    timeout = toggleCopyMessage(code)
  }
}

const addModalCopyEvent = function (codeSelector, copySelector) {
  const code = document.querySelector(codeSelector)
  const clipboard = document.querySelector(copySelector)
  code.addEventListener('click', onCopy(code, clipboard))
}

export const createModal = async function (details) {
  const template = document.querySelector('#view-template')
  const elem = template.content.cloneNode(true)
  
  const title = details.alt ? `${details.name} (${details.alt})` : details.name
  elem.querySelector('header h1').textContent = title

  elem.querySelector('header #preview').appendChild(details.svg)

  elem.querySelector('#download-png').setAttribute('href', `img/png/${details.filename}.png`)
  elem.querySelector('#download-svg').setAttribute('href', `img/svg/${details.filename}.svg`)

  const code = await getSvg(details.filename)
  elem.querySelector('#code pre code').textContent = code

  document.body.dataset.modal = true
  document.body.appendChild(elem)

  addModalCloseEvent('#modal #modal-close')
  addModalCopyEvent('#modal #code pre code', '#modal #clipboard')
  highlightCode('#modal #code pre code')
}
