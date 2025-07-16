import { gql } from '@apollo/client';

export const HANDLE_RESCUE_VEHICLE_LOCATION = gql`
  mutation HandleRescueVehicleLocation($input: HandleRescueVehicleLocationInput!) {
    handleRescueVehicleLocation(input: $input) {
      success
      message
      rescueVehicleLocation {
        id
        rescueVehicleId
        latitude
        longitude
        location
        active
      }
    }
  }
`;
