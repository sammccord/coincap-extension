import { html, Component } from 'htm/preact/standalone'
import { Runtime } from "webextension-polyfill-ts"
import { Action } from './types'

export class CoinCapAsset extends Component {
  state = {
    asset: this.props.asset
  }

  componentDidMount() {
    const port = this.props.port as Runtime.Port
    port.onMessage.addListener(this.onMessage)
  }

  onMessage(message: Action, port: Runtime.Port) {
    console.log(message)
  }

  render({ symbol }, { asset }) {
    return html`
      <span className="cc">
        ${symbol} - $${asset.priceUsd}
        <div className="cc-tooltip">
          <div>
            <img src="${'https://static.coincap.io/assets/icons/'+symbol.toLowerCase()+'@2x.png'}"/>
          </div>
          <div>
            <h3>${asset.name}</h3>
          </div>
          <div>
            <h3>${asset.changePercent24Hr}</h3>
          </div>
        </div>
      </span>
    `;
  }
}