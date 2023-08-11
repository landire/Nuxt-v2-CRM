import gql from 'graphql-tag'

export const UserRoleEdit = gql`
  mutation UserRole_Edit($idList: [String]!, $param: JSON) {
    UserRole_Edit(idList: $idList, param: $param)
  }
`

export const UserRoleRegistration = gql`
  mutation UserRole_Registration($param: JSON) {
    UserRole_Registration(param: $param)
  }
`

export const UserRoleDelete = gql`
  mutation UserRole_Delete($idList: [String]!) {
    UserRole_Delete(idList: $idList)
  }
`
