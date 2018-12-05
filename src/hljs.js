import hljs from 'highlight.js/lib/highlight'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'

hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)

export const highlightCode = function (selector) {
  hljs.highlightBlock(document.querySelector(selector))
}
