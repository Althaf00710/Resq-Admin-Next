import { gql } from '@apollo/client';

export const CREATE_FIRST_AID_DETAIL = gql`
  mutation CreateFirstAidDetail($firstAidDetail: CreateFirstAidDetailInput!, $image: Upload) {
    createFirstAidDetail(firstAidDetail: $firstAidDetail, image: $image) {
      success
      message
      firstAidDetail {
        id
        emergencySubCategoryId
        displayOrder
        point
        imageUrl
      }
    }
  }
`;

export const UPDATE_FIRST_AID_DETAIL = gql`
  mutation UpdateFirstAidDetail($id: ID!, $firstAidDetail: UpdateFirstAidDetailInput!, $image: Upload) {
    updateFirstAidDetail(id: $id, firstAidDetail: $firstAidDetail, image: $image) {
      success
      message
      firstAidDetail {
        id
        emergencySubCategoryId
        displayOrder
        point
        imageUrl
      }
    }
  }
`;

export const DELETE_FIRST_AID_DETAIL = gql`
  mutation DeleteFirstAidDetail($id: ID!) {
    deleteFirstAidDetail(id: $id) {
      success
      message
    }
  }
`;
