'use client';

import React, { useEffect, useState } from 'react';
import {
  EmergencyCategory,
  EmergencyCategoryCreateInput,
  CreateEmergencyCategoryVars,
  UpdateEmergencyCategoryVars,
} from '@/graphql/types/emergencyCategory';
import ValidatedInput from '@/components/ui/input/ValidatedInput';
import { AlignLeft, TriangleAlert } from 'lucide-react';
import IconInputPreview from '@/components/ui/input/IconInput';
import { useLazyQuery } from '@apollo/client';
import { CHECK_EMERGENCY_CATEGORY_EXIST } from '@/graphql/queries/emergencyCategoryQueries';

interface EmergencyCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEmergencyCategoryVars | UpdateEmergencyCategoryVars) => void;
  initialData?: EmergencyCategory;
}

const EmergencyCategoryForm: React.FC<EmergencyCategoryFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<EmergencyCategoryCreateInput>({
    name: '',
    description: '',
    icon: '',
  });

  const [isNameValid, setIsNameValid] = useState<boolean | null>(null);

  const [checkNameExist] = useLazyQuery(CHECK_EMERGENCY_CATEGORY_EXIST);

  // initialize form
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        icon: initialData.icon,
      });
      setIsNameValid(true);
    } else {
      setFormData({ name: '', description: '', icon: '' });
      setIsNameValid(null);
    }
  }, [initialData]);

  // handle name input change + trigger query
  const handleInputChange = (field: keyof EmergencyCategoryCreateInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === 'name' && value.length > 0) {
      checkNameExist({
        variables: {
          name: value,
          excludeId: initialData?.id ? parseInt(initialData.id, 10) : undefined,
        },
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
          setIsNameValid(!data?.emergencyCategoryExist);
        },
      });
    }

    if (field === 'name' && value.trim().length === 0) {
      setIsNameValid(null);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.description || !formData.icon || isNameValid === false) return;

    if (initialData?.id) {
      const updateData: UpdateEmergencyCategoryVars = {
        id: initialData.id,
        input: formData,
      };
      onSubmit(updateData);
    } else {
      const createData: CreateEmergencyCategoryVars = {
        input: formData,
      };
      onSubmit(createData);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl mb-2 text-center">
          {initialData ? 'Update Emergency Category' : 'Create Emergency Category'}
        </h2>

        <div className="space-y-4">
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
          <IconInputPreview
            label="Icon (Iconify name)"
            value={formData.icon}
            onChange={(e) => handleInputChange('icon', e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-full border border-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !formData.name ||
              !formData.description ||
              !formData.icon ||
              isNameValid === false
            }
            className="px-4 py-2 text-sm rounded-full bg-blue-600 text-white hover:bg-blue-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed cursor-pointer"
          >
            {initialData ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCategoryForm;
