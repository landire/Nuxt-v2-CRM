import gql from 'graphql-tag'

export const TarifSelect = gql`
  query Tarif_SelectAll($param: JSON) {
    Tarif_SelectAll(param: $param)
  }
`

export const TarifSelectFromRequest = gql`
  query Tarif_SelectFromRequest($param: JSON) {
    Tarif_SelectFromRequest(param: $param)
  }
`

