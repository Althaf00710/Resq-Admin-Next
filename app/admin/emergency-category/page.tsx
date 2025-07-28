'use client';

import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';

import { GET_ALL_EMERGENCY_CATEGORIES } from '@/graphql/queries/emergencyCategoryQueries';
import { GET_SUBCATEGORIES_BY_CATEGORY } from '@/graphql/queries/emergencySubCategoryQueries';
import { CREATE_EMERGENCY_CATEGORY, UPDATE_EMERGENCY_CATEGORY, DELETE_EMERGENCY_CATEGORY } from '@/graphql/mutations/emergencyCategoryMutations';

import EmergencyCategoryTable from '@/components-page/emergency-category/EmergencyCategoryTable';
import EmergencyCategoryForm from '@/components-page/emergency-category/EmergencyCategoryForm';
import AddButton from '@/components/ui/button/AddButton';

import EmergencySubCategoryForm from '@/components-page/emergency-category/subcategory/EmergencySubCategoryForm';
import { CREATE_EMERGENCY_SUBCATEGORY, UPDATE_EMERGENCY_SUBCATEGORY, DELETE_EMERGENCY_SUBCATEGORY } from '@/graphql/mutations/emergencySubCategoryMutations';

import { EmergencyCategory, CreateEmergencyCategoryVars, UpdateEmergencyCategoryVars } from '@/graphql/types/emergencyCategory';
import { EmergencySubCategory, CreateEmergencySubCategoryVars, UpdateEmergencySubCategoryVars } from '@/graphql/types/emergencySubCategory';
import client from '@/lib/apolloClient';

export default function Page() {
  const { data, refetch } = useQuery(GET_ALL_EMERGENCY_CATEGORIES);
  const categories: EmergencyCategory[] = data?.emergencyCategories || [];

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<EmergencyCategory | null>(null);
  const [subcategories, setSubcategories] = useState<Record<string, EmergencySubCategory[]>>({});


  const [createCategory] = useMutation(CREATE_EMERGENCY_CATEGORY);
  const [updateCategory] = useMutation(UPDATE_EMERGENCY_CATEGORY);
  const [deleteCategory] = useMutation(DELETE_EMERGENCY_CATEGORY);

  const [createSubCategory] = useMutation(CREATE_EMERGENCY_SUBCATEGORY);
  const [updateSubCategory] = useMutation(UPDATE_EMERGENCY_SUBCATEGORY);
  const [deleteSubCategory] = useMutation(DELETE_EMERGENCY_SUBCATEGORY);

  const [isSubFormOpen, setSubFormOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<EmergencySubCategory | null>(null);

  const handleAddSubcategory = (categoryId: string) => {
    setSelectedCategoryId(parseInt(categoryId, 10));
    setSubFormOpen(true);
  };

  const handleSubcategoryEdit = (subcategory: EmergencySubCategory) => {
    setSelectedCategoryId(parseInt(subcategory.emergencyCategoryId));
    setEditingSubCategory(subcategory);
    setSubFormOpen(true);
  };

  const handleSubcategoryDelete = async (id: string) => {
    await deleteSubCategory({
      variables: { id: parseInt(id, 10) },
      refetchQueries: [
        {
          query: GET_SUBCATEGORIES_BY_CATEGORY,
          variables: { categoryId: selectedCategoryId },
        },
      ],
    });
    if (selectedCategoryId) {
      await handleFetchSubcategories(String(selectedCategoryId));
    }
  };

  const handleSubFormSubmit = async (
    data: CreateEmergencySubCategoryVars | UpdateEmergencySubCategoryVars
  ) => {
    if ('id' in data) {
      await updateSubCategory({
        variables: {
          id: parseInt(data.id, 10),
          input: data.input,
          image: null, // handle image later if needed
        },
      });
    } else {
      await createSubCategory({
        variables: {
          input: data.input,
          image: null, // handle image later if needed
        },
      });
    }

    if (selectedCategoryId) {
      await handleFetchSubcategories(String(selectedCategoryId));
    }
    setSubFormOpen(false);
    setEditingSubCategory(null);
  };

  const handleFetchSubcategories = async (categoryId: string): Promise<EmergencySubCategory[]> => {
    const { data } = await client.query({
      query: GET_SUBCATEGORIES_BY_CATEGORY,
      variables: { categoryId: parseInt(categoryId, 10) },
      fetchPolicy: 'network-only',
    });

    const list = data?.subCategoriesByCategoryId || [];

    setSubcategories(prev => ({
      ...prev,
      [categoryId]: list,
    }));

    return list;
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: EmergencyCategory) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteCategory({ variables: { id: parseInt(id, 10) } });
    await refetch();
  };

  const handleFormSubmit = async (data: CreateEmergencyCategoryVars | UpdateEmergencyCategoryVars) => {
    if ('id' in data) {
      await updateCategory({ 
        variables: {
          id: parseInt(data.id, 10),
          input: data.input,
        }
      });
    } else {
      await createCategory({ variables: data });
    }

    await refetch();
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Emergency Categories</h1>
        <AddButton onClick={handleAdd} />
      </div>

      <EmergencyCategoryTable
        categories={categories}
        onExpand={handleFetchSubcategories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddSubcategory={handleAddSubcategory}
        onEditSubcategory={handleSubcategoryEdit}
        onDeleteSubcategory={handleSubcategoryDelete}
        subcategories={subcategories}
        setSubcategories={setSubcategories}
      />

      <EmergencyCategoryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingCategory || undefined}
      />

      <EmergencySubCategoryForm
        isOpen={isSubFormOpen}
        onClose={() => {
          setSubFormOpen(false);
          setEditingSubCategory(null);
        }}
        onSubmit={handleSubFormSubmit}
        initialData={editingSubCategory || undefined}
        emergencyCategoryId={selectedCategoryId?.toString() || ''}
      />

    </div>
  );
}
