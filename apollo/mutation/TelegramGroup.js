import gql from 'graphql-tag'

export const TelegramGroopEdit = gql`
  mutation TelegramGroop_Edit($idList: [String]!, $param: JSON) {
    TelegramGroop_Edit(idList: $idList, param: $param)
  }
`
