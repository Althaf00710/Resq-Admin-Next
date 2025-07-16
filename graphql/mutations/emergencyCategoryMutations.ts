import { gql } from '@apollo/client';

export const CREATE_EMERGENCY_CATEGORY = gql`
  mutation CreateEmergencyCategory($input: CreateEmergencyCategoryInput!) {
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
  mutation UpdateEmergencyCategory($id: ID!, $input: UpdateEmergencyCategoryInput!) {
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
  mutation DeleteEmergencyCategory($id: ID!) {
    deleteEmergencyCategory(id: $id) {
      success
      message
    }
  }
`;
