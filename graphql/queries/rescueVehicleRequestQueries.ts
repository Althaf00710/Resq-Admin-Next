import { gql } from '@apollo/client';

export const GET_ALL_RESCUE_VEHICLE_REQUESTS = gql`
  query GetAllRescueVehicleRequests {
    rescueVehicleRequests {
      id
      civilianId
      createdAt
      description
      emergencyCategoryId
      isActive
      latitude
      longitude
      location
      proofImageURL
      status
    }
  }
`;

export const GET_RESCUE_VEHICLE_REQUEST_BY_ID = gql`
  query GetRescueVehicleRequestById($id: ID!) {
    rescueVehicleRequestById(id: $id) {
      id
      civilianId
      createdAt
      description
      emergencyCategoryId
      isActive
      latitude
      longitude
      location
      proofImageURL
      status
      rescueVehicleAssignments {
        id
        isActive
        arrivalTime
        departureTime
        durationMinutes
        status
        timestamp
        rescueVehicle {
          code
          plateNumber
        }
      }
      civilian {
        name
        phoneNumber
        civilianLocations {
          active
          latitude
          longitude
          location
        }
        civilianStatus {
          role
        }
      }
    }
  }
`;
