import gql from 'graphql-tag'

export const AbonErrorEdit = gql`
  mutation AbonError_Edit($idList: [String]!, $param: JSON) {
    AbonError_Edit(idList: $idList, param: $param)
  }
`
