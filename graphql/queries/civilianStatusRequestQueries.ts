import { gql } from '@apollo/client';

export const GET_CIVILIAN_STATUS_REQUEST_BY_ID = gql`
  query GetCivilianStatusRequestById($id: ID!) {
    civilianStatusRequestById(id: $id) {
      civilianId
      civilianStatusId
      createdAt
      id
      proofImage
      status
      updatedAt
    }
  }
`;

export const GET_CIVILIAN_STATUS_REQUESTS = gql`
  query GetCivilianStatusRequests(
    $first: Int!
    $after: String
    $where: CivilianStatusRequestFilterInput
  ) {
    civilianStatusRequests(first: $first, after: $after, where: $where) {
      totalCount
      edges {
        cursor
        node {
          id
          status
          createdAt
          updatedAt
          proofImage
          civilianStatusId
          civilianStatus {
            id
            role
          }
          civilianId
          civilian {
            id
            name
            civilianStatus {
              role
            }
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
