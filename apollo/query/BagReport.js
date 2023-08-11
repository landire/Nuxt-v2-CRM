import gql from 'graphql-tag'

export const BagReportSelectFromUserId = gql`
  query BagReport_SelectFromUserId($param: JSON, $userIdList: [String]!) {
    BagReport_SelectFromUserId(param: $param, userIdList: $userIdList)
  }
`

export const BagReportSelectFromParam = gql`
  query BagReport_SelectFromParam($param: JSON) {
    BagReport_SelectFromParam(param: $param)
  }
`

export const BagReportSelectFromId = gql`
  query BagReport_SelectFromId($param: JSON, $idList: [String]!) {
    BagReport_SelectFromId(param: $param, idList: $idList)
  }
`

export const BagReportSelectFromParentId = gql`
  query BagReport_SelectFromParentId($param: JSON, $idList: [String]!) {
    BagReport_SelectFromParentId(param: $param, idList: $idList)
  }
`

export const BagReportSelectFromAdminUserId = gql`
  query BagReport_SelectFromAdminUserId($param: JSON, $userIdList: [String]!) {
    BagReport_SelectFromAdminUserId(param: $param, userIdList: $userIdList)
  }
`
