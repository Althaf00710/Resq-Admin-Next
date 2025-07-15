import { gql } from '@apollo/client';

export const GET_ALL_CIVILIANS = gql`
  query GetAllCivilians {
    civilians {
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

export const GET_CIVILIAN_BY_ID = gql`
  query GetCivilianById($id: ID!) {
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
