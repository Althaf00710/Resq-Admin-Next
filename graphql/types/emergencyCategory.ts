export interface EmergencyCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface EmergencyCategoryCreateInput {
  name: string;
  description: string;
  icon: string;
}

export interface CreateEmergencyCategoryVars {
  input: EmergencyCategoryCreateInput;
}

export interface UpdateEmergencyCategoryVars {
  id: string;
  input: EmergencyCategoryCreateInput;
}

export interface DeleteEmergencyCategoryVars {
  id: string;
}

export interface CreateOrUpdateEmergencyCategoryResponse {
  success: boolean;
  message: string;
  emergencyCategory: EmergencyCategory;
}

export interface DeleteEmergencyCategoryResponse {
  success: boolean;
  message: string;
}
