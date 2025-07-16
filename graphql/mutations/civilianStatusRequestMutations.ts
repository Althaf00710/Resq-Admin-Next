import { gql } from '@apollo/client';

export const CREATE_CIVILIAN_STATUS_REQUEST = gql`
  mutation CreateCivilianStatusRequest(
    $id: ID
    $input: CreateCivilianStatusRequestInput!
    $proofPicture: Upload
  ) {
    createCivilianStatusRequest(id: $id, input: $input, proofPicture: $proofPicture) {
      success
      message
      civilianStatusRequest {
        id
        status
        civilianId
        civilianStatusId
        proofImage
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_CIVILIAN_STATUS_REQUEST = gql`
  mutation UpdateCivilianStatusRequest($id: ID!, $input: UpdateCivilianStatusRequestInput!) {
    updateCivilianStatusRequest(id: $id, input: $input) {
      success
      message
      civilianStatusRequest {
        id
        status
        civilianId
        civilianStatusId
        proofImage
        createdAt
        updatedAt
      }
    }
  }
`;
