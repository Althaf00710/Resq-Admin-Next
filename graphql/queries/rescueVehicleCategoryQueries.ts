import { gql } from '@apollo/client';

export const GET_RESCUE_VEHICLE_CATEGORY_BY_ID = gql`
  query GetRescueVehicleCategoryById($id: ID!) {
    rescueVehicleCategoryById(id: $id) {
      id
      name
      emergencyToVehicles {
        id
        emergencyCategoryId
        vehicleCategoryId
      }
    }
  }
`;

export const GET_ALL_RESCUE_VEHICLE_CATEGORIES = gql`
  query GetAllRescueVehicleCategories {
    rescueVehicleCategories {
      id
      name
      emergencyToVehicles {
        id
        emergencyCategoryId
        vehicleCategoryId
      }
    }
  }
`;

export const GET_VEHICLE_CATEGORIES_WITH_EMERGENCY = gql`
  query {
    rescueVehicleCategories {
      id
      name
      emergencyToVehicles {
        id
        emergencyCategory {
          id
          icon
          name
        }
      }
    }
  }
`;

export const IS_VEHICLE_CATEGORY_NAME_EXISTS = gql`
  query IsRescueVehicleCategoryExists($category: String!, $excludeId: Int) {
    isRescueVehicleCategoryExists(category: $category, excludeId: $excludeId)
  }
`;

export const GET_RESCUE_VEHICLE_CATEGORIES = gql`
  query {
    rescueVehicleCategories {
      id
      name
    }
  }
`;