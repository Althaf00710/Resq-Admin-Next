'use client';

import React from 'react';
import { Ban, CheckCircle2 } from 'lucide-react';
import { Civilian } from '@/graphql/types/civilian';

interface CiviliansTableProps {
  civilians: Civilian[];
  onRestrictToggle?: (civilian: Civilian, nextState: boolean) => void;
}

const CiviliansTable: React.FC<CiviliansTableProps> = ({ civilians, onRestrictToggle }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-300 text-left text-gray-800">
          <tr>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Role</th>
            <th className="px-4 py-3 font-semibold">Email</th>
            <th className="px-4 py-3 font-semibold">Phone</th>
            <th className="px-4 py-3 font-semibold">NIC</th>
            <th className="px-4 py-3 font-semibold">Joined Date</th>
            <th className="px-4 py-3 text-center font-semibold">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {civilians.map((civ) => {
            const nextState = !civ.isRestrict;
            return (
              <tr key={civ.id} className="bg-gray-50 hover:bg-gray-100">
                <td className="px-4 py-2 font-medium">{civ.name}</td>
                <td className="px-4 py-2 text-gray-800">{civ.civilianStatus?.role ?? '-'}</td>
                <td className="px-4 py-2 text-gray-600">{civ.email}</td>
                <td className="px-4 py-2 text-gray-600">{civ.phoneNumber}</td>
                <td className="px-4 py-2 text-gray-600">{civ.nicNumber}</td>

                <td className="px-4 py-2 text-gray-600">
                  {new Date(civ.joinedDate).toLocaleDateString()}
                </td>

                {/* Action: Restrict / Unrestrict */}
                <td className="px-1 py-2">
                  <div className="flex items-center justify-center">
                    {civ.isRestrict ? (
                      <button
                        type="button"
                        onClick={() => onRestrictToggle?.(civ, nextState)}
                        className="inline-flex items-center gap-2 rounded-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white border border-green-300 transition cursor-pointer"
                        title="Unrestrict this civilian"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="font-medium">Unrestrict</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onRestrictToggle?.(civ, nextState)}
                        className="inline-flex items-center gap-2 rounded-full px-5 py-2 bg-red-500 hover:bg-red-700 text-white border border-red-300 transition cursor-pointer"
                        title="Restrict this civilian"
                      >
                        <Ban className="w-4 h-4" />
                        <span className="font-medium">Restrict</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}

          {civilians.length === 0 && (
            <tr>
              <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                No civilians found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CiviliansTable;
