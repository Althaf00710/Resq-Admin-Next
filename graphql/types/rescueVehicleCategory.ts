export interface RescueVehicleCategory {
  id: string;
  name: string;
}

export interface CreateRescueVehicleCategoryVars {
  input: {
    name: string;
  };
}

export interface UpdateRescueVehicleCategoryVars {
  id: string;
  input: {
    name: string;
  };
}

export interface DeleteRescueVehicleCategoryVars {
  id: string;
}

export interface RescueVehicleCategoryResponse {
  success: boolean;
  message: string;
  rescueVehicleCategory: RescueVehicleCategory;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}
