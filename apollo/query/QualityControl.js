import gql from 'graphql-tag'

export const QualityControlSelectAll = gql`
  query QualityControl_SelectAll($param: JSON) {
    QualityControl_SelectAll(param: $param)
  }
`

export const QualityControlSelectFromType = gql`
  query QualityControl_SelectFromType($param: JSON, $typeList: [String!], $statusList: [Boolean]) {
    QualityControl_SelectFromType(param: $param, typeList: $typeList, statusList: $statusList)
  }
`
