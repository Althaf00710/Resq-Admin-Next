'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_VEHICLE_CATEGORIES_WITH_EMERGENCY } from '@/graphql/queries/rescueVehicleCategoryQueries';
import {
  CREATE_RESCUE_VEHICLE_CATEGORY,
  UPDATE_RESCUE_VEHICLE_CATEGORY,
  DELETE_RESCUE_VEHICLE_CATEGORY,
} from '@/graphql/mutations/rescueVehicleCategoryMutations';
import {
  CREATE_EMERGENCY_TO_VEHICLE_MAPPING,
  DELETE_EMERGENCY_TO_VEHICLE_MAPPING,
} from '@/graphql/mutations/emergencyToVehicleMutations';

import VehicleCategoryForm from '@/components-page/vehicle-category/VehicleCategoryForm';
import VehicleCategoryTable from '@/components-page/vehicle-category/VehicleCategoryTable';

import AddButton from '@/components/ui/button/AddButton';
import DebouncedSearchBar from '@/components/ui/search/DebouncedSearchBar';
import GooLoader from '@/components/ui/Loader';

export default function VehicleCategoryPage() {
  // 1) hooks at top:
  const [searchTerm, setSearchTerm] = useState('');

  const { data, loading, error, refetch } = useQuery<{
    rescueVehicleCategories: {
      id: string;
      name: string;
      emergencyToVehicles: {
        id: string;
        emergencyCategory: { id: string; icon: string; name: string };
      }[];
    }[];
  }>(GET_VEHICLE_CATEGORIES_WITH_EMERGENCY);

  const [createCategory] = useMutation(CREATE_RESCUE_VEHICLE_CATEGORY);
  const [updateCategory] = useMutation(UPDATE_RESCUE_VEHICLE_CATEGORY);
  const [deleteCategory] = useMutation(DELETE_RESCUE_VEHICLE_CATEGORY);

  const [createMapping] = useMutation(CREATE_EMERGENCY_TO_VEHICLE_MAPPING);
  const [deleteMapping] = useMutation(DELETE_EMERGENCY_TO_VEHICLE_MAPPING);

  const [isFormOpen, setFormOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<{ id: string; name: string } | null>(null);

  // 2) derive filtered list *before* any returns:
  const filtered = useMemo(() => {
    if (!data) return [];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return data.rescueVehicleCategories;
    return data.rescueVehicleCategories.filter((c) =>
      c.name.toLowerCase().includes(term)
    );
  }, [data, searchTerm]);

  // 3) now the early returns:
  if (loading) return <GooLoader />;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  // 4) event handlers:
  const openNew = () => {
    setEditingCat(null);
    setFormOpen(true);
  };
  const openEdit = (cat: { id: string; name: string }) => {
    setEditingCat(cat);
    setFormOpen(true);
  };
  const handleFormSubmit = async (vars: { id?: string; input: { name: string } }) => {
    if ('id' in vars && vars.id) {
      await updateCategory({
        variables: { id: parseInt(vars.id, 10), input: vars.input },
      });
    } else {
      await createCategory({ variables: { input: vars.input } });
    }
    await refetch();
    setFormOpen(false);
  };
  const handleDeleteCategory = async (id: string) => {
    await deleteCategory({ variables: { id: parseInt(id, 10) } });
    await refetch();
  };
  const handleAddMapping = async (catId: string, emergencyId: string) => {
    await createMapping({
      variables: {
        input: {
          vehicleCategoryId: parseInt(catId, 10),
          emergencyCategoryId: parseInt(emergencyId, 10),
        },
      },
    });
    await refetch();
  };
  const handleRemoveMapping = async (catId: string, linkId: string) => {
    await deleteMapping({ variables: { id: parseInt(linkId, 10) } });
    await refetch();
  };

  // 5) render
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 items-center">
        <h1 className="text-xl font-semibold">Vehicle Categories</h1>
        <div className="justify-self-center w-full max-w-md">
          <DebouncedSearchBar
            placeholder="Search categories..."
            onSearch={setSearchTerm}
          />
        </div>
        <div className="justify-self-end">
          <AddButton onClick={openNew} />
        </div>
      </div>

      <VehicleCategoryTable
        categories={filtered}
        onEdit={openEdit}
        onDelete={handleDeleteCategory}
        onAddMapping={handleAddMapping}
        onRemoveMapping={handleRemoveMapping}
      />

      <VehicleCategoryForm
        isOpen={isFormOpen}
        initialData={editingCat ?? undefined}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
