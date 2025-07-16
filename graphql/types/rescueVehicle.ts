export interface RescueVehicle {
  id: string;
  plateNumber: string;
  status: string;
  code: string;
  rescueVehicleCategory: {
    id: string;
    name: string;
  };
}

export interface CreateRescueVehicleVars {
  input: {
    plateNumber: string;
    password: string;
    rescueVehicleCategoryId: string;
  };
}

export interface UpdateRescueVehicleVars {
  id: string;
  input: {
    plateNumber: string;
    password?: string;
    status: string;
  };
}

export interface DeleteRescueVehicleVars {
  id: string;
}

export interface RescueVehicleResponse {
  success: boolean;
  message: string;
  rescueVehicle: RescueVehicle;
}
