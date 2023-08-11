import gql from 'graphql-tag'

export const SubscriptionBagReport = gql`
  subscription Subscription_BagReport($watch: JSON, $param: JSON, $idList: [String] $useridList: [String], $isAll: Boolean, $parentBagreportIdList: [String], $userAdminidList: [String]) {
    Subscription_BagReport(watch: $watch, param: $param, useridList: $useridList, idList: $idList isAll: $isAll, parentBagreportIdList: $parentBagreportIdList, userAdminidList: $userAdminidList)
  }
`
