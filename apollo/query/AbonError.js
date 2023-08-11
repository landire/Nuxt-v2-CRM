import gql from 'graphql-tag'

export const AbonErrorSelectAll = gql`
  query AbonError_SelectAll($param: JSON) {
    AbonError_SelectAll(param: $param)
  }
`
