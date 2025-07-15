import { gql } from '@apollo/client';

export const GET_RESCUE_VEHICLE_BY_ID = gql`
  query GetRescueVehicleById($id: ID!) {
    rescueVehicleById(id: $id) {
      message
      success
      rescueVehicle {
        id
        code
        plateNumber
        rescueVehicleCategoryId
        status
      }
    }
  }
`;

export const GET_ALL_RESCUE_VEHICLES = gql`
  query GetAllRescueVehicles {
    rescueVehicles {
      id
      code
      plateNumber
      rescueVehicleCategoryId
      status
    }
  }
`;
