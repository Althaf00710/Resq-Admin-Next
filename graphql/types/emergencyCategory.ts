export interface EmergencyCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface EmergencyCategoryInput {
  name: string;
  description: string;
  icon: string;
}

export interface CreateEmergencyCategoryVars {
  input: EmergencyCategoryInput;
}

export interface UpdateEmergencyCategoryVars {
  id: string;
  input: EmergencyCategoryInput;
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
