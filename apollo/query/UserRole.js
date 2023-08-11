import gql from 'graphql-tag'

export const UserRoleSelectUserId = gql`
  query UserRole_SelectFromUserId($param: JSON, $userIdList: [String]!) {
    UserRole_SelectFromUserId(param: $param, userIdList: $userIdList)
  }
`

export const UserRoleSelectId = gql`
  query UserRole_SelectFromId($param: JSON, $idList: [String]!) {
    UserRole_SelectFromId(param: $param, idList: $idList)
  }
`