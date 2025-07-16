import { gql } from '@apollo/client';

export const HANDLE_CIVILIAN_LOCATION = gql`
  mutation HandleCivilianLocation($input: HandleCivilianLocationInput!) {
    handleCivilianLocation(input: $input) {
      success
      message
      civilianLocation {
        id
        active
        civilianId
        latitude
        longitude
        location
      }
    }
  }
`;
