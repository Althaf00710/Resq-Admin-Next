import { gql } from '@apollo/client';

export const GET_ALL_SNAKES = gql`
  query GetAllSnakes {
    snakes {
      id
      name
      description
      scientificName
      venomType
      imageUrl
    }
  }
`;

export const GET_SNAKE_BY_ID = gql`
  query GetSnakeById($id: ID!) {
    snakeById(id: $id) {
      id
      name
      description
      scientificName
      venomType
      imageUrl
    }
  }
`;
