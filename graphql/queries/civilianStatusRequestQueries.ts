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

export const GET_ALL_CIVILIAN_STATUS_REQUESTS = gql`
  query GetAllCivilianStatusRequests {
    civilianStatusRequests {
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
