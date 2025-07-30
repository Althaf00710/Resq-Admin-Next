'use client';

import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';

import { EmergencySelect } from '@/components/ui/select/EmergencySelect';
import { EmergencyButton } from '@/components/ui/button/EmergencyButton';
import EditButton from '@/components/ui/button/EditButton';
import DeleteButton from '@/components/ui/button/DeleteButton';
import { CivilianStatus } from '@/graphql/types/civilianStatus';
import { EmergencyCategory } from '@/graphql/types/emergencyCategory';
import { GET_UNMAPPED_EMERGENCY_TO_CIVILIAN } from '@/graphql/queries/emergencyCategoryQueries';

interface EmergencyToCivilianLink {
  id: string;
  emergencyCategory: EmergencyCategory;
}

export interface CivilianStatusWithLinks extends CivilianStatus {
  emergencyToCivilians: EmergencyToCivilianLink[];
}

interface CivilianStatusTableProps {
  statuses: CivilianStatusWithLinks[];
  onRemove: (statusId: string, linkId: string) => Promise<void>;
  onAddMapping: (statusId: string, categoryId: string) => Promise<void>;
  onEdit: (status: CivilianStatus) => void;
  onDelete: (statusId: string) => void;
}

export const CivilianStatusTable: React.FC<CivilianStatusTableProps> = ({
  statuses,
  onRemove,
  onAddMapping,
  onEdit,
  onDelete,
}) => {
  // Single lazy query for fetching unmapped categories
  const [fetchUnmapped, { loading }] = useLazyQuery<
    { unmappedEmergencyToCivilian: EmergencyCategory[] },
    { civilianStatusId: number }
  >(GET_UNMAPPED_EMERGENCY_TO_CIVILIAN, { fetchPolicy: 'network-only' });

  // Store per-statusId options in a map
  const [optionsMap, setOptionsMap] = useState<Record<string, EmergencyCategory[]>>({});

  // Helper to fetch & store unmapped for one status
  const reloadFor = async (statusId: string) => {
    const { data } = await fetchUnmapped({
      variables: { civilianStatusId: +statusId },
    });
    setOptionsMap(prev => ({
      ...prev,
      [statusId]: data?.unmappedEmergencyToCivilian ?? [],
    }));
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm overflow-visible">
      <table className="min-w-full divide-y divide-gray-200 text-sm overflow-x-auto">
        <colgroup>
            <col className="w-1/10" />    
            <col className="w-4/10" />    {/* Description */}
            <col className="w-4/10" />    {/* Emergency Categories */}
            <col className="w-1/10" />    {/* Actions */}
          </colgroup>
        <thead className="bg-gray-300 text-left text-gray-800">
          <tr>
            <th className="px-4 py-3 font-semibold">Role</th>
            <th className="px-4 py-3 font-semibold">Description</th>
            <th className="px-4 py-3 font-semibold">Emergency Categories</th>
            <th className="px-4 py-3 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {statuses.map(status => {
            const opts = optionsMap[status.id] || [];
            const isLoading = loading && opts.length === 0;

            return (
              <React.Fragment key={status.id}>
                <tr className="bg-gray-50 hover:bg-gray-100">
                  <td className="px-4 py-2 text-gray-900 font-medium align-top">
                    {status.role}
                  </td>
                  <td className="px-4 py-2 text-gray-700 align-top">
                    {status.description}
                  </td>
                  <td className="px-4 py-2 align-top">
                    {/* existing mappings */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {status.emergencyToCivilians.map(link => (
                        <EmergencyButton
                          key={link.id}
                          category={link.emergencyCategory}
                          onRemove={async () => {
                            await onRemove(status.id, link.id);
                            await reloadFor(status.id);
                          }}
                        />
                      ))}
                    </div>

                    {/* select new mapping */}
                    <EmergencySelect
                      statusId={status.id}
                      options={opts}
                      loading={isLoading}
                      onOpen={() => reloadFor(status.id)}
                      onAdd={async (_statusId, catId) => {
                        await onAddMapping(status.id, catId);
                        await reloadFor(status.id);
                      }}
                      label='+ Add Category'
                    />
                  </td>
                  <td className="px-4 py-2 text-center align-top">
                    <div className="flex justify-center gap-2">
                      <EditButton onClick={() => onEdit(status)} label=''/>
                      <DeleteButton onClick={() => onDelete(status.id)} label=''/>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
