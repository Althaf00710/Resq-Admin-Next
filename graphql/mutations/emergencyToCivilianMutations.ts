import { gql } from '@apollo/client';

export const CREATE_EMERGENCY_TO_CIVILIAN_MAPPING = gql`
  mutation CreateEmergencyToCivilianMapping(
    $input: CreateEmergencyToCivilianMappingInput!
  ) {
    createEmergencyToCivilianMapping(input: $input) {
      success
      message
      emergencyToCivilian {
        id
        civilianStatusId
        emergencyCategoryId
      }
    }
  }
`;

export const DELETE_EMERGENCY_TO_CIVILIAN_MAPPING = gql`
  mutation DeleteEmergencyToCivilianMapping($id: ID!) {
    deleteEmergencyToCivilianMapping(id: $id) {
      success
      message
      emergencyToCivilian {
        id
        civilianStatusId
        emergencyCategoryId
      }
    }
  }
`;
