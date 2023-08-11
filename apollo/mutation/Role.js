import gql from 'graphql-tag'

export const RoleEdit = gql`
  mutation Role_Edit($idList: [String]!, $param: JSON) {
    Role_Edit(idList: $idList, param: $param)
  }
`

export const RoleRegistration = gql`
  mutation Role_Registration($param: JSON) {
    Role_Registration(param: $param)
  }
`

export const RoleDelete = gql`
  mutation Role_Delete($idList: [String]!) {
    Role_Delete(idList: $idList)
  }
`
