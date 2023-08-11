import gql from 'graphql-tag'

export const RoleSelectId = gql`
  query Role_SelectFromId($param: JSON, $roleIdList: [String]!) {
    Role_SelectFromId(param: $param, roleIdList: $roleIdList)
  }
`

export const RoleSelectName = gql`
  query Role_SelectFromName($param: JSON, $nameList: String!) {
    Role_SelectFromName(param: $param, nameList: $nameList)
  }
`

export const RoleSelectAdmin = gql`
  query Role_SelectFromAdmin($param: JSON) {
    Role_SelectFromAdmin(param: $param)
  }
`