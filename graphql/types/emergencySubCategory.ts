export interface EmergencySubCategory {
  id: string;
  name: string;
  description: string;
  emergencyCategoryId: string;
  imageUrl: string;
}

export interface CreateEmergencySubCategoryVars {
  input: {
    name: string;
    description: string;
    emergencyCategoryId: string;
  };
  image?: File;
}

export interface UpdateEmergencySubCategoryVars {
  id: string;
  input: {
    name: string;
    description: string;
  };
  image?: File;
}

export interface DeleteEmergencySubCategoryVars {
  id: string;
}

export interface EmergencySubCategoryResponse {
  success: boolean;
  message: string;
  emergencySubCategory: EmergencySubCategory;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}
