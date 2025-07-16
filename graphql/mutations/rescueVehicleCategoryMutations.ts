import { gql } from '@apollo/client';

export const CREATE_RESCUE_VEHICLE_CATEGORY = gql`
  mutation CreateRescueVehicleCategory($input: CreateRescueVehicleCategoryInput!) {
    createRescueVehicleCategory(input: $input) {
      success
      message
      rescueVehicleCategory {
        id
        name
      }
    }
  }
`;

export const UPDATE_RESCUE_VEHICLE_CATEGORY = gql`
  mutation UpdateRescueVehicleCategory($id: ID!, $input: UpdateRescueVehicleCategoryInput!) {
    updateRescueVehicleCategory(id: $id, input: $input) {
      success
      message
      rescueVehicleCategory {
        id
        name
      }
    }
  }
`;

export const DELETE_RESCUE_VEHICLE_CATEGORY = gql`
  mutation DeleteRescueVehicleCategory($id: ID!) {
    deleteRescueVehicleCategory(id: $id) {
      success
      message
    }
  }
`;
