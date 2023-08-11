import gql from 'graphql-tag'

export const RequestCreate = gql`
  mutation Request_RequestCreate($param: JSON, $delay: Int) {
    Request_RequestCreate(param: $param, delay: $delay)
  }
`

export const RequestEdit = gql`
  mutation Request_RequestEdit($idList: [String]!, $param: JSON) {
    Request_RequestEdit(idList: $idList, param: $param)
  }
`

export const RequestDelete = gql`
  mutation Request_RequestDelete($idList: [String]!) {
    Request_RequestDelete(idList: $idList)
  }
`

export const RequestStatus = gql`
  mutation Request_StatusParamConect($id: String!, $type: String!, $delay: Int) {
    Request_StatusParamConect(id: $id, type: $type, delay: $delay)
  }
`

export const RequestProverkaTeh = gql`
  mutation Request_StatusProverkaTeh($id: String!, $type: String!) {
    Request_StatusProverkaTeh(id: $id, type: $type)
  }
`

export const RequestZakluchenieDogovor = gql`
  mutation Request_StatusZakluchenieDogovor($id: String!, $type: String!) {
    Request_StatusZakluchenieDogovor(id: $id, type: $type)
  } 
`

export const RequestStatusPodkluchenie = gql`
  mutation Request_StatusPodkluchenir($id: String!, $type: String!) {
    Request_StatusPodkluchenir(id: $id, type: $type)
  }
`

export const RequestStatusKontrol = gql`
  mutation RequestStatusKontrol($id: String!, $type: String!) {
    Request_StatusKontrol(id: $id, type: $type)
  }
` 

export const RequestDeleteStatus = gql`
  mutation Request_DeleteStatus($idList: [String]!) {
    Request_DeleteStatus(idList: $idList)
  }
`
