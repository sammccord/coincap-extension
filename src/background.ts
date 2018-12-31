import { GraphQLClient } from 'graphql-request'
import { browser, Runtime, Events } from "webextension-polyfill-ts"; 
import { COINCAP_ENDPOINT } from './config'
import { ASSETS } from './queries'
import { Asset, Action } from './types'

const client = new GraphQLClient(COINCAP_ENDPOINT)

const assetsMap: {[symbol: string]: Asset} = {}
const ports: {[tabID: number]: Runtime.Port} = {}

async function main() {
  const { assets: { edges } } = await client.request(ASSETS, { first: 500 }) as any
  edges.forEach(({ node }) => {
    assetsMap[node.symbol] = node as Asset
  })
  
  browser.runtime.onConnect.addListener(onConnect)
}

function onConnect(port: Runtime.Port) {
  ports[port.sender.tab.id] = port
  port.onMessage.addListener(onMessage)
  port.onDisconnect.addListener(onDisconnect)
}

function onDisconnect(port: Runtime.Port) {
  delete ports[port.sender.tab.id]
}

function onMessage(message: Action, port: Runtime.Port) {
  switch(message.type) {
    case 'ASSET':
      const { symbol } = message.payload
      const asset = assetsMap[symbol.toUpperCase()]
      return port.postMessage({
        type: 'ASSET',
        payload: asset
      })
    case 'ASSETS':
      return port.postMessage({
        type: 'ASSETS',
        payload: assetsMap
      })
    default:
      console.log('No valid type found for message')
  }
}

main().catch(console.error)