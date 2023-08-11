import gql from 'graphql-tag'

export const PayReportSelectAll = gql`
  query PayReport_SelectAll($param: JSON) {
    PayReport_SelectAll(param: $param)
  }
`

export const PayReportSelectPeriod = gql`
  query PayReport_SelectPeriod($param: JSON, $ot: JSON, $do: JSON) {
    PayReport_SelectPeriod(param: $param, ot: $ot, do: $do)
  }
`

export const PaymentSelectFromRep = gql`
  query Payment_SelectFromRep($param: JSON, $payReportIdList: [String]!) {
    Payment_SelectFromRep(param: $param, payReportIdList: $payReportIdList)
  }
`
