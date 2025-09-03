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

export const GET_LOG_USER_BY_ID = gql`
  query GetUserById($id: Int!) {
    userById(id: $id) {
      id
      name
      username
      profilePicturePath
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      success
      message
      user {
        id
        name
        profilePicturePath
        username
      }
    }
  }
`;

export const CHECK_USERNAME = gql`
  query UserCheckUsername($username: String!) {
    userCheckUsername(username: $username)
  }
`;

export const CHECK_EMAIL = gql`
  query UserCheckEmail($email: String!) {
    userCheckEmail(email: $email)
  }
`;