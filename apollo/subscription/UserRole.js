import gql from 'graphql-tag'

export const SubscriptionUserRole = gql`
  subscription Subscription_UserRole($watch: JSON, $param: JSON, $idList: [String], $useridList: [String]) {
    Subscription_UserRole(watch: $watch, param: $param, idList: $idList, useridList: $useridList)
  }
`