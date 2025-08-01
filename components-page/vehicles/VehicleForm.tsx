// components-page/vehicles/VehicleForm.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

import ValidatedInput from '@/components/ui/input/ValidatedInput';
import ColoredSelect, { Option } from '@/components/ui/select/ColoredSelect';
import { GET_RESCUE_VEHICLE_CATEGORIES } from '@/graphql/queries/rescueVehicleCategoryQueries';
import {
  RescueVehicleCategory,
} from '@/graphql/types/rescueVehicleCategory';
import {
  Vehicle,
  CreateRescueVehicleVars,
  UpdateRescueVehicleVars,
} from '@/graphql/types/rescueVehicle';

interface Props {
  isOpen: boolean;
  initialData?: Vehicle;
  onClose: () => void;
  onSubmit: (data: CreateRescueVehicleVars | UpdateRescueVehicleVars) => void;
}

export default function VehicleForm({
  isOpen,
  initialData,
  onClose,
  onSubmit,
}: Props) {
  // form state
  const [plateNumber, setPlateNumber] = useState('');
  const [password, setPassword] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');

  // load categories
  const { data, loading } = useQuery<{
    rescueVehicleCategories: RescueVehicleCategory[];
  }>(GET_RESCUE_VEHICLE_CATEGORIES);

  // map to select options
  const categoryOptions: Option[] = data?.rescueVehicleCategories.map(c => ({
    value: c.id,
    label: c.name,
    color: 'bg-blue-100 text-white'
  })) || [];

  // sync initialData into form on open/edit
  useEffect(() => {
    if (initialData) {
      setPlateNumber(initialData.plateNumber);
      setPassword(''); // password is write-only
      setCategoryId(initialData.rescueVehicleCategory.id);
    } else {
      setPlateNumber('');
      setPassword('');
      setCategoryId('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (!plateNumber.trim() || !categoryId || (!initialData && !password)) {
      return;
    }

    // creating vs updating
    if (initialData?.id) {
      const vars: UpdateRescueVehicleVars = {
        id: initialData.id,
        input: {
          plateNumber: plateNumber.trim(),
          // only send password if provided
          ...(password.trim() ? { password: password.trim() } : {}),
          status: initialData.status, // preserve
        },
      };
      onSubmit(vars);
    } else {
      const vars: CreateRescueVehicleVars = {
        input: {
          plateNumber: plateNumber.trim(),
          password: password.trim(),
          rescueVehicleCategoryId: categoryId,
        },
      };
      onSubmit(vars);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-sm space-y-4">
        <h2 className="text-xl text-center">
          {initialData ? 'Edit Vehicle' : 'New Vehicle'}
        </h2>

        <ValidatedInput
          label="Plate Number"
          value={plateNumber}
          onChange={e => setPlateNumber(e.target.value)}
          required
        />

        <ColoredSelect
          label="Vehicle Category"
          value={categoryId}
          options={categoryOptions}
          onChange={setCategoryId}
          placeholder={loading ? 'Loading...' : 'Select category'}
        />

        <ValidatedInput
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required={!initialData} // required on create, optional on edit
        />

        <div className="flex justify-end space-x-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-full border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !plateNumber.trim() ||
              !categoryId ||
              (!initialData && !password.trim())
            }
            className="px-4 py-2 text-sm rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition"
          >
            {initialData ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
