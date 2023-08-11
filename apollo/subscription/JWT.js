import gql from 'graphql-tag'

export const SubscriptionJWT = gql`
  subscription Subscription_JWT($watch: JSON, $param: JSON) {
    Subscription_JWT(watch: $watch, param: $param)
  }
`
