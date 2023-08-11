import gql from 'graphql-tag'

export const SubscriptionUfms = gql`
  subscription Subscription_Ufms($watch: JSON, $param: JSON, $allRequest: Boolean) {
    Subscription_Ufms(watch: $watch, param: $param, allRequest: $allRequest)
  }
`
