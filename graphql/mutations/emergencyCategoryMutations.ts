import { gql } from '@apollo/client';

export const CREATE_EMERGENCY_CATEGORY = gql`
  mutation CreateEmergencyCategory($input: EmergencyCategoryCreateInput!) {
    createEmergencyCategory(input: $input) {
      success
      message
      emergencyCategory {
        id
        name
        description
        icon
      }
    }
  }
`;

export const UPDATE_EMERGENCY_CATEGORY = gql`
  mutation UpdateEmergencyCategory($id: Int!, $input: EmergencyCategoryUpdateInput!) {
    updateEmergencyCategory(id: $id, input: $input) {
      success
      message
      emergencyCategory {
        id
        name
        description
        icon
      }
    }
  }
`;

export const DELETE_EMERGENCY_CATEGORY = gql`
  mutation DeleteEmergencyCategory($id: Int!) {
    deleteEmergencyCategory(id: $id) {
      success
      message
    }
  }
`;
