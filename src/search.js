const setIconCount = function (count) {
  const header = document.querySelector('#icons header h1')
  header.textContent = header.textContent.replace(/\(\d+\)/g, `(${count})`)
}

export const filterList = function (text) {
  const search = text.trim().toLowerCase()
  const icons = document.querySelectorAll('#icons ul li')

  let count = 0
  for (let icon of icons) {
    let name = icon.dataset.name
    name = name ? name.toLowerCase() : ''
    let alt = icon.dataset.alt
    alt = alt ? alt.toLowerCase() : ''
    if (name.includes(search) || alt.includes(search)) {
      icon.removeAttribute('data-hidden')
      count += 1
    } else {
      icon.setAttribute('data-hidden', '')
    }
  }

  setIconCount(count)
}
