'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gql, useQuery } from '@apollo/client';
import {
  Eye,
  MapPin,
  CalendarClock,
  FileImage,
  Phone,
  User as UserIcon,
  ExternalLink,
  Siren,
  Ambulance,    // ← NEW
  Clock,        // ← NEW
  NotepadText,
} from 'lucide-react';

import HeaderSelect, { HeaderOption } from '@/components/ui/select/HeaderSelect';
import { Card, CardContent, CardHeader, CardTitle } from '@/components-page/dashboard/Card';

const Q_REQUESTS = gql`
  query RequestsTable {
    rescueVehicleRequests {
      id
      emergencySubCategory {
        name
        emergencyCategory { icon }
      }
      status
      createdAt
      civilian { name phoneNumber }
      description
      proofImageURL
      longitude
      latitude
      address
    }
  }
`;

const Q_ASSIGNMENTS = gql`
  query AssignmentsByRequest($id: Int!) {
    assignments(where: { rescueVehicleRequestId: { eq: $id } }) {
      arrivalTime
      departureTime
      timestamp
      rescueVehicle { code }
    }
  }
`;

const ICONIFY = (name?: string | null, size = 22) =>
  name ? `https://api.iconify.design/${encodeURIComponent(name)}.svg?width=${size}&height=${size}` : '';

const GOOGLE_STATIC = (lat?: number | null, lng?: number | null, w = 640, h = 240) => {
  if (lat == null || lng == null) return '';
  const key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const marker = `markers=color:red|${lat},${lng}`;
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=${w}x${h}&maptype=roadmap&${marker}&key=${key}`;
};

const resolveImageUrl = (u?: string | null) => {
  if (!u) return '';
  if (/^https?:\/\//i.test(u)) return u;
  const base = (process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/+$/, '');
  const path = String(u).replace(/^\/+/, '');
  return `${base}/${path}`;
};

const short4 = (id: number | string) => {
  const s = String(id);
  const last = s.slice(-4);
  return last.padStart(4, '0');
};

export function fmtDate(
  iso?: string | null,
  tz: 'local' | string = 'UTC' // ← change default to 'Asia/Colombo' if you prefer
) {
  if (!iso) return '—';

  // If the string has no offset/Z, treat it as UTC to avoid accidental local parsing
  const safe = /[zZ]|[+\-]\d{2}:\d{2}$/.test(iso) ? iso : iso + 'Z';

  const opts: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    // omit timeZoneName to avoid showing GMT/+05:30 text
  };

  return new Intl.DateTimeFormat(
    undefined,
    tz === 'local' ? opts : { ...opts, timeZone: tz }
  ).format(new Date(safe));
}

const STATUS_OPTIONS: HeaderOption[] = [
  { value: '',            label: 'All',       colorClass: 'bg-gray-400'   },
  { value: 'Searching',   label: 'Searching', colorClass: 'bg-sky-400'    },
  { value: 'Dispatched',  label: 'Dispatch',  colorClass: 'bg-indigo-400' },
  { value: 'Arrived',     label: 'Arrived',   colorClass: 'bg-emerald-200'},
  { value: 'Completed',   label: 'Complete',  colorClass: 'bg-green-500'  },
  { value: 'Cancelled',   label: 'Cancelled', colorClass: 'bg-rose-500'   },
];

const statusBadgeClass = (status?: string) => {
  switch ((status || '').toLowerCase()) {
    case 'searching':  return 'bg-sky-100 text-sky-800';
    case 'dispatched': return 'bg-indigo-100 text-indigo-800';
    case 'arrived':    return 'bg-emerald-100 text-emerald-800';
    case 'completed':  return 'bg-green-100 text-green-800';
    case 'cancelled':  return 'bg-rose-100 text-rose-800';
    default:           return 'bg-slate-100 text-slate-700';
  }
};

// robust sort timestamp
const toReqTs = (r: any) => {
  const t = Date.parse(r?.createdAt ?? '');
  if (!Number.isNaN(t)) return t;
  const idNum = Number(r?.id);
  return Number.isFinite(idNum) ? idNum : 0;
};

export default function RequestsTable({ searchQuery = '' }: { searchQuery?: string }) {
  const { data, loading, error } = useQuery(Q_REQUESTS, { fetchPolicy: 'cache-and-network' });
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  const rows = (data?.rescueVehicleRequests ?? []) as Array<any>;

  const filtered = useMemo(() => {
    let arr = [...rows];

    if (statusFilter) {
      arr = arr.filter((r) => String(r.status) === statusFilter);
    }

    const qDigits = (searchQuery || '').trim().replace(/\D/g, '');
    if (qDigits) {
      arr = arr.filter((r) => {
        const idStr = String(r.id);
        return idStr.includes(qDigits) || short4(idStr).includes(qDigits);
      });
    }

    // newest first
    arr.sort((a, b) => toReqTs(b) - toReqTs(a));
    return arr;
  }, [rows, statusFilter, searchQuery]);

  const toggle = (id: number) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <colgroup>
          <col className="w-[8%]" />
          <col className="w-[28%]" />
          <col className="w-[16%]" />
          <col className="w-[24%]" />
          <col className="w-[16%]" />
          <col className="w-[8%]" />
        </colgroup>

        <thead className="bg-gray-100 text-gray-800">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">ID</th>
            <th className="px-4 py-3 text-left font-semibold">Emergency</th>
            <th className="px-4 py-3 text-center font-semibold">
              <HeaderSelect
                options={STATUS_OPTIONS}
                selectedValue={statusFilter}
                onChange={setStatusFilter}
                buttonLabel="Status"
              />
            </th>
            <th className="px-4 py-3 text-left font-semibold">Civilian</th>
            <th className="px-4 py-3 text-left font-semibold">Created At</th>
            <th className="px-4 py-3 text-center font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {loading && (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-slate-500">Loading requests…</td>
            </tr>
          )}
          {error && (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-red-600">Failed to load requests.</td>
            </tr>
          )}

          {!loading && !error && filtered.map((r) => {
            const id = r.id as number;
            const subName = r.emergencySubCategory?.name ?? '—';
            const iconName = r.emergencySubCategory?.emergencyCategory?.icon ?? '';
            const civName = r.civilian?.name ?? '—';
            const created = fmtDate(r.createdAt);

            return (
              <React.Fragment key={id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-semibold tabular-nums">{short4(id)}</td>

                  <td className="flex items-center gap-2 px-4 py-2">
                    {iconName ? (
                      <img
                        src={ICONIFY(iconName, 22)}
                        alt=""
                        width={22}
                        height={22}
                        className="shrink-0"
                      />
                    ) : (
                      <span className="inline-block h-[22px] w-[22px] rounded-full bg-slate-200" />
                    )}
                    <span className="font-medium">{subName}</span>
                  </td>

                  <td className="px-4 py-2 text-center">
                    <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${statusBadgeClass(r.status)}`}>
                      {r.status}
                    </span>
                  </td>

                  <td className="px-4 py-2">{civName}</td>

                  <td className="px-4 py-2 text-[13px] font-light">{created}</td>

                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => toggle(id)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-xs text-white font-semibold hover:bg-blue-600 bg-blue-500 transition-all cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  </td>
                </tr>

                <AnimatePresence>
                  {expandedId === id && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <td colSpan={6} className="bg-gray-50 p-0">
                        <ExpandedRow request={r} />
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            );
          })}

          {!loading && !error && filtered.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-slate-500">No matching requests.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------- Expanded Row (prettier) -------------------- */

function ExpandedRow({ request }: { request: any }) {
  const {
    id,
    status,
    createdAt,
    civilian,
    address,
    description,
    proofImageURL,
    latitude,
    longitude,
    emergencySubCategory,
  } = request || {};

  const isCancelled = String(status || '').toLowerCase() === 'cancelled';

  const idNum = Number(id);
  const skipAssignments = isCancelled || !Number.isFinite(idNum);

  const { data, loading, error } = useQuery(Q_ASSIGNMENTS, {
    variables: { id: idNum },
    skip: skipAssignments,
    fetchPolicy: 'cache-first',
  });

  const assignmentsRaw = data?.assignments ?? [];

  // newest-first for assignments
  const toAssTs = (a: any) =>
    Date.parse(a?.timestamp ?? '') ||
    Date.parse(a?.arrivalTime ?? '') ||
    Date.parse(a?.departureTime ?? '') ||
    0;

  const assignments = [...assignmentsRaw].sort((a, b) => toAssTs(b) - toAssTs(a));

  const staticMap = GOOGLE_STATIC(latitude, longitude);
  const proofUrl = resolveImageUrl(proofImageURL);
  const gmapsLink =
    latitude != null && longitude != null
      ? `https://www.google.com/maps?q=${latitude},${longitude}`
      : undefined;

  return (
    <div className="p-2">
      {/* Top: split 1/2 + 1/2 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Location */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-rose-500" />
              Location
            </CardTitle>
          </CardHeader>

          <CardContent className="relative">
            {staticMap ? (
              <div className="relative">
                <img
                  src={staticMap}
                  alt="Incident location"
                  className="h-64 w-full rounded-xl border border-slate-200 object-cover"
                />

                {/* coords chip */}
                {latitude != null && longitude != null && (
                  <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-slate-700 shadow">
                    {Number(latitude).toFixed(5)}, {Number(longitude).toFixed(5)}
                  </div>
                )}

                {/* open maps */}
                {gmapsLink && (
                  <a
                    href={gmapsLink}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open in Maps
                  </a>
                )}
              </div>
            ) : (
              <div className="grid h-64 w-full place-items-center rounded-xl border border-dashed border-slate-300 text-slate-500">
                No coordinates available
              </div>
            )}

            {/* Vehicle summary or skeleton */}
            {!skipAssignments && (
              <div className="mt-3 rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="mb-2 h-4 w-32 rounded bg-slate-200" />
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <div className="h-3 w-40 rounded bg-slate-200" />
                      <div className="h-3 w-36 rounded bg-slate-200" />
                      <div className="h-3 w-32 rounded bg-slate-200" />
                    </div>
                  </div>
                ) : assignments.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <Ambulance className="h-4 w-4 text-indigo-600" />
                        Vehicle
                      </div>
                      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                        {assignments[0]?.rescueVehicle?.code ?? '—'}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-2 text-xs text-slate-600 sm:grid-cols-3">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" /> Assigned: {fmtDate(assignments[0]?.timestamp)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" /> Arrival: {fmtDate(assignments[0]?.arrivalTime)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" /> Departure: {fmtDate(assignments[0]?.departureTime)}
                      </div>
                    </div>
                  </>
                ) : (
                  // 👇 show the larger skeleton when no vehicle assignment yet
                  <SkeletonAssignments />
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-amber-500" />
                Details
              </span>
              <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${statusBadgeClass(status)}`}>
                {status ?? '—'}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">
            {/* Row 1: Civilian | Phone */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoRow icon={<UserIcon className="h-4 w-4" />} label="Civilian">
                {civilian?.name ?? '—'}
              </InfoRow>
              <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone">
                {civilian?.phoneNumber ? (
                  <a className="underline decoration-dotted" href={`tel:${civilian.phoneNumber}`}>
                    {civilian.phoneNumber}
                  </a>
                ) : (
                  '—'
                )}
              </InfoRow>
            </div>

            {/* Row 2: Subcategory | Created */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoRow icon={<Siren className="h-4 w-4" />} label="Emergency">
                {emergencySubCategory?.name ?? '—'}
              </InfoRow>
              <InfoRow icon={<CalendarClock className="h-4 w-4" />} label="Created">
                {fmtDate(createdAt)}
              </InfoRow>
            </div>

            {/* Address (full width) */}
            <InfoRow icon={<MapPin className="h-4 w-4" />} label="Address">
              <span className="line-clamp-2">{address ?? '—'}</span>
            </InfoRow>

            {/* Description */}
            {description ? (
              <InfoRow icon={<NotepadText className="invisible h-4 w-4" />} label="Description">
                {description}
              </InfoRow>
            ) : null}

            {/* Proof */}
            {proofUrl ? (
              <div>
                <div className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-500">
                  <FileImage className="h-4 w-4" />
                  Proof Image
                </div>
                <img
                  src={proofUrl}
                  alt="Proof"
                  className="max-h-56 w-full rounded-lg border border-slate-200 object-cover"
                />
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


/* ---------- small helpers ---------- */

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-700">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-xs font-medium text-slate-500">{label}</div>
        <div className="text-slate-800">{children}</div>
      </div>
    </div>
  );
}

function SkeletonAssignments() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="animate-pulse rounded-xl border border-slate-200 p-3">
          <div className="mb-2 h-4 w-32 rounded bg-slate-200" />
          <div className="mb-1.5 h-3 w-40 rounded bg-slate-200" />
          <div className="mb-1.5 h-3 w-36 rounded bg-slate-200" />
          <div className="h-3 w-28 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}
