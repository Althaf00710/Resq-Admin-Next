'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { GET_CIVILIAN_STATUS_WITH_EMERGENCY } from '@/graphql/queries/civilianStatusQueries';
import {
  CREATE_CIVILIAN_STATUS,
  UPDATE_CIVILIAN_STATUS,
  DELETE_CIVILIAN_STATUS,
} from '@/graphql/mutations/civilianStatusMutations';
import {
  CREATE_EMERGENCY_TO_CIVILIAN_MAPPING,
  DELETE_EMERGENCY_TO_CIVILIAN_MAPPING,
} from '@/graphql/mutations/emergencyToCivilianMutations';

import CivilianStatusForm from '@/components-page/civilian-status/CivilianStatusForm';
import { CivilianStatus } from '@/graphql/types/civilianStatus';
import { EmergencyCategory } from '@/graphql/types/emergencyCategory';
import { CivilianStatusTable } from '@/components-page/civilian-status/CivilianStatusTable';

import AddButton from '@/components/ui/button/AddButton';
import DebouncedSearchBar from '@/components/ui/search/DebouncedSearchBar';
import GooLoader from '@/components/ui/Loader';

interface EmergencyToCivilianLink {
  id: string;
  emergencyCategory: EmergencyCategory;
}

interface CivilianStatusWithLinks extends CivilianStatus {
  emergencyToCivilians: EmergencyToCivilianLink[];
}

export default function CivilianStatusPage() {
  // 1) Component-level hooks first:
  const [searchTerm, setSearchTerm] = useState('');

  const { data, loading, error, refetch } = useQuery<{
    civilianStatuses: CivilianStatusWithLinks[];
  }>(GET_CIVILIAN_STATUS_WITH_EMERGENCY);

  const [createStatus] = useMutation(CREATE_CIVILIAN_STATUS);
  const [updateStatus] = useMutation(UPDATE_CIVILIAN_STATUS);
  const [deleteStatus] = useMutation(DELETE_CIVILIAN_STATUS);
  const [createMapping] = useMutation(CREATE_EMERGENCY_TO_CIVILIAN_MAPPING);
  const [deleteMapping] = useMutation(DELETE_EMERGENCY_TO_CIVILIAN_MAPPING);

  const [isFormOpen, setFormOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<CivilianStatus | null>(null);

  // 2) Hook for derived data must come next:
  const filteredStatuses = useMemo(() => {
    if (!data) return [];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return data.civilianStatuses;
    return data.civilianStatuses.filter(s =>
      s.role.toLowerCase().includes(term) ||
      s.description.toLowerCase().includes(term)
    );
  }, [data, searchTerm]);

  // 3) Now the early returns:
  if (loading) return <GooLoader />;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  // 4) All the event handlers (these can be declared here or inline):
  const openNew = () => {
    setEditingStatus(null);
    setFormOpen(true);
  };
  const openEdit = (status: CivilianStatus) => {
    setEditingStatus(status);
    setFormOpen(true);
  };
  const handleFormSubmit = async (
    vars: { input: { role: string; description: string }; id?: string }
  ) => {
    if ('id' in vars && vars.id) {
      await updateStatus({ variables: { id: +vars.id, input: vars.input } });
    } else {
      await createStatus({ variables: vars });
    }
    await refetch();
    setFormOpen(false);
  };
  const handleDeleteStatus = async (statusId: string) => {
    await deleteStatus({ variables: { id: +statusId } });
    await refetch();
  };
  const handleAddMapping = async (statusId: string, categoryId: string) => {
    await createMapping({
      variables: {
        input: { civilianStatusId: +statusId, emergencyCategoryId: +categoryId },
      },
    });
    await refetch();
  };
  const handleRemoveMapping = async (statusId: string, linkId: string) => {
    await deleteMapping({ variables: { id: +linkId } });
    await refetch();
  };

  // 5) Finally, render
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 items-center">
        <h1 className="text-xl font-semibold">Civilian Statuses</h1>
        <div className="justify-self-center w-full max-w-md">
          <DebouncedSearchBar onSearch={setSearchTerm} placeholder="Search statuses..." />
        </div>
        <div className="justify-self-end">
          <AddButton onClick={openNew} />
        </div>
      </div>

      <CivilianStatusTable
        statuses={filteredStatuses}
        onRemove={handleRemoveMapping}
        onAddMapping={handleAddMapping}
        onEdit={openEdit}
        onDelete={handleDeleteStatus}
      />

      <CivilianStatusForm
        isOpen={isFormOpen}
        initialData={editingStatus || undefined}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
