import gql from 'graphql-tag'

export const SubscriptionTarif = gql`
  subscription Subscription_Tarif($watch: JSON, $param: JSON) {
    Subscription_Tarif(watch: $watch, param: $param)
  }
`
