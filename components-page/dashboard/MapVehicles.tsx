/// <reference types="google.maps" />

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Script from 'next/script';
import { gql, useQuery, useSubscription } from '@apollo/client';
import GooLoader from '@/components/ui/Loader';

/**
 * ResQ Admin: MapVehicles
 * - Initial data: query rescueVehicleLocations
 * - Live updates: subscription onVehicleLocationShare
 * - Marker icons from emergencyCategory.icon (Iconify)
 */

// ---------------- GraphQL ----------------
export const RESCUE_VEHICLE_LOCATIONS = gql/* GraphQL */ `
  query Map_RescueVehicleLocations {
    rescueVehicleLocations {
      rescueVehicleId
      longitude
      latitude
      rescueVehicle {
        plateNumber
        code
        rescueVehicleCategory {
          emergencyToVehicles {
            emergencyCategory {
              icon
            }
          }
        }
      }
      active
      address
      lastActive
    }
  }
`;

export const ON_VEHICLE_LOCATION_SHARE = gql/* GraphQL */ `
  subscription Map_OnVehicleLocationShare {
    onVehicleLocationShare {
      rescueVehicleId
      longitude
      latitude
      rescueVehicle {
        plateNumber
        code
        rescueVehicleCategory {
          emergencyToVehicles {
            emergencyCategory { icon }
          }
        }
      }
      active
      address
      lastActive
    }
  }
`;

// ---------------- Types ----------------
interface EmergencyCategory { icon?: string | null }
interface EmergencyToVehicle { emergencyCategory?: EmergencyCategory | null }
interface VehicleMeta {
  plateNumber?: string | null;
  code?: string | null;
  rescueVehicleCategory?: { emergencyToVehicles?: (EmergencyToVehicle | null)[] | null } | null;
}
interface LocationNode {
  rescueVehicleId: string | number;
  longitude: number;
  latitude: number;
  rescueVehicle?: VehicleMeta | null;
  active?: boolean | null;
  address?: string | null;
  lastActive?: string | null;
}
interface LocationsQueryOut { rescueVehicleLocations: LocationNode[] }
interface LocationEventOut { onVehicleLocationShare: LocationNode }

// ---------------- Config ----------------
const STALE_SECONDS = 120;

// Iconify SVG as marker icon (remote SVG URL)
function iconifyUrl(iconName: string, size = 40, grey = false) {
  const base = `https://api.iconify.design/${encodeURIComponent(iconName)}.svg`;
  const colorParam = grey ? `&color=%239ca3af` : '';
  return `${base}?width=${size}&height=${size}${colorParam}`;
}

function timeAgo(iso?: string | null) {
  if (!iso) return '—';
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

// Fallback pin if no icon is available
function fallbackPin(grey = false) {
  const color = grey ? '#9ca3af' : '#ef4444';
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>
    <defs><filter id='s'><feDropShadow dx='0' dy='2' stdDeviation='2' flood-opacity='0.35'/></filter></defs>
    <g filter='url(#s)'>
      <path d='M32 60c10-12 20-20 20-32A20 20 0 0 0 12 28c0 12 10 20 20 32z' fill='${color}'/>
      <circle cx='32' cy='28' r='14' fill='white'/>
      <text x='32' y='33' font-size='16' text-anchor='middle' dominant-baseline='middle'>🚑</text>
    </g>
  </svg>`;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

export default function MapVehicles() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const infoRef = useRef<google.maps.InfoWindow | null>(null);

  // id -> marker
  const markers = useRef<Map<string | number, google.maps.Marker>>(new Map());
  // id -> lastActive ISO
  const lastSeen = useRef<Map<string | number, string | null>>(new Map());
  // id -> cached meta (plate/code/icon)
  const meta = useRef<Map<string | number, VehicleMeta>>(new Map());

  const [search, setSearch] = useState('');
  const [autoFit, setAutoFit] = useState(true);
  const [gReady, setGReady] = useState(false);

  // Initial list
  const { data, loading, error } = useQuery<LocationsQueryOut>(RESCUE_VEHICLE_LOCATIONS, {
    fetchPolicy: 'cache-and-network',
  });

  // Live updates
  useSubscription<LocationEventOut>(ON_VEHICLE_LOCATION_SHARE, {
    onData: ({ data }) => {
      const evt = data.data?.onVehicleLocationShare;
      if (!evt) return;
      meta.current.set(evt.rescueVehicleId, evt.rescueVehicle || {});
      lastSeen.current.set(evt.rescueVehicleId, evt.lastActive || new Date().toISOString());
      upsertMarker(evt.rescueVehicleId, evt.latitude, evt.longitude);
    },
  });

  // Init map
  const onGoogleReady = useCallback(() => {
    if (!mapEl.current) return;
    const g = (window as any).google as typeof google | undefined;
    if (!g?.maps) return;
    mapRef.current = new g.maps.Map(mapEl.current, {
      center: { lat: 7.8731, lng: 80.7718 }, // Sri Lanka
      zoom: 7,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      backgroundColor: '#0b1220',
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#1f2937' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#e5e7eb' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#111827' }] },
        { featureType: 'poi', elementType: 'labels.text', stylers: [{ visibility: 'off' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#334155' }] },
        { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0ea5e9' }] },
      ],
    });
    infoRef.current = new google.maps.InfoWindow();
    setGReady(true);
  }, []);

  // Left-biased fit helper (reserve space on right, so focus shifts left)
  function fitLeftBiased(bounds: google.maps.LatLngBounds) {
    if (!mapRef.current || !mapEl.current) return;

    const w = mapEl.current.clientWidth;
    const isLg = window.matchMedia('(min-width:1024px)').matches;

    // Reserve more space on RIGHT (e.g., dashboard overlay on the right half on lg+)
    const rightReserve = Math.round(w * (isLg ? 0.5 : 0.22));

    mapRef.current.fitBounds(bounds, {
      top: 32,
      bottom: 32,
      left: 32,
      right: rightReserve + 32,
    } as google.maps.Padding);

    // Optional gentle nudge a bit more left after fit completes
    google.maps.event.addListenerOnce(mapRef.current, 'idle', () => {
      const px = Math.round((mapEl.current?.clientWidth || 0) * 0.06); // 6% of width
      mapRef.current!.panBy(-px, 0);
    });
  }

  // Plot initial markers
  useEffect(() => {
    if (!gReady || !mapRef.current) return;
    const nodes = data?.rescueVehicleLocations || [];
    if (!nodes.length) return;

    const bounds = new google.maps.LatLngBounds();
    let any = false;

    for (const n of nodes) {
      meta.current.set(n.rescueVehicleId, n.rescueVehicle || {});
      lastSeen.current.set(n.rescueVehicleId, n.lastActive || null);
      upsertMarker(n.rescueVehicleId, n.latitude, n.longitude);
      bounds.extend(new google.maps.LatLng(n.latitude, n.longitude));
      any = true;
    }

    if (autoFit && any) {
      try { fitLeftBiased(bounds); } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gReady, data, autoFit]);

  // Re-fit on resize if autoFit is on and we have markers
  useEffect(() => {
    if (!gReady) return;
    const handler = () => {
      if (!autoFit || !mapRef.current || !markers.current.size) return;
      const bounds = new google.maps.LatLngBounds();
      markers.current.forEach((m) => {
        const p = m.getPosition();
        if (p) bounds.extend(p);
      });
      fitLeftBiased(bounds);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [gReady, autoFit]);

  // Create or update a marker for a vehicle id
  function upsertMarker(id: string | number, lat: number, lng: number) {
    const g = (window as any).google as typeof google | undefined;
    if (!g?.maps || !mapRef.current) return;

    const m = markers.current.get(id);
    const stale = isStale(lastSeen.current.get(id));

    const vmeta = meta.current.get(id);
    const iconName = firstIcon(vmeta);

    const icon: google.maps.Icon = iconName
      ? { url: iconifyUrl(iconName, 40, stale), scaledSize: new google.maps.Size(40, 40), anchor: new google.maps.Point(20, 20) }
      : { url: fallbackPin(stale), scaledSize: new google.maps.Size(40, 40), anchor: new google.maps.Point(20, 36) };

    if (!m) {
      const marker = new g.maps.Marker({ position: { lat, lng }, map: mapRef.current, icon, optimized: true, title: titleFor(vmeta) });
      marker.addListener('click', () => openInfo(id));
      markers.current.set(id, marker);
    } else {
      smoothMove(m, new g.maps.LatLng(lat, lng));
      m.setIcon(icon);
      m.setTitle(titleFor(vmeta));
      if (!m.getMap()) m.setMap(mapRef.current);
    }
  }

  function titleFor(vmeta?: VehicleMeta) {
    return vmeta?.plateNumber || vmeta?.code || 'Vehicle';
  }

  function openInfo(id: string | number) {
    const g = (window as any).google as typeof google | undefined;
    const marker = markers.current.get(id);
    const v = meta.current.get(id);
    if (!g?.maps || !marker || !infoRef.current) return;

    const last = lastSeen.current.get(id);
    const iconName = firstIcon(v);
    const body = `
      <div class="p-2">
        <div class="font-semibold text-sm">${titleFor(v)}</div>
        ${iconName ? `<div class="text-xs opacity-70">Icon: ${iconName}</div>` : ''}
        <div class="text-xs text-gray-600">Last active: ${timeAgo(last || undefined)}</div>
      </div>
    `;
    infoRef.current.setContent(body);
    infoRef.current.open({ map: mapRef.current!, anchor: marker });
  }

  function isStale(updatedAt?: string | null) {
    if (!updatedAt) return true;
    const secs = (Date.now() - new Date(updatedAt).getTime()) / 1000;
    return secs > STALE_SECONDS;
  }

  function firstIcon(v?: VehicleMeta) {
    const list = v?.rescueVehicleCategory?.emergencyToVehicles || [];
    for (const it of list || []) {
      const icon = it?.emergencyCategory?.icon;
      if (icon) return icon;
    }
    return undefined;
  }

  // Smooth move animation
  function smoothMove(marker: google.maps.Marker, target: google.maps.LatLng) {
    const start = marker.getPosition();
    if (!start) { marker.setPosition(target); return; }
    const frames = 12; let i = 0;
    const step = () => {
      i++; const t = i / frames;
      const lat = start.lat() + (target.lat() - start.lat()) * t;
      const lng = start.lng() + (target.lng() - start.lng()) * t;
      marker.setPosition(new google.maps.LatLng(lat, lng));
      if (i < frames) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Search filter: hide markers that don't match plate/code
  useEffect(() => {
    const q = search.trim().toLowerCase();
    markers.current.forEach((m, id) => {
      const v = meta.current.get(id);
      const hay = `${v?.plateNumber || ''} ${v?.code || ''}`.toLowerCase();
      const visible = !q || hay.includes(q);
      m.setMap(visible ? mapRef.current : null);
    });
  }, [search]);

  // Cleanup
  useEffect(() => {
    return () => {
      markers.current.forEach(m => m.setMap(null));
      markers.current.clear();
      infoRef.current?.close();
    };
  }, []);

  return (
    <div className="relative w-full h-[90vh] rounded-lg overflow-hidden">
      <Script
        id="gmap"
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places&v=weekly`}
        strategy="afterInteractive"
        onLoad={onGoogleReady}
        onError={(e) => console.error('Google Maps JS failed to load', e)}
      />
      <div ref={mapEl} className="absolute inset-0" />

      {/* Controls */}
      <div className="absolute top-3 left-3 z-10">
        <div className="bg-white/85 backdrop-blur-lg rounded-lg shadow p-3 space-y-3 w-72">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Vehicles</div>
            <label className="text-xs flex items-center gap-2 select-none">
              <input type="checkbox" className="accent-black" checked={autoFit} onChange={e => setAutoFit(e.target.checked)} />
              Auto-fit
            </label>
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search plate / code"
            className="w-full text-sm px-3 py-2 rounded-xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          {loading && <GooLoader />}
          {error && <div className="text-xs text-red-600">Failed to load<GooLoader /></div>}
        </div>
      </div>

      {/* Hint */}
      <div className="absolute bottom-3 left-3 z-10">
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow p-2 px-3 text-xs flex items-center gap-3">
          <span>Vehicle Live Locations</span>
        </div>
      </div>
    </div>
  );
}
