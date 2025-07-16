import { gql } from '@apollo/client';

export const CREATE_SNAKE = gql`
  mutation CreateSnake($input: CreateSnakeInput!, $image: Upload) {
    createSnake(input: $input, image: $image) {
      success
      message
      snake {
        id
        name
        scientificName
        venomType
        description
        imageUrl
      }
    }
  }
`;

export const UPDATE_SNAKE = gql`
  mutation UpdateSnake($id: ID!, $input: UpdateSnakeInput!, $image: Upload) {
    updateSnake(id: $id, input: $input, image: $image) {
      success
      message
      snake {
        id
        name
        scientificName
        venomType
        description
        imageUrl
      }
    }
  }
`;

export const DELETE_SNAKE = gql`
  mutation DeleteSnake($id: ID!) {
    deleteSnake(id: $id) {
      success
      message
      snake {
        id
        scientificName
      }
    }
  }
`;
