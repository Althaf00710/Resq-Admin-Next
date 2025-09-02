'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gql, useQuery } from '@apollo/client';
import { Eye } from 'lucide-react';
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

const short4 = (id: number | string) => {
  const s = String(id);
  const last = s.slice(-4);
  return last.padStart(4, '0');
};

const fmtDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString() : '—';

const STATUS_OPTIONS: HeaderOption[] = [
  { value: '',            label: 'All',        colorClass: 'bg-gray-400'   },
  { value: 'Searching',   label: 'Searching',  colorClass: 'bg-sky-400'    },
  { value: 'Dispatched',  label: 'Dispatched', colorClass: 'bg-indigo-400' },
  { value: 'Arrived',     label: 'Arrived',    colorClass: 'bg-emerald-400'},
  { value: 'Completed',   label: 'Completed',  colorClass: 'bg-green-500'  },
  { value: 'Cancelled',   label: 'Cancelled',  colorClass: 'bg-rose-500'   },
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

export default function RequestsTable({ searchQuery = '' }: { searchQuery?: string }) {
  const { data, loading, error } = useQuery(Q_REQUESTS, { fetchPolicy: 'cache-and-network' });
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | number | null>(null);


  const rows = (data?.rescueVehicleRequests ?? []) as Array<any>;

  const filtered = useMemo(() => {
    let arr = rows;

    // status filter
    if (statusFilter) {
      arr = arr.filter(r => String(r.status) === statusFilter);
    }

    // ID search (supports partial, full, or last-4)
    const qDigits = (searchQuery || '').trim().replace(/\D/g, '');
    if (qDigits) {
      arr = arr.filter(r => {
        const idStr = String(r.id);
        return idStr.includes(qDigits) || short4(idStr).includes(qDigits);
      });
    }

    return arr;
  }, [rows, statusFilter, searchQuery]);

  const toggle = (id: number) => setExpandedId(prev => (prev === id ? null : id));

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
            <th className="px-4 py-3 text-left font-semibold">Subcategory</th>
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

        <tbody className="bg-white divide-y divide-gray-200">
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

                  <td className="px-4 py-2 flex items-center gap-2">
                    {iconName ? (
                      <img
                        src={ICONIFY(iconName, 22)}
                        alt=""
                        width={22}
                        height={22}
                        className="shrink-0"
                      />
                    ) : (
                      <span className="w-[22px] h-[22px] rounded-full bg-slate-200 inline-block" />
                    )}
                    <span className="font-medium">{subName}</span>
                  </td>

                  <td className="px-4 py-2 text-center">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${statusBadgeClass(r.status)}`}>
                      {r.status}
                    </span>
                  </td>

                  <td className="px-4 py-2">{civName}</td>

                  <td className="px-4 py-2">{created}</td>

                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => toggle(id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50"
                    >
                      <Eye className="w-4 h-4" />
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
                      <td colSpan={6} className="p-0 bg-gray-50">
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

// ---------- Expanded Row ----------
function ExpandedRow({ request }: { request: any }) {
  const {
    id,
    status,
    civilian,
    address,
    description,
    proofImageURL,
    latitude,
    longitude,
  } = request || {};

  const isCancelled = String(status || '').toLowerCase() === 'cancelled';

  // Coerce to number for the Int! variable
  const idNum = Number(id);
  const skipAssignments = isCancelled || !Number.isFinite(idNum);

  const { data, loading, error } = useQuery(Q_ASSIGNMENTS, {
    variables: { id: idNum },
    skip: skipAssignments,
    fetchPolicy: 'cache-first',
  });

  const assignments = data?.assignments ?? [];
  const staticMap = GOOGLE_STATIC(latitude, longitude);

  return (
    <div className="p-2">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Location</CardTitle></CardHeader>
          <CardContent>
            {staticMap ? (
              <img src={staticMap} alt="Incident location" className="w-full h-60 object-cover rounded-xl border border-slate-200" />
            ) : (
              <div className="w-full h-60 rounded-xl border border-dashed border-slate-300 grid place-items-center text-slate-500">
                No coordinates available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <DetailRow label="Civilian" value={civilian?.name ?? '-'} />
            <DetailRow label="Phone" value={civilian?.phoneNumber ?? '-'} />
            <DetailRow label="Address" value={address ?? '-'} />
            <DetailRow label="Description" value={description ?? ''} />
            {proofImageURL ? (
              <div className="pt-2">
                <div className="text-xs font-medium text-slate-500 mb-1">Proof Image</div>
                <img src={proofImageURL} alt="Proof" className="w-full max-h-60 object-cover rounded-lg border border-slate-200" />
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader><CardTitle>Assignments</CardTitle></CardHeader>
          <CardContent>
            {isCancelled ? (
              <div className="text-sm text-slate-500">Request is cancelled — no assignments.</div>
            ) : loading ? (
              <SkeletonAssignments />
            ) : error ? (
              <div className="text-sm text-red-600">Failed to load assignments.</div>
            ) : assignments.length === 0 ? (
              <SkeletonAssignments />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {assignments.map((a: any, i: number) => (
                  <div key={i} className="rounded-xl border border-slate-200 p-3">
                    <div className="text-sm font-semibold mb-1">
                      Vehicle: <span className="font-mono">{a.rescueVehicle?.code ?? '—'}</span>
                    </div>
                    <div className="text-xs text-slate-600">Assigned: {fmtDate(a.timestamp)}</div>
                    <div className="text-xs text-slate-600">Arrival: {fmtDate(a.arrivalTime)}</div>
                    <div className="text-xs text-slate-600">Departure: {fmtDate(a.departureTime)}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <span className="text-xs font-medium text-slate-500 mr-2">{label}:</span>
      <span className="text-slate-800">{value}</span>
    </div>
  );
}

function SkeletonAssignments() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {[0, 1, 2].map(i => (
        <div key={i} className="rounded-xl border border-slate-200 p-3 animate-pulse">
          <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
          <div className="h-3 w-40 bg-slate-200 rounded mb-1.5" />
          <div className="h-3 w-36 bg-slate-200 rounded mb-1.5" />
          <div className="h-3 w-28 bg-slate-200 rounded" />
        </div>
      ))}
    </div>
  );
}
