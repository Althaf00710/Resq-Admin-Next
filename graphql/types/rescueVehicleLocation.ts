export interface RescueVehicleLocation {
  id: string;
  rescueVehicleId: string;
  latitude: number;
  longitude: number;
  location: string;
  active: boolean;
}

export interface HandleRescueVehicleLocationVars {
  input: {
    rescueVehicleId: string;
    latitude: number;
    longitude: number;
    location: string;
  };
}

export interface HandleRescueVehicleLocationResponse {
  success: boolean;
  message: string;
  rescueVehicleLocation: RescueVehicleLocation;
}
