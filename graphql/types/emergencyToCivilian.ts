export interface EmergencyToCivilian {
  id: string;
  civilianStatusId: string;
  emergencyCategoryId: string;
}

export interface CreateEmergencyToCivilianMappingVars {
  input: {
    civilianStatusId: string;
    emergencyCategoryId: string;
  };
}

export interface DeleteEmergencyToCivilianMappingVars {
  id: string;
}

export interface EmergencyToCivilianResponse {
  success: boolean;
  message: string;
  emergencyToCivilian: EmergencyToCivilian;
}
