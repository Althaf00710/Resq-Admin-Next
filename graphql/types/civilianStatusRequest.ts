export interface CivilianStatusRequest {
  id: string;
  status: string;
  civilianId: string;
  civilianStatusId: string;
  proofImage: string;
  createdAt: string;
  updatedAt: string;
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
