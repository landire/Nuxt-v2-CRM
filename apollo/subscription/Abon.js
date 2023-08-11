import gql from 'graphql-tag'

export const SubscriptionAbon = gql`
  subscription Subscription_Abon($watch: JSON, $param: JSON, $billingIdList: [String]) {
    Subscription_Abon(watch: $watch, param: $param, billingIdList: $billingIdList)
  }
`

export const SubscriptionCurAbonError = gql`
  subscription Subscription_CurAbonError($billingIdList: [String]) {
    Subscription_CurAbonError(billingIdList: $billingIdList)
  }
` 

export const SubscriptionAbonError = gql`
  subscription Subscription_AbonError($isAll: Boolean) {
    Subscription_AbonError(isAll: $isAll)
  } 
`
