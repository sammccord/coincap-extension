export interface Action {
  type: string
  payload: Asset | any
}

export interface Asset {
  id: string
  changePercent24Hr: string
  name: string
  marketCapUsd: string
  priceUsd: string
  rank: number
  symbol: string
  supply: string
  volumeUsd24Hr: string
  vwapUsd24Hr: string
  website: string
}