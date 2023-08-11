import gql from 'graphql-tag'

export const TarifLoadFromBilling = gql`
  mutation Tarif_LoadTarifsFromBilling {
    Tarif_LoadTarifsFromBilling
  }
`

export const TarifEdit = gql`
  mutation Tarif_Edit($idList: [String]!, $param: JSON) {
    Tarif_Edit(idList: $idList, param: $param)
  }
`
