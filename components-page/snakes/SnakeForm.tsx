'use client';

import React, { useEffect, useState } from 'react';
import { Snake, SnakeInput, CreateSnakeVars, UpdateSnakeVars } from '@/graphql/types/snake';
import ValidatedInput from '@/components/ui/input/ValidatedInput';
import { X, ImagePlus, BookOpen, AlignLeft } from 'lucide-react';
import Image from 'next/image';
import ColoredSelect, { Option } from '@/components/ui/select/ColoredSelect';

interface SnakeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSnakeVars | UpdateSnakeVars) => void;
  initialData?: Snake;
}

const SnakeForm: React.FC<SnakeFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<SnakeInput>({
    name: '',
    scientificName: '',
    venomType: '',
    description: '',
  });
  const [image, setImage] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [imageRemoved, setImageRemoved] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        scientificName: initialData.scientificName,
        venomType: initialData.venomType,
        description: initialData.description,
      });

      if (initialData.imageUrl && !imageRemoved) {
        setPreviewUrl(
          `${process.env.NEXT_PUBLIC_SERVER_URL}${initialData.imageUrl}`
        );
      }
    } else {
      setFormData({
        name: '',
        scientificName: '',
        venomType: '',
        description: '',
      });
      setPreviewUrl(undefined);
      setImage(undefined);
      setImageRemoved(false);
    }
  }, [initialData, imageRemoved]);

  useEffect(() => {
    if (image) {
      setPreviewUrl(URL.createObjectURL(image));
      setImageRemoved(false);
    }
  }, [image]);

  const handleInputChange = (
    field: keyof SnakeInput,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.scientificName ||
      !formData.venomType ||
      !formData.description
    )
      return;

    if (initialData?.id) {
      const updateData: UpdateSnakeVars = {
        id: initialData.id,
        input: formData,
        image: imageRemoved ? undefined : image,
      };
      onSubmit(updateData);
    } else {
      const createData: CreateSnakeVars = {
        input: formData,
        image,
      };
      onSubmit(createData);
    }

    onClose();
  };

  const venomOptions: Option[] = [
    { label: 'Neurotoxic', value: 'neurotoxic', color: 'bg-blue-500' },
    { label: 'Hemotoxic', value: 'hemotoxic', color: 'bg-red-500' },
    { label: 'Cytotoxic', value: 'cytotoxic', color: 'bg-yellow-400 text-black' },
    { label: 'Non-Venomous', value: 'non-venomous', color: 'bg-green-500' },
];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl mb-2 text-center">
          {initialData ? 'Update Snake' : 'Create Snake'}
        </h2>

        {/* Image Preview */}
        <div className="flex flex-col items-center space-y-3">
          {previewUrl ? (
            <div className="relative w-60 h-24">
            <Image
                src={previewUrl}
                alt="Preview"
                fill
                unoptimized
                className="object-cover rounded-lg border border-gray-300 dark:border-gray-600"
            />
            <button
                type="button"
                onClick={() => {
                setPreviewUrl(undefined);
                setImage(undefined);
                setImageRemoved(true);
                }}
                className="absolute top-0 right-0 m-1 p-1 bg-gray-300 dark:bg-gray-700 rounded-full opacity-70 hover:opacity-100 transition cursor-pointer z-10"
            >
                <X className="w-4 h-4 text-gray-700 dark:text-white" />
            </button>
            </div>
        ) : (
            <label className="cursor-pointer w-full">
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
            />
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 w-full hover:border-blue-500">
                <ImagePlus className="w-8 h-8 text-gray-500 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-300">
                {initialData ? 'Change image' : 'Click to upload snake image'}
                </p>
            </div>
            </label>
        )}
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <ValidatedInput
            label="Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            LeftIcon={<BookOpen className="w-5 h-5 text-muted-foreground" />}
            required
          />
          <ValidatedInput
            label="Scientific Name"
            value={formData.scientificName}
            onChange={(e) => handleInputChange('scientificName', e.target.value)}
            LeftIcon={<BookOpen className="w-5 h-5 text-muted-foreground" />}
            required
          />
          <ColoredSelect
            label="Select Venom Type"
            value={formData.venomType}
            onChange={(val) => handleInputChange('venomType', val)}
            options={venomOptions}
            placeholder='Select venom type'
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

        {/* Buttons */}
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
              !formData.scientificName ||
              !formData.venomType ||
              !formData.description
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

export default SnakeForm;
