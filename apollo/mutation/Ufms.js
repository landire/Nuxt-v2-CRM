import gql from 'graphql-tag'

export const UfmsCreate = gql`
  mutation Ufms_Create($param: JSON) {
    Ufms_Create(param: $param)
  }
`

export const UfmsEdit = gql`
  mutation Ufms_Edit($idList: [String]!, $param: JSON) {
    Ufms_Edit(idList: $idList, param: $param)
  }
`

export const UfmsDelete = gql`
  mutation Ufms_Delete($idList: [String]!) {
    Ufms_Delete(idList: $idList)
  }
`

export const UfmsCheckUFMSError = gql`
  mutation Ufms_CheckUFMSError {
    Ufms_CheckUFMSError
  }
`
