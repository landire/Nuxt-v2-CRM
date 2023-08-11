import gql from 'graphql-tag'

export const SubscriptionUser = gql`
  subscription Subscription_User($watch: JSON, $param: JSON, $idList: [String], $allUsers: Boolean) {
    Subscription_User(watch: $watch, param: $param, idList: $idList, allUsers: $allUsers)
  }
`
