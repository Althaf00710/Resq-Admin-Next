import { gql } from '@apollo/client';

export const GET_ALL_RESCUE_VEHICLE_LOCATIONS = gql`
  query GetAllRescueVehicleLocations {
    rescueVehicleLocations {
      id
      active
      latitude
      longitude
      location
      rescueVehicleId
      rescueVehicle {
        id
        code
        plateNumber
      }
    }
  }
`;

export const GET_RESCUE_VEHICLE_LOCATION_BY_ID = gql`
  query GetRescueVehicleLocationById($id: ID!) {
    rescueVehicleLocationById(id: $id) {
      id
      active
      latitude
      longitude
      location
      rescueVehicleId
      rescueVehicle {
        id
        code
        plateNumber
      }
    }
  }
`;
