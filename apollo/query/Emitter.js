import gql from 'graphql-tag'

export const EmitersGetEmiters = gql`
  query Emiters_GetEmiters($emitNameList: [String]!) {
    Emiters_GetEmiters(emitNameList: $emitNameList)
  }
`
