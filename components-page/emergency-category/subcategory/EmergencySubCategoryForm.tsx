'use client';

import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import {
  EmergencySubCategory,
  CreateEmergencySubCategoryVars,
  UpdateEmergencySubCategoryVars,
} from '@/graphql/types/emergencySubCategory';
import ValidatedInput from '@/components/ui/input/ValidatedInput';
import { TriangleAlert, AlignLeft } from 'lucide-react';
import { VALIDATE_SUBCATEGORY } from '@/graphql/queries/emergencySubCategoryQueries';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateEmergencySubCategoryVars | UpdateEmergencySubCategoryVars
  ) => void;
  initialData?: EmergencySubCategory;
  emergencyCategoryId: string;
}

export default function EmergencySubCategoryForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  emergencyCategoryId,
}: Props) {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [debouncedName, setDebouncedName] = useState('');
  const [isNameValid, setIsNameValid] = useState<boolean | null>(null);

  const [validateName, { data: validationData, loading: validating }] =
    useLazyQuery<
      { emergencySubCategoryValidate: boolean },
      { name: string; categoryId: number; excludeId?: number }
    >(VALIDATE_SUBCATEGORY, { fetchPolicy: 'no-cache' });

  // 1) Manual debounce of formData.name → debouncedName
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedName(formData.name.trim());
      console.log('🔁 debouncedName set to:', formData.name.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [formData.name]);

  // 2) Fire validation whenever debouncedName changes
  useEffect(() => {
    if (!debouncedName) {
      console.log('❌ Name is empty after debounce, resetting validity');
      setIsNameValid(null);
      return;
    }

    console.log('⏳ validating name:', debouncedName);
    validateName({
      variables: {
        name: debouncedName,
        categoryId: Number(emergencyCategoryId),
        excludeId: initialData?.id ? Number(initialData.id) : undefined,
      },
    });
  }, [debouncedName, emergencyCategoryId, initialData, validateName]);

  // 3) Watch the server response
  useEffect(() => {
    console.log('✅ validationData:', validationData, 'loading:', validating);
    if (validationData?.emergencySubCategoryValidate === false) {
      setIsNameValid(true);
    } else if (validationData?.emergencySubCategoryValidate === true) {
      setIsNameValid(false);
    }
  }, [validationData, validating]);

  // Sync initialData into form & reset validity
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
      });
      setDebouncedName(initialData.name);
    } else {
      setFormData({ name: '', description: '' });
      setIsNameValid(null);
    }
  }, [initialData]);

  const handleInputChange = (field: 'name' | 'description', val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.description) return;
    const payload = initialData?.id
      ? { id: initialData.id, input: { ...formData } }
      : {
          input: {
            ...formData,
            emergencyCategoryId: Number(emergencyCategoryId),
          },
        };
    onSubmit(payload);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl text-center">
          {initialData ? 'Update Subcategory' : 'Create Subcategory'}
        </h2>

        <ValidatedInput
          label="Name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          isValid={isNameValid}
          LeftIcon={<TriangleAlert className="w-5 h-5 text-muted-foreground" />}
          required
        />

        <ValidatedInput
          label="Description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
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
              !formData.name ||
              !formData.description ||
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
