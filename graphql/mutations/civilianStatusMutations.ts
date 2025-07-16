import { gql } from '@apollo/client';

export const CREATE_CIVILIAN_STATUS = gql`
  mutation CreateCivilianStatus($input: CreateCivilianStatusInput!) {
    createCivilianStatus(input: $input) {
      success
      message
      civilianStatus {
        id
        role
        description
      }
    }
  }
`;

export const UPDATE_CIVILIAN_STATUS = gql`
  mutation UpdateCivilianStatus($id: ID!, $input: UpdateCivilianStatusInput!) {
    updateCivilianStatus(id: $id, input: $input) {
      success
      message
      civilianStatus {
        id
        role
        description
      }
    }
  }
`;

export const DELETE_CIVILIAN_STATUS = gql`
  mutation DeleteCivilianStatus($id: ID!) {
    deleteCivilianStatus(id: $id) {
      success
      message
    }
  }
`;
