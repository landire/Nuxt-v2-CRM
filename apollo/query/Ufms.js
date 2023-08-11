import gql from 'graphql-tag'

export const UfmsSelectAll = gql`
  query Ufms_SelectAll($param: JSON) {
    Ufms_SelectAll(param: $param)
  }
`

export const UfmsSelectFromCode = gql`
  query Ufms_SelectFromCode($param: JSON, $structureCodList: [String]!) {
    Ufms_SelectFromCode(param: $param, structureCodList: $structureCodList)
  }
`
