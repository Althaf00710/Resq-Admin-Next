export interface EmergencyToVehicle {
  id: string;
  emergencyCategoryId: string;
  vehicleCategoryId: string;
}

export interface CreateEmergencyToVehicleMappingVars {
  input: {
    emergencyCategoryId: string;
    vehicleCategoryId: string;
  };
}

export interface DeleteEmergencyToVehicleMappingVars {
  id: string;
}

export interface EmergencyToVehicleResponse {
  success: boolean;
  message: string;
  emergencyToVehicle: EmergencyToVehicle;
}
