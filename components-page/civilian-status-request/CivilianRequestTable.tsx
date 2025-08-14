'use client';

import React, { useState, useEffect } from 'react';
import { Eye, X, CheckCircle2, XCircle } from 'lucide-react';
import HeaderSelect, { HeaderOption } from '@/components/ui/select/HeaderSelect';
import { CivilianStatusRequest } from '@/graphql/types/civilianStatusRequest';

interface CivilianRequestTableProps {
  requests: CivilianStatusRequest[];
  statusFilter: string; // '', 'Pending', 'Approved', 'Rejected'
  onStatusFilterChange: (v: string) => void;
  onApprove?: (req: CivilianStatusRequest) => void;
  onReject?: (req: CivilianStatusRequest) => void;
}

const statusOptions: HeaderOption[] = [
  { value: '',         label: 'All',      colorClass: 'bg-gray-400'  },
  { value: 'Pending',  label: 'Pending',  colorClass: 'bg-yellow-500' },
  { value: 'Approved', label: 'Approved', colorClass: 'bg-green-500' },
  { value: 'Rejected', label: 'Rejected', colorClass: 'bg-red-500'   },
];

const statusStyles: Record<'Pending' | 'Approved' | 'Rejected', string> = {
  Pending:  'text-yellow-700 bg-yellow-100',
  Approved: 'text-green-700  bg-green-100',
  Rejected: 'text-red-700    bg-red-100',
};

const BASE_URL = (process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/+$/, '');

const resolveUrl = (u?: string | null) => {
  if (!u) return '';
  if (/^(https?:|blob:|data:)/i.test(u)) return u;
  const path = u.replace(/^\/+/, '');
  if (BASE_URL) return `${BASE_URL}/${path}`;
  if (typeof window !== 'undefined') return `${window.location.origin}/${path}`;
  return `/${path}`;
};

const formatReceived = (iso?: string | null) => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '-';
  const m = d.getUTCMonth() + 1;      
  const day = d.getUTCDate();         
  const y = d.getUTCFullYear();
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${m}/${day}/${y} ${hh}:${mm}`;
};

const CivilianRequestTable: React.FC<CivilianRequestTableProps> = ({
  requests,
  statusFilter,
  onStatusFilterChange,
  onApprove,
  onReject,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPreviewUrl(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-300 text-left text-gray-800">
            <tr>
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">Civilian Name</th>
              <th className="px-4 py-3 font-semibold">Requested Status</th>
              <th className="px-4 py-3 font-semibold">Created</th>
              <th className="px-4 py-3 font-semibold">Updated</th>

              {/* Status (filter) header */}
              <th className="px-4 py-3 text-center">
                <HeaderSelect
                  options={statusOptions}
                  selectedValue={statusFilter}
                  onChange={onStatusFilterChange}
                  buttonLabel="Status"
                />
              </th>

              <th className="px-4 py-3 text-center font-semibold">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {requests.map((req) => {
              const hasProof = !!req.proofImage;
              const absoluteProof = hasProof ? resolveUrl(req.proofImage!) : '';
              const st = (req.status as 'Pending' | 'Approved' | 'Rejected') ?? 'Pending';

              const currentRole = req.civilian?.civilianStatus?.role ?? '-'; // CURRENT status of the civilian
              const requestedRole = req.civilianStatus?.role ?? '-';         // REQUESTED status (from this request)

              return (
                <tr key={req.id} className="bg-gray-50 hover:bg-gray-100">
                  <td className="px-4 py-2 font-medium">{req.id}</td>

                  {/* Name + CURRENT civilian status (below) */}
                  <td className="px-4 py-2 text-gray-800">
                    <div className="font-medium">{req.civilian?.name ?? '-'}</div>
                    <div className="mt-1">
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-1 py-0.5 rounded-full">
                        {currentRole}
                      </span>
                    </div>
                  </td>

                  {/* REQUESTED civilian status (column) */}
                  <td className="px-4 py-2 text-gray-800 font-bold">{requestedRole}</td>

                  <td className="px-4 py-2 text-gray-600">{formatReceived(req.createdAt)}</td>
                  <td className="px-4 py-2 text-gray-600">{formatReceived(req.updatedAt)}</td>

                  {/* Status badge cell */}
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${statusStyles[st]}`}
                    >
                      {req.status}
                    </span>
                  </td>

                  <td className="px-1 py-2">
                    <div className="flex items-center justify-center gap-2">
                      {/* View Proof */}
                      <button
                        type="button"
                        onClick={() => hasProof && setPreviewUrl(absoluteProof)}
                        className={`inline-flex items-center justify-center rounded-full p-2 border transition ${
                          hasProof
                            ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-300 cursor-pointer'
                            : 'bg-gray-300 text-gray-500 border-gray-200 cursor-not-allowed'
                        }`}
                        title={hasProof ? 'View proof image' : 'No proof image'}
                        aria-label="View proof"
                        disabled={!hasProof}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Approve / Reject (only for Pending) */}
                      {st === 'Pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => onApprove?.(req)}
                            className="inline-flex items-center justify-center rounded-full p-2 border bg-green-600 hover:bg-green-700 text-white border-green-300 transition"
                            title="Approve"
                            aria-label="Approve"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onReject?.(req)}
                            className="inline-flex items-center justify-center rounded-full p-2 border bg-red-600 hover:bg-red-700 text-white border-red-300 transition"
                            title="Reject"
                            aria-label="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {requests.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Proof Image Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="w-full max-w-3xl rounded-xl bg-white shadow-xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-1">
              <h3 className="text-sm font-semibold text-gray-800">Proof Image</h3>
              <button
                className="rounded-full p-1 text-gray-600 hover:bg-gray-100 cursor-pointer"
                onClick={() => setPreviewUrl(null)}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 py-3">
              <div className="flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Proof"
                  className="max-h-[70vh] w-auto rounded-lg border border-gray-200 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CivilianRequestTable;
