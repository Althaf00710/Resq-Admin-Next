export interface Vehicle {
  id: string;
  plateNumber: string;
  status: 'Active' | 'Inactive' | 'On Service';
  code: string;
  rescueVehicleCategory: {
    id: string;
    name: string;
  };
}

export type GetRescueVehiclesQueryVariables = {
  first: number;
  after?: string | null;
  where?: {
    plateNumber?: { contains?: string };
    status?: { eq?: string };
    rescueVehicleCategoryId?: { eq?: number };
  } | null;
};

export interface CreateRescueVehicleVars {
  input: {
    plateNumber: string;
    password: string;
    rescueVehicleCategoryId: string;
  };
}

export interface UpdateRescueVehicleVars {
  id: number;
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
  rescueVehicle: Vehicle;
}
