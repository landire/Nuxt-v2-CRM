import gql from 'graphql-tag'

export const BagReportEdit = gql`
  mutation BagReportEdit($idList: [String]!, $param: JSON) {
    BagReportEdit(idList: $idList, param: $param)
  }
`

export const BagReportCreate = gql`
  mutation BagReportCreate($tema: String, $text: String!, $img: String, $parentBagreportId: String) {
    BagReportCreate(tema: $tema, text: $text, img: $img, parentBagreportId: $parentBagreportId)
  }
`

export const BagReportDelete = gql`
  mutation BagReportDelete($idList: [String]!) {
    BagReportDelete(idList: $idList)
  }
`
