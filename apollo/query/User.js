import gql from 'graphql-tag'

export const UserLogin = gql`
  query User_LoginEmail($param: JSON, $email: String!, $password: String!) {
    User_LoginEmail(param: $param, email: $email, password: $password)
  }
`

export const UserSelectId = gql`
  query User_SelectFromUserId($param: JSON, $userIdList: [String]!) {
    User_SelectFromUserId(param: $param, userIdList: $userIdList)
  }
`

export const UserSelectFromAdmin = gql`
  query User_SelectFromAdmin($param: JSON) {
    User_SelectFromAdmin(param: $param)
  }
`