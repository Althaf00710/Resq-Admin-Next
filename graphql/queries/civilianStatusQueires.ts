import { gql } from '@apollo/client';

export const GET_CIVILIAN_STATUS_BY_ID = gql`
  query GetCivilianStatusById($id: ID!) {
    civilianStatusById(id: $id) {
      id
      role
      description
    }
  }
`;

export const GET_ALL_CIVILIAN_STATUSES = gql`
  query GetAllCivilianStatuses {
    civilianStatuses {
      id
      role
      description
    }
  }
`;
