import gql from 'graphql-tag'

export const RequestSelectFromUserId = gql`
  query Request_SelectFromUserId($param: JSON) {
    Request_SelectFromUserId(param: $param)
  }
`

export const RequestSelectNewAbon = gql`
  query Request_SelectFromNewAbon($param: JSON) {
    Request_SelectFromNewAbon(param: $param)
  }
`

export const RequestSelectTexAccept = gql`
  query Request_SelectFromTexAccept($param: JSON) {
    Request_SelectFromTexAccept(param: $param)
  }
`

export const RequestSelectDogovor = gql`
  query Request_SelectZakluchDogovor($param: JSON) {
    Request_SelectZakluchDogovor(param: $param)
  }
`

export const RequestSelectPodkluchenie = gql`
  query Request_SelectPodkluchenie($param: JSON) {
    Request_SelectPodkluchenie(param: $param)
  }
`

export const RequestSelectKontrol = gql`
  query Request_SelectKontrol($param: JSON) {
    Request_SelectKontrol(param: $param)
  }
`

export const RequestSelectFromAdmin = gql`
  query Request_SelectFromAdmin($param: JSON) {
    Request_SelectFromAdmin(param: $param)
  }
`

export const RequestSelectFromId = gql`
  query Request_SelectFromId($param: JSON, $idList: [String]!) {
    Request_SelectFromId(param: $param, idList: $idList)
  }
` 

export const RequestSelectFromQuality = gql`
  query Request_SelectFromQuality($param: JSON, $qualityControlIdList: [String!]) {
    Request_SelectFromQuality(param: $param, qualityControlIdList: $qualityControlIdList)
  }
`
