import gql from 'graphql-tag'

export const GetReestrPayments = gql`
  query GetReestrPayments($Year: Int, $Month: Int, $Day: Int, $npp: Int, $inn: String, $kassir: String, $apiKey: String) {
    GetReestrPayments(Year: $Year, Month: $Month, Day: $Day, npp: $npp, inn: $inn, kassir: $kassir, apiKey: $apiKey)
  }
`

export const GetReestrPaymentsFile = gql`
  query GetReestrPaymentsFile($FileName: String) {
    GetReestrPaymentsFile(FileName: $FileName)    
  }
`
