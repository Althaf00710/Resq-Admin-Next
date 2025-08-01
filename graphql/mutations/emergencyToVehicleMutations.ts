import { gql } from '@apollo/client';

export const CREATE_EMERGENCY_TO_VEHICLE_MAPPING = gql`
  mutation CreateEmergencyToVehicleMapping(
    $input: EmergencyToVehicleInput!
  ) {
    createEmergencyToVehicleMapping(input: $input) {
      success
      message
      emergencyToVehicle {
        id
        emergencyCategoryId
        vehicleCategoryId
      }
    }
  }
`;

export const DELETE_EMERGENCY_TO_VEHICLE_MAPPING = gql`
  mutation DeleteEmergencyToVehicleMapping($id: Int!) {
    deleteEmergencyToVehicleMapping(id: $id) {
      success
      message
      emergencyToVehicle {
        id
        emergencyCategoryId
        vehicleCategoryId
      }
    }
  }
`;
