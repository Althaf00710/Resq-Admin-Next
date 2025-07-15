import { gql } from '@apollo/client';

export const GET_EMERGENCY_TO_VEHICLE = gql`
  query GetEmergencyToVehicle {
    emergencyToVehicle {
      id
      emergencyCategoryId
      vehicleCategoryId
    }
  }
`;
