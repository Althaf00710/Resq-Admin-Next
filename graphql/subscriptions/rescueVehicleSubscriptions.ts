import { gql } from '@apollo/client';

export const ON_VEHICLE_STATUS_CHANGED = gql`
  subscription OnVehicleStatusChanged {
    onVehicleStatusChanged {
      id
      status
    }
  }
`;