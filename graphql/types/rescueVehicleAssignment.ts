export interface RescueVehicleAssignment {
  id: string;
  rescueVehicleId?: string;
  rescueVehicleRequestId: string;
  status: string;
  isActive: boolean;
  timestamp: string;
  arrivalTime?: string;
  departureTime?: string;
  durationMinutes?: number;
  rescueVehicle?: {
    id: string;
    code: string;
    plateNumber: string;
    status: string;
  };
}

export interface CreateRescueVehicleAssignmentVars {
  input: {
    rescueVehicleId: string;
    rescueVehicleRequestId: string;
  };
}

export interface UpdateRescueVehicleAssignmentVars {
  id: string;
  input: {
    status: string;
  };
}

export interface CancelRescueVehicleAssignmentVars {
  id: string;
}

export interface RescueVehicleAssignmentResponse {
  success: boolean;
  message: string;
  rescueVehicleAssignment: RescueVehicleAssignment;
}

export interface CancelResponse {
  success: boolean;
  message: string;
}
