import { gql } from '@apollo/client';

export const CREATE_EMERGENCY_SUBCATEGORY = gql`
  mutation CreateEmergencySubCategory($input: EmergencySubCategoryCreateInput!, $image: Upload) {
    createEmergencySubCategory(input: $input, image: $image) {
      success
      message
      emergencySubCategory {
        id
        name
        description
        emergencyCategoryId
        imageUrl
      }
    }
  }
`;

export const UPDATE_EMERGENCY_SUBCATEGORY = gql`
  mutation UpdateEmergencySubCategory($id: Int!, $input: EmergencySubCategoryUpdateInput!, $image: Upload) {
    updateEmergencySubCategory(id: $id, input: $input, image: $image) {
      success
      message
      emergencySubCategory {
        id
        name
        description
        emergencyCategoryId
        imageUrl
      }
    }
  }
`;

export const DELETE_EMERGENCY_SUBCATEGORY = gql`
  mutation DeleteEmergencySubCategory($id: Int!) {
    deleteEmergencySubCategory(id: $id) {
      success
      message
    }
  }
`;
