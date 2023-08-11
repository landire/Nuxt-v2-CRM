import gql from 'graphql-tag'

export const SubscriptionDistricts = gql`
  subscription Subscription_Districts($idList: [String], $isAll: Boolean) {
    Subscription_Districts(idList: $idList, isAll: $isAll)
  }
`

export const SubscriptionDistrictsBilling = gql`
  subscription Subscription_DistrictsBilling {
    Subscription_DistrictsBilling
  }
`
