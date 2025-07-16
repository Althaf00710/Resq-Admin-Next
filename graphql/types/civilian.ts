export interface Civilian {
  id: string;
  name: string;
  email: string;
  nicNumber: string;
  phoneNumber: string;
  joinedDate: string;
  civilianStatusId: string;
}

export interface CivilianInput {
  name: string;
  email: string;
  nicNumber: string;
  phoneNumber: string;
}

export interface CreateCivilianData {
  createCivilian: {
    success: boolean;
    message: string;
    civilian: Civilian;
  };
}

export interface CreateCivilianVars {
  input: CivilianInput;
}

export interface UpdateCivilianData {
  updateCivilian: {
    success: boolean;
    message: string;
    civilian: Civilian;
  };
}

export interface UpdateCivilianVars {
  id: string;
  input: CivilianInput;
}
