import { gql } from '@apollo/client';

export const CREATE_RESCUE_VEHICLE = gql`
  mutation CreateRescueVehicle($input: CreateRescueVehicleInput!) {
    createRescueVehicle(input: $input) {
      success
      message
      rescueVehicle {
        code
        id
        plateNumber
        status
        rescueVehicleCategory {
          id
          name
        }
      }
    }
  }
`;

export const UPDATE_RESCUE_VEHICLE = gql`
  mutation UpdateRescueVehicle($id: ID!, $input: UpdateRescueVehicleInput!) {
    updateRescueVehicle(id: $id, input: $input) {
      success
      message
      rescueVehicle {
        code
        id
        plateNumber
        status
      }
    }
  }
`;

export const DELETE_RESCUE_VEHICLE = gql`
  mutation DeleteRescueVehicle($id: ID!) {
    deleteRescueVehicle(id: $id) {
      success
      message
    }
  }
`;
