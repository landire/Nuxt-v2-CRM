import gql from 'graphql-tag'

export const UserRegistration = gql`
  mutation User_Registration($param: JSON) {
    User_Registration(param: $param)
  }
`

export const UserEdit = gql`
  mutation UserEdit($idList: [String]!, $param: JSON) {
    UserEdit(idList: $idList, param: $param)
  }  
`
