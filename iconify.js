#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const program = require('commander')
const svgo = require('svgo')
const { createCanvas, Image } = require('canvas')

const config = require('./config.json')
const optimizer = new svgo(config.svgo)

program
  .version('0.1.0')
  .option('-n, --name [name]', 'Primary name of icon')
  .option('-a, --alt [alt]', 'Secondary name of icon')
  .option('-p, --path [path]', 'SVG path of icon')
  .parse(process.argv)

if (!program.name || !program.path) {
  console.error('--name and --path arguments are required')
  process.exit(1)
}

optimizeSVG(program.path)
  .then(result => {
    const filename = kebabCase(program.alt ? `${program.name} ${program.alt}` : program.name)
    saveSVG(filename, result.svg)
    savePNG(filename, result.svg)
    updateIcons(program.name, program.alt, program.path, filename)
  })
  .catch(err => {
    console.error(err.message)
    process.exit(1)
  })

function camelToKebab (str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

function kebabCase (str) {
  return str.split(' ').join('-').toLowerCase()
}

function objectToAttributes (obj) {
  const list = []
  for (let key in obj) {
    const name = camelToKebab(key)
    const value = obj[key]
    list.push(`${name}="${value}"`)
  }
  return list.join(' ')
}

function createSVG (path) {
  const { svg, png, attributes } = config
  const lines = []
  lines.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${png.width}" height="${png.height}" viewBox="0 0 ${svg.width} ${svg.height}">`)
  lines.push(`<path d="M0 0h${svg.width}v${svg.height}H0z" fill="none" />`)
  lines.push(`<path d="${path}" ${objectToAttributes(attributes)} />`)
  lines.push('</svg>')
  return lines.join('')
}

function optimizeSVG (data) {
  const svg = createSVG(data)
  return new Promise((resolve, reject) => {
    optimizer.optimize(svg)
      .then(result => {
        const path = result.data.match(/(<path[^<>]+\/>)/g)[1]
        const d = path.match(/(?<=d=")([^"]+)/g)[0]
        resolve({ svg: result.data, path: d })
      })
      .catch(err => reject(err))
  })
}

function svgToDataURI (svg) {
  return `data:image/svg+xml;charset=utf-8,${svg}`
}

function saveSVG (filename, svg) {
  const { svgPath } = config
  const file = path.join(__dirname, svgPath, `${filename}.svg`)
  fs.writeFileSync(file, svg)
  console.log(`SVG file created: ${file}`)
}

function savePNG (filename, svg) {
  const { png, pngPath } = config
  const file = path.join(__dirname, pngPath, `${filename}.png`)
  const out = fs.createWriteStream(file)
  out.on('finish', () => console.log(`PNG file created: ${file}`))

  const canvas = createCanvas(png.width, png.height)
  const ctx = canvas.getContext('2d')
  const img = new Image()
  img.onload = () => {
    ctx.drawImage(img, 0, 0)
    const stream = canvas.createPNGStream()
    stream.pipe(out)
  }
  img.onerror = err => { throw err }
  img.src = svgToDataURI(svg)
}

function updateIcons (name, alt, path, filename) {
  const { icons } = config
  const iconInfo = Object.assign({}, { name, path, filename }, alt ? { alt } : {})
  const updatedIcons = icons.concat(iconInfo)
  const updatedConfig = Object.assign({}, config, { icons: updatedIcons })
  fs.writeFileSync('./config.json', JSON.stringify(updatedConfig, null, 2))
}
