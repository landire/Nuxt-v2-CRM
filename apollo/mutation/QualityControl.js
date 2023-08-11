import gql from 'graphql-tag'

export const QualityControlCreate = gql`
  mutation QualityControl_Create($param: JSON) {
    QualityControl_Create(param: $param)
  }
`

export const QualityControlEdit = gql`
  mutation QualityControl_Edit($idList: [String]!, $param: JSON) {
    QualityControl_Edit(idList: $idList, param: $param)
  }
`
