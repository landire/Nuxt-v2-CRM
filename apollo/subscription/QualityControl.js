import gql from 'graphql-tag'

export const SubscriptionQualityControl = gql`
  subscription Subscription_QualityControl($watch: JSON, $param: JSON, $allQualityControl: Boolean, $QualityControlIdList: [String]) {
    Subscription_QualityControl(watch: $watch, param: $param, allQualityControl: $allQualityControl, QualityControlIdList: $QualityControlIdList)
  }
`
