import { gql } from '@apollo/client';

export const GET_CIVILIANS = gql`
  query GetCivilians($first: Int!, $after: String, $where: CivilianFilterInput) {
    civilians(first: $first, after: $after, where: $where) {
      totalCount
      edges {
        cursor
        node {
          id
          name
          email
          phoneNumber
          nicNumber
          joinedDate
          isRestrict
          civilianStatusId
          civilianStatus {
            id
            role
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_CIVILIAN_BY_ID = gql`
  query GetCivilianById($id: Int!) {
    civilianById(id: $id) {
      civilianStatusId
      email
      id
      joinedDate
      name
      nicNumber
      phoneNumber
    }
  }
`;
