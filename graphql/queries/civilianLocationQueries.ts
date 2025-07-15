import { gql } from '@apollo/client';

export const GET_CIVILIAN_LOCATION_BY_ID = gql`
  query GetCivilianLocationById($id: ID!) {
    civilianLocationById(id: $id) {
      active
      civilianId
      id
      latitude
      location
      longitude
    }
  }
`;

export const GET_ALL_CIVILIAN_LOCATIONS = gql`
  query GetAllCivilianLocations {
    civilianLocations {
      active
      civilianId
      id
      latitude
      location
      longitude
    }
  }
`;
