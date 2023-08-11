import gql from 'graphql-tag'

export const SubscriptionRequest = gql`
  subscription Subscription_Request($watch: JSON, $param: JSON, $allRequest: Boolean, $idList: [String]) {
    Subscription_Request(watch: $watch, param: $param, allRequest: $allRequest, idList: $idList)
  }
`
