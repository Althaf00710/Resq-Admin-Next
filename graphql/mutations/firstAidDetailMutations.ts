import { gql } from '@apollo/client';

export const CREATE_FIRST_AID_DETAIL = gql`
  mutation CreateFirstAidDetail($firstAidDetail: FirstAidDetailCreateInput!, $image: Upload) {
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
  mutation UpdateFirstAidDetail($id: Int!, $firstAidDetail: FirstAidDetailUpdateInput!, $image: Upload) {
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
  mutation DeleteFirstAidDetail($id: Int!) {
    deleteFirstAidDetail(id: $id) {
      success
      message
    }
  }
`;
