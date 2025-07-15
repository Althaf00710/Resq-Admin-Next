import { gql } from '@apollo/client';

export const GET_FIRST_AID_DETAIL_BY_ID = gql`
  query GetFirstAidDetailById($id: ID!) {
    firstAidDetailById(id: $id) {
      message
      success
      firstAidDetail {
        id
        displayOrder
        emergencySubCategoryId
        imageUrl
        point
      }
    }
  }
`;

export const GET_ALL_FIRST_AID_DETAILS = gql`
  query GetAllFirstAidDetails {
    firstAidDetails {
      id
      displayOrder
      emergencySubCategoryId
      imageUrl
      point
    }
  }
`;

export const GET_FIRST_AID_DETAILS_BY_SUBCATEGORY_ID = gql`
  query GetFirstAidDetailsBySubCategoryId($emergencySubCategoryId: ID!) {
    firstAidDetailsBySubCategoryId(emergencySubCategoryId: $emergencySubCategoryId) {
      id
      displayOrder
      emergencySubCategoryId
      imageUrl
      point
    }
  }
`;