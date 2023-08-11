import gql from 'graphql-tag'

export const SubscriptionRole = gql`
  subscription Subscription_Role($watch: JSON, $param: JSON, $idList: [String], $allRoles: Boolean) {
    Subscription_Role(watch: $watch, param: $param, idList: $idList, allRoles: $allRoles)
  }
`