import { gql } from '@apollo/client';

export const GET_RESCUE_VEHICLE_BY_ID = gql`
  query GetRescueVehicleById($id: ID!) {
    rescueVehicleById(id: $id) {
      message
      success
      rescueVehicle {
        id
        code
        plateNumber
        rescueVehicleCategoryId
        status
      }
    }
  }
`;

export const GET_RESCUE_VEHICLES = gql`
  query GetRescueVehicles(
    $first: Int!
    $after: String
    $where: RescueVehicleFilterInput
  ) {
    rescueVehicles(first: $first, after: $after, where: $where) {
      totalCount
      edges {
        cursor
        node {
          id
          code
          plateNumber
          status
          rescueVehicleCategoryId
          rescueVehicleCategory {
            id
            name
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const CHECK_PLATE_NUMBER_EXIST = gql`
  query CheckPlateNumberExist($numberPlate: String!, $excludeId: Int) {
    checkPlateNumberExist(numberPlate: $numberPlate, excludeId: $excludeId)
  }
`;