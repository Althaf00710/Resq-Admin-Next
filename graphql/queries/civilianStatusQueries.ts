import { gql } from '@apollo/client';

export const GET_CIVILIAN_STATUS_BY_ID = gql`
  query GetCivilianStatusById($id: ID!) {
    civilianStatusById(id: $id) {
      id
      role
      description
    }
  }
`;

export const GET_ALL_CIVILIAN_STATUSES = gql`
  query GetAllCivilianStatuses {
    civilianStatuses {
      id
      role
      description
    }
  }
`;

export const GET_CIVILIAN_STATUS_WITH_EMERGENCY = gql`
  query {
  civilianStatuses {
    id
    description
    role
    emergencyToCivilians {
      id
      emergencyCategory {
        id
        icon
        name
      }
    }
  }
}
`;

export const IS_CIVILIAN_STATUS_EXISTS = gql`
  query isCivilianStatusRoleExists($role: String!, $excludeId: Int) {
    isCivilianStatusRoleExists(role: $role, excludeId: $excludeId)
  }
`;
