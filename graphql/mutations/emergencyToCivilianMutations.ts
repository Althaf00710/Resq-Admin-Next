import { gql } from '@apollo/client';

export const CREATE_EMERGENCY_TO_CIVILIAN_MAPPING = gql`
  mutation CreateEmergencyToCivilianMapping(
    $input: EmergencyToCivilianInput!
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
  mutation DeleteEmergencyToCivilianMapping($id: Int!) {
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
