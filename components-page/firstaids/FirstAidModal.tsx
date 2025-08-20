'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { X, ImagePlus, AlignLeft } from 'lucide-react';
import { gql, useQuery } from '@apollo/client';
import ValidatedInput from '@/components/ui/input/ValidatedInput';
import ColoredSelect, { Option } from '@/components/ui/select/ColoredSelect';
import { CreateFirstAidDetailVars, UpdateFirstAidDetailVars } from '@/graphql/types/firstAidDetail';
import { FirstAidDetail } from '@/graphql/types/firstAidDetail';

export type FirstAidDetailInput = { point: string };

const GET_EMERGENCY_SUBCATEGORY_WITHOUT_FIRST_AID = gql`
  query GetEmergencySubCategoryWithoutFirstAid {
    emergencySubCategoryWithoutFirstAid {
      id
      name
    }
  }
`;

interface FirstAidDetailFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFirstAidDetailVars | UpdateFirstAidDetailVars) => void;
  initialData?: FirstAidDetail;
  defaultDisplayOrder?: number; // ⬅️ used when adding next step from gallery
  emergencySubCategoryId?: string; // if provided, we’re adding inside a group (no dropdown)
}

const FirstAidDetailForm: React.FC<FirstAidDetailFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  emergencySubCategoryId,
  defaultDisplayOrder,
}) => {
  const [formData, setFormData] = useState<FirstAidDetailInput>({ point: '' });
  const [image, setImage] = useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [imageRemoved, setImageRemoved] = useState(false);

  const showCategorySelect = !initialData?.id && !emergencySubCategoryId;

  const BASE_URL = (process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/+$/, '');
  const resolveImageUrl = (url?: string): string | undefined => {
    if (!url) return undefined;
    if (/^(?:https?:)?\/\//i.test(url) || url.startsWith('data:')) return url;
    if (!BASE_URL) return url;
    return url.startsWith('/') ? `${BASE_URL}${url}` : `${BASE_URL}/${url}`;
  };

  const { data: noAidData, loading: loadingSubs } = useQuery(
    GET_EMERGENCY_SUBCATEGORY_WITHOUT_FIRST_AID,
    { skip: !showCategorySelect }
  );

  const subOptions: Option[] = useMemo(() => {
    const list: Array<{ id: string | number; name: string }> =
      noAidData?.emergencySubCategoryWithoutFirstAid ?? [];
    return list.map((s) => ({
      label: s.name,
      value: String(s.id),
      color: 'bg-gray-500',
    }));
  }, [noAidData]);

  const [selectedSubId, setSelectedSubId] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setFormData({ point: initialData.point || '' });
      if (initialData.imageUrl && !imageRemoved) {
        setPreviewUrl(resolveImageUrl(initialData.imageUrl));
      }
    } else {
      setFormData({ point: '' });
      setPreviewUrl(undefined);
      setImage(undefined);
      setImageRemoved(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, imageRemoved]);

  useEffect(() => {
    if (image) {
      setPreviewUrl(URL.createObjectURL(image));
      setImageRemoved(false);
    }
  }, [image]);

  const handleInputChange = (value: string) => {
    setFormData((prev) => ({ ...prev, point: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImage(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (!formData.point) return;

    if (initialData?.id) {
      const payload: UpdateFirstAidDetailVars = {
        id: initialData.id,
        firstAidDetail: { point: formData.point }, // ⬅️ update shape
        image: imageRemoved ? undefined : image,
      };
      onSubmit(payload);
    } else {
      const targetSubId = emergencySubCategoryId ?? selectedSubId;
      if (!targetSubId) return;

      const displayOrder =
        typeof defaultDisplayOrder === 'number' ? defaultDisplayOrder : 1;

      const payload: CreateFirstAidDetailVars = {
        firstAidDetail: {
          point: formData.point,
          emergencySubCategoryId: Number(targetSubId), // ⬅️ backend expects number
          displayOrder,                                // ⬅️ include next order
        },
        image,
      };
      onSubmit(payload);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl mb-2 text-center">
          {initialData ? 'Update First Aid Step' : 'Create First Aid Step'}
        </h2>

        {showCategorySelect && (
          <div className="space-y-2">
            <ColoredSelect
              label="Emergency Subcategory"
              value={selectedSubId}
              onChange={setSelectedSubId}
              options={subOptions}
              placeholder={loadingSubs ? 'Loading…' : 'Choose subcategory'}
            />
            <p className="text-xs text-gray-500">
              Only subcategories without any first-aid steps are listed here.
            </p>
          </div>
        )}

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
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 w-full hover:border-blue-500">
                <ImagePlus className="w-8 h-8 text-gray-500 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {initialData ? 'Change image' : 'Click to upload first-aid image'}
                </p>
              </div>
            </label>
          )}
        </div>

        <div className="space-y-4">
          <ValidatedInput
            label="Point / Instruction"
            value={formData.point}
            onChange={(e) => handleInputChange(e.target.value)}
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
            disabled={
              !formData.point ||
              (!initialData?.id && !(emergencySubCategoryId || selectedSubId))
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

export default FirstAidDetailForm;
