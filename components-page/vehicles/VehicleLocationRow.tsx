'use client';

import React from 'react';
import { useQuery, gql } from '@apollo/client';
import GooLoader from '@/components/ui/Loader';

export const GET_VEHICLE_LOCATION = gql`
  query GetVehicleLocation($vehicleId: Int!) {
    vehicleLocation(vehicleId: $vehicleId) {
      latitude
      longitude
      timestamp
    }
  }
`;

interface VehicleLocationRowProps {
  vehicleId: string;
}

export const VehicleLocationRow: React.FC<VehicleLocationRowProps> = ({ vehicleId }) => {
  const { data, loading, error } = useQuery<{
    vehicleLocation: {
      latitude: number;
      longitude: number;
      timestamp: string;
    }
  }>(GET_VEHICLE_LOCATION, {
    variables: { vehicleId },
  });

  if (loading) {
    return (
      <div className="p-4 text-center">
        <GooLoader />
      </div>
    );
  }

  if (error || !data?.vehicleLocation) {
    return (
      <div className="p-4 text-red-500">
        {error ? error.message : 'Location not available'}
      </div>
    );
  }

  const { latitude, longitude, timestamp } = data.vehicleLocation;

  return (
    <div className="p-4 grid grid-cols-1 gap-2 md:grid-cols-3">
      <div><strong>Latitude:</strong> {latitude}</div>
      <div><strong>Longitude:</strong> {longitude}</div>
      <div>
        <strong>Last updated:</strong>{' '}
        {new Date(timestamp).toLocaleString()}
      </div>
    </div>
  );
};
