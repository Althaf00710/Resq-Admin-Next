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
