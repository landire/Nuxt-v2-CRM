import gql from 'graphql-tag'

export const DistrictsCreate = gql`
  mutation Districts_Create($param: JSON) {
    Districts_Create(param: $param)
  }
`

export const DistrictsEdit = gql`
  mutation Districts_Edit($idList: [String]!, $param: JSON) {
    Districts_Edit(idList: $idList, param: $param)
  }
`
