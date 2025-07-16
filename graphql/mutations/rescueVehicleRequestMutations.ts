import { gql } from '@apollo/client';

export const CREATE_RESCUE_VEHICLE_REQUEST = gql`
  mutation CreateRescueVehicleRequest($input: CreateRescueVehicleRequestInput!) {
    createRescueVehicleRequest(input: $input) {
      success
      message
      rescueVehicleRequest {
        id
        description
        createdAt
        latitude
        longitude
        location
        proofImageURL
        status
        isActive
        civilian {
          id
          name
          phoneNumber
        }
        emergencyCategory {
          id
          name
          icon
        }
      }
    }
  }
`;

export const UPDATE_RESCUE_VEHICLE_REQUEST = gql`
  mutation UpdateRescueVehicleRequest($id: ID!, $input: UpdateRescueVehicleRequestInput!) {
    updateRescueVehicleRequest(id: $id, input: $input) {
      success
      message
      rescueVehicleRequest {
        id
        status
      }
    }
  }
`;

export const DELETE_RESCUE_VEHICLE_REQUEST = gql`
  mutation DeleteRescueVehicleRequest($id: ID!) {
    deleteRescueVehicleRequest(id: $id) {
      success
      message
    }
  }
`;
