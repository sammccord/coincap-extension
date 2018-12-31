import { browser, Runtime } from "webextension-polyfill-ts"
import uniq from 'lodash.uniq'
import { html, render } from 'htm/preact/standalone'
import { CC_ATTRIBUTE } from './config'
import { Action, Asset } from './types'
import { CoinCapAsset } from './CoinCapAsset'

function main() {
  var port = browser.runtime.connect()
  port.onMessage.addListener(onMessage)
  // Fetch initial assets from coincap
  port.postMessage({ type: 'ASSETS' })
}

function onMessage(message: Action, port: Runtime.Port) {
  switch(message.type) {
    case 'ASSETS':
      renderCoinCapAssets(port, message.payload)
      return
    default:
      console.log('No valid type found for message')
  }
}

function renderCoinCapAssets(port, assetsMap: {[symbol: string]: Asset} = {}) {
  const pTags = document.querySelectorAll('p')
  const symbols = Object.keys(assetsMap)
  const symbolRegexes = symbols.reduce((final, curr) => {
    final[curr] = new RegExp(curr, "gm")
    return final
  }, {})
  pTags.forEach(p => {
    const text = p.innerText
    let innerSymbols = uniq(text
      .split(' ')
      .filter(str => (
        str.length > 2 && str.length < 5 && symbols.indexOf(str) > -1
      )))
    if(!innerSymbols.length) return
    innerSymbols.forEach(symbol => {
      p.innerHTML = p.innerHTML.replace(
        symbolRegexes[symbol],
        `<span ${CC_ATTRIBUTE}="${symbol}"></span>`
      )
    })
    p.querySelectorAll(`[${CC_ATTRIBUTE}]`).forEach(span => {
      const symbol = span.getAttribute(CC_ATTRIBUTE)
      render(html`<${CoinCapAsset} symbol="${symbol}" port={${port}} asset={${assetsMap[symbol]}} />`, span)
    })
  })
}

window.onload = main