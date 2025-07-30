import { gql } from '@apollo/client';

export const GET_ALL_EMERGENCY_CATEGORIES = gql`
  query GetAllEmergencyCategories {
    emergencyCategories {
      id
      name
      description
      icon
    }
  }
`;

export const GET_EMERGENCY_CATEGORY_BY_ID = gql`
  query GetEmergencyCategoryById($id: ID!) {
    emergencyCategoryById(id: $id) {
      id
      name
      description
      icon
    }
  }
`;

export const CHECK_EMERGENCY_CATEGORY_EXIST = gql`
  query GetEmergencyCategoryExist($name: String!, $excludeId: Int) {
    emergencyCategoryExist(name: $name, excludeId: $excludeId)
  }
`;

export const GET_UNMAPPED_EMERGENCY_TO_CIVILIAN = gql`
  query GetUnmappedEmergencyToCivilian($civilianStatusId: Int!) {
    unmappedEmergencyToCivilian(civilianStatusId: $civilianStatusId) {
      id
      icon
      name
    } 
  }
`;