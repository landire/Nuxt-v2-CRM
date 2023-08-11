import gql from 'graphql-tag'

export const AbonSelectFromBillingId = gql`
  query Abon_SelectAbonFromBillingId($billingIdList: [String]) {
    Abon_SelectAbonFromBillingId(billingIdList: $billingIdList)
  }
`
