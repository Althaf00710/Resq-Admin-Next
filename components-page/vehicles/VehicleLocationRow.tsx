// components/.../VehicleLocationRow.tsx
'use client';

import React, { useMemo } from 'react';
import { useQuery, useSubscription, gql } from '@apollo/client';
import { GoogleMap, MarkerF, InfoWindowF, useJsApiLoader } from '@react-google-maps/api';
import GooLoader from '@/components/ui/Loader';

export const GET_VEHICLE_LOCATION = gql`
  query GetVehicleLocation($id: Int!) {
    rescueVehicleLocationById(id: $id) {
      id
      active
      lastActive
      longitude
      latitude
    }
  }
`;

export const GET_LOCATION_SUBSCRIPTION = gql`
  subscription {
    onVehicleLocationShare {
      id
      active
      lastActive
      longitude
      latitude
    }
  }
`;

type LocationRow = {
  id: number;
  active: boolean;
  latitude: number;
  longitude: number;
  lastActive: string | null;
};

interface VehicleLocationRowProps {
  id: string; // must match the id emitted by the subscription
}

const mapContainerStyle: React.CSSProperties = { width: '100%', height: 280 };

export const VehicleLocationRow: React.FC<VehicleLocationRowProps> = ({ id }) => {
  const numericId = Number(id);

  // 1) All hooks called unconditionally (no returns before this block)
  const { data: queryData, loading, error } = useQuery<{ rescueVehicleLocationById: LocationRow | null }>(
    GET_VEHICLE_LOCATION,
    { variables: { id: numericId }, skip: !Number.isFinite(numericId) }
  );

  const { data: subData } = useSubscription<{ onVehicleLocationShare: LocationRow }>(
    GET_LOCATION_SUBSCRIPTION
  );

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });

  // Custom marker icon from /public/marker.png
  const markerIcon = useMemo(() => {
    if (!isLoaded) return undefined;
    const g = (window as any)?.google?.maps;
    if (!g) return undefined;
    return {
      url: '/marker.png',
      scaledSize: new g.Size(36, 36),
      anchor: new g.Point(18, 36),
    } as google.maps.Icon;
  }, [isLoaded]);

  // 2) Decide location (prefer live if id matches)
  const live = subData?.onVehicleLocationShare;
  const location: LocationRow | null =
    live && Number(live.id) === numericId
      ? live
      : queryData?.rescueVehicleLocationById ?? null;

  // 3) Now render conditionally (after all hooks have been called)
  if (loading) {
    return (
      <div className="p-4 text-center">
        <GooLoader />
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="p-4 text-red-500">
        {error ? error.message : 'Location not available'}
      </div>
    );
  }

  const { latitude, longitude, lastActive, active } = location;
  const center = { lat: latitude, lng: longitude };
  const lastActiveLabel = !active && lastActive ? new Date(lastActive).toLocaleString() : null;

  // Fallback (iframe) if API key missing or loader errored — still keep hooks above
  if (!apiKey || loadError) {
    const gmapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=16`;
    return (
      <div className="p-4">
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <iframe
            key={`${latitude},${longitude}`}
            title="Vehicle Location"
            width="100%"
            height="280"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`}
          />
        </div>
        {!active && lastActiveLabel && (
          <div className="mt-2 text-xs text-gray-700">
            <strong>Last active:</strong> {lastActiveLabel}
          </div>
        )}
        <a
          href={gmapsUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-blue-600 hover:underline text-sm"
        >
          Open in Google Maps
        </a>
      </div>
    );
  }

  return (
    <div className="p-4">
      {!isLoaded ? (
        <div className="p-4 text-center">
          <GooLoader />
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={16}
            options={{
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
              clickableIcons: true,
            }}
          >
            <MarkerF position={center} icon={markerIcon} />
            {!active && lastActiveLabel && (
              <InfoWindowF position={center}>
                <div className="text-xs">
                  <div className="font-semibold">Last active</div>
                  <div>{lastActiveLabel}</div>
                </div>
              </InfoWindowF>
            )}
          </GoogleMap>
        </div>
      )}

      <a
        href={`https://www.google.com/maps?q=${latitude},${longitude}&z=16`}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-block text-blue-600 hover:underline text-sm"
      >
        Open in Google Maps
      </a>
    </div>
  );
};
