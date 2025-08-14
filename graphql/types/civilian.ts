export interface Civilian {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  nicNumber: string;
  joinedDate: string | Date;
  isRestrict: boolean;
  civilianStatusId: number;
  civilianStatus: {
    id: string;
    role: string;
  };
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

export type RestrictCivilianVars = { id: number };
export type UnrestrictCivilianVars = { id: number };

export type RestrictCivilianResp = {
  restrictCivilian: { success: boolean; message: string };
};
export type UnrestrictCivilianResp = {
  unrestrictCivilian: { success: boolean; message: string };
};