'use client';

import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import clsx from 'clsx';

import { EmergencyButton } from '@/components/ui/button/EmergencyButton';
import { EmergencySelect } from '@/components/ui/select/EmergencySelect';
import EditButton from '@/components/ui/button/EditButton';
import DeleteButton from '@/components/ui/button/DeleteButton';

import { EmergencyCategory } from '@/graphql/types/emergencyCategory';
import { GET_UNMAPPED_EMERGENCY_TO_VEHICLE } from '@/graphql/queries/emergencyCategoryQueries';

interface VehicleCategory {
  id: string;
  name: string;
  emergencyToVehicles: Array<{
    id: string;
    emergencyCategory: EmergencyCategory;
  }>;
}

interface Props {
  categories: VehicleCategory[];
  onEdit: (cat: { id: string; name: string }) => void;
  onDelete: (id: string) => void;
  onAddMapping: (catId: string, emergencyId: string) => Promise<void>;
  onRemoveMapping: (catId: string, linkId: string) => Promise<void>;
}

export default function VehicleCategoryTable({
  categories,
  onEdit,
  onDelete,
  onAddMapping,
  onRemoveMapping,
}: Props) {
  const [fetchUnmapped, { loading }] = useLazyQuery<
    { unmappedEmergencyToVehicle: EmergencyCategory[] },
    { vehicleCategoryId: number }
  >(GET_UNMAPPED_EMERGENCY_TO_VEHICLE, { fetchPolicy: 'network-only' });

  const [optionsMap, setOptionsMap] = useState<Record<string, EmergencyCategory[]>>({});

  const reloadFor = async (catId: string) => {
    const { data } = await fetchUnmapped({
      variables: { vehicleCategoryId: +catId },
    });
    setOptionsMap((m) => ({
      ...m,
      [catId]: data?.unmappedEmergencyToVehicle ?? [],
    }));
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm overflow-visible">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <colgroup>
          <col className="w-1/4" />
          <col className="w-1/2" />
          <col className="w-1/4" />
        </colgroup>
        <thead className="bg-gray-300 text-left text-gray-800">
          <tr>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Emergency Categories</th>
            <th className="px-4 py-3 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {categories.map((cat, idx) => {
            const opts = optionsMap[cat.id] ?? [];
            const isLoading = loading && opts.length === 0;
            const isLast = idx === categories.length - 1;

            return (
              <tr key={cat.id} className="bg-gray-50 hover:bg-gray-100">
                <td
                  className={clsx(
                    'px-4 py-2 align-top font-medium text-gray-900',
                    isLast && 'pb-24'
                  )}
                >
                  {cat.name}
                </td>

                <td
                  className={clsx(
                    'px-4 py-2 align-top relative overflow-visible',
                    isLast && 'pb-24'
                  )}
                >
                  <div className="max-w-xs mb-2">
                    <EmergencySelect
                      statusId={cat.id}
                      options={opts}
                      loading={isLoading}
                      onOpen={() => reloadFor(cat.id)}
                      onAdd={async (_, eid) => {
                        await onAddMapping(cat.id, eid);
                        await reloadFor(cat.id);
                      }}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {cat.emergencyToVehicles.map((link) => (
                      <EmergencyButton
                        key={link.id}
                        category={link.emergencyCategory}
                        onRemove={async () => {
                          await onRemoveMapping(cat.id, link.id);
                          await reloadFor(cat.id);
                        }}
                      />
                    ))}
                  </div>
                </td>

                <td
                  className={clsx(
                    'px-4 py-2 text-center align-top',
                    isLast && 'pb-24'
                  )}
                >
                  <div className="flex justify-center gap-2">
                    <EditButton onClick={() => onEdit(cat)} />
                    <DeleteButton onClick={() => onDelete(cat.id)} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
