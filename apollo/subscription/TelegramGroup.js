import gql from 'graphql-tag'

export const SubscriptionTelegramGroop = gql`
  subscription Subscription_TelegramGroop($watch: JSON, $param: JSON, $idList: [String], $useridList: [String], $isAll: Boolean) {
    Subscription_TelegramGroop(watch: $watch, param: $param, idList: $idList, useridList: $useridList, isAll: $isAll)
  }
`
