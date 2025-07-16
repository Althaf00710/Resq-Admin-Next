import { gql } from '@apollo/client';

export const CREATE_RESCUE_VEHICLE_ASSIGNMENT = gql`
  mutation CreateRescueVehicleAssignment($input: CreateRescueVehicleAssignmentInput!) {
    createRescueVehicleAssignment(input: $input) {
      success
      message
      rescueVehicleAssignment {
        id
        isActive
        rescueVehicleRequestId
        status
        timestamp
        rescueVehicle {
          id
          code
          plateNumber
          status
        }
      }
    }
  }
`;

export const UPDATE_RESCUE_VEHICLE_ASSIGNMENT = gql`
  mutation UpdateRescueVehicleAssignment($id: ID!, $input: UpdateRescueVehicleAssignmentInput!) {
    updateRescueVehicleAssignment(id: $id, input: $input) {
      success
      message
      rescueVehicleAssignment {
        id
        rescueVehicleId
        rescueVehicleRequestId
        status
        isActive
        timestamp
        arrivalTime
        departureTime
        durationMinutes
      }
    }
  }
`;

export const CANCEL_RESCUE_VEHICLE_ASSIGNMENT = gql`
  mutation CancelRescueVehicleAssignment($id: ID!) {
    cancelRescueVehicleAssignment(id: $id) {
      success
      message
    }
  }
`;
