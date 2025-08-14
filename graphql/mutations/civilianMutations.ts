import { gql } from "@apollo/client";

export const RESTRICT_CIVILIAN = gql`
  mutation RestrictCivilian($id: Int!) {
    restrictCivilian(id: $id) {
      success
      message
    }
  }
`;

export const UNRESTRICT_CIVILIAN = gql`
  mutation UnrestrictCivilian($id: Int!) {
    unrestrictCivilian(id: $id) {
      success
      message
    }
  }
`;
