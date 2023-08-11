import gql from 'graphql-tag'

export const PayReportCreate = gql`
  mutation PayReport_Create($year: Int!, $month: Int!, $isOverwrite: Boolean!) {
    PayReport_Create(year: $year, month: $month, isOverwrite: $isOverwrite)
  }
`
