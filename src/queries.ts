export const ASSET = /* GraphQL */ `
  query asset($id: ID!) {
    asset(id: $id) {
      id
      name
      changePercent24Hr
      symbol
      priceUsd
    }
  }
`

export const ASSETS = /* GraphQL */ `
  query assets($first: Int) {
    assets(first: $first) {
      edges {
        node {
          id
          name
          changePercent24Hr
          symbol
          priceUsd
        }
      }
    }
  }
`