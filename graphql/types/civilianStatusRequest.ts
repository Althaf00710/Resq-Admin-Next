export interface CivilianStatusRequest {
  id: number | string;
  status: string;
  createdAt: string; 
  updatedAt: string; 
  civilianStatus?: { id: number | string; role: string | null } | null;
  civilian?: { id: number | string; name: string | null; civilianStatus: {role: string} } | null;
  proofImage?: string | null; 
}

export interface CreateCivilianStatusRequestVars {
  id?: string;
  input: {
    status: string;
    civilianId: string;
    civilianStatusId: string;
  };
  proofPicture?: File;
}

export interface UpdateCivilianStatusRequestVars {
  id: string;
  input: {
    status: string;
  };
}

export interface CivilianStatusRequestResponse {
  success: boolean;
  message: string;
  civilianStatusRequest: CivilianStatusRequest;
}
