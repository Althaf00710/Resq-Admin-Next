import { gql } from '@apollo/client';

export const GET_EMERGENCY_TO_CIVILIAN = gql`
  query GetEmergencyToCivilian {
    emergencyToCivilian {
      id
      civilianStatusId
      emergencyCategoryId
    }
  }
`;
