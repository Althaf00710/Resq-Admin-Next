'use client';

import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import ValidatedInput from '@/components/ui/input/ValidatedInput';
import { Truck } from 'lucide-react'; 
import {
  CreateRescueVehicleCategoryVars,
  UpdateRescueVehicleCategoryVars,
  RescueVehicleCategory,
} from '@/graphql/types/rescueVehicleCategory';
import { IS_VEHICLE_CATEGORY_NAME_EXISTS } from '@/graphql/queries/rescueVehicleCategoryQueries';

interface Props {
  isOpen: boolean;
  initialData?: RescueVehicleCategory;
  onClose: () => void;
  onSubmit: (
    data: CreateRescueVehicleCategoryVars | UpdateRescueVehicleCategoryVars
  ) => void;
}

export default function VehicleCategoryForm({
  isOpen,
  initialData,
  onClose,
  onSubmit,
}: Props) {
  // 1) form state
  const [name, setName] = useState('');
  const [debouncedName, setDebouncedName] = useState('');
  const [isNameValid, setIsNameValid] = useState<boolean | null>(null);

  // 2) lazy query for server‐side uniqueness check
  const [checkName, { data: existData, loading: validating }] = useLazyQuery<
    { isRescueVehicleCategoryExists: boolean },
    { category: string; excludeId?: number }
  >(IS_VEHICLE_CATEGORY_NAME_EXISTS, { fetchPolicy: 'no-cache' });

  // 3) initialize form when editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDebouncedName(initialData.name);
      setIsNameValid(null); // will re-validate
    } else {
      setName('');
      setDebouncedName('');
      setIsNameValid(null);
    }
  }, [initialData]);

  // 4) debounce the name input
  useEffect(() => {
    const h = setTimeout(() => {
      setDebouncedName(name.trim());
    }, 500);
    return () => clearTimeout(h);
  }, [name]);

  // 5) fire the uniqueness check
  useEffect(() => {
    if (!debouncedName) {
      setIsNameValid(null);
      return;
    }
    checkName({
      variables: {
        category: debouncedName,
        excludeId: initialData?.id ? parseInt(initialData.id, 10) : undefined,
      },
    });
  }, [debouncedName, initialData, checkName]);

  // 6) update validity once server responds
  useEffect(() => {
    if (existData?.isRescueVehicleCategoryExists === true) {
      setIsNameValid(false);
    } else if (existData?.isRescueVehicleCategoryExists === false) {
      setIsNameValid(true);
    }
  }, [existData]);

  // 7) submit handler
  const handleSubmit = () => {
    if (!name.trim() || isNameValid === false) return;
    const payload = initialData?.id
      ? { id: initialData.id, input: { name: name.trim() } }
      : { input: { name: name.trim() } };
    onSubmit(payload);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-sm space-y-4">
        <h2 className="text-xl text-center">
          {initialData ? 'Edit Vehicle Category' : 'New Vehicle Category'}
        </h2>

        <ValidatedInput
          label={
            isNameValid === false
              ? <span className="text-red-600">Category name already exists</span>
              : 'Category Name'
          }
          value={name}
          onChange={(e) => setName(e.target.value)}
          onDebouncedChange={(val) => setDebouncedName(val.trim())}
          isValid={isNameValid}
          LeftIcon={<Truck className="w-5 h-5 text-muted-foreground" />}
          required
        />

        <div className="flex justify-end space-x-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-full border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !name.trim() ||
              isNameValid === false ||
              validating
            }
            className="px-4 py-2 text-sm rounded-full bg-blue-600 text-white disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {initialData ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
