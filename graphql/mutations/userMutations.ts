import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      message
      success
      user {
        id
        name
        username
        profilePicturePath
      }
    }
  }
`;


export const CREATE_USER = gql`
  mutation CreateUser(
    $input: UserCreateInput!
    $profilePicture: Upload
  ) {
    createUser(input: $input, profilePicture: $profilePicture) {
      success
      message
      user {
        id
        email
        name
        username
        joinedDate
        lastActive
        profilePicturePath
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: Int!
    $input: UserUpdateInput!
    $profilePicture: Upload
  ) {
    updateUser(id: $id, input: $input, profilePicture: $profilePicture) {
      success
      message
      user {
        id
        email
        name
        username
        joinedDate
        lastActive
        profilePicturePath
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id) {
      success
      message
      user {
        id
        username
      }
    }
  }
`;
