'use client';

import React, { useEffect, useState } from 'react';
import {
  EmergencySubCategory,
  CreateEmergencySubCategoryVars,
  UpdateEmergencySubCategoryVars,
} from '@/graphql/types/emergencySubCategory';
import ValidatedInput from '@/components/ui/input/ValidatedInput';
import { AlignLeft, TriangleAlert } from 'lucide-react';

interface EmergencySubCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateEmergencySubCategoryVars | UpdateEmergencySubCategoryVars
  ) => void;
  initialData?: EmergencySubCategory;
  emergencyCategoryId: string;
}

const EmergencySubCategoryForm: React.FC<EmergencySubCategoryFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  emergencyCategoryId,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
      });
    } else {
      setFormData({ name: '', description: '' });
    }
  }, [initialData]);

  const handleInputChange = (field: 'name' | 'description', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.description) return;

    if (initialData?.id) {
      const updateData: UpdateEmergencySubCategoryVars = {
        id: initialData.id,
        input: {
          name: formData.name,
          description: formData.description,
        },
      };
      onSubmit(updateData);
    } else {
      const createData: CreateEmergencySubCategoryVars = {
        input: {
          name: formData.name,
          description: formData.description,
          emergencyCategoryId: parseInt(emergencyCategoryId, 10),
        },
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
          {initialData ? 'Update Subcategory' : 'Create Subcategory'}
        </h2>

        <div className="space-y-4">
          <ValidatedInput
            label="Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
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
            disabled={!formData.name || !formData.description}
            className="px-4 py-2 text-sm rounded-full bg-blue-600 text-white hover:bg-blue-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed cursor-pointer"
          >
            {initialData ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencySubCategoryForm;
