export interface CivilianStatus {
  id: string;
  role: string;
  description: string;
}

export interface CivilianStatusInput {
  role: string;
  description: string;
}

export interface CreateCivilianStatusVars {
  input: CivilianStatusInput;
}

export interface UpdateCivilianStatusVars {
  id: string;
  input: CivilianStatusInput;
}

export interface DeleteCivilianStatusVars {
  id: string;
}

export interface CreateOrUpdateCivilianStatusResponse {
  success: boolean;
  message: string;
  civilianStatus: CivilianStatus;
}

export interface DeleteCivilianStatusResponse {
  success: boolean;
  message: string;
}
