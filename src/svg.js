const formatSvg = function (text) {
  const svg = text.replace(/stroke="[^"]+"/g, 'stroke="#000"')
    .replace(/width="[^"]+" /g, '')
    .replace(/height="[^"]+" /g, '')
  const tags = svg.match(/<[^<>]+>/g)
  return tags.map((tag, i) => i > 0 && i < tags.length - 1 ? `  ${tag}` : tag).join('\n')
}

export const getSvg = async function (filename) {
  const res = await fetch(`img/svg/${filename}.svg`)
  const text = await res.text()
  return formatSvg(text)
}
