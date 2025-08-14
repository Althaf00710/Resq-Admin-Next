// components-page/vehicles/VehicleForm.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';

import ValidatedInput from '@/components/ui/input/ValidatedInput';
import ColoredSelect, { Option } from '@/components/ui/select/ColoredSelect';
import { GET_RESCUE_VEHICLE_CATEGORIES } from '@/graphql/queries/rescueVehicleCategoryQueries';
import { CHECK_PLATE_NUMBER_EXIST }      from '@/graphql/queries/rescueVehicleQueries';

import type { RescueVehicleCategory } from '@/graphql/types/rescueVehicleCategory';
import type {
  Vehicle,
  CreateRescueVehicleVars,
  UpdateRescueVehicleVars,
} from '@/graphql/types/rescueVehicle';

// Sri Lanka plate: 2–3 uppercase letters, hyphen, 4 digits
const SL_PLATE_REGEX = /^[A-Z]{2,3}-\d{4}$/;

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
  // ─── form state ────────────────────────────────────────────────────────────────
  const [plateNumber, setPlateNumber]       = useState('');
  const [debouncedPlate, setDebouncedPlate] = useState('');
  const [isPlateValid, setIsPlateValid]     = useState<boolean|null>(null);

  const [password, setPassword]     = useState('');
  const [categoryId, setCategoryId] = useState<string>('');

  // ─── load categories ────────────────────────────────────────────────────────────
  const { data: catData, loading: loadingCats } = useQuery<{
    rescueVehicleCategories: RescueVehicleCategory[];
  }>(GET_RESCUE_VEHICLE_CATEGORIES);

  // ─── plate‐existence check ──────────────────────────────────────────────────────
  const [checkPlate, { data: existData, loading: validatingPlate }] =
    useLazyQuery(CHECK_PLATE_NUMBER_EXIST, { fetchPolicy: 'no-cache' });

  // ─── initialize on open/edit ────────────────────────────────────────────────────
  useEffect(() => {
    if (initialData) {
      setPlateNumber(initialData.plateNumber);
      setDebouncedPlate(initialData.plateNumber);
      setIsPlateValid(null);
      setPassword('');
      setCategoryId(initialData.rescueVehicleCategory.id);
    } else {
      setPlateNumber('');
      setDebouncedPlate('');
      setIsPlateValid(null);
      setPassword('');
      setCategoryId('');
    }
  }, [initialData, isOpen]);

  // ─── debounce plate input ───────────────────────────────────────────────────────
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedPlate(plateNumber.trim());
    }, 500);
    return () => clearTimeout(handle);
  }, [plateNumber]);

  // ─── fire server check on debouncedPlate ───────────────────────────────────────
  useEffect(() => {
    if (!debouncedPlate) {
      setIsPlateValid(null);
      return;
    }
    checkPlate({
      variables: {
        numberPlate: debouncedPlate,
        excludeId: initialData ? parseInt(initialData.id, 10) : undefined,
      },
    });
  }, [debouncedPlate, initialData, checkPlate]);

  // ─── update isPlateValid from API ──────────────────────────────────────────────
  useEffect(() => {
    if (existData?.checkPlateNumberExist === true) {
      setIsPlateValid(false);
    } else if (existData?.checkPlateNumberExist === false) {
      setIsPlateValid(true);
    }
  }, [existData]);

  // ─── regex format check & overall validity ─────────────────────────────────────
  const isFormatValid = SL_PLATE_REGEX.test(debouncedPlate);

  const plateValidity: boolean | null =
    debouncedPlate === ''
      ? null               // no input yet
      : !isFormatValid
        ? false           // format invalid
        : isPlateValid === null
          ? null         // waiting on server
          : isPlateValid; // server uniqueness result

  const plateLabel =
    debouncedPlate === ''
      ? 'Plate Number'
      : !isFormatValid
        ? <span className="text-red-600">Incorrect Format (e.g. CAA-1234)</span>
        : isPlateValid === false
          ? <span className="text-red-600">Plate number already exists</span>
          : 'Plate Number';

  // ─── category options ──────────────────────────────────────────────────────────
  const categoryOptions: Option[] =
    catData?.rescueVehicleCategories.map(c => ({
      value: c.id,
      label: c.name,
      color: 'bg-blue-100 text-white',
    })) ?? [];

  // ─── submit handler ─────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (
      !debouncedPlate ||
      !categoryId ||
      (initialData == null && !password.trim()) ||
      plateValidity === false
    ) return;

    if (initialData?.id) {
      const vars: UpdateRescueVehicleVars = {
        id: initialData.id,
        input: {
          plateNumber: debouncedPlate,
          ...(password.trim() ? { password: password.trim() } : {}),
          status: initialData.status,
        },
      };
      onSubmit(vars);
    } else {
      const vars: CreateRescueVehicleVars = {
        input: {
          plateNumber: debouncedPlate,
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
      <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4">
        <h2 className="text-xl text-center">
          {initialData ? 'Edit Vehicle' : 'New Vehicle'}
        </h2>

        <ValidatedInput
          label={plateLabel}
          value={plateNumber}
          onChange={e => setPlateNumber(e.target.value.toUpperCase())}
          onDebouncedChange={() => {}}
          isValid={plateValidity}
          required
        />

        <ColoredSelect
          label="Vehicle Category"
          value={categoryId}
          options={categoryOptions}
          onChange={setCategoryId}
          placeholder={loadingCats ? 'Loading…' : 'Select category'}
        />

        <ValidatedInput
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required={!initialData}
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
              !debouncedPlate ||
              !categoryId ||
              (initialData == null && !password.trim()) ||
              plateValidity === false ||
              validatingPlate
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
