'use client';

import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import ValidatedInput from '@/components/ui/input/ValidatedInput';
import { AlignLeft, User } from 'lucide-react';
import {
  CivilianStatus,
  CreateCivilianStatusVars,
  UpdateCivilianStatusVars,
} from '@/graphql/types/civilianStatus';
import { IS_CIVILIAN_STATUS_EXISTS } from '@/graphql/queries/civilianStatusQueries';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateCivilianStatusVars | UpdateCivilianStatusVars
  ) => void;
  initialData?: CivilianStatus;
}

export default function CivilianStatusForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const [formData, setFormData] = useState({ role: '', description: '' });
  const [debouncedRole, setDebouncedRole] = useState('');
  const [isRoleValid, setIsRoleValid] = useState<boolean | null>(null);

  // 1) setup lazy validation query
  const [checkRole, { data: existData, loading: validating }] = useLazyQuery<
    { isCivilianStatusRoleExists: boolean },
    { role: string; excludeId?: number }
  >(IS_CIVILIAN_STATUS_EXISTS, {
    fetchPolicy: 'no-cache',
  });

  // 2) debounce the role input
  useEffect(() => {
    const h = setTimeout(() => {
      setDebouncedRole(formData.role.trim());
    }, 500);
    return () => clearTimeout(h);
  }, [formData.role]);

  // 3) fire validation when debouncedRole changes
  useEffect(() => {
    if (!debouncedRole) {
      setIsRoleValid(null); // untouched or empty
      return;
    }
    checkRole({
      variables: {
        role: debouncedRole,
        excludeId: initialData?.id ? parseInt(initialData.id, 10) : undefined,
      },
    });
  }, [debouncedRole, initialData, checkRole]);

  // 4) update validity based on server response
  useEffect(() => {
    if (existData?.isCivilianStatusRoleExists === true) {
      setIsRoleValid(false);
    } else if (existData?.isCivilianStatusRoleExists === false) {
      setIsRoleValid(true);
    }
  }, [existData]);

  // initialize form when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        role: initialData.role,
        description: initialData.description,
      });
      setDebouncedRole(initialData.role);
    } else {
      setFormData({ role: '', description: '' });
      setIsRoleValid(null);
    }
  }, [initialData]);

  const handleChange = (field: 'role' | 'description', value: string) => {
    setFormData((p) => ({ ...p, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.role || !formData.description) return;
    const payload = initialData?.id
      ? { id: initialData.id, input: formData }
      : { input: formData };
    onSubmit(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl text-center">
          {initialData ? 'Update Status' : 'Create Status'}
        </h2>

        <ValidatedInput
          label="Role"
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
          onDebouncedChange={(val) => setDebouncedRole(val)}
          isValid={isRoleValid}
          LeftIcon={<User className="w-5 h-5 text-muted-foreground" />}
          required
        />
        {/* {isRoleValid === false && (
          <p className="text-sm text-red-600">This role is already taken.</p>
        )} */}

        <ValidatedInput
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          LeftIcon={<AlignLeft className="w-5 h-5 text-muted-foreground" />}
          textarea
          required
        />

        <div className="flex justify-end space-x-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-full border border-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !formData.role ||
              !formData.description ||
              isRoleValid === false ||
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
