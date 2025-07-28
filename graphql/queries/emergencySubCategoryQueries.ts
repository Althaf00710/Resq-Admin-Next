import { gql } from '@apollo/client';

export const GET_ALL_EMERGENCY_SUBCATEGORIES = gql`
  query GetAllEmergencySubCategories {
    emergencySubCategories {
      id
      name
      description
      imageUrl
      emergencyCategoryId
    }
  }
`;

export const GET_EMERGENCY_SUBCATEGORY_BY_ID = gql`
  query GetEmergencySubCategoryById($id: ID!) {
    emergencySubCategoryById(id: $id) {
      id
      name
      description
      imageUrl
      emergencyCategoryId
    }
  }
`;

export const GET_SUBCATEGORIES_BY_CATEGORY = gql`
  query GetSubcategoriesByCategory($categoryId: Int!) {
    subCategoriesByCategoryId(categoryId: $categoryId) {
      id
      name
      description
      imageUrl
      emergencyCategoryId
    }
  }
`;