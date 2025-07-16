export interface CivilianLocationInput {
  civilianId: string;
  latitude: number;
  longitude: number;
  location: string;
}

export interface CivilianLocation {
  id: string;
  active: boolean;
  civilianId: string;
  latitude: number;
  longitude: number;
  location: string;
}

export interface HandleCivilianLocationVars {
  input: CivilianLocationInput;
}

export interface HandleCivilianLocationResponse {
  handleCivilianLocation: {
    success: boolean;
    message: string;
    civilianLocation: CivilianLocation;
  };
}
