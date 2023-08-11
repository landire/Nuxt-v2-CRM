import gql from 'graphql-tag'

export const TelegramGroopSelectFromAdmin = gql`
  query TelegramGroop_SelectFromAdmin($param: JSON) {
    TelegramGroop_SelectFromAdmin(param: $param)
  }
`

export const TelegramGroopSelectFromId = gql`
  query TelegramGroop_SelectFromId($param: JSON, $idList: [String]!) {
    TelegramGroop_SelectFromId(param: $param, idList: $idList)    
  }
` 

export const TelegramGroopSelectFromUser = gql`
  query TelegramGroop_SelectFromUser($param: JSON, $userIdList: [String]!) {
    TelegramGroop_SelectFromUser(param: $param, userIdList: $userIdList)
  }
`
