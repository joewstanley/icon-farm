import '../scss/index.scss';

import { createModal } from './modal'
import { filterList } from './search'

const onIconClick = function (event) {
  const item = event.target.closest('li')
  if (!item) {
    return
  } else {
    const svg = item.querySelector('svg').cloneNode(true)
    createModal({
      name: item.dataset.name,
      alt: item.dataset.alt,
      filename: item.dataset.filename,
      svg
    })
  }
}

const onSearch = function () {
  let timeout
  return function (event) {
    const text = event.target.value
    clearTimeout(timeout)
    timeout = setTimeout(() => filterList(text), 500)
  }
}

document.querySelector('#icons ul').addEventListener('click', onIconClick)
document.querySelector('#search').addEventListener('input', onSearch())
