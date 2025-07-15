import { gql } from '@apollo/client';

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
      username
      email
      joinedDate
      lastActive
      profilePicturePath
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    userById(id: $id) {
      id
      name
      username
      email
      joinedDate
      lastActive
      profilePicturePath
    }
  }
`;