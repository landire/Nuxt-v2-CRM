import gql from 'graphql-tag'

export const DistrictsSelectAll = gql`
  query Districts_SelectAll($param: JSON) {
    Districts_SelectAll(param: $param)
  }
` 

export const DistrictsSelectFromId = gql`
  query Districts_SelectFromId($param: JSON, $idList: [String]!) {
    Districts_SelectFromId(param: $param, idList: $idList)
  }
`

export const DistrictsLoadHousesFromBilling = gql`
  query Districts_LoadHousesFromBilling {
    Districts_LoadHousesFromBilling
  }
`
