export interface RescueVehicleRequest {
  id: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  proofImageURL: string;
  createdAt: string;
  status: string;
  isActive: boolean;
  civilian: {
    id: string;
    name: string;
    phoneNumber: string;
  };
  emergencySubCategory: {
    id: string;
    name: string;
    icon: string;
  };
}

export interface CreateRescueVehicleRequestVars {
  input: {
    civilianId: string;
    description: string;
    emergencySubCategoryId: string;
    latitude: number;
    longitude: number;
    location: string;
    proofImage: string; // File if Upload scalar is used
  };
}

export interface UpdateRescueVehicleRequestVars {
  id: string;
  input: {
    status: string;
  };
}

export interface DeleteRescueVehicleRequestVars {
  id: string;
}

export interface RescueVehicleRequestResponse {
  success: boolean;
  message: string;
  rescueVehicleRequest: RescueVehicleRequest;
}
